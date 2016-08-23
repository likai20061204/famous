var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var navbar = require('navbar');
var signModel = require('model/signModel');
var config = require('config.json');

class code extends Page{

	constructor(){
		super();
	}

	onCreate(){

		super.onCreate();

		this.addChild(new navbar('查看二维码'));

		this.content = this.addChild();
		this.content.setSizeMode('relative','relative')
								.setDifferentialSize(0,-45)
								.setPosition(0,45);

		new DOMElement(this.content,{
			classes:['overflow_auto']
		});

	}

	onResume(){

		super.onResume();

		initPage(this.content);

	}

	onDestroy(){

		var _this = this,
		obj = this.getChildren(),
		i = obj.length;

		while(i--)
			this.removeChild(obj[i]);

		super.onDestroy();

	}

}

function initPage(nodeAll){

	nodeAll.setProportionalSize(.8)
				 .setAlign(.1);

	nodeAll.el = new DOMElement(nodeAll,{
		content:`<img src="${config.ajax_base}/v1/qrcode/?uid=${signModel.findOne().id}" class="l_code">`
	})
		
}



module.exports = code;