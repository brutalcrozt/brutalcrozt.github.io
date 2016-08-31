var gulp= require('gulp');
var sass= require('gulp-sass');
var coffee= require('gulp-coffee');
var concat= require('gulp-concat');
var uglify= require('gulp-uglify');
var rename= require('gulp-rename');
var pug= require('gulp-pug');
var autoprefixer= require('gulp-autoprefixer');
var sourcemaps= require('gulp-sourcemaps');
var gutil= require('gulp-util');
var yargs= require('yargs');
var gulpif= require('gulp-if');
// setting
var inputJs= './src/coffee/**/*.coffee';
var outJs= './';
var inputScss= './src/scss/*.scss';
var inputPug= './src/pug/**/*.pug';
var outputPug= './';
var outCss= './rd/css/';
var autoprefixerOpt= {
  browsers: ['last 2 versions']
};
var sassOptDev= {
  errLogToConsole: true,
  outputStyle: 'extended',
  sourceComments: true
};
var sassOptProd= {
  errLogToConsole: true,
  outputStyle: 'compress',
  sourceComments: false
};
var pugOptionsDev= {
  debug: true,
  pretty: true,
};
var pugOptionsProd= {
  debug: false,
  pretty: false
};
gulp.task('coffee', function () {
  return gulp
    .src(inputJs)
    .pipe(coffee({
      base: true
    }).on('error', gutil.log))
    .pipe(gulp.dest(outJs))
    // .pipe(function (a, b, c) {
    //   console.log(a, b);
    // });
});

gulp.task('js', function () {
  return gulp
    .src(outJs+ '**/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write(outJs+ '/maps/'))
    .pipe(rename(function (path) {
      path.extname= ".min.js";
    }))
    .pipe(gulp.dest(outJs));
});

gulp.task('sass', function () {
  return gulp
    .src(inputScss)
    .pipe(sass(sassOpt).on('error', gutil.log))

})

gulp.task('watch-js', function () {
  return gulp
    .watch(
      inputJs,
      ['coffee', 'js'] //
    ).on('change', function (event) {
      console.log(event.path);
    });
});

gulp.task('pug', function () {
  if (yargs.argv.mode) {
    if (yargs.argv.mode==='dev') {
      pugOptions= pugOptionsDev;
    } else if (yargs.argv.mode==='prod') {
      pugOptions= pugOptionsProd;
    } else {
      console.error('unknow mode, avaliable mode is dev for development and prod for production');
    }
  }
  else
    console.log('please specify mode, ex --mode dev|prod');
  return gulp.src(inputPug)
    .pipe(pug(pugOptions))
    .pipe(gulp.dest(outputPug));
})
gulp.task('dev', []);
gulp.task('production', []);
gulp.task('default', ['watch-js']);
