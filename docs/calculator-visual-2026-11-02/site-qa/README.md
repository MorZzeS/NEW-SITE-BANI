# Targeted site QA — 2026-11-03

Result: BLOCKED, not a visual PASS.

Evidence: existing CDP endpoint http://127.0.0.1:9333/json/list refused the connection. Get-NetTCPConnection showed no listeners on 4318, 4319 or 9333. Running the dedicated script recorded `blocked` with zero browser cases in results.json. JavaScript syntax check (`node --check scripts/calculator-visual-qa/site-qa.mjs`) completed successfully.

Problem: the previously available browser and local servers are no longer listening. No new Chrome process was launched, respecting the coordinator's policy-block instruction. No product code or real data was changed; no forms were submitted.

Not checked: actual rendering, browser errors, horizontal overflow, broken images, DAY/NIGHT appearance, and mobile menu operation on home, catalogue, bath/house categories, useful articles index, about, contacts and gallery. No screenshots exist for this run. Previously completed 31-model checks were not repeated.

Prepared rerun (requires an already authorized running CDP browser and local static server):

```powershell
node scripts/calculator-visual-qa/site-qa.mjs http://127.0.0.1:4319 9333
```

The script creates an isolated browser target, visits eight routes at 1440/768/390 in both themes, captures screenshots and runtime/network errors, measures overflow and broken images, and opens/closes mobile navigation where visible. It closes only its own target. Generated screenshots still need human visual review; `captured-needs-visual-review` is not PASS. It does not exercise article detail pages, gallery detail pages, catalogue filters, link destinations or form validation.
