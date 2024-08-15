import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";

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

  const secretkey = jwt.verify(token, process.env.JWT_SECRET);
  const adminSecretKey =
    process.env.ADMIN_SECRET_KEY || "ejfrhweruirfweqjgjhthuffjh";

  const ismatched = secretkey === adminSecretKey;
  if (!ismatched) return next(new ErrorHandler("Invalid admin key", 401));
  next();
};

export { isAuthenticated, isAdmin };
