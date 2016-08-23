var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var CrossCall = require('famous/core/CrossCall');
var navbar = require('navbar');
var ListView = require('listview');
var listItem = require('./listItem');
var messageModel = require('model/messageModel');
var incrementModel = require('model/incrementModel');
var blank = require('blank');
var signModel = require('model/signModel');


class message extends Page{

	constructor(){
		super({
			id:'message'
		});

	}

	onCreate(){
		
		super.onCreate();

		this.addChild(new navbar('消息'));

		this.content = this.addChild();
		this.content.setDifferentialSize(0,-44)
								.setPosition(0,44);

		this.content.el = new DOMElement(this.content,{
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


	onReceive(e,p){

		//删除该条消息
		if(e === 'click' && p.node.mark === 'close'){

			messageModel.remove({id:p.node.getParent().tip});

			var num = p.node.liId._id;

			this.content.ListView.RemoveItem(num);

			setTimeout(function(){
				if(!messageModel.findOne()){
					this.content.el.removeClass('bgfff');
				}
			}.bind(this),100)
			
			
		}

		//阅读该条消息
		if(e === 'click' && p.node.liId === 'musicList'){

			messageModel.update({id:p.node.tip},{isRead:true});

			p.node.el.addClass('l_haveread');

			this.to('noticeDetail');

		}

		p.stopPropagation();

	}

}

function initPage(nodeAll){

	//读取数据
	if(messageModel.findOne()){

		var list = messageModel.find().reverse();
		var len = list.length;

		nodeAll.ListView = new ListView({
			threshold:3,//预加载数 单位个（请根据item 高度适当调整）
	    throttle:16.7,//单位毫秒 控制Scroll执行频率
	    itemSize:[null,75],//item  尺寸

	    createItem:function(list,index){

	    	var inode =  new listItem(list,index);
	      		inode.liId = "musicList";
						inode.tip = list.id;
						inode.addUIEvent("click");

						return inode;
	    }

		})

		nodeAll.ListView.setSizeMode( 'relative', 'relative' ).setProportionalSize(1,1).BindData(list);

		nodeAll.addChild(nodeAll.ListView);

	}else{

		//没有数据，加入空白页面
		nodeAll.getParent().addChild(new blank('mes'))
											 .setDifferentialSize(0,-45)
											 .setPosition(0,45);

	}


		//建立长链接
		var websocket = new WebSocket('ws://10.100.1.14:9999');

		
		websocket.onopen = function(evt) {
			console.log(evt)
			websocket.send(JSON.stringify({msgtype:"auth",token:signModel.findOne().token}));

		};

		websocket.onerror = function(evt) {
			console.log(evt)
		};

		websocket.onmessage  = function(evt) {

			nodeAll.el.addClass('bgfff');

			var evt = JSON.parse(evt.data);

			var res = evt.msg;
			
			var obj = nodeAll.getChildren(),
					i = obj.length;

			while(i--)
				nodeAll.removeChild(obj[i]);

			var messageId = incrementModel.findOne() ? incrementModel.findOne().messageId : 0;
			incrementModel.remove();
			incrementModel.save({'messageId':(messageId + 1)});

			//存入一条数据
			messageModel.save({
				'id':messageId,
				'imgSrc':res.imgSrc,
				'status':res.status,
				'InfoCtime':res.InfoCtime,
				'InfoTitle':res.InfoTitle,
				'type':res.type,
				'isRead':false,
				'InfoDesc':res.InfoDesc,
				'InfoAuthor':res.InfoAuthor
			});

			var list = messageModel.find().reverse();
			var len = list.length;

			nodeAll.ListView = new ListView({
				threshold:3,//预加载数 单位个（请根据item 高度适当调整）
		    throttle:16.7,//单位毫秒 控制Scroll执行频率
		    itemSize:[null,75],//item  尺寸

		    createItem:function(list,index){

		    	var inode =  new listItem(list,index);
		      		inode.liId = "musicList";
							inode.tip = list.id;
							inode.addUIEvent("click");

							return inode;
		    }

			})

			nodeAll.ListView.setSizeMode( 'relative', 'relative' ).setProportionalSize(1,1).BindData(list);

			nodeAll.addChild(nodeAll.ListView);

		};

		websocket.onclose  = function(evt) {
			console.log(evt)
		};

}

module.exports = message;