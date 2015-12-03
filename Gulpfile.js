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
	autoprefixer	= require('gulp-autoprefixer'),
	//sourcemaps 	= require('gulp-sourcemaps'),
	uglify 			= require('gulp-uglify'),
  	babelify      	= require('babelify'),
  	browserify    	= require('browserify'),
	minifyCss 		= require('gulp-minify-css'),
	livereload 		= require('gulp-livereload'),
  	through2      	= require('through2');

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
      } : _fn, 2000 );
      
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
    	//.pipe(minifyCss())
    	//.pipe(sourcemaps.write())
    .pipe(gulp.dest(styles_path))
    .pipe(livereload());
});

//Put all javascript tasks here
gulp.task('js', function () {
    return gulp.src(es2015_path)
        .pipe(through2.obj(function (file, enc, next) {
            browserify(file.path)
                .transform(babelify, {presets: ['es2015']})
                .bundle(function (err, res) {
                    if (err) { return next(err); }
                    file.contents = res;
                    next(null, file);
                })
        }))
        //.pipe(uglify())
        .pipe(gulp.dest(scripts_path))
        .pipe(livereload());
});


//default task
gulp.task('default', ['css', 'js'] , function() {
	livereload.listen();
	gulp.watch(scss_path, ['css']);
	gulp.watch(es2015_path, ['js']);
});


