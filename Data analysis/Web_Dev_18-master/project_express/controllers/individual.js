var Revision = require("../models/revision")
var Article = require("../models/article")
var load = require("../controllers/load")
var request = require('request')
var moment = require('moment')
var updates
var usertype

module.exports.listOfArticles = function(req, res){
    var list =[]
    Article.listOfArticles(function(err, data){
        if (err) {
            console.log(err)
        } else {
            for (var i=0; i < data.length; i++){
                list.push(data[i].name)
            }
            res.send(list)
        }
    })
}

module.exports.numberOfRevision = function(req,res){
    var title = req.params.title
    Revision.numberOfRevision(title,function(err,data){
        if (err){
            console.log(err)
        } else {
            var result
            if (data.length == 0){
                result =0
            } else {
                result = data[0].count
            }
            res.send({"count":result})
        }
    })
}

module.exports.numberOfRevisionYear = function(req,res){
    var title = req.params.title
    var from = parseInt(req.query.from)
    var to = parseInt(req.query.to)
    Revision.numberOfRevisionYear(title, from, to, function(err,data){
        if(err){
            console.log(err)
        } else {
            var result
            if (data.length == 0){
                result =0
            } else {
                result = data[0].count
            }
            res.send({"count":result})
        }
    })
}

module.exports.totalRevisionRank = function(req,res){
    var title = req.params.title
    Revision.totalRevisionRank(title, function(err,data){
        if(err) {
            console.log(err)
        } else {
            var result
            if (data.length == 0){
                result = {}
            } else {
                result = data
            }
            res.send(result)
        }
    })
}

module.exports.totalRevisionRankYear = function(req,res){
    var title = req.params.title
    var from = parseInt(req.query.from)
    var to = parseInt(req.query.to)
    Revision.totalRevisionRankYear(title, from, to, function(err,data){
        if (err){
            console.log(err)
        } else {
            var result
            if (data.length ==0){
                result = {}
            } else {
                result = data
            }
            res.send(result)
        }
    })
}

module.exports.getYearRange = function(req,res){
    var title = req.params.title
    Revision.getYearRange(title,function(err,data){
        if(err){
            console.log(err)
        } else {
            res.send(data)
        }
    })
}


module.exports.numberByYearType = function(req, res){
    var title = req.params.title
    Revision.numberByYearType(title,function(err,data){
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

module.exports.numberByType = function(req,res){
    var title = req.params.title
    var from = parseInt(req.query.from)
    var to = parseInt(req.query.to)
    Revision.numberByType(title,from,to,function(err,data){
        if (err){
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

module.exports.numberByYearUser = function(req,res){
    inputUser = req.query.users
    var title = req.params.title
    if (Array.isArray(inputUser)){
        var users = inputUser
    } else {
        var users = [inputUser]
    }
    Revision.numberByYearUser(users,title,function(err,data){
        if(err){
            console.log(err)
        } else {
            res.send(data)
        }
    })
}

module.exports.checkArticleUpdate = function(req,res){
  // if (!req.session.username){
  //   res.send([-1])
  //   return;
  // }
  var title = req.params.title
  console.log(title)
  updates = 0
  Revision.findLatestRev(title, function(err,data){
    if (err) {
      console.log(err)
    } else {
        console.log("data is here: "+ data)
      if(data.length == 0){
        //getArticleUpdate(title,"2000-00-00T00:00:00Z",true)
        res.send({update:null})
      } else {
          var currentDate = new Date()
          var pastDate = new Date(data[0].timestamp)
          var dateDiff = currentDate - pastDate
          var diffInHours = (dateDiff/1000)/3600
          if (diffInHours >= 24){
              getArticleUpdate(title, data[0].timestamp, false, res)
          } else {
              res.send({updates:0})
          }
      }
    }
  })
}

function getArticleUpdate(title, timestamp, fromZero, res ){
    var wikiEndpoint = "https://en.wikipedia.org/w/api.php"
    var parameters = ["action=query", "format=json", "prop=revisions","titles="+title, "rvstart="+timestamp,
                "rvdir=newer","rvlimit=max","rvprop=ids|user|timestamp"]
    var url = wikiEndpoint +"?"+parameters.join("&")
    console.log("url: "+url)
    var options = { url: url, Accept: 'application/json','Accept-Charset':'utf-8'}
    request(options, function(err, response, data){
        if(err){
            console.log(err)
        } else if (response.statusCode != 200){
            console.log('Status: ',response.statusCode)
        } else {
            var json = JSON.parse(data)
            var pages = json.query.pages
            var revisions = pages[Object.keys(pages)[0]].revisions
            console.log("There are "+revisions.length + " revisions")
            var number = revisions.length
            var updatedRev = []
            var index = 1
            updates += number - 1
            if (fromZero){
                index = 0
                updates++
            }
            for (var i= index; i<revisions.length; i++){
                revisions[i].title = title;
                revisions[i].year = moment(revisions[i].timestamp).year()
                name = revisions[i].user
                if(load.bot.includes(name)){
                    revisions[i].usertype = "bot"
                } else if (load.adminactive.includes(name)){
                    revisions[i].usertype = "admin"
                    revisions[i].admintype = "active"
                } else if (load.adminformer.includes(name)){
                    revisions[i].usertype = "admin"
                    revisions[i].admintype = "former"
                } else if (load.adminin.includes(name)){
                    revisions[i].usertype = "admin"
                    revisions[i].admintype = "inactive"
                } else if (load.adminsemi.includes(name)){
                    revisions[i].usertype = "admin"
                    revisions[i].admintype = "semi active"
                } else if (typeof(revisions[i].anon)=="string"){
                    revisions[i].usertype = "anon"
                } else {
                    revisions[i].usertype = "regular"
                }
                updatedRev.push(revisions[i])
            }
            Revision.updateJson(updatedRev, title)
            if (number == 500){
                var newtimestamp = updatedRev[updatedRev.length-1].timestamp
                getArticleUpdate(title, newtimestamp, false, res)
            } else {
                console.log("Revision update complete: "+title)
                res.send({updates:updates})
            }
        }
    })
}