# 🍳 AI Recipe Generator

<div align="center">

![AI Recipe Generator Banner](https://img.shields.io/badge/AI%20Recipe%20Generator-Full%20Stack-10b981?style=for-the-badge&logo=react&logoColor=white)

A **full-stack intelligent recipe management platform** powered by **Groq (Llama 3.3 70B)**, **Google Gemini AI** & free open AI engines. Generate personalized recipes by typing any dish craving or using your pantry ingredients, add custom recipes with AI nutrition calculation, manage inventory in bulk, plan weekly meals, and build smart shopping lists — all in one premium dark-themed workspace.

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
- Auto-resets form inputs upon successful recipe generation for a clean repeat flow

### 📝 Custom Recipe Creation & Management (New!)
- **Add Your Own Recipes**: Create custom recipes directly in **My Recipes**
- **Ingredients Used**: Add custom ingredients with specific quantities and units (`g`, `kg`, `ml`, `l`, `pcs`, `cups`, `tbsp`, `tsp`)
- **Dish Photography**: Upload/paste dish image URL or click **`✨ AI Generate Image`** to automatically create gourmet food photos
- **Step-by-Step Instructions**: Add numbered cooking instructions
- **Video References**: Attach YouTube cooking tutorial URLs with video badges & reference player card on detail pages
- **⚡ AI Nutrition per Serving Calculator**: One-click AI calculation of Calories, Protein, Carbs, Fats, and Fiber
- **Dietary Categories**: Tag recipes with Non-Vegetarian 🔴, Vegetarian 🟢, Vegan, Gluten-Free, Dairy-Free, Keto, Paleo with FSSAI indicator symbols

### 🇮🇳 All Indian State & Regional Cuisines (New!)
- Comprehensive support for all **28+ Indian States & Regional Cuisines**:
  - *Kerala, South Indian, Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, North Indian, Punjabi, Bengali (West Bengal), Maharashtrian, Gujarati, Rajasthani, Goan, Kashmiri, Odia (Odisha), Assamese, Bihari, Hyderabadi, Chettinad, Awadhi / Mughlai, Himachali, Uttarakhand / Kumaoni, Naga, Manipuri, Meghalayan, Sikkimese, Indo-Chinese*
  - International cuisines: *Italian, Mexican, Chinese, Japanese, Thai, French, Mediterranean, American, Other*

### 🧺 Bulk Pantry Inventory Entry (New!)
- Add individual items or add **multiple pantry items in one go** (`AddItemModal`)
- **Quick Text Paste & Smart Parser**: Paste text lists like `Tomatoes, 2kg Rice, Garlic, Milk, 500g Sugar` — parses into structured item rows
- **Dynamic Multi-Row Editor**: Edit name, quantity, unit, and category for multiple items before bulk saving (`insertMany`)
- Color-coded status borders:
  - 🔴 **Red** — Expired items
  - 🟡 **Amber** — Expiring within 7 days
  - 🟠 **Orange** — Running low on stock
  - 🟢 **Emerald** — Fresh & in stock

### 🛒 Smart Shopping List & Pre-Transfer Editing (New!)
- **Unified Action Bar**: High-contrast styled buttons (`Add Item`, `Transfer to Pantry (X)`, `Clear Checked Items (X)`)
- **Pre-Transfer Quantity Modifier**: Quick `+` / `-` buttons and full edit modal on shopping list items to adjust quantities (e.g. 1kg → 2kg) before transferring to pantry
- **Category Synchronization**: Standardized categories (`Vegetables`, `Fruits`, `Dairy`, `Meat`, `Grains`, `Spices`, `Beverages`, `Other`) matching Pantry
- **Low-Stock Warning Auto-Clear**: Transferring items to pantry automatically resets `is_running_low: false`, immediately clearing low-stock warning banners

### 🍽️ Specific Dish Craving
- Type any specific dish in the **"Specific Dish Craving"** textarea (e.g. *Kerala Karimeen Pollichathu*, *Palak Paneer*)
- Click **"Auto-Fetch Ingredients"** — AI automatically fetches authentic required ingredients, respecting active **Cuisine Style** and **Dietary Restrictions**
- **Egg is strictly classified as Non-Vegetarian** (FSSAI standard — 🔴 Red symbol)

### 📅 Weekly Meal Planner
- Visual 7-day calendar grid (Breakfast, Lunch, Dinner, Snack)
- Clean, modern layout without emojis
- Schedule saved recipes to any day/meal slot
- Navigate between weeks with instant DB sync

### 📋 Redesigned Recipe Detail Layout
- **Balanced 2-column grid**: Ingredient checklist (left) + Instructions / Video Reference / Chef Pro Tips / Nutrition (right)
- **Servings Adjuster Banner** — ingredient quantities automatically scale
- **Print Recipe** button

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
│   │   ├── recipeController.js # generateRecipe, createRecipe, calculateNutrition
│   │   ├── pantryController.js # getPantryItems, addPantryItem (single + bulk)
│   │   ├── mealPlanController.js
│   │   └── shoppingListController.js # transferToPantry, updateShoppingItem
│   ├── middleware/             # Auth & error middleware
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── PantryItem.js
│   │   ├── Recipe.js           # video_url, nutrition, ingredients, instructions
│   │   ├── MealPlan.js
│   │   └── ShoppingListItem.js
│   ├── routes/
│   │   └── recipeRoutes.js     # /generate, /fetch-ingredients, /calculate-nutrition
│   ├── services/
│   │   └── aiService.js        # Multi-engine AI waterfall & calculateNutritionFromAI
│   └── server.js               # Entry point
│
└── frontend/ai-recipe-generator/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ConfirmModal.jsx
    │   │   └── DietSymbol.jsx  # Indian FSSAI Veg/Non-Veg symbols
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── SignUp.jsx
    │   │   ├── ResetPassword.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Pantry.jsx         # Single & Bulk Add Multi-Item Modal
    │   │   ├── RecipeGenerator.jsx# 3-in-1 input + Dish Craving + Image Fallback
    │   │   ├── MyRecipes.jsx      # Add Custom Recipe + AI Nutrition + Video URL
    │   │   ├── RecipeDetail.jsx   # Video Reference player card + 2-column grid
    │   │   ├── MealPlanner.jsx
    │   │   └── ShoppingList.jsx   # Pre-transfer quantity edit + Category sync
    │   ├── services/
    │   │   ├── recipeService.js   # calculateNutrition, createRecipe
    │   │   ├── pantryService.js
    │   │   └── shoppingListService.js
    │   └── App.jsx
    └── index.html
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **npm** v9+
- A **MongoDB Atlas** account
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

Create `.env` file:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_256bit_random_secret
LLM_API_KEY=gsk_your_groq_api_key_here
PORT=8000
NODE_ENV=development
```

Start backend:

```bash
npm start
```

The API will run at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd ../frontend/ai-recipe-generator
npm install
npm run dev
```

App runs at `http://localhost:5173`

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

> 🔴 **Important:** Egg is classified as **Non-Vegetarian** by FSSAI standards.

---

## 📸 Application Screens

| Screen | Description |
|---|---|
| **Dashboard** | Stats overview, recent recipes, upcoming meals |
| **Pantry** | Single & Bulk multi-item addition, FSSAI Veg/Non-Veg status cards |
| **AI Generator** | 3-in-1 ingredient input, Specific Dish Craving, auto-fetch, image loading fallback |
| **My Recipes** | Custom recipe creator, AI nutrition calculator, video URLs, All Indian state cuisines filter |
| **Recipe Detail** | 2-column balanced grid, video reference card, serving scaler, print |
| **Meal Planner** | 7-day weekly calendar grid without emojis |
| **Shopping List** | Smart grouped list with pre-transfer quantity editing (+/-) & pantry transfer |
| **Settings** | Profile, password, dietary preferences, cuisine selection |

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Vichith Chandran**

[![GitHub](https://img.shields.io/badge/GitHub-vichithchandran-181717?style=flat-square&logo=github)](https://github.com/vichithchandran)
