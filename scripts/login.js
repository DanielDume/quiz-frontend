var server_url = server_url + '";

$("#loginBtn").on("click", function () {
    authenticate();
});

$(document).keypress(function(e) {
    if(e.which === 13) {
        $("#loginBtn").click();
    }
});

function authenticate() {
    var username = $("#usernameInput").val();
    var password = $("#passwordInput").val();
    $.ajax({
        url: server_url + '/sign_in',
        contentType: "application/x-www-form-urlencoded",
        method: "POST",
        data: {"username": username, "password": password},
        success: function (data) {
            window.localStorage.setItem("token", data['token']);
            console.log("Login success");
            go_to_html_main_menu();
        },
        error: function () {
            console.log('Error');
        }
    })
}

function go_to_html_main_menu() {
    window.location.href = "index.html";
}