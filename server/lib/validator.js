import { body, check, validationResult, param, query } from "express-validator";
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
const newGroupChatValidator = () => [
  body("name", "Please enter your name").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please enter your members")
    .isArray({ min: 2, max: 25 })
    .withMessage("mebers must be between 2 and 25"),
];

const addMembersValidator = () => [
  body("chatId", "Please enter your chatId").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please enter your members")
    .isArray({ min: 1, max: 22 })
    .withMessage("mebers must be between 1 and 22"),
];

const removeMemberValidator = () => [
  body("userId", "Please enter your userId").notEmpty(),
  body("chatId", "Please enter your chatId").notEmpty(),
];
const leaveGroupValidator = () => [
  param("id", "Please enter your chatId").notEmpty(),
];
const sendAttachmentValidator = () => [
  body("chatId", "Please enter your chatId").notEmpty(),
  check("files")
    .notEmpty()
    .withMessage("Please upload your files")
    .isArray({ min: 1, maxi: 5 })
    .withMessage("files must be between 1 and 5"),
];

const getMessagesValidator = () => [
  param("id", "Please enter your chatId").notEmpty(),
];
const getChatDetailsValidator = () => [
  param("id", "Please enter your chatId").notEmpty(),
];
const renameGroupValidator = () => [
  param("id", "Please enter your chatId").notEmpty(),
  body("name", "Please enter your new name").notEmpty(),
];
const deleteChatValidator = () => [
  param("id", "Please enter your chatId").notEmpty(),
];

export {
  registerValidator,
  validate,
  loginValidator,
  newGroupChatValidator,
  addMembersValidator,
  removeMemberValidator,
  leaveGroupValidator,
  sendAttachmentValidator,
  getMessagesValidator,
  getChatDetailsValidator,
  renameGroupValidator,
  deleteChatValidator,
};
