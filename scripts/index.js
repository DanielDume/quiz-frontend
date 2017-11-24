var url = "http://quiz-shm.herokuapp.com";


// TODO; to be investicated
/*window.onload = function () {
    try_authenticate();
}*/


function try_authenticate(){
    $.ajax({
        url: url + "/",
        method: "GET",
        contentType: "application/x-www-form-urlencoded",
        beforeSend: function(xhr){
            xhr.setRequestHeader("X-Auth-Token", window.localStorage.getItem("token"));
        },
        success: function(){
            console.log("Success")
        },
        error: function(){
            console.log("Error");
            go_to_login();
        }
    })
}

function go_to_login(){
    window.location.href = "login.html";
}