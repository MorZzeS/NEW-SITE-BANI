"""Compare exported article text and metadata directly with the approved DOCX."""
import argparse
import hashlib
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from docx import Document
from docx.text.paragraph import Paragraph
from docx.table import Table


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.body = []
        self.h1 = []
        self.title = []
        self.active = False
        self.heading = False
        self.titling = False
        self.meta = {}
        self.canonical = None
        self.images = 0
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'article' and 'article-body' in a.get('class', ''):
            self.active = True
        if tag == 'h1':
            self.heading = True
        if tag == 'title':
            self.titling = True
        if tag == 'meta':
            self.meta[a.get('name', a.get('property'))] = a.get('content')
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canonical = a.get('href')
        if tag == 'img':
            self.images += 1
        if self.active and tag in ['p', 'h2', 'h3', 'li']:
            self.body.append('\n')

    def handle_endtag(self, tag):
        if tag == 'article':
            self.active = False
        if tag == 'h1':
            self.heading = False
        if tag == 'title':
            self.titling = False

    def handle_data(self, text):
        if self.active:
            self.body.append(text)
        if self.heading:
            self.h1.append(text)
        if self.titling:
            self.title.append(text)


def normalized(text):
    return re.sub(r'\s+', ' ', text).strip()


parser = argparse.ArgumentParser()
parser.add_argument('--source', required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
source = Path(args.source)
doc = Document(source)
articles = []
current = None
photo = False
for el in doc.element.body:
    if el.tag.endswith('}p'):
        p = Paragraph(el, doc)
        if re.fullmatch(r'СТАТЬЯ \d{2}', p.text):
            current = {'blocks': []}
            articles.append(current)
            photo = False
            continue
        if current is None or not p.text:
            continue
        if p.style.name == 'Heading 1':
            if 'title' not in current:
                current['title'] = p.text
            else:
                current = None
            continue
        if p.text == 'Что показать на странице':
            photo = True
            continue
        if photo and p.style.name != 'Heading 3':
            current['photoBrief'] = p.text
            photo = False
            continue
        current['blocks'].append(p.text)
    elif el.tag.endswith('}tbl') and current:
        current.update({r.cells[0].text: r.cells[1].text for r in Table(el, doc).rows})

assert len(articles) == 20
manifest = json.loads((root / 'docs/articles-word-source.json').read_text(encoding='utf-8'))
assert manifest['sha256'] == hashlib.sha256(source.read_bytes()).hexdigest()
sitemap = (root / 'dist/sitemap.xml').read_text(encoding='utf-8')
listing = (root / 'dist/poleznoe.html').read_text(encoding='utf-8')
for a in articles:
    slug = a['URL'].strip('/').split('/')[-1]
    html = (root / f'dist/poleznoe/{slug}.html').read_text(encoding='utf-8')
    page = Page(html)
    assert ''.join(page.h1) == a['title'], slug + ': H1'
    assert ''.join(page.title) == a['title'], slug + ': SEO title'
    assert page.meta['description'] == a['Meta description'], slug + ': description'
    assert page.canonical == 'https://banger.su' + a['URL'], slug + ': canonical'
    assert normalized(''.join(page.body)) == normalized(' '.join(a['blocks'][1:])), slug + ': body'
    assert a['blocks'][0] in html, slug + ': lead'
    assert a['photoBrief'] in html, slug + ': photo brief'
    assert page.images == 0, slug + ': unexpected image'
    assert 'https://banger.su' + a['URL'] in sitemap, slug + ': sitemap'
    assert '/poleznoe/' + slug + '/' in listing, slug + ': listing'
print('PASS: 20/20 approved Word articles; exact body, H1/title, description, canonical, sitemap, photo briefs; no images.')
