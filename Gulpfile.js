var projectname 	= "mivart",
	template_path	= "site/templates/",
	gulp 			= require('gulp'),
	//uglify 			= require('gulp-uglify'),
	sass        	= require('gulp-sass'),
	watch 			= require('gulp-watch'),
	sourcemaps   = require('gulp-sourcemaps'),
	postcss      = require('gulp-postcss'),
	livereload = require('gulp-livereload'),
	lr = require('tiny-lr'),
	autoprefixer	= require('autoprefixer-core');
	//jshint 			= require('gulp-jshint'),
	//concat 			= require('gulp-concat');

/* This will concatenate js files into one minifide file
gulp.task('js', function () {
	return gulp.src([
			template_path + 'js/lib/jquery-2.1.1.min.js',
			template_path + 'js/lib/highlight.js',
			template_path + 'js/app/main.js'
		])
		.pipe(uglify())
		.pipe(concat(projectname + '.js'))
		.pipe(gulp.dest(template_path + 'build/js'));
});
*/


gulp.task('sass', function() {
	return gulp.src(template_path + 'scss/*.scss')
		.pipe(sass({
		    compass: true,
			//style: 'compressed',
			lineNumbers: false
		}))
		//.pipe(concat(projectname + '.css'))
		.pipe(gulp.dest(template_path + 'styles'))
		.pipe(postcss([ autoprefixer({ browsers: ['last 3 version' , "ie 9"] }) ]))
        .pipe(sourcemaps.write('.'))
		.pipe(livereload());
});

gulp.task('autoprefixer', function () {
    var postcss      = require('gulp-postcss');
    var sourcemaps   = require('gulp-sourcemaps');
    var autoprefixer = require('autoprefixer-core');

    return gulp.src(template_path + 'styles/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 version' , "ie 9"] }) ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(template_path + 'styles/autoprefixed'));
});


gulp.task('default', ['sass', 'autoprefixer'], function() {
	gulp.watch(template_path + 'scss/*.scss', ['sass']);
	//gulp.watch(template_path + 'js/**/*.js', ['js']);
});

gulp.task('build', ['sass','autoprefixer']);