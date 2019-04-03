const passpot = require('passport');
const LocalStrategy =require('passport-local').Strategy;
const pool= require('../database');
const helpers=require('../lib/helpers');
var Carrera;

const Alumno='Alumno';
passpot.use('local.signup', new LocalStrategy({
	usernameField: 'NombredeUsuario',
	passwordField: 'Contraseña',
	CarreraField: 'Carreras',
	CorreoField: 'Correo',
	passReqToCallback: true
}, async (req,NombredeUsuario,Contraseña,Tipo,Kardex,foto,done)=>{
    
    const { Carreras }= req.body;
    const { Matricula } = req.body;
    const { Correo }= req.body;
    const query= pool.query("Select id_Carrera from CARRERAS where nombre= ?",[Carreras],
        function(err,rows){
            if(err){
                console.log(err);
                return;
            }

             rows.forEach(function(result){
                Carrera=result.id_Carrera;
                
               
             })
        });
    
    const newUser={
         NombredeUsuario,
         Contraseña,
         Carrera,
         Correo,
         Tipo:Alumno,
         Kardex,
         foto,
         Matricula
    };
    
      console.log(newUser);
    newUser.Contraseña= await helpers.encryptPassword(Contraseña);
    const result = await pool.query('INSERT INTO USUARIOS SET ?',[newUser]);
}));

