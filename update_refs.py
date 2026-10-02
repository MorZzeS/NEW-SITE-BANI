#!/usr/bin/env python3
path = r"C:\Users\maxto\Desktop\НОВЫЙ САЙТ\banger-site\NEW SITE BANI\src\data\index.ts"
content = open(path, 'r', encoding='utf-8').read()
new_content = content.replace('.png', '.webp')
# But only replace image paths, not text like ".png" references in other contexts
# Let's count changes
old_refs = content.count('.png')
new_refs = new_content.count('.png')
print(f"Before: {old_refs} '.png' refs")
print(f"After: {new_refs} '.png' refs (should be 0 if all converted)")
open(path, 'w', encoding='utf-8').write(new_content)
