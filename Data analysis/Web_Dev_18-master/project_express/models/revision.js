var mongoose = require('mongoose');

var revision = new mongoose.Schema({
    revid: Number,
    title: String,
    timestamp: String,
    user: String,
    year: String,
    usertype: String,
    admintype: String,
    anon: Boolean
})

revision.statics.numberArticles = function(number,callback){
    return this.aggregate([
        {'$group':{_id: "$title", count: {'$sum': 1}}},
        {'$group':{_id: null, count: {'$sum': 1}}}
	]).exec(callback);
}

revision.statics.findArticlesAsd = function(number,callback){
    return this.aggregate([
        {'$group':{_id: "$title", count: {'$sum': 1}}},
		{'$sort': {"count": -1}},
		{'$limit': number}
	]).exec(callback);
}

revision.statics.findArticlesDes = function(number,callback){
    return this.aggregate([
        {'$group':{_id: "$title", count: {'$sum': 1}}},
		{'$sort': {"count": 1}},
		{'$limit': number}
	]).exec(callback);
}

revision.statics.editedLargest = function(callback){
    return this.aggregate([
        { '$match': {'anon':{$exists:false}}},
        { '$group': { '_id': {'title': "$title", 'username': "$user"}}},
        { '$group': { '_id':"$_id.title", 'count':{'$sum':1}}},
        { '$sort': {count: -1}},
        {'$limit': 1}
    ]).exec(callback);
}

revision.statics.editedSmallest = function(callback){
    return this.aggregate([
        { '$match': {'anon':{$exists:false}}},
        { '$group': { '_id': {'title': "$title", 'username': "$user"}}},
        { '$group': { '_id':"$_id.title", 'count':{'$sum':1}}},
        { '$sort': {count: 1}},
        {'$limit': 1}
    ]).exec(callback);
}

revision.statics.longestHistory = function(callback){
    return this.aggregate([
        { '$group':{'_id':"$title",'firstcreated':{$min: "$timestamp"}}},
        { '$sort': {firstcreated: 1}},
        { '$limit': 2}]).exec(callback)
}

revision.statics.shortestHistory = function(callback){
    return this.aggregate([
        { '$group':{'_id':"$title",'firstcreated':{$min: "$timestamp"}}},
        { '$sort': {firstcreated: -1}},
        { '$limit': 1}]).exec(callback)
}

revision.statics.revisionByYear = function(callback){
    return this.aggregate([
        { '$group':{'_id':{'year':"$year",'usertype':"$usertype"},'count':{$sum:1}}},
        { '$project':{'year':'$_id.year','usertype':'$_id.usertype','count':1,'_id':0}},
        { '$group':{_id:"$year",users:{$push:{usertype:"$usertype",count:"$count"}}}},
        { '$sort':{_id: 1}}
    ]).exec(callback)
}

revision.statics.revisionByType = function(callback){
    return this.aggregate([
        { '$group':{'_id':{usertype:"$usertype",admintype:"$admintype"},'count':{'$sum':1}}},
        { '$project': {'usertype':'$_id.usertype',admintype:"$_id.admintype",'count':1,_id:0}},
        {'$sort': {usertype:1}}
    ]).exec(callback)
}

revision.statics.numberOfRevision = function(title,callback){
    return this.aggregate([
        {'$match':{'title':title}},
        {'$group':{'_id':'$title','count':{'$sum':1}}}
    ]).exec(callback)
}


revision.statics.numberOfRevisionYear = function(title,from,to,callback){
    return this.aggregate([
        {'$match':{'title': title , 'year':{$gte: from, $lte:to }}},
        {'$group':{'_id':'$title','count':{'$sum':1}}}
    ]).exec(callback)
}

revision.statics.totalRevisionRankYear = function(title,from,to, callback){
    return this.aggregate([
        {'$match':{'title':title,'usertype':{'$ne':'anon'},'year':{$gte: from, $lte: to}}},
        {'$group':{'_id':'$user','count':{'$sum':1}}},
        {'$sort':{'count': -1}},
        {'$limit': 5}
    ]).exec(callback)
}

