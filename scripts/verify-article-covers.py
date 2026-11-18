"""Verify approved cover provenance and exported social metadata."""
import hashlib
import json
from pathlib import Path
from html.parser import HTMLParser

root = Path(__file__).resolve().parents[1]
dist_dir = root / ('dist-pages' if __import__('os').environ.get('BANGER_GITHUB_PAGES') == 'true' else 'dist')


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
unavailable_sources = []
def verify_source(source, expected_hash, label):
    source_path = Path(source)
    if source_path.is_file():
        assert hashlib.sha256(source_path.read_bytes()).hexdigest() == expected_hash, label
        return
    unavailable_sources.append(label)

verify_source(manifest['source'], manifest['source_sha256'], 'cover-source document')
listing = Page((dist_dir / 'poleznoe.html').read_text(encoding='utf-8'))
assert len(listing.images) == len(manifest['covers']) == 28
for cover in manifest['covers']:
    slug = cover['slug']
    verify_source(cover['source'], cover['source_sha256'], slug)
    assert hashlib.sha256((root / cover['output']).read_bytes()).hexdigest() == cover['output_sha256'], slug
    page = Page((dist_dir / f'poleznoe/{slug}.html').read_text(encoding='utf-8'))
    path = f'/images/articles/{slug}-cover.webp'
    assert any(image['src'].endswith(path) and image['alt'] == cover['alt'] for image in listing.images), slug
    assert page.meta['og:image'] == page.meta['twitter:image'] == 'https://banger.su' + path, slug
    assert page.meta['twitter:card'] == 'summary_large_image', slug
    assert page.meta['og:image:width'] == str(cover['width']) and page.meta['og:image:height'] == str(cover['height']), slug
visuals = json.loads((root / 'docs/article-visual-sources.json').read_text(encoding='utf-8'))
for visual in visuals['visuals']:
    verify_source(visual['source'], visual['source_sha256'], visual['slug'])
    for output in visual['outputs']:
        assert hashlib.sha256((root / output['file']).read_bytes()).hexdigest() == output['sha256']
print(f'PASS: {len(manifest["covers"])}/{len(manifest["covers"])} covers, listing, OG/Twitter and output hashes; {len(unavailable_sources)} archived source files unavailable for rehash.')
