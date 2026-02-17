# Specification

## Summary
**Goal:** Add a prominent “coming soon” voting-results promotion to the homepage, display periodically refreshing live-results data, and allow admins to manage that dataset from the admin area.

**Planned changes:**
- Add a new, visually prominent promotional section at the very top of the homepage (above the existing hero) with the exact title: "GRAM PRADHAN VOTING LIVE RESULT OF WHOLE VILLAGES AROUND JANGHAI COMMING SOON STAY TUNED WITH US...".
- Add a “Live Results (Coming Soon)” widget inside that new section that fetches results from the backend, displays a list/table (or empty state), and auto-refreshes on a fixed polling interval with loading/empty/error states.
- Extend the Motoko backend main actor to store voting results (villages/candidates/counts), expose a public query to fetch results, and admin-only methods to create/update/delete entries with authorization protection.
- Add a new Admin “Voting Results” module/plugin with a sidebar entry (admin-only) and CRUD UI to manage villages/candidates/counts and persist changes to the backend.
- Add one additional small, non-invasive homepage widget outside the new top voting section (e.g., announcement ribbon/highlight card) referencing the same “Coming Soon” message as an easily removable encapsulated component.

**User-visible outcome:** Visitors see a new top-of-homepage banner promoting upcoming gram pradhan voting live results plus a live-results widget that refreshes automatically; admins can manage the results dataset from a dedicated “Voting Results” admin screen, and an additional “Coming Soon” widget appears elsewhere on the homepage.
