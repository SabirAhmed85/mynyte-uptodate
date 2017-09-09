function showMenu () {
    $('#header-bar .top-logo-container ul.main').addClass("show");
}
function hideMenu () {
    $('#header-bar .top-logo-container ul.main').removeClass("show");
}

function toggleQuickContact () {
    var elem = $('.header-contact-section');
    if (elem.hasClass("open")) {
        elem.removeClass("open");
    } else {
        elem.addClass("open");
    }
}

function showSubMenu (button) {
    var className = $(button).data('class');
    var elem = $('ul.' + className);

    if (elem.hasClass("show")) {
        $(button).find('i').removeClass("fa-sort-asc").addClass("fa-sort-desc");
        $('ul.' + className).removeClass("show");
    } else {
        $(button).find('i').removeClass("fa-sort-desc").addClass("fa-sort-asc");
        $('ul.' + className).addClass("show");
    }
    
}

function showFullList (button) {
    var list = $(button).parents('.main-package-container');

    if (list.hasClass("show")) {
        list.removeClass("show");
        $(button).find('span').html('Show All Features');
        $(button).find('i').removeClass("fa-angle-up").addClass("fa-angle-down");
    } else {
        $(button).find('span').html('Show Fewer Features');
        $(button).find('i').removeClass("fa-angle-down").addClass("fa-angle-up");
        list.addClass("show");
    }
}

function contactMyDay (button, e) {
    e.preventDefault();
    var form = $(button).parents('form');
    var container = form.parents('.contact-section');
    
    var name = form.find('input[name="Name"]').val();
    var email = form.find('input[name="Email"]').val();
    var phone = form.find('input[name="Phone"]').val();
    var company = form.find('input[name="Company"]').val();
    var message = form.find('textarea[name="Message"]').val();
    var format = (container.hasClass('header-contact-section')) ? 'Quick Quote': 'Main Contact';
    var error = false;
    var emailRegExp = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    
    form.find('button').attr("disabled", true);
    form.find('input').siblings('.error-span').removeClass('show');
    form.find('textarea').siblings('.error-span').removeClass('show');
    container.find('.header-contact-inner-top').addClass('hide');
    
    $("body, html").animate({ 
      scrollTop: form.offset().top - $('#header-bar').height() - 25
    }, 600);
    
    if (name == '' || !/^[a-zA-Z ]+$/.test(name)) {
        form.find('input[name="Name"]').siblings('.error-span').addClass('show');
        error = true;
    }
    if (email == '' || !emailRegExp.test(email)) {
        form.find('input[name="Email"]').siblings('.error-span').addClass('show');
        error = true;
    }
    if (phone != '' && !/^[0-9]+$/.test(phone)) {
        form.find('input[name="Phone"]').siblings('.error-span').addClass('show');
        error = true;
    }
    if (message == '') {
        form.find('textarea[name="Message"]').siblings('.error-span').addClass('show');
        error = true;
    }
    
    if (!error) {
        $.ajax({
          type: "POST",
          url: 'https://www.mynyte.co.uk/staging/sneak-preview/data/functions/email.php?action=contactMyDay',
          data: {Name: name, Email: email, Phone: phone, Company: company, Message: message, Format: format},
          success: function (successData) {
            successData = successData.replace(/"/g, '');

            if (successData.indexOf('Email Successfully sent') == 0) {
                form.find('.success-span').addClass('show');
                form.find('.main-error-span').removeClass('show');
                form.find('button').attr("disabled", true);
                form.find('input').attr("disabled", true);
                form.find('textarea').attr("disabled", true);
            }
            else {
                form.find('button').attr("disabled", false);
            }
          },
          error: function (errorData) {
            console.log("Error: ", errorData);
            form.find('button').attr("disabled", false);
          }
        });
    }
    else {
        form.find('.main-error-span').addClass('show');
        form.find('button').attr("disabled", false);
    }
}

$(function () {
    var contactUsTileTop, contactUsTileBottom, prodInfoTile, prodInfoTileTop, widgetTilesTop;
  
    function detectmob() { 
         if( navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)
         ){
            return true;
         }
         else {
            return false;
         }
    }
  
    if (!detectmob()) {
        $('.header-img').addClass('back-fixed');
    }
  
    if ($(".product-info").length) {
        prodInfoTile = $(".product-info");
        prodInfoTileTop = prodInfoTile.position().top;
    }
    if ($(".our-services").length) {
        widgetTilesTop = $(".our-services").position().top;
    }
  
    window.setTimeout(function () {
        $(window).scroll(function (event) {
            var scroll = $(window).scrollTop();
            var scrollFactor = scroll;
            // Do something
            if (scroll > 130) {
                $(".initial-header-bar").removeClass("with-margin");
                $(".header-img").removeClass("at-top");
            } else {
                $(".initial-header-bar").addClass("with-margin");
                $(".header-img").addClass("at-top");
            }
            
            if (scroll <= 140 && $(".header-img .header-inner-wrap").length) {
                $(".header-img .header-inner-wrap").css('opacity',(0.55 + ((0.01)*(scroll/5))) );
                $(".header-img i").css('opacity',1 - (scroll/140));
                $(".header-img h1").css('opacity',1 - (scroll/140));
            }
            
            if ($(".our-services").length) {
                var topFactor = 0.9;
                var elem = $(".our-services");
                console.log(scroll, scrollFactor, $(window).height());
                if (elem.hasClass("short-page-services")) {
                    topFactor = 0.6;
                }
                if (scrollFactor > (widgetTilesTop*topFactor) && !$(".widget-prod-tiles").hasClass("show")) {
                    $(".widget-prod-tiles").addClass("show");
                }
            }
            
            if ($(".product-info").length && scrollFactor > (prodInfoTileTop*1) && !$(".text-img-left").hasClass("show")) {
                $(".text-img-left, .text-img-center, .text-img-right").addClass("show");
            }
            
        });
    
        $('.page-container').addClass('show');
        $('#loader').addClass('hide');
    }, 1000);
  
  
  
});
