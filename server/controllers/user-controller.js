const UserModel = require("../models/userModel");

const createUser = async (req, res) => {
  try {
    const user = new UserModel(req.body);
    await user.save();
    console.log("createUser => success");
    res.json({ status: "success" });
  } catch (error) {
    console.error("createUser error:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Failed to create user" });
  }
};

const getUsers = async (req, res) => {
  try {
    let users = await UserModel.find().select("-password");

    res.json({ status: "success", data: users });
  } catch (error) {
    console.error("getUsers error:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Failed to retrieve users" });
  }
};

const deleteUserById = async (req, res) => {
  const id = req.params.id;
  try {
    console.log("deleteUserById id=>", id);
    await UserModel.findByIdAndDelete(id);
    res.json({ status: "success" });
  } catch (error) {
    console.error("deleteUserById error:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Failed to delete user" });
  }
};

module.exports = {
  createUser,
  getUsers,
  deleteUserById,
};
