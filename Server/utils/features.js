import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {v4 as uuid} from "uuid";
import {v2 as cloudinary} from "cloudinary";
import { getBase64, getSockets } from "../lib/helper.js";

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
        user,
        message,
    }); 
};

const emitEvent = (req,event,users,data) =>{
    const io=req.app.get("io");
    const usersSocket = getSockets(users);
    io.to(usersSocket).emit(event,data);
};


const uploadFilesToCloudinary = async(files=[]) =>
{
    const uploadPromises = files.map((file) => {
        return new Promise((resolve,reject) => {
            cloudinary.uploader.upload(
                getBase64(file),
                {
                    resource_type:"auto",
                    public_id:uuid(),
                },
                (error,result) =>{
                    if(error) return reject(error);
                    resolve(result);
                }
            );
        });
    });

    try 
    {
        const results = await Promise.all(uploadPromises);
        
        const formatedResults = results.map((result) => ({
            public_id:result.public_id,
            url:result.url,
        })) ;
        return formatedResults;

    } 
    catch (err) 
    {
        throw new Error("Error uploading files to cloudinary",err);
    }
};

const deleteFilesFromCloudinary = async(public_ids) => 
{
    // Delete file from cloudinary
};

export { 
    connectDB,
    sendToken,
    emitEvent,
    deleteFilesFromCloudinary,
    uploadFilesToCloudinary
} ;