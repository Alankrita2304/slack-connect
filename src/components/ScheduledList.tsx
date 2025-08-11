import React, { useEffect, useState } from "react";
import { getScheduledMessages, cancelScheduledMessage } from "../api";

const userId = import.meta.env.VITE_USER_ID;

export default function ScheduledList() {
  const [messages, setMessages] = useState<any[]>([]);

  const fetchMessages = async () => {
    const res = await getScheduledMessages(userId);
    setMessages(res.data);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const cancelMsg = async (id: number) => {
    await cancelScheduledMessage(id);
    fetchMessages();
  };

  return (
    <div>
      <h3>Scheduled Messages</h3>
      {messages.length === 0 && <p>No scheduled messages</p>}
      {messages.map((m) => (
        <div key={m.id}>
          <p>
            <strong>Channel:</strong> {m.channel_id}
          </p>
          <p>{m.message}</p>
          <p>
            <strong>Send At:</strong>{" "}
            {new Date(m.send_at).toLocaleString()}
          </p>
          <button onClick={() => cancelMsg(m.id)}>Cancel</button>
          <hr />
        </div>
      ))}
    </div>
  );
}
