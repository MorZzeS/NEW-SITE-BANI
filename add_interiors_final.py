#!/usr/bin/env python3
import re
path = r"C:\Users\maxto\Desktop\НОВЫЙ САЙТ\banger-site\NEW SITE BANI\src\data\index.ts"
content = open(path, 'r', encoding='utf-8').read()
interiors = [
    '/NEW-SITE-BANI/images/interiors/parnaya-2-.jpg',
    '/NEW-SITE-BANI/images/interiors/vizual-gostinnaya-1.jpg',
    '/NEW-SITE-BANI/images/interiors/pomiv-2.jpg',
    '/NEW-SITE-BANI/images/interiors/parnaya-4-.jpg',
    '/NEW-SITE-BANI/images/interiors/vizual-gostinnaya-3.jpg',
]
models = [
    'istok-4', 'istok-6', 'istok-semeynyy-7', 'skandinaviya-komfort-6',
    'sever-panorama-8', 'usadba-terra-7', 'barn-premium', 'usadba-uyt-5',
    'usadba-semejnaya-6', 'usadba-praktik', 'istok-8', 'istok-terra-5',
    'skandinaviya-mini-45', 'sever-rezidents-7',
]
for slug in models:
    # Find the exact slug line
    marker = f"slug: '{slug}'"
    if marker not in content:
        continue
    # Only insert if not already present
    snippet_after = content.split(marker, 1)[1][:300]
    if 'interiorImages' in snippet_after:
        continue
    # Find the features array closing `],` for this entry
    # We split at the marker and work on the remaining content up to the next `},`
    before, after = content.split(marker, 1)
    next_close = after.find('},')
    entry = after[:next_close+2]
    # Find the last `],` in the entry (end of specs or features array)
    # We want to insert after the `features:` array's `]`
    feature_start = entry.find('features: [')
    if feature_start == -1:
        # Try specs array as fallback
        feature_start = entry.find('specs: [')
    if feature_start == -1:
        # Just insert before the final `},`
        insert_pos = next_close
        new_entry = entry[:insert_pos] + f', interiorImages: {interiors}' + entry[insert_pos:]
    else:
        # Find `],` after feature array
        feature_end = entry.find('],', feature_start)
        if feature_end == -1:
            feature_end = entry.find('},', feature_start)
        insert_pos = feature_end + 2  # after `],`
        new_entry = entry[:insert_pos] + f', interiorImages: {interiors}' + entry[insert_pos:]
    content = before + marker + new_entry + after[next_close+2:]
open(path, 'w', encoding='utf-8').write(content)
print("Done")
