# Image Sources

All placeholder photography for Raptor Roofing pitch site.
Replaced with real Raptor crew photos in Phase 8 handoff.

## License

All files below are sourced from Unsplash under the Unsplash License.
- Free for commercial and non-commercial use
- No attribution required (attribution provided here as best practice)
- Full license: https://unsplash.com/license

## Files

### Hero images (WebP, ~70 KB each, 1280px wide)

Final download params: `w=1280&fm=webp&q=50&fit=crop` (with crop variant per file).
Downscaled from 1920px target after two quality retries (q=75 → q=60 → q=50 at w=1280).
This photo has high-frequency roof texture detail that resists WebP compression at 100 KB
budget for 1920px widths. 1280px/q=50 lands at ~70 KB — acceptable for a pitch build.
Phase 8 handoff: supply real Raptor crew photos and re-encode at optimal quality per file.

| File | Source photo | Photographer | Crop param | Size |
|---|---|---|---|---|
| hero.webp | https://unsplash.com/photos/jnmKI7Hl3_E | TODO (look up on Unsplash) | (default center) | 70 KB |
| about-hero.webp | (same) | (same) | `crop=top` | 70 KB |
| roofing-hero.webp | (same) | (same) | `crop=bottom` | 70 KB |
| siding-hero.webp | (same) | (same) | `crop=left` | 70 KB |
| gutters-hero.webp | (same) | (same) | `crop=right` | 70 KB |
| emergency-tarping-hero.webp | (same) | (same) | `crop=center` | 70 KB |

**Phase 6 deviation:** All 6 hero files are derived from a single Unsplash photo
(photo-1604709177225-055f99402ea3) with different Imgix crop params. Claude could not
reliably predict additional Unsplash photo slugs from pre-August-2025 training data
without risking 404s, so a verified-working single photo was reused with URL-level crop
variety. Phase 8 handoff MUST replace each file with a genuinely different real Raptor
photo before public launch.

**Phase 8 handoff checklist:**
- [ ] hero.webp — replace with Raptor crew on a job site or aerial roof shot
- [ ] about-hero.webp — replace with owner/team photo
- [ ] roofing-hero.webp — replace with completed roof replacement project photo
- [ ] siding-hero.webp — replace with completed siding project photo
- [ ] gutters-hero.webp — replace with seamless gutter installation photo
- [ ] emergency-tarping-hero.webp — replace with emergency tarp crew in action

### OG card (JPEG, 1200x630)

Download params: `w=1200&h=630&fm=jpg&q=85&fit=crop`

| File | Source photo | Photographer | Notes | Size |
|---|---|---|---|---|
| ../og/default.jpg | https://unsplash.com/photos/jnmKI7Hl3_E | TODO (look up on Unsplash) | Cropped to 1200x630 for Open Graph / Twitter Card | 105 KB |

**Phase 8 handoff:** Replace with a branded OG card (Raptor logo + tagline + photo) at
exactly 1200x630 px. This dramatically improves social share click-through.
