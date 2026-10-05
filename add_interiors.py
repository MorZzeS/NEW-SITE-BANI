#!/usr/bin/env python3
import re
path = r"src\data\index.ts"
content = open(path, 'r', encoding='utf-8').read()

interiors = [
    '/NEW-SITE-BANI/images/interiors/parnaya-2-.jpg',
    '/NEW-SITE-BANI/images/interiors/vizual-gostinnaya-1.jpg',
    '/NEW-SITE-BANI/images/interiors/pomiv-2.jpg',
    '/NEW-SITE-BANI/images/interiors/parnaya-4-.jpg',
    '/NEW-SITE-BANI/images/interiors/vizual-gostinnaya-3.jpg',
]

models_with_interiors = [
    'istok-4', 'istok-6', 'istok-semeynyy-7', 'skandinaviya-komfort-6',
    'sever-panorama-8', 'usadba-veranda', 'barn-premium', 'usadba-terra-7',
    'usadba-uyt-5', 'usadba-semejnaya-6', 'usadba-praktik', 'istok-8',
    'istok-terra-5', 'skandinaviya-mini-45', 'sever-rezidents-7',
]

for slug in models_with_interiors:
    # Find the line and insert interiorImages before the closing } of the object
    # We'll use a targeted regex approach
    pattern = f"(slug: '{slug}',)"
    if not re.search(pattern, content):
        continue
    # Check if already has interiorImages
    if f"interiorImages" in content.split(f"slug: '{slug}'")[1].split('},')[0]:
        continue
    # Insert after the specs/features, before size or at end of object line
    # We will insert before the closing `},` for this model's entry
    # Find the exact snippet and add interiorImages
    snippet_start = content.find(f"slug: '{slug}'")
    snippet_end = content.find('},', snippet_start)
    snippet = content[snippet_start:snippet_end+2]
    # Insert interiorImages before the closing `},`
    new_snippet = snippet.replace(
        '},',
        f", interiorImages: {interiors}, }}"
    )
    # Actually this approach might break. Let's use a simpler approach:
    # Find the `features:` list and insert after it, before `},`
    # Alternative: Find the model entry and insert `interiorImages` after the last property before closing `}`
    # We'll just insert after `features: [` ... `]` part for that entry.
    # Let's use the exact line replacement approach per model.
    pass

# Actually, let's use a simpler approach: read line by line and insert
lines = content.splitlines()
new_lines = []
for line in lines:
    new_lines.append(line)
    if "slug: 'istok-4'" in line and "interiorImages" not in content.split("slug: 'istok-4'")[1].split('},')[0]:
        # Find the feature array closing and insert after it... too complex.
        pass

# Simpler batch approach: find model line, then insert after the `],` before `},`
# Actually the easiest is to add interiorImages directly after `specs:` array for selected models.

for slug in models_with_interiors:
    # Find the model entry in content and insert `interiorImages` before the closing `},`
    marker = f"slug: '{slug}'"
    idx = content.find(marker)
    if idx == -1:
        continue
    # Find the end of the entry (before the next model or closing array)
    # Find `features:` list for this model, then the closing `],` after it, then insert.
    # Actually let's find the `features:` and insert after the `]` before `},`
    # We'll find the snippet between marker and next `},` for that line
    end_idx = content.find('},', idx)
    if end_idx == -1:
        continue
    # Find the last `],` before end_idx (end of specs or features array)
    last_bracket = content.rfind('],', idx, end_idx)
    # Actually we want to insert after the `features:` array's `]`
    # The features array is: features: [ ... ],
    # We can insert after the `],` of features array
    feature_array_start = content.find('features: [', idx)
    if feature_array_start == -1:
        continue
    # Find closing `],` after features array
    feature_array_end = content.find('],', feature_array_start)
    if feature_array_end == -1 or feature_array_end > end_idx:
        continue
    # Insert after that `],`
    insert_pos = feature_array_end + 2
    insert_text = f", interiorImages: {interiors}"
    content = content[:insert_pos] + insert_text + content[insert_pos:]

open(path, 'w', encoding='utf-8').write(content)
print("Added interiorImages to:", models_with_interiors)
