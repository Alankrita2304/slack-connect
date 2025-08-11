import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth";
import messageRoutes from "./routes/messages";
import { startScheduler } from "./scheduler";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
  startScheduler();
});
