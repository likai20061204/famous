const path = require( 'path' );
const src = path.resolve( `${__dirname}./../source` );
const dest = path.resolve( `${__dirname}./../www` );

module.exports = {
	
	// 编译环境：开发（dev）或者 发布(pub)
	env: 'dev',

	// less 配置
	less: {
		src: `${src}/index.less`,
		dest: dest,
		watch: `${src}/**/*.less`
	},

	// js 配置
	js: {
		worksrc: `${src}/work.js`,
		mainsrc: `${src}/index.js`,
		dest: dest,
		watch: `${src}/**/*.js`
	},

	// html 配置
	html: {
		src: `${src}/index.html`,
		dest: dest,
		watch: `${src}/index.html`,
		link: /(<link *.* *href.*)index.css/,
		script: /(<script.* *src.*)index.js/
	},

	// image 配置
	image: {
		src: `${src}/images/**/*`,
		dest: `${dest}/images`,
		watch: `${src}/images/**/*`
	},

	// other 配置
	other: {
		src: `${src}/others/**/*`,
		dest: `${dest}/others`,
		watch: `${src}/others/**/*`
	},


};