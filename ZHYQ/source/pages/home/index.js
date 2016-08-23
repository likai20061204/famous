var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var GestureHandler = require('famous/components/GestureHandler');
var CrossCall = require('famous/core/CrossCall');
var Ajax = require('Ajax');
var personalCenter = require('./personalCenter');
var message = require('./message');
var find = require('./find');
var App = require('App');
var signModel = require('model/signModel');

class home extends Page{

	constructor(){
		super({
			id:'home'
		});
	}

	onCreate(){

		super.onCreate();

		//获取电话号码
		new Ajax('/app_config/detail_user')
			.data({
				'key':'CUSTOMER_SERVICE',
				'id':signModel.findOne().id,
				'did':App.uuid,
				'tk':signModel.findOne().token
			})
			.success(function(d){
				if(d.status === 200){
					this.phoneNmuber = d.data;
				}
			}.bind(this)).post();

		//第一屏页面
		this.content = this.addChild();
		this.content.setDifferentialSize(0,-50);
		this.content.el = new DOMElement(this.content,{
			classes:['content1','overflow_auto']
		});

		//初始化banner
		initBanner(this.content);

		//初始化Message
		initMessage(this.content);

		//初始化功能列表
		initActivity(this,this.content);
		
		//初始化温度背景界面
		initTemp(this.content);

		//第二屏页面（发现）
		this.content2 = this.addChild(new find('find'));
		this.content2.setDifferentialSize(0,-50).setAlign(1,0);
		this.content2.el = new DOMElement(this.content2);

		//第三屏页面（消息）
		this.content3 = this.addChild(new message());
		this.content3.setDifferentialSize(0,-50).setAlign(1,0);
		this.content3.el = new DOMElement(this.content3,{
			id:'message'
		});

		
		//第四屏页面（个人中心）
		this.content4 = this.addChild(new personalCenter());
		this.content4.setDifferentialSize(0,-50).setAlign(1,0);
		this.content4.el = new DOMElement(this.content4,{
			classes:['personalCenter']
		});

		//初始化底部
		initFoot(this);

	}

	onResume(){

		super.onResume();

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

		// var list2 = ['首页', '发现', '消息', '我的'];

		if(p.node.mark === 'foot'){

			if(e === 'click' && p.node.liId === 'foot0'){
				this.content.setAlign(0,0);
				this.content2.setAlign(1,0);
				this.content3.setAlign(1,0);
				this.content4.setAlign(1,0);
				
			}

			if(e === 'click' && p.node.liId === 'foot1'){
				this.content.setAlign(1,0);
				this.content2.setAlign(0,0);
				this.content3.setAlign(1,0);
				this.content4.setAlign(1,0);
				
			}

			if(e === 'click' && p.node.liId === 'foot2'){
				this.content.setAlign(1,0);
				this.content2.setAlign(1,0);
				this.content3.setAlign(0,0);
				this.content4.setAlign(1,0);
				
			}

			if(e === 'click' && p.node.liId === 'foot3'){
				this.content.setAlign(1,0);
				this.content2.setAlign(1,0);
				this.content3.setAlign(1,0);
				this.content4.setAlign(0,0);
			}

			var nodeChildren = p.node.getParent().getChildren();

			for(var i = 0; i < nodeChildren.length; i++){
				// nodeChildren[i].el.setContent(`<img src="images/home/foot${(i + 1)}.png"/><p>${list2[i]}</p>`);
				nodeChildren[i].el.setContent(`<img src="images/home/foot${(i + 1)}.png"/>`);
			}
			var index = nodeChildren.indexOf(p.node);

			// p.node.el.setContent(`<img src="images/home/foot${(index + 1)}_h.png"/><p style="color:#fe6a71;">${list2[index]}</p>`);
			p.node.el.setContent(`<img src="images/home/foot${(index + 1)}_h.png"/>`);

		}


		//首页6个按钮
		if(e === 'click' && p.node.liId === 'to0'){
			this.to('notice');
		}

		if(e === 'click' && p.node.liId === 'to1'){
			this.to('repair');
		}

		if(e === 'click' && p.node.liId === 'to2'){
			this.to('card');
		}

		if(e === 'click' && p.node.liId === 'to3'){

			// var phoneNmuber = p.node.phoneNmuber;

			new Ajax('/app_config/detail_user')
				.data({
					'key':'CUSTOMER_SERVICE',
					'id':signModel.findOne().id,
					'did':App.uuid,
					'tk':signModel.findOne().token
				})
				.success(function(d){
					if(d.status === 200){
						var phoneNmuber = d.data;
						this.playPhone.el.setAttribute('href','tel:'+phoneNmuber).draw();
						// console.log(this.playPhone)
						
						confirm(`确定要拨打电话${phoneNmuber}？`,function(res){

							if(res == 1){


								new CrossCall(function(){

									document.getElementById('playPhone').click();


								}).exec();

								
							}


						},'专属客服',['确定','取消']);
					}else if(d.status === 5){
						signModel.update({'id':signModel.findOne().id},{'token':null});
						alert('登录已过期，请登录后再联系！',function(){
							new CrossCall(function(){
									location.reload();
								}).exec();
						},'提示信息','确定')		
					}
				}.bind(this)).post();

			p.stopPropagation();

		}

		if(e === 'click' && p.node.liId === 'to4'){
			this.to('service');
		}

		if(e === 'click' && p.node.liId === 'to5'){
			this.to('businessRecord');
		}

		if(e === 'touchstart' && p.node.mark === 'tt'){
			p.node.el.addClass('opa8');
		}

		if(e === 'touchend' && p.node.mark === 'tt'){
			p.node.el.removeClass('opa8');
		}

		if(e === 'click' && p.node.listId === 'toMsgDetail'){
			this.to('noticeDetail',{'data':p.node.noticeData})
		}

		p.stopPropagation();

	}


}


