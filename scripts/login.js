var server_url = "https://quiz-shm.herokuapp.com";

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
            var role = "ADMIN";
            window.localStorage.setItem("token", data['token']);
            window.localStorage.setItem("user_role", role);
            window.localStorage.setItem("user_email", "flo@kuende.com");
            window.localStorage.setItem("user_id", "1");
            console.log("Login success");
            go_to_html_main_menu(role);
        },
        error: function (data) {
            console.log('Error');
            alert(JSON.stringify(data));
        }
    })
}

function go_to_html_main_menu(role) {
    if(role === "ADMIN" || role === "HR")
        window.location.href = "index.html";
    if(role === "EXAMINEE")
        window.location.href = "indexExaminee.html";
    if(role === "TECHNICAL RECRUITER")
        window.location.href = "indexTechnicalRecruiter.html";
}