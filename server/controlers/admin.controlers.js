import { User } from "../models/user.models.js";
import { Chat } from "../models/chat.models.js";
import { Message } from "../models/massages.model.js";

import { tryCatch } from "../middlewares/error.js";

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

export { allUsers, getChats };
