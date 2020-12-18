var mongoose=require('mongoose');
var logSchema=new mongoose.Schema(
    {
        firstname:String,
        lastname:String,
        password:String,
        email:String
    }
);
var Login1=mongoose.model('Login1',logSchema,'login');
var Login_find=function(username,pass,cb){
     Login1.find({email:username, password:pass}, cb);
}

module.exports=Login_find;