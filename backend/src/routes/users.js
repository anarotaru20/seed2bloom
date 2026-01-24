const express = require("express");
const router = express.Router();

const {
  register,
  login,
  profile,
  updateProfile,
  deleteAccount,
  updateEmail,
  updatePassword,
} = require("../controllers/users");
const requireAuth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);

router.get("/profile", requireAuth, profile);
router.patch("/profile", requireAuth, updateProfile);
router.delete("/profile", requireAuth, deleteAccount);

router.patch("/profile/email", requireAuth, updateEmail);
router.patch("/profile/password", requireAuth, updatePassword);

module.exports = router;
