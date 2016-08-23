var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var navbar = require('navbar');
var blank = require('blank');
var App = require('App');
var Ajax = require('Ajax');
var signModel = require('model/signModel');

class record_hall extends Page{

	constructor(){
		super({
			id:'record_hall'
		});
	}

	onCreate(){

		super.onCreate();

		this.addChild(new navbar('大厅申请记录'));

		this.content = this.addChild();
		this.content.setDifferentialSize(-30,-70).setPosition(15,60);
		this.content.el = new DOMElement(this.content,{
			classes:['overflow_auto']
		});

		initPage(this.content);

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

}

function initPage(nodeAll){

	new Ajax('/hall_apply/lists_user').data({
		'id':signModel.findOne().id,
		'did':App.uuid,
		'tk':signModel.findOne().token
	}).success(function(res){

		var list = res.data;
				

		if(list == null){

			nodeAll.addChild(new blank('apply'));


		}else{

			var len = list.length,
					str = '';

			for(var i = 0; i < len; i++){
				str += `
					<div class="table_div">
					 <img src="images/record/status_${list[i].status}.png">	
					 <table>
						<tr>
							<td>大厅编号</td>
							<td>${list[i].store}</td>
						</tr>
						<tr>
							<td rowspan="2">申请面积/㎡</td>
							<td>底层面积${list[i].size}</td>
						</tr>
						<tr>
							<td style="background:#fff;color:#666;">二楼夹层面积${list[i].size}</td>
						</tr>
						<tr>
							<td>租赁周期/年</td>
							<td>${list[i].cycle}</td>
						</tr>
						<tr>
							<td>申请时间</td>
							<td>${list[i].ctime}</td>
						</tr>
					 </table>
				  </div>
				`
			}

			nodeAll.el = new DOMElement(nodeAll,{
				classes:['table_hall'],
				content:str
			});
		}

	}).post();

	

}


module.exports = record_hall;