import express from "express";
import { getMyProfile, login, logout, newUser, searchUser } from "../controllers/user.Controller.js";
import { singleAvatar } from "../middlewares/multer.Middleware.js";
import { isAuthenticated } from "../middlewares/auth.Middleware.js";

const app= express.Router();

// Register
app.post("/new",singleAvatar,newUser);
// login
app.post("/login",login)


// After here user must be logged in to access the routes

app.get("/me",isAuthenticated,getMyProfile);

// Write api for logout 
app.get("/logout",isAuthenticated,logout);

app.get("/search",isAuthenticated,searchUser);

export default app;