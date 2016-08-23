const gulp       = require( 'gulp' );
const browserify = require( 'browserify' );
const source     = require( 'vinyl-source-stream' );
const uglify     = require( 'gulp-uglify' );
const rename     = require( 'gulp-rename' );
const sourcemaps = require( 'gulp-sourcemaps' );
const babel      = require( 'gulp-babel' );
const buffer     = require( 'vinyl-buffer' );
const config     = require( '../config' );

gulp.task( 'workjs', ['cleanJs'], () => {
	var bundler = browserify( {
		debug: true,
		entries: config.js.worksrc
	} );

	// 开发环境
	if( config.env === 'dev' ){
		return bundler.bundle()
			.pipe( source( 'work.js' ) )
			.pipe( buffer() )
			.pipe( sourcemaps.init( {loadMaps: true} ) )
			.pipe( babel({presets: ['es2015']}) )
			.pipe( sourcemaps.write('./') )
			.pipe( gulp.dest( config.js.dest ) );
	}
	// 发布环境
	else{
		return bundler.bundle()
			.pipe( source( 'work.js' ) )
			.pipe( buffer() )
			.pipe( babel({presets: ['es2015']}) )
			// .pipe(rename({suffix: '.min'}))
			.pipe( uglify() )
			.pipe( gulp.dest( config.js.dest ) );
	}
} );
