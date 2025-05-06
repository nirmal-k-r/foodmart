//import my libaries
var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var session=require('express-session');

//import routers
productRouter=require('./routes/product');
adminRouter=require('./routes/admin');
authenticationRouter=require('./routes/authentication');
orderRouter=require('./routes/order');  

//connect database
db=require('./db');

//create server
var server=express(); 
server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());

//set view engine
server.set('view engine','ejs');
//bind template directory
server.set('views','./templates');


//middlewares
//set static folder
server.use(express.static('./static'));

//set session
server.use(session({
    secret: 'hbfcjwkle^&*(`dnckelo(*U',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
    maxAge: 7 *24 * 60 * 60 * 1000 // in milliseconds 7 days
}))

//connect routers
server.use('/',productRouter);
server.use('/admin',adminRouter);
server.use('/authentication',authenticationRouter);
server.use('/orders',orderRouter);

//start server and listen to port
PORT=3000;
server.listen(PORT,function(){
    console.log('Server is running on port',PORT);
});


//http://localhost:3000/