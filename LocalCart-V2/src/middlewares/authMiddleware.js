import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import { users } from '../data/mockData.js';

export const verifyJWT = catchAsync(async (req, res, next) => {
  try {
    const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'fallback_secret');

    const user = users.find(u => u._id === decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    const safeUser = { ...user };
    delete safeUser.password;
    delete safeUser.refreshtoken;

    req.user = safeUser;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
