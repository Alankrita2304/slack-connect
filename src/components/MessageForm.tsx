import React, { useState } from "react";
import { sendMessage, scheduleMessage } from "../api";

const userId = import.meta.env.VITE_USER_ID;

export default function MessageForm({ refreshList }: { refreshList: () => void }) {
  const [channelId, setChannelId] = useState("");
  const [message, setMessage] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelId || !message) return;

    if (isScheduled && dateTime) {
      await scheduleMessage({
        user_id: userId,
        channel_id: channelId,
        message,
        send_at: new Date(dateTime).getTime()
      });
    } else {
      await sendMessage({
        user_id: userId,
        channel_id: channelId,
        message
      });
    }

    setMessage("");
    setDateTime("");
    setIsScheduled(false);
    refreshList();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <div>
        <input
          placeholder="Slack Channel ID"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
        />
      </div>
      <div>
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isScheduled}
            onChange={(e) => setIsScheduled(e.target.checked)}
          />
          Schedule?
        </label>
      </div>
      {isScheduled && (
        <div>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </div>
      )}
      <button type="submit">
        {isScheduled ? "Schedule Message" : "Send Now"}
      </button>
    </form>
  );
}
