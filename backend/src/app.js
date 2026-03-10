import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

app.use("/api/v1/users", userRoutes);

const start = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is not set.");
  }

  const connectionDb = await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${connectionDb.connection.host}`);

  server.listen(app.get("port"), () => {
    console.log(`Server listening on port ${app.get("port")}`);
  });
};

start().catch((err) => {
  console.error("Server startup error:", err.message);
  process.exit(1);
});