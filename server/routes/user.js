const express = require("express");
const { createUser, getUsers, deleteUserById } = require("../controllers/user-controller");
const userRouter = express.Router();

// User Routes
userRouter.post("/", createUser); // Create a new user
userRouter.get("/", getUsers); // Get all users
userRouter.delete("/:id", deleteUserById); // Delete a user by ID

module.exports = userRouter;
