var Page = require('Page')
var DOMElement = require('famous/dom-renderables/DOMElement');
var Nav = require('navbar');
var IconItem = require('IconItem');
var App = require('App');
var CrossCall = require('famous/core/CrossCall');
var Tips = require('Tips');
var Ajax = require('Ajax');
var sign = require('model/SignModel');
var versionModel = require('model/VersionModel');

class Setting extends Page{
	constructor(){
		super({id:'Setting'})
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
		var obj = this.getChildren(),
			i = obj.length;

		while( i--){
			this.removeChild(obj[i]);
		}

		super.onDestroy();
	}

	onReceive(e,p){
		if(e === 'click' && p.node.listId === 'type0'){
			var version = versionModel ? versionModel.findOne().version : '1.0.5';

			version ? this.to('aboutUs',{data:version}) : this.to('aboutUs');
		}	

		if(e === 'click' && p.node.listId === 'type1'){
			// console.log('update');

			new CrossCall(function(){
				cordova.getAppVersion.getVersionNumber(function (v) {

	   			self._call(v);
					});
			}).exec(function(v){
				checkUpdate(v);
			});

			// alert('当前已是最新版本','','提示信息','确定');
		}	

		if(e === 'click'  && p.node.listId === 'type2'){
			var userSign = sign.findOne();
			confirm('确认要退出登录？',function(i){
				if(i === 1){
					new Ajax('/users/loginout')
						.path({'id':userSign.id,'tk':userSign.token,'did':App.uuid})
						.success(function(d){
							alert('你已安全退出',function(){
								sign.update({'id':userSign.id},{'token':null});
								new CrossCall(function(){
									location.reload();
								}).exec();
							},'提示信息','确定');
						}).get();
				}
			},'提示信息',['确认','取消'])
			
		} 

		p.stopPropagation();
	}
}

function initNav(node){
	var navbar = new Nav('设置');
	navbar.el.addClass('no_color_nav');
	node.addChild(navbar);
}

function initContent(node){
	
	//设置itemJson数据('android')
	var SetJson = [
		{'icon':'./images/setting/about_us.png','desc':'关于我们','tp':'type0'},
		{'icon':'./images/setting/check.png','desc':'检查新版本','tp':'type1'},
		{'icon':'./images/setting/sign_out.png','desc':'退出登陆','tp':'type2'},
	]

	if(App.platform == 'ios'){
		SetJson = [
			{'icon':'./images/setting/about_us.png','desc':'关于我们','tp':'type0'},
			{'icon':'./images/setting/sign_out.png','desc':'退出登陆','tp':'type2'},
		]
	}
	
	
	var con = node.addChild();

	con
		.setSizeMode('relative','relative')
		.el = new DOMElement(con,{
			classes:['setting_con']
		});

	var headerBg = con.addChild();
	var bgH = 0.4226666*App.width;

	headerBg
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,bgH)
		.el =  new DOMElement(headerBg,{
			tagName:'img',
			attributes:{
				'src':'./images/setting/header_bg.jpg'
			}
		})

	var itemBox = con.addChild()

	itemBox
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,3*50)
		.setPosition(0,bgH)	

	SetJson.forEach(function(obj,i){
		var setting_item = new IconItem(obj,i,50)

		setting_item.listId = obj.tp;
		setting_item.addUIEvent('click');

		itemBox.addChild(setting_item); 

	})
}

//检测版本信息
function checkUpdate(v){
    	new Ajax('/app_version/single').data({'did':App.uuid}).success(function(d){
    		if(d.status === 200){
    			if (d.data) {

	    			var data = d.data;
	    			// console.log(data)
	    			var serverV = data.version.split('.')[2];
	    			var currentV = v.split('.')[2];

	    			if(currentV !== serverV){

	    				confirm('我们已发现新版本，是否先前往下载？',function(i){
	    					if(i == 1){
	    					new CrossCall(function(data){
								window.open(data.path);
							},[data]).exec();
	    					}
	    				},'检查更新',['确定','取消']);
	    			}else{
	    				alert('当前版本已经是最新',null,'提示','确定');
	    			}
	    		}else{
	    			alert('当前版本已经是最新',null,'提示','确定');
	    		}
    		}else{
    			alert(d.msg,null,'提示','确定');
    		}
    	}).post();
}

module.exports = Setting;