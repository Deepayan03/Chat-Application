const mongoose=require("mongoose");

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
module.exports=connectDb;