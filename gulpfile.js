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

var params = {
	appHTML: ['./www/templates/*.html', './www/templates/**/*.html', './www/templates/**/**/*.html'],
	appJs: ['./www/js/**/*.js'],
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
		targetDest = '/live/';
	}
	else if (argv.staging) {
		targetDest = '/staging/'
	};

	return gulp.src('**/*.js')
		.pipe(scp({
			host: 'ftp.mynyte.co.uk',
			username: 'sabir@mynyte.co.uk',
			password: 'The_edgesxa454',
			dest: targetDest
		}))
		.on('error', function(err) {
			console.log(err);
		});
});

gulp.task('build', ['compress','clean-dist']);