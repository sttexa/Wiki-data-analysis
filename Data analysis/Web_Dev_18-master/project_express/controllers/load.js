var path = require('path')
var moment = require('moment')
var fs = require('fs')
var async = require('async')

var Revision = require("../models/revision")
var Artical = require("../models/article")

var adminactive = []
var adminformer = []
var adminin = []
var adminsemi = []
var bot = []
//var articles=[]

module.exports = {adminactive:adminactive, adminformer:adminformer, adminin:adminin, adminsemi:adminsemi,
                  bot:bot}

module.exports.loadReviewer = function(req, res, next){
    console.log("loadReviewer here")
    var directory = path.join(__dirname,"../public/dataset")
    fs.readdir(directory, function(err,filelist){
        filelist.filter(function(file){
            if (file.indexOf(".txt")>-1){
                fs.readFile(path.join(directory,file),'utf8',function(err,data){
                    if(err) console.log(err)
                    var nameslist = data.split('\n')
                    nameslist.forEach(function(name){
                        if(file.indexOf("admin")>-1){ //if admin file, load admin to Reviewer
                            if (file == "admin_active.txt"){
                                adminactive.push(name)
                            } else if (file == "admin_former.txt"){
                                adminformer.push(name)
                            } else if (file == "admin_inactive.txt"){
                                adminin.push(name)
                            } else if (file == "admin_semi_active.txt"){
                                adminsemi.push(name)
                            }
                        } else if (file.indexOf("bot")>-1){ // if bot file, load bot to Reviewer
                            bot.push(name)
                        }
                    })
                    console.log('admin_active '+adminactive.length+'\n'+
                                'admin_former '+adminformer.length+'\n'+
                                'adminin_inactive '+adminin.length+'\n'+
                                'admin_semi_active '+adminsemi.length+'\n'+
                                'bot '+bot.length)
                })
            }
        })
    })
    res.send('load bot and admin successful')
}

// findUser = function findUser (username,callback){
//     Reviewer.findOne({user:username},function(err, userObj){
//         if(err){
//             return callback(err)
//         } else if (userObj){
//             return callback(null,userObj)
//         } else {
//             return callback()
//         }
//     })
// }

module.exports.updateUserType = function(req, res){
    var a=1
    Revision.collection.find().forEach(function(revision){
    	var year = moment(revision.timestamp).year()
        if(revision.anon != true){
            if (bot.includes(revision.user)){
                Revision.collection.update({'_id':revision._id},
                {'$set':{'usertype':"bot",'year':year}})
            } else if (adminformer.includes(revision.user)){
                    Revision.collection.update({'_id':revision._id},
                    {'$set':{'usertype':"admin",'admintype':"former",'year':year}})
            } else if(adminactive.includes(revision.user)){
                    Revision.collection.update({'_id':revision._id},
                    {'$set':{'usertype':"admin",'admintype':"active",'year':year}})
            } else if (adminsemi.includes(revision.user)){
                    Revision.collection.update({'_id':revision._id},
                    {'$set':{'usertype':"admin",'admintype':"semi active",'year':year}})
            } else if(adminin.includes(revision.user)){
                Revision.collection.update({'_id':revision._id},
                {'$set':{'usertype':"admin",'admintype':"inactive",'year':year}})
            } else {
                Revision.collection.update({'_id':revision._id},
                {'$set':{'usertype':"regular",'year':year}})
            }
        } else {
            Revision.collection.update({'_id':revision._id},
            {'$set':{'usertype':'anon','year':year}})
        }
        console.log(moment().format()+" Update "+ a)
        a++
    })
    res.send("Update usertype successfully")
}

// module.exports.updateUserType = function(req, res){
//     //var a =1
//     // findUser("Vinne2.bot", function(err,userfound){
//     //     console.log(userfound)
//     // })

