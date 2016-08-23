var DOMElement   = require('famous/dom-renderables/DOMElement');
var Page = require('Page');
var Nav = require('navbar');
var Button = require('button');
var InputCustom = require('inputCustom');
var App = require('App');
var Ajax = require('Ajax');
var Tips = require('Tips');

var phoneNum = '',
	codeNum = '';
var timer = null;
var loading = false;

class ResetPwd extends Page{
	constructor(){
		super({id:'ResetPwd'});
	}

	onCreate(){
		super.onCreate();
		initHeader(this);
	}

	onResume(){
		super.onResume();

		if(!this._fromCon){
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
		this._fromCon = null;
	}
}

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

	node._fromCon = FormCon;	
	


	var phoneInput = FormCon.addChild(new InputCustom());

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

	var codeBox = FormCon.addChild();

	codeBox
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,50)
		.setProportionalSize(.8)
		.setAlign(.5)
		.setMountPoint(.5)
		.setPosition(0,50+20)
		.el = new DOMElement(codeBox,{
			classes:['code_box']
		})

	var codeInput = codeBox.addChild(new InputCustom());

	codeInput
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,50)
		.setProportionalSize(.4)
		.el = new DOMElement(codeInput,{
			classes:['code_input'],
			attributes:{
				'type':'text',
				'placeholder':'验证码',
				'maxlength':'6'
			}
		})

	codeInput.inputEvent = function(e,p){
		codeNum = p.value;
	}

	var codeBtn = codeBox.addChild(new Button('获取验证码'));

	codeBtn
		.setSizeMode('absolute','absolute')
		.setAbsoluteSize(85,25)
		.setPosition(0,18)
		.setAlign(1)
		.setMountPoint(1)
		.el = new DOMElement(codeBtn,{
			classes:['code_btn']
		})

	codeBtn.clickEvent = function(e,p){
		
		if(!/^(\+?86 ?)?1\d{10}$/g.test(phoneNum)){
			alert('你输入的手机号有误','','提示信息','确定');
			return false;
		}

		new Ajax('/users/vcode')
			.path({'phone':phoneNum,'gtype':2,'did':App.uuid})
			.success(function(d){
				if(d.status === 200){
					alert('验证码已发送到你的手机，3分钟内输入有效',codeTimer(codeBtn,d.data.time),'提示信息','确定');
				}else{
					alert(d.msg,'','提示信息','确定');
				}
			}).get();

		
		
	}


	var nextBtn = FormCon.addChild(new Button('下一步'));

	nextBtn
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,50)
		.setPosition(0,135+20)
		.setAlign(.5)
		.setMountPoint(.5)
		.el = new DOMElement(nextBtn,{
			classes:['login_btn']
		})

	nextBtn.clickEvent = function(e,p){
		if(!/^(\+?86 ?)?1\d{10}$/g.test(phoneNum)){
			alert('你输入的手机号有误','','提示信息','确定');
			return false;
		}

		if(!codeNum){
			alert('验证码不正确','','提示信息','确定');
			return false;
		}

		_this.to('confirmPwd',{data:{'tel':phoneNum,'vcode':codeNum,'checkLogin':0}});
		
		phoneNum = '';
		codeNum = '';
		clearValue([phoneInput,codeInput]);
	}
}

//验证码倒计时
function codeTimer(node,t){
	var _this = node;
	var time = t;
	
	if(!loading){
		_this.el.setContent(time+'s');
		timer = setInterval(function(){
			loading = true;
			time--;
			if(time < 0){
				clearInterval(timer);
				_this.el.setContent('获取验证码');
				loading = false;
			}else{
				_this.el.setContent(time+'s');
			}

		},1000)
		
	}
	
	
	
}

//清除value值
function clearValue(obj){
	obj.forEach(function(o){
		o.el.setAttribute('value','').draw();
	});
	
}

module.exports = ResetPwd;