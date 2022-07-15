const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId


const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: "title is required",
            unique: true,
            trim: true
            }, 
        author:{
            type: String,
            required: "author Name is required"
        },
        storeId: {
            type:ObjectId,
            required:"Store Id is required",
            ref: 'store',
            trim: true
            },
        ISBN: {
            type: String,
            required: "ISBN is required",
            unique: true,
            trim: true
        },
        category: {
            type: String,
            required: "Category is required",
            trim: true
        },
        price:{
            type: Number,
            default: 50,
            trim: true
        },
        isDeleted: {
            type: Boolean, 
            default: false
        }
    },
    { timestamps: true })

module.exports = mongoose.model('books',bookSchema)