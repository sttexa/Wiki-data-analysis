var mongoose=require('mongoose');
var logSchema=new mongoose.Schema(
    {
        firstname:String,
        lastname:String,
        password:String,
        email:String
    }
);
var Login=mongoose.model('Login',logSchema,'login');
module.exports.Log_insert=function (fname,lname,pass,email,cb) {
    console.log(fname+lname+pass+email);
    var newlogin=new Login(
        {
            firstname:fname,
            lastname:lname,
            password: pass,
            email:email
        }

    );
    newlogin.save(cb);
};
module.exports.Log_check=function(Email,cb){
	return Login.find({email: Email },cb) ;
}
