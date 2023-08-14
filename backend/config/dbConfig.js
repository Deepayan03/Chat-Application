import mongoose from "mongoose";

const connectDb=async()=>{
    try{
        mongoose.connect(process.env.URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log("Database Connected");
    }catch(e){
        console.log(e.message);
    }
}
export default connectDb;