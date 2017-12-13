$('#submit').on('click', function () {

    addTechnology();
});

$('#searchInput').on('keyup', function () {
    var name = $("#searchInput").val();
    delay(function () {
        $.ajax({
            url: 'https://quiz-shm.herokuapp.com/api/technologies',
            headers: {'x-access-token': window.localStorage.getItem("token")},
            success: function (data) {
                var results = [];
                $.each(data, function (index, value) {
                    if (value.name.indexOf(name) >= 0) {
                        results.push(value);
                    }
                });
                $('#technologyList').empty();
                populateTechnologyList(results);

            },
            error: function () {
                console.log("BAD SHIT");
            }
        });
    }, 3000);
});

var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

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
        url: 'https://quiz-shm.herokuapp.com/api/technologies/' + id,
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
        url: 'https://quiz-shm.herokuapp.com/api/technologies/' + id,
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
        url: 'https://quiz-shm.herokuapp.com/api/technologies',
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
        url: "https://quiz-shm.herokuapp.com/api/technologies",
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


/*
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

}*/
