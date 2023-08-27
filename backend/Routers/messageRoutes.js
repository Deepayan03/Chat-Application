import {Router} from "express";
import { allMessages, sendMessage } from "../Controllers/messageControllers.js";
import UserAuth from "../middlewares/AuthMiddleWare.js";

const router=Router();
router.route("/").post(UserAuth,sendMessage);
router.route("/:chatId").get(UserAuth,allMessages);


export default router;