//初始化温度背景界面
function initTemp(nodeAll){

	var date = new Date();
	var month = date.getMonth() + 1;
	var day = date.getDate();

	nodeAll.temp = nodeAll.addChild();

	nodeAll.temp.setSizeMode('relative','absolute')
					.setPosition(0,App.width * 49 / 75 - 20 + 53 + 210)
				 .setAbsoluteSize(null, App.width * 208 / 750 );

		nodeAll.temp.el = new DOMElement(nodeAll.temp,{
			classes:['temp'],
			content:`<h2>25℃</h2><p>chengdu<span>01/01</span></p>`
		});

		new Ajax('/weather/').data({
			'cityname':'成都',
			'key': signModel.findOne().token
		}).success(function(res){

			var res = JSON.parse(res);

			nodeAll.temp.el.setContent(`<h2>${res.result.data.realtime.weather.temperature}℃</h2><p>chengdu<span>${month}/${day}</span></p>`);

		}).error(function(res){
			console.log(res)
		}).get();

}

//初始化底部
function initFoot(nodeAll){

	nodeAll.foot = nodeAll.addChild();
	nodeAll.foot.setSizeMode('relative','absolute')
					 .setAbsoluteSize(null,50)
					 .setAlign(0,1)
					 .setMountPoint(0,1);
	nodeAll.foot.el = new DOMElement(nodeAll.foot,{
		classes:['footbox']
	});

	// var list2 = ['首页', '发现', '消息', '我的'];

	var inode = nodeAll.foot.addChild();
			inode.setSizeMode('relative','absolute')
					 .setAbsoluteSize(null,50)
					 .setProportionalSize(1/4)
		 inode.el = new DOMElement(inode,{
		 	classes:['footList'],
			// content:`<img src="images/home/foot1_h.png"/><p style="color:#fe6a71;">${list2[0]}</p>`
			content:`<img src="images/home/foot1_h.png"/>`
		 });

		 inode.mark = 'foot';
		 inode.liId = `foot0`;
		 inode.addUIEvent('click');

	for(var i = 1;i < 4;i++){
		var inode = nodeAll.foot.addChild();
				inode.setSizeMode('relative','absolute')
						 .setAbsoluteSize(null,50)
						 .setProportionalSize(1/4)
						 .setAlign(i/4,0)
			 inode.el = new DOMElement(inode,{
			 	classes:['footList'],
				// content:`<img src="images/home/foot${(i + 1)}.png"/><p>${list2[i]}</p>`
				content:`<img src="images/home/foot${(i + 1)}.png"/>`
			 });

			 inode.mark = 'foot';
			 inode.liId = `foot${i}`;
			 inode.addUIEvent('click');
	}

}

