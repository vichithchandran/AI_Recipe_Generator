import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import pantryRoutes from './routes/pantryRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import mealPlanRoutes from './routes/mealPlanRoutes.js';
import shoppingListRoutes from './routes/shoppingListRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();

// Connect to Database
connectDB();

// Dynamic CORS configuration allowing localhost origins on any port in development
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
    const isConfiguredOrigin = env.CORS_ORIGIN && (env.CORS_ORIGIN === '*' || env.CORS_ORIGIN.split(',').includes(origin));

    if (env.NODE_ENV === 'development' || isLocalhost || isConfiguredOrigin) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy error: Origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Server running',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pantry', pantryRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/shopping-list', shoppingListRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
