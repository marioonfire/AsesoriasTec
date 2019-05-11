const express = require('express');
const router = express.Router();
const passport= require('passport');


//Data Base
const pool =require('../database');

router.get('/signup', async (req,res)=>
{
  const carreras=await pool.query('Select * from CARRERAS');
  res.render('auth/signup',{ title:"Registrate", carreras , user: undefined});
});


router.post('/signup', passport.authenticate('local-signup',{
         succesRedirect: '/profile',
         failureRedirect: '/signup',
         failureFlash: true
}), function(req, res, info){
  res.redirect('/login');
});


router.get('/login',inLogged, (req,res)=>{
    res.render('auth/login',{title: "Iniciar sesión",user: undefined});
});

router.post('/login', passport.authenticate('local-signin',{
    succesRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash:true
  }), function(req, res, info){
      res.redirect('/profile');
  }
);


router.get('/profile', islogged, (req,res)=>{

  const usuario =  {usuario:req.user}
	res.render('auth/profile',{user:req.user,usuario, title:"Perfil"});

	

});

router.get('/logout', (req,res)=>{
  req.logout();
  req.user = null;
  res.redirect('/')
});

function islogged(req,res,next){
    if(!req.isAuthenticated()){
      return res.redirect('/login');
    }else{
      return next();
    }
}

function inLogged(req,res,next){
  if(!req.isAuthenticated()){
    return next();
  }else{
    return res.redirect('/profile');
  }
}

module.exports = router;