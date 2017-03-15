'use strict';

var gulp = require('gulp'),
    fs = require('fs'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    size = require('gulp-size'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    merge = require('merge-stream'),
    rimraf = require('rimraf'),
    sass = require('gulp-sass'),
    typescript = require('gulp-typescript'),
    sequence = require('gulp-sequence'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync').create(),
    requirejsOptimize = require('gulp-requirejs-optimize'),
    awspublish = require('gulp-awspublish'),
    prettify = require('gulp-jsbeautifier');

var extAll = '{js,html,css,png,jpg,gif}';
var environment = {
    development: 'Development',
    staging: 'Staging',
    production: 'Production',
    current: function () {
        return process.env.ASPNET_ENVIRONMENT || process.env.ASPNET_ENV || this.development;
    },
    isDevelopment: function () {
        return this.current() === this.development;
    },
    isStaging: function () {
        return this.current() === this.staging;
    },
    isProduction: function () {
        return this.current() === this.production;
    }
};

var siteUrl = undefined;

var paths = {
    tests: 'tests/',
    webroot: 'webroot/',
    bower: 'webroot/bower_components/',
    styles: 'webroot/styles/',
    css: 'webroot/css/',
    fonts: 'webroot/fonts/',
    img: 'webroot/img/',
    imgTmp: '.tmp/webroot/img/',
    scripts: 'webroot/scripts/',
    js: 'webroot/js/',
    html: 'webroot/',
    partials: 'webroot/partials/',
};

var typeScriptProjects = [];
function getTypeScriptProject(name) {
    var item;
    typeScriptProjects.forEach(function (typeScriptProject) {
        if (typeScriptProject.name === name) {
            item = typeScriptProject;
        }
    });
    if (item === undefined) {
        var typeScriptProject = typescript.createProject('tsconfig.json');
        item = {
            name: name,
            project: typeScriptProject
        };
        typeScriptProjects.push(item);
    }
    return item.project;
}

var sources = {
    css: [
        paths.css + "**/*.css",
    ],
    scss: [
        paths.styles + "**/*.scss",
    ],
    fonts: [
        paths.fonts + "**/*.{ttf,svg,woff,woff2,otf,eot}",
    ],
    img: [
        paths.img + "**/*.{png,jpg,jpeg,gif,svg}",
    ],
    ts: [
        paths.webroot + "Bootstrap.ts",
        paths.scripts + "**/*.ts",
    ],
    js: [
        paths.scripts + "**/*.js",
    ]
};

function sizeBefore(title) {
    return size({
        title: 'Before: ' + title
    });
}
function sizeAfter(title) {
    return size({
        title: 'After: ' + title
    });
}

gulp.task('clean-css', function (cb) {
    return rimraf(paths.css, cb);
});

gulp.task('clean-fonts', function (cb) {
    return rimraf(paths.fonts, cb);
});

gulp.task('clean-js', function (cb) {
    return rimraf(paths.js, cb);
});

gulp.task('clean', ['clean-css', 'clean-fonts', 'clean-js']);

gulp.task('build-fonts', ['clean-fonts'], function () {
    var tasks = sources.fonts.map(function (source) {
        return gulp
            .src(source.paths ? source.paths : source)
            .pipe(plumber())
            .pipe(rename(function (path) {
                path.dirname = '';
            }))
            .pipe(gulp.dest(paths.fonts));
    });
    return merge(tasks);
});

function CompileScss (source) {
    var file = source.paths ? source.paths : (source.path ? source.path : source);
    var dest = paths.css;

    file = typeof file === 'string' ? file.replace(/[\\]/g, "/") : file;

    if (file.indexOf('/webroot') > -1) {
        file = file.replace(/(.*)(webroot.*)/, '$2');
        dest = file.replace('styles', 'css').replace(/(.*\/)(.*)/, '$1');
    }

    return gulp
        .src(file)
        .pipe(plumber())
        .pipe(gulpif(environment.isDevelopment(), sourcemaps.init()))
        .pipe(gulpif('**/*.scss', sass()))
        .pipe(gulpif(environment.isDevelopment(), autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'IE 8'] })))
        .pipe(sizeBefore(source.name ? source.name : source))
        .pipe(gulpif(!environment.isDevelopment(), cssnano()))
        .pipe(sizeBefore(source.name ? source.name : source))
        .pipe(gulpif(environment.isDevelopment(), sourcemaps.write({ includeContent: false, sourceRoot: '/styles' })))
        .pipe(gulp.dest(dest))
        .pipe(browserSync.stream());
}

