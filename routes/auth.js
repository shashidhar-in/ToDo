const express=require('express');
const router=express.Router();
const User=require("../models/User");
const bcrypt=require('bcryptjs');

//@route    GET/api/test
//@desc     Test the auth route
//@access   Public
router.get("/test",(req,res)=>{
    res.send("Auth route working");
});
//@route    GET/api/test
//@desc     Test the auth route
//@access   Public
router.post("/register",async(req,res)=>{
    try{
        const hashedPassword=await bcrypt.hash(req.body.password,12);
        //create a new user
        const newUser=new User({
            email: req.body.email,
           password: hashedPassword,
            name: req.body.name,
        });

        //save user to db
        const savedUser=await newUser.save();

        //return the new user
        return res.json(savedUser);
    }
    catch(err){
        console.log(err);

        res.status(500).send(err.message);

    }
})

module.exports=router;