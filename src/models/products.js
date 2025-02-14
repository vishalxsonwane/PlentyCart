const mongoose = require("mongoose")
const Schema = mongoose.Schema

const productsSchema = new Schema({
    image_path: {
        type: String,
        required: true,
        trim:true
    },
    title: {
        type: String,
        required: true,
        trim:true
    },
    price: {
        type: Number,
        required: true
    },
    price_description: {
        type: String,
        trim:true,
        default:""
    },
    product_description: {
        type: String,
        required: true,
        trim:true
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    is_deleted:{
        type:Boolean,
        required:true,
        default:false
    }
    

})

module.exports = mongoose.model('products', productsSchema);
