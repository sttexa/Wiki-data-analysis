var OL_Action_Root = "http://localhost:3000";
var List = [];
var res = {};

var author_ajax = function(input, type, Url) {

	$.ajax({
		data : {
			"name" : input
		},
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
			if (res[0]) {
				console.log(res);
				list_text(res);
			} else {
				alert("cannot find the auther")
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert("connection fail");
		}
	});
}
function Auto_dropdown() {
	$.ajax({
		type : "get",
		url : root + "/author/list",
		success : function(data) {
			res = data;
			console.log(res);
			if(res.length<=1000){
			$("#find_input").autocomplete({
				source : res
			})
			}
		}
	})
}

$(document).ready(
		function() {
			Auto_dropdown();
			$("#authorTable")
					.on(
							"click",
							"a",
							function() {
								$(this).parents("#authorTable tbody")
										.find("tr").first().find("td").last()
										.html(
												time_stamp(List[$(this).attr(
														"id")].timestamp));
							})
			$("#authorSubmit").click(function() {
				$("#authorTable tbody").html("");
				var str = $("#find_input").val();
				str = str.replace(/^\s+|\s+$/g, "");
				author_ajax(str, 'get', "/author/user");
			})
		})
var list_text = function(results) {
	List = results;
	for (i = 0; i < results.length; i++) {
		if (i == 0) {
			var $t1 = $("<tr><td>" + results[i].title + "</td><td><a id='" + i
					+ "'>" + results[i].times
					+ "</a></td><td rowspan='0'></td></tr>");
			console.log($t1)
			$("#authorTable tbody").append($t1);
		} else {
			var $t2 = $("<tr><td>" + results[i].title + "</td><td><a id='" + i
					+ "'>" + results[i].times + "</a></td></tr>");
			console.log($t2)
			$("#authorTable tbody").append($t2);

		}
	}
}
var time_stamp = function(timelist) {
	var output = '';
	for (i = 0; i < timelist.length; i++) {
		output += timelist[i]
		if ((i + 1) % 6) {
			output += "   ,   "
		} else {
			output += '</br>'
		}
	}
	return output;
}