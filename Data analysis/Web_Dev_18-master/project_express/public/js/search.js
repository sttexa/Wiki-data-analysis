var OL_Action_Root = "http://localhost:3000";

var cat = document.getElementById("cat");
var sub = document.getElementById("sub");
var individualcat = document.getElementById("individualcat");
var individualsub = document.getElementById("individualsub");

var myChart = echarts.init(document.getElementById('main'));
var myindividualChart = echarts.init(document.getElementById('individualCharts'));
var lastUser = null


window.onload=function()
{
	Req_ajax("get","/overall/byyear");
	titlehigh_ajax(num, "get","/overall/highest");
	titlelow_ajax(num, "get","/overall/lowest");
	editedlargest_ajax("get","/overall/editedlargest");
	editedsmallest_ajax("get","/overall/editedsmallest");
	longesthistory_ajax("get","/overall/longesthist");
	shortesthistory_ajax("get","/overall/shortesthist");
	document.getElementById('sub').onclick = function()
	{
		if(cat.value==1){Req_ajax("get","/overall/byyear")}
		else if(cat.value==2){Req_ajax("get","/overall/bytype")}		
	};
	document.getElementById('titlesubmit').onclick = function()
	{
		numberArticles_ajax("get","/overall/numberArticles");
	}
	
//    cat.addEventListener("change", Req_ajax("get","/overall/bytype"));
	
    // individualSearch();
    document.getElementById('individualsub').onclick = function(){
        if(individualcat.value==1){
            drawIndChartsBar("get","/ind/byyear/")
        } else if (individualcat.value==2){
            drawIndChartsPie("get","/ind/bytype/")
        } else if (individualcat.value==3){
            drawIndLast("get","/ind/byuser/")
        }
    };
    
    document.getElementById("individual").style.display = "none";
    document.getElementById("individualCharts").style.display = "none";
    document.getElementById("author").style.display = "none";
    document.getElementById("overall").style.display = "block";
    document.getElementById("main").style.display = "block";
}

document.getElementById('menu1').onclick = function()
{
	document.getElementById("individual").style.display = "none";
	document.getElementById("individualCharts").style.display = "none";
    document.getElementById("author").style.display = "none";
    document.getElementById("overall").style.display = "block";
    document.getElementById("main").style.display = "block";
};

document.getElementById('menu2').onclick = function()
{
	document.getElementById("individual").style.display = "block";
	document.getElementById("individualCharts").style.display = "block";
    document.getElementById("author").style.display = "none";
    document.getElementById("overall").style.display = "none";
    document.getElementById("main").style.display = "none";
};

document.getElementById('menu3').onclick = function()
{
	document.getElementById("individual").style.display = "none";
	document.getElementById("individualCharts").style.display = "none";
    document.getElementById("author").style.display = "block";
    document.getElementById("overall").style.display = "none";
    document.getElementById("main").style.display = "none";
};

function changeTitle(number_of_articles){
    if (number_of_articles == 0)
    {
	    titlehigh_ajax(num, "get","/overall/highest");	
        titlelow_ajax(num, "get","/overall/lowest");
    }
}

function ischeckNum(data) 
{  
	var num = document.getElementById('num').value; 
	var result;
	if( num )  
	{   
		if( !isNaN( num ) )   
		{       
			if (num > data[0]){
				alert('Yout input is out of the number of articles, please input a number less than ' + data[0]); 
				result = 1; 
				return result;
			}
			else{
				result = 0;
				return result;
			}
		}   
		else   
		{    
			alert('Your input is wrong. Please input a number!');       
			result = 1;
			return result;  
		}  
	}  
	else  
	{   
		alert('Your input is NUll. Please input a number!');  
		result = 1;
		return result;  
	} 
}

function numberArticles_ajax(type, Url) 
{
	var isit;
	$.ajax
	({
		url : OL_Action_Root + Url,
		cache : false,
		timeout : 15000,
		type : type,
		success : function(data) { isit = ischeckNum(data)},
		complete : function() { changeTitle(isit)},
		error : function(jqXHR, textStatus, errorThrown) {alert("connection fail");}
    });
}

