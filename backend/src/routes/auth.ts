import express from "express";
import axios from "axios";
import { initDB } from "../db";

const router = express.Router();

router.get("/slack/initiate", (req, res) => {
  const url = `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=chat:write,channels:read,groups:read,im:read,mpim:read&user_scope=&redirect_uri=${process.env.SLACK_REDIRECT_URI}`;
  res.redirect(url);
});

router.get("/slack/callback", async (req, res) => {
  const code = req.query.code;
  const db = await initDB();

  const tokenRes = await axios.post("https://slack.com/api/oauth.v2.access", null, {
    params: {
      code,
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      redirect_uri: process.env.SLACK_REDIRECT_URI
    }
  });

  const { access_token, refresh_token, authed_user } = tokenRes.data;
  const expiry = Date.now() + 3500 * 1000;

  await db.run(
    "INSERT OR REPLACE INTO tokens (user_id, access_token, refresh_token, expiry) VALUES (?, ?, ?, ?)",
    [authed_user.id, access_token, refresh_token, expiry]
  );

  res.send("Slack connected! You can close this window and go back to the app.");
});

export default router;
