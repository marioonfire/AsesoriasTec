const express = require('express');
const router=express.Router();

router.get('/',(req,res) => {
     res.redirect('/login')
     // res.send('Hello Word');
});


module.exports= router;