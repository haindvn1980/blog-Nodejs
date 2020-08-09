/**
 * Module dependencies.
 */
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const chalk = require("chalk");
const MongoStore = require('connect-mongo')(session);
const upload = multer({ dest: path.join(__dirname, '/public/images') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const lusca = require('lusca');
const sass = require('node-sass-middleware');
var mkdirp = require('mkdirp');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 * //npm install connect-mongo express-session express-flash passport multer dotenv chalk mongoose bcrypt lusca node-sass-middleware mkdirp npm install ejs
 */
dotenv.config({ path: 'process.env' });

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home.controller.js');
const postController = require('./controllers/posts.controller.js');
const categoryController = require('./controllers/category.controller.js');

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8888);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));



// app.use((req, res, next) => {
//   lusca.csrf()(req, res, next);
// });

// app.use(lusca({
//   csrf: {
//     header: 'x-xsrf-token',
//   },
//   xframe: 'SAMEORIGIN',
//   hsts: {
//     maxAge: 31536000, //1 year, in seconds
//     includeSubDomains: true,
//     preload: true
//   },
//   xssProtection: true
// }));

//app.use(lusca.xframe('SAMEORIGIN'));
//app.use(lusca.xssProtection(true));
/**
 * Primary app routes.
 */
//home page
app.get('/', homeController.index);
//************************/
//post news
app.get('/Posts', postController.getAdd);
app.post('/Posts', upload.single('mainimage'), postController.postAdd);
app.get('/Posts/Show/:id', postController.getShow);
app.post('/Posts/Addcomment', postController.postAddcomment);
//category
app.get('/addcategory', categoryController.getAddCategory);
app.post('/addcategory', categoryController.postAddCategory);

//var posts = require('./routes/posts');
//app.use('/posts', posts);


/**
 * Start Express server.
 * error handlers
 */
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
//Start Express server.
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
