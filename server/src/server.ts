// Server setup with Socket.io
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { execSync } from "child_process";
import prisma from "./config/db.js";
import app from "./app.js";

dotenv.config();

// Create HTTP server and attach Socket.io
const httpServer = http.createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true,
  },
});

// Attach io to app so controllers can emit events via req.app.get('io')
app.set("io", io);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("🔌 New client connected", socket.id);

  // Join an RFQ room (legacy – kept for backward compat)
  socket.on("joinRfQ", (rfqId: string) => {
    socket.join(`rfq:${rfqId}`);
    console.log(`Client ${socket.id} joined RFQ room rfq:${rfqId}`);
  });

  // Join a conversation room – used for real-time chat
  socket.on("joinConversation", (conversationId: string) => {
    socket.join(`conversation:${conversationId}`);
    console.log(
      `Client ${socket.id} joined conversation room conversation:${conversationId}`,
    );
  });

  socket.on("disconnect", () => {
    console.log("📴 Client disconnected", socket.id);
  });
});

// Ensure DB schema is up‑to‑date
// try {
//   if (process.env.NODE_ENV !== "production") {
//     console.log("⏳ Applying Prisma schema to the database...");
//     execSync("npx prisma db push --schema prisma/schema.prisma", {
//       stdio: "inherit",
//     });
//   }
// } catch (err) {
//   console.error("⚠️ Prisma db push failed:", err);
// }

// Test DB connection
async function testDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
}

testDB();

let port = Number(process.env.PORT) || 5000;
const startServer = () => {
  httpServer
    .listen(port, () => {
      console.log(`Server running on ${port}`);
    })
    .on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`Port ${port} already in use, trying ${port + 1}`);
        port += 1;
        startServer();
      } else {
        console.error("Server error:", err);
      }
    });
};
startServer();
