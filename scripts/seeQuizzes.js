function getQuizzes() {
    $.ajax({
        url: server_url + '/api/quiz/',
        headers: {'x-access-token': window.localStorage.getItem("token")},
        contentType: "application/json",
        success: function (data) {
            alert(JSON.stringify(data));
            if (data.hasOwnProperty("message")) {
                if (data.message === "You do not have any quizzes assigned.") {
                    document.getElementById("list").innerHTML = "<h1>There are no quizzes assigned to you!</h1>";
                }
            }
            else {
                $.each(data, function (index, item) {
                    var status;
                    if (item.completed) {
                        status = "Completed!";
                    }
                    else {
                        if (item.hasOwnProperty("startTimestamp")) {
                            status = "Started!";
                        }
                        else {
                            status = "Not started yet!"
                        }
                    }
                    var row = '<article>' + '<p style="display: none">' + item._id + '</p>' +
                        '<h3 class="user-name">Assignee: ' + item.assignee.firstName + " " + item.assignee.lastName + '</h3>' +
                        '<h3 class="user-name">Time: ' +
                        Math.round(item.timeToAnswer / 60) + ' minutes ' + item.timeToAnswer % 60 +
                        ' seconds</h3><h4 class="user-role">' + status + '</h4>';

                    if (item.completed) {
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

getQuizzes();
