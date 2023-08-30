const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const schema = {
  name: {
    type: String,
    required: [true, "Name is a required field"],
  },
  email: {
    type: String,
    required: [true, "email is a required field"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is a required field"],
  },
  avatar: {
    type: String,
    required: [true, "Name is a required field"],
    default:
      "https://res.cloudinary.com/dnymefrvq/image/upload/v1691859415/1-13_qxzsat.png",
  },
};
const userSchema = new Schema(schema, { timestamps: true });
userSchema.methods.matchPassword = async function (Password) {
  return await bcrypt.compare(Password, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
const User = mongoose.model("Chat_App_Users", userSchema);
module.exports= User;
