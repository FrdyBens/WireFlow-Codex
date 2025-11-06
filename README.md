# WireFlow Codex

WireFlow Codex is an interactive electrical layout planner that combines a floor-plan canvas with automatic routing, electrical rule checks, and a live bill of materials with pricing integration.

## Features
- 🧱 Draw walls and place electrical devices with a Konva-powered canvas.
- 🔌 Manage distribution boards and circuits, including automatic breaker recommendations.
- 🛣️ Hybrid MST + A* auto-routing with 360° bend enforcement and conduit sizing.
- 📏 Calculates wiring lengths (with slack), voltage drop, and circuit loading warnings.
- 🧾 Generates a bill of materials with pricing sourced from Dexie (IndexedDB) and CSV imports.
- 💾 Save and load projects, export BOM summaries as CSV or PDF.
- 🗃️ Prisma + SQLite backend for project persistence and pricing catalog.

## Getting Started
```bash
npm install
npx prisma generate
npm run dev      # start Vite dev server
npm run server   # start Express API
```

Set the database connection by copying `.env.example` to `.env` and adjusting as required.

Use the **Pricing** panel to upload a CSV with the columns `sku,name,description,unit,price,vendor,category` to replace the pricing catalog. Default seed data is provided in `src/data/catalog/sample-pricing.csv`.

## Project Structure
- `src/` – React UI and application logic (routing, costing, standards).
- `server/` – Express API with Prisma persistence and export endpoints.
- `prisma/schema.prisma` – Database schema for projects and pricing.

## Example Data
- `src/data/catalog/example-project.json` – Starter project loaded in the UI.
- `src/data/catalog/sample-pricing.csv` – Sample pricing table for testing imports.
