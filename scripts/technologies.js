var server_url = "https://quiz-shm.herokuapp.com";

$('#submit').on('click', function () {
    addTechnology();
});

$(document).ready(function () {
    getAllTechnologies();
});

function deleteTechnologyEntry(element) {
    var articleElement = $(element).closest("article");
    var idTechnology = articleElement.attr('id');
    deleteTechnologyRequest(idTechnology);
}

function showUpdateModal() {
    document.getElementById("myModal").style.visibility = "visible";
}

function hideUpdateModal(){
    document.getElementById("myModal").style.visibility = "hidden";
}

function deleteTechnologyRequest(id) {
    $.ajax({
        url: server_url + '/api/technologies/' + id,
        headers: {'x-access-token': window.localStorage.getItem("token")},
        type: 'DELETE',
        success: function () {
            getAllTechnologies();
        },
        error: function () {
            console.log("BAD SHIT Delete");
        }
    });
}

function updateTechnologyRequest(id){
    $.ajax({
        url: server_url + '/api/technologies/' + id,
        headers: {'x-access-token': window.localStorage.getItem("token")},
        type: 'PUT',
        data : {name: document.getElementById("technologiesModal").value},
        success: function(){
            getAllTechnologies();
        },
        error: function(){
            console.log("BAD SHIT Update");
        }
    })
}


function getAllTechnologies() {
    $.ajax({
        url: server_url + '/api/technologies',
        headers: {'x-access-token': window.localStorage.getItem("token")},
        success: function (data) {
            $('#technologyList').empty();
            populateTechnologyList(data);
        },
        error: function () {
            console.log("BAD SHIT");
        }
    });
}

function populateTechnologyList(data) {
    var unorderedList = $('#technologyList');
    var html = "";
    $.each(data, function (index, value) {
        html += '<article id=' + value._id + '><h3>' + value.name + "<button onclick='deleteTechnologyEntry(this)'  class='btnTechnologies'>Delete</button><button onclick='showUpdateModal(this)' class='btnTechnologies'>Update</button></h3></article>";
    });
    unorderedList.html(html);


}

function addTechnology() {
    var name = $("#technologies").val();
    $.ajax({
        url: server_url + '/api/technologies',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        method: "POST",
        headers: {'x-access-token': window.localStorage.getItem("token")},
        data: {"name": name},
        success: function (data) {
            console.log(data.message);
            $('#technologyList').empty();
            getAllTechnologies();

        },
        error: function () {
            console.log('Error');
        }
    });

}