function Req_ajax(type, Url) 
{
	$.ajax
	({
		url : OL_Action_Root + Url,
		cache : false,
		timeout : 15000,
		type : type,
		success : function(data) {search(data);},
		error : function(jqXHR, textStatus, errorThrown) {alert("connection fail");}
    });
}

var titlehigh_ajax = function(number, type, Url) {

	$.ajax({
		data : {"number" : number.value},
		url : OL_Action_Root + Url,
		cache : false,
		timeout : 15000,
		type : type,
		async:false,
		xhrFields : {withCredentials : true},
		success : function(data) {
			console.log(data);
			updatehigh(data);},
		error : function(jqXHR, textStatus, errorThrown) {alert("connection fail");}
	});
}

var titlelow_ajax = function(number, type, Url) {

	$.ajax({
		data : {"number" : number.value},
		url : OL_Action_Root + Url,
		cache : false,
		timeout : 15000,
		type : type,
		xhrFields : {withCredentials : true},
		success : function(data) {updatelow(data);},
		error : function(jqXHR, textStatus, errorThrown) {alert("connection fail");}
	});
}

var editedlargest_ajax = function(type, Url) {

	$.ajax({
		url : OL_Action_Root + Url,
		cache : false,
		timeout : 15000,
		type : type,
		success : function(data) {editedlargest(data);},
		error : function(jqXHR, textStatus, errorThrown) {alert("connection fail");}
	});
}

var editedsmallest_ajax = function(type, Url) {

	$.ajax({
		url : OL_Action_Root + Url,
		cache : false,
		timeout : 15000,
		type : type,
		success : function(data) {editedsmallest(data);},
		error : function(jqXHR, textStatus, errorThrown) {alert("connection fail");}
	});
}

var longesthistory_ajax = function(type, Url) {

	$.ajax({
		url : OL_Action_Root + Url,
		cache : false,
		timeout : 15000,
		type : type,
		success : function(data) {longesthistory(data);},
		error : function(jqXHR, textStatus, errorThrown) {alert("connection fail");}
	});
}

var shortesthistory_ajax = function(type, Url) {

	$.ajax({
		url : OL_Action_Root + Url,
		cache : false,
		timeout : 15000,
		type : type,
		success : function(data) {shortesthistory(data);},
		error : function(jqXHR, textStatus, errorThrown) {alert("connection fail");}
	});
}

function updatehigh(highestData){
    let limit = num.value || 2;
        let a_data = highestData;
        let topArticles = [];
        for (i=0;i<limit;i++){
            topArticles.push(a_data[i]);
        }
    document.getElementById("top_articles").innerHTML = topArticles.join("</br>");
}

function updatelow(lowestData){
    let limit = num.value || 2;
        let b_data = lowestData;
        let bottomArticles = [];
        for (i=0;i<limit;i++){
            bottomArticles.push(b_data[i]);
        }
    document.getElementById("bottom_articles").innerHTML = bottomArticles.join("</br>");
}

function editedlargest(Data){
    let limit = 1;
    let editedlargestArticles = [];
    for (i=0;i<limit;i++){
    	editedlargestArticles.push(Data[i]);
    }
    document.getElementById("editedlargest_articles").innerHTML = editedlargestArticles.join("</br>");
}

function editedsmallest(Data){
    let limit = 1;
    let editedsmallestArticles = [];
    for (i=0;i<limit;i++){
    	editedsmallestArticles.push(Data[i]);
    }
    document.getElementById("editedsmallest_articles").innerHTML = editedsmallestArticles.join("</br>");
}

function longesthistory(Data){
    let limit = 2;
    let longesthistoryArticles = [];
    for (i=0;i<limit;i++){
    	longesthistoryArticles.push(Data[i]);
    }
    document.getElementById("longest_history_articles").innerHTML = longesthistoryArticles.join("</br>");
}