revision.statics.getYearRange = function(title, callback){
    return this.aggregate([ 
        {'$match':{'title':title}},
        {$group:{_id:"$year"}},
        {$sort:{_id:1}}
    ]).exec(callback)
}

revision.statics.totalRevisionRank = function(title,callback){
    return this.aggregate([
        {'$match':{'title':title,'usertype':{'$ne':'anon'}}},
        {'$group':{'_id':'$user','count':{'$sum':1}}},
        {'$sort':{'count': -1}},
        {'$limit': 5}
    ]).exec(callback)
}

revision.statics.numberByYearType = function(title,callback){
    return this.aggregate([
        {'$match':{'title':title}},
        { '$group':{'_id':{'year':"$year",'usertype':"$usertype"},'count':{$sum:1}}},
        { '$project':{'year':'$_id.year','usertype':'$_id.usertype','count':1,'_id':0}},
        { '$group':{_id:"$year",users:{$push:{usertype:"$usertype",count:"$count"}}}},
        { '$sort':{_id: 1}}
    ]).exec(callback)
}

revision.statics.numberByType = function(title,from, to, callback){
    return this.aggregate([
        {'$match':{'title':title,'year':{$gte:from,$lte:to}}},
        { '$group':{'_id':{usertype:"$usertype",admintype:"$admintype"},'count':{'$sum':1}}},
        { '$project': {'usertype':'$_id.usertype',admintype:"$_id.admintype",'count':1,_id:0}},
        {'$sort': {usertype:1}}
    ]).exec(callback)
}

revision.statics.numberByYearUser = function(users,title, callback){
    return this.aggregate([
        { $match: { user: {$in: users}, title:title } },
        { $group: { _id: '$year', 'total': { $sum: 1 } } },
        { $project:{year:'$_id',Selected_Users:"$total"}},
        { $sort: { year: 1 } }
    ]).exec(callback)
}

revision.statics.largestusergroup = function(callback){
 return this.aggregate([
        { '$group': { '_id': {'title': "$title", 'username': "$user"}}},
        { '$group': { '_id':"$_id.title", 'count':{'$sum':1}}},
        { '$sort': {count: -1}},
        { '$limit': 1}
        ]).exec(callback)
}

revision.statics.smallestusergroup = function(callback){
   return this.aggregate([
        { '$group': { '_id': {'title': "$title", 'username': "$user"}}},
        { '$group': { '_id':"$_id.title", 'count':{'$sum':1}}},
        { '$sort': {count: 1}},
        { '$limit': 1}
        ]).exec(callback)
}

revision.statics.findtheuser = function(user,callback){
    return this.aggregate([
        { '$match':{'user':user}},
        { '$group': { '_id': "$title",'count':{'$sum':1},'timestamp':{'$push':"$timestamp"}}},
        { '$sort':{count:-1}},
        { '$project': { title: '$_id', _id: '$-', times: '$count', timestamp: '$timestamp'}}
    ]).exec(callback)
}

revision.statics.findLatestRev = function(title,callback){
  return this.aggregate([{$match:{title:title}},
    {$sort:{timestamp:-1}},
    {$limit:1}]).exec(callback)
}

revision.statics.updateJson = function(json, title){
    if (json.length > 0){
        Revision.collection.insertMany(json)
    }
    console.log("Revisions updated: "+[title,json.length])
}
revision.statics.listOfAuthor=function(callback){
    return this.aggregate([
    	{ '$match':{'usertype': {$ne:"anon"}}},
    	{ '$group': { '_id': "$user"}},
        { '$sort': {user:1}},
        { '$project': { user : '$_id',_id: '$-'}}]).exec(callback)
}

var Revision = mongoose.model('Revision',revision,'revisions')

module.exports = Revision;
