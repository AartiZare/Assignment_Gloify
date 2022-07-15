const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const storeSchema = new mongoose.Schema(
  {
    storeName:{
        type: String,
        required: true
    },

    userId: {
        type: ObjectId,
        required: [true, 'User Id is Required'],
        ref: "user"

    },

    email:{
        type: String,
        required: true, 
        unique: true,
        trim: true
    },
    phone: {
      type: String,
      required: true,
      trim :true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("store", storeSchema);