gulp.task('compile-scss', function (event) {
    var tasks = sources.scss.map(function (source) {
        if (source.copy) {
            return gulp
                .src(source.paths ? source.paths : source)
                .pipe(gulpif(source.name, rename({ basename: source.name ? source.name : '', extname: '' })))
                .pipe(gulp.dest(paths.css))
                .pipe(browserSync.stream());
        } else {
            return CompileScss(source);
        }
    });
    return merge(tasks);
});

function ConstructScss (source) {
    var file = source.paths ? source.paths : (source.path ? source.path : source);
    var dest = paths.css;

    file = typeof file === 'string' ? file.replace(/[\\]/g, "/") : file;

    if (file.indexOf('/webroot') > -1) {
        file = file.replace(/(.*)(webroot.*)/, '$2');
        dest = file.replace('styles', 'css').replace(/(.*\/)(.*)/, '$1');
    }

    return gulp
        .src(file)
        .pipe(plumber())
        .pipe(gulpif('**/*.scss', sass()))
        .pipe(gulpif(environment.isDevelopment(), autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'IE 8'] })))
        .pipe(sizeBefore(source.name ? source.name : source))
        .pipe(gulpif(!environment.isDevelopment(), cssnano()))
        .pipe(sizeBefore(source.name ? source.name : source))
        .pipe(gulp.dest(dest));
}

gulp.task('construct-scss', function (event) {
    var tasks = sources.scss.map(function (source) {
        if (source.copy) {
            return gulp
                .src(source.paths ? source.paths : source)
                .pipe(gulpif(source.name, rename({ basename: source.name ? source.name : '', extname: '' })))
                .pipe(gulp.dest(paths.css))
                .pipe(browserSync.stream());
        } else {
            return ConstructScss(source);
        }
    });
    return merge(tasks);
});

function CompileTs (source) {
    var file = source.paths ? source.paths : (source.path ? source.path : source);
    var dest = paths.js;
    var sourceMap = '/scripts';

    file = typeof file === 'string' ? file.replace(/[\\]/g, "/") : file;

    if (file.indexOf('/scripts') <= -1) {
        sourceMap = '/';
        file = file.replace(/(.*)(webroot.*)/, '$2');
        dest = file.replace(/(.*\/)(.*)/, '$1');
    } else if (file.indexOf('/webroot') > -1) {
        sourceMap = file.replace(/(.*)(\/scripts.*)(\/.*)/, '$2');
        file = file.replace(/(.*)(webroot.*)/, '$2');
        dest = file.replace('scripts', 'js').replace(/(.*\/)(.*)/, '$1');
    }

    var tsResult;

    return gulp
        .src(file)
        .pipe(plumber())
        .pipe(gulpif(environment.isDevelopment(), sourcemaps.init()))
        .pipe(typescript())
        .js
        .pipe(gulpif("**/*.ts", typescript(getTypeScriptProject(source))))
        .pipe(sizeBefore(source.name ? source.name : source))
        .pipe(gulpif(!environment.isDevelopment(), uglify()))
        .pipe(sizeAfter(source.name ? source.name : source))
        .pipe(gulpif(environment.isDevelopment(), sourcemaps.write({ includeContent: false, sourceRoot: sourceMap })))
        .pipe(gulp.dest(dest));
}

gulp.task("compile-ts", [], function () {
    var tasks = sources.ts.map(CompileTs);

    return merge(tasks);
});

function ConstructTs (source) {
    var file = source.paths ? source.paths : (source.path ? source.path : source);
    var dest = paths.js;
    var sourceMap = '/scripts';

    file = typeof file === 'string' ? file.replace(/[\\]/g, "/") : file;

    if (file.indexOf('/scripts') <= -1) {
        sourceMap = '/';
        file = file.replace(/(.*)(webroot.*)/, '$2');
        dest = file.replace(/(.*\/)(.*)/, '$1');
    } else if (file.indexOf('/webroot') > -1) {
        sourceMap = file.replace(/(.*)(\/scripts.*)(\/.*)/, '$2');
        file = file.replace(/(.*)(webroot.*)/, '$2');
        dest = file.replace('scripts', 'js').replace(/(.*\/)(.*)/, '$1');
    }

    var tsResult;

    return gulp
        .src(file)
        .pipe(plumber())
        .pipe(typescript())
        .js
        .pipe(gulpif("**/*.ts", typescript(getTypeScriptProject(source))))
        .pipe(sizeBefore(source.name ? source.name : source))
        .pipe(gulpif(!environment.isDevelopment(), uglify()))
        .pipe(sizeAfter(source.name ? source.name : source))
        .pipe(gulp.dest(dest));
}

