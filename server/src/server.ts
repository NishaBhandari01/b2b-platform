// Server setup with Socket.io
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

dotenv.config();

import { execSync } from "child_process";
import prisma from "./config/db.js";
import app from "./app.js";
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

io.use(async (socket, next) => {
  try {
    const cookies = parse(socket.handshake.headers.cookie || "");

    const token = cookies.accessToken;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev-access-secret",
    ) as {
      id: string;
      role: string;
    };

    socket.data.user = decoded;

    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

// In-memory presence map (userId → Set of socket ids)
const onlineUsers = new Map<string, Set<string>>();

io.on("connection", async (socket) => {
  const user = socket.data.user as { id: string; role: string };
  console.log("🔌 New client connected", socket.id, user?.id);

  if (user?.id) {
    // Join personal room so we can target this user later if needed
    socket.join(`user:${user.id}`);

    // Track presence
    if (!onlineUsers.has(user.id)) {
      onlineUsers.set(user.id, new Set());
    }
    onlineUsers.get(user.id)!.add(socket.id);

    // First socket for this user → they just came online
    if (onlineUsers.get(user.id)!.size === 1) {
      // Persist online status
      await prisma.user
        .update({
          where: { id: user.id },
          data: { isOnline: true, lastSeen: null },
        })
        .catch(() => {});

      // Notify everyone (or you can narrow later)
      io.emit("user:online", { userId: user.id });
    }
  }

  socket.on("joinRfQ", (rfqId: string) => {
    socket.join(`rfq:${rfqId}`);
  });

  socket.on("joinConversation", (conversationId: string) => {
    socket.join(`conversation:${conversationId}`);
  });

  socket.on("disconnect", async () => {
    console.log("📴 Client disconnected", socket.id);

    if (!user?.id) return;

    const sockets = onlineUsers.get(user.id);
    if (!sockets) return;

    sockets.delete(socket.id);

    // Last socket gone → user is offline
    if (sockets.size === 0) {
      onlineUsers.delete(user.id);
      const lastSeen = new Date();

      await prisma.user
        .update({
          where: { id: user.id },
          data: { isOnline: false, lastSeen },
        })
        .catch(() => {});

      io.emit("user:offline", { userId: user.id, lastSeen });
    }
  });
});

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
