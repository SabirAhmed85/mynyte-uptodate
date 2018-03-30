function createPopup(params) {
	var popupHtml = "";
	console.log(params);
	params.oldClass = params.class;
	params.class = (params.class) ? ' ' + params.class : '';

	if ($('.mynyte-popup-cover.'+params.oldClass).length == 0) {
		var div = $("<div/>").appendTo($('body'));
		div.attr('class', 'mynyte-popup-cover ' + params.oldClass);
	}

	if (params.class == " menu-item-detail") {
		popupHtml = '<div class="mynyte-popup'+params.class+'">';
			popupHtml += '<div class="mn-popup-header">';
				popupHtml += '<h4 class="menu-item-title"></h4>';
				popupHtml += '<i class="fa fa-times mn-popup-close" onclick="MynyteApi.closePopup({});"></i>';
			popupHtml += '</div>';
			popupHtml += '<div class="mn-popup-body">';
				popupHtml += '<img src="#" alt=""/>';
				popupHtml += '<p class="menu-item-description"></p>';
			popupHtml += '</div>';
		popupHtml += '</div>';
	}
	else if (params.class == " business-item-success") {
		popupHtml = '<div class="mynyte-popup'+params.class+'">';
			popupHtml += '<div class="mn-popup-header">';
				popupHtml += '<h4 class="menu-item-title">' + params.itemName + ' Uploaded</h4>';
				popupHtml += '<i class="fa fa-times mn-popup-close" onclick="MynyteApi.closePopup({});"></i>';
			popupHtml += '</div>';
			popupHtml += '<div class="mn-popup-body">';
				popupHtml += '<p>Your ' + params.itemName + ' has been successfully uploaded</p>';
				popupHtml += '<a class="button-link mynyte-button mynyte-button-secondary" target="_blank" href="' + params.itemLink + params._itemId +'">See your new ' + params.itemName + '</a>';
				popupHtml += '<button class="mynyte-button-primary mynyte-button" onClick="window.location.reload()">Upload another ' + params.itemName + '</button></p>';
			popupHtml += '</div>';
		popupHtml += '</div>';
	}
	else if (params.class == " simple-loader") {
		popupHtml = '<div class="mynyte-popup'+params.class+'">';
			popupHtml += '<div class="mn-popup-body">';
				popupHtml += '<i class="fa-' + params.iconClass + ' fa"></i>';
				popupHtml += '<p>' + params.message + '</p>';
			popupHtml += '</div>';
		popupHtml += '</div>';
	}

	$('.mynyte-popup-cover.'+params.oldClass).append(popupHtml);
}

function openPopup(params) {
	var speed = (params.speed == 'fast') ? 1: 250,
		className = (params.class) ? '.'+params.class: '';
	lockScroll();
	disableScrolling();

	//Only for IOS
	if (navigator.userAgent.match(/(iP(od|hone|ad))/)) {   
		var offset = document.body.scrollTop;
		document.body.style.top = (offset * -1) + 'px';
		document.body.classList.add('mn-modal--opened');
	}

	window.setTimeout(
		function () {$('.mynyte-popup-cover'+className).addClass("mynyte-popup-open");
	}, speed);

	if (params.onComplete) {
		params.onComplete();
	}
}

function closePopup(params) {
	var className = (params.class) ? '.'+params.class: '';
	$('.mynyte-popup-cover'+className).removeClass("mynyte-popup-open");
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