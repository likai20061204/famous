var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var Nav = require('navbar');
var Blank = require('blank');
var App = require('App');
var sign = require('model/SignModel');
var Ajax = require('Ajax');

class RepairRecord extends Page{
	constructor(){
		super({id:'Record'})
	}

	onCreate(){
		super.onCreate();
		
		initNav(this);
	}

	onResume(){
		super.onResume();

		var userSign = sign.findOne();
		new Ajax('/property_repair/lists_user')
			.data({
				'id':userSign.id,
				'did':App.uuid,
				'tk':userSign.token
			})
			.success(function(d){
				if(d.status === 200){
					this.data = d.data;
					initListCon(this,this.data);
				}
			}.bind(this)).post();

		
	}

	onDestroy(){
		var _this = this,
		obj = this.getChildren(),
		i = obj.length;

		while(i--)
			this.removeChild(obj[i]);

		super.onDestroy();

		// this._content = null;
	}
}

function initNav(node){
	
	node.addChild(new Nav('报修记录'));
}

function initListCon(node,data){
	var content = node.addChild();

	if(data === null){
		content.addChild(new Blank('apply'));
		return;
	}
	
	var recordStr = '';

	for(var i = 0 ; i < data.length;i++){
		recordStr += `<div class="record_list"><i class="record_status status_${data[i].status}"></i><table border="1">`+
						`<tr><td class="title">报修时间</td><td>${data[i].ctime}</td></tr>`+
						`<tr><td class="title">联系号码</td><td>${data[i].phone}</td></tr>`+
						`<tr><td class="title">报修地址</td><td>${data[i].store}</td></tr>`+
						`<tr><td class="title">问题描述</td><td>${data[i].desc}</td></tr>`+
					`</table></div>`;
	}

	
	content
		.setSizeMode('relative','relative')
		.setDifferentialSize(0,-(44+8))
		.setPosition(0,44)
		.el = new DOMElement(content,{
			classes:['con','overflow_scoll'],
			content:recordStr
		})

}

module.exports = RepairRecord;