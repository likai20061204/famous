var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var Nav = require('navbar');
var App = require('App');

class Licence extends Page{
	constructor(){
		super({id:'Licence'});
	}

	onCreate(){
		super.onCreate();

		initPage(this);
	}

	onDestroy(){
		var _this = this,
		obj = this.getChildren(),
		i = obj.length;

		while(i--)
			this.removeChild(obj[i]);

		super.onDestroy();

		// this._content = null;
	}

}

function initPage(node){
	node.addChild(new Nav('营业执照办理指南'));


	var con = node.addChild();
	con
		.setSizeMode('relative','relative')
		.setDifferentialSize(0,-44)
		.setPosition(0,44)
		.el = new DOMElement(con,{
			classes:['img_con','overflow_scoll'],
			content:function(){
				var str = '';
				var imgW = App.width -28;
				var imgSrc = './images/service/step_';
				for(var i = 1 ; i < 5;i++){
					str += `<img width="${imgW}" style="margin-top:34px;" src = "${imgSrc}${i}.png"/>`
				}
				str += `<img width="${App.width}" style="margin-top:34px;" src = "${imgSrc}5.png"/>`

				return str;
			}(),
			properties:{
				'fontSize':'0',
				'textAlign':'center'
			}
		})
}


module.exports = Licence;