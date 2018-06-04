//General css files
$('head').append('<link rel="stylesheet" href="'+ current_environment_root_prefix + "/" +current_environment_file_url+'css/api-style.css" type="text/css" />');
$('head').append('<link rel="stylesheet" href="'+ current_environment_root_prefix + "/" +current_environment_file_url+'css/ionicons.min.css" type="text/css" />');
$('head').append('<link rel="stylesheet" href="https://webfonts.creativecloud.com/c/69721a/1w;quicksand,2,WXp:W:n4,WXn:W:n7/l" type="text/css" />');
$('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" type="text/css" />');

function importJSScript(params) {
	var d=document,
		s=d.createElement('script');

	s.src = params.src;
	s.onload = function () {
		if (params.onLoad) {
			params.onLoad();
		}
	};
	d.head.appendChild(s);
}
MynyteApi.importJSScript = importJSScript;

function importBootstrapDatepicker(params) {
	$('head').append('<link rel="stylesheet" href="'+ current_environment_root_prefix + "/" +current_environment_file_url+'js/api/bootstrap/css/bootstrap.min.css" type="text/css" />');
	$('head').append('<link rel="stylesheet" href="'+ current_environment_root_prefix + "/" +current_environment_file_url+'js/api/bootstrap/css/bootstrap-datepicker3.min.css" type="text/css" />');
	importJSScript({src: current_environment_root_prefix + "/" +current_environment_file_url+'js/api/bootstrap/js/bootstrap-datepicker.min.js', onLoad: params.onLoad});
}
MynyteApi.importBootstrapDatepicker = importBootstrapDatepicker;

function importHtmlEditor(params) {
	$('head').append('<link rel="stylesheet" href="'+ current_environment_root_prefix + "/" +current_environment_file_url+'js/api/html-editor/css/editor.css" type="text/css" />');
	importJSScript({src: current_environment_root_prefix + "/" +current_environment_file_url+'js/api/html-editor/js/editor.js', onLoad: params.onLoad});
}
MynyteApi.importHtmlEditor = importHtmlEditor;