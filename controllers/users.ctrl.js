const bcryptjs = require("bcryptjs");
const bcrypt        = require("bcryptjs");
const userService   =require("../services/users.services");
const Rent = require("../models/rentPost");
const  cloudinary  = require("../utils/cloudinary");
const twiliConfig     = require("../config/twili");
const client      = require("twilio")(twiliConfig.account_sid,twiliConfig.auth_token);





// vonage intialization
const Vonage = require('@vonage/server-sdk');
const User = require("../models/user.model");
const read = require("body-parser/lib/read");


const vonage = new Vonage({
    // change this things
  apiKey: "3f75ce65",  
  apiSecret: "PQ93RtwrYCBgfUdc"
});

// otp logic 
// Generate and send code
exports.sendCode = (req, res) =>{

  const phone = req.body.phone;
  console.log(phone);
  client.verify.services(twiliConfig.service_id).verifications.create({to:phone,channel:"sms"}).then((verification)=>{
res.status(200).send({
  message: "success",
  data: verification

})
  }).catch(error =>{
    console.log(error)
  })

  // Twilio Sms verification
  // client.messages.create({
  //   body:'Testing twilio sms service',
  //   to: '+2349011151246',
  //   from: '+18456842839'
  // }).then(message => console.log(message)).catch(error => console.log(error));

    // vonage.verify.request({
    //   number: req.body.phone,
    //   brand: "KampGig"
    // }, (err, result) => {
    //   if (err) {
    //     console.error(err);
    //     res.send('An Error Occured')
    //   } else {

    //     const verifyRequestId = result.request_id;
    //     console.log('request_id', verifyRequestId);
    //     console.log(result);
    //     res.send({requestId: verifyRequestId})

    //   }
    // });
}

// Verify otp code
exports.checkCode = (req, res) =>{
   
  const phone = req.body.phone;
  const code = req.body.code;
 
  client.verify.services(twiliConfig.service_id)
  .verificationChecks
  .create({to: phone, code: code})
  .then(verification_check => res.send({status:verification_check.status})).catch(error => res.send(error));
    //  vonage.verify.check({
    //   request_id: req.body.id,
    //   code: req.body.code,
    //   }, (err, result) => {
    //         if (err) {
    //           console.error(err);
    //           res.send('invalid');
    //          // Get lucky's error page
             
    //         } else {
    //           console.log(result);
    //           res.status(200).send({
    //             message:"success",
    //             data: result,
    //         });
             
    //           }
    //      }
    // );
      
}

exports.register = (req, res, next) =>{
    const {password} = req.body;
    const {phone} = req.body;
    const {fName} = req.body;
    
    const salt = bcryptjs.genSaltSync(10);

    req.body.password = bcryptjs.hashSync(password, salt);
    userService.register(req.body,(error,result) =>{
        if(error){
            return next(error);
        }
        return res.status(200).send({
            message: "success",
            data: result,
        });
    });
};

exports.updateAvatar = (req, res, next)=>{
  const userID = req.body.userID;
  const image = req.file.image;

  const newImage = cloudinary.cloudinary.uploader.upload(image);

  var avatar = newImage.secure_url;
  var cloudinary_id = newImage.public_id;

  userService.updateAvatar({userID,avatar,cloudinary_id}, (error, result)=>{
    if(error){
      return next(error);
    }
    return res.status(200).send({
      message:"success",
      data: result,
    });
  });

};




exports.login = (req, res, next) =>{
    const {userID, password} = req.body;
    userService.login({userID, password}, (error, result) =>{
        if(error){return next(error);}
        return res.status(200).send({
            message:"success",
            data: result,
        });
    });
};

exports.userProfile = (req, res,next) =>{
    return res.status(200).json({
        message: "Authorized user",
        
    });
};

// Post request to find roomie
exports.findRoomie = (req, res, next) => {
  const {userID, title, address, price } = req.body;
  userService.findRoomie(req.body, (error, result) =>{
    if(error){
      return next(error);
    }
    return res.status(200).send({
      message: "success",
      data: result,
  });
  });
};


//Request Renting
exports.rentHouse = (req, res, next)=>{
 const postID = req.body.id;
 const  fullName = req.body. fullName;
 const userID = req.body.userID;
 const  phone= req.body.phone;
 const  avatar= req.body.avatar;

 userService.rentRequest({postID,fullName,userID,phone},(error,result) =>{
  if(error){
      return next(error);
  }
  return res.status(200).send({
      message: "success",
      data: result,
  });
});
  
}
