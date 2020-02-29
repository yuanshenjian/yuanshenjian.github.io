$(document).ready(function () {
  generatePostNavigation();
  enableTocToggle();
  initTocStatus();
});


function generatePostNavigation() {
  if (typeof $('#markdown-toc').html() === 'undefined') {
    $('.post-toc').hide();
  } else {
    $('.post-toc .content').html('<ul>' + $('#markdown-toc').html() + '</ul>');
  }
}

function enableTocToggle() {
  if ($(window).width() > 960) {
    $(window).scroll(function () {
      var toc = $(".post-content #markdown-toc");
      if (!toc.position()) {
        toc = $(".archive-toc-top");
        $(".archive-toc").css("display", "block");
      }
      if (toc && toc.position()) {
        if ($(window).scrollTop() > toc.position().top + toc.height()) {
          $(".sidebar").fadeOut(950);
          $(".post-toc").css("display", "block");
          $(".archive-toc").css("display", "block");
        } else {
          $(".sidebar").fadeIn(950);
          $(".post-toc").css("display", "none");
          $(".archive-toc").css("display", "none");
        }
      }
      if ($(window).width() <= 960) {
        $(".post-toc").css("display", "none");
        $(".archive-toc").css("display", "none");
      }
    });
  }
}

function initTocStatus() {
  registerClick($(".archive-toc a"));
  registerClick($(".post-toc .content a"));

  $(window).scroll(function () {
    if ($(window).width() > 960) {
      registerAutoSelected($(".archive-toc a"), $(".archive-content :header"));
      registerAutoSelected($(".post-toc .content a"), $(".post-content :header"));
    }
  });
}

function registerAutoSelected(toc, headers) {
  var newHeaders = [];
  headers.each(function (index, each) {
    if (each.tagName.toUpperCase() === 'H2' || each.tagName.toUpperCase() === 'H3')
      newHeaders.push(each);
  })
  var scrollIndex = calculateCurrentPosition(newHeaders);
  setSelectedStatus(toc, scrollIndex);
}

function calculateCurrentPosition(headers) {
  for (var index = headers.length - 1; index >= 0; index--) {
    var currentTop = headers[index].offsetTop - $(document).scrollTop();
    if (currentTop <= 10) {
      return index;
    }
  }
  return -1;
}

function setSelectedStatus(toc, scrollIndex) {
  if (scrollIndex >= 0) {
    toc.each(function (index, each) {
      if (scrollIndex === index) {
        each.id = 'selected';
      } else {
        each.id = 'unselected';
      }
    });
  }
}

function registerClick(component) {
  component.click(function (obj) {
    var target = obj.target;
    component.each(function (index, each) {
      each.id = 'unselected';
    });
    target.id = 'selected';
  });
}

