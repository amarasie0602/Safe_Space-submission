# Inner pages: design and verification

This pass extends the warm visual system to the existing routes without changing
API contracts or adding dependencies.

- Writing: dedicated headers, comfortable form widths and text areas, clearer
  prompts and character limits that match the thread API.
- Conversations: readable prose column, back navigation, quieter reply surfaces,
  and a visible retry state when the thread cannot load.
- Inspiration: a lead article and compact reading index, with accessible
  expand/collapse relationships.
- Calm Corner: corrected kicker typography, properly sized breathing stage,
  distinct sound and grounding tools, consistent activity navigation.
- Counselors: scan-friendly directory rows and a separate sticky booking panel
  that stacks on mobile. The existing date/time/confirmation flow is retained.
- Account: organized profile settings, readable activity tabs, password-manager
  hints on authentication forms.
- Information: consistent page headers, readable text, section links, and
  responsive illustrations. Contact replaces the non-working example email
  with existing reporting, account recovery, and support paths.
- Administration: labeled workspace navigation, unified page headers, responsive
  metrics and schedules. /admin opens the flagged-post queue instead of a blank
  workspace. Audit-log failures expose a retry action.

## Checks

Production build and diff whitespace checks pass. All 24 browser tests and 8
unit tests pass. Lint has zero errors and 8 existing Fast Refresh warnings.

15 public pages were reviewed at 1440, 768, 390, and 320 pixels. Narrow-screen
issues on About, Crisis Resources, and analytics were corrected and rechecked.
The browser suite covers member routes at four widths, admin/counselor workspaces
at three widths, profile saving, booking steps, information navigation, and retry
states. Protected-screen tests use explicitly isolated browser fixtures: no live
accounts or records are modified. Existing homepage and keyboard tests still pass.

Representative desktop screenshots, plus a dark Calm Corner preview, are saved
under screenshots/inner-*.png. A live authenticated backend workflow audit and
real screen-reader verification were not performed in this pass.
