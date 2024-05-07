const express = require("express");
const userRouter = require("./user");
const messageRouter = require("./message");
const chatsRouter = require("./chat");
const router = express.Router();

router.use("/users", userRouter);
router.use("/messages", messageRouter);
router.use("/chats", chatsRouter);

module.exports = router;
