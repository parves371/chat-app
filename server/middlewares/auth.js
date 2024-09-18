import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { User } from "../models/user.models.js";
import { TALK_WAVE_TOKEN } from "../lib/config.js";

const isAuthenticated = (req, _, next) => {
  const token = req.cookies["talkwave-token"];
  if (!token) return next(new ErrorHandler("Not logged in", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded._id;
  next();
};
const isAdmin = (req, _, next) => {
  const token = req.cookies["talkwave-admin"];
  if (!token) return next(new ErrorHandler("only admin can access", 401));

  const secretkey = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
  const adminSecretKey = process.env.ADMIN_SECRET_KEY || "123456";

  const ismatched = secretkey === adminSecretKey;
  if (!ismatched) return next(new ErrorHandler("Invalid admin key", 401));
  next();
};

const isSocketAuthenticated = async (err, socket, next) => {
  try {
    if (err) return next(err);

    const authToken = socket.request.cookies[TALK_WAVE_TOKEN];

    if (!authToken) return next(new ErrorHandler("Not logged in", 401));

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) return next(new ErrorHandler("User not found", 404));

    socket.user = user;
    return next();
  } catch (error) {
    console.log(error);
    next(new ErrorHandler("Not logged in", 401));
  }
};
export { isAuthenticated, isAdmin, isSocketAuthenticated };
