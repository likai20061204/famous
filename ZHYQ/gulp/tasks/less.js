const gulp    = require( 'gulp' );
const less    = require( 'gulp-less' );
const mincss  = require( 'gulp-minify-css' );
const rename  = require( 'gulp-rename' );

const config  = require( '../config' );

gulp.task( 'less', ['cleanLess'], () => {
	// 开发环境
	if( config.env === 'dev' ) {
		return gulp
			.src( config.less.src )
			.pipe( less() )
			.pipe( gulp.dest( config.less.dest ) );
	} 
	// 发布环境 
	else {
		return gulp
			.src( config.less.src )
			.pipe( rename({suffix: '.min'}) )
			.pipe( less() )
			.pipe( mincss({
				// 是否换行
				keepBreaks: false
			}) )
			.pipe( gulp.dest( config.less.dest ) );
	}

} );