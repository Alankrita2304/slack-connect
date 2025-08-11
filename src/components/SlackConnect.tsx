import React from "react";
import { initiateSlackAuth } from "../api";

export default function SlackConnect() {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <button onClick={initiateSlackAuth}>Connect to Slack</button>
    </div>
  );
}
