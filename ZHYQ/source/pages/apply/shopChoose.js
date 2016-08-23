var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var Nav = require('twoBtnNav');
var button = require('button');
var App = require('App');
var Ajax = require('Ajax');
var sign = require('model/SignModel');

class ShopChoose extends Page{
	constructor(data){
		super({id:'ShopChoose'})
		this.type = data; 
	}

	onCreate(data){
		super.onCreate();

		this.type = data;

		initNav(this,this.type);

		var userSign = sign.findOne();

		new Ajax('/user_store/list_id').data({'id':userSign.id,'did':App.uuid,'tk':userSign.token})
			.success(function(d){
				this.shopList = d.data;
			}.bind(this)).post();

	}

	onResume(){
		super.onResume();

		if(!this._con){
			initContent(this,this.applyType,this.shopList);
		}
	}

	onDestroy(){
		var _this = this,
		obj = this.getChildren(),
		i = obj.length;

		while(i--)
			this.removeChild(obj[i]);

		super.onDestroy();

		this._con = null;
	}

	onReceive(e,p){
		if(e === 'click' && p.node.listId === 'shopSelect' && this.type === 1){
			this.to('adApply',{data:p.node.shopId}); //广告位申请
		}
		if(e === 'click' && p.node.listId === 'shopSelect' && this.type === 2){
			this.to('apply_yard'); //堆场申请
		}
		if(e === 'click' && p.node.listId === 'shopSelect' && this.type === 3){
			this.to('apply_hall'); //大厅申请
		}

		p.stopPropagation();
	}

}

function initNav(node,type){
	var backButton = new button(" ","","goback2");
	var _this = node;
	var src = '';

	node.applyType = '';

	// backButton.setAbsoluteSize(44,44);
	backButton.clickEvent = function(e,p){
		node.back();
		p.stopPropagation();
	};

	var rightText = new button('申请记录','','right_text');
	rightText.setAbsoluteSize(100,44);
	rightText.clickEvent = function(e,p){
		//跳转相应页面申请页面
		switch (type) {
			case 1:
				_this.to('adRecord');
				break;
			case 2:
				_this.to('record_yard');
				break;
			case 3:
				_this.to('record_hall');
				break;
		}

		p.stopPropagation();
	};

	//店铺选择header图片
	node.addChild(new Nav('店铺选择',backButton,rightText));
	switch (type) {
		case 1:
			src = `./images/apply/shop_apply_${type}.jpg`;
			node.applyType = '广告位';
			break;
		case 2:
			src = `./images/apply/shop_apply_${type}.png`;
			node.applyType = '堆场';
			break;
		case 3:
			src = `./images/apply/shop_apply_${type}.png`;
			node.applyType = '大厅';
			break;
	}

	var shopBg = node.addChild();
	shopBg
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,App.width*23/75)
		.setPosition(0,44)
		.el = new DOMElement(shopBg,{
			tagName:'img',
			attributes:{
				'src':src
			}
		})
}

function initContent(node,type,data){
	var con = node.addChild();
	con
		.setSizeMode('relative','relative')
		.setDifferentialSize(0,-( 44+ App.width*23/75))
		.setPosition(0,(44+ App.width*23/75))

	node._con = con;

	//横幅
	var HD = con.addChild();

	HD
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,15)
		.setPosition(0,15)
		.el = new DOMElement(HD,{
			classes:['HD'],
			content:`<span></span>请点击选择需要申请${type}的店铺：`
		}).setProperty('lineHeight','15px');


	var shopItemBox = con.addChild();
	shopItemBox
		.setSizeMode('relative','relative')
		.setDifferentialSize(0,-(40+25))
		.setPosition(0,40)
		.el = new DOMElement(shopItemBox,{
			classes:['overflow_scoll']
		})

	var shopjson = data;

	if(shopjson === null){
		return false;
	}

	// 循环每个店铺
	for(var i = 0 ; i < shopjson.length;i++){
		var shopItem = shopItemBox.addChild();
		// var align = i % 2 ? 1 : 0;

		shopItem
			.setSizeMode('relative','absolute')
			.setAbsoluteSize(null,60)
			.setProportionalSize(1/2)
			.setDifferentialSize(-14)
			.setAlign(i%2/2)
			// .setAlign(align)
			// .setMountPoint(align)
			// .setPosition(align ? -14 : 14,Math.floor(i/2)*61)
			.setPosition(i%2?0:14,Math.floor(i/2)*60)
			.el = new DOMElement(shopItem,{
				classes:['shop_item'],
				content:shopjson[i].name
			})

		// align ? shopItem.el.setProperty('borderRight','1px solid #e0e0e0') : shopItem.el.setProperty('borderLeft','1px solid #e0e0e0');

		//绑定事件
		shopItem.addUIEvent('click');
		shopItem.listId = 'shopSelect';
		shopItem.shopId = shopjson[i].id;
	}	

}

module.exports = ShopChoose;