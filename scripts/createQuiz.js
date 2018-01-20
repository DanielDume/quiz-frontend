var server_url = "https://quiz-shm.herokuapp.com";

function populateSelectTechnologies() {
    var select = document.getElementById("technologySelect");
    //var selectUpdate = document.getElementById("technologyUpdate");
    $.ajax({
        url: server_url + '/api/technologies',
        headers: { 'x-access-token': window.localStorage.getItem("token") },
        success: function (data) {
            for (var i in data) {
                var option1 = document.createElement("option");
                option1.innerHTML = data[i]['name'];
                option1.value = data[i]['_id'];
                select.appendChild(option1);
            }
        },
        error: function () {
            console.log("error");
        }
    });
}

function populateSelectDifficulties() {
    var select = document.getElementById("difficultySelect");
    $.ajax({
        url: server_url + '/api/difficulties',
        headers: { 'x-access-token': window.localStorage.getItem("token") },
        success: function (data) {
            for (var i in data) {
                var option1 = document.createElement("option");
                option1.innerHTML = data[i]['name'];
                option1.value = data[i]['_id'];
                select.appendChild(option1);
            }
        },
        error: function () {
            console.log("error");
        }
    })
}

function populateSelectUser() {
    var select = document.getElementById("userSelect");
    $.ajax({
        url: server_url + '/api/users',
        headers: { 'x-access-token': window.localStorage.getItem("token") },
        success: function (data) {
            for (var i in data) {
                console.log(data[i]['role'].toLowerCase());
                if (data[i]['role'].toLowerCase() == "examinee") {
                    var option1 = document.createElement("option");
                    option1.innerHTML = data[i]['username'];
                    option1.value = data[i]['_id'];
                    select.appendChild(option1);
                }

            }
        },
        error: function () {
            console.log("error");
        }
    })
}

$(document).ready(function () {
    populateSelectDifficulties();
    populateSelectTechnologies();
    populateSelectUser();
    $("#submit").on('click', function(){
        var userId = $("#userSelect").val();
        var time = $("#timeSelect").val();
        var diffLevel = $("#difficultySelect").val();
        var tech = $("#technologySelect").val();
        $.ajax({
            url: server_url + '/api/create-quiz/',
            method: "POST",
            headers: {'x-access-token': window.localStorage.getItem("token")},
            contentType: "application/x-www-form-urlencoded",
            data: {
                difficultyLevelId: diffLevel,
                technologyId: tech,
                examineeId: userId,
                timeToAnswer: time
             },
            success: function () {
                
            },
            error: function (data) {
                alert("Failed to create quiz, " + data.responseJSON.message);
                console.log(data);
            }
        });
    });

})