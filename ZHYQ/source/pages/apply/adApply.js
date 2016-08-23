var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var navbar = require('twoBtnNav');
var button = require('button');
var App = require('App');
var Ajax = require('Ajax');
var sign = require('model/SignModel');
var area = -1,building = -1,number = -1,type = -1; 

class AdApply extends Page{
	constructor(data){
		super({id:'AdApply'})
		// console.log(data);
		this.shopId = data;
		var userSign = sign.findOne();
		this.userId = userSign.id;
		this.token = userSign.token;
	}

	onCreate(){
		super.onCreate();

		initNav(this);

		//区域
		new Ajax('/advert/domain')
			.data({
				'id':this.userId,
				'did':App.uuid,
				'tk':this.token
			})
			.success(function(d){
				if(d.status === 200){

					this.areaJson = d.data;
				}
			}.bind(this)).post();

		//性质
		new Ajax('/advert_apply/apply_type')
			.data({
				'id':this.userId,
				'did':App.uuid,
				'tk':this.token
			})
			.success(function(d){
				if(d.status === 200){

					this.typeJson = d.data;
				}
			}.bind(this)).post();	
	}

	onResume(){
		super.onResume();

		if(!this._content){
			initContent(this,this.areaJson,this.typeJson);
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

}


function initNav(node){
	var backButton = new button(" ","","goback2");
	var _this = node;

	//返回按钮
	// backButton.setAbsoluteSize(44,44);
	backButton.clickEvent = function(e,p){
		node.back();
		p.stopPropagation();
	};

	//记录按钮
	var rightText = new button('申请记录','','right_text');
	rightText.setAbsoluteSize(100,44);
	rightText.clickEvent = function(){
		_this.to('adRecord');
	};

	node.addChild(new navbar('广告位选择',backButton,rightText));
}


function initContent(node,areaJson,typeJson){
	var _this = node;

	_this.buildingJson = null;

	// var shopJson = [
	// 	{'adds':'天府软件园A区','value':'天府软件园A区'},
	// 	{'adds':'天府软件园B区','value':'天府软件园B区'},
	// 	{'adds':'天府软件园C区','value':'天府软件园C区'},
	// 	{'adds':'天府软件园D区','value':'天府软件园D区'},
	// 	{'adds':'天府软件园E区','value':'天府软件园E区'},
	// ]

	var content = node.addChild();
	content.setSizeMode('relative','relative')
		   .setDifferentialSize(0,-44)
		   .setPosition(0,44)
		   .el = new DOMElement(content,{
		   		classes:['apply_con']
		   })

	node._content = content;	   

	var form = content.addChild();
	var form_item = `<ul>
						<li class="area"></li>
						<li class="building"></li>
						<li class="number"></li>
						<li class="type"></li>
				    </ul>`;

	form.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,240)
		.el = new DOMElement(form,{
			classes:['repair_form'],
			content:form_item

		});


	var areaSelect = form.addChild();

	areaSelect
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,60)
		.setDifferentialSize(-50)
		.setPosition(50,0)
		.el = new DOMElement(areaSelect,{
			classes:['select_box'],
			content:function(){
				var str = `<select><option value="-1">请选择区域</option>`;
				if(areaJson !== null){
					areaJson.forEach(v =>{
						str += `<option value="${v.id}">${v.name}</option>`
					});
				}
				
				return str + `</select>`;
			}()
		})

	areaSelect.addUIEvent('change')
	areaSelect.onReceive = function(e,p){
		if(e === 'change'){
			area = p.value;
			new Ajax('/advert/tree_data')
				.data({
					'aid':area,
					'id':_this.userId,
					'did':App.uuid,
					'tk':_this.token
				})
				.success(function(d){
					if(d.status === 200){
						
						_this.buildingJson = d.data;
						
						var str = `<select><option value="-1">请选择栋数</option>`;
						var str2 = `<select><option value="-1">请选择编号</option></select>`;
						
						//判断返回对象是否为null
						if(_this.buildingJson !==null){
							_this.buildingJson.forEach(v =>{
								str += `<option value="${v.id}">${v.oname}</option>`
							});
						}
						//重置栋数
						_this.buildingSelect.el.setContent(str);
						//重置编号
						_this.numberSelect.el.setContent(str2);

					}
				}).post()

		}
	}

