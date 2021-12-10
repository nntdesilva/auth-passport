const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { isLoggedIn } = require('./middleware');
const userRoutes = require('./routes/user');

mongoose
	.connect('mongodb://localhost:27017/auth-passport')
	.then((res) => {
		console.log('Mongo connection open...');
	})
	.catch((err) => {
		console.log('Oh no', err);
	});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));

app.use(
	session({
		secret: 'thisissecret',
		resave: false,
		saveUninitialized: true,
		cookie: {
			httpOnly: true,
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
			maxAge: 1000 * 60 * 60 * 24 * 7
		}
	})
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', userRoutes);

app.use(function(req, res, next) {
	res.locals.user = req.user;
	next();
});

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/topsecret', isLoggedIn, (req, res) => {
	res.render('recipe');
});

app.listen(3000, (req, res) => {
	console.log('Serving your app....');
});
