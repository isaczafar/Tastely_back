import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class Database {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async connect() {
    try {
      await this.pool.connect();
      console.log('Connected to the database');
    } catch (error) {
      console.error('Error connecting to the database', error);
    }
  }
}
