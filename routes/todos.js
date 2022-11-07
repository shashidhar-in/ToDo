const express=require('express');
const router=express.Router();
const ToDo=require("../models/ToDo");
const requiresAuth=require("../middleware/permissions");
const validateToDoInput=require("../validation/TodoValidation");

//@routes Get/api/todos/test
//@desc Test the todos route
//@access Public

router.get("/test",(req,res)=>{
    res.send("ToDo route woring");
});

//@routes Post/api/todos/new
//@desc Create a new ToDo
//@access Private
router.post("/new",requiresAuth,async(req,res)=>{
    try{
        const{isValid,errors}=validateToDoInput(req.body);
        if(!isValid){
            return res.status(400).json(errors); 
        }
        //create a new todo
        const newTodo=new ToDo({
            user:req.user._id,
            content:req.body.content,
            complete:false,
        })

        await newTodo.save();
        return res.json(newTodo);
    }
    catch(err){
        console.log(err);

        return res.status(500).send(err.message);

    }
});
//@routes Get/api/todos/current
//@desc current users todos
//@access Private
router.get("/current",requiresAuth,async(req,res)=>{
    try {
        const completeTodos=await ToDo.find({
            user:req.user._id,
            complete:true,

        
        }).sort({completedAt:-1});

        const incompleteTodos=await ToDo.find({
            user:req.user._id,
            complete:false,

        }).sort({createdAt:-1});

        return res.json({incomplete:incompleteTodos,complete:completeTodos});
        
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);

        
    }
});

module.exports=router;