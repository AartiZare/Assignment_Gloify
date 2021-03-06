const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname:{
        type: String,
        required: true
    },
    lname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true, 
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
      },
    phone: {
      type: String,
      required: true,
      trim :true
    },
    address: {
          street: {
            type: String,
            required: true,
            trim :true
          },
          city: {
            type: String,
            required: true,
            trim :true
          },
          pincode: {
            type: Number,
            required: true
          },
        },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);