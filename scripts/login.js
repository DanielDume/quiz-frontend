var url = "http://quiz-shm.herokuapp.com";
console.log("hello bitches");
$("#loginBtn").on("click",function () {
    authenticate();
});

function authenticate(){
    var username = $("#usernameInput").val();
    var password = $("#passwordInput").val();
    $.ajax({
        url: url + "/sign_in",
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify({"username":username, "password":password}),
        success: function (data) {
            window.localStorage.setItem("token", data['token']);
            go_to_html_main_menu();
        },
        error: function(){
            console.log('Bad credentials!');
            go_to_login();
        }
    })
}

function go_to_html_main_menu(){
    window.location.href = "index.html";
}

function go_to_login(){
    window.location.href = "login.html";
}
