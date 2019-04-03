const express = require('express');
const router = express.Router();
const passport= require('passport');


//Data Base
const pool =require('../database');

router.get('/signup', async (req,res)=>
{
  const carreras=await pool.query('Select * from CARRERAS');
  res.render('auth/signup',{ carreras });
});


router.post('/signup', passport.authenticate('local.signup',{
         succesRedirect: '/profile',
         failureRedirect: '/signup',
         failureFlash: true
}));


router.get('/login', (req,res)=>{
    res.render('auth/login');
});

router.post('/login',(req,res, next)=>{
     passport.authenticate('local.signin',{
     	succesRedirect: '/profile',
     	failureRedirect: '/login',
     	failureFlash:true
     })(req,res,next);
});


router.get('/profile',(req,res)=>{
	res.send('this is you Profile')
});

module.exports = router;