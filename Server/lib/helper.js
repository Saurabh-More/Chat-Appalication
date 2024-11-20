import { userSocketIDs } from "../app.js"

const getSockets = (users = []) =>
{
    const sockets=users.map((user) => userSocketIDs.get(user.toString()));
    return sockets;
}

// Function to convert a file to Base64 format
export const getBase64 = (file) => 
{
    if (!file || !file.mimetype || !file.buffer) 
    {
        throw new Error("Invalid file object");
    }
    
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

export { getSockets };