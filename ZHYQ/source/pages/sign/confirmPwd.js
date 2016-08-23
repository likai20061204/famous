var DOMElement   = require('famous/dom-renderables/DOMElement');
var Page = require('Page');
var Nav = require('navbar');
var Button = require('button');
var InputCustom = require('inputCustom');
var App = require('App');
var Tips = require('Tips');
var Ajax = require('Ajax');


var pwd = '',
	rpwd = ''; 

class ResetPwd extends Page{
	constructor(data){
		super({id:'ResetPwd'});

		this.data = data;
		// console.log(data);
	}

	onCreate(data){
		super.onCreate();
		initHeader(this);
		
	}

	onResume(){
		super.onResume();

		if(!this._formCon){
			initForm(this);
		}
		
	}

	onDestroy(){
		var _this = this,
		obj = this.getChildren(),
		i = obj.length;

		while(i--)
			this.removeChild(obj[i]);

		super.onDestroy();

		this._formCon = null;
	}
}

//初始化头部
function initHeader(node){
	var navbar = new Nav('重设密码');
	navbar.el.addClass('no_color_nav');
	node.addChild(navbar);

	var resetBg = node.addChild();

	resetBg
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,0.741333*App.width)
		.el = new DOMElement(resetBg,{
			tagName:'img',
			attributes:{
				'src':'./images/sign/setpwd_bg.jpg'
			}
		})

	var logo = node.addChild();
	
	logo
		.setSizeMode('absolute','absolute')
		.setAbsoluteSize(90,90)
		.setAlign(0.5,0.2)
		.setMountPoint(0.5,0.2)
		.el = new DOMElement(logo,{
			tagName:'img',
			attributes:{
				'src':'./images/sign/login_logo.png'
			}
		})	

}

//初始化表单
function initForm(node){
	var _this = node;
	var FormCon = node.addChild();

	FormCon
		.setSizeMode('relative','relative')
		.setProportionalSize(0.7,0.5)
		.setAlign(.5,.5)
		.setMountPoint(.5)
		.el = new DOMElement(FormCon,{
			classes:['form_con']
		})

	node._formCon = FormCon; 	

	


	var pwdInput_1 = FormCon.addChild(new InputCustom());

	pwdInput_1
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,50)
		.setProportionalSize(.8)
		.setAlign(.5)
		.setMountPoint(.5)
		.el = new DOMElement(pwdInput_1,{
			classes:['pwd_input'],
			attributes:{
				'type':'password',
				'placeholder':'输入新密码',
				'maxlength':12
			}
		})

	pwdInput_1.inputEvent = function(e,p){
		pwd = p.value;
	}

	var pwdInput_2 = FormCon.addChild(new InputCustom());

	pwdInput_2
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,50)
		.setProportionalSize(.8)
		.setAlign(.5)
		.setMountPoint(.5)
		.setPosition(0,50+20)
		.el = new DOMElement(pwdInput_2,{
			classes:['pwd_input'],
			attributes:{
				'type':'password',
				'placeholder':'确认密码',
				'maxlength':12
			}
		})

	pwdInput_2.inputEvent = function(e,p){
		rpwd = p.value;
	}


	var submitBtn = FormCon.addChild(new Button('确定'));

	submitBtn
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,50)
		.setPosition(0,135+20)
		.setAlign(.5)
		.setMountPoint(.5)
		.el = new DOMElement(submitBtn,{
			classes:['submit_btn']
		})

	submitBtn.clickEvent = function(e,p){

		if(!pwd || ! rpwd){
			alert('密码不能为空','','提示信息','确定');
			return false;

		}else if(pwd != rpwd){
			alert('两次输入的密码不一致','','提示信息','确定');
			return false;
		}else{
			new Ajax('/users/retrieve')
				.data({
					'phone':_this.data.tel,
					'vcode':_this.data.vcode,
					'pwd':pwd,
					'rpwd':rpwd,
					'did':App.uuid
				})
				.success(function(d){
					if(d.status === 200){
						_this.to('home');
					}else{
						alert(d.msg,'','提示信息','确定');
					}

				}).post();
			
		}

		
	}
}

module.exports = ResetPwd;