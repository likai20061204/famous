var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var navbar = require('twoBtnNav');
var button = require('button');
var Tips = require('Tips');
var App = require('App');
var Ajax = require('Ajax');
var signModel = require('model/signModel');

class apply_hall extends Page {

	constructor() {
		super({
			id: 'apply'
		});
	}

	onCreate(opt) {

		super.onCreate();

		this.opt = opt;

		initNav(this);

		this.content = this.addChild();
		this.content.setSizeMode('relative', 'relative')
			.setDifferentialSize(0, -45)
			.setPosition(0, 45);

		new DOMElement(this.content, {
			classes: ['overflow_auto']
		})

	}

	onResume() {

		super.onResume();

		if (!this.content.inode2) {

			initPage(this.content);

			initData(this.content);

		}



	}

	onDestroy() {

		var obj = this.getChildren(),
			i = obj.length;

		while (i--) {
			this.removeChild(obj[i]);
		}

		super.onDestroy();

	}

	onReceive(e, p) {

		//选择区域
		if (e === 'change' && p.node.liId === 'area') {

			initNumber(this.content, p.value);

			p.stopPropagation();

		}

		// //选择入场时间
		// if (e === 'click' && p.node.liId === 'getTime') {

		// 	p.node.el.addClass('l_getTime');

		// 	p.stopPropagation();

		// }

		// //选择入场时间
		// if (e === 'change' && p.node.liId === 'getTime') {

		// 	this.getTime = p.value;

		// 	//把日期转换为时间戳
		// 	this.timestamp = Date.parse(new Date(this.getTime)) / 1000;

		// 	p.stopPropagation();

		// }

		//选择经营品类
		if (e === 'input' && p.node.liId === 'productText') {

			this.productText = p.value;
			p.stopPropagation();

		}

		//选择租货周期
		if (e === 'change' && p.node.liId === 'cycle') {

			this.cycle = p.value;
			p.stopPropagation();

		}

		//选择好编号，下方出现大厅相关信息
		if (e === 'change' && p.node.liId === 'number') {

			this.hid = p.value;

			initHallInfo(this.content, p.value);

			p.stopPropagation();

		}

		//确认申请
		if (e === 'click' && p.node.liId === 'submit') {

			if (this.hid && this.cycle && this.productText) {

				new Ajax('/hall_apply/apply').data({
					'sid': this.opt,
					'hid': this.hid,
					'id': signModel.findOne().id,
					'cid': this.cycle,
					'product': this.productText,
					'did': App.uuid,
					'tk': signModel.findOne().token
				}).success(function(res) {

					this.hid = '';
					this.cycle = '';
					this.productText = '';

					if (res.status == 200) {

						alert('提交成功！', null, '提示信息', '确定');

						setTimeout(function() {

							// this.content.inode4.el.removeClass('l_getTime');

							this.back();

						}.bind(this), 1000);

					} else {

						alert(res.msg, null, '提示信息', '确定');

					}



				}.bind(this)).post();

			} else {

				alert('请填写完整的信息！', null, '提示信息', '确定');

			}
			p.stopPropagation();

		}



	}


}

function initHallInfo(nodeAll, value) {

	//获取大厅相关信息
	new Ajax('/hall/detail').data({
		'hid': value,
		'id': signModel.findOne().id,
		'did': App.uuid,
		'tk': signModel.findOne().token
	}).success(function(res) {

		var list = res.data;
		nodeAll.info.el.setContent(`<div class="pad24"><table border="1">
		<tr>
			<td colspan="2" style="height:38px">以下是你选择的大厅相关信息</td>
		</tr>
		<tr>
			<td>底层面积 /㎡：   <em>${list.area}</em></td>
			<td>二楼夹层面积 /㎡：   <em>${list.oarea}</em></td>
		</tr>
		<tr>
			<td colspan="2" style="padding: 0;height: 40px;"><a href="javascript:;">确认申请</a></td>
		</tr>
	  </table>
	  </div>
		<dl>
			<dt><i></i>服务提醒</dt>
			<dd>
				<p>请先前往商家中心确认所需要的大厅位置；</p>
				<p>申请成功后，请在3个工作日内到商家中心办理手续。</p>
			</dd>
		</dl>
		`)

	}).post();

}

