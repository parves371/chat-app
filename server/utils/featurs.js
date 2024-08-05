import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  httpOnly: true,
  sameSite: "none",
  secure: true,
};
const connectDB = (url) => {
  mongoose
    .connect(url, { dbName: "talk-wave" })
    .then((data) =>
      console.log(`Connected to MongoDB at ${data.connection.host}`)
    )
    .catch((err) => {
      throw err;
    });
};

const sentToken = (res, user, statusCode, message) => {
  try {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(statusCode).cookie("talkwave-token", token, cookieOptions).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { connectDB, sentToken, cookieOptions };
