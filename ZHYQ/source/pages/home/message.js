var Node = require('famous/core/Node');
var DOMElement = require('famous/dom-renderables/DOMElement');
var CrossCall = require('famous/core/CrossCall');
var navbar = require('navbar');
var ListView = require('listview');
var listItem = require('./listItem');
var messageModel = require('model/messageModel');
var incrementModel = require('model/incrementModel');
var blank = require('blank');
var signModel = require('model/signModel');
var config = require('config.json');


class message extends Node{

	constructor(){
		super();

		this.addChild(new navbar('消息')).el.setContent("<p class='font-lg text-center'><span>消息</span></p>");

		this.content = this.addChild();
		this.content.setDifferentialSize(0,-44)
								.setPosition(0,44);

		this.content.el = new DOMElement(this.content,{
			classes:['overflow_auto']
		});

		setTimeout(function(){
			initPage(this.content);
		}.bind(this),100)
		
	}


	onReceive(e,p){

		//删除该条消息
		if(e === 'click' && p.node.mark === 'close'){

			confirm('确定要删除该条消息？',function(res){

				if(res == 1){

					messageModel.remove({id:p.node.getParent().tip});

					var num = p.node.liId._id;

					this.content.ListView.RemoveItem(num);

					//判断是否还有数据
					if(messageModel.findOne() == undefined){

						//没有数据，加入空白页面
						this.addChild(new blank('mes'))
								 .setDifferentialSize(0,-45)
								 .setPosition(0,45);

					}

					setTimeout(function(){

						if(!messageModel.findOne()){

							this.content.el.removeClass('bgfff');

						}
						
					}.bind(this),100);

				}

			}.bind(this),'提示消息',['确定','取消']);

			p.stopPropagation();
			
		}

		//阅读该条消息
		if(e === 'click' && p.node.liId === 'musicList'){

			messageModel.update({id:p.node.tip},{isRead:true});

			var readMessage = messageModel.findOne({'id':p.node.tip});
			var list = p.node.allInfo.data;

			p.node.el.setContent(`<dl class="dl${list.InfoType}">
								<dt><img src="images/home/message${list.InfoType}.png"><i class="true"></i></dt>
								<dd>
									<h3><em>[${list.type}]</em><span>${list.InfoTitle}</span></h3>
									<p>${list.InfoCtime}</p>
								</dd>
							</dl>`);

			this.getParent().to('noticeDetail',{'data':readMessage});

			p.stopPropagation();

		}

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
		var websocket = new WebSocket(config.webSocket);

		
		websocket.onopen = function(evt) {
			console.log(evt)
			websocket.send(JSON.stringify({msgtype:"auth",token:signModel.findOne().token}));

		};

		websocket.onerror = function(evt) {
			console.log(evt)
		};

		websocket.onmessage  = function(evt) {

			console.log(evt);

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
				'InfoType':res.InfoType,
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
			alert(evt,'你的账号可能在其他地方登录，请重新登录',null,'提示消息','确定');
		};

}

module.exports = message;