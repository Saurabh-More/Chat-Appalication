import { faker, simpleFaker } from "@faker-js/faker";
import { Chat } from "../models/chat.Model.js";
import { User } from "../models/user.Model.js";

const createSingleChat = async(numChats) => 
    {
        try 
        {
            const users= await User.find().select("_id");
            const chatPromise = [];
            
            for(let i=0;i<numChats;i++)
            {
                for(let j=i+1;j<users.length;j++)
                {
                    chatPromise.push(
                        Chat.create({
                            name:faker.lorem.words(2),
                            members: [users[i],users[j]],
                        })
                    )
                }
            }
    
            await Promise.all(chatPromise);
            console.log("Single Chats created successfully");
            process.exit();
    
        } 
        catch (error) 
        {
            console.error(error);
            process.exit(1);
        }
    }
    
    const createGroupChat = async(numChats) => 
    {
        try 
        {
            const users= await User.find().select("_id");
            const chatPromise = [];
            
            for(let i=0;i<numChats;i++)
            {
                const numMembers = simpleFaker.number.int({min : 3 , max:users.length});
    
                const members = [];
                for(let j=0;j<numMembers;j++)
                {
                    const randomIndex = Math.floor(Math.random() * users.length);
                    const randomUser = users[randomIndex];
    
                    if(!members.includes(randomUser))
                    {
                        members.push(randomUser);
                    }
                }
                const chat = Chat.create({
                    groupChat:true,
                    name:faker.lorem.words(2),
                    members,
                    creator:members[0],
                })
    
                chatPromise.push(chat);
            }
    
            await Promise.all(chatPromise);
            console.log("Group Chats created successfully");
            process.exit();
    
        } 
        catch (error) 
        {
            console.error(error);
            process.exit(1);
        }
    }
    
export { createGroupChat, createSingleChat };
