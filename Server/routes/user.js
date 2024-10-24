import express from "express";
import { acceptFriendRequest, getMyFriends, getMyNotifications, getMyProfile, login, logout, newUser, searchUser, sendFriendRequest } from "../controllers/user.Controller.js";
import { singleAvatar } from "../middlewares/multer.Middleware.js";
import { isAuthenticated } from "../middlewares/auth.Middleware.js";
import {acceptRequestValidater, loginValidater, registerValidater,sendRequestValidater,validateHandler} from "../lib/validaters.js";

const app= express.Router();

// Register
app.post("/new",singleAvatar,registerValidater(),validateHandler,newUser);
// login
app.post("/login",loginValidater(),validateHandler,login);


// After here user must be logged in to access the routes
app.use(isAuthenticated);

app.get("/me",getMyProfile);

// Write api for logout 
app.get("/logout",logout);

app.get("/search",searchUser);

app.put("/sendrequest",sendRequestValidater(),validateHandler,sendFriendRequest);

app.put("/acceptrequest",acceptRequestValidater(),validateHandler,acceptFriendRequest);

app.get("/notifications",getMyNotifications);


app.get("/friends",getMyFriends);

export default app;