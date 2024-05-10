const express = require("express");
const {
  signIn,
  signUp,
  getUserInfo,
} = require("../controllers/auth-controller");
const authRouter = express.Router();

// Auth Routes
authRouter.post("/login", signIn); //
authRouter.post("/signup", signUp); //
authRouter.get("/getuserbytoken", getUserInfo);

module.exports = authRouter;
