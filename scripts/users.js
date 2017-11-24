


$('#submit').on('click',function () {
    adduser();
});

function adduser() {
    var name = $("#name").val();
    var role = $("#role").val();
    var email = $("#email").val();
    $.ajax({
        url: "https://quiz-shm.herokuapp.com/sign_in",
        contentType: "application/x-www-form-urlencoded",
        // dataType: 'json',
        method: "POST",
        data: {"username":username, "password":password},
        success: function (data) {
            window.localStorage.setItem("token", data['token']);
            console.log("Login success");
            go_to_html_main_menu();
        },
        error: function(){
            console.log('Error');
        }
    })

}