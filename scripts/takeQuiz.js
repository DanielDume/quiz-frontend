var server_url = "https://quiz-shm.herokuapp.com";
var questions_list = [];
var counter = 0;
var current_quiz_id = window.localStorage.getItem("current_quiz_id");

var seconds_left = 10;
var interval = setInterval(function() {
    document.getElementById('timer_div').innerHTML = --seconds_left;

    if (seconds_left <= 0)
    {
        document.getElementById('timer_div').innerHTML = 'You are ready';
        clearInterval(interval);
    }
}, 1000);

function getQuestions() {
    var list = $("#list");
    $.ajax({
        url: server_url + "/api/quiz/take/" + current_quiz_id,
        headers: {'x-access-token': window.localStorage.getItem("token")},
        contentType: "application/json",
        method: "GET",
        success: function (data) {
            $.each(data.questions, function (index, item) {
                var counter2 = 0;
                var row = '<article id="question' + item._id + '">' + '<p style="display: none">' +
                    item._id + '</p>' + '<h3 class="user-name">Question: ' + item.requirements;
                for (var i in item.answers) {
                    row += '<h4 id="answer' + item._id + "_" + counter2.toString() + '" style="display: inline-block">' + item.answers[i] + '</h4>';
                    row += '<input id="answerCheckBox' + item._id + "_" + counter2.toString() + '" type="checkbox">';
                    row += '<br/>';
                    counter2++;
                }
                questions_list.push(item);
                list.append(row);
                counter++;
            });
            list.append("<button id=\"submit\" onclick=\"submitAnswers()\">Submit</button>\n");
            list.append("<div id='timer_div'></div>")
        },
        error: function (data) {
            alert(JSON.stringify(data));
        }
    })
}

function submitAnswers() {
    var json = [];
    for (var i in questions_list) {
        var answers = [];
        for (var j in questions_list[i].answers) {
            if (document.getElementById("answerCheckBox" + questions_list[i]._id + "_" + j.toString()).checked)
                answers.push(document.getElementById("answer" + questions_list[i]._id + "_" + j.toString()).innerText)
        }
        json.push({"id": questions_list[i]._id, "answers": answers})
    }
    $.ajax({
        url: server_url + "/api/quiz/submit/" + current_quiz_id,
        headers: {'x-access-token': window.localStorage.getItem("token")},
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify(json),
        success: function (data) {
            console.log(data);
            window.location.href = "seeQuizzesExaminee.html";
        },
        error: function (data) {
            console.log(JSON.stringify(data));
            alert(data);
        }
    });
}

getQuestions();