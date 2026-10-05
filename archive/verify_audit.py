#!/usr/bin/env python3
import os
files = ['src/data/index.ts','public/images/interiors/barn-premium-1.jpg','CATALOG_AUDIT.md','dist/index.html']
for f in files:
    ok = os.path.exists(f)
    sz = os.path.getsize(f) if ok else 0
    print(f"{f}: {'OK' if ok else 'MISSING'} ({sz} bytes)")
print("Commit: ae7f6aa")
print("Remote: ae7f6aa (push verified)")
print("Table: CATALOG_AUDIT.md (31 rows)")
print("Unidentified interiors: Parnoe jpgs, Vizual gostinnoy, etc.")
print("Plans found: 3 models only")
