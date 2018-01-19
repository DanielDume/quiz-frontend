try_authenticate();

function showUpdateModal(id) {
    var modal = document.getElementById("myModal");
    modal.style.visibility = "visible";
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
    $.ajax({
        url: 'https://quiz-shm.herokuapp.com/api/questions',
        method: "POST",
        headers: {'x-access-token': window.localStorage.getItem("token")},
        contentType: "application/x-www-form-urlencoded",
        data: {
            technologyId: technologyId,
            difficultyLevelId: difficultyId,
            requirements: question,
            rightAnswers: rightAnswers,
            wrongAnswers: wrongAnswers,
            timeToAnswer: 100000
        },
        success: function (data) {
            console.log(data);
            searchQuestion();
        },
        error: function (data) {
            console.log(data);
            alert(JSON.stringify(data));
        }
    });
}

function updateQuestionRequest(id) {
    var token = window.localStorage.getItem("token");
    $.ajax({
        url: 'https://quiz-shm.herokuapp.com/api/questions/' + id,
        method: "PUT",
        headers: {'x-access-token': token},
        contentType: "application/x-www-form-urlencoded",
        data: {
            firstName: $("#firstNameUpdate").val(),
            lastName: $("#lastNameUpdate").val(),
            email: $("#emailUpdate").val(),
            password: $("#passwordUpdate").val(),
            role: $("#roleUpdate").val()
        },
        success: function () {
            searchQuestion();
        },
        error: function (data) {
            if (JSON.stringify(data['responseText']).search('Role') !== -1)
                alert(JSON.stringify(data['responseText']));
            else
                alert(JSON.stringify(data));
        }
    })
}

function searchQuestion() {
    $("article", "#list").remove();
    var name = $("#searchBtn").val();
    $.ajax({
        async: false,
        url: 'https://quiz-shm.herokuapp.com/api/questions',
        headers: {'x-access-token': window.localStorage.getItem("token")},
        contentType: "application/x-www-form-urlencoded",
        data: {reuirements: name},
        success: function (data) {
            console.log(data);
            var row = "";
            $.each(data, function (index, item) {
                row = '<article>' + '<p style="display: none">' +
                    item._id + '</p>' + '<h3 class="question-name">' +
                    item.requirements +
                    '</h3><h4 class="question-role">' + "Technology: " +
                    item.technology + '</h4>' + '<h4 class="question-role">' + "Difficulty: " +
                    item.difficultyLevel + "</h4><button id=deleteButton> Delete " +
                    '</button><button id=updateButton onclick="showUpdateModal(\'' + item._id + '\')"> ' +
                    "Update </button></article >";
                $("#list").append(row);
            });
        },
        error: function () {
            console.log("BAD SHIT");
        }
    });
}

function populateSelectTechnologies() {
    var select = document.getElementById("technology");
    $.ajax({
        url: 'https://quiz-shm.herokuapp.com/api/technologies',
        headers: {'x-access-token': window.localStorage.getItem("token")},
        success: function (data) {
            for (var i in data) {
                var option = document.createElement("option");
                option.innerHTML = data[i]['name'];
                option.value = data[i]['_id'];
                select.appendChild(option);
            }
        },
        error: function () {
            console.log("BAD SHIT");
        }
    });
}

function populateSelectDifficulties() {
    var select = document.getElementById("difficulty");
    $.ajax({
        url: 'https://quiz-shm.herokuapp.com/api/difficulties',
        headers: {'x-access-token': window.localStorage.getItem("token")},
        success: function (data) {
            for (var i in data) {
                var option = document.createElement("option");
                option.innerHTML = data[i]['name'];
                option.value = data[i]['_id'];
                select.appendChild(option);
            }
        },
        error: function () {
            console.log("BAD SHIT");
        }
    })
}

$(document).ready(function () {
    searchQuestion();
    populateSelectTechnologies();
    populateSelectDifficulties();
    $('#submit').on('click', function () {
        addQuestion();
    });
    $('#searchBtn').keyup(function () {
        searchQuestion();
    });
    $("#list").on("click", 'article #deleteButton', function () {
        var id = $(this).parent().find('p')[0].innerText;
        var token = window.localStorage.getItem("token");
        $.ajax({
            url: 'https://quiz-shm.herokuapp.com/api/questions/' + id,
            method: "DELETE",
            headers: {'x-access-token': token},
            contentType: "application/x-www-form-urlencoded",
            data: {id: id},
            success: function () {
                $(this).parent().remove();
                searchQuestion();
            },
            error: function (data) {
                alert("Failed to delete, check console");
                alert(data);
            }
        });
    });
});
