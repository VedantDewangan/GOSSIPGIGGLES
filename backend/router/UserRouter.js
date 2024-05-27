const express = require("express");
const { login, register, searchUser } = require("../controller/UserController");
const UserRouter = express.Router();

UserRouter.post("/signup", register);
UserRouter.post("/login", login);
UserRouter.get("/user", searchUser);

module.exports = { UserRouter }