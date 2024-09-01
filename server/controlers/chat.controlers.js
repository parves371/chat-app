import { Chat } from "../models/chat.models.js";
import { Message } from "../models/massages.model.js";
import { User } from "../models/user.models.js";

import {
  ALERT,
  FEFETCH_CHATS,
  NEW_MASSAGE,
  NEW_MASSAGES,
} from "../constants/event.js";
import { tryCatch } from "../middlewares/error.js";

import { getOtherMembers } from "../lib/helper.js";
import {
  deleteFilesFromCloudinary,
  emitEvent,
  uploadFilesToCloudinary,
} from "../utils/featurs.js";
import { ErrorHandler } from "../utils/utility.js";

const newGroupChat = tryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  if (members.length < 2)
    return next(new ErrorHandler("Please add atleast 2 members", 400));

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
    chats: transformedChats,
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
    groups,
  });
});

const addMembers = tryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.groupChat)
    return next(new ErrorHandler("Chat is not a group", 400));
  if (!chat.creator.equals(req.user))
    return next(new ErrorHandler("Unauthorized you can't creact group", 401));

  const allnewMembersPromise = members?.map((i) => User.findById(i, "name"));
  const allNewMembers = await Promise.all(allnewMembersPromise);

  const uniqueMembers = allNewMembers
    .filter((i) => !chat.members.includes(i._id.toString()))
    .map((i) => i._id);

  chat.members.push(...uniqueMembers);
  if (chat.members.length > 25)
    return next(new ErrorHandler("Max limit reached", 403));

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

  const [chat, userThatWillBeRemove] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.groupChat)
    return next(new ErrorHandler("Chat is not a group", 400));
  if (!Chat.creator === req.user)
    return next(
      new ErrorHandler(
        "Unauthorized you are not allowed to removed members",
        401
      )
    );
  if (chat.members.length <= 3)
    return next(new ErrorHandler("group must have 3 members", 400));
  if (!userThatWillBeRemove)
    return next(new ErrorHandler("userId not found", 404));

  const allChatMembers = chat.members.map((i) => i.toString());
  chat.members = chat.members.filter((i) => i.toString() !== userId.toString());

  await chat.save();

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${userThatWillBeRemove.name} has been removed from the group`
  );
  emitEvent(req, FEFETCH_CHATS, allChatMembers);
  res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
});

const leaveGroup = tryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.groupChat)
    return next(new ErrorHandler("Chat is not a group", 400));

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

const sendattachment = tryCatch(async (req, res, next) => {
  const { chatId } = req.body;
  const files = req.files || [];

  if (!files.length > 1) return next(new ErrorHandler("No files found", 400));
  if (files.length > 5) return next(new ErrorHandler("Max limit reached", 403));

  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name"),
  ]);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  // upload files
  const attachments = await uploadFilesToCloudinary(files);

  const messagesForDb = {
    content: "",
    attachments,
    sender: me._id,
    chatId,
  };

  const messagesForRealTime = {
    ...messagesForDb,
    sender: { _id: me._id, name: me.name },
    chatId,
  };

  const message = await Message.create(messagesForDb);

  emitEvent(req, NEW_MASSAGES, chat.members, {
    message: messagesForRealTime,
    chatId,
  });

  // message alert
  emitEvent(req, NEW_MASSAGE, chat.members, { chatId });

  res.status(200).json({
    success: true,
    message: message,
  });
});

const getChatDetails = tryCatch(async (req, res, next) => {
  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.id)
      .populate("members", "name avatar")
      .lean();
    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    chat.members = chat.members?.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    res.status(200).json({
      success: true,
      chat,
    });
  }
});

const renameGroup = tryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { name } = req.body;

  console.log(chatId, name);

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.groupChat)
    return next(new ErrorHandler("Chat is not a group", 400));
  if (chat.creator.toString() !== req.user.toString())
    return next(
      new ErrorHandler("Unauthorized you can't rename this group"),
      401
    );

  chat.name = name;
  await chat.save();

  emitEvent(req, FEFETCH_CHATS, chat.members);

  res.status(200).json({
    success: true,
    message: "Chat renamed successfully",
  });
});

const deleteChat = tryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  const members = chat.members;

  // Group chat: Only the creator can delete the group chat
  if (chat.groupChat && chat.creator.toString() !== req.user.toString()) {
    return next(
      new ErrorHandler("Unauthorized: You can't delete this group", 401)
    );
  }

  // Private chat: Only members can delete the chat
  if (!chat.groupChat && !chat.members.includes(req.user.toString())) {
    return next(
      new ErrorHandler("Unauthorized: You can't delete this chat", 403)
    );
  }

  // Delete all messages and associated files from Cloudinary
  const messagesWithAttachments = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });

  const public_ids = [];
  messagesWithAttachments?.forEach(({ attachments }) => {
    attachments.forEach(({ public_id }) => {
      public_ids.push(public_id);
    });
  });

  await Promise.all([
    deleteFilesFromCloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({ chatId }),
  ]);

  emitEvent(req, FEFETCH_CHATS, members); // Assuming "REFETCH_CHATS" is the correct event name

  res.status(200).json({
    success: true,
    message: "Chat deleted successfully",
  });
});

const getMessages = tryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { page = 1 } = req.query;

  const limit = 20;
  const skip = (page - 1) * limit;

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.members.includes(req.user.toString())) {
    return next(
      new ErrorHandler("Unauthorized: You can't access this chat", 403)
    );
  }

  const [messages, totalMessagesCount] = await Promise.all([
    Message.find({ chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "name")
      .lean(),
    Message.countDocuments({ chatId }),
  ]);

  const totalPages = Math.ceil(totalMessagesCount / limit);

  res.status(200).json({
    success: true,
    messages: messages.reverse(),
    totalPages,
  });
});

export {
  addMembers,
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
  renameGroup,
  sendattachment,
};
