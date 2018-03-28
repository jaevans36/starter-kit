// Imports and requires

const gulp = require("gulp"),
  browserSync = require("browser-sync").create(),
  gutil = require("gulp-util"),
  sass = require("gulp-sass"),
  pug = require("gulp-pug"),
  uglify = require("gulp-uglify"),
  beautify = require("gulp-beautify"),
  notify = require("gulp-notify"),
  concat = require("gulp-concat"),
  plumber = require("gulp-plumber"),
  cssimport = require("gulp-cssimport"),
  cssmin = require("gulp-cssnano"),
  rename = require("gulp-rename"),
  sourcemaps = require("gulp-sourcemaps"),
  eslint = require("gulp-eslint"),
  autoprefixer = require("gulp-autoprefixer"),
  imagemin = require("gulp-imagemin"),
  minify = require("gulp-minify-css"),
  babel = require("gulp-babel"),
  ftp = require("vinyl-ftp");

// Configs

const base = {
  dist: "dist/",
  app: "app/",
  assets: "dist/assets"
};

const routes = {
  styles: {
    scss: `${base.app}styles/*.scss`,
    _scss: `${base.app}styles/_includes/*.scss`,
    css: `${base.dist}assets/css/`
  },
  scripts: {
    base: `${base.app}scripts/`,
    js: `${base.app}scripts/*.js`,
    jsmin: `${base.dist}assets/js/`
  },
  templates: {
    pug: `${base.app}templates/*.pug`,
    _pug: `${base.app}templates/_includes/*.pug`
  },
  files: {
    html: `${base.dist}`,
    images: `${base.app}images/*`,
    imgmin: `${base.dist}assets/files/img/`,
    cssFiles: `${base.dist}assets/css/*.css`,
    htmlFiles: `${base.dist}assets/*.html`,
    styleCss: `${base.dist}css/style.css`
  },
  deploy: {
    baseDir: base.dist,
    baseDirFiles: `${base.dist}**`,
    ftpUploadDir: "[FTP-DIRECTORY]"
  }
};

// FTP Credentials

const ftpCreds = {
  host: "[HOST]",
  user: "[USER]",
  password: "[PASSWORD]"
};

const surgeInfo = {
  domain: "[DOMAIN.surge.sh]" // http://surge.sh/help/getting-started-with-surge
};

// Sass config

const sassOptions = {
  outputStyle: "compressed"
};

// Uncss config

const uncssOptions = {
  html: [routes.files.htmlFiles],
  ignore: ["*:*"]
};

/* ### Compile tasks ### */

// Pug
/*
	Tasks:
	Unpipe stream on error
	Start sourcemap process
	Sass compiler
	Autoprefixer
	Complete sourcemap process
	Replace improt statements with css
	Rename file to 'style.css'
	Copy file to distribution folder
	Browsersync inject changes without page refresh
	Notify user that Styles task is completed successfully
*/
gulp.task("templates", () => {
  console.log(routes.files.html);
  return gulp
    .src([routes.templates.pug, "!" + routes.templates._pug])
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Error: Compiling Pug failed.",
          message: "<%= error.message %>"
        })
      })
    )
    .pipe(pug())
    .pipe(gulp.dest(routes.files.html))
    .pipe(
      browserSync.reload({
        stream: true
      })
    )
    .pipe(
      notify({
        title: "Pug Compiled successfully.",
        message: "templates task completed."
      })
    );
});

// SCSS
/*
	Tasks:
	Unpipe stream on error
	Start sourcemap process
	Sass compiler
	Autoprefixer
	Complete sourcemap process
	Replace improt statements with css
	Rename file to 'style.css'
	Copy file to distribution folder
	Browsersync inject changes without page refresh
	Notify user that Styles task is completed successfully
*/
gulp.task("styles", () => {
  return gulp
    .src(routes.styles.scss)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Error: Compiling SCSS failed.",
          message: "<%= error.message %>"
        })
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(autoprefixer("last 3 versions"))
    .pipe(sourcemaps.write())
    .pipe(cssimport({}))
    .pipe(rename("style.css"))
    .pipe(gulp.dest(routes.styles.css))
    .pipe(browserSync.stream())
    .pipe(
      notify({
        title: "SCSS Compiled and Minified successfully.",
        message: "scss task completed."
      })
    );
});

