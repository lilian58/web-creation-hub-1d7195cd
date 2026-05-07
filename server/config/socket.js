import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_ORIGIN?.split(",") ?? "*", credentials: true },
  });

  // Authentification socket via JWT
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Auth requise"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (e) {
      next(new Error("Token invalide"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.userId}`);

    socket.on("conversation:join", (conversationId) => {
      socket.join(`conv:${conversationId}`);
    });

    socket.on("conversation:leave", (conversationId) => {
      socket.leave(`conv:${conversationId}`);
    });

    // Message texte temps réel
    socket.on("message:send", async ({ conversationId, body, type = "text" }, ack) => {
      try {
        const msg = await Message.create({
          conversation: conversationId,
          sender: socket.userId,
          type,
          body,
        });
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: msg._id,
          lastMessageAt: new Date(),
        });
        io.to(`conv:${conversationId}`).emit("message:new", msg);
        ack?.({ ok: true, message: msg });
      } catch (err) {
        ack?.({ ok: false, error: err.message });
      }
    });

    // Indicateurs de frappe
    socket.on("typing", ({ conversationId, isTyping }) => {
      socket.to(`conv:${conversationId}`).emit("typing", {
        userId: socket.userId,
        isTyping,
      });
    });

    // Signalisation WebRTC pour appels audio/vidéo
    socket.on("call:offer", ({ to, offer, callType, callId }) => {
      io.to(`user:${to}`).emit("call:incoming", {
        from: socket.userId,
        offer,
        callType,
        callId,
      });
    });
    socket.on("call:answer", ({ to, answer, callId }) => {
      io.to(`user:${to}`).emit("call:answered", { from: socket.userId, answer, callId });
    });
    socket.on("call:ice", ({ to, candidate, callId }) => {
      io.to(`user:${to}`).emit("call:ice", { from: socket.userId, candidate, callId });
    });
    socket.on("call:hangup", ({ to, callId }) => {
      io.to(`user:${to}`).emit("call:hangup", { from: socket.userId, callId });
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO non initialisé");
  return io;
};
