# Student Registration Form → Google Sheets

Files:
- `index.html` / `script.js` — the form (styled with Tailwind CSS via the Play CDN, no build step)
- `success.html` — the page users land on after a successful submission
- `apps-script.gs` — backend code that saves submissions into your Google Sheet
- `assets/` — logo images shown at the top of the form (EraaSoft is the main logo, partner logos sit in a wrapped row beneath it). See `assets/README.md` for the exact filenames to drop in.

## Setup steps

1. **Create a Google Sheet** (sheets.google.com) — any name.
2. Open **Extensions > Apps Script**.
3. Delete the default `Code.gs` content and paste in the full contents of `apps-script.gs`.
4. Save the project (Ctrl+S / floppy icon).
5. Click **Deploy > New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy**, authorize the permissions Google asks for, then copy the **Web app URL** it gives you (ends with `/exec`).
7. Open `script.js` and replace this line:
   ```js
   const SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
   with your copied URL.
8. Open `index.html` in a browser (or host the 3 files anywhere — Netlify, GitHub Pages, etc.) and submit a test entry. A "Responses" tab will be created automatically in your sheet with headers, and each submission will appear as a new row.

## If you change the form later

If you add/rename a field in `index.html`, update the matching field name in `apps-script.gs` (`data.fieldName`) and in the `HEADERS` array so columns stay in sync.

## Notes

- On a successful submission the browser is redirected to `success.html`. Validation / network errors show as a centered pop-up modal instead.
- If you already had a "Responses" tab before the "Project Link" column was added, add the `Project Link` header manually as the last column (the script only writes headers when the tab is empty).
- The Eraasoft-specific fields (Group Code, Branch, Instructor) only appear/are required when "Yes" is selected.
- The Track dropdown is populated dynamically: choosing **Business** shows only "Data Analysis"; choosing **Technical** shows Front-end, Back-end .NET, Flutter, UI/UX, and Back-end PHP.
- Every deployment update in Apps Script requires choosing **Deploy > Manage deployments > Edit > New version** for changes to `apps-script.gs` to take effect on the same URL.
