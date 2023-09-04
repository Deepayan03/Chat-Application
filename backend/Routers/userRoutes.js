const { Router } = require("express");
const { allUsers, login, register, changeDp } = require("../controllers/userControllers.js");
const UserAuth = require("../middlewares/AuthMiddleWare.js");
const controller=Router();
// Defining user routes
controller.route("/")
.post(register)
.get(UserAuth,allUsers)
.put(UserAuth,changeDp);
controller.post("/login",login);
module.exports=controller;
