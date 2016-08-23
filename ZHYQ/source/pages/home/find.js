var Node = require('famous/core/Node');
var DOMElement = require('famous/dom-renderables/DOMElement');
var navbar = require('navbar');
var blank = require('blank');

class find extends Node{
	constructor(){
		super({
			id:'find'
		});

		new DOMElement(this,{
			'id':'l_find'
		})

		this.addChild(new navbar('活动')).el.setContent("<p class='font-lg text-center'><span>活动</span></p>");

		this.addChild(new blank('find'));
	}

}


module.exports = find;