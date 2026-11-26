# ☕ Starbucks® Inventory Management System (MERN Stack)

A complete full-stack **Starbucks Inventory Management System** built with MongoDB, Express.js, React (Vite + Tailwind CSS), and Node.js. It features a Starbucks-themed landing page, dynamic ingredients recipe builder, complete CRUD operations, inventory status monitoring, and automated dataset seeding from `starbucks.csv`.

---

## 🌟 Core Features

1. **Single-Branch Partner Login (JWT Auth)**:
   - Branded Starbucks Branch Portal login screen using static User ID and Password authentication.
   - Salted `scrypt` password hashing and HS256 JWT route protection across all `/api/products` endpoints.
   - See [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) for configuring your static branch credentials and connecting your already-setup MongoDB database (`starbucks_inventory`).

2. **Starbucks-Themed Landing Page**:
   - Branded welcome screen featuring the Starbucks siren logo.
   - Live inventory overview & metrics (Total products, categories, units, and total store retail value).
   - Low-stock and out-of-stock alert spotlight cards with 1-click drill-down.
   - Quick navigation into the Inventory Dashboard.

2. **Read Products (GET)**:
   - Interactive dashboard supporting **Card Grid View** and high-density **Table View**.
   - Real-time search across product names, categories, descriptions, and dynamic ingredients.
   - Category filter dropdown & stock level tabs (*All, In Stock, Low Stock (<15), Out of Stock*).
   - Multi-field sorting by Name, Price, Stock level, or Date created.
   - Full product inspection modal showing complete recipe ingredients, measurements, and nutritional profile.

3. **Create Product (POST)**:
   - Modal form to register new Starbucks handcrafted beverages and food items.
   - **Dynamic Ingredients Builder**: Add, edit, or remove multiple ingredients and exact measurements/units (`shots`, `oz`, `pumps`, `g`, `ml`, `scoop`, etc.).
   - Quick-add essential preset chips (*Espresso Roast, Steamed 2% Milk, Vanilla Syrup, Mocha Sauce, Caramel Drizzle, etc.*).
   - Optional nutrition facts editor (Calories, Caffeine, Sugars, Fat).

4. **Update Product (PUT/PATCH)**:
   - Edit any beverage details, formulation, recipe ingredients, and pricing.
   - **Quick Stock Adjustment**: Instant `+` and `-` stock counters on both Cards and Table views via `PATCH /api/products/:id/stock`.

5. **Delete Product (DELETE)**:
   - Safe removal flow with a branded confirmation prompt warning about inventory impact.

6. **Automated Dataset Seeder**:
   - Seed script that parses `starbucks.csv`, extracts categories and beverage preparations, generates realistic pricing, stock levels, and formulation ingredients, and loads them directly into MongoDB.

---

## 📂 Project Structure (Monorepo Layout)

```text
Starbucks/
├── logo.png                     # Official Starbucks logo asset
├── starbucks.csv                # Dataset file with Starbucks beverage nutritional data
├── package.json                 # Monorepo root scripts (concurrently dev runner)
├── README.md                    # Project documentation & setup instructions
│
├── server/                      # Backend (Node.js + Express + Mongoose)
│   ├── package.json
│   ├── server.js                # Express entry point, CORS, routing & error handling
│   ├── .env                     # Server environment variables
│   ├── .env.example             # Template for MongoDB URI and port configuration
│   ├── config/
│   │   └── db.js                # Mongoose connection logic
│   ├── models/
│   │   └── Product.js           # Mongoose Product & dynamic ingredients Schema
│   ├── controllers/
│   │   └── productController.js # Controllers for CRUD, stock adjustments & stats
│   ├── routes/
│   │   └── productRoutes.js     # API Route definitions
│   ├── scripts/
│   │   └── seed.js              # Streaming CSV parser & database seed runner
│   └── data/
│       └── starbucks.csv        # Local copy of beverage dataset
│
└── client/                      # Frontend (React 18 + Vite + Tailwind CSS)
    ├── package.json
    ├── vite.config.js           # Vite config with backend proxy (/api)
    ├── tailwind.config.js       # Starbucks signature brand palette configuration
    ├── postcss.config.js
    ├── index.html
    ├── public/
    │   └── logo.png             # Static asset for browser tab icon and fallback
    └── src/
        ├── assets/
        │   └── logo.png
        ├── components/
        │   ├── Navbar.jsx               # Navigation bar & active view toggler
        │   ├── LandingPage.jsx          # Welcome hero, stats cards & alerts
        │   ├── InventoryDashboard.jsx   # Search, filters, grid/table view
        │   ├── ProductCard.jsx          # Starbucks beverage card component
        │   ├── ProductTable.jsx         # Tabular data grid with quick stock +/-
        │   ├── ProductFormModal.jsx     # Create & Update modal form
        │   ├── IngredientsBuilder.jsx   # Dynamic recipe ingredient builder
        │   ├── ProductDetailModal.jsx   # Full recipe & nutrition inspection modal
        │   ├── DeleteConfirmModal.jsx   # Delete confirmation prompt
        │   ├── StatsOverview.jsx        # Top-level operational metrics cards
        │   └── Toast.jsx                # Toast alert notifications
        ├── services/
        │   └── api.js                  # Centralized Axios API client
        ├── App.jsx                      # Main app state, routing & modal coordinator
        ├── main.jsx                     # React root mount
        └── index.css                    # Tailwind CSS custom styles & scrollbars
```

