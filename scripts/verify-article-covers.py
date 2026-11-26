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


manifest = json.loads((root / 'docs/editorial-assets/2026-11-26/article-assets-manifest.json').read_text(encoding='utf-8'))
source_articles = json.loads((root / 'docs/editorial-assets/2026-11-26/articles.json').read_text(encoding='utf-8'))
provided = {article['slug']: article for article in manifest['articles']}
articles = {article['slug']: article for article in source_articles}
generated = manifest['productionIllustration']
listing = Page((dist_dir / 'poleznoe.html').read_text(encoding='utf-8'))
assert len(listing.images) == len(articles) == 28
for slug, article in articles.items():
    cover = generated if slug == generated['slug'] else provided[slug]
    output = root / cover['target']
    expected_hash = cover['sha256'].lower()
    assert hashlib.sha256(output.read_bytes()).hexdigest() == expected_hash, slug
    page = Page((dist_dir / f'poleznoe/{slug}.html').read_text(encoding='utf-8'))
    image_path = '/' + cover['target'].removeprefix('public/')
    alt = generated['alt'] if slug == generated['slug'] else article['alt']
    assert any(image['src'] == image_path and image['alt'] == alt for image in listing.images), slug
    assert page.meta['og:image'] == page.meta['twitter:image'] == 'https://banger.su' + image_path, slug
    assert page.meta['twitter:card'] == 'summary_large_image', slug
    assert page.meta['og:image:width'] == str(cover['width']) and page.meta['og:image:height'] == str(cover['height']), slug
print(f'PASS: {len(articles)}/{len(articles)} current package covers, listing, OG/Twitter metadata and image hashes.')
