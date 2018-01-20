document.getElementById('account-button').innerHTML = window.localStorage.user_firstName;

var server_url = "http://quiz-shm.herokuapp.com";

$(document).ready(function () {
    $('#header-icon').click(function (e) {
        e.preventDefault();
        $('body').toggleClass('with-sidebar');
    });

    $('#site-cache').click(function () {
        $('body').removeClass('with-sidebar');
    });
    try_authenticate();
});

function try_authenticate() {
    $.ajax({
        async: false,
        url: server_url + "/api",
        method: "GET",
        contentType: "application/x-www-form-urlencoded",
        headers: {'x-access-token': window.localStorage.getItem("token")},
        success: function () {
            console.log("Success")
        },
        error: function () {
            console.log("Error");
            go_to_login();
        }
    })
}

function go_to_login() {
    window.location.href = "login.html";
}