import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import catchAsync from '../utils/catchAsync.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { users } from '../data/mockData.js';

const generateaccesstokenandrefreshtoken = async (user) => {
  try {
    const accesstoken = jwt.sign(
      { _id: user._id, email: user.email, username: user.username, fullname: user.fullname },
      process.env.ACCESS_TOKEN_SECRET || 'fallback_secret',
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d' }
    );
    const refreshtoken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '10d' }
    );

    user.refreshtoken = refreshtoken;

    return { accesstoken, refreshtoken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token");
  }
};

export const getUserProfile = catchAsync(async (req, res) => {
  const { fullname, email, password, username } = req.body;
  
  if ([fullname, email, password, username].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = users.find(u => u.email === email || u.username === username);
  if (existedUser) {
    throw new ApiError(409, "User already exists with this email or username");
  }

  const avatarlocalpath = req.files?.avatar?.[0]?.filename;
  if (!avatarlocalpath) {
    throw new ApiError(400, "Avatar is required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    _id: Date.now().toString(),
    fullname,
    email,
    username: username.toLowerCase(),
    password: hashedPassword,
    avatar: `/temp/${avatarlocalpath}`,
    coverimage: req.files?.coverimage?.[0]?.filename ? `/temp/${req.files.coverimage[0].filename}` : ""
  };
  
  users.push(newUser);

  const createduser = { ...newUser };
  delete createduser.password;
  delete createduser.refreshtoken;

  return res.status(201).json(new ApiResponse(201, "User created successfully", createduser));
});

export const userlogin = catchAsync(async (req, res) => {
  const { email, username, password } = req.body;
  
  if (!(username || email) || !password) {
    throw new ApiError(400, "Username/Email and password are required");
  }

  const user = users.find(u => u.email === email || u.username === username);
  if (!user) {
    throw new ApiError(404, "User not found with this email or username");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid password or user credentials");
  }

  const { accesstoken, refreshtoken } = await generateaccesstokenandrefreshtoken(user);
  
  const userdetails = { ...user };
  delete userdetails.password;
  delete userdetails.refreshtoken;

  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };
  
  return res
    .status(200)
    .cookie("refreshtoken", refreshtoken, options)
    .cookie("accesstoken", accesstoken, options)
    .json(new ApiResponse(200, "User logged in successfully", { user: userdetails, accesstoken }));
});

export const logoutuser = catchAsync(async (req, res) => {
  const user = users.find(u => u._id === req.user._id);
  if (user) {
    delete user.refreshtoken;
  }

  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };
  
  return res
    .status(200)
    .clearCookie("refreshtoken", options)
    .clearCookie("accesstoken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});
