const mongoose = require("mongoose")
const Schema= mongoose.Schema

const ordersSchema=new Schema({

    orderId:{
        type:String,
        required:true,
        trim:true
    },
    payment_method:{
        type:String,
        required:false,
        trim:true
    },
    order_status: {
        type: String,
        default: 'Pending',
        required: true
    },
    user_email:{
        type:String,
        required:true,
        trim:true
    },
    user_name:{
        type:String,
        required:true,
        trim:true
    },
    products:[
        {
            title:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                required:true,
                trim:true
            },
            category:{
                type:String,
                required:true,
                trim:true
            },
            imagePath:{
                type:String,
                required:true,
                trim:true
            },
            total_product_price:{
                type:Number,
                required:true
            }
        }
    ],
    user_address:{
        type:String,
        required:true,
        trim:true
    },
    user_zipcode:{
        type:Number,
        required:true,
        trim:true
    },
    user_country:{
        type:String,
        required:true,
        trim:true
    },
    user_state:{
        type:String,
        required:true,
        trim:true
    },
    total_price:{
        type:Number,
        required:true,
        trim:true
    },
    payment_status:{
        type:Boolean,
        required:false
    },
    date:{
        type:String,
        required:true,
        trim:true
    },
    time:{
        type:String,
        required:true,
        trim:true
    }
});

module.exports = mongoose.model('orders', ordersSchema);
