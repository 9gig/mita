// const userController = require("../controllers/users.ctrl");
const adminController = require("../controllers/admin.ctrl");
const express        = require('express');
const { route } = require("express/lib/application");
const router         = express.Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const Rent = require("../models/rentPost");
const Renting = require("../models/rentReq.model");
const Finding = require("../models/request.model");
const { response } = require("express");


router.get("/",(req, res) => {
    res.send(`<h1>Home</h1>`);
})

// router.get("/requests", adminController.getAll)
// const cloudinaryImageUploadMethod = async file => {
//     return new Promise(resolve => {
//         cloudinary.uploader.upload( file , (err, res,) => {
//           if (err) return res.status(500).send("upload image error")
//             resolve({
//                res: res.secure_url,
//               rid: res.public_id
//             }) 
//           }
//         ) 
//     })
//   }
const cloudinaryImageDeleteMethod = async idz => {
    return new Promise(resolve => {
        cloudinary.uploader.destroy( idz ) 
    })
  }

router.post("/addHouse", upload.array("image",3), async (req, res) => {
    try {
      // Upload image to cloudinary and post house by admin
      const urls = [];
      const idz = [];
const files = req.files;
for (const file of files) {
  const { path } = file;
  const newPath = await cloudinary.cloudinaryImageUploadMethod(path);
  urls.push(newPath);

  idz.push(newPath);
}
const rent = new Rent({ 
  title: req.body.title,
  address: req.body.address,
  price: req.body.price,
  plan: req.body.plan,
  landlord: req.body.landlord,
  amenities: req.body.amenities,
  images: urls.map( url => url.res ),
  cloudinary_id: idz.map( id => id.rid ),
});
      await rent.save();
      res.json(rent);
    } catch (err) {
      console.log(err);
    }
  });


  //Get All house posts

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


// Delete Rent Post
router.delete("/rentdel/:id", async (req, res) => {
  try {
    // Find rent by id
    let rent = await Rent.findById(req.params.id);
    // const idbunch = [rent.cloudinary_id[0],rent.cloudinary_id[1], rent.cloudinary_id[2]];
  
    // Delete image from cloudinary
  //  await cloudinaryImageDeleteMethod(idbunch);
  const img = rent.cloudinary_id;
  for (let m = 0; m < img.length; m++) {
    // const element = rent.cloudinary_id[index];
    cloudinary.cloudinaryImageDeleteMethod(img[m]);
    
  }
    //  await cloudinary.uploader.destroy(rent.cloudinary_id[1]);
    
    // Delete user from db
    await rent.remove();
    res.json(rent);
  } catch (err) {
    console.log(err);
  }
});


// Get rent requests
router.get("/getRentReqs",async (req, res) => {
  try {
    let rent = await Renting.find().then((response)=>{
      if(!response){
        msg = res.json({message:"No requests yet"});
        return msg
      }
      res.json(response);
    });
   
  } catch (err) {
    console.log(err);
  }
});
//Inp
router.get("/getRentReqsInp",async (req, res) => {
  try {
    let renting = await Renting.find({"status":"inprogress"});
    res.json(renting);
  } catch (err) {
    console.log(err);
  }
});
router.get("/getRentReqsComp",async (req, res) => {
  try {
    let renting = await Renting.find({"status":"completed"});
    res.json(renting);
  } catch (err) {
    console.log(err);
  }
});
// Delete rent Request
router.delete('/deleteRentReqs', async (req, res)=>{
  const postID = req.body.postID;
  try {
    let rent = await Renting.findById(postID).then((response)=>{
      if(!response){
        var msg = res.json({message: "Request not found" });
        return msg;
      }
      response.remove();
        res.json(response);
    
    });
   
  
  } catch (error) {
    console.log(error);
  }


});

//Update rent request status
router.put("/changeStatus", async (req, res)=>{
  const postID = req.body.postID;
  var model = {
    status: "completed"
  }
  try {
    let rent = await Renting.findByIdAndUpdate(postID,model,{ useFindAndModify: false }).then((response)=>{
      if(!response){
        var msg = res.json({message: "Request not found" });
        return msg;
      }
      // response.remove();
      res.json(response);
    });
   
  } catch (error) {
    console.log(error);
  }
});

// Get Roomate Requests
router.get("/getRoomieReqs",async (req, res) => {
  try {
    let finder = await Finding.find();
    res.json(finder);
  } catch (err) {
    console.log(err);
  }
});
router.get("/getRoomieReqsInp",async (req, res) => {
  try {
    let finder = await Finding.find({"status":"inprogress"});
    res.json(finder);
  } catch (err) {
    console.log(err);
  }
});
router.get("/getRoomieReqsCom",async (req, res) => {
  try {
    let finder = await Finding.find({"status":"completed"});
    res.json(finder);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/deleteRoomieReqs", async (req, res)=>{
  const postID = req.body.postID;

  try {
    if(postID === undefined) return res.json({message: "Post not found"})
    let finder = await Finding.findByIdAndDelete(postID);
    res.json(finder);
  } catch (error) {
    console.log(error);
  }
});

router.put("/changeReqsStatus", async (req, res)=>{
  const postID = req.body.postID;
  var model = {
    status: "completed"
  }
  try {
    let finder = await Finding.findByIdAndUpdate(postID,model,{ useFindAndModify: false }).then((response)=>{
      if(!response){
        var msg = res.json({message: "Request not found" });
        return msg;
      }
      // response.remove();
      res.json(response);
    });
   
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;













//   const result = await cloudinary.uploader.upload(req.file.path);
  
    //   // Create new user
    //   let rent = new Rent({
    //     name: req.body.name,
    //     avatar: result.secure_url,
    //     cloudinary_id: result.public_id,
    //   });
      // Save user