function initNumber(nodeAll, value) {

	//第二个接口选择编号
	new Ajax('/hall/tree_data').data({
		'hid': value,
		'id': signModel.findOne().id,
		'did': App.uuid,
		'tk': signModel.findOne().token
	}).success(function(res) {

		var list = res.data;
		var len = res.data.length;
		var str = '';
		str += `<select><option value="-1">请选择编号</option>`

		for (var i = 0; i < len; i++) {

			str += `<option value="${list[i].id}">${list[i].name}</option>`

		}

		str += `</select>`;

		nodeAll.inode2.el.setContent(`<img src="images/conService/con2.png"/>
						 			${str}
							  	<a href="javascript:;"></a>`);

		nodeAll.inode2.liId = 'number';
		nodeAll.inode2.addUIEvent('change');

	}).post();

}

function initNav(node) {
	var backButton = new button(" ", "", "goback2");
	var _this = node;

	// backButton.setAbsoluteSize(44,44);
	backButton.clickEvent = function() {
		node.back();
	};

	var rightText = new button('申请记录', '', 'right_text');
	rightText.setAbsoluteSize(100, 44);
	rightText.clickEvent = function() {
		_this.hid = '';
		_this.cycle = '';
		_this.timestamp = '';
		_this.to('record_hall');
	};

	node.addChild(new navbar('大厅申请', backButton, rightText));
}

