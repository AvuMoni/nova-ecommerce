const express = require("express");

const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

console.log(
"AUTH CONTROLLER:",
Object.keys(authController)
);

console.log(
"REGISTER:",
typeof authController.register
);

console.log(
"LOGIN:",
typeof authController.login
);

console.log(
"GET ME:",
typeof authController.getMe
);

console.log(
"UPDATE PROFILE:",
typeof authController.updateProfile
);

console.log(
"PROTECT:",
typeof protect
);

const router = express.Router();

router.post(
"/register",
authController.register
);

router.post(
"/login",
authController.login
);

router.get(
"/me",
protect,
authController.getMe
);

router.put(
"/profile",
protect,
authController.updateProfile
);

module.exports = router;
