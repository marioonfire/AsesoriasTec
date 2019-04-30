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
	const{Nombre}=req.body;
	const newlink ={
		Nombre
	};
	await pool.query('INSERT INTO CARRERAS SET ?',[newlink]);
	req.flash('success','Link saved successfully');
	res.redirect('/links');
});



//Peticiones
router.get('/Peticion', islogged, async (req,res)=>
{

	const Materias=await pool.query('Select * from Secciones');
	res.render('links/Peticion',{Materias,user: req.user});
})

router.post('/Peticion', islogged, async(req,res)=>
{
   const usuario=req.user.id_Usuario;
   const  {Secciones}=req.body;
   const {Hora_inicio}= req.body;
   const {Hora_fin}=req.body;
   const Estatus= "En espera";
   const newPeticion={
       usuario,
       Materia:parseInt(Secciones),
       Hora_inicio,
       Hora_fin,
       Estatus
   }
   await pool.query('INSERT INTO solicitudes_asesoria SET ?',[newPeticion]);
	req.flash('success','Peticion saved successfully');
	res.redirect('/secciones');
});


//Secciones
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

	await pool.query('INSERT INTO Secciones SET ?',[newseccion]);
	req.flash('success','Link saved successfully');
	res.redirect('/links/secciones');
});

router.get('/asesorias', islogged, async (req,res)=>
{
  const secciones=await pool.query('Select * from Secciones');
  res.render('links/asesorias',{ secciones ,user: req.user});
});


router.get('/', islogged, async (req,res)=>
{
  const carreras=await pool.query('Select * from CARRERAS');
  res.render('links/listCarreras',{carreras,user: req.user});
});


router.get('/listAsesorias', islogged, async (req,res)=>
{
	
  const Asesorias=await pool.query('Select * from asesorias');
  res.render('links/listAsesorias',{ Asesorias ,user: req.user});
});

router.get('/asesorias', islogged,async(req,res)=>
{
  const secciones=await pool.query('Select * from asesorias');
  res.render('links/listAsesorias',{ secciones ,user: req.user});
});

router.post('/asesorias', islogged, async (req,res)=>
{
	const{Nombre}=req.body
	console.log(req.body)
	const newAsesoria ={
		Nombre
	};
	res.render('/asesorias')
});

router.get('/', islogged, async (req,res)=>
{
  const carreras=await pool.query('Select * from CARRERAS');
  res.render('links/listCarreras',{ carreras ,user: req.user});
});


function islogged(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        return res.redirect('/login');
    }
}



module.exports = router;

