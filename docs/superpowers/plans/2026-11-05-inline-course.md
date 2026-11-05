# Inline Course Implementation Plan

## Approved Scope
Keep all five M3 units together under Prompt Lab after M1/M2. Remove repeated M3 launch cards. Merge IE/IT with the original thirty cases on one page and provide eight department jump links. Preserve source distinctions, exercises, exports and legacy pages. No remote publication.

## Implementation
- [x] Add an integration regression test for M3, 42 cases, eight links and routing.
- [x] Reuse standalone content in isolated inline DOM sections, retaining original scripts with explicit root-scoped initialization. Generate the offline template bundle from existing HTML/CSS rather than maintaining duplicate lessons.
- [x] Replace launch cards, synchronize lecturer/large-text settings, and support deep links and return navigation.
- [x] Run existing tests, integration checks, desktop/mobile browser checks, downloads and storage restoration. Update usage documentation.

## Review Focus
No duplicate global IDs or handlers; no cross-module hash interference; no loss of original case data; file:// links remain usable; mobile anchors clear both sticky toolbars.
