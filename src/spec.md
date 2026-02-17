# Specification

## Summary
**Goal:** Ensure the Home page and key homepage sections reliably render during backend initialization issues, and replace silent failures with visible, English error/empty/loading states.

**Planned changes:**
- Adjust the app-wide loading gate to fail-open: render routes (including Home) even when the backend actor is temporarily null/unavailable, while still reliably showing the Decommissioned page when explicitly decommissioned/unavailable.
- Remove/avoid high-frequency URL-hash polling behavior that can contribute to a perceived blank or “not showing” UI during initialization/loading.
- Make the homepage VotingPromoSection (including LivePollWidget and LiveVotingResultsWidget) always display a visible loading, empty (“No Active Poll” or equivalent), or inline error state instead of rendering nothing; ensure all user-facing messages are in English.
- Update NotificationPanelErrorBoundary fallback behavior to show a compact inline on-screen message (in English) when it catches errors, while keeping existing console logging and preserving normal notification behavior when no error occurs.

**User-visible outcome:** The Home page shows reliably instead of getting stuck on a global “Loading…” screen, voting/poll widgets no longer disappear silently (they show loading/empty/error states), and notification UI failures display a clear inline message rather than missing UI with no explanation.
