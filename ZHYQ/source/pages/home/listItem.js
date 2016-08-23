var Node = require('famous/core/Node');
var DOMElement = require( 'famous/dom-renderables/DOMElement' );

function listItem(list,index){

	 Node.call(this);

	 var array = ['message_item'];

	 this.setSizeMode('relative','absolute')
				 .setAbsoluteSize(null, 75)
				 .setPosition(0, index._id * 75);

	 this.allInfo = index;

	 this.el = new DOMElement(this,{
	 		classes: array,
	 		content:`<dl class="dl${list.InfoType}">
								<dt><img src="images/home/message${list.InfoType}.png"><i class="${list.isRead}"></i></dt>
								<dd>
									<h3><em>[${list.type}]</em><span>${list.InfoTitle}</span></h3>
									<p>${list.InfoCtime}</p>
								</dd>
							</dl>`
	 });


	//加入关闭按钮
	 var inode = this.addChild();
			inode.setSizeMode('absolute','absolute')
					 .setAbsoluteSize(22, 22)
					 .setAlign(1,0)
					 .setMountPoint(1,0)
					 .setPosition(-14, 25);

		 inode.el = new DOMElement(inode,{
		 		classes:['l_close'],
		 		content:`<img src="images/home/close.png">`
		 });

		 inode.liId = index;
		 inode.mark = 'close';
		 inode.addUIEvent('click');

}



listItem.prototype = Object.create( Node.prototype );

module.exports = listItem;