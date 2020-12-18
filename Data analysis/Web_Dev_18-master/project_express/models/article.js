var mongoose = require('mongoose');

var article = new mongoose.Schema({
    name: String
})

article.statics.listOfArticles = function(callback){
    return this.aggregate([
        {$project: {name:1,_id:0}},
        {$sort: {name:1}}]).exec(callback)
}



var Article = mongoose.model("Article",article,"articles")

module.exports = Article;