const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
    const {username, email, password} = req.body;

    if(username === '' || password === '') {
        res.render('/signup', {errorMessage: 'username and password must be  filled and valid'});

        return;
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if(! passwordRegex.test(password)) {
        res.render('auth/signup', {errorMessage: `Your password must contain at least 1 of each: 
            lowercase letter, uppercase letter, number and have six or more characteres`});

        return;
    }

    const user = await User.findOne({username: username});
    if(user) {
        res.render('auth/signup', {errorMessage: 'Unfortunatly someone already has your username :('});

        return;
    }

    //Create the user
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPass = bcrypt.hashSync(password, salt);

    try {
        await User.create({
            username,
            email,
            password: hashPass
        });

        res.redirect('/');
    } catch (err) {
        if(err.code === 11000) {
            res.render('auth/signup', {errorMessage: 'Username already registered'});
        }
    }
});

router.get('/login', (_req, res) => {
    res.render('auth/login');
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        res.render('auth/login', {errorMessage: 'Please fill both fields: username and password'});

        return;
    }

    const user = await User.findOne({username: username});
    if(!user) {
        res.render('auth/login', {errorMessage: 'invalid username and password combination'});

        return;
    }

    if(bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/');
    } else {
        res.render('auth/login', {errorMessage: 'Invalid login'});
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;