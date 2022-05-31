const Post  = require('../models/roomiePosts.model');
const Request  = require('../models/request.model');
const User = require("../models/user.model");
const cloudinary = require("../utils/cloudinary");

async function findRoomie(params, callback){
    const userid = params.userID;
    const user = await User.findOne({userid});

    if(user != null){
        const post = new Post(params);
        post.save().then((response) =>{
            return callback(response);
        }).catch((error) =>{
            return callback(error);
        });
    }
};

//Request Post Method
async function makeRequest(params, callback){
    // const userid = params.userID;
    // const user = await User.findOne({userid});

    // if(user != null){
        const requestPost = new Request(params);
        requestPost.save().then((response) =>{
            return callback(null, response);
        }).catch((error) =>{
            return callback(error);
        });
    // }
};

// Get all Roomie post by address
async function getfindRoomie(params, callback){
    const user = await params.userID;
    const address = await params.address;

    var conditions = address ?{
        address: {$regex: new RegExp(address), $position:"i"},
    } : {};

   
        Post.find(conditions).then((response) =>{
            return callback(null, response);
        }).catch((error) =>{
            return callback(error);
        });
   
}

// Get by user
async function getByuserID(params, callback){
    const user = await params.userID;
  
        Post.findOne({userID:user}).then((response) =>{
            if(!response) callback("Login and try again")
            else
            return callback(null, response);
        }).catch((error) =>{
            return callback(error);
        });
   
}



//update

async function updateByID(params, callback){
    const post = await params.postID;
   
        Post.findByIdAndUpdate(post, params,{ useFindAndModify: false }).then((response) =>{
            if(!response) callback("Product not found")
            else
            return callback(null, response);
        }).catch((error) =>{
            return callback(error);
        });
   
}


//Delete

async function deleteByID(params, callback){
    const post = await params.postID;

  
   
        Post.findByIdAndRemove(post).then((response) =>{
            if(!response){return callback("Product not found")}
            else{
            const cl_id = response.cloudinary_id;
            for (let m = 0; m < cl_id.length; m++) {
                // const element = rent.cloudinary_id[index];
                cloudinary.cloudinaryImageDeleteMethod(cl_id[m]);
                
              }

            return callback(null, response);}
        }).catch((error) =>{
            return callback(error);
        });
   
}


module.exports ={
    
    findRoomie,
    getfindRoomie,
    getByuserID,
    updateByID,
    deleteByID,
    makeRequest 
};