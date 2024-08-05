import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";

const isAuthenticated = (req, _, next) => {
  const token = req.cookies["talkwave-token"];
  if (!token) return next(new ErrorHandler("Not logged in", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded._id;
  next();
};

export { isAuthenticated };
