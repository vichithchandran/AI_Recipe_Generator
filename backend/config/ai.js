import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './env.js';

let genAI = null;

if (env.LLM_API_KEY) {
  genAI = new GoogleGenerativeAI(env.LLM_API_KEY);
}

export default genAI;
