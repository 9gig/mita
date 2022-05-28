const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_USER_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryImageUploadMethod = async file => {
  return new Promise(resolve => {
      cloudinary.uploader.upload( file , (err, res,) => {
        if (err) return console.log(err)
          resolve({
             res: res.secure_url,
            rid: res.public_id
          }) 
        }
      ) 
  })
}

const cloudinaryImageDeleteMethod = async idz => {
  return new Promise(resolve => {
      cloudinary.uploader.destroy( idz ) 
  })
}

module.exports = {cloudinary, cloudinaryImageUploadMethod, cloudinaryImageDeleteMethod};

