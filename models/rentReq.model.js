const mongoose = require("mongoose");
const rentReqSchema = new mongoose.Schema({
 
  address: {
    type: String,
  },
  price: {
    type: String,
  },
  image: {
    type: String,
  },
  fullName: {
    type: String,
  },
  userID: {
    type: String,
  },
  avatar: {
    type: String,
  },
  phone: {
    type: String,
  },
  landlord: {
    type: String,
  },
  status: {
    type: String,
  },
  date:{
    type: Date,
    default: Date.now
}

});


rentReqSchema.set("toJSON", {
  transform:(document, returnedObject) =>{
      returnedObject.id = returnedObject._id.toString(),
      delete returnedObject._id;
      delete returnedObject.__v;
     
  },
  });

module.exports = mongoose.model("Rentreq", rentReqSchema);
