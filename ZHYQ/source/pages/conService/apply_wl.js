var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var CrossCall = require('famous/core/CrossCall');
var navbar = require('navbar');
var Ajax = require('Ajax');
var signModel = require('model/signModel');
var App = require('App');

class apply_wl extends Page{

	constructor(){
		super({
			id:'apply'
		});
	}

	onCreate(){

		super.onCreate();

		this.addChild(new navbar('物流信息'));

		this.content = this.addChild();
		this.content.setSizeMode('relative','relative')
								.setDifferentialSize(0,-45)
								.setPosition(0,45);

		new DOMElement(this.content,{
			classes:['overflow_auto','bgh']
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

		if(e === `click` && p.node.liId === `phone_wl`){

			var phoneNumber = p.node.phoneNumber;
					this.phoneId = p.node.phoneId;

			confirm(`确定要拨打电话${phoneNumber}？`,function(res){

				var phoneId = this.phoneId;

				if(res == 1){
					
					new CrossCall(function(phoneId){
						console.log(phoneId);
						document.getElementById(phoneId).click();

					},[phoneId]).exec();

				}

			}.bind(this),`拨打电话`,[`确定`,`取消`]);

			p.stopPropagation();

		}

	}


}

function initPage(nodeAll){

	new Ajax('/transport/lists').data({
		'id':signModel.findOne().id,
		'did':App.uuid,
		'tk':signModel.findOne().token
	}).success(function(res){

		var list = res.data;
		var len = list.length;
		for(var i = 0; i < len; i++){

			var str = '';
			// var phoneArray = list[i].phone.split('~');
			// var len2 = phoneArray.length;
			// for(var j = 0; j < len2; j++){
				str += `<a href="javascript:;">${list[i].phone}</a>`
			// }

			var inode = nodeAll.addChild();
					inode.setSizeMode('relative','absolute')
							 .setAbsoluteSize(null,170)
							 .setPosition( 0, i * (170 + 8 ));

					inode.el = new DOMElement(inode,{
						classes:['list_wl'],
						content:`<dl>
												<dt>${list[i].name}</dt>
												<dd>
													<p class="p1"><i></i>${list[i].address}</p>
													<p class="p2"><i></i>${list[i].range}</p>
												</dd>
											</dl>
											<p class="ul_phone">
												<i></i>
												${str}
											</p>
										`
					});

					inode.phoneNumber = list[i].phone;
					inode.liId = 'phone_wl';
					inode.phoneId = `playPhone${i}`;
					inode.addUIEvent('click');

			//拨打电话专用
			var playPhone = nodeAll.addChild();
			playPhone.setAlign(-2,0);
			playPhone.el = new DOMElement(playPhone,{
				content:`<a href="tel:${list[i].phone}" id="playPhone${i}"></a>`
			});

		}


	}).post();


}



module.exports = apply_wl;