import axios from "axios";

export const refreshSlackToken = async (refreshToken: string) => {
  const res = await axios.post("https://slack.com/api/oauth.v2.access", null, {
    params: {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET
    }
  });
  return res.data;
};

export const sendMessageToSlack = async (accessToken: string, channelId: string, text: string) => {
  await axios.post(
    "https://slack.com/api/chat.postMessage",
    { channel: channelId, text },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};
