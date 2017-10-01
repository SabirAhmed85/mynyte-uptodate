function showMenu () {
    console.log("no");
    $('#header-bar .top-logo-container ul.main').addClass("show");
}
function hideMenu () {
    $('#header-bar .top-logo-container ul.main').removeClass("show");
}

function showSubMenu (button) {
    var className = $(button).data('class');
    var elem = $('ul.' + className);
    console.log($(elem).data('class'));

    if (elem.hasClass("show")) {
        $(button).find('i').removeClass("fa-sort-asc").addClass("fa-sort-desc");
        $('ul.' + className).removeClass("show");
    } else {
        $(button).find('i').removeClass("fa-sort-desc").addClass("fa-sort-asc");
        $('ul.' + className).addClass("show");
    }
    
}

$(function () {
    var contactUsTileTop, contactUsTileBottom;
    console.log("hi");
    window.setTimeout(function () {
        $('.page-container').addClass('show');
        $('#loader').addClass('hide');
    }, 1000);
  
  
    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        var widgetTilesTop;
        // Do something
        if (scroll > 130) {
            $(".initial-header-bar").removeClass("with-margin");
            $(".header-img").removeClass("at-top");
        } else {
            $(".initial-header-bar").addClass("with-margin");
            $(".header-img").addClass("at-top");
        }
        
        widgetTilesTop = $(".our-services").position().top;
        if (scroll > (widgetTilesTop*0.9)) {
            $(".widget-prod-tiles").addClass("show");
        }
        
    });
});
