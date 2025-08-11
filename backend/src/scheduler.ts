import { initDB } from "./db";
import { sendMessageToSlack } from "./slackApi";

export const startScheduler = async () => {
  setInterval(async () => {
    const db = await initDB();
    const now = Date.now();
    const dueMessages = await db.all(
      "SELECT * FROM scheduled_messages WHERE send_at <= ? AND status = 'pending'",
      now
    );
    for (const msg of dueMessages) {
      try {
        const tokenRow = await db.get("SELECT access_token FROM tokens WHERE user_id = ?", msg.user_id);
        await sendMessageToSlack(tokenRow.access_token, msg.channel_id, msg.message);
        await db.run("UPDATE scheduled_messages SET status = 'sent' WHERE id = ?", msg.id);
      } catch (err) {
        console.error("Error sending scheduled message", err);
      }
    }
  }, 60000); // every minute
};
