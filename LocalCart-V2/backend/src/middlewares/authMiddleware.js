import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import User from '../models/User.js';

export const verifyJWT = catchAsync(async (req, res, next) => {
  const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'fallback_secret');

  // In a real app, we would query the database here.
  // Using User.findById(decodedToken._id)
  const user = await User.findById(decodedToken?._id).select("-password -refreshtoken");

  if (!user) {
    throw new ApiError(401, "Invalid Access Token");
  }

  req.user = user;
  next();
});
