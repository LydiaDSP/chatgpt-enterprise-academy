# Inline course acceptance - 2026-11-05

Base: main at 5f8f3c5. Local changes only; no GitHub push or deployment.

## Passed
- Corrected two-level Prompt Lab navigation: M1 only 01-02, M2 only 03-06, M3 only 07-11. One shared lesson navigation and one visible lesson; no separate M3 block below M1/M2.
- Chromium stage audit at 390 and 1280 pixels: all eleven lessons clicked, active stage/unit synchronized, arrow keys wrap within the current stage, M1 completion advances to M2.
- Static syntax, source-data parity and main navigation tests.
- Existing research, Skill, Codex, M3, Work and IE/IT smoke suites.
- Four Python offline prototype tests.
- Integrated M1/M2/M3 initialization, all five M3 units, 30 original plus 12 added cases, eight department links, original and added case deep links.
- Copy actions, role exercise checklist, local storage and relative asset links.
- Chromium at 360, 390 and 1280 pixels: seven integrated views each, no horizontal document overflow; IE/IT headings clear the sticky navigation.
- Real-browser MES calculation, six prototype checks, JSON/Markdown downloads, refresh persistence, Agent tabs, practice list, original QA navigation, instructor hints and large text.
- No page JavaScript errors in the browser interaction audit. The temporary HTTP server returns a harmless 404 for the pre-existing absent favicon.

Screenshots and exported samples: output/playwright/.

## Corrections during verification
- Removed standalone inline scroll margins that hid IE/IT headings behind the department navigation.
- Scoped event handlers and selectors to embedded roots to prevent collisions with the main course.
- Normalized CRLF in the existing Skill frontmatter test so Windows checkouts are accepted.

## Boundaries
No real AI API, enterprise data, permission grants or production deployment tested. HTTP browser preview was tested; direct-file loading is supported by bundled scripts but was not tested in Chromium because the automation browser blocks file URLs. Old standalone pages remain available.
