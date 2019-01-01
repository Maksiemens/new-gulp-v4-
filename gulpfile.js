'use strict';

const gulp = require('gulp');

const gutil = require('gulp-util');

const plumber = require('gulp-plumber');

const notify = require('gulp-notify');

const browserSync = require('browser-sync');
const reload = browserSync.reload;

//browserSync 
gulp.task('browserSync', (done) => {
	browserSync({
		server: {
			baseDir: './prod'
		},
		tunnel: true,
	});
	done();
});



//pug
const pug = require('gulp-pug');
gulp.task('pug', (done) => {
	gulp.src('dev/pug/*.pug')
			.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
			.pipe(pug({pretty: true}))
			.pipe(gulp.dest('dev/html'))
			.pipe( reload({stream: true}) );

			done();
});



//html
const htmlmin = require('gulp-htmlmin');
gulp.task('html', (done) => {
	gulp.src('dev/html/*.html')
			.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
			.pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
			.pipe(gulp.dest('prod'));
			done();
});



//style
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('style', (done) => {
	gulp.src('dev/style/style.scss')
			.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))		
			.pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.init() )
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))			
			.pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
			.pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.write() )
			.pipe(gulp.dest('prod/css'))
			.pipe( reload({stream: true}));
			done();
});



//js
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('js', (done) => {
	gulp.src([
			'dev/libs/jquery/jquery-3.3.1.min.js',			
			'dev/libs/wow/wow.min.js',
			'dev/libs/slick/slick.min.js',
			'dev/libs/particles/particles.min.js',
			'dev/libs/isotope/isotope.pkgd.min.js',
			'dev/js/*.js'
		])
			.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))	
			.pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.init() )
			.pipe(uglify())	
			.pipe(concat('script.js'))
			.pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.write() )
			.pipe(gulp.dest('prod/js'))
			.pipe( reload({stream: true}) );
			done();
});



//image
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');

const pngquant = require('imagemin-pngquant');
const optipng = require('imagemin-optipng');

const mozjpeg = require('imagemin-mozjpeg');
const jpegtran = require('imagemin-jpegtran');

const svgo = require('imagemin-svgo');

gulp.task('image', (done) => {
		gulp.src('dev/img/**/*.*')

		.pipe(cache(imagemin(
			[

				pngquant(),
				optipng({progressive: true}),

				mozjpeg({progressive: true}),
				jpegtran(),

				svgo({removeViewBox: false})


			],{verbose: true}
		)))

		.pipe(gulp.dest('prod/img/'));
		done();
});

//cache clear
gulp.task('clear', (done) => {
	cache.clearAll();
	done();
})

//favicon
gulp.task('favicon', (done) => {
	gulp.src('dev/favicon/**/*.*')
			.pipe(gulp.dest('prod/favicon/'));
			done();
});

//libs
gulp.task('libs', (done) => {
	gulp.src(['dev/libs/**/*.*','!dev/libs/**/*.js'])
			.pipe(gulp.dest('prod/libs/'));
			done();
});

//fonts
gulp.task('fonts', (done) => {
    gulp.src('dev/fonts/**/*.*')
				.pipe(gulp.dest('prod/fonts'));
				done();
});

//videos
gulp.task('video', (done) => {
	gulp.src('dev/video/**/*.*')
			.pipe(gulp.dest('prod/video'));
			done();
});








// /////

// // default
// gulp.task('default', ['pug', 'html', 'style', 'js', 'image', 'favicon', 'fonts', 'video', 'libs', 'del']);

// gulp.task('dev', ['default', 'watcher', 'browserSync']);

// //watcher
// gulp.task('watcher', () => {
// 	gulp.watch('dev/**/*.pug', ['pug']);

// 	gulp.watch('dev/**/*.html', ['html']);

// 	gulp.watch('dev/style/**/*.scss', ['style']);

// 	gulp.watch('dev/js/**/*.js', ['js']);

// 	gulp.watch('dev/img/**/*', ['image']);

// 	gulp.watch('dev/favicon/**/*', ['favicon']);
	
// 	gulp.watch('dev/fonts/**/*', ['fonts']);

// 	gulp.watch('dev/video/**/*', ['video']);
// });

// /////

//clean
const clean = require('gulp-clean');
gulp.task('clean', (done) => {
	gulp.src('prod', {read: false})
			.pipe(clean());
			done();
});


//del
const del = require('del');
gulp.task('del', (done) => {
	del.sync('prod');
	done();
});



//watcher
gulp.task('watcher', (done) => {
	gulp.watch('dev/**/*.pug', gulp.series('pug'));

	gulp.watch('dev/**/*.html', gulp.series('html'));

	gulp.watch('dev/style/**/*.scss', gulp.series('style'));

	gulp.watch('dev/js/**/*.js', gulp.series('js'));

	gulp.watch('dev/img/**/*', gulp.series('image'));

	gulp.watch('dev/favicon/**/*', gulp.series('favicon'));
	
	gulp.watch('dev/fonts/**/*', gulp.series('fonts'));

	gulp.watch('dev/video/**/*', gulp.series('video'));
	done();
});



// default


gulp.task('default', gulp.series('pug', 'html', 'style', 'js', 'image', 'favicon', 'fonts', 'video', 'libs'), (done) => {

	done();

});


gulp.task('dev', gulp.series('default', 'watcher', 'browserSync'), (done) => {

	done();
});