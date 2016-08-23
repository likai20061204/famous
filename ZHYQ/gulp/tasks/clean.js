const clean   = require( 'gulp-clean' );
const gulp    = require( 'gulp' );

const config  = require( '../config' );

gulp.task( 'cleanLess', () => {
	return gulp
		.src( `${config.less.dest}/*.css` )
		.pipe( clean() );
} );

gulp.task( 'cleanJs', () => {
	return gulp
		.src( [`${config.js.dest}/*.js`,`${config.js.dest}/*.map`] )
		.pipe( clean() );
} );

gulp.task( 'cleanImage', () => {
	return gulp
		.src( config.image.dest )
		.pipe( clean() );
} );

gulp.task( 'cleanOther', () => {
	return gulp
		.src( config.other.dest )
		.pipe( clean() );
} );

gulp.task( 'clean', ['cleanLess','cleanJs','cleanImage','cleanOther'] );