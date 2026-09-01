import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Pantry from "./pages/Pantry";
import RecipeGenerator from "./pages/RecipeGenerator";
import MyRecipes from "./pages/MyRecipes";
import PublicRecipes from "./pages/PublicRecipes";
import RecipeDetail from "./pages/RecipeDetail";

import ShoppingList from "./pages/ShoppingList";
import Settings from "./pages/Settings";
import MealPlanner from "./pages/MealPlanner";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/community" element={<PublicRecipes />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pantry"
            element={
              <ProtectedRoute>
                <Pantry />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generate"
            element={
              <ProtectedRoute>
                <RecipeGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes"
            element={
              <ProtectedRoute>
                <MyRecipes />
              </ProtectedRoute>
            }
          />


          <Route
            path="/meal-plan"

            element={
              <ProtectedRoute>
                <MealPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shopping-list"
            element={
              <ProtectedRoute>
                <ShoppingList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>

      {/* Dark Glassmorphism Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "rgba(15, 23, 42, 0.95)",
            color: "#f8fafc",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "1rem",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px 0 rgba(16, 185, 129, 0.15)",
            fontSize: "0.875rem",
            fontWeight: "600",
            padding: "12px 16px",
          },
          success: {
            style: {
              background: "rgba(15, 23, 42, 0.95)",
              color: "#f8fafc",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px 0 rgba(16, 185, 129, 0.25)",
            },
            iconTheme: {
              primary: "#10b981",
              secondary: "#022c22",
            },
          },
          error: {
            style: {
              background: "rgba(15, 23, 42, 0.95)",
              color: "#f8fafc",
              border: "1px solid rgba(244, 63, 94, 0.4)",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px 0 rgba(244, 63, 94, 0.25)",
            },
            iconTheme: {
              primary: "#f43f5e",
              secondary: "#4c0519",
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
