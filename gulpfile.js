var gulp = require('gulp');
var minify = require('gulp-minify');
var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglifyjs');
var htmlmin = require('gulp-htmlmin');
var argv = require('yargs').argv;
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var gcallback = require('gulp-callback');
var scp = require('gulp-scp2');
var rename = require('gulp-rename');
var fs = require('fs-extra');
var replace = require('gulp-replace');
var jshint = require('gulp-jshint');

var params = {
	appHTML: ['./www/templates/*.html', './www/templates/**/*.html', './www/templates/**/**/*.html'],
	appJs: ['./www/js/**/*.js'],
	currentApiJs: [
		'./www/js/api-dev/externalApi.v2.js'
		, './www/js/api-dev/v2/apiSetupVars.js'
		, './www/js/api-dev/v2/apiGlobalFunctions.js'
		, './www/js/api-dev/v2/apiDataConnect.js'
		, './www/js/api-dev/v2/apiPopup.js'
		, './www/js/api-dev/v2/apiCreateHTML.js'
		, './www/js/api-dev/v2/apiImportScripts.js'
		, './www/js/api-dev/v2/apiFormFunctions.js'],
	prevApiJs: [
		'./www/js/api-dev/externalApi.js'
		, './www/js/api-dev/v1/apiSetupVars.js'
		, './www/js/api-dev/v1/apiGlobalFunctions.js'
		, './www/js/api-dev/v1/apiDataConnect.js'
		, './www/js/api-dev/v1/apiPopup.js'
		, './www/js/api-dev/v1/apiCreateHTML.js'
		, './www/js/api-dev/v1/apiImportScripts.js'
		, './www/js/api-dev/v1/apiFormFunctions.js'],
	apiPath: './www/js/api/',
	appCss: ['./www/css/*.css']
}

gulp.task('clean-dist', function () {
    return gulp.src('dist/', {read: false})
        .pipe(clean());
});

gulp.task('compress', ['clean-dist'], function () {
	gulp.src(params.appJs)
	    .pipe(uglify('app.js'))
	    .pipe(gulp.dest('dist/js/'))
	    .pipe(gcallback(function () {
	    	console.log('done');
	    }));

	gulp.src(params.appCss)
	    .pipe(cleanCss())
	    .pipe(concat('app.css'))
	    .pipe(gulp.dest('dist/css/'));

	gulp.src(params.appHTML)
	    .pipe(htmlmin({'collapseWhitespace': true}))
	    .pipe(gulp.dest('dist/templates/'));
});

gulp.task('deploy', function() {
	var targetDest;
	if (argv.live) {
		targetDest = 'public_html/live/';
	}
	else if (argv.staging) {
		targetDest = 'public_html/staging/'
	};

	return gulp.src('./www/index.html')
		.pipe(scp({
			host: 'ftp.mynyte.co.uk',
			username: 'qxiryynz',
			password: 'ip95@*8bFY^E',
			dest: targetDest
		}))
		.on('error', function(err) {
			console.log(err);
		});
});

gulp.task('lintApiJs', function () {
	return gulp.src(params.apiJs)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('processPrevApi', function () {
	var setupVars = fs.readFileSync(params.prevApiJs[1], "utf8");
	var globalFunc = fs.readFileSync(params.prevApiJs[2], "utf8");
	var dataConnect = fs.readFileSync(params.prevApiJs[3], "utf8");
	var popup = fs.readFileSync(params.prevApiJs[4], "utf8");
	var createHTML = fs.readFileSync(params.prevApiJs[5], "utf8");
	var importScripts = fs.readFileSync(params.prevApiJs[6], "utf8");
	var formScripts = fs.readFileSync(params.prevApiJs[7], "utf8");

	return gulp.src(params.prevApiJs[0])
        .pipe(replace('//***apiSetupVarsScript***//', setupVars))
        .pipe(replace('//***apiGlobalFunctionsScript***//', globalFunc))
        .pipe(replace('//***apiDataConnectScript***//', dataConnect))
        .pipe(replace('//***apiPopupScript***//', popup))
        .pipe(replace('//***apiCreateHTMLScript***//', createHTML))
        .pipe(replace('//***apiImportScriptsScript***//', importScripts))
        .pipe(replace('//***apiFormFunctions***//', formScripts))
        //.pipe(rename('externalApi.min.v2.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(params.apiPath));
});

gulp.task('processApi', ['processPrevApi'], function () {
	var setupVars = fs.readFileSync(params.currentApiJs[1], "utf8");
	var globalFunc = fs.readFileSync(params.currentApiJs[2], "utf8");
	var dataConnect = fs.readFileSync(params.currentApiJs[3], "utf8");
	var popup = fs.readFileSync(params.currentApiJs[4], "utf8");
	var createHTML = fs.readFileSync(params.currentApiJs[5], "utf8");
	var importScripts = fs.readFileSync(params.currentApiJs[6], "utf8");
	var formScripts = fs.readFileSync(params.currentApiJs[7], "utf8");

	return gulp.src(params.currentApiJs[0])
        .pipe(replace('//***apiSetupVarsScript***//', setupVars))
        .pipe(replace('//***apiGlobalFunctionsScript***//', globalFunc))
        .pipe(replace('//***apiDataConnectScript***//', dataConnect))
        .pipe(replace('//***apiPopupScript***//', popup))
        .pipe(replace('//***apiCreateHTMLScript***//', createHTML))
        .pipe(replace('//***apiImportScriptsScript***//', importScripts))
        .pipe(replace('//***apiFormFunctions***//', formScripts))
        //.pipe(rename('externalApi.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(params.apiPath));
});

gulp.task('build', ['compress','clean-dist']);