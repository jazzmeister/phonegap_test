var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var log = require('fancy-log');
var debug = require('gulp-debug');
var gulpCopy = require('gulp-copy');
//var uglify = require('gulp-uglify');
var pump = require('pump');
var html2string = require('gulp-html2string');

/* frontend specific */
var postcss = require('gulp-postcss');
var shortColor = require('postcss-short-color');
var cssnext = require('postcss-cssnext');
var atImport = require('postcss-import');
var mqpacker = require('css-mqpacker');
var cssnano = require('cssnano');


//## Convert HTML templates inside /templates to a javascript array and save to /js/templates.js
//## Command Line: gulp html2js
gulp.task('html2js', function () {
  return gulp.src('templates/*.html')
    .pipe(html2string({        
      base: './templates',          //The base path of HTML templates 	    
      createObj: true,              // Indicate wether to define the global object that stores 
                                    // the global template strings 
      objName: 'oeTemplates'        // Name of the global template store variable 
                                    // say the converted string for myTemplate.html will be saved to TEMPLATE['myTemplate.html'] 
    }))
    .pipe(rename({extname: '.js'}))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('js/'));        // Output folder 
});



//## Copy javascript files from /source folder to /js folder - without minification (used for debugging)
//## Command Line: gulp copySourceToJS
gulp.task('copySourceToJS', function() {
  var sourceFiles = ['source/models.js', 'source/appLib.js', 'source/views.js', 'source/routes.js', 'source/main.js', 
                      'source/demoQuestions.js', 'source/imageLib.js', 'source/jqm-config.js', 'source/init.js', 'source/pushNotification.js'];
  var destFolder = 'js/';

  return gulp.src(sourceFiles)
    .pipe(gulpCopy(destFolder, { prefix: 1 }));
});



//## Minify javascript files from /source folder to /js folder - for deployment
//## Command Line: gulp minifySourceToJS
gulp.task('minifySourceToJS', function (cb) {
  var sourceFiles = ['source/models.js', 'source/appLib.js', 'source/views.js', 'source/routes.js', 'source/main.js', 
                      'source/demoQuestions.js', 'source/imageLib.js', 'source/jqm-config.js', 'source/init.js', 'source/pushNotification.js'];
  var destFolder = 'js/';

  pump([
        gulp.src(sourceFiles),
        uglify(),
        gulp.dest(destFolder)
    ],
    cb
  );
});


gulp.task('css', function () {
  var tools = [
  cssnext,
  atImport,
  mqpacker,
  cssnano
  ];
  
  return gulp.src('cssSource/*.css')
  .pipe(postcss(tools))
  .pipe(postcss([shortColor]))
  .pipe(gulp.dest('css'));
});

// Gulp Watch Task
gulp.task('watch', function(){
  gulp.watch('templates/**/*.html', ['html2js']);
  gulp.watch('cssSource/**/*.css', ['css']);
  //other watchers
})



//## Gulp debug test
gulp.task('test', function () {
  gulp.src('templates/*.html').pipe(debug());
});