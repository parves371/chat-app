import { User } from "../models/user.models.js";
import { Chat } from "../models/chat.models.js";

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

export { allUsers };
