const UserModel = require("../models/userModel"); // Assuming UserModel represents the Mongoose model for users
const ChatModel = require("../models/chatModel"); // Assuming ChatModel represents the Mongoose model for chats
const { SERVICE_FAILURE, SERVICE_SUCCESS } = require("../common/const");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (data) => {
  let jwtkey = process.env.JWT_SECRET;

  return jwt.sign(data, jwtkey, { expiresIn: "1d" });
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({
        status: SERVICE_SUCCESS,
        message: "Please provide email and password",
      });

    let user = await UserModel.findOne({ email });

    if (!user)
      return res.status(400).json({
        status: SERVICE_SUCCESS,
        message: "Invalid user or password...",
      });

    const isValidPwd = await bcrypt.compare(password, user.password);

    if (!isValidPwd)
      return res.status(400).json({
        status: SERVICE_SUCCESS,
        message: "Invalid user or password...",
      });

    const token = createToken({ _id: user._id });

    return res.json({
      status: SERVICE_SUCCESS,
      data: { token, _id: user._id, name: user.name, email },
    });
  } catch (error) {
    console.error("signIn error:", error);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred while signin",
    });
  }
};

const signUp = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body || {};

    if (!name || !email || !password || !confirmPassword)
      return res
        .status(400)
        .json({ status: SERVICE_SUCCESS, message: "All fields are required" });

    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({ status: SERVICE_SUCCESS, message: "Invalid Email" });

    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ status: SERVICE_SUCCESS, message: "Invalid passwords" });

    let existUser = await UserModel.findOne({ email });

    if (existUser)
      return res
        .status(400)
        .json({ status: SERVICE_SUCCESS, message: "User Already exists" });

    let newUser = new UserModel({ name, email, password });

    const salt = await bcrypt.genSalt(10);

    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save();

    return res.json({ status: SERVICE_SUCCESS });
  } catch (error) {
    console.error("signUp error: ", error);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred while signup",
    });
  }
};

const getUserInfo = async (req, res) => {
  try {
    let { token } = req.headers;

    let decode = await jwt.verify(token, process.env.JWT_SECRET);

    console.log("decode", decode);
    const _id = decode._id;
    const user = await UserModel.findOne({ _id });

    return res.json({
      status: SERVICE_SUCCESS,
      data: {_id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("getUserInfo error: ", error);
    return res
      .status(500)
      .json({ status: SERVICE_SUCCESS, message: error.message });
  }
};

module.exports = { signIn, signUp, getUserInfo };
