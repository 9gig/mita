const User = require("../models/user.model");
const Renting = require("../models/rentReq.model");
const Post = require("../models/roomiePosts.model");
const Rent = require("../models/rentPost");
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/😁");


async function login({userID, password}, callback){
    const user = await User.findOne({userID});

    if(user != null ){
        if(bcrypt.compareSync(password, user.password)){
            const token = auth.generateAccessToken(userID);
            return callback(null, {...user.toJSON(), token});
        }else{
            return callback({
                message: "Invalid Password"
            });
        }
    }else{
        return callback({
            message:"User not Found"
        });
    }
}

async function register(params, callback){
    // if(params.userID === undefined){
    //     return callback({message:"userID required"});
    // }
    const user = new User(params);
    user.save().then((response) =>{
        return callback(null, response);
    }).catch((error)=>{
        return callback(error);
    });
}

async function updateAvatar({userID, avatar, cloudinary_id}, callback){
    if(userID === undefined){
        return callback({message:"userID required"});
    }
    var model ={
        avatar:avatar,
        cloudinary_id:cloudinary_id
    }
    const user = await User.findOneAndUpdate(userID,model, { useFindAndModify: false } ).then(()=>{
        return callback(null, response);
    }).catch((error)=>{
        return callback(error);
    });
}

async function rentRequest({postID,fullName,userID,phone,avatar}, callback){
    if(postID === undefined){
        return callback({message:"Property not found"});
    }
   var rent = await Rent.findById(postID);
   const renting = new Renting({
        
    fullName:fullName,
    phone:phone,
    status:"inprogress",
    userID:userID,
     address: rent.address,
     price: rent.price,
     avatar: avatar,
     landlord: rent.landlord,
     image:rent.images[0]
      });
      renting.save().then((response) =>{
          return callback(null, response);
      }).catch((error)=>{
          return callback(error);
      });
}

async function findRoomie({userID, title, address, price }, callback){
    const user = await User.findOne({userID});

    if(user != null){
        const post = new Post({userID, title, address, price });
        post.save().then((response) =>{
            return callback(null, response);
        }).catch((error) =>{
            return callback(error);
        });
    }
}



module.exports ={
    login,
    register,
    rentRequest,
    findRoomie,
    updateAvatar
};