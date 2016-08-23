const gulp     = require( 'gulp' );
const fs       = require( 'fs' );

const config   = require( '../config' );

gulp.task( 'html_before', () => {
	return gulp
		.src( config.html.src )
		.pipe( gulp.dest(config.html.dest) );
} );

gulp.task( 'html',['html_before'] , () => {
	// 发布环境
	if( config.env === 'pub' ) {
		fs
			.writeFile( `${config.html.dest}/index.html`, 
				fs.readFileSync( `${config.html.dest}/index.html`, 'utf8' )
					.replace( config.html.script, '$1index.min.js' )
					.replace( config.html.link, '$1index.min.css') );
	}
} );