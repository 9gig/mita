const bodyParser       =require('body-parser');
const multer           =require('multer');
const path             = require('path');
const mongoose         = require('mongoose');
const roomieServices   = require("../services/findRoomie.services");
const upload           = require("../middlewares/👩🏾‍🎓");
const cloudinary = require("../utils/cloudinary");



exports.create = async (req,res, next) =>{
   
            const urls = [];
            const idz = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
     const newPath = await cloudinary.cloudinaryImageUploadMethod(path);
        urls.push(newPath);
      
        idz.push(newPath);
      }

            var model = {
                userID: req.body.userID,
               
                images: urls.map( url => url.res ),
                cloudinary_id: idz.map( id => id.rid ),
                 title: req.body.title,
                 avie: req.body.avie,
                 fullName: req.body.fullName,
                 phone: req.body.phone,
                 school: req.body.school,
                 level: req.body.level,
                 dept: req.body.dept,
                  address: req.body.address,
                  type: req.body.type,
                  totalRoomie: req.body.totalRoomie,
                   price: req.body.price,
                   hobbies: req.body.hobbies,
                   properties: req.body.properties,
                   description: req.body.description 
            };

            roomieServices.findRoomie(model, (error, result)=>{
                if(error){
                    return next(error);
                }else{
                    return res.status(200).send({
                        message: "success",
                        data: result,
                    });
                }
            })
        
    
}


exports.makeRequest = (req,res, next) =>{
    const {posterName, posterContact, reqsterName, reqsterContact, posterImg,reqsterImg, status, address, price} = req.body;
    roomieServices.makeRequest(req.body, (error, result) =>{
        if(error){return next(error);}
        return res.status(200).send({
            message:"success",
            data: result,
        });
    });
}


// Get all
exports.getAll = (req,res, next) =>{
   
     var model = {
          address: req.query.address
    };

         roomieServices.getfindRoomie(model, (error, results)=>{
            if(error){
               return next(error);
             }else{
            return res.status(200).send({
            message: 'success',
            data: results
           })
                }
            })
     
}

exports.getByuserID = (req,res, next) =>{
   
    var model = {
         userID: req.params.userID
   };

        roomieServices.getByuserID(model, (error, results)=>{
           if(error){
              return next(error);
            }else{
           return res.status(200).send({
           message: 'success',
           data: results
          })
               }
           })
    
}

exports.updatePost = (req,res, next) =>{
    upload(req, res, function(err){
        if(err){
            next(err);
        }else{
            const url = req.protocol + "://" + req.get("host");
            const path = req.file != undefined ? req.file.path.replace(/\\/g, "/"): "";

            var model = {
                postID:req.params.id,
                userID: req.body.userID,
                images:[path != ""? url + "/" + path:""],
                 title: req.body.title,
                  address: req.body.address,
                  type: req.body.type,
                  totalRoomie: req.body.totalRoomie,
                   price: req.body.price,
                   hobbies: req.body.hobbies,
                   properties: req.body.properties,
                   description: req.body.description 
            };

            roomieServices.updateByID(model, (error, results)=>{
                if(error){
                    return next(error);
                }else{
                    return res.status(200).send({
                        message: 'success',
                        data: results
                    })
                }
            })
        }
    })
}

exports.deletePost = (req,res, next) =>{
   
    var model = {
         postID: req.body.postID
   };

        roomieServices.deleteByID(model, (error, results)=>{
           if(error){
              return next(error);
            }else{
           return res.status(200).send({
           message: 'success',
           data: results
          })
               }
           })
    
}

