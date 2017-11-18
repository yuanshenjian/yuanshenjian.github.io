$(document).ready(function () {
  generateRightPostNavigation();
  enablePostTocToggle();
});

function generateRightPostNavigation() {
  if (typeof $('#markdown-toc').html() === 'undefined') {
    $('.post-toc').hide();
  } else {
    $('.post-toc .content').html('<ul>' + $('#markdown-toc').html() + '</ul>');
  }
}

function enablePostTocToggle(){
  $(window).scroll(function () {
    var toc = $(".post-content #markdown-toc");
    if ($(window).scrollTop() > toc.position().top + toc.height()) {
      $(".sidebar").fadeOut(950);
      $("#content-navigation").css("display", "block");
    } else {
      $("#content-navigation").css("display", "none");
      $(".sidebar").fadeIn(950);
    }
  });
}
