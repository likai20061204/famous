const gulp    = require( 'gulp' );

const config  = require( '../config' );

gulp.task( 'watch', () => {

	gulp.watch( config.js.watch, () => {
		return gulp.start( 'js' );
	} );

	gulp.watch( config.less.watch, () => {
		return gulp.start( 'less' );
	} );

	gulp.watch( config.image.watch, () => {
		return gulp.start( 'image' );
	} );	

	gulp.watch( config.other.watch, () => {
		return gulp.start( 'other' );
	} );

	gulp.watch( config.html.watch, () => {
		return gulp.start( 'html' );
	} );		
} );