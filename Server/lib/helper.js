import { userSocketIDs } from "../app.js"

const getSockets = (users) =>
{
    const sockets=users.map((user) => userSocketIDs.get(user._id.toString()));
    return sockets;
}

export { getSockets };