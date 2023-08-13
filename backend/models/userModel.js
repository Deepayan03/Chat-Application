import mongoose,{Schema} from "mongoose";

const schema={
    name:{
        type:String,
        required:[true,"Name is a required field"]
    },
    email:{
        type:String,
        required:[true,"email is a required field"]
    },
    password:{
        type:String,
        required:[true,"Password is a required field"]
    },
    avatar:{
        type:String,
        required:[true,"Name is a required field"],
        default:"https://res.cloudinary.com/dnymefrvq/image/upload/v1691859415/1-13_qxzsat.png"
    }
}

const userSchema=new Schema(schema,{timestamps:true});

const User=mongoose.model("User",userSchema);

export default User;