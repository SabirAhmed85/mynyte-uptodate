function createPopup(params) {
	var popupHtml = "";

	params.class = (params.class) ? ' ' + params.class : '';

	if ($('.mynyte-popup-cover').length == 0) {
		var div = $("<div/>").appendTo($('body'));
		div.attr('class', 'mynyte-popup-cover');
	}

	if (params.class == " menu-item-detail") {
		popupHtml = '<div class="mynyte-popup'+params.class+'">';
			popupHtml += '<div class="mn-popup-header">';
				popupHtml += '<h4 class="menu-item-title"></h4>';
				popupHtml += '<i class="fa fa-times mn-popup-close" onclick="MynyteApi.closePopup({});"></i>';
			popupHtml += '</div>';
			popupHtml += '<div class="mn-popup-body">';
				popupHtml += '<img src="#" alt=""/>';
				popupHtml += '<p class="menu-item-description">';
			popupHtml += '</div>';
		popupHtml += '</div>';
	}

	$('.mynyte-popup-cover').append(popupHtml);
}

function openPopup(params) {
	var speed = (params.speed == 'fast') ? 1: 250;
	lockScroll();
	disableScrolling();

	//Only for IOS
	if (navigator.userAgent.match(/(iP(od|hone|ad))/)) {   
		var offset = document.body.scrollTop;
		document.body.style.top = (offset * -1) + 'px';
		document.body.classList.add('mn-modal--opened');
	}

	window.setTimeout(
		function () {$('.mynyte-popup-cover').addClass("mynyte-popup-open");
	}, speed);

	if (params.onComplete) {
		params.onComplete();
	}
}

function closePopup(params) {
	$('.mynyte-popup-cover').removeClass("mynyte-popup-open");
	// un-lock scroll position
  	unlockScroll();
    enableScrolling();

	//IOS Only
	if (navigator.userAgent.match(/(iP(od|hone|ad))/)) {   
		var offset = parseInt(document.body.style.top, 10);
			document.body.classList.remove('mn-modal--opened');
			document.body.scrollTop = (offset * -1);
		}

}