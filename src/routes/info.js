const express = require('express');
const router = express.Router();

//db
const pool =require('../database');

//links for get item information
router.get('/user/:user_id', async(req,res) =>
{
    var id = req.params.user_id;
    var rsp = {};
    var hide = true;

    const rows= await pool.query("Select * from USUARIOS where matricula = ?",[id]);
    if(rows.length > 0)
    {   
        hide = !(req.user.matricula == rows[0].matricula);

        rsp = { success: true, Nombre: rows[0].NombredeUsuario, Email: rows[0].Correo, Matricula: rows[0].matricula, hide : hide, Portada: rows[0].fotoPortada, Perfil: rows[0].foto };
    }
    else{
        rsp = { success: false, response: "nel", hide: hide };
    }
    console.log(rsp);
    res.json(rsp);
	
});

router.get('/asesoria/:asesoria_id', (req,res) =>
{
	
});


function islogged(req,res,next){
    return req.isAuthenticated();
}



module.exports = router;