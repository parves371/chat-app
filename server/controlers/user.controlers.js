import { Chat } from "../models/chat.models.js";
import { User } from "../models/user.models.js";
import { Request } from "../models/request.models.js";

import { compare } from "bcrypt";
import { cookieOptions, emitEvent, sentToken } from "../utils/featurs.js";
import { tryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { FEFETCH_CHATS, NEW_REQUEST } from "../constants/event.js";
import { getOtherMembers } from "../lib/helper.js";

// create new user and save to database and save in cookies
const newUser = tryCatch(async (req, res) => {
  const { name, username, password, bio } = req.body;

  const file = req.file;
  if (!file) return next(new ErrorHandler("Please upload a avatar", 400));

  const avatar = {
    url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    public_id: "123456",
  };
  const user = await User.create({
    name,
    username,
    password,
    avatar,
    bio,
  });

  sentToken(res, user, 201, "User created successfully");
});

// login user and save in cookies
const login = tryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");
  if (!user) return next(new ErrorHandler("invalid email", 404));

  const isMatch = await compare(password, user.password);
  if (!isMatch) return next(new ErrorHandler("invalid password", 404));

  sentToken(res, user, 200, `Login successful ${user.name}`);
});

const getMyProfile = tryCatch(async (req, res) => {
  const user = await User.findById(req.user).select("-password");

  res.json({
    success: true,
    user,
  });
});
const logout = tryCatch(async (req, res) => {
  return res
    .status(200)
    .cookie("talkwave-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

const searchUser = tryCatch(async (req, res) => {
  const { name = "" } = req.query;
  // Find all one-on-one chats involving the current user
  const myChats = await Chat.find({ groupChat: false, members: req.user._id });

  // Extract all unique user IDs from these chats
  const allUsersFromMychat = [
    ...new Set(
      myChats.flatMap((chat) =>
        chat.members.filter(
          (member) => member.toString() !== req.user.toString()
        )
      )
    ),
  ];

  // Add the current user's ID to the exclusion list
  allUsersFromMychat.push(req.user);

  // Find all users except the current user and their friends
  const allUsersExceptMeAndMyFriends = await User.find({
    _id: { $nin: allUsersFromMychat },
    name: { $regex: name, $options: "i" },
  });
  // modified all the users to return only name, id and avatar
  const users = allUsersExceptMeAndMyFriends.map(({ name, _id, avatar }) => ({
    name,
    _id,
    avatar: avatar.url,
  }));

  res.status(200).json({
    success: true,
    users,
  });
});

const sendRequest = tryCatch(async (req, res, next) => {
  const { userId } = req.body;

  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });
  if (request) return next(new ErrorHandler("Request already sent", 400));

  await Request.create({
    sender: req.user,
    receiver: userId,
  });
  emitEvent(req, NEW_REQUEST, [userId]);

  res.status(200).json({
    success: true,
    message: "Request sent successfully",
  });
});

const acceptFriendRequest = tryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler("Request not found", 404));

  // Ensure the logged-in user is the receiver of the request
  if (request.receiver._id.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not authorized to accept this request", 403)
    );

  if (!accept) {
    // If the request is rejected, delete it and respond
    await request.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Request rejected successfully",
    });
  }

  // If the request is accepted, create a chat and delete the request
  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    Chat.create({
      name: `${request.sender.name} and ${request.receiver.name}`,
      members,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, FEFETCH_CHATS, members);

  res.status(200).json({
    success: true,
    message: "Request accepted successfully",
    senderId: request.sender._id,
  });
});

const getMyNotifications = tryCatch(async (req, res) => {
  const requests = await Request.find({ receiver: req.user }).populate(
    "sender",
    "name avatar"
  );

  const allRequests = requests.map(({ sender, _id }) => {
    return {
      sender: {
        name: sender.name,
        avatar: sender.avatar.url,
        _id: sender._id,
      },
      _id,
    };
  });
  res.status(200).json({
    success: true,
    allRequests,
  });
});

const getMyFriends = tryCatch(async (req, res) => {
  const chatId = req.query.chatId;
  const myChats = await Chat.find({
    groupChat: false,
    members: req.user,
  }).populate("members", "name avatar");

  const myFriends = myChats.map(({ members }) => {
    const otherUser = getOtherMembers(members, req.user);
    return {
      name: otherUser.name,
      avatar: otherUser.avatar.url,
      _id: otherUser._id,
    };
  });

  if (chatId) {
    const chat = await Chat.findById(chatId);
    availableFriends = myFriends.filter(
      (friend) => !chat.members.includes(friend._id)
    );

    res.status(200).json({
      success: true,
      myFriends: availableFriends,
    });
  } else {
    res.status(200).json({
      success: true,
      myFriends,
    });
  }
});
export {
  login,
  newUser,
  getMyProfile,
  logout,
  searchUser,
  sendRequest,
  acceptFriendRequest,
  getMyNotifications,
  getMyFriends,
};
