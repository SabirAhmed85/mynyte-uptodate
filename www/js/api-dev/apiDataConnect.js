function dataConnect (params) {
	var className = params.className;
	var action = params.action;
	var data = params.data || null;
	var existingVars = params.existingVars || null;
	var successCallback = params.successCallback || function () {};
	var errorCallback = params.errorCallback || function () {};

	var jsonpCallback = function (reponse) {};

	$.ajax({
		url: current_environment_root_prefix+"/"+current_db_environment_file_url+"sneak-preview/data/extApi/"+className+".php?action="+action,
		type: "GET",
		dataType: "jsonp",
		jsonp: "jsonp",
		jsonpCallback: action,
		context: self,
		crossDomain: true,
		data: data,
		success: function (successData) {
			successCallback({successData: successData, existingVars: existingVars});
		},
		error: function (jqxhr,status,errorData) {
			errorCallback(errorData);
		},
		complete: function (data) {

		}
	});
}

function internalDataConnect (params) {
	var className = params.className;
	var action = params.action;
	var data = params.data || null;
	var existingVars = params.existingVars || null;
	var successCallback = params.successCallback || function () {};
	var errorCallback = params.errorCallback || function () {};

	var actionPropsMap = {
		uploadImage: {
			type: "POST", cache: false, processData: false, async: false
		},
		removeImage: {
			type: "POST", cache: true, processData: true, async: true
		}
	};
	console.log(params, MynyteApi.pageVars['New Business Item Forms'][0].internalDataUrl);
	console.log(action);
	$.ajax({
		url: MynyteApi.pageVars['New Business Item Forms'][0].internalDataUrl+"/"+className+".php?action="+action,
		type: actionPropsMap[action].type,
		dataType: "json",
		context: self,
		async: actionPropsMap[action].async,
		data: data,
    	cache: actionPropsMap[action].type,
    	processData: actionPropsMap[action].processData,
    	contentType: 'Content-type:text/html; charset=UTF-8',
		success: function (successData) {
			successCallback({successData: successData, existingVars: existingVars});
		},
		error: function (jqxhr,status,errorData) {
			errorCallback(errorData);
		},
		complete: function (data) {

		}
	});
}