const express = require("express"); 
const router = express.Router();

const { login, register, verifyEmail } = require("../controllers/auth.controller");

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/verify").get(verifyEmail);

module.exports = router;