---

## 🗄️ Database: Mongoose Schema

The product schema supports an array of subdocument ingredients with exact amounts and measurement units:

```javascript
// Dynamic Ingredient Subdocument Schema
const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  amount: { type: String, required: true, trim: true },
  unit: { type: String, default: '', trim: true }
}, { _id: false });

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true, index: true },
  size: { type: String, default: 'Grande', trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  sku: { type: String, trim: true },
  description: { type: String, default: '', trim: true },
  ingredients: { type: [ingredientSchema], default: [] },
  nutrition: {
    calories: { type: Number, default: 0 },
    caffeine: { type: String, default: 'N/A' },
    sugars: { type: Number, default: 0 },
    fat: { type: Number, default: 0 }
  },
  imageUrl: { type: String, default: '' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual Stock Status
productSchema.virtual('status').get(function () {
  if (this.stock <= 0) return 'Out of Stock';
  if (this.stock < 15) return 'Low Stock';
  return 'In Stock';
});
```

---

## ⚙️ Environment Configuration (`.env`)

Configure `server/.env` with your MongoDB instance:

```env
# Server Port
PORT=5000

# MongoDB URI:
# For Local MongoDB:
MONGO_URI=mongodb://127.0.0.1:27017/starbucks_inventory
# For MongoDB Atlas Cloud:
# MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/starbucks_inventory?retryWrites=true&w=majority

# Client URL for CORS
CLIENT_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

---

## 🚀 Setup & Execution Guide

Follow these step-by-step commands in your terminal:

### 1. Install Dependencies

You can install all dependencies from the root directory with one command:

```bash
# Option A: One-line install for root, server, and client
npm run install:all
```

Or install separately in their respective directories:

```bash
# Install root runner
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

---

### 2. Seed the Starbucks Dataset into MongoDB

Ensure your MongoDB service is running (locally via `mongod` or via MongoDB Atlas URI in `server/.env`), then run:

```bash
npm run seed
```

Output:
```text
☕ STARBUCKS INVENTORY SEED SCRIPT
📂 Reading dataset from: server/data/starbucks.csv
✅ Connected to MongoDB at: mongodb://127.0.0.1:27017/starbucks_inventory
📊 Found 242 total rows in CSV dataset.
🧹 Cleaned up 0 prior records.
✨ Successfully imported 242 Starbucks inventory products!

📋 Inventory Summary:
   - Total Products:   242
   - Categories:       9 (Coffee, Classic Espresso Drinks, Signature Espresso Drinks, ...)
   - Out of Stock (0): 2
   - Low Stock (<15):  4
```

---

### 3. Run Frontend & Backend Concurrently

From the root directory:

```bash
npm run dev
```

This starts:
- 🚀 **Backend API**: `http://localhost:5000`
- 💻 **Frontend Web App**: `http://localhost:5173`

Or run them individually in separate terminal windows:

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve products (supports `?search=`, `?category=`, `?status=`, `?sortBy=`) |
| `GET` | `/api/products/stats` | Aggregated metrics: total items, categories, value, stock alert counts |
| `GET` | `/api/products/:id` | Fetch single product and complete recipe |
| `POST` | `/api/products` | Create a new Starbucks product with dynamic ingredients |
| `PUT` | `/api/products/:id` | Update product specifications and ingredients |
| `PATCH` | `/api/products/:id/stock` | Quick adjust stock quantity (`{ delta: 1 }` or `{ newStock: 25 }`) |
| `DELETE` | `/api/products/:id` | Delete product by ID |
| `GET` | `/api/health` | Backend healthcheck status |

---

## 🎨 Starbucks Design Tokens

- **House Green**: `#006241`
- **Primary Accent**: `#00754A`
- **Deep Dark Green**: `#1E3932`
- **Warm Mint Accent**: `#D4E9E2`
- **Soft Cream Canvas**: `#F2F0EB`
- **Warm Gold**: `#CBA258`
