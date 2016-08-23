var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var navbar = require('twoBtnNav');
var button = require('button');
var Tips = require('Tips');
var App = require('App');
var Ajax = require('Ajax');
var signModel = require('model/signModel');

class apply_yard extends Page {

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
		});

	}

	onResume() {

		super.onResume();

		if (!this.number) {

			// initTime(this.content);

			initPage(this.content);

			initData(this.content);

		}



	}

	onDestroy() {

		var _this = this,
			obj = this.getChildren(),
			i = obj.length;

		while (i--)
			this.removeChild(obj[i]);

		super.onDestroy();

	}

	onReceive(e, p) {

		// if(e === 'input' && p.node.liId === 'time1'){

		// 	this.time1 = Date.parse(p.value) / 1000;

		// 	p.node.el.addClass('opa1');

		// 	p.stopPropagation();
		// }

		// if(e === 'input' && p.node.liId === 'time2'){

		// 	this.time2 = Date.parse(p.value) / 1000;

		// 	p.node.el.addClass('opa1');

		// 	p.stopPropagation();
		// }

		if (e === 'input' && p.node.liId === 'productText') {

			this.productText = p.value;
			p.stopPropagation();

		}

		if (e === 'change' && p.node.liId === 'area') {

			this.area = p.value;

		}

		if (e === 'change' && p.node.liId === 'number') {

			this.number = p.value;

			//改变堆场面积
			new Ajax('/yard/detail').data({
				'yid': this.number,
				'id': signModel.findOne().id,
				'did': App.uuid,
				'tk': signModel.findOne().token
			}).success(function(res) {
				var list = res.data;
				this.content.info.el.setContent(`<div class="pad24"><table border="1">
						<tr>
							<td style="padding:0 50px">您选择的堆场面积 /㎡： <em>${list.area}</em></td>
						</tr>
						<tr>
							<td colspan="2" style="padding: 0;height: 40px;"><a href="javascript:;">确认申请</a></td>
						</tr>
					  </table>
					  </div>
						<dl>
							<dt><i></i>服务提醒</dt>
							<dd>
								<p>请先前往商务中心确认所需要的堆场；</p>
								<p>申请成功后，请在3个工作日内到商务中心办理手续。</p>
							</dd>
						</dl>
						`)
			}.bind(this)).post();

			p.stopPropagation();

		}

		if (e === 'click' && p.node.liId === 'submit') {

			if (this.number && this.productText) {

				new Ajax('/yard_apply/apply').data({
					'sid': this.opt,
					'yid': this.number,
					'id': signModel.findOne().id,
					// 'cdate':this.time1,
					// 'edate':this.time2,
					'product': this.productText,
					'did': App.uuid,
					'tk': signModel.findOne().token
				}).success(function(res) {

					console.log(res);

					this.number = '';
					this.area = '';
					// this.time1 = '';
					// this.time2 = '';
					this.productText = '';

					if (res.status == 200) {

						alert('提交成功！', null, '提示信息', '确定');

						setTimeout(function() {

							// this.content.time1.el.removeClass('opa1');
							// this.content.time2.el.removeClass('opa1');

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

		_this.to('record_yard');
	};

	node.addChild(new navbar('堆场申请', backButton, rightText));
}

function initTime(nodeAll) {

	nodeAll.time = nodeAll.addChild();
	nodeAll.time.setSizeMode('relative', 'absolute')
		.setAbsoluteSize(null, 90);

	nodeAll.time.el = new DOMElement(nodeAll.time, {
		classes: ['timebg'],
		content: `<div class="timebg_left">请选择入场时间</div><i></i><div class="timebg_right">请选择出场时间</div>`
	});

	//选择入场时间
	nodeAll.time1 = nodeAll.time.addChild();
	nodeAll.time1.setSizeMode('relative', 'absolute')
		.setAbsoluteSize(null, 53)
		.setProportionalSize(0.4)
		.setDifferentialSize(-24, 0)
		.setPosition(24, 20)
	nodeAll.time1.el = new DOMElement(nodeAll.time1, {
		classes: ['time1'],
		content: `<input type="date"/>`
	});
	nodeAll.time1.liId = 'time1';
	nodeAll.time1.addUIEvent('input');

	//选择出场时间
	nodeAll.time2 = nodeAll.time.addChild();
	nodeAll.time2.setSizeMode('relative', 'absolute')
		.setAbsoluteSize(null, 53)
		.setProportionalSize(0.4)
		.setDifferentialSize(-24, 0)
		.setAlign(1, 0)
		.setMountPoint(1, 0)
		.setPosition(-24, 20)
	nodeAll.time2.el = new DOMElement(nodeAll.time2, {
		classes: ['time1'],
		content: `<input type="date"/>`
	});

	nodeAll.time2.liId = 'time2';
	nodeAll.time2.addUIEvent('input');

}

function initPage(nodeAll) {

	new Ajax('/yard/tree_data').data({
		'yid': 1,
		'id': signModel.findOne().id,
		'did': App.uuid,
		'tk': signModel.findOne().token
	}).success(function(res) {

		//请选择区域
		new Ajax('/yard/domain').data({
			'id': signModel.findOne().id,
			'did': App.uuid,
			'tk': signModel.findOne().token
		}).success(function(res2) {

			var list2 = res2.data,
				len2 = list2.length;

			var area = nodeAll.addChild();
			area.setSizeMode('relative', 'absolute')
				.setAbsoluteSize(null, 60);

			var str2 = '';
			str2 += `<select><option value="-1">请选择区域</option>`
			for (var j = 0; j < len2; j++) {

				str2 += `<option value="${list2[j].id}">${list2[j].name}</option>`

			}

			str2 += `</select><a href="javascript:;"></a>`

			area.el = new DOMElement(area, {
				classes: ['apply_list'],
				content: `<img src="images/apply/area_ico.png"/>
								 			${str2}`
			});

			area.liId = 'area';
			area.addUIEvent('change');

		}).post();



		//请选择编号
		var list = res.data;
		var len = list.length;
		var inode = nodeAll.addChild();
		var str = '';
		str += `<select><option value="-1">请选择编号</option>`
		for (var i = 0; i < len; i++) {

			str += `<option value="${list[i].id}">${list[i].name}</option>`

		}

		str += `</select><a href="javascript:;"></a>`

		inode.setSizeMode('relative', 'absolute')
			.setAbsoluteSize(null, 60)
			.setPosition(0, 60)

		inode.el = new DOMElement(inode, {
			classes: ['apply_list'],
			content: `<img src="images/conService/con2.png"/>
							 			${str}`
		});

		inode.liId = 'number';
		inode.addUIEvent('change');


		//填写堆场产品
		var inode2 = nodeAll.addChild(),
			str2 = `<input type="text" placeholder="请填写堆场产品" style="opacity:1;width:80%;line-height:50px;"/>`;

		inode2.setSizeMode('relative', 'absolute')
			.setAbsoluteSize(null, 60)
			.setPosition(0, 2 * 60)

		inode2.el = new DOMElement(inode2, {
			classes: ['apply_list'],
			content: `<img src="images/conService/con6.png"/>
								 			${str2}`
		});

		inode2.liId = 'productText';
		inode2.addUIEvent('input');



	}).post();

}

function initData(nodeAll) {
	nodeAll.info = nodeAll.addChild();
	nodeAll.info.setPosition(0, 180)
		.setDifferentialSize(0, -180)

	nodeAll.info.el = new DOMElement(nodeAll.info, {
		classes: ['apply_info'],
		content: `<div class="pad24"><table border="1">
		
		<tr>
			<td style="padding:0 50px">您选择的堆场面积 /㎡： <em>0</em></td>
		</tr>
		<tr>
			<td colspan="2" style="padding: 0;height: 40px;"><a href="javascript:;">确认申请</a></td>
		</tr>
	  </table>
	  </div>
		<dl>
			<dt><i></i>服务提醒</dt>
			<dd>
				<p>请先前往商务中心确认所需要的堆场；</p>
				<p>申请成功后，请在3个工作日内到商家中心办理手续。</p>
			</dd>
		</dl>
		`
	});

	nodeAll.submit = nodeAll.info.addChild();
	nodeAll.submit.setSizeMode('relative', 'absolute')
		.setAbsoluteSize(null, 40)
		.setPosition(24, 110)
		.setDifferentialSize(-48, 0);

	nodeAll.submit.el = new DOMElement(nodeAll.submit);
	nodeAll.submit.el.setProperty('background', 'none');

	nodeAll.submit.liId = 'submit';
	nodeAll.submit.addUIEvent('click');
}


module.exports = apply_yard;