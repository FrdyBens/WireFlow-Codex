# Electrical Layout Planner - Instructions

This project is a floor-plan based electrical design tool with automatic wire routing, circuit analysis, conduit sizing, and a complete Bill of Materials (BOM) + cost estimator.

---

## 1) Project Structure

| Folder | Purpose |
|-------|---------|
| `/src/components/canvas` | Floor plan drawing and device placement UI |
| `/src/logic/routing` | Cable pathfinding and segment merging logic |
| `/src/logic/costing` | BOM + price lookup + total cost summary |
| `/src/logic/standards` | Electrical rules (load, circuit types, voltage drop) |
| `/src/data/catalog` | Pricing data and defaults |
| `/server` | Backend API & database connections |

---

## 2) How to Use

### Step 1 — Draw the House
Use the canvas to draw walls, doors, and rooms.

### Step 2 — Place Devices
Select components from the toolbar:
- Sockets
- Lights
- Switches
- Water heater
- Cooker outlet
- AC
- CCTV / Data / etc.

### Step 3 — Assign Circuits
Use the **Circuit Manager** to:
- Create DB/Panel
- Group devices into circuits
- Choose breaker types
- Set supply and earthing arrangement

### Step 4 — Auto Route
Press **Auto-Route**
- Wires will route through walls or ceiling paths
- Shared pathways will merge into conduit/trunking segments

### Step 5 — Review BOM & Warnings
Go to **BOM Tab** to see:
- Cable lengths
- Conduit sizes and lengths
- Number of devices & boxes
- Breakers and protection devices
- **Total cost**

Check **Warnings Tab** for:
- Voltage drop exceeded
- Cable undersized
- Trunking overfilled
- Missing RCD coverage

### Step 6 — Export
- **Download BOM CSV**
- **Download PDF Summary**
- **Save Project JSON** for future editing

---

## 3) Pricing / Cost Database

Pricing is stored in:

