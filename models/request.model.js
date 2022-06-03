const { use } = require('express/lib/router');
const mongoose      = require('mongoose');
const {Schema}      = mongoose;
const uniqueValidator       = require('mongoose-unique-validator');

const userRequestSchema = new Schema({
    posterName:{
        type:String,
        required: true,
      
    },
    posterContact:{
        type:String,
        required: true,
      
    },
    reqsterName:{
        type:String,
        required: true,
      
    },
    reqsterContact:{
        type:String,
        required: true,
      
      
    },
   posterImg:{
        type:String,
        required: true,
      
    },
   reqsterImg:{
        type:String,
        required: true,
      
    },
    status:{
        type:String,
        required: true,
      
    },
    address:{
        type:String,
        required: true,
      
    },
    price:{
        type:String,
        required: true,
      
    },
  
    date:{
        type: Date,
        default: Date.now
    }
});

userRequestSchema.set("toJSON", {
transform:(document, returnedObject) =>{
    returnedObject.id = returnedObject._id.toString(),
    delete returnedObject._id;
    delete returnedObject.__v;
   
},
});
// userRequestSchema.plugin(uniqueValidator,{message:"You've made a request to this user already"});
const Request= mongoose.model("request", userRequestSchema);
module.exports = Request;