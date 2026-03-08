import { db } from './db';

async function seed() {
  console.log('[Seed] Initializing database...');
  await db.initialize();
  console.log('[Seed] Database seeded successfully');
}

seed().catch(console.error);
