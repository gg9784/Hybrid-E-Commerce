import catchAsync from '../utils/catchAsync.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import User from '../models/User.js';

const generateaccesstokenandrefreshtoken = async (userid) => {
  try {
    const user = await User.findById(userid);
    const accesstoken = user.generateAccessToken();
    const refreshtoken = user.generateRefreshToken();

    user.refreshtoken = refreshtoken;
    await user.save({ validateBeforeSave: false });

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

  const existedUser = await User.findOne({ 
    $or: [{ username }, { email }] 
  });
  
  if (existedUser) {
    throw new ApiError(409, "User already exists with this email or username");
  }

  const avatarlocalpath = req.files?.avatar?.[0]?.filename;
  if (!avatarlocalpath) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    fullname,
    email,
    username: username.toLowerCase(),
    password, // Mongoose hook will hash this
    avatar: `/temp/${avatarlocalpath}`,
    coverimage: req.files?.coverimage?.[0]?.filename ? `/temp/${req.files.coverimage[0].filename}` : ""
  });

  const createduser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  if (!createduser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(new ApiResponse(201, "User created successfully", createduser));
});

export const userlogin = catchAsync(async (req, res) => {
  const { email, username, password } = req.body;
  
  if (!(username || email) || !password) {
    throw new ApiError(400, "Username/Email and password are required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (!user) {
    throw new ApiError(404, "User not found with this email or username");
  }

  const isPasswordMatch = await user.passwordmatch(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid password or user credentials");
  }

  const { accesstoken, refreshtoken } = await generateaccesstokenandrefreshtoken(user._id);
  
  const loggedInUser = await User.findById(user._id).select("-password -refreshtoken");

  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };
  
  return res
    .status(200)
    .cookie("refreshtoken", refreshtoken, options)
    .cookie("accesstoken", accesstoken, options)
    .json(new ApiResponse(200, "User logged in successfully", { user: loggedInUser, accesstoken }));
});

export const logoutuser = catchAsync(async (req, res) => {
  if (req.user?._id) {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshtoken: 1 } },
      { new: true }
    );
  }

  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };
  
  return res
    .status(200)
    .clearCookie("refreshtoken", options)
    .clearCookie("accesstoken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});