function shortesthistory(Data){
    let limit = 1;
    let shortesthistoryArticles = [];
    for (i=0;i<limit;i++){
    	shortesthistoryArticles.push(Data[i]);
    }
    document.getElementById("shortest_history_articles").innerHTML = shortesthistoryArticles.join("</br>");
}

//function update(highestData, lowestData){
//    let limit = num.value || 2;
////        let a_data = ["Michael Jackson:30218","Barack Obama:27144","bbb:27554"];
////        let b_data = ["ccc:333","ddd:444","eee:555"];
//    
//    let a_data = highestData;    
//    let b_data = lowestData;
//
//    let topArticles = [];
//    let bottomArticles = [];
//    
//    for (i=0;i<limit;i++){
//        topArticles.push(a_data[i]);
//        bottomArticles.push(b_data[i]);
//    }
//
//    Array.from(document.getElementsByClassName("limit")).forEach(s => s.innerHTML = limit);
//    document.getElementById("top_articles").innerHTML = topArticles.join("</br>");
//    document.getElementById("bottom_articles").innerHTML = bottomArticles.join("</br>");
//}

function search(sourcedata){
	if(cat.value==1){
        myChart.clear();
        var option ={
            legend: {},
            tooltip: {},
            dataset:{
                dimensions: ['year', 'bot', 'admin', 'anon','regular'],
                source: sourcedata,
            },
            xAxis: {type: 'category'},
            yAxis: {scale:true},
            series: [
               {type: 'bar'},
               {type: 'bar'},
               {type: 'bar'},
               {type: 'bar'}
            ]
        };
    }
    else if(cat.value==2){
        myChart.clear();
        var option = {
            legend: {},
        	tooltip: {
        	    trigger: 'item',
        	    formatter: "{c}",
            },
            toolbox: {show: true,},
            dataset: {
                source: sourcedata,
            },
            series: [{
                type: 'pie',
                radius: 150,
                center: ['55%', '50%'],
                label:{formatter:'{b}:{d}%',},
            }]
        };
    }
    else {alert("unknown problem")}
    myChart.setOption(option);
}


function drawIndChartsBar(type,url){
    var title = $("#inputTitle").val()
    var from = $("#chooseYearFrom").val()
    from = parseInt(from)
    var to = $("#chooseYearTo").val()
    to = parseInt(to)
    $.ajax({
       type:type,
       url: OL_Action_Root+url+title,
       success:function(data){
           for(var i=0; i<data.length;i++){
               if(data[i].year == from){
                  var fromIndex = i
               }else if (data[i].year == to){
                  var toIndex = i
               }
           }
           if(toIndex == undefined){
                data = data.slice(fromIndex)
            } else {
                data = data.slice(fromIndex,toIndex+1)
            }
           individualSearch(data)
       },
       error:function(){
           alert("DrawIndCharts Fail")
       }
    })
}


function drawIndChartsPie(type,url){
    var title = $("#inputTitle").val()
    var from = $("#chooseYearFrom").val()
    from = parseInt(from)
    var to = $("#chooseYearTo").val()
    to = parseInt(to)
    from = "?from="+from
    to = "&to="+to
    $.ajax({
        type:type,
        url: OL_Action_Root+url+title+from+to,
        success:function(data){
            var hasadmin = false
            var hasbot = false
            var hasanon = false
            var hasreg = false
            for (var i=0;i<data.length;i++){
                if (data[i][0] == 'admin'){
                    hasadmin =true
                } else if (data[i][0] == 'bot'){
                    hasbot = true
                } else if (data[i][0] == 'anon'){
                    hasanon = true
                } else if (data[i][0] == 'regular'){
                    hasreg = true
                }
            }
            if (!hasadmin){data.push(['admin',0])}
            else if (!hasbot){data.push(['bot',0])}
            else if (!hasanon){data.push(['anon',0])}
            else if (!hasreg){data.push(['regular',0])}
            
            individualSearch(data)
        },
        error:function(){
            alert("DrawIndCharts Fail")
        }
    })
}


