import { Router } from "express";
import {login, register} from "../controllers/userControllers.js"
// import { isLoggedIn } from "../middlewares/AuthMiddleware.js";
// import upload from "../middlewares/multerMiddleware.js";
const controller=Router();
// Defining user routes
controller.post("/",register);
controller.post("/login",login);
// controller.get("/logout",logout);
// controller.get("/getProfile",isLoggedIn,getProfile);
// controller.post("/forgotPassword",forgotPassword);
// controller.post("/resetPassword/:resetToken", resetPassword);
// controller.post("/changePassword",isLoggedIn,changePassword);
// controller.put("/update",isLoggedIn,upload.single("avatar"),updateUser)
 export default controller;