//     Revision.collection.find().forEach(function(revision){
//         //var year = moment(revision.timestamp).year()
//         //console.log(revision.user)
//         if(revision.anon != true){
//             findUser(revision.user,function(err,obj){
//                 if(obj != null || obj!=undefined){
//                     console.log(obj)
//                     if(obj.usertype == "admin"){
//                         Revision.collection.update({'revid': revision.revid},
//                                         {'$set':{'usertype':"admin",
//                                         'admintype':obj.admintype}})
//                     } else {
//                         Revision.collection.update({'revid': revision.revid},
//                                         {'$set':{'usertype':"bot"}})
//                     }
//                 } else {
//                     //console.log(obj)
//                 }
//             })
//         }
//         //console.log("Update "+revision.revid+" "+a)
//         //a++
//     })
//     res.send("Update usertype successfully")
// }

/*function search(obj){
	for(var a in obj){
		if(typeof(obj[a][1]) =="object"){
			search(obj[a])
		} else {
			console.log(obj[a])
		}
	}
}*/


// module.exports.loadRevision = function (req,res,next){
//     var directory = path.join(__dirname,"../public/dataset/revisions")
//     var files = fs.readdirSync(directory) // files is a list of ['A.json','B.json',....,'Z.json']
//     //var a = 1;
//     var b =1;
//     async.eachOf(files, function(file, callback){
//         fs.readFile(path.join(directory,file),'utf8', function(err,data){
//             if (err) console.log(err)
//             var reviews = JSON.parse(data)

//             /*if(a <= 5) {
//                 console.log(review)
//                 a++
//             }*/

//             //search(review)

//             async.eachSeries(reviews, function (review, callback){
//                 // load Reviewer data
//                 var year = moment(review.timestamp).year()
//                 if (review.hasOwnProperty("anon")){
//                     var revision = new Revision({
//                             title: review.title,
//                             timestamp: review.timestamp,
//                             user: review.user,
//                             year: year,
//                             usertype: 'anon',
//                         })
//                         revision.save(function(err){
//                             if(err) console.log(err)
//                         })
//                 } else {
//                     Reviewer.findOne().where({user:review.user}).exec(function(err,obj){
//                     // check if user is an admin or bot
//                     if (obj != null){ // if user is admin or bot, add to Revision
//                         if(obj.usertype == 'admin'){
//                             var revision = new Revision({
//                                 title: review.title,
//                                 timestamp: review.timestamp,
//                                 user: review.user,
//                                 year: year,
//                                 usertype: 'admin',
//                                 admintype: obj.admintype
//                             })
//                         } else {
//                             var revision = new Revision({
//                                 title: review.title,
//                                 timestamp: review.timestamp,
//                                 user: review.user,
//                                 year: year,
//                                 usertype: 'bot',
//                             })
//                         }
//                         revision.save(function(err){
//                             if(err) console.log(err)
//                         })
//                     } else { // if user is anon or regular, add to Reviewer first
//                         var revision = new Revision({
//                             title: review.title,
//                             timestamp: review.timestamp,
//                             user: review.user,
//                             year: year,
//                             usertype: 'regular',
//                         })
//                         revision.save(function(err){
//                             if(err) console.log(err)
//                         })
//                     }
//                     })
//                 }
//                 callback()
//             },function(err){
//                 if(err) console.log(err)
//             })
//             console.log(moment().format()+"   Finished loading "+file+"  "+b)
//             b++
//         })
//     },function(err){
//         console.log(err)
//     })
//     res.send('successful')
// }


module.exports.loadArticles = function(req,res){
    var directory = path.join(__dirname,"../public/dataset/revisions")
    var files = fs.readdirSync(directory)
    async.eachSeries(files, function(file,callback){
        file = file.substring(0, file.length-5)

        //articles.push(file)

        var article = new Artical({
            name: file
        });
        article.save(function(err){
            if (err) console.log(err)
        })
        callback()
    }, function(err){
        if (err){
            console.log(err)
        }
    })
    res.send("Articles are loaded successfully")
}

/*module.exports.loadArticles = function(req, res, next){
    var directory = path.join(__dirname,"../public/dataset/revisions")
    var files = fs.readdirSync(directory)
    async.eachSeries(files, function(file,callback){
        file = file.substring(0, file.length-5)
        articles.push(file)
        callback()
    }, function(err){
        if (err){
            console.log(err)
        } else {
            console.log(articles)
            res.send(articles)
        }
    })
}

module.exports.articles = articles;*/


