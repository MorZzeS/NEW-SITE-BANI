# Weather city dataset

44 fixed city centroids, WGS84; collected 2026-10-27 from the official GeoNames cities15000 export:
https://download.geonames.org/export/dump/cities15000.zip
https://download.geonames.org/export/dump/readme.txt

Coordinates and timezone were matched by geonamesId against the official TSV records. Russian display names are curated; the initial search used Open-Meteo only to discover IDs, and final coordinates were re-read from GeoNames export. Each record retains its GeoNames link and administrative region. No runtime geocoding service is used. City centroids are not boundaries or addresses.

Attribution: GeoNames, https://www.geonames.org/ . Geographic data is licensed CC BY 4.0: https://creativecommons.org/licenses/by/4.0/ . Dataset selection and Russian display names: BANGER. GeoNames permits commercial redistribution with attribution: https://www.geonames.org/about.html .

MET forecast request coordinates are truncated toward zero to at most four decimal places as required by https://api.met.no/doc/TermsOfService . The original centroid precision is retained only in this local dataset. UI geolocation picks the nearest centroid within a conservative 35 km including browser accuracy; accuracy above 10 km is rejected. Only the selected city ID may be persisted. No exact visitor coordinates leave the geolocation callback or are stored.
