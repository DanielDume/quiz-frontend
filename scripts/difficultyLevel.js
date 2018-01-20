document.getElementById('account-button').innerHTML = window.localStorage.user_firstName;

var server_url = "https://quiz-shm.herokuapp.com";
var current_difficulty;
var update_id;

function showUpdateModal(id) {
    getDifficulty(id);
    document.getElementById("nameUpdate").value = current_difficulty.name;
    document.getElementById("myModal").style.visibility = "visible";
    update_id = id;
}

function hideUpdateModal() {
    document.getElementById("myModal").style.visibility = "hidden";
}

function addDifficultyLevel() {
    console.log("ENTERED ADD");
    var name = $("#name").val();
    $.ajax({
        url: server_url + '/api/difficulties',
        method: "POST",
        headers: {'x-access-token': window.localStorage.getItem("token")},
        data: {name: name},
        success: function (data) {
            $("#name").val("");
            console.log(data);
            searchDifficultyLevel();
        },
        error: function () {
            console.log("error");
        }
    });
}

function updateDifficultyRequest(id) {
    $.ajax({
        url: server_url + '/api/difficulties/' + id,
        headers: {'x-access-token': window.localStorage.getItem("token")},
        type: 'PUT',
        data: {name: document.getElementById("nameUpdate").value},
        success: function () {
            searchDifficultyLevel();
        },
        error: function () {
            console.log("error Update");
        }
    })
}

function searchDifficultyLevel() {
    $("article", "#list").remove();
    var name = $("#searchBtn").val();
    $.ajax({
        url: server_url + '/api/difficulties',
        headers: {'x-access-token': window.localStorage.getItem("token")},
        async: false,
        data: {name: name},
        success: function (data) {
            var row = "";
            $.each(data, function (index, item) {
                if (name === '' || item.name.startsWith(name)) {
                    row = '<article><h3 class="difLevel-name">' + item.name +
                        '</h3><p style="display: none">' + item._id + "</p>" +
                        "<button id=deleteButton> Delete </button>" +
                        '<button id=updateButton onclick="showUpdateModal(\'' + item._id + '\')"> Update </button></article>';
                    $("#list").append(row);
                }
            });
        },
        error: function () {
            console.log("error");
        }
    });
}

function getDifficulty(id){
    $.ajax({
        async:false,
        url: server_url + '/api/difficulties/' + id,
        headers: {'x-access-token': window.localStorage.getItem("token")},
        data: {},
        success: function (data) {
            current_difficulty = data;
        },
        error: function () {
            console.log("error");
        }
    });
}


$(document).ready(function () {
    searchDifficultyLevel();
    $('#submit').on('click', function () {
        addDifficultyLevel();
    });
    $('#searchBtn').keyup(function () {
        searchDifficultyLevel();
    });
    $("#list").on("click", 'article #deleteButton', function () {
        var id = $(this).parent().find('p')[0].innerText;
        $(this).parent().remove();
        $.ajax({
            url: server_url + '/api/difficulties/' + id,
            method: "DELETE",
            headers: {'x-access-token': window.localStorage.getItem("token")},
            success: function () {
                $(this).parent().remove();
                searchDifficultyLevel();
            },
            error: function () {
                alert("Failed to delete, check console");
                console.log("error");
            }
        });
    });
});
