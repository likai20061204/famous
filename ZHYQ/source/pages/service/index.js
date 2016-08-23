var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var Navbar = require('navbar');
var IconText = require('IconText');
var Ajax = require('Ajax');
var App = require('App');
var sign = require('model/SignModel');

class ServiceIndex extends Page{
	constructor(){
		super({id:'ServiceIndex'})
	}

	onCreate(){
		super.onCreate();

		initNav(this);

		var userSign = sign.findOne();

		new Ajax('/user_store/list_id')
			.data({
				'id':userSign.id,
				'did':App.uuid,
				'tk':userSign.token
			})
			.success(function(d){
				if(d.status === 200){
					this.shopData = d.data;
					this.shopLen = this.shopData.length;
				}
			}.bind(this)).post();
	}

	onResume(){
		super.onResume()

		if(!this._content){
			initContent(this);
		}
		
	}

	onDestroy(){
		var _this = this,
		obj = this.getChildren(),
		i = obj.length;

		while(i--)
			this.removeChild(obj[i]);

		super.onDestroy();

		this._content = null;
	}


	onReceive(e,p){

		if( e === 'click' && p.node.listId === 'type0'){
			//广告位大厅
			if(this.shopLen === 1){
				this.to('adApply',{data:this.shopData[0].id});
				p.stopPropagation();
				return false;
			}
			this.to('shopChoose',{data:1});
		}
			
		if( e === 'click' && p.node.listId === 'type1'){
			//堆场
			if(this.shopLen === 1){
				this.to('apply_yard',{data:this.shopData[0].id});
				p.stopPropagation();
				return false;
			}
			this.to('shopChoose',{data:2});
		}
		if( e === 'click' && p.node.listId === 'type2'){
			//大厅
			if(this.shopLen === 1){
				this.to('apply_hall',{data:this.shopData[0].id});
				p.stopPropagation();
				return false;
			}
			this.to('shopChoose',{data:3});
		}
		if(	e === 'click' && p.node.listId === 'type3'){
			this.to('orderPage');
		}
		if( e === 'click' && p.node.listId === 'type4'){
			this.to('licence')
		}
		if( e === 'click' && p.node.listId === 'type5'){
			this.to('apply_wl');
		}
		

		p.stopPropagation();
	}
} 


//导航
function initNav (node) {
	 node.addChild( new Navbar('便民服务') );
}

//内容
function initContent( node ){
	var content = node.addChild();
	
	content
		.setSizeMode('relative','absolute')
		.setDifferentialSize(0,-44)
		.setPosition(0,44)

	node._content = content;

	var IconJson = [
		{'icon':'./images/service/guanggao.png','text':'广告位申请'},
		{'icon':'./images/service/duichang.png','text':'堆场申请'},
		{'icon':'./images/service/dating.png','text':'大厅申请'},
		{'icon':'./images/service/dingcan.png','text':'订餐'},
		{'icon':'./images/service/zhizhao.png','text':'营业执照办理指南'},
		{'icon':'./images/service/banjia.png','text':'物流信息'}
	]

	for(var i = 0 ; i < IconJson.length; i++){

		//实例化icon文字图标
		var ServeType = new IconText(IconJson[i],i,3,85,51,'ico_box');

		ServeType.listId = 'type'+i;
		ServeType.addUIEvent('click');

		content.addChild(ServeType);

	}	

}

module.exports = ServiceIndex;