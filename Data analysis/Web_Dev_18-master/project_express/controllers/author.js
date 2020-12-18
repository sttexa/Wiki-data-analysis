var Revision = require("../models/revision")


module.exports.findtheuser = function(req, res){
	var name= req.query.name;
	console.log(name);
    Revision.findtheuser(name,function(err,data){
        if (err) {
            console.log(err)
        } else {
        	res.json(data)
        }
    })
}
module.exports.list=function(req,res){
	    var list =[]
	    Revision.listOfAuthor(function(err, data){
	        if (err) {
	            console.log(err)
	        } else {
	            for (var i=0; i < data.length; i++){
	                list.push(data[i].user)
	            }
	            res.send(list)
	        }
	    })
	    
}