import { compare } from "bcrypt";
import {User} from "../models/user.js";
import { sendToken } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

// Create a new user and save it to the database and save Token in cookies 
const newUser = async(req,res) =>
{
    const {name,username,password,bio}=req.body;

    const avatar={
        public_id:"rst",
        url:"etgtg",
    }
    const user=await User.create(
        {   name: name,
            username:username, 
            password:password, 
            avatar:avatar
        });

    sendToken(res,user,201,"User Created Successfully");
}


// Login the Registed User and save Token in cookies
const login = async(req,res,next) =>
{
   try 
   {
        const {username,password}=req.body;
        if(!username || !password)  // if username or password is not entered
        {
            return next(new ErrorHandler("Username Or password is missing",400));
            // return res.status(400).json({message : "Username Or password is missing"});

            // next() is use to call the next middleware which is declared in app.js 
        }
 
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

const getMyProfile = async (req,res) => {
    try 
    {
        const user=await User.findById(req.userId);
        return res
        .status(400)
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

export { login,newUser,getMyProfile}