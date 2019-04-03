const passport = require('passport');
const LocalStrategy =require('passport-local').Strategy;
const pool= require('../database');
const helpers=require('../lib/helpers');
var Carrera=null;
const Kardex="";
const foto="";

const Alumno='Alumno';

passport.use('local.signin', new LocalStrategy({
      usernameField: 'Matricula',
      passwordField: 'Contraseña',
      passReqToCallback: true
},async(req,Matricula,Contraseña, done)=>{
    const rows= await pool.query("Select * from Usuarios where Matricula = ?",[Matricula]);
    if(rows.length >0)
    {
        const user =rows[0];

       const ValidPassword =await helpers.matchPassword(Contraseña,user.Contraseña)
       if(ValidPassword){
          done(null,user,req.flash('success','Bienvenido '+user.Matricula));
       }
       else
       {
         done(null,false,req.flash('message','Contraseña Invalida'));
       }
    }
    else
    {
        return done(null, false, req.flash('message','El nombre de usuario no existe'));
    }
}));





passport.use('local.signup', new LocalStrategy({
	usernameField: 'NombredeUsuario',
	passwordField: 'Contraseña',
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
                console.log(Carrera);
               
             })
        })
    
    const newUser={
         NombredeUsuario,
         Contraseña,
         Carrera:Carrera,
         Correo,
         Tipo:Alumno,
         Kardex,
         foto,
         Matricula
    };
    
    //console.log(newUser);
    newUser.Contraseña= await helpers.encryptPassword(Contraseña);
    const result = await pool.query('INSERT INTO USUARIOS SET ?',[newUser]);

    newUser.id_Usuario=result.insertid;
    console.log(newUser)
    return done(null,newUser);

}));


