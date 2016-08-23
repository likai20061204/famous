var Page = require('Page');
var Node = require('famous/core/Node');
var DOMElement = require('famous/dom-renderables/DOMElement');
var navbar = require('navbar');
var ListView = require('ListView');
var Blank = require('blank');
var Ajax = require('Ajax');
var App = require('App');
var sign = require('model/SignModel');

class Notice extends Page{
	constructor(){
		super({id:'Notice'});	
	}

	onCreate(){
		super.onCreate();

		initNav(this);

		var userSign = sign.findOne();

		this.userId = userSign.id;
		this.token = userSign.token;

	}

	onResume(){
		super.onResume();

		if(!this._content){
			new Ajax('/message_info/lists_user')
				.data({
					'type':1,
					'id':this.userId,
					'did':App.uuid,
					'tk':this.token
				})	
	    		.success(function(d){
	    			this.listjson = d.data;
	    			initContent(this,this.listjson);
	    		}.bind(this)).post();
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
		if(e === 'click' && p.node.clickType === 'detail'){
			this.to('noticeDetail',{'data':p.node.noticeData});
		}


		//TODO 删除 ?
		// if(e === 'click' && p.node.clickType === 'del'){
			// alert('删除:'+p.node.listId);
			// this.listjson.splice(p.node._index,1);
			// this._content.removeChild(p.node.getParent());
			// this._content.getChildren().forEach(function(n,i){
			// 	n.setPosition(0,i*65 + 8*(i+1))
			// })
			// this.allList.RemoveItem(p.node.obj._id);
			// if(!this.allList._domList.length){
			// 	this._content.el.setContent('由于你的手贱而导致没有公告信息！！').setProperty('font-size','15px');
			// }
			// console.log(this.allList);
			// console.log(p.node.obj);

		// }

		p.stopPropagation();
	}

} 


//导航
function initNav(node){
	node.addChild(new navbar('市场公告'));
}

//内容
function initContent(node,data){
	
	var content = node.addChild();


	content.setSizeMode('relative','relative')
		   .setDifferentialSize(0,- 44)
		   .setPosition(0,44)
		   .el = new DOMElement(content,{
		 	  classes:['notice_box','overflow_scoll']

		   });

	node._content = content;

	if(data === null){
		content.addChild(new Blank('notice'));
		return false;
	}

	node.allList = new ListView({
		threshold:6,//预加载数 单位个（请根据item 高度适当调整）
        throttle:16.7,//单位毫秒 控制Scroll执行频率
        itemSize:[null,73],//item  尺寸
		createItem:function(data,obj){
			var noticelist = new NoticeList(data,obj);
			return noticelist;
		}
	})

	node.allList.BindData(data);

	content.addChild(node.allList);	   



	
}

class NoticeList extends Node{
	constructor(data,obj){
		super();

		var list = this.addChild();
		var del = list.addChild();


		//列表节点设置
		list.setSizeMode('relative','absolute')
			.setAbsoluteSize(null,65)
			// .setPosition(0,8)
			.el = new DOMElement(list,{
				classes:['notice_list'],
				content:`<p>${data.InfoTitle}</p><span>${data.InfoCtime}</span>`
			}).setProperty('border-top','8px solid #efefef');

		list.noticeData = data;
		
		//删除节点设置
		// del.setSizeMode('absolute','absolute')
		//   .setAbsoluteSize(40,65)
		//   .setAlign(1)
		//   .setMountPoint(1)
		//   .setPosition(-16)
		//   .el = new DOMElement(del,{
		//   	content:'<i class="del_ico"></i>'
		//   })

		// 添加事件 
		list.addUIEvent('click');
		list.listId = data.Id;
		list.clickType = 'detail';  

		// del.addUIEvent('click');
		// del.listId = data.id;
		// del.obj = obj;
		// del.clickType = 'del';
	}

	
}


module.exports = Notice;