const { use } = require('express/lib/router');
const mongoose      = require('mongoose');
const {Schema}      = mongoose;
const uniqueValidator       = require('mongoose-unique-validator');

const userSchema = new Schema({
    phone:{
        type:String,
        required: true,
        unique: true
    },
    avatar:{
        type:String
      
    },
    cloudinary_id:{
        type:String
    },
    fName:{
        type:String,
        required: true,
      
    },
    lName:{
        type:String,
        required: true,
      
    },
    dept:{
        type:String,
        required: true,
      
    },
    level:{
        type:String,
        required: true,
      
    },
    sch:{
        type:String,
        required: true,
      
    },
    userID:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
       required:true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

userSchema.set("toJSON", {
transform:(document, returnedObject) =>{
    returnedObject.id = returnedObject._id.toString(),
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
},
});
userSchema.plugin(uniqueValidator,{message:" A user with this Data already exists"});
const User = mongoose.model("user", userSchema);
module.exports = User;