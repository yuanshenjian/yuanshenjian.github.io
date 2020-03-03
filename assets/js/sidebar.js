$(document).ready(function () {
  if ($(window).width() > 960) {
    var sideBar = $('.sidebar');
    var imageUrl = '/assets/images/site/sidebar-' + sideBar.attr("type") + '.jpg';
    $.ajax({
      url: imageUrl
    }).done(function () {
      $('.sidebar').css({"background-image": "url('" + imageUrl + "')"});
    });
  }
});
