var Node = require('famous/core/Node');
var DOMElement = require( 'famous/dom-renderables/DOMElement' );
var IconItem = require('IconItem');
var CrossCall = require("famous/core/CrossCall");
var myInfoModel = require('model/myInfoModel');
var signModel = require('model/signModel');
var App = require('App');
var Ajax = require('Ajax');


class personalCenter extends Node{

	constructor(){

		super();

		initPage(this);

	}

	onReceive(e,p){

		if(e === 'click' && p.node.liId === 'mine1'){

			this.getParent().to('myinfo');

		}
		if(e === 'click' && p.node.liId === 'mine2'){

			this.getParent().to('code');

		}
		if(e === 'click' && p.node.liId === 'mine3'){

			this.getParent().to('setting');

		}

		if(e === 'click' && p.node.liId === 'canmera'){

			new CrossCall(function(){

					navigator.camera.getPicture(function(imageURI){

						document.getElementById('p_avatar').src = imageURI;

						self._call(imageURI);

					})

			}).exec(function(imageURI){

				myInfoModel.save({imgSrc:imageURI});

				this.imgSrc = myInfoModel.findOne().imgSrc;

			});

		}

	}


}

function initPage(nodeAll){

	setTimeout(function(){

		new Ajax('/member/detail_custom').data({
			'id':signModel.findOne().id,
			'did':App.uuid,
			'tk':signModel.findOne().token
		}).success(function(res){

			var str = '';

			if(res.status === 200){
				var list = res.data;

				if(myInfoModel.findOne()){

					str = `<h2>${list.name}</h2>
								<p>欢迎您，欢迎使用智慧云平台物业APP</p>
								<div class="p_avatar"><img src="${myInfoModel.findOne().imgSrc}"  id="p_avatar"/></div>
								<ul>
									<li>
										<img src="images/home/p1.png"/>${list.address}
									</li>
									<li>
										<img src="images/home/p2.png"/>${list.gradename}
									</li>
									<li>
										<img src="images/home/p3.png"/>${list.store} 家
									</li>
								</ul>`
				}else{
					str = `
						<h2>${list.name}</h2>
						<p>欢迎您，欢迎使用智慧云平台物业APP</p>
						<div class="p_avatar"><img src="images/home/p_lk.jpg"  id="p_avatar"/></div>
						<ul>
							<li>
								<img src="images/home/p1.png"/>${list.address}
							</li>
							<li>
								<img src="images/home/p2.png"/>${list.gradename}
							</li>
							<li>
								<img src="images/home/p3.png"/>${list.store} 家
							</li>
						</ul>
					`
				}
			}else if(res.status === 5){
				var userSign = signModel.findOne();
				alert('登录已过期，请重新登录！',function(){
					signModel.update({'id':userSign.id},{'token':null});
					new CrossCall(function(){
						location.reload();
					}).exec();
				},'提示信息','确定');
			}


			nodeAll.head = nodeAll.addChild();
			nodeAll.head.setSizeMode('relative','absolute')
									.setAbsoluteSize(null,310);

			nodeAll.head.el = new DOMElement(nodeAll.head,{
				classes:['p_top'],
				content:str
			});

			//照相机
			nodeAll.head.canmera = nodeAll.head.addChild();
			nodeAll.head.canmera.setSizeMode('absolute','absolute')
													.setAbsoluteSize(90,90)
													.setPosition(0,100)
													.setAlign(.5,0)
													.setMountPoint(.5,0);

			nodeAll.head.canmera.el = new DOMElement(nodeAll.head.canmera);
			nodeAll.head.canmera.liId = 'canmera';
			nodeAll.head.canmera.addUIEvent('click');


			//个人中心按钮
			nodeAll.listBox = nodeAll.addChild();
			nodeAll.listBox.setDifferentialSize(0,0);
			nodeAll.listBox.el = new DOMElement(nodeAll.listBox);

			var inode1 = nodeAll.listBox.addChild(new IconItem({'icon':'images/home/p_list1.png','desc':'我的资料'},0,50));
			inode1.liId = 'mine1';
			inode1.addUIEvent('click');

			var inode2 = nodeAll.listBox.addChild(new IconItem({'icon':'images/home/p_list2.png','desc':'我的二维码'},1,50));
			inode2.liId = 'mine2';
			inode2.addUIEvent('click');

			var inode3 = nodeAll.listBox.addChild(new IconItem({'icon':'images/home/p_list3.png','desc':'设置'},2,50));
			inode3.liId = 'mine3';
			inode3.addUIEvent('click');

			}).post();


	},100)
 
	

}

module.exports = personalCenter;