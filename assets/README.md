# Logo assets

Save the logo images the form references into this folder with these exact names
(PNG with transparent background preferred, SVG also fine — just keep the name):

| File | Logo |
|------|------|
| `eraasoft.png` | EraaSoft (main logo) |
| `ready-for-tomorrow.png` | Ready For Tomorrow / جاهزون للغد |
| `danish-arab-partnership.png` | Danish-Arab Partnership Programme |
| `dansk-erhverv.png` | Dansk Erhverv – Danish Chamber of Commerce |
| `icareer.png` | iCareer |
| `mofa-denmark.png` | Ministry of Foreign Affairs of Denmark |
| `plan-international.png` | Plan International |

If you don't want one of the partner logos, just delete its `<img>` line in
`index.html` (and `success.html`). To add one, drop the file here and add a
matching `<img ... class="partner-logo">` line.

## Generated files (don't hand-edit)

These are produced from `eraasoft.png` / `icareer.png` and referenced in the
`<head>` of `index.html` / `success.html`:

| File | Purpose |
|------|---------|
| `favicon-16.png`, `favicon-32.png`, `favicon-180.png`, `favicon-512.png` | Browser tab / home-screen icon — the EraaSoft brain-gear mark on a white rounded tile |
| `og-image.png` (1200×630) | Link-share preview card — EraaSoft + iCareer logos side by side |

To regenerate after changing the source logos:

```
npm i -D playwright && npx playwright install chromium
node scripts/generate-brand-images.mjs
```
