const { Router } = require("express");
const { allUsers, login, register } = require("../controllers/userControllers.js");
const UserAuth = require("../middlewares/AuthMiddleWare.js");
const controller=Router();
// Defining user routes
controller.route("/")
.post(register)
.get(UserAuth,allUsers);
controller.post("/login",login);
module.exports=controller;
