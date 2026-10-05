#!/usr/bin/env python3
import os
base = r"C:\Users\maxto\Desktop\НОВЫЙ САЙТ\banger-site\NEW SITE BANI\dist"
count = 0
for root, dirs, files in os.walk(base):
    for d in dirs:
        if 'poleznoe' in root or d == 'poleznoe':
            print(os.path.join(root, d))
            count += 1
print(f"\nTotal poleznoe dirs: {count}")
# Check if new articles exist
for slug in ['kak-vybiraem-pilomaterial-dlya-bani', 'ognebiozashchita-drevesiny-zamachivanie-ili-opryskivanie']:
    p = os.path.join(base, 'poleznoe', slug, 'index.html')
    print(f"{slug}: {'EXISTS' if os.path.exists(p) else 'MISSING'}")
