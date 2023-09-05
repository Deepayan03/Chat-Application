const generateToken = require("../config/generateToken.js");
const User = require("../models/userModel.js");
const AppError = require("../utils/utilError.js");
const cloudinary= require("cloudinary").v2;
const register = async (req, res, next) => {
  const { name, email, password, avatar } = req.body;
  if (!name || !email || !password) {
    return next(new AppError("Please enter all the fields", 400));
  }
  const userExists = await User.findOne({ email });
  // console.log(userExists)
  if (userExists) {
    return next(new AppError("User already exists", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });
  if (!user) {
    return next(new AppError("Unsuccessful..Please try again", 400));
  }
  user.password = undefined;
  res.status(200).json({
    success: true,
    data: user,
    token: generateToken(user._id)
  });
}

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please enter all the fields", 400));
  }
  const user = await User.findOne({ email });
  // console.log(user)
  if (!user) {
    return next(new AppError("Invalid email", 400));
  }
  console.log(await user.matchPassword(password));
  if (! await user.matchPassword(password)) {
    return next(new AppError("Invalid email or password", 400));
  }
  user.password = undefined;
  res.status(200).json({
    success: true,
    message: "User logged in",
    data: user,
    token: generateToken(user._id)
  });
}

const allUsers = async (req, res, next) => {
  // console.log(req.query.search);
  const key = req.query.search ?
    {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },  //i is for case insensitive search
        { email: { $regex: req.query.search, $options: "i" } },
      ]
    }
    :
    {};
    const users=await User.find(key).find({_id:{$ne :req.user._id}}).select("-password");
    // console.log(users);
    res.send(users);
}

  const changeDp=async(req,res,next)=>{
    try
    {const {id,url,OldpublicId}=req.body;
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
    console.log(id,url,OldpublicId);
    const user=await User.findById(id);
    user.avatar=url;
    await user.save();
    res.status(200).json({
      success:"true",
      message:"Avatar changed successfully",
      data:user
    });}catch(error){
      console.log(error);
      return next(new AppError(error.message,400));
    }
  }
module.exports= {
  register,
  login,
  allUsers,
  changeDp
}