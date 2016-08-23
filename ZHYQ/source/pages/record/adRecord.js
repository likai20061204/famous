var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var Nav = require('navbar');
var Blank = require('blank');
var Ajax = require('Ajax');
var App = require('App');
var sign = require('model/SignModel');

class AdRecord extends Page{
	constructor(){
		super({id:'Record'})
	}

	onCreate(){
		super.onCreate();
		
		var userSign = sign.findOne();

		new Ajax('/advert_apply/lists_user')
			.data({
				'id':userSign.id,
				'did':App.uuid,
				'tk':userSign.token
			})
			.success(function(d){
				if(d.status === 200){
					this.data = d.data;
				}
		}.bind(this)).post();

		initNav(this);
	}

	onResume(){
		super.onResume();

		// var data = null;
		initListCon(this,this.data);

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
	
	node.addChild(new Nav('广告位申请记录'));
}

function initListCon(node,data){
	var content = node.addChild();

	if(data == null){
		content.addChild(new Blank('apply'));
		return false;
	}	

	var recordStr = '';

	for(var i = 0 ; i < data.length;i++){
		recordStr += `<div class="record_list"><i class="record_status status_${data[i].status}"></i><table border="1">
						<tr><td class="title">店铺地址</td><td>${data[i].store}</td></tr>
						<tr><td class="title">广告位编号</td><td>${data[i].adposition}</td></tr>
						<tr><td class="title">广告性质</td><td>${data[i].adtype}</td></tr>
						<tr><td class="title">申请时间</td><td>${data[i].ctime}</td></tr>
					</table></div>`;
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

module.exports = AdRecord;