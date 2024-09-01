import express from "express";
import {
  addMembers,
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
  renameGroup,
  sendattachment,
} from "../controlers/chat.controlers.js";
import {
  addMembersValidator,
  deleteChatValidator,
  getChatDetailsValidator,
  getMessagesValidator,
  leaveGroupValidator,
  newGroupChatValidator,
  removeMemberValidator,
  renameGroupValidator,
  validate,
} from "../lib/validator.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { attachmentMulter } from "../middlewares/multer.middlewares.js";

const app = express.Router();

app.use(isAuthenticated);
// after here user must be logged in to access the routes
app.post("/new-chat", newGroupChatValidator(), validate, newGroupChat);
app.get("/get-my-chats", getMyChats);
app.get("/get-my-groups", getMyGroups);
app.put("/addmember", addMembersValidator(), validate, addMembers);
app.put("/remove-member", removeMemberValidator(), validate, removeMember);
app.delete("/leave/:id", leaveGroupValidator(), validate, leaveGroup);

// send attachments
app.post("/send-attachment", attachmentMulter, sendattachment);

// get massages
app.get("/messages/:id", getMessagesValidator(), validate, getMessages);
// get chat deatails reame delete
app
  .route("/:id")
  .get(getChatDetailsValidator(), validate, getChatDetails)
  .put(renameGroupValidator(), validate, renameGroup)
  .delete(deleteChatValidator(), validate, deleteChat);

export default app;
