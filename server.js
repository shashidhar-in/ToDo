require("dotenv").config();
const express=require("express");

const mongoose=require("mongoose");

//import routes
const authRoute=require("./routes/auth");

const app=express();


app.use(express.json());
app.use(express.urlencoded());

app.get("/",(req,res)=>{
    res.send("todo express server");

});

app.post("/name",(req,res)=>{
    if(req.body.name){
        return res.json({name:req.body.name});
    }
    else{
        return res.status(400).json({error:"No Name provided"});
    }
});

app.use("/api/auth",authRoute);

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('connected to database');

    app.listen(process.env.PORT,()=>{
        console.log(`server running on port ${process.env.PORT}`);
    });
    
}).catch((error)=>{
    console.log(error);
});
