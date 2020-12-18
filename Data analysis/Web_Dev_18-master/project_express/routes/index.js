var express = require('express');
var router = express.Router();
var loadcontroller = require('../controllers/load')
var overallcontroller = require('../controllers/overall')
var indcontroller = require('../controllers/individual')
var authorcontroller=require('../controllers/author')
var logincontroller = require('../controllers/Login_controller')
var url= require('url')


//GET home page.

router.get('/', logincontroller.checksession);


router.get('/reviewer',loadcontroller.loadReviewer)
//router.get('/revision',loadcontroller.loadRevision)
router.get('/articles',loadcontroller.loadArticles)
router.get('/usertype',loadcontroller.updateUserType)

router.get('/overall/numberArticles',overallcontroller.numberArticles)

router.get('/overall/highest',overallcontroller.findArticlesAsd)
router.get('/overall/lowest',overallcontroller.findArticlesDes)

router.get('/overall/editedlargest',overallcontroller.editedLargest)
router.get('/overall/editedsmallest',overallcontroller.editedSmallest)
router.get('/overall/longesthist',overallcontroller.longestHistory)
router.get('/overall/shortesthist',overallcontroller.shortestHistory)
router.get('/overall/byyear',overallcontroller.revisionByYear)
router.get('/overall/bytype',overallcontroller.revisionByType)
router.get('/overall/large',overallcontroller.largestusergroup)
router.get('/overall/small',overallcontroller.smallestusergroup)

router.get('/ind/list',indcontroller.listOfArticles)
router.get('/ind/number/:title',indcontroller.numberOfRevision) // title
router.get('/ind/rank/:title',indcontroller.totalRevisionRank) // title
router.get('/ind/byyear/:title',indcontroller.numberByYearType) // title
router.get('/ind/bytype/:title',indcontroller.numberByType) // title ?from= & to=
router.get('/ind/byuser/:title',indcontroller.numberByYearUser) // title  ?users= & users=
router.get('/ind/update/:title',indcontroller.checkArticleUpdate) // title
router.get('/ind/numberyear/:title',indcontroller.numberOfRevisionYear) //title ?from= & to=
router.get('/ind/rankyear/:title',indcontroller.totalRevisionRankYear)// title ?from= & to=
router.get('/ind/yearrange/:title',indcontroller.getYearRange) // title


router.get('/author/user', authorcontroller.findtheuser)
router.get('/author/list',authorcontroller.list)

router.get('/logout', logincontroller.logout);
module.exports = router;
