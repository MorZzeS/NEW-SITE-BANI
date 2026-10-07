"""Verify approved cover provenance and exported social metadata."""
import hashlib
import json
from pathlib import Path
from html.parser import HTMLParser

root = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.meta = {}
        self.images = []
        self.main = False
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'main':
            self.main = True
        if tag == 'meta':
            self.meta[attrs.get('property', attrs.get('name', ''))] = attrs.get('content', '')
        if tag == 'img' and self.main:
            self.images.append(attrs)

    def handle_endtag(self, tag):
        if tag == 'main':
            self.main = False


manifest = json.loads((root / 'docs/article-covers-source.json').read_text(encoding='utf-8'))
assert hashlib.sha256(Path(manifest['source']).read_bytes()).hexdigest() == manifest['source_sha256']
listing = Page((root / 'dist/poleznoe.html').read_text(encoding='utf-8'))
assert len(listing.images) == len(manifest['covers']) == 21
for cover in manifest['covers']:
    slug = cover['slug']
    assert hashlib.sha256((root / cover['output']).read_bytes()).hexdigest() == cover['output_sha256'], slug
    page = Page((root / f'dist/poleznoe/{slug}.html').read_text(encoding='utf-8'))
    path = f'/images/articles/{slug}-cover.webp'
    assert any(image['src'].endswith(path) and image['alt'] == cover['alt'] for image in listing.images), slug
    assert page.meta['og:image'] == page.meta['twitter:image'] == 'https://banger.su' + path, slug
    assert page.meta['twitter:card'] == 'summary_large_image', slug
    assert page.meta['og:image:width'] == str(cover['width']) and page.meta['og:image:height'] == str(cover['height']), slug
visuals = json.loads((root / 'docs/article-visual-sources.json').read_text(encoding='utf-8'))
for visual in visuals['visuals']:
    assert hashlib.sha256(Path(visual['source']).read_bytes()).hexdigest() == visual['source_sha256']
    for output in visual['outputs']:
        assert hashlib.sha256((root / output['file']).read_bytes()).hexdigest() == output['sha256']
print('PASS: 21/21 approved covers, listing, OG/Twitter; source files unchanged.')