gulp.task("construct-ts", function () {
    var tasks = sources.ts.map(ConstructTs);

    return merge(tasks);
});

gulp.task('build', ['compile-scss', 'compile-ts']);

gulp.task('construct', ['construct-scss', 'construct-ts']);

gulp.task('test', function () {
    return gulp
        .src(paths.tests + 'mocha.html')
        .pipe(mocha());
});

gulp.task('optimize-images', function () {
    return gulp
        .src(sources.img)
        .pipe(plumber())
        .pipe(sizeBefore())
        .pipe(imagemin({
            multipass: true,
            optimizationLevel: 7
        }))
        .pipe(gulp.dest(paths.imgTmp))
        .pipe(sizeAfter());
});

gulp.task('watch-scss', function () {
    return gulp.watch(paths.styles + '**/*.scss')
        .on('change', function (event) {
            gutil.log(gutil.colors.blue('File ' + event.path + ', compile-scss task started.'));

            merge([CompileScss(event.path)]);
        });
});

gulp.task('watch-ts', function () {
    return gulp.watch([paths.webroot + 'Bootstrap.ts', paths.scripts + '**/*.ts'])
        .on('change', function (event) {
            gutil.log(gutil.colors.blue('File ' + event.path + ', compile-ts task started.'));

            merge([CompileTs(event.path)]);
        });
});

gulp.task('watch-html', function () {
    return watch(paths.html + '**/*.html')
        .on('change', function (pathFile) {
            gutil.log(gutil.colors.blue('File ' + pathFile + ', watch-html task started.'));

            browserSync.reload();
        });
});

gulp.task('watch-tests', function () {
    return watch([
            paths.js + '**/*.{js,ts}',
            paths.tests + '**/*.{js,ts}'
        ],
        ['test'])
        .on('change', function (filePath) {
            gutil.log(gutil.colors.blue('File ' + filePath + ', test task started.'));
        });
});

gulp.task('browser-sync', function() {
    browserSync.init({
        open: true,
        notify: true,
        port: 9001,
        ui: false,
        server: {
            baseDir: [paths.webroot],
            routes: {}
        }
    });
});

gulp.task('watch', ['watch-scss', 'watch-ts', 'watch-html']);

gulp.task('requirejsOptimize', function () {
    var paths = {
        'css-builder': 'bower_components/require-css/css-builder',
        'normalize': 'bower_components/require-css/normalize',
        css: 'bower_components/require-css/css',
        moment: 'bower_components/moment/moment',
        momentPtBr: 'bower_components/moment/locale/pt-br',
        angularMaterial: 'bower_components/angular-material/angular-material',
        angularMaterialCss: 'bower_components/angular-material/angular-material',
        angular: 'bower_components/angular/angular',
        angularAnimate: 'bower_components/angular-animate/angular-animate',
        angularAria: 'bower_components/angular-aria/angular-aria',
        angularMessages: 'bower_components/angular-messages/angular-messages',
        angularResource: 'bower_components/angular-resource/angular-resource',
        angularSanitize: 'bower_components/angular-sanitize/angular-sanitize',
        angularPortuguese: 'bower_components/angular-i18n/angular-locale_pt-br',
        angularUiRouter: 'bower_components/angular-ui-router/release/angular-ui-router',
        angularAMD: 'bower_components/angularAMD/dist/angularAMD',
        BootstrapCss: 'css/Bootstrap',
        Bootstrap: 'Bootstrap',
        Lazyload: 'js/Lazyload',
        Util: 'js/Util',
        Route: 'js/Route',
        AppCss: 'css/App',
        App: 'js/App',
        LayoutController: 'js/Controller/Layout',
        HeaderController: 'js/Controller/Header',
        UsersIndexController: 'js/Controller/Users/Index',
        UsersAddController: 'js/Controller/Users/Add',
        UsersService: 'js/Service/Users',
        MomentFilter: 'js/Filter/Moment',
    };
    var shim = {
        angular: { deps: ['css'] },
        angularAnimate: { deps: ['angularAMD'] },
        angularAria: { deps: ['angularAMD'] },
        angularMessages: { deps: ['angularAMD'] },
        angularResource: { deps: ['angularAMD'] },
        angularSanitize: { deps: ['angularAMD'] },
        angularPortuguese: { deps: ['angularAMD'] },
        angularUiRouter: { deps: ['angularAMD'] },
        angularAMD: { deps: ['angular'] },
        angularMaterial: { deps: ['angularAnimate', 'angularAria'] },
        momentPtBr: { deps: ['moment'] },
        MomentFilter: { deps: ['momentPtBr'] },
        Lazyload: { deps: ['angularAMD'] },
        Route: { deps: ['Lazyload'] },
        Util: { deps: ['Lazyload', 'Route'] },
        App: { deps: ['Util', 'angularMessages', 'angularResource', 'angularSanitize', 'angularPortuguese', 'angularUiRouter', 'angularMaterial'] },
        LayoutController: { deps: ['HeaderController'] },
        UsersIndexController: { deps: ['UsersService', 'MomentFilter'] },
        UsersAddController: { deps: ['UsersService', 'ProfilesFactory', 'StateService'] },
    };
    return gulp.src('webroot/Bootstrap.js')
        .pipe(requirejsOptimize(function () {
            return {
                optimize: 'none',
                paths: paths,
                shim: shim
            };
        }))
        .pipe(uglify())
        .pipe(gulp.dest('webroot'));
});

