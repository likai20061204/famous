var DOMElement   = require('famous/dom-renderables/DOMElement');
var Page = require('Page');
var Button = require('button');
var InputCustom = require('inputCustom');
var Tips = require('Tips');
var App = require('App');
var Ajax = require('Ajax');
var sign = require('model/SignModel');

var phoneNum = '',
	psd = '';

class Login extends Page{
	constructor(){
		super({id:'Login'});
	}

	onCreate(){
		super.onCreate();

		initContent(this);
	}

	onDestroy(){
		var _this = this,
		obj = this.getChildren(),
		i = obj.length;

		while(i--)
			this.removeChild(obj[i]);

		super.onDestroy();

	}
}

function initContent(node){
	var _this = node;

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


	var loginCon = node.addChild();

	loginCon
		.setSizeMode('relative','relative')
		.setProportionalSize(0.7,0.5)
		.setAlign(.5,.5)
		.setMountPoint(.5)
		.el = new DOMElement(loginCon,{
			classes:['login_con']
		})

	

	//输入手机号input框
	var phoneInput = loginCon.addChild(new InputCustom());

	phoneInput
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,50)
		.setProportionalSize(.8)
		.setAlign(.5)
		.setMountPoint(.5)
		.el = new DOMElement(phoneInput,{
			classes:['phone_input'],
			attributes:{
				'type':'tel',
				'maxlength':'11',
				'placeholder':'请输入手机号'
			}
		})

	phoneInput.inputEvent = function(e,p){
		phoneNum = p.value;
	}

    //输入密码input框
	var pwdInput = loginCon.addChild(new InputCustom());

	pwdInput
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,50)
		.setProportionalSize(.8)
		.setAlign(.5)
		.setMountPoint(.5)
		.setPosition(0,50+20)
		.el = new DOMElement(pwdInput,{
			classes:['password_input'],
			attributes:{
				'type':'password',
				'placeholder':'密码'
			}
		})

	pwdInput.inputEvent = function(e,p){
		psd = p.value;
	}

	//登录按钮
	var loginBtn = loginCon.addChild(new Button('登录'));

	loginBtn
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,50)
		.setPosition(0,135+20)
		.setAlign(.5)
		.setMountPoint(.5)
		.el = new DOMElement(loginBtn,{
			classes:['login_btn']
		})

	loginBtn.clickEvent = function(e,p){
		if(!/^(\+?86 ?)?1\d{10}$/g.test(phoneNum)){
			alert('请输入正确手机号码','','提示信息','确定');
			return false;
		}

		var userSign = sign.findOne();

		new Ajax('users/login')
			.data({'name':phoneNum,'pwd':psd,'did':App.uuid})
			.success(function(d){
				if(d.status === 200){
					var data = d.data;
					
					if(userSign){
						sign.update({'id':userSign.id},{'id':data.id,'token':data.tk,'tel':phoneNum,'first':false});	
					}else{
						sign.save({'id':data.id,'token':data.tk,'tel':phoneNum,'first':true});
					}

					_this.to('home',{data:{'checkLogin':0}});
					phoneInput.el.setAttribute('value','').draw();
					pwdInput.el.setAttribute('value','').draw();
					phoneNum = '';
					psd = '';

					_this.onDestroy();
					
				}else{
					alert(d.msg,'','提示信息','确定');
					return false;
				}
			})
			.error(function(){
				alert('服务器请求超时！','','提示信息','确定');
			})
			.timeout(function(){
				alert('服务器请求超时！','','提示信息','确定');
			}).post();
	}

	//修改密码按钮
	var changePwd = loginCon.addChild(new Button('忘记密码？'));

	changePwd
		.setSizeMode('absolute','absolute')
		.setAbsoluteSize(80,30)
		.setAlign(.5,.9)
		.setMountPoint(.5,.9)
		.el = new DOMElement(changePwd,{
			classes:['change_pwd']
		})

	changePwd.clickEvent = function(e,p){
		_this.to('resetPwd',{data:{'checkLogin':0}});

	}
		
}


module.exports = Login;
