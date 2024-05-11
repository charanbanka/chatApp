const express = require("express");
const {
  signIn,
  signUp,
  getUserInfo,
  isAuthenticated,
} = require("../controllers/auth-controller");
const authRouter = express.Router();

// Auth Routes
authRouter.post("/login", signIn); //
authRouter.post("/signup", signUp); //
authRouter.get("/getuserbytoken", isAuthenticated, getUserInfo);

module.exports = authRouter;
