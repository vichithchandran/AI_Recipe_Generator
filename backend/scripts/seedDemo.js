/**
 * Re-seeds the shared demo account's data.
 *
 *   npm run seed:demo         re-seed now, unconditionally
 *   npm run seed:demo -- --if-stale   re-seed only if past the reset window
 *
 * Intended for a scheduled job. On Windows use Task Scheduler; on Linux, cron:
 *   0 * * * * cd /path/to/backend && npm run seed:demo >> demo-reset.log 2>&1
 *
 * The app also self-heals on demo login, so this script is belt-and-braces
 * for keeping the account tidy when nobody has visited for a while.
 */
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import {
  ensureDemoUser,
  seedDemoData,
  isDemoDataStale,
  DEMO_EMAIL,
  DEMO_RESET_MINUTES,
} from '../services/demoService.js';

const onlyIfStale = process.argv.includes('--if-stale');

const run = async () => {
  if (!env.MONGO_URI) {
    console.error('MONGO_URI is not set. Add it to backend/.env before running this.');
    process.exit(1);
  }

  try {
    await mongoose.connect(env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log(`Connected to ${mongoose.connection.host}`);

    const { user, seeded } = await ensureDemoUser();

    if (seeded) {
      console.log(`Created and seeded the demo account (${DEMO_EMAIL}).`);
      process.exit(0);
    }

    if (onlyIfStale && !isDemoDataStale(user)) {
      const age = Math.round((Date.now() - new Date(user.demo_reset_at).getTime()) / 60000);
      console.log(`Demo data is ${age} min old (window is ${DEMO_RESET_MINUTES} min) — nothing to do.`);
      process.exit(0);
    }

    const counts = await seedDemoData(user._id);
    console.log(`Re-seeded ${DEMO_EMAIL}:`);
    console.log(`  ${counts.recipes} recipes`);
    console.log(`  ${counts.pantryItems} pantry items`);
    console.log(`  ${counts.mealPlans} planned meals`);
    console.log(`  ${counts.shoppingItems} shopping list items`);
    process.exit(0);
  } catch (error) {
    console.error('Demo seed failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
};

run();
