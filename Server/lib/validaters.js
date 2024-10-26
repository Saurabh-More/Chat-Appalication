import { body, param, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

const validateHandler = (req,res,next) => {
    const errors=validationResult(req);

    const errorMessages = errors.array().map((error) => error.msg).join(", ");


    if(errors.isEmpty()) return next();
    else next(new ErrorHandler(errorMessages,400));
};

const registerValidater = () => [
    body("name" , "Please Enter Name").notEmpty(),
    body("username" , "Please Enter Username").notEmpty(),
    body("password" , "Please Enter password").notEmpty(),
    body("bio" , "Please Enter Bio").notEmpty(),
];

const loginValidater = () => [
    body("username" , "Please Enter Username").notEmpty(),
    body("password" , "Please Enter password").notEmpty(),
];

const newGroupValidater = () => [
    body("name" , "Please Enter Name").notEmpty(),
    body("members").notEmpty().withMessage("Please enter Members")
    .isArray({min:2,max:100}).withMessage("Members must be 2-100"),
];

const addMembersValidater = () => [
    body("chatId" , "Please Enter Chat ID").notEmpty(),
    body("members").notEmpty().withMessage("Please enter Members")
    .isArray({min:1,max:97}).withMessage("Members must be 1-97"),
];

const removeMemberValidater = () => [
    body("chatId" , "Please Enter Chat ID").notEmpty(),
    body("userId" , "Please Enter User ID").notEmpty(),
];


const sendAttachmentsValidater = () => [
    body("chatId" , "Please Enter Chat ID").notEmpty()
];

const chatIdValidater = () => [
    param("id" , "Please Enter Chat ID").notEmpty(),
];

const renameValidater = () => [
    param("id" , "Please Enter Chat ID").notEmpty(),
    body("name" , "Please Enter New Name").notEmpty(),
];

const sendRequestValidater = () => [
    body("userId" , "Please Enter userId").notEmpty(),
];

const acceptRequestValidater = () => [
    body("requestId" , "Please Enter Request Id").notEmpty(),
    body("accept")
    .notEmpty().withMessage("Please add accept")
    .isBoolean().withMessage("Accept must be boolean"),
];



export {
    acceptRequestValidater, addMembersValidater, chatIdValidater, loginValidater,
    newGroupValidater, registerValidater, removeMemberValidater, renameValidater, sendAttachmentsValidater, sendRequestValidater, validateHandler
};
