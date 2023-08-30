const jwt=require("jsonwebtoken");

const generateToken=(id)=>{
    return jwt.sign({id},"SECRET",{
        expiresIn:"30d"
    });
}

module.exports=generateToken;