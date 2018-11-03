'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();
const localAuth = passport.authenticate('local', { session: false });
const createAuthToken = function(user) {
    return jwt.sign({ user }, config.JWT_SECRET, {
        subject: user.username,
        expiresIn: config.JWT_EXPIRY,
        algorithm: 'HS256'
    });
};

router.use(bodyParser.json());

router.post('/login', localAuth, (req, res) => {
    const authToken = createAuthToken(req.user.serialize());
    res.status(200).json({ authToken });
});

module.exports = { router };