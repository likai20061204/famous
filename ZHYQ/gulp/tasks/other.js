const gulp    = require( 'gulp' );

const config  = require( '../config' );

gulp.task( 'other',['cleanOther'] ,function(){
	gulp
		.src( config.other.src )
		.pipe( gulp.dest( config.other.dest ) );
} );