# Jay's Starter Kit
## Introduction
Dev environment to use for starting static website projects

## Packages in use
* Browser-Sync (browser-sync)
* Gulp
* Sass (via gulp-sass)
* Babel (via gulp-babel)
* ESLint (via gulp-eslint)
* Pug (via gulp-pug)
* Uglify (via gulp-uglify)
* Beautify (via gulp-beautify)
* Notify (via gulp-notify)
* Concat (via gulp-concat)
* Plumber (via gulp-plumber)
* CSS import (via gulp-cssimport)
* Rename (via gulp-rename)
* Sourcemaps (via gulp-sourcemaps)
* Autoprefixer (via gulp-autoprefixer)
* Imagemin (via gulp-imagemin)
* FTP (via vinyl-ftp)
* Uncss (via gulp-uncss)
* Surge (via gulp-surge)

## Requirements
* NodeJs
* Gulp

## Installation guide
1. Copy the project using `git clone https://github.com/jaevans36/starter-kit.git`
2. If you don't have NodeJs - install [**NodeJs from here**](https://nodejs.org/en/) 
3. When node is installed, if you don't have gulp, install it using `npm install -g gulp`.
4. Create a new ftpconfig.json file with the following details, in your main directory:
    ```
    {
      "ftp": {
        "host": "[Your FTP host name]",
        "username": "[Your FTP username]",
        "password": "[Your FTP password]",
        "ftpdirectory": "[Your FTP Route directory]"
      },
      "surge": {
        "domain": "[Your surge domain]",
        "ip": "[Your surge IP address]"
      }
    }
    ```
    You can choose between using FTP or Surge in this project, if you don't have details for one, then you can just use the other details.

5. With everything in place use `npm install` to install all required packages.]
6. To first build the project you will either need to run `gulp build` or `gulp dev`, the latter will run the development environment with all linting and a local server with browser-sync.
7. The project is set as default to use [**Surge**](http://surge.sh/help/getting-started-with-surge), with the project built you can simply deploy using `gulp deploy`.
