import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.Model.js"
import { emitEvent } from "../utils/features.js";
import { ALERT,REFECH_CHATS } from "../constants/events.js";

// Creating Group chat 
const newGroupChat = async(req,res,next)=> 
{
    try 
    {
        const {name,members} = req.body;
        if(members.length<2)
        {
            return next(new ErrorHandler("Group chat must have at least 3 members",400));
        }    

        const allMembers=[...members , req.userId];
        await Chat.create({
            name,
            groupChat:true,
            creator:req.userId,
            members:allMembers,
        });
        
        emitEvent(req,ALERT,allMembers,`Welcome to ${name} group`);
        emitEvent(req,REFECH_CHATS,members);

        return res.status(200)
        .json({
            success:true,
            message:"Group Chat created"
        })

    } 
    catch (error) 
    {
        next(error);
    }
};

export { newGroupChat };