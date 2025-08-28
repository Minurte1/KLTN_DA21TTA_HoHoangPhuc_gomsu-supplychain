const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  loginUserGoogle,
  verifyAdmin,
  logoutUser,

  updateUserById_Admin,
  getAllUser_Admin,
  updateAvatarController,
  getUser_ById,
  updateUserById_User,
  sendOtp,
  updatePrefences,
  updatePasswordUser,
  updateLanguage,
  checkOtp,
  sendTeacherDayWish,
  sendBirthdayWish,
  registerUser,
  loginUser,
  createUser,
  deleteUserById,
} = require("../controllers/userController");

const upload = require("../config/multerConfig");
const {
  checkUserPermission,
  checkUserJWT,
} = require("../middleware/JWTaction");

router.get("/user", getAllUser_Admin);
router.get("/user/:id", getUser_ById);
router.post("/create-users", upload.single("AVATAR"), createUser);
router.post("/logout", logoutUser);
router.post("/login/google", loginUserGoogle);
router.post(
  "/verify-admin",
  checkUserJWT,
  checkUserPermission("dashboard", "access"),
  verifyAdmin
);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/user/:id/avatar", upload.single("images"), updateAvatarController);

router.put("/user/:id", upload.single("AVATAR"), updateUserById_User);
router.put("/user/update/:id", updateUserById_Admin);

router.post("/send-otp", sendOtp);
router.post("/check-otp", checkOtp);
router.post("/update-password", updatePasswordUser);

router.post("/update-preferences", updatePrefences);

router.post("/update-language", updateLanguage);

router.post("/send-teacher", sendTeacherDayWish);
router.post("/send-birtday", sendBirthdayWish);
router.delete("/user/delete/:id", deleteUserById);
module.exports = router;
