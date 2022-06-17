var express     = require('express');
var app         = express();
var logger      = require('morgan');
var expressku   = require('./routes/route-expressku');
var adminku     = require('./routes/route-adminku');
var myconn      = require('express-myconnection');
var mysql       = require('mysql');
var path        = require('path');
var bodyParser  = require('body-parser');
var session     = require('express-session');
var flash       = require('express-flash');



app.set('port', process.env.port || 3000);
app.set('view engine', 'ejs');


app.use(logger('dev'));
// app.use('/public',express.static(__dirname + '/public')); 
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(flash());
app.use(
    myconn(mysql, {
        host: '127.0.0.1',
        user : 'root',
        password : '',
        port : 3306,
        database : 'express-db'
    }, 'single')
);
app.use(
    session({
        secret: 'babastudio',
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: 120000}
    })
);



app.get('/', function(req, res){
    res.end('Servernya udah running boskuh..!');
});

//frontend
app.get('/express', expressku.home);
app.get('/express/about', expressku.about);
app.get('/express/contact', expressku.contact);
app.get('/express/gallery', expressku.gallery); 
app.get('/express/news', expressku.news);
app.get('/express/news_detail/:id_news', expressku.news_detail);

//admin
app.get('/express/admin', adminku.home);
app.get('/express/admin/login', adminku.login);
app.post('/express/admin/login', adminku.login);
app.get('/express/admin/home', adminku.home);
app.get('/express/admin/add_news', adminku.add_news);
app.post('/express/admin/add_news', adminku.process_add_news);
app.get('/express/admin/edit_news/:id_news', adminku.edit_news);
app.post('/express/admin/edit_news/:id_news', adminku.update_edit_news);
app.get('/express/admin/delete_news/:id_news', adminku.delete_news);
app.get('/express/admin/logout', adminku.logout);


app.listen(app.get('port'), function(){
    console.log('Server1 is running console port', + app.get('port'));
});