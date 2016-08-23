var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var Navbar = require('navbar');
var IconText = require('IconText');
var Tips = require('Tips');

class Card extends Page{
	constructor(){
		super({id:'Card'});
	}

	onCreate(){
		super.onCreate();

		initNav(this);
	}

	onResume(){
		super.onResume();

		initContent(this);
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

	onReceive(e,p){

		if( e === 'click' && p.node.listId === 'type0'){
			alert('物业未欠费','','提示信息','确定');
		}
		if(	e === 'click' && p.node.listId === 'type1'){
			alert('停车未欠费','','提示信息','确定');
		}
		if( e === 'click' && p.node.listId === 'type2'){
			alert('餐饮未欠费','','提示信息','确定');
		}
		

		p.stopPropagation();
	}
}

function initNav(node){
	node.addChild( new Navbar('一卡通'));
}

//内容
function initContent( node ){
	var content = node.addChild();
	
	content
		.setSizeMode('relative','absolute')
		.setDifferentialSize(0,-44)
		.setPosition(0,44)

	var IconJson = [
		{'icon':'./images/service/wuye.png','text':'物业费'},
		{'icon':'./images/service/tingche.png','text':'停车费'},
		{'icon':'./images/service/canyin.png','text':'餐饮费'}
	]

	for(var i = 0 ; i < IconJson.length; i++){

		//实例化icon文字图标
		var CardType = new IconText(IconJson[i],i,3,85,33,'ico_box');

		CardType.listId = 'type'+i;
		CardType.addUIEvent('click');

		content.addChild(CardType);

	}	

}

module.exports = Card;