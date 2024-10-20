import express from "express";
import { isAuthenticated } from "../middlewares/auth.Middleware.js";
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMember, renameGroup, sendAttachments } from "../controllers/chat.Controller.js";
import { attachmentsMulter } from "../middlewares/multer.Middleware.js";

const app= express.Router();

// After here user must be logged in to access the routes
app.use(isAuthenticated);

app.post("/new",newGroupChat);
app.get("/my",getMyChats); 
app.get("/my/groups",getMyGroups);
app.put("/addmembers",addMembers);
app.put("/removemember",removeMember);
app.delete("/leave/:id",leaveGroup);
// send Attachments
app.post("/message",attachmentsMulter,sendAttachments);

// get Messages
app.get("/messages/:id",getMessages);

// gwt chat details , rename, delete
app.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);

export default app;