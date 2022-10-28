const e = require('express');
const Validator=require('validator');
const isEmpty=require("./isEmpty");

const validateRegisterInput=(data)=>{

    let errors={};

    if(isEmpty(data.email)){
        errors.email="Email field cannot be empty";

    }
    else if(!Validator.isEmail(data.email)){
        errors.email="Email is invalid ,please provide a valid email";
    }
    if (isEmpty(data.name)) {
        errors.name = "Name field can not be empty";
      } else if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = "Name must be between 2 and 30 characters long";
      }

     if(isEmpty(data.password)){
        errors.password="Password field cannot be empty";

     }
     else if(!Validator.isLength(data.password,{min:6,max:150})){
        errors.password="Password must be betweet 6 and 150 characters";
     } 


     if(isEmpty(data.confirmPassword)){
        errors.confirmPassword="Confirm Password field cannot be empty";

     }else if(!Validator.equals(data.password,data.confirmPassword)){
        errors.confirmPassword="Password not matching"
     }

     
     return {
        errors,
        isValid: isEmpty(errors),
     };
};

module.exports=validateRegisterInput;
