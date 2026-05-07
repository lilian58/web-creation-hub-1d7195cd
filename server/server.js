import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./config/socket.js";
import "dotenv/config";

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  const server = http.createServer(app);
  initSocket(server);
  server.listen(PORT, () => {
    console.log(`🚀 SpiritLink API → http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  console.error("❌ Boot failed:", err);
  process.exit(1);
});
