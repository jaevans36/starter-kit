var gulp = require('gulp');

// Copy index.html from the app to assets
gulp.task('copy', function() {
  gulp.src('app/index.html')
  .pipe(gulp.dest('assets'))

  console.log('File has been copied!')
});