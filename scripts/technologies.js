



$('#submit').on('click',function () {

    addTechnology();
});

function addTechnology() {
    var name = $("#technologies").val();

    $.ajax({
        url: "https://quiz-shm.herokuapp.com/api/technologies",
        contentType: "application/x-www-form-urlencoded",
        dataType: 'json',
        method: "POST",
        data: {"name":name},
        beforeSend: function(xhr){
            xhr.setRequestHeader("X-Auth-Token", window.localStorage.getItem("token"));
        },
        success: function (data) {
            console.log(data.message);
        },
        error: function(){
            console.log('Error');
        }
    });

}

$('#searchBtn').keyup(function () {

    searchTechnology();
});
function searchTechnology() {
    var name = $("#searchBtn").val();

    $.ajax({
        url: "https://quiz-shm.herokuapp.com/api/technologies?name=" + name,
        contentType: "application/json",
        dataType: 'json',
        authorization: window.localStorage.getItem("token"),
        method: "GET",
        beforeSend: function(xhr){
            xhr.setRequestHeader("X-Auth-Token", window.localStorage.getItem("token"));
        },
        success: function (data) {
            console.log(data.message);
        },
        error: function(){
            console.log('Error');
        }
    });

}