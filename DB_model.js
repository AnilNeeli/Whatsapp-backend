const mongoose =require("mongoose");
const { Schema, model } = mongoose;


const whatsappSchema=new Schema({
    message:String,
    name:String,
    timestamp:String,
    recieved:Boolean
})

const message=model("message",whatsappSchema);

module.exports=message;