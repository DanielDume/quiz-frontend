function getQuizzes() {
    $.ajax({
        url: server_url + '/api/quiz/mine',
        headers: {'x-access-token': window.localStorage.getItem("token")},
        contentType: "application/json",
        success: function (data) {
            if(data.hasOwnProperty("message")){
                if(data.message === "You do not have any quizzes assigned."){
                    document.getElementById("list").innerHTML = "<h1>There are no quizzes assigned to you!</h1>";
                }
            }
            else{
                $.each(data, function (index, item) {
                    var status;
                    if(item.completed){
                        status = "Completed!";
                    }
                    else {
                        if(item.hasOwnProperty("startTimestamp")){
                            status = "Started!";
                        }
                        else{
                            status = "Not started yet!"
                        }
                    }
                    var row = '<article>' + '<p style="display: none">' +
                        item._id + '</p>' + '<h3 class="user-name">Time: ' +
                        Math.round(item.timeToAnswer/60) + ' minutes ' + item.timeToAnswer%60 + ' seconds</h3><h4 class="user-role">' + status + '</h4>';

                    if (!item.completed) {
                        if(item.hasOwnProperty("startTimestamp")) {
                            row += "<button id='takeQuizButton' onclick='goToTakeQuiz(\"" + item._id + "\")'> Take Quiz </button>";
                        }
                        else
                            row += "<button id='takeQuizButton' onclick='startQuiz(\"" + item._id + "\")'> Take Quiz </button>";
                    }

                    else{
                        row += '<h4 class="user-role">Score: ' + item.score;
                    }
                    $("#list").append(row);
                });
            }

        },
        error: function () {
            console.log("error");
        }
    })
}

function goToTakeQuiz(id){
    window.localStorage.setItem("current_quiz_id", id);
    window.location.href = "takeQuiz.html";
}

function startQuiz(id){
    $.ajax({
        url: server_url + '/api/quiz/take/' + id,
        headers: {'x-access-token': window.localStorage.getItem("token")},
        contentType: "application/json",
        method: "POST",
        success: function(data){
            goToTakeQuiz(id);
        },
        error: function(data){
            console.log("error");
            alert(JSON.stringify(data));
        }
    });
}
$(document).ready(function () {
    getQuizzes();
});
