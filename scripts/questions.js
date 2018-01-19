var server_url = "https://quiz-shm.herokuapp.com";

function showUpdateModal(id) {
    document.getElementById("myModal").style.visibility = "visible";
    document.getElementById("aidi").innerHTML = id;
}

function hideUpdateModal() {
    document.getElementById("myModal").style.visibility = "hidden";
}

function addQuestion() {
    var question = $("#question").val(), answera = $("#answera").val(), answerb = $("#answerb").val(),
        answerc = $("#answerc").val(), answerd = $("#answerd").val();
    var rightAnswers = Array();
    var wrongAnswers = Array();
    if (document.getElementById('checkbox1').checked) {
        rightAnswers.push(answera);
    }
    else {
        wrongAnswers.push(answera);
    }
    if (document.getElementById('checkbox2').checked) {
        rightAnswers.push(answerb);
    }
    else {
        wrongAnswers.push(answerb);
    }
    if (document.getElementById('checkbox3').checked) {
        rightAnswers.push(answerc);
    }
    else {
        wrongAnswers.push(answerc);
    }
    if (document.getElementById('checkbox4').checked) {
        rightAnswers.push(answerd);
    }
    else {
        wrongAnswers.push(answerd);
    }
    var technologySelect = document.getElementById("technology");
    var technologyId = technologySelect.options[technologySelect.selectedIndex].value;

    var difficultySelect = document.getElementById("difficulty");
    var difficultyId = difficultySelect.options[difficultySelect.selectedIndex].value;

    var timeToAnswer = $("#timeToAnswer").val();
    $.ajax({
        url: server_url + '/api/questions',
        method: "POST",
        headers: {'x-access-token': window.localStorage.getItem("token")},
        contentType: "application/x-www-form-urlencoded",
        data: {
            technologyId: technologyId,
            difficultyLevelId: difficultyId,
            requirements: question,
            rightAnswers: rightAnswers,
            wrongAnswers: wrongAnswers,
            timeToAnswer: timeToAnswer
        },
        success: function (data) {
            console.log(data);
            getQuestions();
        },
        error: function (data) {
            console.log(data);
            alert(JSON.stringify(data));
        }
    });
}

function updateQuestionRequest(id) {
    var requirements = $("#requirementsUpdate").val();
    var answera = $("#answeraUpdate").val();
    var answerb = $("#answerbUpdate").val();
    var answerc = $("#answercUpdate").val();
    var answerd = $("#answerdUpdate").val();
    var timeToAnswer = $("#timeToAnswerUpdate").val();
    var rightAnswers = Array();
    var wrongAnswers = Array();
    if (document.getElementById('checkbox1Update').checked) {
        rightAnswers.push(answera);
    }
    else {
        wrongAnswers.push(answera);
    }
    if (document.getElementById('checkbox2Update').checked) {
        rightAnswers.push(answerb);
    }
    else {
        wrongAnswers.push(answerb);
    }
    if (document.getElementById('checkbox3Update').checked) {
        rightAnswers.push(answerc);
    }
    else {
        wrongAnswers.push(answerc);
    }
    if (document.getElementById('checkbox4Update').checked) {
        rightAnswers.push(answerd);
    }
    else {
        wrongAnswers.push(answerd);
    }
    var technologySelect = document.getElementById("technologyUpdate");
    var technologyId = technologySelect.options[technologySelect.selectedIndex].value;

    var difficultySelect = document.getElementById("difficultyUpdate");
    var difficultyId = difficultySelect.options[difficultySelect.selectedIndex].value;
    $.ajax({
        url: server_url + '/api/questions/' + id,
        method: "PUT",
        headers: {'x-access-token': window.localStorage.getItem("token")},
        contentType: "application/x-www-form-urlencoded",
        data: {
            requirements: requirements,
            difficultyLevelId: difficultyId,
            technologyId: technologyId,
            rightAnswers: rightAnswers,
            wrongAnswers: wrongAnswers,
            timeToAnswer: timeToAnswer
        },
        success: function () {
            getQuestions();
        },
        error: function (data) {
            if (JSON.stringify(data['responseText']).search('Role') !== -1)
                alert(JSON.stringify(data['responseText']));
            else
                alert(JSON.stringify(data));
        }
    })
}

function getQuestions() {
    $("article", "#list").remove();
    $.ajax({
        url: server_url + '/api/questions',
        headers: {'x-access-token': window.localStorage.getItem("token")},
        contentType: "application/x-www-form-urlencoded",
        data: {},
        success: function (data) {
            console.log(data);
            var row = "";
            $.each(data, function (index, item) {
                row = '<article>' + '<p style="display: none">' +
                    item._id + '</p>' + '<h3 class="question-name">' +
                    item.requirements +
                    '</h3><h4 class="question-role">' + "Technology: " +
                    item.technology.name + '</h4>' + '<h4 class="question-role">' + "Difficulty: " +
                    item.difficultyLevel.name + "</h4><button id=deleteButton> Delete " +
                    '</button><button id=updateButton onclick="showUpdateModal(\'' + item._id + '\')"> ' +
                    "Update </button></article >";
                $("#list").append(row);
            });
        },
        error: function () {
            console.log("error");
        }
    });
}

function populateSelectTechnologies() {
    var select = document.getElementById("technology");
    var selectUpdate = document.getElementById("technologyUpdate");
    $.ajax({
        url: server_url + '/api/technologies',
        headers: {'x-access-token': window.localStorage.getItem("token")},
        success: function (data) {
            for (var i in data) {
                var option1 = document.createElement("option");
                var option2 = document.createElement("option");
                option1.innerHTML = data[i]['name'];
                option1.value = data[i]['_id'];
                option2.innerHTML = data[i]['name'];
                option2.value = data[i]['_id'];
                select.appendChild(option1);
                selectUpdate.appendChild(option2);
            }
        },
        error: function () {
            console.log("error");
        }
    });
}

function populateSelectDifficulties() {
    var select = document.getElementById("difficulty");
    var selectUpdate = document.getElementById("difficultyUpdate");
    $.ajax({
        url: server_url + '/api/difficulties',
        headers: {'x-access-token': window.localStorage.getItem("token")},
        success: function (data) {
            for (var i in data) {
                var option1 = document.createElement("option");
                var option2 = document.createElement("option");
                option1.innerHTML = data[i]['name'];
                option1.value = data[i]['_id'];
                option2.innerHTML = data[i]['name'];
                option2.value = data[i]['_id'];
                select.appendChild(option1);
                selectUpdate.appendChild(option2);
            }
        },
        error: function () {
            console.log("error");
        }
    })
}

$(document).ready(function () {
    getQuestions();
    populateSelectTechnologies();
    populateSelectDifficulties();
    $('#submit').on('click', function () {
        addQuestion();
    });
    $("#list").on("click", 'article #deleteButton', function () {
        var id = $(this).parent().find('p')[0].innerText;
        $.ajax({
            url: server_url + '/api/questions/' + id,
            method: "DELETE",
            headers: {'x-access-token': window.localStorage.getItem("token")},
            contentType: "application/x-www-form-urlencoded",
            data: {id: id},
            success: function () {
                $(this).parent().remove();
                getQuestions();
            },
            error: function (data) {
                alert("Failed to delete, check console");
                alert(data);
            }
        });
    });
});
