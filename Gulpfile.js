'use strict';

var projectname 	= "mivart",
	template_path	= "site/templates/",
	scss_path 		= template_path + 'scss/**/*.scss',
	es2015_path 	= template_path + 'es2015/**/*.js',
	styles_path 	= template_path + 'styles',
	scripts_path 	= template_path + 'scripts',
	gulp 			= require('gulp'),
	sass        	= require('gulp-sass'),
	watch 			= require('gulp-watch'),
	postcss      	= require('gulp-postcss'),
	autoprefixer	= require('gulp-autoprefixer'),
	postcss      	= require('gulp-postcss'),
	concat 			= require('gulp-concat'),
	sourcemaps 		= require('gulp-sourcemaps'),
	minify 			= require('gulp-minify'),
	uglify 			= require('gulp-uglify'),
	//livereload 	= require('gulp-livereload'),
	babel 			= require('gulp-babel'),
	minifyCss 		= require('gulp-minify-css');

// Add debounce to gulp watch for FTP
(function ftp_debounce_fix(){
  
  var watch = gulp.watch;
  
  // Overwrite the local gulp.watch function
  gulp.watch = function(glob, opt, fn){
    var _this = this, _fn, timeout;
    
    // This is taken from the gulpjs file, but needed to
    // qualify the "fn" variable
    if ( typeof opt === 'function' || Array.isArray(opt) ) {
      fn = opt;
      opt = null;
    }
    
    // Make a copy of the callback function for reference
    _fn = fn;
    
    // Create a new delayed callback function
    fn = function(){
      
      if( timeout ){
        clearTimeout( timeout );
      }
      
      timeout = setTimeout( Array.isArray(_fn) ? function(){
        _this.start.call(_this, _fn);
      } : _fn, 150 );
      
    };
    
    return watch.call( this, glob, opt, fn );
  };
  
})();

//Put all css tasks here
gulp.task('css', function() {
	return gulp.src(scss_path)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
            browsers: ['last 3 version' , "ie 9"],
            cascade: true,
        }))
        //.pipe(sourcemaps.init())
    	.pipe(minifyCss())
    	//.pipe(sourcemaps.write())
        .pipe(gulp.dest(styles_path))
        //.pipe(livereload({ start: true }));
});

//Put all javascript tasks here
gulp.task('js', function() { 
	return gulp.src(es2015_path)
        .pipe(babel({
            presets: ['es2015']
        }))
        //.pipe(concat('application.js'))
        //.pipe(sourcemaps.write('.'))
        .pipe(uglify())
        .pipe(gulp.dest(scripts_path));
        //.pipe(livereload({ start: true }));
});

//embed livereload
gulp.task('embedlr',  function() { 
	gulp.src(template_path + 'header.php')
    .pipe(embedlr())
    .pipe(gulp.dest(template_path));
});


//default task
gulp.task('default', ['css', 'js'] , function() {
	//livereload.listen();
	gulp.watch(scss_path, ['css']);
	gulp.watch(es2015_path, ['js']);
});

gulp.task('build', ['css', 'js']);