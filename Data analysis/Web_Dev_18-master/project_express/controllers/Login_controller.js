var LoginMongoose = require('../models/Login_mongoose');
var Savelogin = require('../models/save_mongoose');
var timeout_ms = 2000; // 8 seconds
var redir = function(req, res, Url) {
	setTimeout(function() {
		res.redirect(301, Url);
	}, timeout_ms)
};

module.exports.login_check = function(req, res, next) {
	var params = req.body;
	console.log(params)
	LoginMongoose(params.username, params.password, function(err, login) {
		if (err) {
			console.log("Query error!")
		} else {
			console.log(login)
			if (login[0]) {
				req.session.login=true;
				//res.cookie('login', true, { maxAge: 120 * 1000, singed: true});
				res.json(['success',  "/", 'login successful' ]);
			} else {
				res.json(['fail', 'Account not exist or password incorrect']);
			}
		}
	});
}

module.exports.save = function(req, res, next) {
	var params = req.body;
	console.log(params)
	console.log(Savelogin.Log_check(params.email, function(err, _email) {
			if (err) {
				console.log("Query error!")
				res.json(['fail', 'email checking fail']);   
			}else {
				if (_email[0]) {
					res.json(['fail', 'email existed']);   
				} else {
					Savelogin.Log_insert(params.fname, params.lname,
							params.password, params.email, function(err) {
								if (err) {
									console.log(err);
									res.json(['fail', 'save fail']); 
								} else {
									console.log('save success');
									req.session.login=true;
									//res.cookie('login', true, { maxAge: 120 * 1000, singed: true});
									res.json(['success',  "/", 'save successful' ]);
								}
							})
				}
			}
		}))
}
module.exports.logout=function(req,res,next){
	console.log(req.session.login)
	//res.clearCookie();
	res.render('login',{message: "Logout successfully"})
	req.session.destroy();
}

module.exports.index = function(req, res, next) {
	res.render('login',{message: " "});
}
module.exports.checksession =function(req, res, next) {
	console.log(req.session.login)
	if(req.session.login){
		
	//|| req.cookies.login
		res.render('index');
	}else{
		res.render('login',{message:"Please login"})
	}
}