//初始化功能列表
function initActivity(node,nodeAll){

	nodeAll.activity = nodeAll.addChild();

	nodeAll.activity.setSizeMode('relative','absolute')
					.setPosition(0,App.width * 49 / 75 - 20 + 55)
				 .setAbsoluteSize(null,210);

	nodeAll.activity.el = new DOMElement(nodeAll.activity,{
		classes:['activity']
	})

	 var list = [
			{'img':'icon1.png','txt':'市场公告'},
			{'img':'icon2.png','txt':'在线报修'},
			{'img':'icon3.png','txt':'一卡通'},
			{'img':'icon4.png','txt':'专属客服'},
			{'img':'icon5.png','txt':'便民服务'},
			{'img':'icon6.png','txt':'商家生涯'}
		]
		var len = list.length;
		for(var i = 0;i < len;i++){

			var str = '';
			var num = Math.ceil((i + 0.1) / 3 - 1);
			var inode = nodeAll.activity.addChild();
					inode.setSizeMode('relative','absolute')
							 .setAbsoluteSize(null,95)
							 .setProportionalSize(1/3)
							 .setPosition(0,15 + num * 95)
							 .setAlign(i%3*1/3,0);

			// if(list[i].phoneNmuber){
			// 	var kfPhone = list[i].phoneNmuber;
			// 	str = `<img src="images/home/${list[i].img}" id="phoneNmuber"/><p>${list[i].txt}</p>`
			// 	inode.phoneNmuber = list[i].phoneNmuber;
			// }else{
				str = `<img src="images/home/${list[i].img}"/><p>${list[i].txt}</p>`
			// }
	 
			inode.el = new DOMElement(inode,{
				classes:['icoBox'],
				content:str
			});

			// if(list[i].phoneNmuber){

			// 	inode.phoneNmuber = list[i].phoneNmuber;

			// }

			inode.liId = `to${i}`;
			inode.addUIEvent('click');
			inode.mark = 'tt';
			inode.addUIEvent('touchstart');
			inode.addUIEvent('touchend');
		}

		//拨打电话专用
		node.playPhone = nodeAll.addChild();
		node.playPhone.setAlign(-2,0)
			.el = new DOMElement(node.playPhone,{
				'tagName':'a',
				'id':'playPhone'
		});

}


//初始化Message
function initMessage(nodeAll){

	var userSign = signModel.findOne();
	var msgData = '';

	nodeAll.message = nodeAll.addChild();

	nodeAll.message.setSizeMode('relative','absolute')
					.setPosition(0,App.width * 49 / 75 - 20)
				 .setAbsoluteSize(null,55);

	nodeAll.message.el = new DOMElement(nodeAll.message,{

							classes:['l_message'],

							content:`<div class="messageBox"><i></i><p>9月26日中益吉城青白江园区正式开业啦！</p></div>`

						});
	nodeAll.message.addUIEvent('click');
	nodeAll.message.listId = 'toMsgDetail';

	new Ajax('/message_info/lists_user')
				.data({
					'type':1,
					'id':userSign.id,
					'did':App.uuid,
					'tk':userSign.token
				})	
	    		.success(function(d){
	    			
	    			if(d.status === 200){

	    				msgData = d.data[0];   					
    					nodeAll.message.el.setContent(`<div class="messageBox"><i></i><p>${msgData.InfoTitle}</p></div>`)
						nodeAll.message.noticeData = d.data[0];
	    			}
	    			
	    				
	    		}).post();

}


