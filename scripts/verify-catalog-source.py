"""Verify the approved catalog's slide-to-asset relationships without external downloads."""
import argparse
import hashlib
import json
import posixpath
from pathlib import Path
import xml.etree.ElementTree as ET
import zipfile

parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path, required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
expected = '3f32a9b1407d96dd74794fc238259775e87de2200c1ee39299354edc82132ff8'
assert hashlib.sha256(args.source.read_bytes()).hexdigest() == expected, 'Wrong source PPTX'
records = json.loads((root / 'docs/catalog-plan-sources.json').read_text(encoding='utf-8'))
ns = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
assert len(records) == 31
verified = 0
with zipfile.ZipFile(args.source) as archive:
    for record in records:
        items = [(record['model_slide'], record['model_asset'], record['model_source_sha256'])]
        if record['plan']:
            items.append((record['slide'], record['asset'], record['source_image_sha256']))
        for slide, asset, digest in items:
            tree = ET.fromstring(archive.read(f'ppt/slides/slide{slide}.xml'))
            relationships = ET.fromstring(archive.read(f'ppt/slides/_rels/slide{slide}.xml.rels'))
            targets = {item.attrib['Id']: item.attrib['Target'] for item in relationships}
            pictures = tree.findall('.//p:pic', ns)
            assert len(pictures) == 1, f'{record["id"]}: ambiguous source picture'
            relation = pictures[0].find('.//a:blip', ns).attrib['{' + ns['r'] + '}embed']
            media = posixpath.normpath(posixpath.join('ppt/slides', targets[relation])).lstrip('/')
            assert hashlib.sha256(archive.read(media)).hexdigest() == digest, f'{record["id"]}: wrong slide image'
            assert hashlib.sha256((root / 'public' / asset).read_bytes()).hexdigest() == digest, f'{record["id"]}: modified asset'
            if slide == record['model_slide']:
                texts = [item.text for item in tree.findall('.//a:t', ns)]
                assert record['name'] in texts and record['article'] in texts, f'{record["id"]}: wrong source title'
            verified += 1
assert verified == 59
print(json.dumps({'models': 31, 'plans': 28, 'slide_images_verified': verified, 'status': 'PASS'}))
