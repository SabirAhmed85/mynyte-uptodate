var disableScroll = false;
//SHOULD ACTUALLY CHECK THE DOMAIN TO SEE IF THEY ARE OUR DEV TEAM ETC
var localDevAllowed = true;
var windowOuterHeight = $(window).height();
var scripts = document.getElementsByTagName("script");
var currentScript = scripts[scripts.length - 1].src;
var current_environment = (typeof(current_mynyte_env) !== 'undefined' && localDevAllowed == true) ? current_mynyte_env: 'live';
var current_db_environment = (typeof(mynyte_db_environment) !== 'undefined' && localDevAllowed == true) ? mynyte_db_environment : current_environment;
var current_environment_page_url = null;
var current_environment_file_url = null;
var current_environment_root_prefix = (current_environment == 'localhost' && localDevAllowed == true) ? 
	(typeof(local_root_prefix) !== 'undefined') ? local_root_prefix : "localhost/": 
	"https://www.mynyte.co.uk";
var _bid = mynyte_business_id;

current_environment_page_url = (current_environment == 'staging') ? "staging/": "";
current_environment_file_url = (current_environment == 'localhost') ? "": current_environment + "/";
current_db_environment_file_url = (current_environment == 'localhost') ? "": current_db_environment + "/";

MynyteApi.pageVars = {};
MynyteApi.pageVars['Globals'] = {
	'Mynyte': {
		'main-logo': 'https://www.mynyte.co.uk/sneak-preview/img/logo.png',
		'table-booking-frame-src': 'https://www.mynyte.co.uk/'+current_environment_page_url+'#/app/externalApi/bookTable/light/87/0'
	},
	'Myday': {
		'main-logo': 'https://www.mydayapp.co.uk/sneak-preview/img/logo.png'
	}
};