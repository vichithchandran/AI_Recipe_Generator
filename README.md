# 🍳 AI Recipe Generator

<div align="center">

![AI Recipe Generator Banner](https://img.shields.io/badge/AI%20Recipe%20Generator-Full%20Stack-10b981?style=for-the-badge&logo=react&logoColor=white)

A **full-stack intelligent recipe management platform & public community hub** powered by **Groq (Llama 3.3 70B)**, **Google Gemini AI** & free open AI engines. Discover public community recipes, generate personalized dishes by typing cravings or pantry ingredients, toggle public recipe sharing, plan weekly meals, and build smart shopping lists — all in one premium dark-themed workspace.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/atlas)
[![Groq AI](https://img.shields.io/badge/Groq-Llama%203.3%2070B-FF4500?style=flat-square&logo=lightning)](https://console.groq.com/)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## ✨ Key Features

### 🌐 Modern Public Landing Page & Open Access
- **Public Home Page (`/`)**: Engaging landing page featuring platform capabilities, a 3-step how-it-works overview, platform stats, and a **Live Public Community Recipe Showcase**.
- **Public Community Showcase (`/community`)**: Open showcase displaying public recipes shared by community members worldwide.
- **Search & Filters**: Search community recipes by dish name or ingredient, and filter by cuisine type or difficulty.
- **1-Click Recipe Cloning**: Unauthenticated or authenticated visitors can clone any public recipe into their own personal collection with 1 click.
- **Shareable Public Links**: Generate and copy direct share URLs (`/recipes/:id`) with instant clipboard toast notifications.

### 🔒 Public / Private Recipe Controls & Automatic Deduplication
- **Toggle Visibility**: Toggle any recipe between **Public 🌐** and **Private 🔒** directly from recipe cards or detail views.
- **Automatic Database Deduplication**: Intelligent query optimization automatically merges duplicate recipe records in MongoDB, keeping and prioritizing entries with cover photos while purging duplicate test records.

### 🤖 AI-Powered Recipe Generation (Multi-Engine Waterfall)
- Generate custom recipes using **Groq (Llama 3.3 70B)** → **Google Gemini AI** → **Free Open AI Engine** (automatic waterfall fallback)
- **100% AI-generated** — zero hardcoded/mock recipes
- Pull directly from your pantry inventory (non-expired items only)
- Customize cuisine type, dietary restrictions, servings & cooking time
- AI strictly avoids recommending expired or spoiled ingredients
- Generates gourmet **HD food photography images** for every recipe automatically via Pollinations AI

### 🖨️ Recipe Print Optimization (`@media print`)
- Clean physical printing formatted for white paper.
- Universal color override fixes (`*, *::before, *::after { color: #0f172a !important; -webkit-text-fill-color: #0f172a !important; }`) eliminating invisible white text on printouts.
- Unconstrained viewport heights (`min-height: 0 !important; overflow: visible !important;`) preventing multi-page blank page stretching artifacts.
- Print-only header with branding, print date, servings count, and prep/cook time.

### 📝 Custom Recipe Creation & Combo Meals
- **Add Single Dish or Combo Meals**: Choose between a **Single Dish Recipe** or a **Combo Meal (Multi-Item)** (e.g., Thalis, Burger & Fries combos, Breakfast sets)
- **Multi-Item Combo Management**: Create and manage individual dish items (*Item 1: Butter Chicken*, *Item 2: Garlic Naan*, *Item 3: Jeera Rice*)
- **AI Auto-Fetch Item Ingredients**: One-click AI ingredient auto-fetch per individual dish item or single dish recipe name
- **Itemized Combo Recipe Detail Page**: Interactive dish tabs allowing users to view ingredients and cooking steps per dish item or view all combined
- **AI Nutrition per Serving Calculator**: One-click AI calculation of Calories, Protein, Carbs, Fats, and Fiber across single or combo meal ingredients

### 🇮🇳 All Indian State & Regional Cuisines
- Comprehensive support for all **28+ Indian States & Regional Cuisines**:
  - *Kerala, South Indian, Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, North Indian, Punjabi, Bengali (West Bengal), Maharashtrian, Gujarati, Rajasthani, Goan, Kashmiri, Odia (Odisha), Assamese, Bihari, Hyderabadi, Chettinad, Awadhi / Mughlai, Himachali, Uttarakhand / Kumaoni, Naga, Manipuri, Meghalayan, Sikkimese, Indo-Chinese*
  - International cuisines: *Italian, Mexican, Chinese, Japanese, Thai, French, Mediterranean, American, Other*

### 🧺 Bulk Pantry Inventory Entry & Smart Shopping List
- Add individual items or add **multiple pantry items in one go** (`AddItemModal`)
- **Quick Text Paste & Smart Parser**: Paste text lists like `Tomatoes, 2kg Rice, Garlic, Milk, 500g Sugar` — parses into structured item rows
- **Pre-Transfer Quantity Modifier**: Adjust quantities on shopping list items before transferring to pantry
- **Low-Stock Warning Auto-Clear**: Transferring items to pantry automatically resets low-stock warnings

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 7, TailwindCSS v4 |
| **UI Components** | Lucide Icons, React Hot Toast |
| **Backend** | Node.js, Express.js (ESM) |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **AI Engine (Primary)** | Groq Cloud — `llama-3.3-70b-versatile` |
| **AI Engine (Fallback 1)** | Google Gemini API (`gemini-2.0-flash`) |
| **AI Engine (Fallback 2)** | Free Open AI Engine (`text.pollinations.ai`) |
| **Image Generation** | Pollinations AI (`image.pollinations.ai`) |
| **Authentication** | JWT (256-bit secret), bcryptjs |
| **Routing** | React Router DOM v7 |

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
│   │   ├── recipeController.js # getPublicRecipes, cloneRecipe, deduplicateRecipes
│   │   ├── pantryController.js
│   │   ├── mealPlanController.js
│   │   └── shoppingListController.js
│   ├── middleware/             # Auth & optionalAuth middleware
│   ├── models/                 # Mongoose schemas
│   ├── routes/
│   │   └── recipeRoutes.js     # /public, /:id/clone, /:id/toggle-public
│   ├── services/
│   │   └── aiService.js        # Multi-engine AI waterfall
│   └── server.js               # Entry point
│
└── frontend/ai-recipe-generator/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx      # Responsive nav with public/private states
    │   │   └── DietSymbol.jsx  # Indian FSSAI Veg/Non-Veg symbols
    │   ├── pages/
    │   │   ├── LandingPage.jsx    # Public home page & live community showcase
    │   │   ├── PublicRecipes.jsx  # Community public recipe exploration & cloning
    │   │   ├── Login.jsx          # 100vh viewport height optimized
    │   │   ├── SignUp.jsx         # 100vh viewport height optimized
    │   │   ├── Dashboard.jsx
    │   │   ├── Pantry.jsx
    │   │   ├── RecipeGenerator.jsx# AI recipe generator with save state
    │   │   ├── MyRecipes.jsx      # Public toggle & share link copy
    │   │   ├── RecipeDetail.jsx   # Public share & @media print support
    │   │   ├── MealPlanner.jsx
    │   │   └── ShoppingList.jsx
    │   └── App.jsx
    └── index.html
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **npm** v9+
- A **MongoDB Atlas** database
- A **Groq API key** — free at [console.groq.com](https://console.groq.com/)
- *(Optional)* A **Google Gemini API key** — free at [ai.google.dev](https://ai.google.dev/)

### 1. Clone & Install

```bash
git clone https://github.com/vichithchandran/AI_Recipe_Generator.git
cd AI_Recipe_Generator
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `/backend`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_256bit_random_secret
LLM_API_KEY=gsk_your_groq_api_key_here
PORT=8000
NODE_ENV=development
```

Run backend:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd ../frontend/ai-recipe-generator
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Vichith Chandran**

[![GitHub](https://img.shields.io/badge/GitHub-vichithchandran-181717?style=flat-square&logo=github)](https://github.com/vichithchandran)
