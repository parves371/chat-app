import express from "express";
import { connectDB } from "./utils/featurs.js";
import dotenv from "dotenv";
import { errrorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
dotenv.config({
  path: "./.env",
});
// routes
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import amninRoutes from "./routes/admin.routes.js";

const mongoUrI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

// connect to database
connectDB(mongoUrI);
// create express app
const app = express();

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
// error middleware
app.use(errrorMiddleware);
app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} mode`);
});
