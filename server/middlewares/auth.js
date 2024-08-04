import { tryCatch } from "./error.js";
import jwt from "jsonwebtoken";

const isAuthenticated = tryCatch(async (req, res, next) => {
  const token = req.cookies["talkwave-token"];
  if (!token) return next(new Error("Not logged in"), 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded._id;
  next();
});

export { isAuthenticated };
