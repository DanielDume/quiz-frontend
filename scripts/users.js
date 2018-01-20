document.getElementById('account-button').innerHTML = window.localStorage.user_firstName;

var server_url = "https://quiz-shm.herokuapp.com";
var current_user;
var update_id;

function showUpdateModal(id) {
    getUser(id);
    document.getElementById("firstNameUpdate").value = current_user.firstName;
    document.getElementById("lastNameUpdate").value = current_user.lastName;
    document.getElementById("emailUpdate").value = current_user.email;
    document.getElementById("roleUpdate").value = current_user.role;
    var modal = document.getElementById("myModal");
    modal.style.visibility = "visible";
    update_id = id;
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
            if (JSON.stringify(data['responseJSON']['errors']))
                alert(JSON.stringify(data['responseJSON']['errors']));
            else if (JSON.stringify(data['responseJSON']['message']).search('duplicate') !== -1)
                alert("This user already exists! Please choose other username!");
            else {
                alert(JSON.stringify(data));
                alert("Please enable CORS plugin!");
            }
        }
    });
}

function updateUserRequest(id) {
    var password = $("#passwordUpdate").val();
    var json = {
        "firstName": $("#firstNameUpdate").val(),
        "lastName": $("#lastNameUpdate").val(),
        "email": $("#emailUpdate").val(),
        "role": $("#roleUpdate").val()
    };
    if (password !== "") {
        json["password"] = password;
    }
    $.ajax({
        url: server_url + '/api/users/' + id,
        method: "PUT",
        headers: {'x-access-token': window.localStorage.getItem("token")},
        contentType: "application/x-www-form-urlencoded",
        data: json,
        success: function () {
            searchUser();
        },
        error: function (data) {
            if (JSON.stringify(data['responseText']).search('Role') !== -1)
                alert(JSON.stringify(data['responseText']));
            else {
                alert(JSON.stringify(data));
                alert("Please enable CORS plugin!");
            }
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
                    item.username + '</h4>' + '<h4 class="user-role">' + item.role;
                if ((!(window.localStorage.getItem("user_role") === "HR") || !(item.role === "ADMIN"))
                    && (item.role !== "OWNER")) {
                    row += "</h4><button id=deleteButton> Delete " +
                        '</button><button id=updateButton onclick="showUpdateModal(\'' + item._id + '\')"> ' +
                        "Update </button></article >";
                }
                $("#list").append(row);

            });
        },
        error: function () {
            console.log("error");
            alert("Please enable CORS plugin!");
        }
    });
}

function getUser(id) {
    $.ajax({
        async: false,
        url: server_url + '/api/users/' + id,
        headers: {'x-access-token': window.localStorage.getItem("token")},
        contentType: "application/x-www-form-urlencoded",
        data: {},
        success: function (data) {
            current_user = data;
        },
        error: function (data) {
            console.log("error");
            alert(JSON.stringify(data));
            return null;
        }
    });
}

$(document).ready(function () {
    if (window.localStorage.getItem("user_role") === "ADMIN") {
        var select = document.getElementById("roleAdd");
        var option1 = document.createElement("option");
        var option2 = document.createElement("option");
        option1.innerHTML = "HR";
        option1.value = "HR";
        option2.innerHTML = "Admin";
        option2.value = "ADMIN";
        select.appendChild(option1);
        select.appendChild(option2);

        select = document.getElementById("roleUpdate");
        option1 = document.createElement("option");
        option2 = document.createElement("option");
        option1.innerHTML = "HR";
        option1.value = "HR";
        option2.innerHTML = "Admin";
        option2.value = "ADMIN";
        select.appendChild(option1);
        select.appendChild(option2);
    }
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
        $.ajax({
            url: server_url + '/api/users/' + id,
            method: "DELETE",
            headers: {'x-access-token': window.localStorage.getItem("token")},
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
