# ThaiProperty – Local Development Guide

A React + TypeScript web-app (Vite) that visualises Thai real-estate data, fetches live predictions from a CatBoost model, and market-trend forecasts from a Prophet model exposed via public endpoints.

---

## 1. Prerequisites

1. **Node.js ≥18** (LTS recommended). Check with:
   ```bash
   node -v
   ```
2. **npm ≥9** (comes with Node). Check with:
   ```bash
   npm -v
   ```
3. Optional: **Python 3.9+** if you want to run the ML back-end locally (not required; default config calls the cloud endpoints).

> **Mac M-Series glitch**  
> npm sometimes fails to install `@rollup/rollup-darwin-arm64`. If you hit the _"Cannot find module \`@rollup/rollup-darwin-arm64\`"_ error, just delete `node_modules` and `package-lock.json` and reinstall (see step 4).

---

## 2. Clone the repo

```bash
git clone https://github.com/your-org/ThaiProperty.git
cd ThaiProperty
```

---

## 3. Environment variables

Create a `.env.local` file in the project root (Vite automatically loads it):

```
# Supabase credentials
VITE_SUPABASE_URL="https://xxxx.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

If you only want to explore the UI without Supabase data, you can leave these blank; some pages will just display "no data" placeholders.

---

## 4. Install dependencies

Clean install (works around the Rollup optional-dependency bug):

```bash
rm -rf node_modules package-lock.json  # start fresh (optional but safe)
npm install
```

---

## 5. Run the dev server

```bash
npm run dev
```

Output should look similar to:
```
VITE v5.x.x  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```
Open that URL in your browser – hot-reload will keep the page updated as you edit code.

---

## 6. Calling the prediction APIs (already wired in the UI)

The UI posts to two public endpoints; nothing needs to run locally:

* `POST https://realestatemodel-production.up.railway.app/predict`
* `POST https://web-production-c3a7d.up.railway.app/forecast`

If you'd like to test them with **curl**:

```bash
# Price prediction (CatBoost)
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "Property_Type":"Condo",
    "Location":"Bangkok",
    "Size_sq_m":50,
    "Furnished":"Yes",
    "Bedrooms":2,
    "Bathrooms":1,
    "Year":2010
  }' \
  https://realestatemodel-production.up.railway.app/predict

# Market trend forecast (Prophet)
# csv_data must be a JSON-stringified array of rows
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "csv_data":"[ { \"Date_Listed\": \"01-01-2023\", \"Location\": \"Bangkok\", \"Property_Type\": \"Condo\", \"Price\": 4000000 } ]",
    "location":"Bangkok",
    "property_type":"Condo",
    "timeframe":"Next 6 Months"
  }' \
  https://web-production-c3a7d.up.railway.app/forecast
```

---

## 7. Lint, type-check & production build

```bash
# ESLint
npm run lint

# TypeScript (no emit)
npx tsc --noEmit

# Production bundle
pm run build   # outputs to /dist
```

---

## 8. (Optional) Run the ML back-ends locally

If you need totally offline development:

```bash
# 8.1  Create a Python virtualenv & install deps
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt   # catboost, prophet, flask, pandas

# 8.2  Start the CatBoost API
python backend/predict_api.py  # serves on http://localhost:5000/predict

# 8.3  Start the Prophet API
python backend/forecast_api.py # serves on http://localhost:8080/forecast
```

Then edit `src/api/realEstateApi.ts` to point to `http://localhost:5000/predict` / `http://localhost:8080/forecast`.

---

## 9. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Cannot find module '@rollup/rollup-darwin-arm64'` | Delete `node_modules` & `package-lock.json`, then `npm install` |
| Blank data on Map / Trends pages | Ensure Supabase creds are valid and the `realestatelistings` table contains rows (lat/lon not null) |
| Network errors for `/predict` or `/forecast` | Check that the Railway apps are up (or adjust URLs to local back-end) |

---

Happy hacking! 🎉
