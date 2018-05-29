const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function disableScrolling() {
    disableScroll = true;
}
function enableScrolling() {
    disableScroll = false;
}
$('body').ontouchmove = function(e){
   if(disableScroll){
     e.preventDefault();
   } 
};

function lockScroll () {
	// lock scroll position, but retain settings for later
	var scrollPosition = [
		self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
		self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
	];
	var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
	html.data('scroll-position', scrollPosition);
	html.data('previous-overflow', html.css('overflow'));
	html.css('overflow', 'hidden');
	window.scrollTo(scrollPosition[0], scrollPosition[1]);
}

function unlockScroll() {
    console.log("unlock");
	var html = jQuery('html');
	var scrollPosition = html.data('scroll-position');
	html.css('overflow', html.data('previous-overflow'));
	window.scrollTo(scrollPosition[0], scrollPosition[1]);
}

function propNameCssFormatter(name) {
    return name.replace(/ /g, '-').replace(/\[/g, "").replace(/\]/g, "").toLowerCase();
}

function formatMoneyVal(params) {
    var value = params.value;

    value = numberWithCommas(value);
    value = (params.withCurrencySymbol == false) ? value: '£' + value;

    return value;
}

$(document)
    .on('focus', 'input.popup-input', function(e) {
        $('body').addClass('fixfixed');
    })
    .on('blur', 'input.popup-input', function(e) {
        $('body').removeClass('fixfixed');
    });

	function include(filename, onload) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';
    script.onload = script.onreadystatechange = function() {
        if (script.readyState) {
            if (script.readyState === 'complete' || script.readyState === 'loaded') {
                script.onreadystatechange = null;                                                  
                onload();
            }
        } 
        else {
            onload();          
        }
    };
    head.appendChild(script);
}