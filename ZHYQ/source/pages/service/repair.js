var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var navbar = require('twoBtnNav');
var button = require('button');
var inputCustom = require('inputCustom');
var App = require('App');
var Ajax = require('Ajax');
var sign = require('model/SignModel');
var datetime = '',mobile = '',adds = '',desc = ''; 

class Repair extends Page{
	constructor(){
		super({id:'Repair'})
	}

	onCreate(){
		super.onCreate();

		initNav(this);

		var userSign = sign.findOne();

		new Ajax('/user_store/list_id')
			.data({
				'id':userSign.id,
				'did':App.uuid,
				'tk':userSign.token
			})
			.success(function(d){
				if(d.status === 200){
					this.shopData = d.data;
				}else{
					this.shopData = null;
				}
			}.bind(this)).post();
	}

	onResume(){
		super.onResume();

		if(!this._content){

			initContent(this,this.shopData);
		}

	}

	onDestroy(){
		var _this = this,
		obj = this.getChildren(),
		i = obj.length;

		while(i--)
			this.removeChild(obj[i]);

		super.onDestroy();

		this._content = null;
	}

	clean(){
		this.telInput.el.setAttribute('value','').draw();
		this.descTextarea.el.setAttribute('value','').draw()
	}

}


function initNav(node){
	var backButton = new button(" ","","goback2");
	var _this = node;

	// backButton.setAbsoluteSize(44,44);
	backButton.clickEvent = function(){
		_this.clean();
		_this.back();
	};

	var rightText = new button('报修记录','','right_text');
	rightText.setAbsoluteSize(100,44);
	rightText.clickEvent = function(){
		_this.to('repairRecord');
	};

	node.addChild(new navbar('在线报修',backButton,rightText));
}

function getNowDate(){
	var date = new Date();

	var year = date.getFullYear(),
		mon = ('0'+(date.getMonth()+1)).substr(-2),
		day = ('0'+date.getDate()).substr(-2),
		hour = ('0'+date.getHours()).substr(-2),
		min = ('0'+date.getMinutes()).substr(-2),
		sec = ('0'+date.getSeconds()).substr(-2)

	return year+'-'+mon+'-'+day+'T'+hour+':'+min+':'+sec;
}

function initContent(node,data){

	var _this = node;

	var shopJson = data;

	var content = node.addChild();
	content.setSizeMode('relative','relative')
		   .setDifferentialSize(0,-44)
		   .setPosition(0,44)
		   .el = new DOMElement(content,{
		   		classes:['repair_con']
		   })

	node._content = content;	   

	var form = content.addChild();
	var form_item = `<ul>
						<li class="date"><span>报修时间</span></li>
						<li class="tel"><span>联系号码</span></li>
						<li class="adds"><span>报修地址</span></li>
						<li class="desc"><span>问题描述</span></li>
				    </ul>`;

	form.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,414)
		.setDifferentialSize(-28)
		.setAlign(.5)
		.setMountPoint(.5)
		.setPosition(0,16)
		.el = new DOMElement(form,{
			classes:['repair_form'],
			content:form_item

		});


	var dateInput = new inputCustom();
		
	datetime = getNowDate();
		// console.log(nowTime);

		dateInput
			.setSizeMode('relative','absolute')
			.setAbsoluteSize(null,60)
			.setDifferentialSize(-120)
			.setPosition(120)
			.el.setProperty('line-height','60px')
			   .setAttribute('value',datetime)
			   // .setAttribute('min', nowTime)
			   .setAttribute('type','datetime-local')
			   .setAttribute('readonly','readonly');
			
		// dateInput.addUIEvent('change')
		// dateInput.onReceive = function(e,p){
		// 		if(e === 'change'){
		// 			datetime = p.value;
		// 		}
		// 	}

	form.addChild(dateInput);

	_this.telInput = new inputCustom();

	_this.telInput
			.setSizeMode('relative','absolute')
			.setAbsoluteSize(null,60)
			.setDifferentialSize(-120)
			.setPosition(120,60)
			.el.setAttribute('type','tel')
			   .setAttribute('placeholder','请填写手机号码')
			   .setAttribute('maxlength', '11')
		
		_this.telInput.inputEvent = function(e,p){
				if(e === 'input'){
					mobile = p.value;	
				}
			}

	form.addChild(_this.telInput);

	var addsSelect = form.addChild();

		addsSelect
			.setSizeMode('relative','absolute')
			.setAbsoluteSize(null,60)
			.setDifferentialSize(-120)
			.setPosition(120,120)
			.el = new DOMElement(addsSelect,{
				classes:['adds_select'],
				content:function(){
					var str = `<select>`;
					// console.log(shopJson);
					if(shopJson){
						shopJson.forEach(v =>{
							str += `<option value="${v.id}">${v.name}</option>`
						});

						adds = shopJson[0].id;
					}
					
					return str + `</select>`;
				}()
			})

		addsSelect.addUIEvent('change')
		addsSelect.onReceive = function(e,p){
			if(e === 'change'){
				adds = p.value;
			}
		}


	_this.descTextarea = form.addChild();

	_this.descTextarea
			.setSizeMode('relative','absolute')
			.setAbsoluteSize(null,150)
			.setDifferentialSize(-46)
			.setPosition(34,230)
			.el = new DOMElement(_this.descTextarea,{
				tagName:'textarea',
				classes:['desc_textarea']
			}).setAttribute('placeholder','请描述下您遇到的问题')
		
		_this.descTextarea.addUIEvent('input')
		_this.descTextarea.onReceive = function(e,p){
			if(e === 'input'){
				desc = p.value;
			}
		}


	var submit = new button('完成提交','#fe6a71','submit_btn')
	submit.setSizeMode('relative','absolute')
		  .setAbsoluteSize(null,40)
		  .setPosition(0,16+414+27)
		  .setProportionalSize(.7)
		  .setAlign(.5)
		  .setMountPoint(.5)
		  .clickEvent = function(e,p){
		  	if(e === 'click'){
		  		if(!/^(\+?86 ?)?1\d{10}$/g.test(mobile)){
					alert('请输入正确手机号码','','提示信息','确定');
					return false;
				}else if(!adds){
					alert('请选择报修店铺地址 ','','提示信息','确定');
					return false;
				}else if(!desc){
		  			alert('请填写问题描述','','提示信息','确定');
		  			return false;
		  		}else{
		  			var userSign = sign.findOne();

		  			new Ajax('/property_repair/add')
		  				.data({
		  					'store':adds,
		  					'desc':desc,
		  					'id':userSign.id,
		  					'datetime':datetime.split('T')[0]+' '+datetime.split('T')[1],
		  					'phone':mobile,
		  					'did':App.uuid,
		  					'tk':userSign.token
		  				})
		  				.success(function(d){
		  					if(d.status === 200){
		  						alert('提交成功',function(){
		  							_this.clean();
					  				_this.back();
					  			},'提示信息','确定');
		  					}else{
		  						alert(d.msg,'','提示信息','确定');
		  					}
		  				}).post();
		  			
		  		}
		  		
		  		
		  	}
		  }

	content.addChild(submit);

}

module.exports = Repair;