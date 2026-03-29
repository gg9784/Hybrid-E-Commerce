import { Router } from "express";
import { getUserProfile, userlogin, logoutuser } from "../controllers/userController.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverimage",
      maxCount: 1,
    },
  ]),
  getUserProfile
);

router.route("/login").post(userlogin);

// Secured routes
router.route("/logout").post(verifyJWT, logoutuser);

export default router;
