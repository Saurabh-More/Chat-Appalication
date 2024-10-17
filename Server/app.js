import express from "express";
import { connectDB } from "./utils/features.js";

import dotenv from "dotenv"
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";



dotenv.config({
    path:"./.env",
});

// Connect the database 
const mongoURI= process.env.MONGO_URI;
const port = process.env.PORT || 3000 ;  
connectDB(mongoURI);

const app=express();

//Using Middlewares here 
app.use(express.json());    // To get data in JSON format
app.use(cookieParser());    // Use to access the user cookies and set it 



app.use("/user",userRoute);
app.use("/chat",chatRoute);

app.get("/",(req,res) => {
    res.send("Hello World");
});


app.use(errorMiddleware);

app.listen(port,() => {
    console.log(`Server is running on port : ${port}`);
})