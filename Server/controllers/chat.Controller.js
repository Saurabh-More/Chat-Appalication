import { ErrorHandler } from "../utils/utility.js";
import { deleteFilesFromCloudinary, emitEvent } from "../utils/features.js";
import { ALERT,NEW_ATTACHMENT,NEW_MESSAGE_ALERT,REFECH_CHATS } from "../constants/events.js";
import { Chat } from "../models/chat.Model.js"
import { User } from "../models/user.Model.js"
import { Message } from "../models/message.Model.js"

// Creating Group chat 
const newGroupChat = async(req,res,next)=> 
{
    try 
    {
        const {name,members} = req.body;


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


// Accessing all your chats 
const getMyChats = async (req, res, next) => 
{
    try 
    {
        const chats = await Chat.find({ members: req.userId }).populate("members", "name avatar");

        const transformedChats = chats.map(({ _id, name, members, groupChat }) => 
        {
            const anotherMember = members.find(member => member._id.toString() !== req.userId.toString());

            return {
                _id,
                groupChat,
                name: groupChat?name:anotherMember?.name,                          
                avatar: groupChat 
                ? members.slice(0,3).map(({ avatar }) => avatar.url)
                : [anotherMember?.avatar?.url],                //if it is group chat then store first 3 url of avatar
                members:members.reduce((prev,curr) => 
                        {
                            if(curr._id.toString()!==req.userId.toString())
                            {
                                prev.push(curr._id);
                            }
                            return prev;
                        },[]),
                };                                  // In members store id's of other users
        });

        return res.status(200).json({
            success: true,
            chats:transformedChats,
        });
    } 
    catch (error) 
    {
        next(error);
    }
};

const getMyGroups = async(req,res,next) => 
{
    try 
    {
        const chats=await Chat.find({
            members:req.userId,
            groupChat:true,
            creator:req.userId
        }).populate("members","name avatar");

        const groups=chats.map(({members,_id,groupChat,name})=>
        ({
            _id,
            name,
            groupChat,
            avatar:members.slice(0,3).map(({avatar}) => avatar.url),
        }));

        return res
        .status(200)
        .json({
            success:true,
            groups
        })

    } 
    catch (error) 
    {
        next(error);
    }
}


// add New members in the group
const addMembers = async(req,res,next) => 
{
    try 
    {
        const {chatId,members} = req.body;

        const chat= await Chat.findById(chatId);

        // if chat is not found
        if(!chat)return next(new ErrorHandler("Chat not found",404));

        // if current chat is not a group chat 
        if(!chat.groupChat)return next(new ErrorHandler("This is not a group chat",400));

        // if current user is not a creator of the group chat 
        if(chat.creator.toString()!==req.userId.toString())return next(new ErrorHandler("You are not allowed to add members",403));

        const allNewMembersPromise = members.map((i) => User.findById(i,"name"));

        const allnewMembers = await Promise.all(allNewMembersPromise);

        const uniqueMembers = allnewMembers.filter((i) => !chat.members.includes(i._id.toString())).map((i) => i._id);

        chat.members.push(...uniqueMembers);

        if(chat.members.length > 100)
        {
            return next(new ErrorHandler("Group members limit reached",400));
        }

        await chat.save();

        const allUsersName = allnewMembers.map((i) => i.name).join(",");

        emitEvent(
            req,
            ALERT,
            chat.members,
            `${allUsersName} has been added in the group`,
        )

        emitEvent(req,REFECH_CHATS,chat.members);

        return res
        .status(200)
        .json({
            success:true,
            message:"Members added Successfully",
        })
    
    } 
    catch (error) 
    {
        next(error);
    }
}

// removed members from the group
const removeMember = async(req,res,next) => 
{
    try 
    {
        const {userId,chatId} = req.body;
            
        const chat=await Chat.findById(chatId);

        const userThatWillBeRemoved=await User.findById(userId);

        
        // if chat is not found
        if(!chat)return next(new ErrorHandler("Chat not found",404));

        // if current chat is not a group chat 
        if(!chat.groupChat)return next(new ErrorHandler("This is not a group chat",400));

        // if current user is not a creator of the group chat 
        if(chat.creator.toString()!==req.userId.toString())return next(new ErrorHandler("You are not allowed to Remove members",403));

        if(chat.members.length <= 3)
        {
            return next(new ErrorHandler("Group must have at least 3 members",400));
        }

        chat.members= chat.members.filter((member) => member.toString()!==userId.toString());

        await chat.save();

        emitEvent(
            req,
            ALERT,
            chat.members,
            `${userThatWillBeRemoved.name} has been removed from the group`,
        )

        emitEvent(req,REFECH_CHATS,chat.members);


        return res
        .status(200)
        .json({
            success:true,
            message:"Member  Removed Successfully",
        })
    
    } 
    catch (error) 
    {
        next(error);
    }
}

// leave the chat
const leaveGroup = async(req,res,next) => 
{
    try 
    {
        const chatId=req.params.id;
            
        const chat=await Chat.findById(chatId);
        
        
        // if chat is not found
        if(!chat)return next(new ErrorHandler("Chat not found",404));
        
        // if chat is not a group chat 
        if(!chat.groupChat)
        {
            return next(new ErrorHandler("This is not a group chat",400));
        }
            
        const remaningMembers= chat.members.filter((member) => member.toString()!==req.userId.toString());

        if(remaningMembers.length < 3)
        {
            return next(new ErrorHandler("Group must have at least 3 members",400));
        }
            
        // if current user is a creator of that group chat 
        if(chat.creator.toString()===req.userId.toString())
        {
            // assign any random user as a creator 
            const randomElement = Math.floor(Math.random() * remaningMembers.length);
            chat.creator=remaningMembers[randomElement];
        }
                
        // Now any one can leave the group
        chat.members=remaningMembers;
                
        const user=await User.findById(req.userId,"name");
                
        // Save the Updated chat
        await chat.save();
                
        emitEvent(
            req,
            ALERT,
            chat.members,
            `${user.name} has left the group`,
        )
                
        return res
        .status(200)
        .json({
            success:true,
            message:"Member leaved Successfully",
        })       
    } 
    catch (error) 
    {
        next(error);
    }
}

const sendAttachments = async(req,res,next) =>
{
    try 
    {
        const  { chatId } =req.body;

        const files=req.files || [];
        if(files.length<1) return next(new ErrorHandler("Please Provide Attachments",400));
        if(files.length>5) return next(new ErrorHandler("You can't Provide Attachmentsmore than 5",400));
        
        
        const chat=await Chat.findById(chatId);
        const me=await User.findById(req.userId,"name");

        if(!chat)return next(new ErrorHandler("Chat not found",404));
        

        const attachmeants=[];

        const messageForRealTime = {
            content:"",
            attachmeants,
            sender:{
                _id:me._id,
                name:me.name,
            },
            chat:chatId,
        };

        const messageForDB = {
            content:"",
            attachmeants,
            sender:me._id,
            chat:chatId,
        };

        const message = await Message.create(messageForDB);

        emitEvent(req,NEW_ATTACHMENT,chat.members,{
            message:messageForRealTime,
            chatId,
        });

        emitEvent(req,NEW_MESSAGE_ALERT,chat.members,{chatId});

        return res
        .status(200)
        .json({
            success:true,
            message,
        });
    } 
    catch (error) 
    {
        next(error);
    }
}

const getChatDetails = async(req,res,next) => 
{
    try 
    {
        if(req.query.populate==="true")
        {
            const chat=await Chat.findById(req.params.id).populate("members","name avatar").lean();

            if(!chat) return next(new ErrorHandler("Chat not found",404));

            chat.members=chat.members.map(({ _id, name, avatar }) => 
                ({
                _id,
                name,
                avatar:avatar.url,
            }));

            return res
            .status(200)
            .json({
                success:true,
                chat,
            })
        }
        else
        {
            const chat=await Chat.findById(req.params.id);
            if(!chat) return next(new ErrorHandler("Chat not found",404));

            return res
            .status(200)
            .json({
                success:true,
                chat,
            });
        }
    } 
    catch (error) 
    {
        next(error);
    }
}

const renameGroup = async(req,res,next) =>
{
    try 
    {
        const chatId = req.params.id;
        const {name} = req.body;

        const chat=await Chat.findById(chatId);

        if(!chat) return next(new ErrorHandler("Chat not found",404));

        if(!chat.groupChat)return next(new ErrorHandler("This not a geoup Chat",400));

        if(req.userId.toString() !==chat.creator.toString())
        {
            return next(new ErrorHandler("You are not allowed to rename the group",403));
        }

        chat.name=name;
        await chat.save();
        emitEvent(req,REFECH_CHATS,chat.members);

        return res
        .status(200)
        .json({
            success:true,
            message:"Group renamed successfully",
        });
    } 
    catch (error) 
    {
        next(error);
    }
}

const deleteChat = async(req,res,next) =>
{
    try 
    {
        const chatId = req.params.id;

        const chat=await Chat.findById(chatId);

        if(!chat) return next(new ErrorHandler("Chat not found",404));

        const members = chat.members;

        if(chat.groupChat && chat.creator.toString()!==req.userId.toString())
        {
            return next(new ErrorHandler("You are not allowed to delete the group",403));
        }

        if(!chat.groupChat && !chat.members.includes(req.userId.toString()))
        {
            return next(new ErrorHandler("You are not allowed to delete the group",403));
        }

        // Here we have to delete all Messages as well as attachments or files from cloudinary

        const messagesWithAttachments = await Message.find({
            chat:chatId,
            attachmeants:{ $exists:true, $ne : []},
        });

        const public_ids = [];

        messagesWithAttachments.forEach(({attachmeants}) =>
            attachmeants.forEach(({public_id}) => public_ids.push(public_id)) 
        );

        await Promise.all([
            // DeleteFiles from cloudinary
            deleteFilesFromCloudinary(public_ids),
            chat.deleteOne(),
            Message.deleteMany({chat : chatId}),
        ]);

        emitEvent(req,REFECH_CHATS,members);

        return res
        .status(200)
        .json({
            success:true,
            message:"Chat deleted successfully",
        })

    } 
    catch (error) 
    {
        next(error);    
    }
}

const getMessages = async(req,res,next) =>
{
    try 
    {
        const chatId=req.params.id;
        const {page=1}=req.query;
        const resultPerPage=20;
        const skip = (page-1)*resultPerPage;

        const [messages,totalMessagesCount]= await Promise.all([Message.find({chat:chatId})
            .sort({createdAt : -1})
            .skip(skip)
            .limit(resultPerPage)
            .populate("sender","name")
            .lean(),
            Message.countDocuments({chat : chatId})
        ]);

        const totalPages = Math.ceil(totalMessagesCount/resultPerPage) || 0;

        return res
        .status(200)
        .json({
            success:true,
            message:messages.reverse(),
            totalPages,
        })
    } 
    catch (error) 
    {
        next(error);
    }
}

export { 
    newGroupChat,
    getMyChats,
    getMyGroups,
    addMembers,
    removeMember,
    leaveGroup,
    sendAttachments,
    getChatDetails,
    renameGroup,
    deleteChat,
    getMessages,
};