console.log("hello bitches");
$("#loginBtn").on("click", function () {
    authenticate();
});

function authenticate() {
    var username = $("#usernameInput").val();
    var password = $("#passwordInput").val();
    $.ajax({
        url: "https://quiz-shm.herokuapp.com/sign_in",
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