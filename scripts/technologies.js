var token = window.localStorage.getItem("token");
$('#submit').on('click',function () {

    addTechnology();
});

$('#searchBtn').keyup(function () {

    searchTechnology();
});

$(document).ready(function() {
    getAllTechnologies();
});

function getAllTechnologies() {
    $.ajax({
        url: 'https://quiz-shm.herokuapp.com/api/technologies',
        headers:{'x-access-token' : token},
        success: function(data){
            console.log(data);
            populateTechnologyList(data);
        },
        error: function(){
            console.log("BAD SHIT");
        }
    });
}

function populateTechnologyList(data){
    var unorderedList = $('#technologyList');
    var html = "";
    $.each(data,function(index,value){
        console.log(value.name);
        html += '<article id=' + value._id + '><h3>'+ value.name + "<button class='btnTechnologies'>Delete</button><button class='btnTechnologies'>Update</button></h3></article>";
    });
    unorderedList.html(html);


}
function addTechnology() {
    var name = $("#technologies").val();


    $.ajax({
        url: "https://quiz-shm.herokuapp.com/api/technologies",
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        method: "POST",
        headers:{'x-access-token' : token},
        data: {"name":name},
        // beforeSend: function(xhr){
        //     xhr.setRequestHeader("X-Auth-Token", window.localStorage.getItem("token"));
        // },
        success: function (data) {
            console.log(data.message);
        },
        error: function(){
            console.log('Error');
        }
    });

}


function searchTechnology() {
    var name = $("#searchBtn").val();
    $.ajax({
        url: "https://quiz-shm.herokuapp.com/api/technologies?name=" + name,
        contentType: "application/json",
        dataType: 'json',
        method: "GET",
        headers:{'x-access-token' : token},
        success: function (data) {
            console.log(data.message);
        },
        error: function(){
            console.log('Error');
        }
    });

}