function drawIndLast(type,url){
    var title = $("#inputTitle").val()
    var users = $("#selectUser").val()
    var fromyear = $("#chooseYearFrom").val()
    fromyear = parseInt(fromyear)
    var toyear = $("#chooseYearTo").val()
    toyear = parseInt(toyear)
    
    console.log(users)
    if (users=="" || users== null || users==undefined){
        alert("Please select user(s) for Top User(s) Chart")
    } else {
        var listOfuers = ""
        if (Array.isArray(users)){
            for (var i=0; i<users.length;i++){
                if(i == users.length-1){
                    listOfuers += ("users="+users[i])
                } else {
                    listOfuers += ("users="+users[i]+"&")
                }
            }
        } else {
            listOfuers = ("users="+users)
        }
        $.ajax({
			type: type,
			url: OL_Action_Root+url+title+"?"+listOfuers,
			success:function(data){
                console.log("Inside Ajax From "+fromyear)
                console.log("Inside Ajax To "+toyear)
                for(var i=0; i<data.length;i++){
                    if(data[i].year == fromyear){
                        var fromIndex = i
                    }else if (data[i].year == toyear){
                        var toIndex = i
                    }
                }
                console.log("FromIndex: "+fromIndex)
                console.log("ToIndex: "+toIndex)
                if(toIndex == undefined){
                    data = data.slice(fromIndex)
                } else {
                    data = data.slice(fromIndex,toIndex+1)
                }
                individualSearch(data)
			},
			error:function(){
				alert("DrawLastChart Fail")
            }
        })
    }
}



//    function individual chart search
function individualSearch(data) {
    if(individualcat.value==1) {   
        myindividualChart.clear();
        var individualoption ={
        legend: {},
        tooltip: {},
        dataset: {
            dimensions: ['year', 'bot', 'admin', 'anon','regular'],
            source: data
            // [
            //     {year:2014,admin:287582,anno:489845,regularuser:184651},
            //     {year: 2015, 'bot': 278455, 'admin': 255546, 'anno': 489845, 'regularuser': 184651},
            //     {year: 2016, 'bot': 452535, 'admin': 135538, 'anno': 489845, 'regularuser': 184651},
            //     {year: 2017, 'bot': 858545, 'admin': 255546, 'anno': 489845, 'regularuser': 184651},
            //     {year: 2018, 'admin': 255546, 'anno': 489845, 'regularuser': 184651, 'bot': 353567}            
            // ]
        },
        xAxis: {type: 'category'},
        yAxis: {},
        series: [
            {type: 'bar'},
            {type: 'bar'},
            {type: 'bar'},
            {type: 'bar'}
        ]
    };
    }
    else if(individualcat.value==2){
        myindividualChart.clear();
        var individualoption = {
        legend: {},
        tooltip: {
            trigger: 'item',
            formatter: "{c}",
        },
        toolbox: {
            show: true,
        },
        dataset: {
            source: data
            // [
            //     ['admin', 41," active:12 "," inactive:15 "," semi-active:6 "," former:8 "],
            //     ['regular', 55],
            //     ['bot', 24],
            //     ['anno', 86]
            // ]
        },
        series: [{
            type: 'pie',
            radius: 110,
            center: ['55%', '50%'],
            label:{
                formatter:'{b}:{d}%',
            },
        }]
        };
    }
    else if(individualcat.value==3) {
        
        myindividualChart.clear();
        var individualoption ={
        legend: {},
        tooltip: {},
        dataset: {
            dimensions: ['year', 'Selected_Users'],
            source: data
            // [
            //     {year: 2011, Horst:6},
            //     {year: 2012, Horst:10},
            //     {year: 2013, Horst:110},
            //     {year: 2014, Horst:120},
            //     {year: 2015, Horst:90},
            //     {year: 2016, Horst:30},
            //     {year: 2017, Horst:50},
            //     {year: 2018, Horst:35}          
            // ]
        },
        xAxis: {type: 'category'},
        yAxis: {},
        series: [
            {type: 'bar'}
        ]
    };
    }
    else {alert("unknown problem")}
    
    myindividualChart.setOption(individualoption);
}
