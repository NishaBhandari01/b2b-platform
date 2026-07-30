"use client";

import { useEffect, useRef } from "react";
import socketIO from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const socketRef = useRef<ReturnType<typeof socketIO> | null>(null);

  useEffect(() => {
    const socket = socketIO(API_URL, {
      withCredentials: true,
    } as any);

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Global socket connected", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("📴 Global socket disconnected");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
