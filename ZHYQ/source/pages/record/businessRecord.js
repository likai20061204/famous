/**
 * Created by UMZS on 2016/8/4.
 */
var Page = require('Page');
var Node = require('famous/core/Node');
var nav = require('navbar');
var Blank  = require('../../node_modules/blank.js');
var Ajax  = require('Ajax');

class businessRecord extends Page{
    constructor(){
        super({id: 'businessRecord'});
    }

    onCreate(){
        super.onCreate();
        initNav(this);
    }

    onResume(){
        super.onResume();
        initContent(this);
    }

    onDestroy(){
        var cor = this.getChildren(),
            len = cor.length;
        while (len--) {
            this.removeChild(cor[len]);
        }
        //this._content = null;
        super.onDestroy()
    }
}


function initNav (node){
    node.addChild(new nav('商家生涯'));
}

function initContent(node){
    node.addChild(new Blank('business'));
}

module.exports = businessRecord;