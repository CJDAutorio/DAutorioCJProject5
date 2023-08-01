// require modules
const express = require('express');
const morgan = require('morgan');
const eventRoutes = require('./routes/eventRoutes');
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

// create app
const app = express();

// configure app
let port = 3000;
let host = 'localhost';
const username = encodeURIComponent("USERNAME");
const password = encodeURIComponent("PASSWORD");
const cluster = "CLUSTER";
let uri = `mongodb+srv://${username}:${password}@${cluster}`;
app.set('view engine', 'ejs');

// mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// connect to MongoDB
mongoose.connect(uri,
                {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        //start the server
        app.listen(port, host, ()=>{
            console.log('Server is running on port', port);
        });
    })
    .catch(err => console.log(err.message));

//mount middlware
app.use(
    session({
        secret: "SECRET",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: uri}),
        cookie: {maxAge: 60*60*1000}
    })
);
app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user || null;
    res.locals.firstName = req.session.firstName || null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// set up routes
app.use('/', mainRoutes);
app.use('/events', eventRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    if (!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error: err});
});