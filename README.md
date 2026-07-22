# 🍳 AI Recipe Generator

<div align="center">

![AI Recipe Generator Banner](https://img.shields.io/badge/AI%20Recipe%20Generator-Full%20Stack-10b981?style=for-the-badge&logo=react&logoColor=white)

A **full-stack intelligent recipe management platform** powered by **Groq (Llama 3.3 70B)**, **Google Gemini AI** & free open AI engines. Generate personalized recipes by typing any dish craving or using your pantry ingredients, manage inventory, plan weekly meals, and build smart shopping lists — all in one premium dark-themed workspace.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/atlas)
[![Groq AI](https://img.shields.io/badge/Groq-Llama%203.3%2070B-FF4500?style=flat-square&logo=lightning)](https://console.groq.com/)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## ✨ Features

### 🤖 AI-Powered Recipe Generation (Multi-Engine Waterfall)
- Generate custom recipes using **Groq (Llama 3.3 70B)** → **Google Gemini AI** → **Free Open AI Engine** (automatic waterfall fallback)
- **100% AI-generated** — zero hardcoded/mock recipes
- Pull directly from your pantry inventory (non-expired items only)
- Customize cuisine type, dietary restrictions, servings & cooking time
- AI strictly avoids recommending expired or spoiled ingredients
- Generates gourmet **HD food photography images** for every recipe automatically via Pollinations AI

### 🍽️ Specific Dish Craving (New!)
- Type any specific dish in the **"Specific Dish Craving"** textarea (e.g. *Kerala Karimeen Pollichathu*, *Chicken Biryani*, *Palak Paneer*)
- Click **"Auto-Fetch Ingredients"** — AI automatically fetches the authentic required ingredients, respecting your active **Cuisine Style** and **Dietary Restrictions**
- Or just click **Generate AI Recipe** — the AI intelligently auto-selects the right ingredients and creates the full dish from scratch
- **Egg is strictly classified as Non-Vegetarian** (FSSAI standard — 🔴 Red symbol)

### 🥕 3-in-1 Flexible Ingredient Input (New!)
- **Single Mode**: Add one ingredient at a time (press Enter or `+`)
- **Multiple / Comma List Mode**: Type `Tomatoes, Garlic, Onion, Ginger` — auto-splits and adds all as separate badges
- **Bulk Textarea Mode**: Paste a full shopping list or multi-line ingredient block → click **"Parse & Add All Ingredients"**
- **Clear All** button with item count badge

### 🌍 Regional South Indian Cuisines (New!)
- Added **Kerala**, **South Indian**, **Tamil Nadu**, **Karnataka**, **Andhra**, and **North Indian** cuisine options
- Available in Recipe Generator, Settings, and database schemas
- AI recognizes and uses regional seafood terms (`karimeen`, `mathi`, `ayala`, `netholi`, `pomfret`, `crab`)

### 📋 Redesigned Recipe Detail Layout (New!)
- **Balanced 2-column grid**: Ingredient checklist (left) + Instructions / Chef Pro Tips / Nutrition (right)
- **Clean quantity formatting** — shows `4 pieces` not `4.00 pieces`
- **Quick Stats bar**: Total time, servings, calories at a glance
- **Servings Adjuster Banner**
- **Print Recipe** button

### 🧺 Smart Pantry Inventory
- Add, edit & delete pantry ingredients with quantity and unit tracking
- Automatic **Veg / Non-Veg classification** using standard Indian FSSAI symbols (🟢🔴)
- **Egg correctly classified as Non-Vegetarian**
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

### 🔐 User Authentication & Settings
- Secure JWT-based registration & login
- Password visibility toggles on all auth forms
- **Forgot Password / Reset Password** via email link
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
| **AI Engine (Primary)** | Groq Cloud — `llama-3.3-70b-versatile` (free tier, sub-second) |
| **AI Engine (Fallback 1)** | Google Gemini API (`gemini-2.0-flash` with model cascade) |
| **AI Engine (Fallback 2)** | Free Open AI Engine (`text.pollinations.ai`) |
| **Image Generation** | Pollinations AI (`image.pollinations.ai`) |
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
│   │   ├── ai.js               # Gemini AI client config
│   │   └── env.js              # Environment config
│   ├── controllers/            # Route handlers
│   │   ├── authController.js
│   │   ├── recipeController.js # generateRecipe + fetchIngredientsForDish
│   │   ├── pantryController.js
│   │   ├── mealPlanController.js
│   │   └── shoppingController.js
│   ├── middleware/             # Auth & error middleware
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── UserPreference.js   # Includes Kerala/South Indian cuisines
│   │   ├── PantryItem.js
│   │   ├── Recipe.js           # Includes Kerala/South Indian cuisine types
│   │   ├── MealPlan.js
│   │   └── ShoppingItem.js
│   ├── routes/
│   │   └── recipeRoutes.js     # /generate + /fetch-ingredients
│   ├── services/
│   │   └── aiService.js        # Multi-engine AI waterfall (Groq → Gemini → Free)
│   ├── validators/             # Input validation
│   ├── utils/
│   │   ├── apiError.js
│   │   └── sendEmail.js        # Nodemailer email service
│   ├── .env.example            # Environment variable template
│   └── server.js               # Entry point
│
└── frontend/ai-recipe-generator/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ConfirmModal.jsx
    │   │   ├── DietSymbol.jsx  # Indian FSSAI Veg/Non-Veg symbols
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── SignUp.jsx
    │   │   ├── ResetPassword.jsx          # Forgot & reset password flows
    │   │   ├── Dashboard.jsx
    │   │   ├── Pantry.jsx
    │   │   ├── RecipeGenerator.jsx        # 3-in-1 input + Dish Craving + Auto-Fetch
    │   │   ├── MyRecipes.jsx
    │   │   ├── RecipeDetail.jsx           # Redesigned 2-column grid layout
    │   │   ├── MealPlanner.jsx
    │   │   ├── ShoppingList.jsx
    │   │   └── Settings.jsx               # Includes South Indian cuisine options
    │   ├── services/                      # API service layer
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── recipeService.js           # +fetchIngredientsForDish
    │   │   ├── pantryService.js
    │   │   └── userService.js
    │   └── App.jsx
    └── index.html
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **npm** v9+
- A **MongoDB Atlas** account (free tier works)
- A **Groq API key** — free at [console.groq.com](https://console.groq.com/) *(recommended — fastest, free)*
- *(Optional)* A **Google Gemini API key** — free at [ai.google.dev](https://ai.google.dev/)

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
LLM_API_KEY=gsk_your_groq_api_key_here
PORT=8000
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> 💡 **Groq API Key** starts with `gsk_`. Get one free at [console.groq.com](https://console.groq.com/).
> If you prefer Gemini, use a key starting with `AIzaSy` — the system auto-detects which engine to use.

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
| `LLM_API_KEY` | Groq API key (`gsk_...`) or Google Gemini key (`AIzaSy...`) | ✅ Yes |
| `PORT` | Backend server port (default: 8000) | Optional |
| `NODE_ENV` | `development` or `production` | Optional |
| `EMAIL_USER` | Gmail address for sending password reset emails | Optional |
| `EMAIL_PASS` | Gmail App Password (for reset email feature) | Optional |

> ⚠️ **Never commit your `.env` file.** Use `.env.example` as a reference template only.

---

## 🤖 AI Engine Details

The system uses an automatic **waterfall fallback strategy**:

```
1. Groq Cloud  →  llama-3.3-70b-versatile  (fastest, free)
        ↓  (if unavailable)
2. Google Gemini  →  gemini-2.0-flash / 1.5-flash / 1.5-pro / 2.5-pro
        ↓  (if unavailable)
3. Free Open AI Engine  →  text.pollinations.ai
```

**Ingredient auto-fetch** also uses the same waterfall, enriched with:
- Active **Cuisine Style** (e.g. Kerala, Tamil Nadu)
- Active **Dietary Restrictions** (e.g. Vegetarian — egg excluded)

**Image generation** uses:
```
https://image.pollinations.ai/prompt/<dish + cuisine + photography style>
```
HD gourmet food photography at `800×520px` with a unique random seed per recipe.

---

## 🥚 Dietary Classification Rules

| Tag | Rule |
|---|---|
| **Non-Vegetarian** 🔴 | Meat, Poultry, Fish, Seafood, **Egg** (FSSAI standard) |
| **Vegetarian** 🟢 | No meat, poultry, fish, seafood, or egg |
| **Vegan** 🌿 | No animal products incl. dairy, egg, honey |
| **Gluten-Free** | No wheat, flour, maida, barley, rye, bread, pasta, soy sauce |
| **Dairy-Free** | No milk, cheese, cream, butter, yogurt, ghee, paneer |
| **Keto** | <10g carbs/serving; no sugar, rice, potato, bread, corn |
| **Paleo** | Whole foods only; no grains, legumes, dairy, refined sugar |

> 🔴 **Important:** Egg is classified as **Non-Vegetarian** by FSSAI standards. This app strictly enforces this rule — recipes with eggs will never be tagged as Vegetarian or Vegan.

---

## 🌍 Supported Cuisines

`Any` • `Kerala` • `South Indian` • `Tamil Nadu` • `Karnataka` • `Andhra` • `Indian` • `North Indian` • `Italian` • `Mexican` • `Chinese` • `Japanese` • `Thai` • `French` • `Mediterranean` • `American`

---

## 📸 Application Screens

| Screen | Description |
|---|---|
| **Dashboard** | Stats overview, recent recipes, upcoming meals |
| **Pantry** | Color-coded ingredient cards with Veg/Non-Veg FSSAI symbols |
| **AI Generator** | 3-in-1 ingredient input, Specific Dish Craving, auto-fetch, pantry toggle |
| **My Recipes** | Saved recipe collection with search & filters |
| **Recipe Detail** | 2-column balanced grid, serving scaler, nutrition, print |
| **Meal Planner** | 7-day weekly calendar grid |
| **Shopping List** | Smart grouped list with pantry low-stock alerts |
| **Settings** | Profile, password, dietary preferences, cuisine selection |

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

Made with ❤️ and powered by **Groq · Gemini AI · Pollinations AI**

</div>
