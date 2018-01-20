$(document).ready(function () {
    $('#header-icon').click(function (e) {
        e.preventDefault();
        $('body').toggleClass('with-sidebar');
    });

    $('#site-cache').click(function () {
        $('body').removeClass('with-sidebar');
    });
});
