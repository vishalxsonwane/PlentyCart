// express.js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

// Import configurations
require('./src/db/mongo');
require('./config/passport');

const app = express();
const port = process.env.PORT || 4040;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

// Session configuration
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ 
        mongooseConnection: mongoose.connection,
        collection: 'sessions'
    }),
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        // maxAge: 60 * 1000 // 1 minute
        maxAge: 6 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));

// API Routes
app.use('/api', require('./src/router/apiRoutes'));

// Catch all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});