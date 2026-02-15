# Specification

## Summary
**Goal:** Add an emergency decommission mode that blocks all normal app functionality and provides an admin-only operation to permanently wipe all in-canister data, with a frontend override screen when decommissioned.

**Planned changes:**
- Add a persistent backend `isDecommissioned` flag stored in stable state to survive upgrades/redeploys.
- Add an admin-only backend method to enable decommission mode and wipe all stored canister data (users, content, settings, logs, metadata, and counters/IDs).
- Gate all non-essential backend methods so they consistently return/trap with a clear English “website has been decommissioned” message when decommission mode is enabled.
- Add a minimal backend status/read-only method for the frontend to detect decommission state (e.g., `getSystemStatus` with `isDecommissioned`).
- Add a frontend route override so that when decommission mode is detected, every route renders a single English “Website Decommissioned” screen with no login/admin/member actions and without relying on blocked APIs.

**User-visible outcome:** When decommission mode is enabled, the site becomes inaccessible and shows only a “Website Decommissioned” message page; administrators can trigger an emergency decommission-and-wipe action that clears all stored application data.
