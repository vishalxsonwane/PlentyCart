// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../src/models/user');
const { body, validationResult } = require('express-validator');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Sign Up Strategy
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const messages = errors.array().map(error => error.msg);
            return done(null, false, { messages });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return done(null, false, { message: 'Email is already in use.' });
        }

        // Create new user
        const newUser = new User({
            email: email.toLowerCase(),
            password: password,
            is_admin: req.body.is_admin || false,
            full_name : req.body.full_name,
            phone_number : req.body.phone_number || null
        });

        const savedUser = await newUser.save();
        return done(null, savedUser);
    } catch (error) {
        return done(error);
    }
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        console.log('Attempting authentication for:', email);
        
        if (!email || !password) {
            return done(null, false, { status: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            console.log('User not found:', email);
            return done(null, false, { status: false, message: 'No user found with this email' });
        }

        if (!user.comparePassword(password)) {
            console.log('Invalid password for user:', email);
            return done(null, false, { status: false, message: 'Incorrect password' });
        }

        if (!user.active) {
            return done(null, false, { status: false, message: 'Your account is not active. Please contact an administrator.' });
        }

        console.log('Authentication successful for:', email);
        return done(null, user, { status: true });
    } catch (error) {
        console.error('Authentication error:', error);
        return done(error);
    }
}));

// Validation middleware
const validateSignup = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required.')
        .isLength({ min: 4 })
        .withMessage('Password must be at least 4 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: errors.array() 
            });
        }
        next();
    }
];

const validateSignin = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: errors.array() 
            });
        }
        next();
    }
];

module.exports = {
    validateSignup,
    validateSignin
};