// Scripts
/*
	Tasks:
	Unpipe stream on error
	Start sourcemap process
	Concatenate script.js
	Convert ES6 => ES5
	Minify the code to save space
	Complete sourcemap process
	Copy the file to distribution folder
	Copy file to css folder
	Browsersync refresh the page
	Notify user that Scripts task is completed successfully
*/
gulp.task("scripts", () => {
  return gulp
    .src(routes.scripts.js)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Error: Babel and Concat failed.",
          message: "<%= error.message %>"
        })
      })
    )
    .pipe(sourcemaps.init())
    .pipe(concat("script.js"))
    .pipe(babel())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(routes.scripts.jsmin))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(
      notify({
        title: "JavaScript minified and concatenated.",
        message: "js files have been minified and concatenated."
      })
    );
});

// Images
/*
	Tasks:
	Minify the images
	Copy the minified images to distribution folder
*/
gulp.task("images", () => {
  gulp
    .src(routes.files.images)
    .pipe(imagemin())
    .pipe(gulp.dest(routes.files.imgmin));
});

// Deploy
/*
	Tasks:
	Create the connection using the ftp config
	Unpipe stream on error
	Upload all files to prod
	Notify user that Deploy task is completed successfully
*/
gulp.task("upload", () => {
  const connection = ftp.create({
    host: ftpCreds.host,
    user: ftpCreds.user,
    password: ftpCreds.password
  });

  return gulp
    .src(routes.deploy.baseDirFiles, {
      base: routes.deploy.baseDir,
      buffer: false
    })
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Error: Deployment failed.",
          message: "<%= error.message %>"
        })
      })
    )
    .pipe(connection.dest(routes.deploy.ftpUploadDir))
    .pipe(
      notify({
        title: "Deployment successful.",
        message: "Deployment completed."
      })
    );
});

/*
	Tasks:
	Publish site to surge
*/
gulp.task("surge", () => {
  return surge({
    project: routes.deploy.baseDir,
    domain: [SURGEINFO.DOMAIN]
  }).pipe(
    notify({
      title: "Surge deployment successful.",
      message: "Deployment to Surge completed."
    })
  );
});

// Pre-production tasks
/*
	Tasks:
	Beautify script files with 2 indents
	Unpipe stream on error
	Copy the beautified files
	Notify user that beautification is completed successfully
*/
gulp.task("beautify", () => {
  return gulp
    .src(routes.scripts.js)
    .pipe(beautify({ indentSize: 2 }))
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Error: Beautify failed.",
          message: "<%= error.message %>"
        })
      })
    )
    .pipe(gulp.dest(routes.scripts.base))
    .pipe(
      notify({
        title: "Beautification successful.",
        message: "Beautification of scripts successful."
      })
    );
});

// Create local server and watch for changes
gulp.task("watch", () => {
  browserSync.init({
    server: "./dist/"
  });

  gulp.watch([routes.styles.scss, routes.styles._scss], ["styles"]);
  gulp.watch([routes.templates.pug, routes.templates._pug], ["templates"]);
  gulp.watch(routes.scripts.js, ["scripts", "beautify"]);
});

// Remove un-used CSS
gulp.task("uncss", () => {
  return gulp
    .src(routes.files.cssFiles)
    .pipe(uncss({ uncssOptions }))
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Error: UnCSS failed.",
          message: "<%= error.message %>"
        })
      })
    )
    .pipe(cssmin())
    .pipe(gulp.dest(routes.styles.css))
    .pipe(
      notify({
        title: "UnCSS successful.",
        message: "Unused CSS removed successful."
      })
    );
});

// Task commands
gulp.task("dev", ["templates", "styles", "scripts", "images", "watch"]);
gulp.task("build", ["templates", "styles", "scripts", "images"]);
gulp.task("optimise", ["uncss", "images"]);
gulp.task("deploy", ["optimise", "surge"]);
gulp.task("default", () => {
  gulp.start("dev");
});
