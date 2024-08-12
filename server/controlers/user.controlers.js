import { compare } from "bcrypt";
import { User } from "../models/user.models.js";
import { cookieOptions, sentToken } from "../utils/featurs.js";
import { tryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.models.js";

// create new user and save to database and save in cookies
const newUser = tryCatch(async (req, res) => {
  const { name, username, password, bio } = req.body;
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
  if (!user) return next(new ErrorHandler("User not found", 404));

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

  res.status(200).json({
    success: true,
    allUsersExceptMeAndMyFriends,
  });
});

export { login, newUser, getMyProfile, logout, searchUser };
