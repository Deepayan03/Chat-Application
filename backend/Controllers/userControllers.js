import generateToken from "../config/generateToken.js";
import User from "../models/userModel.js";
import AppError from "../utils/utilError.js";
const register = async (req, res, next) => {
  const { name, email, password, avatar } = req.body;
  if (!name || !email || !password) {
    return next(new AppError("Please enter all the fields", 400));
  }
  const userExists = await User.findOne({ email });
  console.log(userExists)
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
  console.log(user)
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
  console.log(req.query.search);
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
    console.log(users);
    res.status(200).json({
      success:true,
      data:users
    });
}
export {
  register,
  login,
  allUsers
}