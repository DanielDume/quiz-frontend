function showUpdateModal() {
    document.getElementById("myModal").style.visibility = "visible";
}

function hideUpdateModal() {
    document.getElementById("myModal").style.visibility = "hidden";
}

function addDifficultyLevel() {
    console.log("ENTERED ADD");
    var token = window.localStorage.getItem("token");
    var name = $("#name").val();
    $.ajax({
        url: 'https://quiz-shm.herokuapp.com/api/difficulties',
        method: "POST",
        headers: { 'x-access-token': token },
        data: { name: name },
        success: function (data) {
            $("#name").val("");
            console.log(data);
            searchDifficultyLevel();
        },
        error: function () {
            console.log("BAD SHIT");
        }
    });
}

function searchDifficultyLevel() {
    $("article", "#list").remove();
    var name = $("#searchBtn").val();
    var token = window.localStorage.getItem("token");
    $.ajax({
        url: 'https://quiz-shm.herokuapp.com/api/difficulties',
        headers: { 'x-access-token': token },
        data: {name: name},
        success: function (data) {
            var row = "";
            $.each(data, function (index, item) {
                if (name === '' || item.name.startsWith(name)) {
                    row = '<article><h3 class="difLevel-name">' + item.name +
                        '</h3><p style="display: none">' + item._id +
                        "</p><button id=deleteButton> Detele </button><button id=updateButton onclick='showUpdateModal(this)'> Update </button></article>";
                    $("#list").append(row);
                }
            });
        },
        error: function () {
            console.log("BAD SHIT");
        }
    });

}

$(document).ready(function () {
    searchDifficultyLevel();
    $('#submit').on('click', function () {
        addDifficultyLevel();
    });
    $('#searchBtn').keyup(function () {
        searchDifficultyLevel();
    });
    $("#list").on("click", 'article #deleteButton', function (e) {
        var id = $(this).parent().find('p')[0].innerText;
        var token = window.localStorage.getItem("token");
        $(this).parent().remove();
        $.ajax({
            url: 'https://quiz-shm.herokuapp.com/api/difficulties/' + id,
            method: "DELETE",
            headers: { 'x-access-token': token },
            success: function (data) {
                $(this).parent().remove();
                searchDifficultyLevel();
            },
            error: function () {
                alert("Failed to delete, check console");
                console.log("BAD SHIT");
            }
        });
    });
});
