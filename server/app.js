import express from "express";
import userRoutes from "./routes/user.routes.js";
import { connectDB } from "./utils/featurs.js";
import dotenv from "dotenv";
import { errrorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
dotenv.config({
  path: "./.env",
});

const mongoUrI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

// connect to database
connectDB(mongoUrI);

const app = express();

// using middleware
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(errrorMiddleware);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
