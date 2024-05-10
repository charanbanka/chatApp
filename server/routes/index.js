const express = require("express");
const userRouter = require("./user");
const messageRouter = require("./message");
const chatsRouter = require("./chat");
const authRouter = require("./auth");
const router = express.Router();

router.use("/users", userRouter);
router.use("/messages", messageRouter);
router.use("/chats", chatsRouter);
router.use("/", authRouter);

module.exports = router;
