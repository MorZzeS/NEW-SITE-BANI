#!/usr/bin/env python3
content = open('src/data/index.ts', encoding='utf-8').read()
print('kak-vybiraem:', 'kak-vybiraem-pilomaterial' in content)
print('ognebiozashchita:', 'ognebiozashchita' in content)
