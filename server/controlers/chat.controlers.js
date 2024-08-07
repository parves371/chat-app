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

  if (!chatId) return next(new ErrorHandler("Please provide chatId"), 400);
  if (!members || members.length < 1)
    return next(new ErrorHandler("Please provide members"), 400);

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found"), 404);
  if (!chat.groupChat)
    return next(new ErrorHandler("Chat is not a group"), 400);
  if (!chat.creator.equals(req.user))
    return next(new ErrorHandler("Unauthorized you can't creact group"), 401);

  const allnewMembersPromise = members?.map((i) => User.findById(i, "name"));
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

const removeMember = tryCatch(async (req, res, next) => {
  const { chatId, userId } = req.body;
  if (!chatId) return next(new ErrorHandler("Please provide chatId"), 400);
  if (!userId) return next(new ErrorHandler("Please provide userId"), 400);

  const [chat, userThatWillBeRemove] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found"), 404);
  if (!chat.groupChat)
    return next(new ErrorHandler("Chat is not a group"), 400);
  if (!Chat.creator === req.user)
    return next(
      new ErrorHandler("Unauthorized you are not allowed to removed members"),
      401
    );
  if (chat.members.length <= 3)
    return next(new ErrorHandler("group must have 3 members"), 400);
  if (!userThatWillBeRemove)
    return next(new ErrorHandler("userId not found"), 404);

  chat.members = chat.members.filter((i) => i.toString() !== userId.toString());

  await chat.save();

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${userThatWillBeRemove.name} has been removed from the group`
  );
  emitEvent(req, FEFETCH_CHATS, chat.members);
  res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
});

const leaveGroup = tryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  if (!chatId) return next(new ErrorHandler("Please provide chat id"), 400);

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found"), 404);
  if (!chat.groupChat)
    return next(new ErrorHandler("Chat is not a group"), 400);

  const remaningMembers = chat.members.filter(
    (i) => i.toString() !== req.user.toString()
  );

  if (chat.creator === req.user.toString()) {
    const randomElement =
      remaningMembers[Math.floor(Math.random() * remaningMembers.length)];

    const newcreator = remaningMembers.length
      ? remaningMembers[randomElement]
      : null;
    chat.creator = newcreator;
  }
  chat.members = remaningMembers;

  const [user] = await Promise.all([
    User.findById(req.user, "name"),
    chat.save(),
  ]);

  emitEvent(req, ALERT, chat.members, `${user.name} left the group`);

  res.status(200).json({
    success: true,
    message: "member removed successfully",
  });
});

export {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
};
