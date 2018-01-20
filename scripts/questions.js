var server_url = "https://quiz-shm.herokuapp.com";
var current_question;

function showUpdateModal(id) {
    console.log(current_question);
    getQuestion(id);
    document.getElementById("requirementsUpdate").value = current_question.requirements;
    var counter = 1;
    for(var i in current_question.rightAnswers){
        document.getElementById("answer" + counter.toString() + "Update").value = current_question.rightAnswers[i];
        document.getElementById("checkbox" + counter.toString() + "Update").checked = true;
        counter++;
    }
    for(var i in current_question.wrongAnswers){
        document.getElementById("answer" + counter.toString() + "Update").value = current_question.wrongAnswers[i];
        counter++;
    }
    document.getElementById("timeToAnswerUpdate").value = current_question.timeToAnswer;
    document.getElementById("technologyUpdate").value = current_question.technology._id;
    document.getElementById("difficultyUpdate").value = current_question.difficultyLevel._id;

    document.getElementById("myModal").style.visibility = "visible";
    document.getElementById("aidi").innerHTML = id;
}

function hideUpdateModal() {
    document.getElementById("myModal").style.visibility = "hidden";
}

function compare1(a,b) {
    if (a['difficultyLevel']['name'] < b['difficultyLevel']['name'])
        return -1;
    if (a['difficultyLevel']['name'] > b['difficultyLevel']['name'])
        return 1;
    return 0;
}

function compare2(a,b) {
    if (a['technology']['name'] < b['technology']['name'])
        return -1;
    if (a['technology']['name'] > b['technology']['name'])
        return 1;
    return 0;
}

function addQuestion() {
    var question = $("#question").val(), answer1 = $("#answer1").val(), answer2 = $("#answer2").val(),
        answer3 = $("#answer3").val(), answer4 = $("#answer4").val();
    var rightAnswers = [];
    var wrongAnswers = [];
    if (document.getElementById('checkbox1').checked) {
        rightAnswers.push(answer1);
    }
    else {
        wrongAnswers.push(answer1);
    }
    if (document.getElementById('checkbox2').checked) {
        rightAnswers.push(answer2);
    }
    else {
        wrongAnswers.push(answer2);
    }
    if (document.getElementById('checkbox3').checked) {
        rightAnswers.push(answer3);
    }
    else {
        wrongAnswers.push(answer3);
    }
    if (document.getElementById('checkbox4').checked) {
        rightAnswers.push(answer4);
    }
    else {
        wrongAnswers.push(answer4);
    }
    var technologySelect = document.getElementById("technology");
    var technologyId = technologySelect.options[technologySelect.selectedIndex].value;

    var difficultySelect = document.getElementById("difficulty");
    var difficultyId = difficultySelect.options[difficultySelect.selectedIndex].value;

    var timeToAnswer = $("#timeToAnswer").val();

    $.ajax({
        url: server_url + '/api/questions',
        method: "POST",
        crossDomain: true,
        headers: {
            'x-access-token': window.localStorage.getItem("token")
        },
        contentType: "application/json",
        data: JSON.stringify({
            technologyId: technologyId,
            difficultyLevelId: difficultyId,
            requirements: question,
            rightAnswers: rightAnswers,
            wrongAnswers: wrongAnswers,
            timeToAnswer: timeToAnswer
        }),
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
    var answer1 = $("#answer1Update").val();
    var answer2 = $("#answer2Update").val();
    var answer3 = $("#answer3Update").val();
    var answer4 = $("#answer4Update").val();
    var timeToAnswer = $("#timeToAnswerUpdate").val();
    var rightAnswers = Array();
    var wrongAnswers = Array();
    if (document.getElementById('checkbox1Update').checked) {
        rightAnswers.push(answer1);
    }
    else {
        wrongAnswers.push(answer1);
    }
    if (document.getElementById('checkbox2Update').checked) {
        rightAnswers.push(answer2);
    }
    else {
        wrongAnswers.push(answer2);
    }
    if (document.getElementById('checkbox3Update').checked) {
        rightAnswers.push(answer3);
    }
    else {
        wrongAnswers.push(answer3);
    }
    if (document.getElementById('checkbox4Update').checked) {
        rightAnswers.push(answer4);
    }
    else {
        wrongAnswers.push(answer4);
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
        contentType: "application/json",
        data: {},
        success: function (data) {
            console.log(data);
            if(document.getElementById('filterDifficulty').checked) {
                data = data.sort(compare1);
            }
            if(document.getElementById('filterTechnology').checked){
                data = data.sort(compare2);
            }
            var row = "";
            $.each(data, function (index, item) {
                // alert(JSON.stringify(item));
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

function getQuestion(id){
    $.ajax({
        url: server_url + '/api/questions/' + id,
        headers: {'x-access-token': window.localStorage.getItem("token")},
        contentType: "application/json",
        async: false,
        data: {},
        success: function (data) {
            current_question = data;
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
    $('#filterTechnology').change(function() {
        getQuestions();
    });
    $('#filterDifficulty').change(function() {
        getQuestions();
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
