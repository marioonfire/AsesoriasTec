const passport = require('passport');
const LocalStrategy =require('passport-local').Strategy;
const pool= require('../database');
const helpers=require('./helpers');
var carr=null;

const Alumno='Alumno';

passport.use('local-signin', new LocalStrategy({
      usernameField: 'Matricula',
      passwordField: 'Contraseña',
      passReqToCallback: true
},async(req,Matricula,Contraseña, done)=>{
    const rows= await pool.query("Select * from USUARIOS where matricula = ?",[Matricula]);
    if(rows.length > 0)
    {
        const user =JSON.parse(JSON.stringify(rows[0]));
        // const ValidPassword = await helpers.matchPassword(Contraseña,user.Contraseña)
        if( await helpers.matchPassword(Contraseña,user.Contraseña)){
            // console.log(user.matricula)
            // console.log('s')
            done(null,{
                id_Usuario: user.id_Usuario,
                matricula: user.matricula,
                Contraseña: user.Contraseña,
                Carrera: user.Carrera,
                Correo : user.Correo,
                Tipo: user.Tipo,
                Kardex: user.Kardex,
                foto: user.foto
                }, req.flash("message","Bienvenido "));   
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

passport.use('local-signup', new LocalStrategy({
	usernameField: 'Matricula',
	passwordField: 'Contraseña',
	passReqToCallback: true
}, async (req,NombredeUsuario,Contraseña,done)=>{
    const { Carreras }= req.body;
    const { Matricula } = req.body;
    const { Correo }= req.body;
    var newUser={
         NombredeUsuario: req.body.NombredeUsuario,
         Contraseña,
         Carrera:  parseInt(Carreras),
         Correo,
         Tipo:Alumno,
         Kardex: null,
         foto:null,
         matricula: parseInt(Matricula),
         id_Usuario:null
    };
    newUser.Contraseña = await helpers.encryptPassword(Contraseña);
    const result = await pool.query('INSERT INTO USUARIOS SET ?',[newUser]);
    newUser.id_Usuario = result.insertId;
    return done(null,newUser);

}));

passport.serializeUser((user,done)=>{
    done(null,user);
});

passport.deserializeUser(async (id,done) =>{
    const rows = await pool.query("Select * from USUARIOS where matricula = ?",[id.matricula]);
    done(null, rows[0])
});