//初始化banner
function initBanner(nodeAll){

	new Ajax('/app_advert/lists_user').data({'did':App.uuid}).success(function(res){

	
		var bannerList = res.data;

		var banner = nodeAll.addChild();
				banner.setSizeMode('relative','absolute')
							.setAbsoluteSize(null,App.width * 49 / 75 - 20)

				banner.el = new DOMElement(banner,{
					classes:['banner']
				});

				banner.addUIEvent('click');

				var len = bannerList.length;

				if(len == 1){

					var bannerItem = banner.addChild();
					bannerItem.setSizeMode('relative','absolute')
										.setAbsoluteSize(null,App.width * 49 / 75 - 20)
										.setAlign(0,0);

					bannerItem.el = new DOMElement(bannerItem,{
						content:`<img src="${bannerList[0].img}">`
					});

					return;

				}

				//左边第一个bannerItem
				var bannerFirstItem = banner.addChild();
						bannerFirstItem.setSizeMode('relative','absolute')
													 .setAbsoluteSize(null,App.width * 49 / 75 - 20)
											.setAlign(-1,0);

						bannerFirstItem.el = new DOMElement(bannerFirstItem,{
							content:`<img src="${bannerList[len - 1].img}">`
						});

				for(var i = 0;i < len; i++){

					var bannerItem = banner.addChild();
					bannerItem.setSizeMode('relative','absolute')
										.setAbsoluteSize(null,App.width * 49 / 75 - 20)
										.setAlign(i,0);

					bannerItem.el = new DOMElement(bannerItem,{
						content:`<img src="${bannerList[i].img}">`
					});

				}

				

				//右边最后一个bannerItem
				var bannerLastItem = banner.addChild();
						bannerLastItem.setSizeMode('relative','absolute')
													.setAbsoluteSize(null,App.width * 49 / 75 - 20)
											.setAlign(len,0);

						bannerLastItem.el = new DOMElement(bannerLastItem,{
							content:`<img src="${bannerList[0].img}">`
						});

	//banner图的圆点
  var str = '';
  
  for(var i = 0; i < len - 1; i++){
  	str += '<div class="point"></div>'
  }

  banner.pointBox = banner.addChild();
  banner.pointBox.setSizeMode('relative','absolute')
  							 .setAbsoluteSize(null,18)
  							 .setAlign(0,1)
  							 .setMountPoint(0,1);

  banner.pointBox.el = new DOMElement(banner.pointBox,{
  	content:`<div class="pointBox" id="pointBox"><div class="point on"></div>${str}</div>`
  });
  banner.pointBox.addUIEvent('click');


  //banner图滑动
	var sonGesture = new GestureHandler(banner);
	var index = 0;
	len += 1;

  sonGesture.on('drag',function(e){

    if(e.status == 'end' && e.centerDelta.x != 0){

    	banner.childrens = banner.getChildren();

    	if(e.centerDelta.x < 0){

    		index++;

				for(var i = 0;i < (len + 1);i++){

						banner.childrens[i].setAlign((banner.childrens[i].getAlign()[0] - 1),0);
						banner.childrens[i].el.addClass('l_trans');

						if(i == len && index == (len-1)){

								setTimeout(function(){
									for(var i = 0;i < (len + 1);i++){
										banner.childrens[i].el.removeClass('l_trans');
										banner.childrens[i].setAlign((i - 1),0);
											
									}
									index = 0;
								},300);
								
						}
				}

    	}else if(e.centerDelta.x > 0){

	    	index--;

				for(var i = 0;i < (len + 1);i++){

						banner.childrens[i].setAlign((banner.childrens[i].getAlign()[0] + 1),0);
						banner.childrens[i].el.addClass('l_trans');

						if(i == len && index == -1){
						
								setTimeout(function(){
									for(var i = 0;i < (len + 1);i++){

										banner.childrens[i].el.removeClass('l_trans');
										banner.childrens[i].setAlign((i - len + 1),0);
											
									}

									index = len - 2;

								},300);
								
						}
				}

	    }

	    //给banner图加圆点
	    var args = {};
	    args.index = index;
	    args.len = len - 1;

	    new CrossCall(function(args){

	    	if(args.index == args.len){

	    		args.index = 0;

	    	}else if(args.index == -1){

	    		args.index = args.len - 1;

	    	}

	    	var pointBox = document.getElementById('pointBox').getElementsByTagName('div');

	    	var len2 = pointBox.length;

	    	for(var i = 0; i < len2; i++){

    			pointBox[i].className = 'point';

	    	}

	    	pointBox[args.index].className = 'point on';

	    },[args]).exec();
    }

  });


	}).error(function(){

		var banner = nodeAll.addChild();
				banner.setSizeMode('relative','absolute')
							.setAbsoluteSize(null,App.width * 49 / 75 - 20)

				banner.el = new DOMElement(banner,{
					classes:['banner']
				});


				var bannerItem = banner.addChild();
				bannerItem.setSizeMode('relative','absolute')
									.setAbsoluteSize(null,App.width * 49 / 75 - 20);

				bannerItem.el = new DOMElement(bannerItem,{
					content:`<img src="images/home/default_bg.png">`
				});

	}).post()



  
}

module.exports = home;