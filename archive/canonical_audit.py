#!/usr/bin/env python3
import os, re
base = r"C:\Users\maxto\Desktop\НОВЫЙ САЙТ\banger-site\NEW SITE BANI\dist"
pages = [
    "index.html",
    "katalog/bani.html",
    "katalog/doma.html",
    "katalog.html",
    "o-kompanii.html",
    "vystavka.html",
    "kontakty.html",
    "banya/istok-4.html",
    "banya/istok-semeynyy-7r.html",
    "banya/skandinaviya-start-plus-65.html",
    "dom/usadba-praktik.html",
    "poleznoe/kak-vybrat-mobilnuyu-banyu.html",
    "poleznoe/osnovanie-pod-banyu.html",
    "poleznoe/pechi-dlya-bani.html",
    "nashi-raboty/istok-8-podmoskovye.html",
    "planirovki.html",
    "politika.html",
    "rekvizity.html",
    "usloviya-zakaza.html",
]
results = []
for p in pages:
    path = os.path.join(base, p)
    if os.path.exists(path):
        content = open(path, 'r', encoding='utf-8').read()
        match = re.search('<link[^>]*rel="canonical"[^>]*>', content)
        if match:
            results.append((p, match.group()))
        else:
            results.append((p, "NOT FOUND"))
    else:
        results.append((p, "FILE NOT FOUND"))

print("=== CANONICAL AUDIT ===")
print(f"{'Page':<45} {'Canonical':<60}")
print("-" * 110)
for page, canonical in results:
    label = page if canonical != "FILE NOT FOUND" else page + " [MISSING]"
    print(f"{label:<45} {canonical:<60}")
