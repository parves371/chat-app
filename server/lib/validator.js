import { body, check, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  const errorMesssages = errors
    .array()
    .map((error) => error.msg)
    .join(", ");

  if (!errors.isEmpty()) return next(new ErrorHandler(errorMesssages));
  next();
};
// users vaildatiors
const registerValidator = () => [
  body("name", "Please enter your name").notEmpty(),
  body("username", "Please enter your username").notEmpty(),
  body("password", "Please enter your password").notEmpty(),
  body("bio", "Please enter your bio").notEmpty(),
  check("avatar", "Please upload your avatar").notEmpty(),
];
const loginValidator = () => [
  body("username", "Please enter your username").notEmpty(),
  body("password", "Please enter your password").notEmpty(),
];



export { registerValidator, validate, loginValidator };
