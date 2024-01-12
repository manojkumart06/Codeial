const express = require('express');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(sassMiddleware({
    src : './assets/scss',
    dest : './assets/css',
    debug : true,
    outputStyle : 'extended',
    prefix : "/css"
}));

//app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//accessing static files by using static function 
app.use(express.static('./assets'));

//make the uploads path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'));

//render layout before routes to reflect in views 
app.use(expressLayouts);

//extract styles and scripts from sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//set up the view engine
app.set('view engine','ejs');
app.set('views','./views');


//mongo store is used to store the session cookie in the DB
app.use(session({
    name: 'Codeial',
    secret: 'something',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 100
        //httpOnly: true,
        //secure: false, // Set to true if your app is served over HTTPS
    },
    store: new MongoStore(
        { 
            //mongoUrl: 'mongodb://localhost/codeial_development',
            mongoUrl: 'mongodb://localhost/codeial_development', // Use the mongoUrl option
            //mongooseConnection: db,
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);


//using flash 
app.use(flash());
app.use(customMware.setFlash);

//use express router 
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);  //inter poltion
    }
    console.log(`Server is running on port: ${port}`);

})