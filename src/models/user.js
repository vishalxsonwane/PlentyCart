// src/models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
    full_name:{
        type:String,
        required:true,
        trim:true
    },
    phone_number:{
        type:Number,
        required:true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [4, 'Password must be at least 4 characters long']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true
    },
    password_changed_at: {
        type: Date,
        default: null
    },
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();
    this.password = this.encryptPassword(this.password);
    next();
});

userSchema.methods = {
    // Method to encrypt password
    encryptPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    },

    // Method to validate password
    comparePassword(password) {
        return bcrypt.compareSync(password, this.password);
    },

    // Method to get user info without sensitive data
    toJSON() {
        return {
            id: this._id,
            email: this.email,
            isAdmin: this.isAdmin,
            full_name: this.full_name,
            phone_number: this.phone_number,
            created_at: this.created_at,
            updated_at: this.updated_at,
            password_changed_at: this.password_changed_at,
            active: this.active,
        };
    }
};

module.exports = mongoose.model('User', userSchema);