gulp.task('minifyHtml', function() {
    return gulp.src(paths.partials + '**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(paths.partials));
});

gulp.task('awspublishcomplete', function () {
    var publisher = awspublish.create({
        region: 'us-west-2',
        params: {
            Bucket: 'leblot'
        },
        accessKeyId: 'AKIAIPRNVN24XSGG5RTQ',
        secretAccessKey: '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',
        signatureVersion: 'v3'
    }, {
        cacheFileName: 'awspublish.json'
    });
    var files = [
        '!' + paths.bower + '**/*.html',
        paths.webroot + '**/*.{css,js,html,woff,woff2,eot,ttf}',
    ];
    return gulp.src(files)
        .pipe(gulpif('!**/*.{html,woff,woff2,eot,ttf}', awspublish.gzip({ ext: '.gz' })))
        .pipe(publisher.publish({ 'Cache-Control': 'max-age=315360000, no-transform, public' }))
        .pipe(publisher.cache())
        .pipe(awspublish.reporter());
});

gulp.task('awspublish', function () {
    var publisher = awspublish.create({
        region: 'us-west-2',
        params: {
            Bucket: 'leblot'
        },
        accessKeyId: 'AKIAIPRNVN24XSGG5RTQ',
        secretAccessKey: '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',
        signatureVersion: 'v3'
    }, {
        cacheFileName: 'awspublish.json'
    });
    var files = [
        paths.webroot + '**/*.{css,js,html,woff,woff2,eot,ttf}',
        '!' + paths.bower + '**',
    ];
    return gulp.src(files)
        .pipe(gulpif('**/*.html', htmlmin({ collapseWhitespace: true })))
        .pipe(gulpif('**/*.js', uglify()))
        .pipe(gulpif('**/*.css', cssnano()))
        .pipe(gulpif('**/*.css', autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'IE 8'] })))
        .pipe(gulpif('!**/*.{html,woff,woff2,eot,ttf}', awspublish.gzip({ ext: '.gz' })))
        .pipe(publisher.publish({ 'Cache-Control': 'max-age=315360000, no-transform, public' }))
        .pipe(publisher.cache())
        .pipe(awspublish.reporter());
});

gulp.task('awspublishFormat', function () {
    return gulp.src('awspublish.json')
        .pipe(prettify())
        .pipe(gulp.dest('.'));
});

gulp.task('sw', function(callback) {
    var path = require('path');
    var swPrecache = require('sw-precache');

    swPrecache.write(path.join(paths.webroot, 'sw.js'), {
        staticFileGlobs: [paths.webroot + '{css,js,lib}/**/*.' + extAll],
        stripPrefix: paths.webroot
    }, callback);
});

gulp.task('default', sequence('compile-ts', ['compile-scss', 'browser-sync', 'watch']));

gulp.task('browser', ['browser-sync']);

gulp.task('builder', sequence('construct', 'watch'));

gulp.task('production', sequence('construct'));

gulp.task('publish', sequence('construct', 'awspublish', 'awspublishFormat'));

gulp.task('deploy', sequence('construct', 'awspublishcomplete', 'awspublishFormat'));