function initPage(nodeAll) {

	//请选择栋数
	var inode = nodeAll.addChild();
	var str = '';
	str += `<select><option value="-1">请选择栋数</option>`

	str += `</select>`;

	inode.setSizeMode('relative', 'absolute')
		.setAbsoluteSize(null, 60)
		.setPosition(0, 0 * 60)

	inode.el = new DOMElement(inode, {
		classes: ['apply_list'],
		content: `<img src="images/conService/con1.png"/>
						 			${str}
							  	<a href="javascript:;"></a>`
	});

	inode.liId = 'area';
	inode.addUIEvent('change');

	//请选择编号
	nodeAll.inode2 = nodeAll.addChild();
	var str = '';
	str += `<select><option value="-1">请选择编号</option>`

	str += `</select>`;

	nodeAll.inode2.setSizeMode('relative', 'absolute')
		.setAbsoluteSize(null, 60)
		.setPosition(0, 1 * 60)

	nodeAll.inode2.el = new DOMElement(nodeAll.inode2, {
		classes: ['apply_list'],
		content: `<img src="images/conService/con2.png"/>
						 			${str}
							  	<a href="javascript:;"></a>`
	});

	nodeAll.inode2.liId = 'number';
	nodeAll.inode2.addUIEvent('change');

	//请选择租赁周期
	nodeAll.inode3 = nodeAll.addChild();
	var str = '';
	str += `<select><option value="-1">请选择租赁周期</option>`

	str += `</select>`;

	nodeAll.inode3.setSizeMode('relative', 'absolute')
		.setAbsoluteSize(null, 60)
		.setPosition(0, 2 * 60)

	nodeAll.inode3.el = new DOMElement(nodeAll.inode3, {
		classes: ['apply_list'],
		content: `<img src="images/conService/con3.png"/>
						 			${str}
							  	<a href="javascript:;"></a>`
	});

	nodeAll.inode3.liId = 'cycle';
	nodeAll.inode3.addUIEvent('change');


	//请选择入场时间
	// nodeAll.inode4 = nodeAll.addChild();
	// var str = '';
	// str = `<p>请选择入场时间</p><input type="datetime-local"/>`;

	// nodeAll.inode4.setSizeMode('relative', 'absolute')
	// 	.setAbsoluteSize(null, 60)
	// 	.setPosition(0, 3 * 60)

	// nodeAll.inode4.el = new DOMElement(nodeAll.inode4, {
	// 	classes: ['apply_list'],
	// 	content: `<img src="images/conService/con4.png"/>
	// 					 			${str}
	// 						  	<a href="javascript:;"></a>`
	// });

	// nodeAll.inode4.liId = 'getTime';
	// nodeAll.inode4.addUIEvent('click');
	// nodeAll.inode4.addUIEvent('change');

	//填写经营品类
	var inode2 = nodeAll.addChild(),
		str2 = `<input type="text" placeholder="请填写经营品类" style="opacity:1"/>`;

	inode2.setSizeMode('relative', 'absolute')
		.setAbsoluteSize(null, 60)
		.setPosition(0, 3 * 60)

	inode2.el = new DOMElement(inode2, {
		classes: ['apply_list'],
		content: `<img src="images/conService/con6.png"/>
								 			${str2}`
	});

	inode2.liId = 'productText';
	inode2.addUIEvent('input');

	//第一个请选择栋数接口
	new Ajax('/hall/tree_data').data({
		'hid': 1,
		'id': signModel.findOne().id,
		'did': App.uuid,
		'tk': signModel.findOne().token
	}).success(function(res) {

		var list = res.data;
		var len = res.data.length;
		var str = '';
		str += `<select><option value="-1">请选择栋数</option>`

		for (var i = 0; i < len; i++) {

			str += `<option value="${list[i].id}">${list[i].name}</option>`

		}

		str += `</select>`;

		inode.el.setContent(`<img src="images/conService/con1.png"/>
							 			${str}
								  	<a href="javascript:;"></a>`);

	}).post();

	//第三个接口选择租赁周期
	new Ajax('/hall_apply/hall_cycle').data({
		'id': signModel.findOne().id,
		'did': App.uuid,
		'tk': signModel.findOne().token
	}).success(function(res) {

		var list = res.data;
		var len = res.data.length;
		var str = '';
		str += `<select><option value="-1">请选择租赁周期</option>`

		for (var i = 0; i < len; i++) {

			str += `<option value="${i}">${list[i]}</option>`

		}

		str += `</select>`;

		nodeAll.inode3.el.setContent(`<img src="images/conService/con3.png"/>
						 			${str}
							  	<a href="javascript:;"></a>`);
	}).post()

}

function initData(nodeAll) {
	nodeAll.info = nodeAll.addChild();
	nodeAll.info.setPosition(0, 240)
		.setDifferentialSize(0, -240)

	nodeAll.info.el = new DOMElement(nodeAll.info, {
		classes: ['apply_info'],
		content: `<div class="pad24"><table border="1">
		<tr>
			<td colspan="2" style="height:38px">以下是你选择的大厅相关信息</td>
		</tr>
		<tr>
			<td>底层面积 /㎡：   <em>0</em></td>
			<td>二楼夹层面积 /㎡：   <em>0</em></td>
		</tr>
		<tr>
			<td colspan="2" style="padding: 0;height: 40px;"><a href="javascript:;">确认申请</a></td>
		</tr>
	  </table>
	  </div>
		<dl>
			<dt><i></i>服务提醒</dt>
			<dd>
				<p>请先前往商务中心确认所需要的大厅位置；</p>
				<p>申请成功后，请在3个工作日内到商务中心办理手续。</p>
			</dd>
		</dl>
		`
	});

	nodeAll.submit = nodeAll.info.addChild();
	nodeAll.submit.setSizeMode('relative', 'absolute')
		.setAbsoluteSize(null, 40)
		.setPosition(24, 150)
		.setDifferentialSize(-48, 0);

	nodeAll.submit.el = new DOMElement(nodeAll.submit);
	nodeAll.submit.el.setProperty('background', 'none');

	nodeAll.submit.liId = 'submit';
	nodeAll.submit.addUIEvent('click');

}


module.exports = apply_hall;