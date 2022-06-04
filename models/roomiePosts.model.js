const { use } = require('express/lib/router');
const mongoose      = require('mongoose');
const {Schema}      = mongoose;
const uniqueValidator       = require('mongoose-unique-validator');

const postSchema = new Schema({
    images:[
        {
            type:String,
            required: true,
          
        }

    ],
    cloudinary_id:[
        {
            type:String,
            required: true,
          
        }
    ],
    title:{
        type:String,
    },
    avie:{
        type:String,
    },
    fullName:{
        type:String,
    },
    phone:{
        type:String,
    },
    school:{
        type:String,
    },
    level:{
        type:String,
    },
    dept:{
        type:String,
    },
    address:{
        type:String,
        required: true,
      
    },
    type:{
        type:String,
        required: true,
    },
    totalRoomie:{
        type:String,
        required: true,
    },
    price:{
        type:String,
        required: true,
      
    },
    hobbies:[],
    properties:{
        type:String,
        required: true,
    },
    description:{
        type:String,
        required: true,
    },
   
    userID:{
        type:String,
        required: true,
        unique: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

postSchema.set("toJSON", {
transform:(document, returnedObject) =>{
    returnedObject.id = returnedObject._id.toString(),
    delete returnedObject._id;
    delete returnedObject.__v;
    
},
});
postSchema.plugin(uniqueValidator,{message:" Sorry you already have a find roommate post"});
const Post = mongoose.model("post", postSchema);
module.exports = Post;