var questions_list = [];
var current_quiz_id = window.localStorage.getItem("current_quiz_id");
var disponible_time;
var seconds_left;
var over = false;

setInterval(function () {
    document.getElementById('timer_div').innerHTML = "TIME LEFT: " + (--seconds_left).toString();
    if (seconds_left <= 0 && !over) {
        over = true;
        alert("Time is over!");
        submitAnswers();
    }
}, 1000);

function getQuestions() {
    var list = $("#list");
    $.ajax({
        async: false,
        url: server_url + "/api/quiz/take/" + current_quiz_id,
        headers: {'x-access-token': window.localStorage.getItem("token")},
        contentType: "application/json",
        method: "GET",
        success: function (data) {
            disponible_time = data.timeToAnswer;
            const currentDate = new Date();
            const startTimestamp = new Date(data.startTimestamp);
            const timeDifference = Math.round(Math.abs((currentDate.getTime() - startTimestamp.getTime()) / 1000));
            seconds_left = disponible_time - timeDifference;
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
            });
            list.append("<button id=\"submit\" onclick=\"submitAnswers()\">Submit</button>\n");
        },
        error: function (data) {
            if (data.hasOwnProperty("responseText")) {
                if (JSON.parse(data.responseText).message.search("time") !== -1) {
                    alert("Time is over!");
                    submitAnswers();
                }
            }
            else {
                alert(JSON.stringify(data));
            }
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
