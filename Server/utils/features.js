import mongoose from "mongoose"


const connectDB = (uri) =>
{
    mongoose
    .connect(uri,{dbName : "ChatApp"})
    .then((data) =>  console.log(`Connected To DB : ${data.connection.host}`))
    .catch((error) =>{
        throw error;
    });
};

export { connectDB } ;