	_this.buildingSelect = form.addChild();

	_this.buildingSelect
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,60)
		.setDifferentialSize(-50)
		.setPosition(50,60)
		.el = new DOMElement(_this.buildingSelect,{
			classes:['select_box'],
			content:function(){
				var str = `<select><option value="-1">请选择栋数</option>`;
				return str + `</select>`;
			}()
		})

	_this.buildingSelect.addUIEvent('change')
	_this.buildingSelect.onReceive = function(e,p){
		if(e === 'change'){
			building = p.value;

			new Ajax('/advert/tree_data')
				.data({
					'aid':building,
					'id':_this.userId,
					'did':App.uuid,
					'tk':_this.token
				})
				.success(function(d){
					if(d.status === 200){
						_this.numberJson = d.data;
						var str = `<select><option value="-1">请选择编号</option>`;
						//判断返回对象是否为空
						if(_this.numberJson !== null){
							_this.numberJson.forEach(v =>{
								str += `<option value="${v.id}">${v.oname}</option>`
							});
						}
						
						//重置编号
						_this.numberSelect.el.setContent(str);
					}
				}).post()
		}
	}

	_this.numberSelect = form.addChild();

	_this.numberSelect
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,60)
		.setDifferentialSize(-50)
		.setPosition(50,120)
		.el = new DOMElement(_this.numberSelect,{
			classes:['select_box'],
			content:function(){
				var str = `<select><option value="-1">请选择编号</option>`;
				return str + `</select>`;
			}()
		})

	_this.numberSelect.addUIEvent('change')
	_this.numberSelect.onReceive = function(e,p){
		if(e === 'change'){
			number = p.value;
		}
	}

	var typeSelect = form.addChild();

	typeSelect
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,60)
		.setDifferentialSize(-50)
		.setPosition(50,180)
		.el = new DOMElement(typeSelect,{
			classes:['select_box'],
			content:function(){
				var str = `<select><option value="-1">请选择广告位性质</option>`;
				if(typeJson !== null){
					typeJson.forEach(v =>{
						str += `<option value="${v}">${v}</option>`
					});
				}
				return str + `</select>`;
			}()
		})

	typeSelect.addUIEvent('change')
	typeSelect.onReceive = function(e,p){
		if(e === 'change'){
			type = p.value;
		}
	}


	var submit = new button('确认申请','#fe6a71','submit_btn')
	submit.setSizeMode('relative','absolute')
		  .setAbsoluteSize(null,40)
		  .setPosition(0,240+App.height*0.15)
		  .setProportionalSize(.85)
		  .setAlign(.5)
		  .setMountPoint(.5)
		  .clickEvent = function(e,p){
		  	if(e === 'click'){
		  		if(~area && ~building && ~number && ~type){
		  			new Ajax('/advert_apply/apply')
		  				.data({
		  					'sid':_this.shopId,
		  					'aid':number,
		  					'id':_this.userId,
		  					'tid':type,
		  					'did':App.uuid,
		  					'tk':_this.token
		  				})
		  				.success(function(d){
		  					if(d.status === 200){
		  						alert('提交成功',function(){
					  				_this.back();
					  			},'提示信息','确定');
		  					}else{
		  						alert(d.msg,'','提示信息','确定')
		  					}
		  				}).post();
		  		}else{
		  			alert('请正确选择相关信息','','提示信息','确定');
		  		}
		  		
		  	}
		  }

	content.addChild(submit);

	var remind = content.addChild();
	remind
		.setSizeMode('relative','absolute')
		.setAbsoluteSize(null,130)
		.setAlign(0,1)
		.setMountPoint(0,1)
		.el = new DOMElement(remind,{
			classes:['remind'],
			content:`<h2><i></i>服务提醒</h2>
					 <p><em>·</em>请先前往商务中心确认所需要的广告位；</p>
					 <p><em>·</em>申请成功后，请在3个工作日内到商家中心办理手续。</p>`
		})

}

module.exports = AdApply;