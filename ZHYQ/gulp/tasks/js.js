const gulp       = require( 'gulp' );
const browserify = require( 'browserify' );
const source     = require( 'vinyl-source-stream' );
const less       = require( 'gulp-less' );
const uglify     = require( 'gulp-uglify' );
const rename     = require( 'gulp-rename' );
const clean      = require( 'gulp-clean' )
const babel      = require( 'gulp-babel' );

const config     = require( '../config' );

gulp.task( 'js_before',['cleanJs'] , () => {

		return browserify( {
			entries: config.js.src
		} )
			.bundle()
			.pipe(source( 'index.js' ))
			.pipe( gulp.dest( config.js.dest ) );

} );

gulp.task( 'js_min', ['js_before'], () => {

	// 发布环境进行压缩操作
	if( config.env === 'pub' ) {
		return gulp
			.src( `${config.js.dest}/index.js` )
			.pipe( babel({presets: ['es2015']}) )
			.pipe(rename({suffix: '.min'}))
			.pipe( uglify() )
			.pipe( gulp.dest( config.js.dest ) );
	}else{
		return gulp
			.src( `${config.js.dest}/index.js` )
			.pipe( babel({presets: ['es2015']}) )
			.pipe( gulp.dest( config.js.dest ) );
	}

} );

gulp.task( 'js',['js_min'] ,() => {

	// 发布环境进行删除中间未压缩文件操作
	if( config.env === 'pub' ) {
		gulp
			.src( `${config.js.dest}/index.js` )
			.pipe( clean() );
			
	}

} )