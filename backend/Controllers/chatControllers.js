import AppError from "../utils/utilError.js";
import Chat from "../models/chatModel.js"
import User from "../models/userModel.js";
const accessChat=async(req,res,next)=>{
    const {userId}=req.body;
    if(!userId){
        return next(new AppError("UserId param not sent",400));
    }

    var isChat=await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ],
    })
    .populate("users","-password")
    .populate("latestMessage")

    isChat=await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name avatar email"
    })

    if(isChat.length>0){
        res.send(isChat[0]);
    }else{
        let chatData={
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId]
        }
        try {
            const createdChat=await Chat.create(chatData);
            const fullChat=await Chat.findOne({_id:createdChat._id}).populate("users","-password");
            res.status(200).json({
                success:true,
                chats: fullChat
            });
        } catch (error) {
            return next(new AppError(error.message,400));
        }
    }
}


const fetchChats=async(req,res,next)=>{
    try {
       const result=await Chat.find({users:{$elemMatch:{$eq: req.user._id}}})
       .populate("users","-password")
       .populate("groupAdmin","-password")
       .populate("latestMessage")
       .sort({updatedAt:-1});
       const results=await User.populate(result,{
        path:"latestMessage.sender",
        select:"name,avatar,email"
       });

       res.status(200).send(results);
    } catch (error) {
        return next(new AppError(e.message,500));
    }
}
export { accessChat,fetchChats};