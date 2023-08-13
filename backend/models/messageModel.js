import mongoose,{Schema} from "mongoose";

const msgSchema={
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        trim:true
    },
    chat:{
        type:Schema.Types.ObjectId,
        ref:"Chat"
    }
}

const messageModel=new Schema(msgSchema,{timestamps:true});

const Message=mongoose.model("Message",messageModel);

export default Message;