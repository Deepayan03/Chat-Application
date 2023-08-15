import { Router } from "express";
import {allUsers, login, register} from "../controllers/userControllers.js"
import UserAuth from "../middlewares/AuthMiddleWare.js";
// import { isLoggedIn } from "../middlewares/AuthMiddleware.js";
// import upload from "../middlewares/multerMiddleware.js";
const controller=Router();
// Defining user routes
controller.route("/")
.post(register)
.get(UserAuth,allUsers);
controller.post("/login",login);
export default controller;
