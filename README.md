# JobReady SA — prototype v0.1

Mobile-first prototype for CV drafting, cover-letter drafting, interview practice and a local job-application tracker.

## Files
- `index.html` — app screens and navigation
- `style.css` — responsive styling
- `app.js` — interactions and local browser storage
- `manifest.json` — PWA metadata
- `sw.js` — basic offline caching

## Important
This is a prototype, not yet a Google Play release. Data is stored in the current browser's local storage and can be lost if browser data is cleared. Do not use on a shared device for sensitive personal information. There are no live job listings, accounts, cloud backup, ads, payments or AI API calls.

## Run
Upload all files to the root of a GitHub repository and enable GitHub Pages from Settings → Pages → Deploy from a branch → `main` → `/ (root)`. Open the resulting Pages URL in Chrome on Android.

## Next
Test on the target Android phone. Then fix usability issues, add data export/backup, privacy disclosures, and evaluate a compliant Android packaging route. Measure the final AAB/APK size; the 50 MB target is not guaranteed until a build is produced.
