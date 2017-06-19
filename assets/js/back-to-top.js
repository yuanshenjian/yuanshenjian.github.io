$(document).ready(function () {
    $(window).scroll(function () {
        if ($(window).scrollTop() > 200) {
            $("#back-to-top").fadeIn(500);
            $("#search").css("bottom", "60px")

        } else {
            $("#back-to-top").fadeOut(500);
            $("#search").css("bottom", "10px")
        }
    });

    $("#back-to-top").click(function () {
        $("body,html").animate({
            scrollTop: "0"
        }, 500);
    });
});