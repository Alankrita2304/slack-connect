import React from "react";
import SlackConnect from "./components/SlackConnect";
import MessageForm from "./components/MessageForm";
import ScheduledList from "./components/ScheduledList";

export default function App() {
  const listRef = React.useRef<any>(null);

  const refreshList = () => {
    if (listRef.current) {
      listRef.current.fetchMessages();
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Slack Connect</h1>
      <SlackConnect />
      <MessageForm refreshList={refreshList} />
      <ScheduledList ref={listRef} />
    </div>
  );
}
