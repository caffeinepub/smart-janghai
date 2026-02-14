# Specification

## Summary
**Goal:** Remove all visible “SMART JANGHAI” / “Smart Janghai” branding text so the site branding is logo-only, while keeping resilient logo loading without text fallbacks.

**Planned changes:**
- Remove brand-name text from the hero branding area so only the logo image is shown.
- Remove brand-name text from the footer (e.g., update the copyright line so it no longer includes “Smart Janghai”).
- Update the BrandLogo component so image-load failure uses a non-text placeholder fallback that preserves layout and keeps the page fully rendered.

**User-visible outcome:** The UI shows only the logo for branding (no “Smart Janghai” text in hero or footer), and if the logo fails to load a neutral non-text placeholder appears instead of any brand-name text.
