import * as dotenv from "dotenv";
// const express = require("express");
import express from "express";
import cors from "cors";
// const OpenAi = require("openai");
// const mongoose = require("mongoose");
import mongoose from "mongoose";
// import router from "./routes/testRoute.js";
import userRouter from "./routes/userRoute.js";
import router from "./routes/testroute.js";
import chatRouter from "./routes/chatRoute.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import session from "express-session";
import OpenAI from "openai";

dotenv.config();
const app = express();
const port = 3001;
const server = createServer(app);

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   })
// );

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let userCount = 0;

io.on("connection", (socket) => {
  console.log(`새 클라이언트 연결: ${socket.id}`);
  userCount++; // 접속자 수 증가
  console.log(`총 접속자 수: ${userCount}`);

  if (userCount === 1) {
    const botMessage = {
      sender: "AI Bot",
      message:
        "안녕하세요! 저는 AI 챗봇입니다. 질문이 있다면 언제든지 물어보세요.",
    };

    // 모든 클라이언트에게 봇 메시지 전송
    io.emit("showNewMessage", botMessage);
  }

  io.emit("userCount", userCount);

  socket.on("joinRoom", (roomName) => {
    console.log(`User joined room: ${roomName}`);
    socket.join(roomName);
  });

  socket.on("joinRoom", (roomName) => {
    console.log(`User joined room: ${roomName}`);
    socket.join(roomName);
  });

  // 메시지 브로드캐스트
  socket.on("sendNewMessage", async (data) => {
    const { roomName, message } = data;
    console.log(`Message received in room ${roomName}:`, data);

    // 메시지를 해당 방에 있는 모든 사용자에게 전송
    io.to(roomName).emit("showNewMessage", data);

    if (userCount === 1) {
      const botResponse = await getBotResponse(message); // OpenAI 응답 호출
      const botMessage = {
        userName: "AI Bot",
        message: botResponse,
        emoji: botResponse,
        roomName: "globalRoom",
      };
      console.log("botMessage", botMessage);

      io.to(roomName).emit("showNewMessage", botMessage);
    }
  });

  socket.on("disconnect", () => {
    userCount--; // 접속자 수 감소
    console.log(`클라이언트 연결 해제: ${socket.id}`);
    console.log(`총 접속자 수: ${userCount}`);

    io.emit("userCount", userCount);
  });
});

async function getBotResponse(userMessage) {
  console.log("running getBotResponse");
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // OpenAI 모델
      messages: [{ role: "user", content: userMessage }],
      max_tokens: 50, // 더 짧은 답변
      temperature: 0.3, // 낮은 값으로 설정
    });

    return response.choices[0].message.content; // OpenAI 응답 텍스트 반환
  } catch (error) {
    console.error("Error while fetching bot response:", error);
    return "죄송합니다, 요청을 처리할 수 없습니다.";
  }
}

const startServer = () => {
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

const loadRoutes = () => {
  app.use("/api", router);
  app.use("/api/user", userRouter);
  app.use("/api/chat", chatRouter);
  // app.use
  // app.use("/api/user", userRouter);
  // app.use("/api/chat", chatRouter);
};

const addMiddlewares = () => {
  app.use(express.json());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
};

// app.post("");

const DBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("connection established");
  } catch (error) {
    console.log(error);
  }
};

const startApp = async () => {
  await DBConnection();
  addMiddlewares();
  loadRoutes();
  startServer();
};

startApp();
