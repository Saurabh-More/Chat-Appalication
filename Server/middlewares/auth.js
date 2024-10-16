import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken";

const isAuthenticated = (req,res,next) =>
{
    const token=req.cookies["ChatApp-Token"];
    
    // check token is present in the cookies or not 
    if(!token) return next(new ErrorHandler("Please login to access this routes",401));
        
    const decodedData=jwt.verify(token,process.env.JWT_SECRET);

    // For All Further Routes, in the req we added one property is  { userId:_id }  
    req.userId=decodedData._id;

    next();
}

export { isAuthenticated };