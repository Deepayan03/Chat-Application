const AppError = require("../utils/utilError.js");
const Chat = require("../models/chatModel.js");
const User = require("../models/userModel.js");

const accessChat = async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    return next(new AppError("UserId param not sent", 400));
  }
  try {
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name avatar email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      let chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json({
        success: true,
        chats: fullChat,
      });
    }
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

const fetchChats = async (req, res, next) => {
  try {
    // console.log("User    "+req.user);
    const result = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    const results = await User.populate(result, {
      path: "latestMessage.sender",
      select: "name,avatar,email",
    });
    // console.log(results)

    res.status(200).send(results);
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const createGroupChat = async (req, res, next) => {
  if (!req.body.users || !req.body.name) {
    return next(new AppError("Please fill all the fields ", 400));
  }
  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return next(
      new AppError("More than two users are required to form a group", 400)
    );
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json({
      success: true,
      data: fullGroupChat,
    });
  } catch (err) {
    res.status(err.message, 400);
  }
};

const renameGroup = async (req, res, next) => {
  const { chatId, chatName } = req.body;
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return next(new AppError("Chat not found"));
    }
    res.status(200).json({
      success: true,
      data: updatedChat,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

const addToGroup = async (req, res, next) => {
  const { chatId, userId } = req.body;
  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!added) {
      return next(new AppError("Chat not found", 404));
    } else {
      res.status(200).json({
        success: true,
        message:"User added successfully",
        data: added,
      });
    }
  } catch (error) {
    return next(new AppError(e.message, 400));
  }
};

const remove = async (req, res, next) => {
  const { chatId, userId } = req.body;
  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!removed) {
      return next(new AppError("Chat not found", 404));
    } else {
      res.status(200).json({
        success: true,
        message:"User removed successfully",
        data: removed,
      });
    }
  } catch (error) {
    return next(new AppError(e.message, 400));
  }
};
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  remove,
};