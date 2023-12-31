const AppError = require("../utils/utilError.js");
const Chat = require("../models/chatModel.js");
const User = require("../models/userModel.js");
const Message = require("../models/messageModel.js");
const cloudinary = require("cloudinary").v2;
const accessChat = async (req, res, next) => {
  const { userId } = req.body;
  console.log(userId);
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
    console.log(error);
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
      select: "name avatar email",
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
  const { chatId, userIds } = req.body;
  console.log(userIds)
  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: { $each: userIds } },
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
    return next(new AppError(error.message, 400));
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

const deleteChats=async(req,res,next)=>{
  try{
    const chatId=req.query.chatId;
    const query={chat: chatId};
    await Message.deleteMany(query);
    const deletedChat=await Chat.findByIdAndDelete(chatId);
    return res.status(200).json({
      success:true,
      message:"Chat deleted successfully",
      deletedChat : deletedChat
    });
  }catch(e){
    console.log(e);
    return next(new AppError(e.message,400));
  }
}

const changeGroupChatAvatar=async(req,res,next)=>{
  try {
    const {id, url , OldpublicId}=req.body;
    console.log(id,url,OldpublicId);
    if(OldpublicId){
    cloudinary.config({
      cloud_name: process.env.cloudName,
      api_key: process.env.cloudinaryAPIKey,
      api_secret: process.env.cloudinarySecret,
    });
    cloudinary.uploader.destroy(OldpublicId, (error, result) => {
      if (error) {
        console.error('Error deleting image:', error);
      } else {
        console.log('Image deleted successfully:', result);
      }
    });
  }
    const chat = await Chat.findById(id).
    populate("users", "-password").
    populate("groupAdmin", "-password");
    chat.avatar = url;
    await chat.save();
    res.status(200).json({
      success:"true",
      message:"Avatar changed successfully",
      data:chat
    });
  } catch (error) {
    return next(new AppError(error.message,400));
  }
}

const promoteAsGroupAdmin=async(req,res,next)=>{
  try {
  const {userId,chatId}=req.body;
  const chat=await Chat.findByIdAndUpdate(chatId,
    {
      $push: {groupAdmin:userId}
    },{
      new:true
    }).populate("users", "-password")
    .populate("groupAdmin", "-password");
    if(!chat){
      return next(new AppError("Group not found",400));
    }
    res.status(200).json({
      success:true,
      message:"Successfully promoted as group Admin",
      data: chat
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message,400));
  }
}

const removeAsGroupAdmin=async(req,res,next)=>{
  try {
    const {userId,chatId}=req.body;
    const chat=await Chat.findByIdAndUpdate(chatId,
      {
        $pull: {groupAdmin:userId}
      },{
        new:true
      }).populate("users", "-password")
      .populate("groupAdmin", "-password");
      if(!chat){
        return next(new AppError("Group not found",400));
      }
      res.status(200).json({
        success:true,
        message:"Removed user as admin",
        data: chat
      });
  } catch (error) {
    return next(new AppError(error.message,400));
  }
}
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  remove,
  deleteChats,
  changeGroupChatAvatar,
  promoteAsGroupAdmin,
  removeAsGroupAdmin
};