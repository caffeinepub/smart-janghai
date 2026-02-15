# Specification

## Summary
**Goal:** Make the existing admin panel and admin options reliably accessible by fixing admin role authorization handling, adding a clear failure state, and ensuring the UI provides navigation into the admin flow.

**Planned changes:**
- Fix `AdminRouteGuard` authorization gating so authenticated admin principals are recognized correctly based on the backend `UserRole` value returned by `getCallerUserRole()` (using the actual generated candid type shape rather than a string literal comparison).
- Add a user-visible error state for failed admin-auth role checks (e.g., network/actor/trap), showing an English error message with Retry and Back to Home actions instead of a blank screen or infinite loading.
- Add/ensure visible navigation from the Home UI to the Admin Login screen, and ensure successful admin login navigates to the Admin Dashboard with the existing sidebar options visible on desktop and accessible on mobile via the existing toggle.

**User-visible outcome:** Admin users can sign in with Internet Identity and reliably reach and see the Admin Dashboard and its existing options; non-admin users are shown the existing Access Denied screen; if the role check fails, the admin page shows a clear error with Retry and Back to Home.
