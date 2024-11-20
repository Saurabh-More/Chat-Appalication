

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:4173",
        process.env.CLIENT_URL,
    ],
    credentials:true,
}

const ChatApp_Token = "ChatApp-Token";

export { corsOptions,ChatApp_Token };