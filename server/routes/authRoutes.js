const express = require("express");
const authController = require("../controller/authController");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json("server start");
});
router.get("/auth/google", authController.authenticateGoogle);
router.get("/auth/google/callback", authController.googleCallback);
router.get("/login/success", authController.successLogin);
router.get("/logout", authController.successLogout);

module.exports = router;
