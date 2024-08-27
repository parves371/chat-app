import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import { ErrorHandler } from "./utility.js";
import { getBase64, getSockets } from "../lib/helper.js";
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

const emitEvent = (req, event, users, data) => {
  console.log(data);

  const io = req.app.get("io");
  const sockets = getSockets(users);
  io.to(sockets).emit(event, data);
};

const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        { resource_type: "auto", public_id: uuidv4() },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
    });
  });

  try {
    const urls = await Promise.all(uploadPromises);

    // Format the results so each URL is stored individually
    const formattedResults = urls.map((url) => ({
      url: url,
      public_id: uuidv4(), // Generate a unique public_id for each URL
    }));

    return formattedResults;
  } catch (error) {
    throw new ErrorHandler("Error uploading files to Cloudinary", error);
  }
};

const deleteFilesFromCloudinary = (public_Ids) => {};

export {
  connectDB,
  sentToken,
  cookieOptions,
  emitEvent,
  deleteFilesFromCloudinary,
  uploadFilesToCloudinary,
};
