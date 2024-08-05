import { Chat } from "../models/chat.models.js";

import { ALERT, FEFETCH_CHATS } from "../constants/event.js";
import { tryCatch } from "../middlewares/error.js";

import { emitEvent } from "../utils/featurs.js";
import { ErrorHandler } from "../utils/utility.js";

const newGroupChat = tryCatch(async (req, res, next) => {
  const { name, members } = req.body;
  if (!name) return next(new ErrorHandler("Please fill name of group"), 400);

  if (members.length < 2)
    return next(new ErrorHandler("Please add atleast 2 members"), 400);

  const allMembers = [...members, req.user];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `wellcome to ${name} group`);
  emitEvent(req, FEFETCH_CHATS, members);

  return res.status(201).json({
    success: true,
    message: "Group created successfully",
  });
});


export { newGroupChat };
