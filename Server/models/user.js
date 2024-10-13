import mongoose , { Schema, model } from "mongoose"
import { hash } from "bcrypt"

const schema=new Schema({
    name:{
        type:String,
        required:true,
    },
    username : 
    {
        type:String,
        required:true,
        unique:true,
    },
    password:
    {
        type:String,
        required:true,
        select : false,
    },
    avatar:
    {
       public_id:
       {
            type:String,
            required:true,
       },
       url:
       {
            type:String,
            required:true,
       },
    },
},{timestamps:true,});


schema.pre("save",async function(next)
{
    // Do not hash the password if it is not changed. next() will end the current middleware 
    if(!this.isModified("password"))next();

    // hash the password
    this.password=await hash(this.password,10);
});

export const User = mongoose.models.User || model("User",schema);

