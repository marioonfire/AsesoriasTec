const express = require('express');
const morgan= require('morgan');
const exphbs= require('express-handlebars');
const path = require('path')
const passport=require('passport');
const flash= require('connect-flash');
const session= require('express-session');
const MySQLStore= require('express-mysql-session');
const { database } = require('./keys');
const multer = require('multer');

//Inicializaciones
const app =express();
require('./lib/passport');

//setings
app.set('port',process.env.PORT ||4000);
app.set('views',path.join(__dirname, 'views'));
app.engine('.hbs',exphbs({
	defaultLayout: 'main',
	layoutsDir: path.join(app.get('views'),'layouts'),
	partialsDir: path.join(app.get('views'),'partials'),
	extname: '.hbs',
	helpers: require('./lib/handlebars')
}));
app.set('view engine','hbs');

//Midlewares
app.use(session({
    secret: 'afiojdsf',
    resave: false,
    saveUninitialized:false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(multer({dest: path.join(__dirname,'./public/uploads/temp')}).fields([{name:'imageBack'},{name: 'imageProfile'}]));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//Variables Globales
app.use((req,res,next) =>{
	app.locals.success=req.flash('success');
	app.locals.message=req.flash('message');
	next();
});

//Rutas
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use(require('./routes/info'));
app.use('/links',require('./routes/links'));

//Publicos
app.use(express.static(path.join(__dirname,'public')));
//Empezar el servidor
app.listen(app.get('port'),() =>{
	console.log('Servicio de puerto prendido', app.get('port'));
})