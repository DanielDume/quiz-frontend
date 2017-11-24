$(document).ready(function () {
    searchUser();
    $('#submit').on('click', function () {
        addUser();
        searchUser();
    });
    $('#searchBtn').keyup(function () {
        searchUser();
    });
    $("#list").on("click", 'article #deleteButton', function (e) {
        var id = $(this).parent().find('p')[0].innerText;
        var token = window.localStorage.getItem("token");
        $.ajax({
            url: 'https://quiz-shm.herokuapp.com/api/users/' + id,
            method: "DELETE",
            headers: { 'x-access-token': token },
            data: { id: id },
            success: function (data) {
                $(this).parent().remove();
                searchUser();
            },
            error: function () {
                alert("Failed to delete, check console");
                console.log("BAD SHIT");
            }
        });
    });

    function addUser() {
        console.log("ENTERED ADD");
        var token = window.localStorage.getItem("token");
        var username = $("#username").val(), firstName = $("#firstName").val(), lastName = $("#lastName").val(), email = $("#email").val(), password = $("#password").val();
        console.log(username, firstName, lastName, email, password);
        $.ajax({
            url: 'https://quiz-shm.herokuapp.com/api/users',
            method: "POST",
            headers: { 'x-access-token': token },
            data: { username: username, firstName: firstName, lastName: lastName, email: email, password: password }, // put shit here
            success: function (data) {
                $("#username").val(""); $("#firstName").val(""); $("#lastName").val(""); $("#email").val(""); $("#password").val("");
                console.log(data);
            },
            error: function () {
                console.log("BAD SHIT");
            }
        });

    };

    function searchUser() {
        $("article", "#list").remove();
        var name = $("#searchBtn").val();
        var token = window.localStorage.getItem("token");
        $.ajax({
            url: 'https://quiz-shm.herokuapp.com/api/users',
            headers: { 'x-access-token': token },
            data: {firstName: name},
            success: function (data) {
                console.log(data);
                var row = "";
                $.each(data, function (index, item) {
                    row = '<article>' + '<p style="display: none">' + item._id + '</p>' + '<h3 class="user-name">' + item.firstName + ' ' + item.lastName + '</h3><h4 class="user-role">' + item.username + '</h4>' + '<h4 class="user-role">' + item.role + '</h4><button id=deleteButton> Detele </button><button id=updateButton> Update </button></article>'
                    $("#list").append(row);
                });
            },
            error: function () {
                console.log("BAD SHIT");
            }
        });

    };

})
