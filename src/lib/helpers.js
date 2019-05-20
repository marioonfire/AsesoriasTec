const bcrypt = require('bcryptjs')

const helpers ={};

helpers.encryptPassword= async(password) =>{
  const salt= await bcrypt.genSalt(10);
  const hash=await bcrypt.hash(password,salt);
  return hash;
};

helpers.matchPassword= async(password,savePasword)=>{
 
  console.log(password)
  console.log(savePasword)
  try{
    return bcrypt.compare(password,savePasword);
  }
  catch(e)
  {
  	console.log(e)
  }
};

helpers.randomNumber = () => {
  const possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0912345678';
  var randomNumber = 0;
  for (let i = 0; i < 15; i++){
      randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return randomNumber;
}
module.exports= helpers;