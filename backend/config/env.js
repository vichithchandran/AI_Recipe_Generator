import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  LLM_API_KEY: process.env.LLM_API_KEY,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
