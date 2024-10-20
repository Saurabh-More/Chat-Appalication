import { faker } from "@faker-js/faker";
import { Chat } from "../models/chat.Model.js";
import { Message } from "../models/message.Model.js";
import { User } from "../models/user.Model.js";

const createMessages = async(numMessages) =>
    {
        try 
        {
            const users = await User.find().select("_id");
            const chats = await Chat.find().select("_id");
            
            const messagesPromise = [];
    
            for(let i=0;i<numMessages;i++)
            {
                const randomUser = users[Math.floor(Math.random()*users.length)];
                const randomChat = chats[Math.floor(Math.random()*chats.length)];
    
                messagesPromise.push(
                    Message.create({
                        chat:randomChat,
                        sender:randomUser,
                        content:faker.lorem.sentence(),
                    })
                );
            }
    
            await Promise.all(messagesPromise);
            console.log("Message created successfully");
            process.exit(1);
        } 
        catch (error) 
        {
            console.error(error);
            process.exit(1);
        }
    };
    
    const createMessagesInAChat = async (chatId, numMessages) => {
        try {
          // Fetch all users
          const users = await User.find().select("_id");
      
          // Ensure there are users in the database
          if (!users.length) {
            throw new Error("No users found in the database");
          }
      
          const messagesPromise = [];
      
          // Create multiple messages
          for (let i = 0; i < numMessages; i++) {
            // Select a random user for each message
            const randomUser = users[Math.floor(Math.random() * users.length)];
      
            // Push the creation promise into the array
            messagesPromise.push(
              Message.create({
                chat: chatId,
                sender: randomUser._id, // You need to use `_id`
                content: faker.lorem.sentence(),
              })
            );
          }
      
          // Wait for all message creation operations to complete
          await Promise.all(messagesPromise);
      
          console.log("Messages created successfully");
      
          // process.exit(0); // Only use this if you want to exit after creating the messages
        } catch (error) {
          console.error("Error creating messages:", error);
      
          process.exit(1); // Exit with a failure code
        }
      };
      

export { createMessages, createMessagesInAChat };
