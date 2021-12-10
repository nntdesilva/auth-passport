const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');

router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', async (req, res) => {
	const { username, password, email } = req.body;
	const user = new User({ username, email });
	User.register(user, password, function(err) {
		if (err) {
			console.log('error while user register!', err);
			return next(err);
		}

		console.log('user registered!');

		res.redirect('/topsecret');
	});
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.post(
	'/login',
	passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
	async (req, res) => {
		res.redirect('/topsecret');
	}
);

router.post('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
