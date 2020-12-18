var root = "http://localhost:3000";
var lastTitle=""

$(document).ready(function(){
    auto_dropdown();
})

function auto_dropdown(){
    $.ajax({
        type: "get",
        url: root+"/ind/list",
        success: function(data){
            $("#chooseArticle").append("<option value=' ' >Select a title</option>")
            for (var i=0; i<data.length;i++){
                $("#chooseArticle").append("<option value='"+data[i]+"'>"+data[i]+"</option>")
            }
            $("#inputTitle").autocomplete({
                source: data
            })
        }
    })
}

function selectTitle(){
    var input = $("#chooseArticle").val()
    
    $("#inputTitle").val(input);
}

function selectTitle2(){
    var input = $("#inputTitle").val();
    input = input.trim()
    $("#chooseArticle").val(input)
}

function inputTitle(){
    var title = $("#inputTitle").val()
    title = title.trim()
    if (title == ""){
        alert("Please enter or select a valid title.")
    } else {
        lastTitle = title
        var showtitle = document.getElementById("title")
        while (showtitle.hasChildNodes()){
            showtitle.removeChild(showtitle.firstChild)
        }
        $("#title").append("<label>Title:</label>"+"  "+title)

        updateRevision(title);

        updateYearFilter(title);

        totalRevision(title);

        topFive(title);
    }
}


function updateYearFilter(title){
    $.ajax({
        type:"get",
        url: root+"/ind/yearrange/"+title,
        success:function(data){
            console.log("yearRange:"+data)
            var chooseFrom = document.getElementById("chooseYearFrom")
            var chooseTo = document.getElementById("chooseYearTo")
            while(chooseFrom.hasChildNodes()){
                chooseFrom.removeChild(chooseFrom.firstChild)
			}
			while(chooseTo.hasChildNodes()){
				chooseTo.removeChild(chooseTo.firstChild)
            }
            for (var i=0; i<data.length;i++){
				$("#chooseYearFrom").append("<option value='"+data[i]._id+"'>"+data[i]._id+"</option>")
			}
			for (var i=data.length-1; i>=0; i--){
				$("#chooseYearTo").append("<option value='"+data[i]._id+"'>"+data[i]._id+"</option>")
			}
        }
    })
}

function updateRevision(title){
    $.ajax({
        type:"get",
        url: root+"/ind/update/"+title,
        success: function(data){
            var showUpdate = document.getElementById("update")
            while(showUpdate.hasChildNodes()){
                showUpdate.removeChild(showUpdate.firstChild)
            }
            if(data.updates == 0){
                $("#update")
                .append("<p>The revisions of this article are up to date<p>")
            } else if (data.updates == null){
                alert("Title is not found in the database")
            } else {
                $("#update")
                .append("<label>The number of new revisions have been downloaded: </label>"+"  "+data.updates)
            }
        }
    })
}

function totalRevision(title){
    $.ajax({
        type: "get",
        url: root+"/ind/number/"+title,
        success:function(data){
          if(data.count == 0){
            alert("Title is incorrect")
          } else {
            data = data.count
            var shownumber = document.getElementById("total")
            while (shownumber.hasChildNodes()){
                shownumber.removeChild(shownumber.firstChild)
            }
            $("#total").append("<label>The total number of revisions: </label>"+"  "+data)
          }
        }
    })
}

function topFive(title){
    $.ajax({
        type: "get",
        url: root+"/ind/rank/"+title,
        success:function(data){
            if (data.length >0){
                var showtopfive = document.getElementById("userRevisionTableBody")
                while(showtopfive.hasChildNodes()){
                    showtopfive.removeChild(showtopfive.firstChild)
                }
                var showSelector = document.getElementById("selectUser")
                while(showSelector.hasChildNodes()){
                    showSelector.removeChild(showSelector.firstChild)
                }
                
                for (var i=0; i<data.length; i++){
                    $("#userRevisionTableBody")
                    .append("<tr><td>"+data[i]._id+"</td>"+"<td>"+data[i].count+"</td>"+"</tr>")
                    document.getElementById("userPart").style.display=""
                    $("#selectUser").append("<option value='"+data[i]._id+"'>"+data[i]._id+"</option>")
                }

            } else {
                //alert("")
            }
        }
    })
}

// // after change the Year
function inputTitleYear(){
    var title = $("#inputTitle").val()
    title = title.trim()
    if (lastTitle == title){
        var from = $("#chooseYearFrom").val()
        from = parseInt(from)
        var to = $("#chooseYearTo").val()
        to = parseInt(to)

        if(from <= to){
            totalRevisionYear(title,from, to)
            topFiveYear(title, from, to)
        } else {
            alert("Please select valid years for filtering.")
        }
    } else {
        alert("Please submit your title before filtering years.")
    }
}

function totalRevisionYear(title,from,to){
    from = "?from="+from
    to = "&to="+to
    $.ajax({
        type:"get",
        url: root+"/ind/numberyear/"+title+from+to,
        success:function(data){
          if(data.count == 0){
            alert("No revisions made for this title in selected years")
          } else {
            data = data.count
            var shownumber = document.getElementById("total")
            while (shownumber.hasChildNodes()){
                shownumber.removeChild(shownumber.firstChild)
            }
            $("#total").append("<label>The total number of revisions: </label>"+"  "+data)
          }
        }
    })
}

function topFiveYear(title,from, to){
    from = "?from="+from
    to = "&to="+to
    $.ajax({
        type:"get",
        url: root+"/ind/rankyear/"+title+from+to,
        success:function(data){
            if (data.length >0){
                var showtopfive = document.getElementById("userRevisionTableBody")
                while(showtopfive.hasChildNodes()){
                    showtopfive.removeChild(showtopfive.firstChild)
                }
                var showSelector = document.getElementById("selectUser")
                while(showSelector.hasChildNodes()){
                    showSelector.removeChild(showSelector.firstChild)
                }
                for (var i=0; i<data.length; i++){
                    $("#userRevisionTableBody")
                    .append("<tr><td>"+data[i]._id+"</td>"+"<td>"+data[i].count+"</td>"+"</tr>")
                    document.getElementById("userPart").style.display=""
                    $("#selectUser").append("<option value='"+data[i]._id+"'>"+data[i]._id+"</option>")
                }
            } else {
                //alert("")
            }
        }
    })
}