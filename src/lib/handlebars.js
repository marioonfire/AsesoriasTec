const {format}=require('timeago.js');


const helpers={};

helpers.timeago=(timeestamp) =>{
    return format(timestamp);
};

module.exports=helpers;
