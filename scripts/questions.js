$(document).ready(function () {
    $('input[type=radio][name="quizType"]').change(function () {
        if (this.value === 'quizRadio') {
            $("#quizInput").show();
            $("#questionInput").hide();
            $("#mapInput").hide();
        }
        if (this.value === 'questionRadio') {
            $("#quizInput").hide();
            $("#questionInput").show();
            $("#mapInput").hide();
        }
        if (this.value === 'mapRadio'){
            $("#quizInput").hide();
            $("#questionInput").hide();
            $("#mapInput").show();
        }
    });
});