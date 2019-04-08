const express = require('express');
const router = express.Router();

//db
const pool =require('../database');

//Peticiones
router.get('/add', islogged, (req,res) =>
{
	res.render('links/add');
})
router.post('/add', async (req,res) =>
{
	const{Nombre}=req.body
	const newlink ={
		Nombre
	};
	await pool.query('INSERT INTO CARRERAS SET ?',[newlink]);
	req.flash('success','Link saved successfully');
	res.redirect('/links');
});

router.get('/secciones', islogged, (req,res) =>
{
	res.render('links/secciones');
})
router.post('/secciones', islogged, async (req,res) =>
{
	const{Nombre}=req.body
	const newseccion ={
		Nombre
	};
	await pool.query('INSERT INTO SECCIONES SET ?',[newseccion]);
	req.flash('success','Link saved successfully');
	res.redirect('/secciones');
});

router.get('/asesorias', islogged, async (req,res)=>
{
  const secciones=await pool.query('Select * from Secciones');
  res.render('links/asesorias',{ secciones});
});


router.get('/', islogged, async (req,res)=>
{
  const carreras=await pool.query('Select * from CARRERAS');
  res.render('links/listCarreras',{ carreras });
});

function islogged(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        return res.redirect('/login');
    }
}



module.exports = router;

