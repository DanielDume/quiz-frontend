var current_technology;

$('#submit').on('click', function () {
    addTechnology();
});

$(document).ready(function () {
    getAllTechnologies();
});

function showUpdateModal(id) {
    getTechnology(id);
    document.getElementById("nameUpdate").value = current_technology.name;
    document.getElementById("myModal").style.visibility = "visible";
    update_id = id;
}

function hideUpdateModal(){
    document.getElementById("myModal").style.visibility = "hidden";
}

function updateTechnologyRequest(id){
    $.ajax({
        url: server_url + '/api/technologies/' + id,
        headers: {'x-access-token': window.localStorage.getItem("token")},
        type: 'PUT',
        data : {name: document.getElementById("nameUpdate").value},
        success: function(){
            getAllTechnologies();
        },
        error: function(){
            console.log("error Update");
        }
    })
}

function getAllTechnologies() {
    $.ajax({
        url: server_url + '/api/technologies',
        headers: {'x-access-token': window.localStorage.getItem("token")},
        success: function (data) {
            console.log(data);
            $('#technologyList').empty();
            populateTechnologyList(data);
        },
        error: function () {
            console.log("error");
        }
    });
}

function getTechnology(id){
    $.ajax({
        async:false,
        url: server_url + '/api/technologies/' + id,
        headers: {'x-access-token': window.localStorage.getItem("token")},
        success: function (data) {
            current_technology = data;
        },
        error: function (data) {
            console.log("error");
            alert(JSON.stringify(data));
        }
    });
}

function populateTechnologyList(data) {
    var row = "";
    $.each(data, function (index, item) {
        row = '<article>' + '<p style="display: none">' +
            item._id + '</p>' + '<h3 class="technology-name"/>' +
            "<h3>" + item.name + "</h3>"+
            "</h4><button id=deleteButton> Delete " +
            '</button><button id=updateButton onclick="showUpdateModal(\''+item._id+'\')"> ' +
            "Update </button></article >";
        $("#technologyList").append(row);
    });
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

$(document).ready(function () {
    $("#technologyList").on("click", 'article #deleteButton', function () {
        var id = $(this).parent().find('p')[0].innerText;
        $.ajax({
            url: server_url + '/api/technologies/' + id,
            method: "DELETE",
            headers: {'x-access-token': window.localStorage.getItem("token")},
            contentType: "application/x-www-form-urlencoded",
            data: {id: id},
            success: function () {
                $(this).parent().remove();
                getAllTechnologies()
            },
            error: function (data) {
                alert("Failed to delete, check console");
                alert(data);
            }
        });
    });
});