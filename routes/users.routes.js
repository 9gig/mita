const userController = require("../controllers/users.ctrl");
const postController = require("../controllers/postroom.ctrl");
const express        = require('express');
const { route }      = require("express/lib/application");
const router         = express.Router();
const cloudinary = require("../utils/cloudinary");
const roomieServices   = require("../services/findRoomie.services");
const upload = require("../utils/multer");
const User = require("../models/user.model");
const Rent = require("../models/rentPost");
const Renting = require("../models/rentReq.model");
const Post  = require('../models/roomiePosts.model');
const Request = require('../models/request.model');



router.post("/otpRequest", userController.sendCode);
router.post("/checkCode", userController.checkCode);
router.post("/register",userController.register);
router.post("/login", userController.login);
router.get("/user-profile", userController.userProfile);
router.post("/createPost", upload.array('images', 3),postController.create);
router.post("/makeRequest", postController.makeRequest);
router.get("/roomiePosts", postController.getAll);
router.get("/postByUser/:userID", postController.getByuserID);
router.put("/updatePost/:id", postController.updatePost);
router.delete("/deletePost", postController.deletePost);// delete images from cloudinary not done
router.post("/rentReqs", userController.rentHouse);
router.put("/updateAvatar",upload.single("image"),async(req, res)=>{
    try {
        const userid = req.body.uID;
        const image = req.file.path;
      
           const user = await User.findOne({userID: userid});
    
           if(user != null){
               if(user.cloudinary_id != null){
                const idz = user.cloudinary_id;
                 cloudinary.cloudinaryImageDeleteMethod(idz);

                 
               }

            const result = await cloudinary.cloudinaryImageUploadMethod(image);
            var mod = {
                avatar: result.res,
                cloudinary_id: result.rid,
            }
            User.findOneAndUpdate({userID: userid}, mod,{ new: true }).then(response =>{
                if(!response) res.send({message:"An error occured"})
                else return res.json(response);
            })

           }else{
               res.send({message: "user not found"})
           }
       


    } catch (error) {
        console.log(error);
    }
});
router.get("/getHouses",async (req, res) => {
    try {
      let rent = await Rent.find().then((response)=>{
        if(!response){
          var msg = res.json({message: "No Product yet"});
          return msg
        }
        res.json(response);
      });
     
    } catch (err) {
      console.log(err);
    }
  });
  router.post("/postByID", async(req, res)=>{
    try {
     const id = req.body.id;
      let post = await Post.findById(id).then((response)=>{
        if(!response){
          var msg = res.status(500).json({message: "Post not found"});
          return msg;
        }else{
          return response;

        }
        
      });
      res.json(post);

      
    } catch (error) {
      console.log(error);
    }
  })

  router.post("/getPostByContact", async (req, res)=>{
    const contact = req.body.phone;
    const postReqs = await Request.find({"posterContact":contact});
    
    res.json({postReqs});
  })

module.exports = router;