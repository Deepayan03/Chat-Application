import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/utilError.js";

const sendMessage = async (req, res, next) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name avatar");
    message = await message.populate("chat");
    console.log(message.chat);
    message = await User.populate(message, {
      path: "chat.users",
      select: "name avatar email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

const allMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name avatar email")
      .populate("chat");
    res.json(messages);
    console.log(messages);
  } catch (error) {
    console.log(error);
    return next(new AppError("Couldnot get all the messages", 400));
  }
};
export { sendMessage, allMessages };
