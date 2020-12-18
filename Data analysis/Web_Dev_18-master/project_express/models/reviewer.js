var mongoose = require('mongoose');

var reviewer = new mongoose.Schema({
    user: String,
    usertype: String
})

var Reviewer = mongoose.model('Reviewer',reviewer,'reviewers')

module.exports = Reviewer;