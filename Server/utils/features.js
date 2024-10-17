import mongoose from "mongoose"
import jwt from "jsonwebtoken"

const cookieOptions = {
    maxAge: 15*24*60*60*1000,
    sameSite:"none",
    httpOnly:true,
    secure:true,
}

const connectDB = (uri) =>
{
    mongoose
    .connect(uri,{dbName : "ChatApp"})
    .then((data) =>  console.log(`Connected To DB : ${data.connection.host}`))
    .catch((error) =>{
        throw error;
    });
};

const sendToken = (res,user,statusCode,message)=>
{
    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);

    return res
    .status(statusCode)
    .cookie("ChatApp-Token",token,cookieOptions)
    .json({
        success:true,
        message,
    }); 
};


export { connectDB,sendToken} ;