var server_url = "https://quiz-shm.herokuapp.com";

try_authenticate();

function showUpdateModal(id) {
    var modal = document.getElementById("myModal");
    modal.style.visibility = "visible";
    document.getElementById("aidi").innerHTML = id;

}

function hideUpdateModal() {
    document.getElementById("myModal").style.visibility = "hidden";
}

function addUser() {
    console.log("ENTERED ADD");
    var username = $("#usernameAdd").val(), firstName = $("#firstNameAdd").val(), lastName = $("#lastNameAdd").val(),
        email = $("#emailAdd").val(), password = $("#passwordAdd").val(), role = $("#roleAdd").val();
    console.log(username, firstName, lastName, email, password, role);
    $.ajax({
        url: server_url + '/api/users',
        method: "POST",
        headers: {'x-access-token': window.localStorage.getItem("token")},
        contentType: "application/x-www-form-urlencoded",
        data: {
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            role: role
        },
        success: function (data) {
            console.log(data);
        },
        error: function (data) {
            if(JSON.stringify(data['responseJSON']['errors']))
                alert(JSON.stringify(data['responseJSON']['errors']));
            else
                if(JSON.stringify(data['responseJSON']['message']).search('duplicate') !== -1)
                    alert("This user already exists! Please choose other username!");
                else
                    alert(JSON.stringify(data));
        }
    });
}

function updateUserRequest(id) {
    var token = window.localStorage.getItem("token");
    $.ajax({
        url: server_url + '/api/users/' + id,
        method: "PUT",
        headers: {'x-access-token': token},
        contentType: "application/x-www-form-urlencoded",
        data: {
            firstName: $("#firstNameUpdate").val(), lastName: $("#lastNameUpdate").val(), email: $("#emailUpdate").val(),
            password: $("#passwordUpdate").val(), role: $("#roleUpdate").val()
        },
        success: function () {
            searchUser();
        },
        error: function (data) {
            if(JSON.stringify(data['responseText']).search('Role') !== -1)
                alert(JSON.stringify(data['responseText']));
            else
                alert(JSON.stringify(data));
        }
    })
}

function searchUser() {
    $("article", "#list").remove();
    var name = $("#searchBtn").val();
    $.ajax({
        async: false,
        url: server_url + '/api/users',
        headers: {'x-access-token': window.localStorage.getItem("token")},
        contentType: "application/x-www-form-urlencoded",
        data: {firstName: name},
        success: function (data) {
            console.log(data);
            var row = "";
            $.each(data, function (index, item) {
                row = '<article>' + '<p style="display: none">' +
                    item._id + '</p>' + '<h3 class="user-name">' +
                    item.firstName + ' ' + item.lastName +
                    '</h3><h4 class="user-role">' +
                    item.username + '</h4>' + '<h4 class="user-role">' +
                    item.role + "</h4><button id=deleteButton> Delete " +
                    '</button><button id=updateButton onclick="showUpdateModal(\''+item._id+'\')"> ' +
                    "Update </button></article >";
                $("#list").append(row);
            });
        },
        error: function () {
            console.log("error");
        }
    });
}

$(document).ready(function () {
    searchUser();
    $('#submit').on('click', function () {
        addUser();
        searchUser();
    });
    $('#searchBtn').keyup(function () {
        searchUser();
    });
    $("#list").on("click", 'article #deleteButton', function () {
        var id = $(this).parent().find('p')[0].innerText;
        var token = window.localStorage.getItem("token");
        $.ajax({
            url: server_url + '/api/users/' + id,
            method: "DELETE",
            headers: {'x-access-token': token},
            contentType: "application/x-www-form-urlencoded",
            data: {id: id},
            success: function () {
                $(this).parent().remove();
                searchUser();
            },
            error: function (data) {
                alert("Failed to delete, check console");
                alert(data);
            }
        });
    });
});
