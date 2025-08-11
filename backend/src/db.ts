import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const initDB = async () => {
  const db = await open({
    filename: "./slack.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tokens (
      user_id TEXT PRIMARY KEY,
      access_token TEXT,
      refresh_token TEXT,
      expiry INTEGER
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS scheduled_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      channel_id TEXT,
      message TEXT,
      send_at INTEGER,
      status TEXT
    );
  `);

  return db;
};
