const Validator=require('validator');
const isEmpty=require('./isEmpty');

const validateToDoInput=data=>{
    let errors={};

    //check content feild
    if(isEmpty(data.content)){
        errors.content="Content fields cannot be empty";


    }
    else if(!Validator.isLength(data.content,{min:1,max:300})){
        errors.content='Content fields must be between 1 and 300 Characters';

    }

    return{
        errors,
        isValid:isEmpty(errors)
    }
}

module.exports=validateToDoInput;
