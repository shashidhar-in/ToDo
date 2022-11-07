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
//@routes PUT/api/todos/:toDoId/complete
//@desc Mark a todo as complete
//@access Private
router.put("/:toDoId/complete",requiresAuth,async(req,res)=>{
    try {
        const toDo=await ToDo.findOne({
            user:req.user._id,
            _id:req.params.toDoId
        });
        if(!toDo){
            return res.status(404).json({errors:'Could not find Todo'});
        }
        if(toDo.complete){
            return res.status(400).json({errors:"ToDo is already Complete"});
        };
        const updatedTodo=await ToDo.findByIdAndUpdate({
            user:req.user._id,
            _id:req.params.toDoId,
        },
        {
            complete:true,
            completedAt:new Date(),
        },
        {
            new :true
        }
        );
        return res.json(updatedTodo);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);

        
    }
});
//@routes PUT/api/todos/:toDoId/incomplete
//@desc Mark a todo as incomplete
//@access Private
router.put("/:toDoId/incomplete",requiresAuth,async(req,res)=>{
    try {
        const toDo=await ToDo.findOne({
            user:req.user._id,
            _id:req.params.toDoId,
        });
        if(!toDo){
            return res.status(404).json({error:"Could not find Todo"});

        }
        if(!toDo.complete){
            return res.status(400).json({error:'ToDo is already incomplete'});
        }
        const updatedTodo=await ToDo.findOneAndUpdate({
            user:req.user._id,
            _id:req.params.toDoId,
        },{
            complete:false,
            completedAt:null
        },
        {
            new :true
        })
        return res.json(updatedTodo);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
        
    }
});

//@routes PUT/api/todos/:toDoId
//@desc   Update a todo
//@access Private
router.put("/:toDoId",requiresAuth,async(req,res)=>{
    try {
        const toDo=await ToDo.findOne({
            user:req.user._id,
            _id:req.params.toDoId
        });
        if(!toDo){
            return res.status(404).json({error:'Could not find ToDo'});
        }
        const {isValid,errors}=validateToDoInput(req.body);
        if(!isValid){
            return res.status(400).json(errors);
        }
        const updatedTodo=await ToDo.findOneAndUpdate({
            user:req.user._id,
            _id:req.params.toDoId,
        },
        {
            content:req.body.content,
        },
        {
            new:true,
        });
        return res.json(updatedTodo);
        
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
        
    }
});
//@routes DELETE/api/todos/:toDoId
//@desc Delete a ToDo
//@access Private 
router.delete("/:toDoId", requiresAuth, async (req, res) => {
    try {
      const toDo = await ToDo.findOne({
        user: req.user._id,
        _id: req.params.toDoId,
      });
  
      if (!toDo) {
        return res.status(404).json({ error: "Could not find ToDo" });
      }
  
      await ToDo.findOneAndRemove({
        user: req.user._id,
        _id: req.params.toDoId,
      });
  
      return res.json({ success: true });
    } catch (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }
  });


module.exports=router;