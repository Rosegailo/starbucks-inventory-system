# MongoDB Database & Login Guide

This guide explains how your **already set up MongoDB database** (`starbucks_inventory`) works with the Starbucks Inventory Management System and how the **single-branch static User ID & Password login** connects to it without disrupting your existing product records.

---

## 1. How the Database Is Configured

The backend connects to MongoDB in `server/config/db.js`:

```js
process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/starbucks_inventory'
```

- **Default Database Name:** `starbucks_inventory`
- **Local MongoDB URI:** `mongodb://127.0.0.1:27017/starbucks_inventory`
- **MongoDB Atlas URI:** Configured via `server/.env`

### Setting Up `server/.env`

Copy `server/.env.example` to `server/.env`:

```bash
# PowerShell
Copy-Item server\.env.example server\.env
```

Configure your database and static branch login in `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/starbucks_inventory
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_random_secret_key_here

# Static Single-Branch Login Credentials
BRANCH_USER_ID=SBX-1001
BRANCH_USER_PASSWORD=Starbucks123!
BRANCH_PARTNER_NAME=Branch Manager
BRANCH_LOCATION=Starbucks Branch #1024

NODE_ENV=development
```

> **Using MongoDB Atlas instead of Local MongoDB?**  
> Replace `MONGO_URI` with your Atlas connection string pointing to `starbucks_inventory`:
> `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/starbucks_inventory?retryWrites=true&w=majority`  
> Note: `server/config/db.js` configures public DNS servers (`8.8.8.8`, `8.8.4.4`, `1.1.1.1`) for Windows SRV record resolution.

---

## 2. Collections Inside `starbucks_inventory`

Your database holds **two collections** under `starbucks_inventory`:

| Collection | Mongoose Model | Purpose |
| :--- | :--- | :--- |
| `products` | `server/models/Product.js` | Stores all Starbucks beverages, stock counts, prices, nutrition, and dynamic recipe ingredients (242 items when seeded from `starbucks.csv`). |
| `users` | `server/models/User.js` | Stores your single-branch static login account (`partnerId`, `name`, `email` optional, `password` hashed with `crypto.scrypt`, `role`, `storeLocation`, `lastLogin`). |

---

## 3. Keeping Your Existing Products While Setting Your Static Login

If your `products` collection is **already populated**, you do **not** need to wipe or re-seed your products:

1. **Automatic First-Run Initialization:**  
   When the backend starts (`npm run server` or `npm run dev`), `server/server.js` checks `User.countDocuments()`. If `users` has `0` documents, it creates the single static branch account from `BRANCH_USER_ID` and `BRANCH_USER_PASSWORD` in `server/.env` (falling back to `SBX-1001` / `Starbucks123!` if `server/.env` is not set) and leaves `products` untouched.
2. **Updating the Static User ID & Password (Without Touching Products):**  
   To set or change your branch's static User ID and password at any time:
   - Edit `BRANCH_USER_ID` and `BRANCH_USER_PASSWORD` in `server/.env`.
   - Run:
     ```bash
     npm run seed:users
     ```
   This updates only the `users` collection and keeps every document in `products` intact.
3. **Full Database Reset & Seed (Products + User):**  
   Only run `npm run seed` if you want to clear `products`, re-import `server/data/starbucks.csv`, and reset the branch user.

---

## 4. Auth API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Sign in with `identifier` (`partnerId` / User ID, or email) and `password`; returns a JWT token and branch user profile. |
| `GET` | `/api/auth/me` | Private | Verify Bearer JWT token and return the active branch user profile. |

All `/api/products*` endpoints are protected by `server/middleware/authMiddleware.js` (`protect`) and require `Authorization: Bearer <token>`, which `client/src/services/api.js` attaches automatically after sign-in.

---

## 5. Inspecting Your Existing Database (`mongosh` / Compass)

### Using MongoDB Compass
1. Connect with the URI in `server/.env` (default: `mongodb://127.0.0.1:27017`).
2. Open the **`starbucks_inventory`** database.
3. Verify both **`products`** and **`users`** collections exist.

### Using `mongosh` in Terminal
```javascript
use starbucks_inventory
show collections
db.products.countDocuments()
db.users.find({}, { password: 0 })
```

---

## 6. Running & Troubleshooting

Start both backend and frontend from the project root:
```bash
npm run dev
```

- **Error: `MongoDB Connection Error` / `ECONNREFUSED 127.0.0.1:27017`:**  
  Start your local MongoDB Windows service (`net start MongoDB` in an elevated terminal or Windows Services) or configure your Atlas `MONGO_URI` in `server/.env`.
- **Invalid User ID or Password:**  
  Check `BRANCH_USER_ID` and `BRANCH_USER_PASSWORD` in `server/.env`, then run `npm run seed:users` to sync them to MongoDB.
- **Error: `401 Unauthorized`:**  
  Ensure `JWT_SECRET` in `server/.env` stays consistent across server restarts.
