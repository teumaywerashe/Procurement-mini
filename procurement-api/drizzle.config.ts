import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

console.log('DATABASE URL:', process.env.DATABASE_URL);

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema/*.schema.ts',
  out: './src/database/drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
