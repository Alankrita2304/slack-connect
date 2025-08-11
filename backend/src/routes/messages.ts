import express from "express";
import { initDB } from "../db";
import { sendMessageToSlack } from "../slackApi";

const router = express.Router();

const getValidAccessToken = async (userId: string) => {
  const db = await initDB();
  const row = await db.get("SELECT * FROM tokens WHERE user_id = ?", userId);
  if (!row) throw new Error("No token found");
  if (row.expiry < Date.now()) {
    // TODO: Implement refresh token
  }
  return row.access_token;
};

// Send immediate
router.post("/send", async (req, res) => {
  try {
    const { user_id, channel_id, message } = req.body;
    const token = await getValidAccessToken(user_id);
    await sendMessageToSlack(token, channel_id, message);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule
router.post("/schedule", async (req, res) => {
  const db = await initDB();
  const { user_id, channel_id, message, send_at } = req.body;
  await db.run(
    "INSERT INTO scheduled_messages (user_id, channel_id, message, send_at, status) VALUES (?, ?, ?, ?, 'pending')",
    [user_id, channel_id, message, send_at]
  );
  res.json({ success: true });
});

// List
router.get("/scheduled/:user_id", async (req, res) => {
  const db = await initDB();
  const rows = await db.all(
    "SELECT * FROM scheduled_messages WHERE user_id = ? AND status = 'pending'",
    req.params.user_id
  );
  res.json(rows);
});

// Cancel
router.post("/cancel/:id", async (req, res) => {
  const db = await initDB();
  await db.run("UPDATE scheduled_messages SET status = 'cancelled' WHERE id = ?", req.params.id);
  res.json({ success: true });
});

export default router;
