import express from "express";
import { isAuthenticated } from "../middlewares/auth.Middleware.js";
import { newGroupChat } from "../controllers/chat.Controller.js";

const app= express.Router();

// After here user must be logged in to access the routes
app.use(isAuthenticated);
app.post("/new",newGroupChat);

export default app;