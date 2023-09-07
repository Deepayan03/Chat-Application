const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema={
    chatName: {
        type: String,
        trim: true
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    users:[{
        type:Schema.Types.ObjectId,
        ref:"Chat_App_Users"
    }],
    latestMessage:{
        type:Schema.Types.ObjectId,
        ref:"Message"
    },
    groupAdmin:{
        type:Schema.Types.ObjectId,
        ref:"Chat_App_Users"
    },
    avatar: {
        type: String,
        default:
          "https://res.cloudinary.com/dnymefrvq/image/upload/v1691859415/1-13_qxzsat.png",
    },
}
const chatModel= new Schema(schema,{timestamps:true});
const Chat =mongoose.model("Chat",chatModel);


module.exports=Chat;