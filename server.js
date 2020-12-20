const express=require('express');
const mongoose =require("mongoose")
const app=express();
const Pusher = require("pusher");
const connection_URL="mongodb+srv://anil:DUlhkkfvzMfexb8E@cluster0.yv4cf.mongodb.net/Whatsapp?retryWrites=true&w=majority"
const message = require("./DB_model")
const bodyParser = require("body-parser");
const cors=require("cors")
app.use(bodyParser.json());
app.use(cors());

const pusher = new Pusher({
    appId: "1107598",
    key: "caa1075b7b0fb8810565",
    secret: "e2ea1ca3f61c7375b8a1",
    cluster: "ap2",
    useTLS: true
  });

mongoose.connect(connection_URL,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const db=mongoose.connection;
db.once("open",()=>{
    const msgCollection=db.collection("messages");
    const changeStream=msgCollection.watch()
    changeStream.on('change',(change)=>{
        console.log(change)
        if(change.operationType==='insert'){
            const meesagedetails=change.fullDocument;
            pusher.trigger('messages','inserted',{
                name:meesagedetails.name,
                message:meesagedetails.message,
                timestamp:meesagedetails.timestamp,
                recieved:meesagedetails.recieved
            });      
        }
        else{
            console.log('Error in pusher')
        }
    })
})
app.get("/",(req,res)=>{
    res.status(200).send("Hello world")
})

app.get('/messages/sync',(req,res)=>{
    message.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

app.post("/messages/new",async (req,res)=>{
    try{
     const dbMessage=req.body
     await new message({
    message:dbMessage.message,
    name:dbMessage.name,
    timestamp:dbMessage.timestamp,
    recieved:dbMessage.recieved
      }).save();
      res.status(201).json({ status: "success", message:dbMessage});
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
})

app.listen(9000,()=>{
    console.log("the server is running")
})


