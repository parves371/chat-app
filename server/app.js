import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { v4 as uuid } from "uuid";
import { errrorMiddleware } from "./middlewares/error.js";
import { connectDB } from "./utils/featurs.js";

import {
  CHAT_jOINED,
  CHAT_lEAVED,
  FEFETCH_CHATS,
  NEW_MASSAGE,
  NEW_MASSAGES,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
} from "./constants/event.js";
import { corsOpstions } from "./lib/config.js";
import { getSockets } from "./lib/helper.js";
import { isSocketAuthenticated } from "./middlewares/auth.js";
import { Message } from "./models/massages.model.js";

import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config({
  path: "./.env",
});
// routes
import amninRoutes from "./routes/admin.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import userRoutes from "./routes/user.routes.js";

const mongoUrI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
const userSocketIDs = new Map();
const onlineUsers = new Set();

// connect to database
connectDB(mongoUrI);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// create express app
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsOpstions,
});

app.set("io", io); // set io to app
// using middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOpstions));
// all routes are here
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/admin", amninRoutes);

// home route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//  connect to socket.io
io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, async (err) => {
    await isSocketAuthenticated(err, socket, next);
  });
});
io.on("connection", (socket) => {
  const user = socket.user;

  userSocketIDs.set(user._id.toString(), socket.id);
  // console.log(userSocketIDs);

  socket.on(NEW_MASSAGES, async ({ chatId, members, message }) => {
    const realTimeMessage = {
      _id: uuid(),
      content: message,
      sender: {
        _id: user._id,
        name: user.name,
      },
      chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDb = {
      content: message,
      chatId,
      sender: user._id,
    };

    const membersSockets = getSockets(members);

    io.to(membersSockets).emit(NEW_MASSAGES, {
      message: realTimeMessage,
      chatId,
    });

    io.to(membersSockets).emit(NEW_MASSAGE, { chatId }); // message alert
    io.to(membersSockets).emit(FEFETCH_CHATS, { chatId }); // REFETCH alert

    try {
      await Message.create(messageForDb);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on(START_TYPING, ({ chatId, members }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(START_TYPING, { chatId });
  });

  socket.on(STOP_TYPING, ({ chatId, members }) => {
    console.log("stop typing");
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(STOP_TYPING, { chatId });
  });

  socket.on(CHAT_jOINED, async ({ userId, members }) => {
    onlineUsers.add(userId.toString());

    const membersSockets = getSockets(members);
    io.to(membersSockets).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on(CHAT_lEAVED, async ({ userId, members }) => {
    onlineUsers.delete(userId.toString());

    const membersSockets = getSockets(members);
    io.to(membersSockets).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    userSocketIDs.delete(user._id.toString());
  });
});

// error middleware
app.use(errrorMiddleware);
server.listen(port, () => {
  console.log(
    `Server is running on port ${port} in ${process.env.NODE_ENV} mode`
  );
});

export { userSocketIDs };
