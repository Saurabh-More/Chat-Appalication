import express from "express";
import { isAuthenticated } from "../middlewares/auth.Middleware.js";
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMember, renameGroup, sendAttachments } from "../controllers/chat.Controller.js";
import { attachmentsMulter } from "../middlewares/multer.Middleware.js";
import { addMembersValidater, chatIdValidater, newGroupValidater, removeMemberValidater, renameValidater, sendAttachmentsValidater, validateHandler } from "../lib/validaters.js";

const app= express.Router();

// After here user must be logged in to access the routes
app.use(isAuthenticated);

app.post("/new",newGroupValidater(),validateHandler,newGroupChat);

app.get("/my",getMyChats); 

app.get("/my/groups",getMyGroups);

app.put("/addmembers",addMembersValidater(),validateHandler,addMembers);

app.put("/removemember",removeMemberValidater(),validateHandler,removeMember);

app.delete("/leave/:id",chatIdValidater(),validateHandler,leaveGroup);

// send Attachments
app.post("/message",attachmentsMulter,sendAttachmentsValidater(),validateHandler,sendAttachments);

// get Messages
app.get("/messages/:id",chatIdValidater(),validateHandler,getMessages);

// gwt chat details , rename, delete
app.route("/:id")
.get(chatIdValidater(),validateHandler,getChatDetails)
.put(renameValidater(),validateHandler,renameGroup)
.delete(chatIdValidater(),validateHandler,deleteChat);

export default app;