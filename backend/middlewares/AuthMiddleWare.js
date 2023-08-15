import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
const UserAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
            console.log(token);
            console.log(process.env.JWT_SECRET);
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            return next();
        } else {
            return res.status(401).json({
                success: false,
                message: "Please log in",
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user.....Token failed",
            error: error.message,
        });
    }
};

export default UserAuth;