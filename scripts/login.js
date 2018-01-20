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
            window.localStorage.setItem("token", data['token']);
            get_data_for_user();
            go_to_html_main_menu(window.localStorage.getItem("user_role"));
        },
        error: function (data) {
            console.log('Error');
            alert(JSON.stringify(data));
        }
    })
}

function get_data_for_user(){
    $.ajax({
        async:false,
        url: server_url + '/api/users/mine',
        contentType: "application/x-www-form-urlencoded",
        method: "GET",
        headers: {'x-access-token': window.localStorage.getItem("token")},
        success: function (data) {
            if(data.role === "OWNER") {
                window.localStorage.setItem("user_role", "ADMIN");
            }
            else{
                window.localStorage.setItem("user_role", data.role);
            }
            window.localStorage.setItem("user_email", data.email);
            window.localStorage.setItem("user_id", data.id);
            console.log("Login success");
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
    if(role === "RECRUITER")
        window.location.href = "indexTechnicalRecruiter.html";
}