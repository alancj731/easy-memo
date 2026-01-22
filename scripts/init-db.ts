import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.NEXT_PUBLIC_DATABASE_URL;

if (!databaseUrl) {
  console.error('NEXT_PUBLIC_DATABASE_URL is not defined in .env file');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS memo (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log('Memo table created or already exists');
  } catch (error) {
    console.error('Error creating memo table:', error);
    process.exit(1);
  }
}

initializeDatabase();
