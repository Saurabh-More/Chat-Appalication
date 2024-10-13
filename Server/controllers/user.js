import {User} from "../models/user.js";

// Create a new user and save it to the database and save in cookies 
const newUser = async(req,res) =>
{
    const {name,username,password,bio}=req.body;

    const avatar={
        public_id:"rst",
        url:"etgtg",
    }
    await User.create({ name: name,
    username:username, 
    password:password, 
    avatar:avatar});

    res.status(201).json({message : "User Created Successfully"});
}

const login = (req,res) =>
{
    res.send("Hello world");
};

export { login,newUser }