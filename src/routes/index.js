const express = require('express');
const router=express.Router();

//Data Base
const pool =require('../database');

router.get('/',islogged, async (req,res) => {
     const carreras = await pool.query('Select * from CARRERAS');
     res.render('index',{title: "Inicio", carreras, user:req.user})  
});
function islogged(req,res,next){
     if(!req.isAuthenticated()){
         return next();
     }else{
         return res.redirect('/profile');
     }
 }

module.exports= router;