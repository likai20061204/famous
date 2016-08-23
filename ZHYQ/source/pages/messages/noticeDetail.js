var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var Nav = require('navbar');
var config = require('config.json');


class NoticeDetail extends Page {
	constructor(opt) {
		super({
			id: 'NoticeDetail'
		})
	}

	onCreate(opt) {
		super.onCreate();

		this.opt = opt;

		this.type = this.opt ? this.opt.InfoType : 1;

		switch (this.type) {
			case 1:
				this.title = '市场公告';
				break;
			case 2:
				this.title = '系统消息';
				break;
			case 3:
				this.title = '通知';
				break;
			default:
				this.title = '市场公告';
				break;
		}

		initNav(this, this.title);

	}

	onResume() {
		super.onResume();
		if (!this._content) {
			initContent(this, this.opt);
		}

	}

	onDestroy() {
		var _this = this,
			obj = this.getChildren(),
			i = obj.length;

		while (i--)
			this.removeChild(obj[i]);

		super.onDestroy();

		this._content = null;
	}
}

function initNav(node) {
	node.addChild(new Nav(node.title));
}

function initContent(node, obj) {
	var content = node.addChild();

	node._content = content;

	if (obj == null) {
		return;
	}

	obj.InfoDesc = obj.InfoDesc.replace(/src="\//g, 'src="' + config.noticehttp);

	var DetailStr = `<div class="notice_header">
						<h2>${obj.InfoTitle}</h2>
						<time>${obj.InfoCtime}</time>
					</div>					
					<div class="notice_con">${obj.InfoDesc}</div>
					<div class="notice_footer">
						<p>${obj.InfoAuthor}</p>
						<time>${obj.InfoCtime}</time>
					</div>`;	

	content
		.setSizeMode('relative', 'relative')
		.setDifferentialSize(0, -44)
		.setPosition(0, 44)
		.el = new DOMElement(content, {
			classes: ['notice_bg', 'overflow_scoll'],
			content: DetailStr
		})

}

module.exports = NoticeDetail;