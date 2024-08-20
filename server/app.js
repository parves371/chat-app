import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./utils/featurs.js";
import { errrorMiddleware } from "./middlewares/error.js";
import { v4 as uuid } from "uuid";

import { Server } from "socket.io";
import { createServer } from "http";
dotenv.config({
  path: "./.env",
});
// routes
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import amninRoutes from "./routes/admin.routes.js";
import { NEW_MASSAGE, NEW_MASSAGES } from "./constants/event.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/massages.model.js";
import { create } from "domain";

const mongoUrI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
const userSocketIDs = new Map();

// connect to database
connectDB(mongoUrI);
// create express app
const app = express();
const server = createServer(app);
const io = new Server(server, {});

// using middleware
app.use(express.json());
app.use(cookieParser());
// all routes are here
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/admin", amninRoutes);

// home route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//  connect to socket.io
io.use((socket, next) => {
  
});
io.on("connection", (socket) => {
  const user = {
    _id: "sjhdshdjk",
    name: "parves",
  };
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
    const membersSockets = getSockets(members);

    io.to(membersSockets).emit(NEW_MASSAGES, {
      message: realTimeMessage,
      chatId,
    });

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
