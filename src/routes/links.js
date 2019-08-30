const express = require('express');
const router = express.Router();

//db
const pool =require('../database');

//Peticiones
router.get('/add', islogged, async(req,res) =>
{
	const Materias= await pool.query('Select * from CARRERAS');
	
	res.render('links/add', {user: req.user, Materias});
});
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
	const Materias= await pool.query('Select * from Secciones');
	res.render('links/Peticion',{Materias,user: req.user});
})

router.post('/Peticion', islogged, async(req,res)=>
{
	 const usuario=req.user.id_Usuario;
	 console.log(req.body)
   const  {Secciones}=req.body;
   const  {titulo}=req.body;
   const  {descripcion}=req.body;
   const {Hora_inicio}= req.body;
   const {Fecha_inicio}= req.body;
   const {Hora_fin}=req.body;
	 const {Fecha_fin}=req.body;
	 //const {Asesor: usuario}
	 const Estado= "Espera";
	 


  const newPeticion={
		Nombre: titulo,
		Fecha_inicio,
		Fecha_fin,
		Horario_Inicio: Hora_inicio,
		Horario_Fin: Hora_fin,
		Descripcion: descripcion,
		Seccion:parseInt(Secciones),
  	Estado:Estado
	}

	var newSolicitud={
		usuario,
		asesoria: undefined,
		fechaCreacion: Date.now(),
		fechaRespuesta: null,
		estatus: "Pendiente"
	}
	const result = await pool.query('INSERT INTO Asesorias SET ?',[newPeticion]);
	console.log(result.insertId);
	console.log(result)
	newSolicitud.asesoria = result.insertId;

	const result2 = await pool.query('INSERT INTO solicitudes_asesor SET ?',[newSolicitud]);
	 
	req.flash('success','Solicitud creada algo bien');
	res.redirect('/');
});


//Secciones
router.get('/secciones', islogged, async(req,res) =>
{
	const Secciones = await pool.query('Select * from Secciones');
	res.render('links/secciones', {user: req.user, Secciones});
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


router.get('/asesorias', islogged,async(req,res)=>
{
  const secciones=await pool.query('Select * from asesorias');
  const asesor = await pool.query("Select * from usuarios where tipo='Asesor'");
  res.render('links/asesorias',{ secciones ,user: req.user,asesor});

});
router.get('/', islogged, async (req,res)=>
{
  const carreras=await pool.query('Select * from CARRERAS');
  res.render('links/listCarreras',{carreras,user: req.user});
});

// Lista Asesorias
router.get('/listAsesorias', islogged, async (req,res)=>
{
  const Asesorias=await pool.query('Select * from asesorias');
  res.render('links/listAsesorias',{ Asesorias ,user: req.user});
});

//Inscribirte Asesorias
router.post('/listAsesorias', islogged, async (req,res) =>
{
	const{id_Asesoria}=req.body
	const id_Alumno= req.user.id_Usuario;
	const newIncribirse ={
		Asesoria: id_Asesoria,
		Alumno:id_Alumno
	};

	await pool.query('INSERT INTO asesorias_alumnos SET ?',[newIncribirse]);
	req.flash('success','Inscripcion saved successfully');
	res.redirect('/profile');
});




router.post('/asesorias', islogged, async (req,res)=>
{
	const{Nombre}=req.body;
	const {Secciones}= req.body;
	const {Horario_Inicio}= req.body;
	const {Horario_Fin}= req.body;
	const {Asesor}= req.body;
	const Estado = 'Pendiente';
	const {Descripcion}= req.body;
	console.log(req.body)
	const newAsesoria ={
		Nombre,
		Secciones,
        Horario_Inicio,
        Horario_Fin,
        Asesor,
        Estado,
        Descripcion
	};
	res.render('/asesorias')
});

router.get('/', islogged, async (req,res)=>
{
  const carreras=await pool.query('Select * from CARRERAS');
  res.render('links/listCarreras',{ carreras ,user: req.user});
});

router.get('/AsesoriasCursadas', islogged, async(req,res)=>
{
  const asesoriascursadas = await pool.query(`select a.nombre as Nombre_Asesoria, a.seccion as Seccion, m.nombredeusuario as Asesor ,s.nombre as Materia,a.Horario_Inicio, a.Horario_Fin, a.descripcion from asesorias a join usuarios m on a.asesor= m.id_Usuario  join secciones s on a.seccion = s.id_seccion join asesorias_alumnos al on a.id_asesoria = al.asesoria where al.alumno = ${req.user.id_Usuario}`);
  res.render('links/Cursadas',{asesoriascursadas:asesoriascursadas, user:req.user});
});

router.get('/AsesoriasDisponibles', islogged, async(req,res)=>
{
  const asesoriascursadas = await pool.query(`select a.nombre as Nombre_Asesoria, a.seccion as Seccion, m.nombredeusuario as Asesor ,s.nombre as Materia,a.Horario_Inicio, a.Horario_Fin, a.descripcion from asesorias a join usuarios m on a.asesor= m.id_Usuario  join secciones s on a.seccion = s.id_seccion join asesorias_alumnos al on a.id_asesoria = al.asesoria where al.alumno != ${req.user.id_Usuario}`);
  res.render('links/Disponibles',{asesoriascursadas:asesoriascursadas, user:req.user});
});




//Asesor
router.get('/AsesoriasAsesor', islogged, async(req,res)=>
{
  const AsesoriasAsesor = await pool.query(`select a.nombre as Nombre_Asesoria, a.seccion as Seccion, m.nombredeusuario as Asesor ,s.nombre as Materia,a.Horario_Inicio, a.Horario_Fin, a.descripcion from asesorias a join usuarios m on a.asesor= m.id_Usuario  join secciones s on a.seccion = s.id_seccion  where a.asesor = ${req.user.id_Usuario}`);
  res.render('links/AsesoriasAsesor',{AsesoriasAsesor :AsesoriasAsesor , user:req.user});
});















//Admin



//Graficas

router.get('/Grafica', islogged, async (req,res)=>
{
 const Asesorias=await pool.query('select s.nombre as Nombre_Asesoria, Count(a.id_asesoria) as Cantidad from asesorias a join secciones s on a.seccion=s.id_seccion group by s.id_seccion');

	res.render('links/Grafica',{Asesorias:Asesorias,user: req.user});
	
});


//Solicitudes
router.get('/Solicitudes', islogged, async (req,res)=>
{
 const Solicitudes=await pool.query('select u.nombredeusuario as Usuario, m.nombre as Materia, s.Hora_inicio, s.Hora_fin, s.fechaCreacion as Fecha, s.estatus from solicitudes_asesoria s join Usuarios u on s.usuario=u.id_usuario join secciones m on s.Materia = m.id_seccion');

	res.render('links/Solicitudes',{Solicitudes:Solicitudes,user: req.user});
	
});


router.get('/Asesores', islogged, async(req,res)=>{
     const Asesores=await pool.query("select u.matricula, u.nombredeusuario as Nombre,u.correo as Correo, c.nombre as Carrera, u.foto as Foto from usuarios u join carreras c on u.carrera=c.id_carrera where tipo = 'Asesor'");
	res.render('links/Asesores',{Asesores,user: req.user});
}); 

function islogged(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        return res.redirect('/login');
    }
}






module.exports = router;

