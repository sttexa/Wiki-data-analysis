var OL_Action_Root = "http://localhost:3000/login";
var xmlHttp = null;
var emailpattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
var check = function(type, formid) {
	switch (type) {
	case 'login':
		var formjson = formtoJson(formid);
		if (formjson.username.indexOf(" ") >= 0
				|| formjson.password.indexOf(" ") >= 0) {
			alert('space is not allowed')
		} else {
			if (formjson.username.length == 0) {
				alert('username cannot be empty')
			} else {
				if (!emailpattern.test(formjson.username)) {
					alert('username must be a email')
				} else {
					if (formjson.password.length < 8
							|| formjson.password.length > 20) {
						alert('password length incorrect')
					} else {
						return true
					}
				}
			}
		}

		return false
		break;
	case 'sign':
		var formjson = formtoJson(formid);
		if (formjson.fname.indexOf(" ") >= 0
				|| formjson.lname.indexOf(" ") >= 0
				|| formjson.email.indexOf(" ") >= 0
				|| formjson.password.indexOf(" ") >= 0
				|| formjson.c_password.indexOf(" ") >= 0) {
			alert('space is not allowed')
		} else {
			if (formjson.fname.length == 0) {
				alert('first name cannot be empty')
			} else {
				if (formjson.lname.length == 0) {
					alert('last name cannot be empty')
				} else {
					if (!emailpattern.test(formjson.email)) {
						alert('email pattern wrong')
					} else {
						if (formjson.password.length < 8
								|| formjson.password.length > 20) {
							alert('password length incorrect')
						} else {
							if (formjson.c_password != formjson.password) {
								alert('confirm password incorrect')
							} else {
								return true
							}

						}
					}
				}
			}
		}

		return false
		break;
	default:
		return false;
	}
}
var formtoJson = function(id) {
	var json = {};

	var formArray = $(id).serializeArray();

	$.each(formArray, function(i, item) {

		json[item.name] = item.value;

	});
	return json;
}

var Req_ajax = function(formid, type, Url) {

	$.ajax({
		data : $(formid).serialize(),
		url : OL_Action_Root + Url,
		dataType : 'json',
		cache : false,
		timeout : 5000,
		type : type,
		xhrFields : {
			withCredentials : true
		},
		success : function(data) {
			var res = data;
			console.log(res);
			if (res[0] == 'success') {
				alert(res[2]);
				window.location.href = res[1];
			} else {
				alert(res[1]);
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert("connection fail");
		}
	});
}

$(document).ready(function() {
	$("#forms1").show();
	$("#forms2").hide();

	$("#Login").click(function() {
		$(".Title").text("Login");
		$("#forms1").show();
		$("#forms2").hide();
	})

	$("#Signup").click(function() {
		$(".Title").text("Sign up");
		$("#forms2").show();
		$("#forms1").hide();
	})

	$("#submit1").click(function() {
		if (check('login', '#forms1')) {
			Req_ajax('#forms1', 'post', "/login_check");
		}
	});

	$("#submit2").click(function() {
		if (check('sign', '#forms2')) {
			Req_ajax('#forms2', 'post', "/save");
		}
	});
});
