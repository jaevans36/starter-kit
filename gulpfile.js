const gulp = require("gulp"),
  browserSync = require("browser-sync").create(),
  gutil = require("gulp-util"),
  sass = require("gulp-sass"),
  uglify = require("gulp-uglify"),
  concat = require("gulp-concat"),
  eslint = require("gulp-eslint"),
  autoprefixer = require("gulp-autoprefixer"),
  minify = require("gulp-minify-css"),
  babel = require("gulp-babel");

var sassOptions = {
  errLogToConsole: true,
  outputStyle: "expanded"
};

// Static server and watching scss + html files
gulp.task("start", ["sass", "html"], () => {
  browserSync.init({
    server: "./app"
  });

  gulp.watch("app/**/*.js", ["js"]).on("change", browserSync.reload);
  gulp.watch("app/styles/*.scss", ["sass"]).on("change", browserSync.reload);
  gulp.watch("app/*.html", ["html"]).on("change", browserSync.reload);

  gutil.log(gutil.colors.magenta("Server started!"));
});

gulp.task("js", () => {
  gulp
    .src("app/**/*.js")
    .pipe(
      babel({
        presets: ["env"]
      })
    )
    .pipe(uglify())
    .pipe(concat("script.js"))
    .pipe(gulp.dest("dist"));

  gutil.log(gutil.colors.green("JS compiled successfuly!"));
});

gulp.task("lint", () => {
  gulp
    .src(["**/*.js", "!node_modules/**"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task("sass", () => {
  gulp
    .src("app/styles/*.scss")
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(sass(sassOptions).on("error", sass.logError))
    .pipe(minify())
    .pipe(gulp.dest("dist"));

  gutil.log(gutil.colors.green("CSS compiled successfuly!"));
});

gulp.task("html", function() {
  gulp
    .src("app/index.html")
    .pipe(gulp.dest("dist"))
    .on("error", gutil.log);

  gutil.log(gutil.colors.green("HTML compiled successfuly!"));
});

// Manually run all tasks
// gulp.task('default', ['copy','sass','js']);
