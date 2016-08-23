const gulp    = require( 'gulp' );

const config  = require( '../config' );

gulp.task( 'image', ['cleanImage'], () => {
  gulp
		.src( config.image.src )
		.pipe( gulp.dest( config.image.dest ) );
} );