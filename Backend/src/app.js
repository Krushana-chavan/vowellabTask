const express = require("express");
const cors = require("cors");
const config = require('./config/config');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const passport = require('passport');
const { jwtStrategy } = require('./config/passport');
const session = require('express-session');
const morgan = require('./config/morgan');





const app = express();

if (config.env !== 'test') {
	app.use(morgan.successHandler);
	app.use(morgan.errorHandler);
}

app.use(express.json({ limit: '50mb' }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// enable cors
app.use(cors());
app.options('*', cors());


//Middleware
app.use(session({
	secret: "secret",
	resave: false,
	saveUninitialized: true,
}))
passport.serializeUser(function (user, done) {
	done(null, user);
});
passport.deserializeUser(function (obj, done) {
	done(null, obj);
});
// jwt authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use('jwt', jwtStrategy);

app.use('/v1', routes);

app.all('/', (req, res) => {
	res.send("Hello from APIs")
});
// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
	app.use('/v1/auth', authLimiter);
  }
  

app.use(errorConverter);


// handle error
app.use(errorHandler);

//cron job to take tracking id


module.exports = app;