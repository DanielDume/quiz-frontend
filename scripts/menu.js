$(document).ready(function () {
  $('#header-icon').click(function (e) {
    e.preventDefault();
    $('body').toggleClass('with-sidebar');
  });

  $('#site-cache').click(function (e) {
    $('body').removeClass('with-sidebar');
  });
});
