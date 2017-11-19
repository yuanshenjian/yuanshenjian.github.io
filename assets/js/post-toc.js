$(document).ready(function () {
  generatePostNavigation();
  enablePostTocToggle();
});

function generatePostNavigation() {
  if (typeof $('#markdown-toc').html() === 'undefined') {
    $('.post-toc').hide();
  } else {
    $('.post-toc .content').html('<ul>' + $('#markdown-toc').html() + '</ul>');
  }
}

function enablePostTocToggle() {
  $(window).scroll(function () {
    if ($(window).width() > 960) {
      var toc = $(".post-content #markdown-toc");
      if ($(window).scrollTop() > toc.position().top + toc.height()) {
        $(".sidebar").fadeOut(950);
        $(".post-toc").css("display", "block");
      } else {
        $(".sidebar").fadeIn(950);
        $(".post-toc").css("display", "none");
      }
    }
  });
}
