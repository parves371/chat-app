import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./utils/featurs.js";
import { errrorMiddleware } from "./middlewares/error.js";
import { v4 as uuid } from "uuid";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

import { NEW_MASSAGE, NEW_MASSAGES } from "./constants/event.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/massages.model.js";
import { corsOpstions } from "./lib/config.js";
import { isSocketAuthenticated } from "./middlewares/auth.js";

import { Server } from "socket.io";
import { createServer } from "http";
dotenv.config({
  path: "./.env",
});
// routes
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import amninRoutes from "./routes/admin.routes.js";

const mongoUrI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
const userSocketIDs = new Map();

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
  console.log(userSocketIDs);

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
    // console.log("emmiting", realTimeMessage);
    const membersSockets = getSockets(members);

    io.to(membersSockets).emit(NEW_MASSAGES, {
      message: realTimeMessage,
      chatId,
    });
    console.log(NEW_MASSAGES);
    // messages alert
    io.to(membersSockets).emit(NEW_MASSAGE, { chatId });

    try {
      await Message.create(messageForDb);
    } catch (error) {
      console.log(error);
    }
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
