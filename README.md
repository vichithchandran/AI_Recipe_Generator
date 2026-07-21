# 🍳 AI Recipe Generator

<div align="center">

![AI Recipe Generator Banner](https://img.shields.io/badge/AI%20Recipe%20Generator-Full%20Stack-10b981?style=for-the-badge&logo=react&logoColor=white)

A **full-stack intelligent recipe management platform** powered by Google Gemini AI. Generate personalized recipes, manage pantry inventory, plan weekly meals, and build smart shopping lists — all in one premium dark-themed workspace.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/atlas)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## ✨ Features

### 🤖 AI-Powered Recipe Generation
- Generate custom recipes using **Google Gemini AI** based on your available ingredients
- Pull directly from your pantry inventory (non-expired items only)
- Customize cuisine type, dietary restrictions, servings & cooking time
- AI strictly avoids recommending expired or spoiled ingredients

### 🧺 Smart Pantry Inventory
- Add, edit & delete pantry ingredients with quantity and unit tracking
- Automatic **Veg / Non-Veg classification** using standard Indian FSSAI symbols (🟢🔴)
- Color-coded status borders:
  - 🔴 **Red** — Expired items
  - 🟡 **Amber** — Expiring within 7 days
  - 🟠 **Orange** — Running low on stock
  - 🟢 **Emerald** — Fresh & in stock
- Expiry date tracking with automated alerts

### 📅 Weekly Meal Planner
- Visual 7-day calendar grid (Breakfast, Lunch, Dinner)
- Schedule saved recipes to any day/meal slot
- Navigate between weeks with instant DB sync

### 🛒 Smart Shopping List
- Grouped by category (Produce, Dairy, Meat, etc.)
- **Running Low Alert Banner** — auto-detects and suggests pantry items low on stock
- One-click bulk-add all low-stock items to your shopping list
- Check off purchased items and transfer directly to pantry inventory

### 👤 User Authentication & Settings
- Secure JWT-based registration & login
- Password visibility toggles on all auth forms
- Customizable dietary restrictions, preferred cuisines & default servings
- Secure password change with current password verification
- Account deletion with typed confirmation (`DELETE`)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 7, TailwindCSS v4 |
| **UI Components** | Lucide Icons, React Hot Toast |
| **Backend** | Node.js, Express.js (ESM) |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **AI Engine** | Google Gemini API (`gemini-2.5-flash` with fallbacks) |
| **Authentication** | JWT (256-bit secret), bcryptjs |
| **Routing** | React Router DOM v7 |
| **Date Handling** | date-fns |

---

## 📁 Project Structure

```
AI_Recipe_Generator/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── env.js              # Environment config
│   ├── controllers/            # Route handlers
│   ├── middleware/             # Auth & error middleware
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── UserPreference.js
│   │   ├── PantryItem.js
│   │   ├── Recipe.js
│   │   ├── MealPlan.js
│   │   └── ShoppingItem.js
│   ├── routes/                 # Express route definitions
│   ├── services/
│   │   └── aiService.js        # Gemini AI integration
│   ├── validators/             # Input validation
│   ├── utils/
│   ├── .env.example            # Environment variable template
│   └── server.js               # Entry point
│
└── frontend/ai-recipe-generator/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ConfirmModal.jsx
    │   │   ├── DietSymbol.jsx  # Indian Veg/Non-Veg symbols
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── SignUp.jsx
    │   │   ├── ResetPassword.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Pantry.jsx
    │   │   ├── RecipeGenerator.jsx
    │   │   ├── MyRecipes.jsx
    │   │   ├── RecipeDetail.jsx
    │   │   ├── MealPlanner.jsx
    │   │   ├── ShoppingList.jsx
    │   │   └── Settings.jsx
    │   ├── services/           # API service layer
    │   └── App.jsx
    └── index.html
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **npm** v9+
- A **MongoDB Atlas** account (free tier works)
- A **Google Gemini API key** (free at [ai.google.dev](https://ai.google.dev/))

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-recipe-generator.git
cd ai-recipe-generator
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file from the template:

```bash
cp .env.example .env
```

Fill in your values in `.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_256bit_random_secret
LLM_API_KEY=your_gemini_api_key
PORT=8000
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The API will be running at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd ../frontend/ai-recipe-generator
npm install
npm run dev
```

The app will open at `http://localhost:5173`

---

## 🔐 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `MONGO_URI` | MongoDB Atlas connection string | ✅ Yes |
| `JWT_SECRET` | 256-bit secret for signing JWT tokens | ✅ Yes |
| `LLM_API_KEY` | Google Gemini API key | ✅ Yes |
| `PORT` | Backend server port (default: 8000) | Optional |
| `NODE_ENV` | `development` or `production` | Optional |

> ⚠️ **Never commit your `.env` file.** Use `.env.example` as a reference template only.

---

## 📸 Application Screens

| Screen | Description |
|---|---|
| **Dashboard** | Stats overview, recent recipes, upcoming meals |
| **Pantry** | Color-coded ingredient cards with Veg/Non-Veg symbols |
| **AI Generator** | Custom recipe builder with real-time AI output |
| **My Recipes** | Saved recipe collection with search & filters |
| **Recipe Detail** | Ingredient scaling, step instructions & nutrition info |
| **Meal Planner** | 7-day weekly calendar grid |
| **Shopping List** | Smart grouped list with pantry low-stock alerts |
| **Settings** | Profile, password, dietary preferences |

---

## 🎨 Design System

- **Theme:** Dark Obsidian Glassmorphism
- **Fonts:** [Outfit](https://fonts.google.com/specimen/Outfit) (headings) + [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (body)
- **Primary Accent:** Emerald → Teal gradient (`#10b981` → `#14b8a6`)
- **Surface:** `rgba(15, 23, 42, 0.75)` with `backdrop-filter: blur(16px)`
- **Toast Notifications:** Custom dark glassmorphic with colored glow borders

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add: your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Vichith Chandran**

[![GitHub](https://img.shields.io/badge/GitHub-vichithchandran-181717?style=flat-square&logo=github)](https://github.com/vichithchandran)

---

<div align="center">

Made with ❤️ and powered by **Google Gemini AI**

</div>
