// SMOOTH SCROLL FUNCTION
$(function() {
    smoothScroll(700);
});

function smoothScroll(duration) {
    $('a[href^="#"]').on('click', function (event) {
        var target = $($(this).attr('href'));

        if (target.length) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top
            }, duration);
        }
    });
}

// MOBILE NAV SIDEBAR
$('.menu').on('click', function() {
    event.preventDefault();
    $('.mobile__links').show().animate({right: '0px'}, 500);
});

$('.mobile__close').on('click', function() {
    $('.mobile__links').animate({right: '-420px'}, 500);
});

$('a[href^="#"]').on('click', function() {
    $('.mobile__links').hide().animate({right: '-420px'});
});