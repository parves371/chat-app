import { compare } from "bcrypt";
import { User } from "../models/user.models.js";
import { sentToken } from "../utils/featurs.js";
import { tryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";

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

export { login, newUser, getMyProfile };
