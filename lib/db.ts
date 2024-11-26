import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db: any = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: './todo.db',
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  return db;
} 