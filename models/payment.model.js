const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true
}

const paymentSchema = new mongoose.Schema({
    ref: reqString,
    paymentStatus:reqString,
    paidFor:reqString,
    amount:reqString,
    paidBy:reqString,
    userID:reqString,
    productID:mongoose.SchemaTypes.ObjectId
}, {timestamps:true});
userSchema.set("toJSON", {
    transform:(document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString(),
        delete returnedObject._id;
        delete returnedObject.__v;
       
    },
    });
    const Payment = mongoose.model("payment", paymentSchema);
module.exports = Payment;