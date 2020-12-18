var Reviewer = require("../models/reviewer")
var Revision = require("../models/revision")

 module.exports.numberArticles = function(req, res){
    var number = parseInt(req.query.number);
 	Revision.numberArticles(number, function(err, data){
 		if (err) {
             console.log(err)
         } else {
             var results = []
             for (var i=0; i<data.length; i++){
            	 results[i]= data[i].count
             }
             res.send(results)
             console.log(results)
         }
 	})
 }

  module.exports.findArticlesAsd = function(req, res){
      var number =parseInt(req.query.number);
      console.log(number);
 	 Revision.findArticlesAsd(number, function(err, data){
 	 	if (err) {
              console.log(err)
          } else {
        	  console.log(data);
              var results = []
              for (var i=0; i<data.length; i++){
             	 results[i]= data[i]._id + ":" + data[i].count
              }
              res.send(results)
              console.log(results)
          }
   	})
  } 

 module.exports.findArticlesDes = function(req, res){
    var number = parseInt(req.query.number);
 	Revision.findArticlesDes(number, function(err, data){
 		if (err) {
             console.log(err)
         } else {
             var results = []
             for (var i=0; i<data.length; i++){
            	 results[i]= data[i]._id + ":" + data[i].count
             }
             res.send(results)
             console.log(results)
         }
 	})
 }

module.exports.editedLargest = function(req, res){
	    Revision.editedLargest(function(err,data){
	    if (err) {
	        console.log(err)
	    } else {
            var results = []
            for (var i=0; i<data.length; i++){
           	 results[i]= data[i]._id + ":" + data[i].count
            }
            res.send(results)
            console.log(results)
	    }
    })
}
 
module.exports.editedSmallest = function(req, res){
    Revision.editedSmallest(function(err,data){
        if (err) {
            console.log(err)
        } else {
            var results = []
            for (var i=0; i<data.length; i++){
           	 results[i]= data[i]._id + ":" + data[i].count
            }
            res.send(results)
            console.log(results)
        }
    })
}

module.exports.longestHistory = function(req, res){
    Revision.longestHistory(function(err,data){
        if (err) {
            console.log(err)
        } else {
            var results = []
            for (var i=0; i<data.length; i++){
           	 results[i]= data[i]._id + ":" + data[i].firstcreated
            }
            res.send(results)
            console.log(results)
        }
    })
}

module.exports.shortestHistory = function(req, res){
    Revision.shortestHistory(function(err,data){
        if (err) {
            console.log(err)
        } else {
        	var results = []
            for (var i=0; i<data.length; i++){
            results[i]= data[i]._id + ":" + data[i].firstcreated
            }
            res.send(results)
            console.log(results)
        }
    })
}

module.exports.revisionByYear = function(req, res){
    Revision.revisionByYear(function(err,data){
        if (err) {
            console.log(err)
        } else {
            var results = []
            for (var i=0; i<data.length; i++){
                results[i]= {year: data[i]._id}
                for (var j=0; j<data[i].users.length; j++){
                  var type = data[i].users[j].usertype
                  results[i][type] = data[i].users[j].count
                }
            }
            res.send(results)
            console.log(results)
        }
    })
}

module.exports.revisionByType = function(req, res){
    Revision.revisionByType(function(err,data){
        if (err) {
            console.log(err)
        } else {
            var results=[['admin',0]]
            for (var i=0; i<data.length; i++){
                if(data[i].usertype == "admin"){
                    results[0][1] +=data[i].count
                    results[0].push(""+data[i].admintype+":"+data[i].count)
                } else {
                  results.push([""+data[i].usertype, data[i].count])
                }
            }
            res.send(results)
            console.log(results)
        }
    })
}

module.exports.largestusergroup = function(req, res){
	Revision.largestusergroup(function(err, data){
		if (err) {
            console.log(err)
        } else {
            res.json(data)
            console.log(data)
        }
	})
}

module.exports.smallestusergroup = function(req, res){
	Revision.smallestusergroup(function(err, data){
		if (err) {
            console.log(err)
        } else {
            res.json(data)
            console.log(data)
        }
	})
}