import express from "express";
import { connectDB } from "./utils/features.js";

import dotenv from "dotenv"
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";

import { v4 as uuid }  from "uuid";

// Related To Socket
import { createServer } from "http";
import { Server } from "socket.io";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.Model.js";



dotenv.config({
    path:"./.env",
});

// Connect the database 
const mongoURI= process.env.MONGO_URI;
const port = process.env.PORT || 3000 ;  
connectDB(mongoURI);

// Store all Active Users IDs and Corresponding Socket IDs
const userSocketIDs = new Map(); 

const app=express();
// Initializing Socket
const server= createServer(app);
const io=new Server(server,{});


//Using Middlewares here 
app.use(express.json());    // To get data in JSON format
app.use(cookieParser());    // Use to access the user cookies and set it 



app.use("/user",userRoute);
app.use("/chat",chatRoute);

app.get("/",(req,res) => {
    res.send("Hello World");
});

io.use((socket,next) =>{});

io.on("connection",(socket) =>
{
    const user = {
        _id:"asdfg",
        name:"Nambo",
    }
    userSocketIDs.set(user._id.toString(),socket.id);
    console.log("User Connected. Socket Id = ",userSocketIDs);

    socket.on(NEW_MESSAGE, async ({chatId,members,message}) =>{


        const messageForRealTime = {
            content:message,
            _id:uuid(),
            sender:{
                _id:user._id,
                name:user.name,
            },
            chat:chatId,
            createdAt : new Date().toISOString,
        }

        const messageForDB ={
            content:message,
            sender:user._id,
            chat:chatId,
        }

        const membersSockets= getSockets(members);
        io.to(membersSockets).emit(NEW_MESSAGE,{
            chatId,
            message : messageForRealTime,
        })

        io.to(membersSockets).emit(NEW_MESSAGE_ALERT,{chatId});

        try {
            await Message.create(messageForDB);
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("disconnect",() =>
    {
        console.log("User Disconnected.");
        userSocketIDs.delete(user._id.toString());
    });
});


app.use(errorMiddleware);

server.listen(port,() => {
    console.log(`Server is running on port : ${port} in ${process.env.NODE_ENV} Mode`);
})

export { userSocketIDs };