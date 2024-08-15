import { User } from "../models/user.models.js";
import { Chat } from "../models/chat.models.js";
import { Message } from "../models/massages.model.js";

import { tryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { cookieOptions } from "../utils/featurs.js";

import jwt from "jsonwebtoken";

const adminLogin = tryCatch(async (req, res, next) => {
  const { secretkey } = req.body;
  const adminSecretKey = process.env.ADMIN_SECRET_KEY || "123456";

  const ismatched = secretkey === adminSecretKey;
  if (!ismatched) return next(new ErrorHandler("Invalid credentials", 401));

  const token = jwt.sign(secretkey, process.env.JWT_SECRET);
  res
    .status(200)
    .cookie("talkwave-admin", token, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 15,
    })
    .json({
      success: true,
      message: "Login admin successful",
    });
});
const allUsers = tryCatch(async (req, res) => {
  const users = await User.find({});

  const transformedUsers = await Promise.all(
    users.map(async ({ name, username, avatar, _id }) => {
      const [groups, friends] = await Promise.all([
        Chat.countDocuments({ groupChat: true, members: { $in: _id } }),
        Chat.countDocuments({ groupChat: false, members: { $in: _id } }),
      ]);

      return { _id, username, avatar: avatar.url, name, groups, friends };
    })
  );

  res.status(200).json({
    status: "success",
    users: transformedUsers,
  });
});

const getChats = tryCatch(async (req, res) => {
  const chats = await Chat.find({})
    .populate("members", "name avatar")
    .populate("creator", "name avatar");

  const transformChats = await Promise.all(
    chats.map(async ({ members, _id, groupChat, name, creator }) => {
      const totalMessages = await Message.countDocuments({ chatId: _id });

      return {
        _id,
        name,
        groupChat,
        avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
        members: members.map(({ _id, name, avatar }) => ({
          _id,
          name,
          avatar: avatar.url,
        })),
        creator: {
          name: creator?.name || "Unknown",
          avatar: creator?.avatar.url || "",
        },
        totalMessages,
      };
    })
  );
  res.status(200).json({
    status: "success",
    chats: transformChats,
  });
});

const getMessages = tryCatch(async (req, res) => {
  const messages = await Message.find({})
    .populate("sender", "name avatar")
    .populate("chatId", "groupChat");

  const transfromMessages = messages.map(
    ({ content, attachments, _id, chatId, sender, createdAt }) => ({
      content,
      attachments,
      _id,
      chatId: chatId._id,
      groupChat: chatId.groupChat,
      sender: {
        _id: sender?._id || "Unknown",
        name: sender?.name || "Unknown",
        avatar: sender?.avatar.url || "",
      },
      createdAt,
    })
  );

  res.status(200).json({
    status: "success",
    messages: transfromMessages,
  });
});

const getdashboardStats = tryCatch(async (req, res) => {
  const [userscount, groupscount, messagecount, totalchatsCount] =
    await Promise.all([
      User.countDocuments(),
      Chat.countDocuments({ groupChat: true }),
      Message.countDocuments(),
      Chat.countDocuments(),
    ]);
  const today = new Date();
  const last7Days = new Date(today.setDate(today.getDate() - 7));

  const last7daysMessages = await Message.find({
    createdAt: { $gte: last7Days },
  }).select("createdAt");

  const messages = new Array(7).fill(0);
  const dayInMillis = 1000 * 60 * 60 * 24;

  last7daysMessages.forEach((message) => {
    const messageDate = message.createdAt.getTime();
    const today = new Date();

    const indexApprox = (today.getTime() - messageDate) / dayInMillis;

    const index = Math.floor(indexApprox);

    // Ensure the index is within bounds (0 to 6)
    if (index >= 0 && index < 7) {
      messages[6 - index]++;
    }
  });

  const stats = {
    userscount,
    groupscount,
    messagecount,
    totalchatsCount,
    messagesChart: messages,
  };

  res.status(200).json({
    status: "success",
    stats,
  });
});

export { allUsers, getChats, getMessages, getdashboardStats, adminLogin };
