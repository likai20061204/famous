var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var navbar = require('navbar');
var App = require('App');
var Ajax = require('Ajax');
var signModel = require('model/signModel');
var CrossCall = require('famous/core/CrossCall');

class myinfo extends Page{

	constructor(){
		super({
			id:'myinfo'
		});
	}

	onCreate(){

		super.onCreate();

		

		initPage(this);

		initContent(this);

	}

	onResume(){

		super.onResume();

	}

	onDestroy(){

		var obj = this.getChildren(),
				i = obj.length;

		while(i--){
			this.removeChild(obj[i]);
		}

		super.onDestroy();

	}

	onReceive(e,p){

		if(e === 'click' && p.node.liId === 'seemore'){

			new CrossCall(function(){

				var info = document.getElementsByClassName('infoShopBox');
				var l_more = document.getElementsByClassName('l_more');

				info[0].className = 'infoShopBox';
				l_more[0].className = 'l_more hide';

			}).exec();

		}

	}

}

function initContent(nodeAll){

	new Ajax('/user_store/list_id').data({
		'id':signModel.findOne().id,
		'did':App.uuid,
		'tk':signModel.findOne().token
	}).success(function(res){

		// res = {
		//   "data": [
		//     {
		//       "id": 217,
		//       "name": "C01-1-116"
		//     },
		//     {
		//       "id": 217,
		//       "name": "C01-1-116"
		//     },
		//     {
		//       "id": 217,
		//       "name": "C01-1-116"
		//     },
		//     {
		//       "id": 217,
		//       "name": "C01-1-116"
		//     },
		//     {
		//       "id": 217,
		//       "name": "C01-1-116"
		//     }
		//   ],
		//   "msg": "成功",
		//   "status": 200
		// }

		var list = res.data,
				len = list.length,
				str = '',
				abc = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','R','S','T','U','V','W','X','Y','Z'];

		str += `<div class="infoShopBox infoShopBox_h">`;
		for(var i = 0; i < len; i++){

			str += `<dl class="info_dl">
								<dt>
									<h2>${abc[i]}</h2>
									<p>店铺</p>
								</dt>
								<dd>
									<h2>${list[i].name}</h2>
									<p>青白江区城清泉大道街53号  (国际物流园区旁)</p>
								</dd>
							</dl>`

		}

		str += `</div>`;

		new Ajax('/grade_config/lists_user').data({
			'id':signModel.findOne().id,
			'did':App.uuid,
			'tk':signModel.findOne().token
		}).success(function(res){

			var list = res.data,
					len2 = list.list.length;

			if(len < 3){
				str += `
						<div class="infoBox">
							<div class="infoname">
								<img src="images/home/myinfo.png"/>
								<p>${list.gradename}</p>
							</div>
							<div class="l_info">
								<h2>尊敬的${list.username}:</h2>
								<p>根据你当前的商户等级，你可享有的权益如下</p>
							`
				}else{
					str += `<div class="l_more">查看更多店铺信息</div>
						<div class="infoBox">
							<div class="infoname">
								<img src="images/home/myinfo.png"/>
								<p>${list.gradename}</p>
							</div>
							<div class="l_info">
								<h2>尊敬的${list.username}:</h2>
								<p>根据你当前的商户等级，你可享有的权益如下</p>
							`

				}

			

			for(var j = 0; j < len2; j++){
				str += `<dl>
									<dt>${list.list[j].name}</dt>
									<dd>${list.list[j].desc}</dd>
								</dl>`
			}


			str += `</div>
						</div>`

			nodeAll.content = nodeAll.addChild();
			nodeAll.content.setDifferentialSize(-20,-100)
										 .setPosition(10,50);

			nodeAll.content.el = new DOMElement(nodeAll.content,{
				classes:['overflow_auto','myinfoContent'],
				content:str
			});

			var seemore = nodeAll.addChild();

			seemore.setSizeMode('relative','absolute')
							.setAbsoluteSize(null,80)
							.setPosition(0,220);

			seemore.el = new DOMElement(seemore);
			seemore.el.setProperty('z-index','100');

			seemore.liId = 'seemore';
			seemore.addUIEvent('click');


		}).post();


	}).post();

	

}

	
function initPage(nodeAll){

	nodeAll.top = nodeAll.addChild();

	nodeAll.top.setSizeMode('relative','absolute')
				 .setAbsoluteSize(null,175);

	nodeAll.top.el = new DOMElement(nodeAll.top,{

		classes:['myinfo_top']

	});

	nodeAll.title = nodeAll.addChild(new navbar('我的资料'));
	nodeAll.title.el.setProperty('background','none');

}

module.exports = myinfo;