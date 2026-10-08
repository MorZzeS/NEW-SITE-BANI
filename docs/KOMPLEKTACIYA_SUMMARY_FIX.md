# Summary: targeted rendering fix — 08.10.2026

Owner reports stale LIVE sidebar while selection/form work. Existing source already has one selection state; arithmetic/data case floor+decor+ermak produces 3 / 42900. A second summary state was not found.

Changed: all checked/pressed UI uses the derived canonical selection. Summary count/amount now render as complete text strings rather than React text fragments, with translate=no, keyed refresh for the selection signature and explicit data-selected-count/data-additional-total. No extra state, prices, form/backend changes.

Reasoning: targets stale rendered/translated/accessibility text in the sidebar. Exact browser-level cause NOT reproduced/confirmed: cua_repl fails with Windows sandbox setup refresh errors. Do not claim a confirmed root cause or LIVE PASS.

Tests: real component event regression (multiple categories, popular remove/reset) verifies 3 options +42900, then 2 +23400, then 0. All 19 options dedup/price/form contract tests PASS. Build PASS. check:static result recorded at commit time. No push; post-deploy desktop/mobile LIGHT/DARK verification remains pending owner authorization and a working browser tool.
