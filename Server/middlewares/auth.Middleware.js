import { ChatApp_Token } from "../constants/config.js";
import { User } from "../models/user.Model.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken";

const isAuthenticated = (req,res,next) =>
{
    const token=req.cookies[ChatApp_Token];
    
    // check token is present in the cookies or not 
    if(!token) return next(new ErrorHandler("Please login to access this routes",401));
        
    const decodedData=jwt.verify(token,process.env.JWT_SECRET);

    // For All Further Routes, in the req we added one property is  { userId:_id }  
    req.userId=decodedData._id;

    next();
};


const socketAuthenticator = async (err, socket,next) => {
    try 
    {
        if(err) return next(err);

        const authToken = socket.request.cookies[ChatApp_Token];
        

        if(!authToken) return next(new ErrorHandler("Please login to access this route",401));

        const decodedData = jwt.verify(authToken,process.env.JWT_SECRET); 

        const user = await User.findById(decodedData._id);

        if(!user)return next(new ErrorHandler("Please login to access this route",401));

        socket.user=user;

        return next();
    } 
    catch (error) 
    {
        console.log(error);
        return next(new ErrorHandler("Please login to access this route",401));
    }
};


export { isAuthenticated, socketAuthenticator };