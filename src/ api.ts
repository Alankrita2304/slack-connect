import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

export const initiateSlackAuth = () => {
  window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/slack/initiate`;
};

export const sendMessage = (data: any) =>
  API.post("/messages/send", data);

export const scheduleMessage = (data: any) =>
  API.post("/messages/schedule", data);

export const getScheduledMessages = (user_id: string) =>
  API.get(`/messages/scheduled/${user_id}`);

export const cancelScheduledMessage = (id: number) =>
  API.post(`/messages/cancel/${id}`);
