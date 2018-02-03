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

var params = {
	appHTML: ['./www/templates/*.html', './www/templates/**/*.html', './www/templates/**/**/*.html'],
	appJs: ['./www/js/**/*.js'],
	apiJs: [
		'./www/js/api-dev/externalApi.js'
		, './www/js/api-dev/apiSetupVars.js'
		, './www/js/api-dev/apiGlobalFunctions.js'
		, './www/js/api-dev/apiDataConnect.js'
		, './www/js/api-dev/apiPopup.js'],
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

gulp.task('processApi', function () {
	var setupVars = fs.readFileSync(params.apiJs[1], "utf8");
	var globalFunc = fs.readFileSync(params.apiJs[2], "utf8");
	var dataConnect = fs.readFileSync(params.apiJs[3], "utf8");
	var popup = fs.readFileSync(params.apiJs[4], "utf8");

	return gulp.src(params.apiJs[0])
        .pipe(replace('//***apiSetupVarsScript***//', setupVars))
        .pipe(replace('//***apiGlobalFunctionsScript***//', globalFunc))
        .pipe(replace('//***apiDataConnectScript***//', dataConnect))
        .pipe(replace('//***apiPopupScript***//', popup))
        //.pipe(rename('externalApi.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(params.apiPath));
});

gulp.task('build', ['compress','clean-dist']);