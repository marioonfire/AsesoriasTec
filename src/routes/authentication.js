const express = require('express');
const router = express.Router();
const passport= require('passport');
const { randomNumber } = require('../lib/helpers');
const fs = require('fs-extra');
const path = require('path');

//Data Base
const pool =require('../database');

router.get('/signup', async (req,res)=>
{
  const carreras=await pool.query('Select * from CARRERAS');
  res.render('auth/signup',{ title:"Registrate", carreras , user: undefined});
});


router.post('/signup', passport.authenticate('local-signup',{
         succesRedirect: '/profile',
         failureRedirect: '/',
         failureFlash: true
}), function(req, res, info){
  res.redirect('/');
});


router.get('/login',inLogged, (req,res)=>{
    res.render('auth/login',{title: "Iniciar sesión",user: undefined});
});

router.post('/login', passport.authenticate('local-signin',{
    succesRedirect: '/profile',
    failureRedirect: '/',
    failureFlash:true
  }), function(req, res, info){
      res.redirect('/');
  }
);


router.get('/profile', islogged, async(req,res)=>{
  console.log(req.user)
  const usuario =  {usuario:req.user}
  const carreras=await pool.query('Select * from CARRERAS');
	res.render('auth/profile',{user:req.user,usuario, title:"Editar perfil", carreras});
});

router.post('/profile', islogged, async(req,res)=>{
  const usuario =  {usuario:req.user}
  const carreras=await pool.query('Select * from CARRERAS');
  const actualizacion = await pool.query(`UPDATE Usuarios SET NombredeUsuario = '${req.body.Nombre}', correo= '${req.body.Correo}', Carrera = ${req.body.carreras} WHERE id_Usuario = ${req.user.id_Usuario}`);

  if(actualizacion){
    
  }
  const saveImage = async (file) => {

    var correcto = true;
    const imgUrl = randomNumber();
    const images = await pool.query(`Select * from Usuarios where foto = '${imgUrl}' OR fotoPortada = '${imgUrl}'`);
    
    if(images.length > 0){
      saveImage(file);
    }else{
        console.log(file)
        const ext = path.extname(file.originalname).toLowerCase();
        const imageTempPath = file.path;
        const targetPath = path.resolve(`src/public/uploads/${imgUrl}${ext}`);
  
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
            // you wil need the public/temp path or this will throw an error
            await fs.rename(imageTempPath, targetPath);
            return imgUrl + ext;
            
        } else {
            await fs.unlink(imageTempPath);
            return "Error";
        }
    }
  }
  if(req.files != undefined){
    if(req.files.imageBack != undefined){
      saveImage(req.files.imageBack[0]).then(async(e) =>{
        console.log(e)
        if(e != "Error"){
          if(req.user.fotoPortada != "Paisaje2.png"){
            const deletePath = path.resolve(`src/public/uploads/${req.user.fotoPortada}`);
            await fs.remove(deletePath);
          }
          await pool.query(`UPDATE Usuarios SET fotoPortada = '${e}' WHERE id_Usuario = ${req.user.id_Usuario}`);
        }
      });
    }
    if(req.files.imageProfile != undefined){
      saveImage(req.files.imageProfile[0]).then(async (e)=>{
        if(e != "Error"){
          if(req.user.foto != "profile.jpg"){
            const deletePath = path.resolve(`src/public/uploads/${req.user.foto}`);
            await fs.remove(deletePath);
          }
          await pool.query(`UPDATE Usuarios SET foto = '${e}' WHERE id_Usuario = ${req.user.id_Usuario}`);
        }
      });
    }
  }
    
	res.render('auth/profile',{user:req.user,usuario, title:"Editar perfil", carreras});
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
    var ret ={};    
    if(user.Tipo == "Admin"){
            ret = {
            id_Usuario: user.id_Usuario,
            matricula: user.matricula,
            Contraseña: user.Contraseña,
            Carrera: user.Carrera,
            Correo : user.Correo,
            Tipo: user.Tipo,
            Kardex: user.Kardex,
            foto: user.foto,
            fotoPortada: user.fotoPortada,
            Admin : true
            };
            // console.log(ret)
    }else if(user.Tipo == "Alumno"){
        ret = {
            id_Usuario: user.id_Usuario,
            matricula: user.matricula,
            Contraseña: user.Contraseña,
            Carrera: user.Carrera,
            Correo : user.Correo,
            Tipo: user.Tipo,
            Kardex: user.Kardex,
            foto: user.foto,
            fotoPortada: user.fotoPortada,
            Alumno: true
        }
        // console.log(ret)
    }else if(user.Tipo == "Asesor"){
        ret = {
            id_Usuario: user.id_Usuario,
            matricula: user.matricula,
            Contraseña: user.Contraseña,
            Carrera: user.Carrera,
            Correo : user.Correo,
            Tipo: user.Tipo,
            Kardex: user.Kardex,
            foto: user.foto,
            fotoPortada: user.fotoPortada,
            Asesor: true
        };
    }else if(user.Tipo == "Ambos"){
        ret = {
            id_Usuario: user.id_Usuario,
            matricula: user.matricula,
            Contraseña: user.Contraseña,
            Carrera: user.Carrera,
            Correo : user.Correo,
            Tipo: user.Tipo,
            Kardex: user.Kardex,
            foto: user.foto,
            fotoPortada: user.fotoPortada,
            Alumno: true,
            Asesor: true
        };
    }
    req.user= ret;
    return res.redirect('/profile');
  }
}

module.exports = router;