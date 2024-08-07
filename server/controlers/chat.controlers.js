import { Chat } from "../models/chat.models.js";
import { User } from "../models/user.models.js";

import { ALERT, FEFETCH_CHATS } from "../constants/event.js";
import { tryCatch } from "../middlewares/error.js";

import { emitEvent } from "../utils/featurs.js";
import { ErrorHandler } from "../utils/utility.js";
import { getOtherMembers } from "../lib/helper.js";

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
const getMyChats = tryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: { $in: [req.user] } }).populate(
    "members",
    "name avatar"
  );

  const transformedChats = chats.map((chat) => {
    const { name, groupChat, members, _id } = chat;

    const otherMember = getOtherMembers(members, req.user);
    return {
      _id,
      avatar: members
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMember.avatar.url],

      name: groupChat ? name : otherMember.name,
      groupChat,
      members: members.reduce((prev, crr) => {
        if (crr._id?.toString() !== req.user._id?.toString()) {
          prev.push(crr);
        }
        return prev;
      }, []),
    };
  });

  return res.status(200).json({
    success: true,
    message: transformedChats,
  });
});

const getMyGroups = tryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: { $in: [req.user] },
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");

  const groups = chats.map(({ members, _id, groupChat, name }) => ({
    _id,
    groupChat,
    name,
    avatar: members?.slice(0, 3).map(({ avatar }) => avatar.url),
  }));
  res.status(200).json({
    success: true,
    message: groups,
  });
});

const addMembers = tryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  if (!chatId) return next(new ErrorHandler("Please provide chat id"), 400);
  if (!members || members.length < 1)
    return next(new ErrorHandler("Please provide members"), 400);

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found"), 404);
  if (!chat.groupChat)
    return next(new ErrorHandler("Chat is not a group"), 400);
  if (!chat.creator.equals(req.user))
    return next(new ErrorHandler("Unauthorized you can't creact group"), 401);

  const allnewMembersPromise = members.map((i) => User.findById(i, "name"));
  console.log(allnewMembersPromise);
  const allNewMembers = await Promise.all(allnewMembersPromise);

  const uniqueMembers = allNewMembers
    .filter((i) => !chat.members.includes(i._id.toString()))
    .map((i) => i._id);

  chat.members.push(...uniqueMembers);
  if (chat.members.length > 25)
    return next(new ErrorHandler("Max limit reached"), 403);

  await chat.save();

  const allNewUsersName = allNewMembers.map((i) => i.name).join(", ");
  emitEvent(
    req,
    ALERT,
    chat.members,
    `${allNewUsersName} has been added to the  group`
  );

  emitEvent(req, FEFETCH_CHATS, chat.members);
  res.status(200).json({
    success: true,
    message: "Members added successfully",
  });
});

export { newGroupChat, getMyChats, getMyGroups, addMembers };
