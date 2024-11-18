import { compare } from "bcrypt";
import {User} from "../models/user.Model.js";
import {Request} from "../models/request.Model.js";
import {Chat} from "../models/chat.Model.js";
import { emitEvent, sendToken, uploadFilesToCloudinary } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import {NEW_REQUEST, REFECH_CHATS} from "../constants/events.js";

// Create a new user and save it to the database and save Token in cookies 
const newUser = async(req,res,next) =>
{
    try 
    {
        const {name,username,password,bio}=req.body;
    
        const file=req.file;
        if(!file) return next(new ErrorHandler("Please upload the avatar file.",400));

        const result=await uploadFilesToCloudinary([file]);
    
        const avatar={
            public_id:result[0].public_id,
            url:result[0].url,
        }
        const user=await User.create(
            {   name: name,
                bio:bio,
                username:username, 
                password:password, 
                avatar:avatar
            });
    
        sendToken(res,user,201,"User Created Successfully");
    } 
    catch (error) 
    {
        return next(error);    
    }
}


// Login the Registed User and save Token in cookies
const login = async(req,res,next) =>
{
   try 
   {
        const {username,password}=req.body;
 
        const user= await User.findOne({username}).select("+password");
 
        if(!user) // if user not found or exist 
        {
            return next(new ErrorHandler("Invalid username",404));
        }
 
        const isPasswordMatch = await compare(password,user.password);
 
        if(isPasswordMatch==false)
        {
            return next(new ErrorHandler("Invalid password",401));
        }
        sendToken(res,user,201,`Welcome Back,${user.name}`);
   } 
   catch (error) 
   {
        next(error)
   }
};

const getMyProfile = async (req,res,next) => {
    try 
    {
        const user=await User.findById(req.userId);

        if(!user) return  next(new ErrorHandler("User not found",404));

        return res
        .status(200)
        .json({
            success:true,
            user
        });
    } 
    catch (error) 
    {
        next(error);
    }
};

const cookieOptions = {
    maxAge: 0,
    sameSite:"none",
    httpOnly:true,
    secure:true,
}

const logout = async(req,res,next) => {
    try 
    {
        return res
        .status(200)
        .cookie("ChatApp-Token","",cookieOptions)
        .json({
            success:true,
            message:"Logged out Successfully"
        });
    } 
    catch (error) 
    {
        next(error);
    }
}

const searchUser = async(req,res,next) => {
    try 
    {
        const {name=""} = req.query;

        // Finding all My chats
        const myChats = await Chat.find({
            groupChat:false,
            members:req.userId,
        });

        const allUsers = myChats.flatMap((chat) => chat.members);

        const allUsersExceptMeAndFriends = await User.find({
            _id: { $nin : allUsers },
            name:{$regex : name, $options : "i" },
        });


        const users =allUsersExceptMeAndFriends.map(({_id,name,avatar}) => ({
            _id,
            name,
            avatar:avatar.url,
        }));


        return res
        .status(200)
        .json({
            success:true,
            users,
        });
    } 
    catch (error) 
    {
        next(error);
    }
}

const sendFriendRequest = async(req,res,next) => {
    try 
    {
        const {userId} = req.body;

        const request= await Request.findOne({
            $or:[
                {sender: req.userId, receiver:userId },
                {sender:userId,receiver:req.userId},
            ],
        })

        if(request) return next(new ErrorHandler("Request already sent",400));

        await Request.create({
            sender:req.userId,
            receiver:userId,
        })

        emitEvent(req,NEW_REQUEST,[userId]);

        return res
        .status(200)
        .json({
            success:true,
            message:"Friend Request Sent"
        });
    } 
    catch (error) 
    {
        next(error);
    }
}

const acceptFriendRequest  = async(req,res,next) => {
    try 
    {
        const {requestId,accept} =req.body;

        const request= await Request.findById(requestId).populate("sender","name").populate("receiver","name");

        if(!request) return next(new ErrorHandler("Request Not find",404));

        if(request.receiver._id.toString()!==req.userId.toString())return next(new ErrorHandler("You are not authorized to accept this request",404));

        if(!accept)
        {
            await request.deleteOne();

            return res
            .status(200)
            .json({
                success:true,
                message:"Friend Request Rejected",
            })
        }

        const members = [request.sender._id,request.receiver._id];

        await Chat.create({
            members:members,
            name:`${request.sender.name}-${request.receiver.name}`,
        });

        await request.deleteOne();

        emitEvent(req,REFECH_CHATS,members);

        return res
        .status(200)
        .json({
            success:true,
            message:"Friend Request Accepted",
            senderId: request.sender._id,
        });
    } 
    catch (error) 
    {
        next(error);
    }
}

const getMyNotifications = async(req,res,next) => 
{
    try 
    {
        const request= await Request.find({receiver:req.userId}).populate("sender","name avatar");

        const allRequest = request.map(({ _id,sender}) => ({
            _id,
            sender:{
                _id:sender._id,
                name:sender.name,
                avatar: sender.avatar.url,
            },
        }));

        return res
        .status(200)
        .json({
            success:true,
            allRequest,
        });
    } 
    catch (error) 
    {
        next(error);
    }
}

const getMyFriends = async(req,res,next) => 
{
    try 
    {
        const chatId= req.query.chatId;

        const chats = await Chat.find({members: req.userId,groupChat:false}).populate("members","name avatar");

        const friends = chats.map(({members}) =>{

            const otherMember = members.find((member) => member._id.toString() !== req.userId.toString())
            return {
                _id:otherMember._id,
                name:otherMember.name,
                avatar:otherMember.avatar.url,
            }

        })

        if(chatId)
        {
            console.log("Chat Id Found.");
            const chat = await Chat.findById(chatId);
            const availableFriends = friends.filter((friend) => !chat.members.includes(friend._id));

            return res
            .status(200)
            .json({
                success:true,
                friends : availableFriends,
            })
        }
        else
        {
            return res
            .status(200)
            .json({
                success:true,
                friends,
            })
        }
    } 
    catch (error) 
    {
        next(error);
    }
}


export { login,newUser,getMyProfile,logout,searchUser,sendFriendRequest,acceptFriendRequest,getMyNotifications,getMyFriends};