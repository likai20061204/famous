/**
 * Created by UMZS on 2016/8/1.
 */
var Page = require('Page');
var Node = require('famous/core/Node');
var DOMElement = require('famous/dom-renderables/DOMElement');
var App = require('App');
var Nav = require('navbar');
var IconItem = require('IconItem');
var sign = require('model/SignModel');


class aboutUs extends Page{
    constructor(data){
        super({id:'aboutUs'});

        this._version = data ? data : 'V1.0.1';
    }
    onCreate(){
        super.onCreate();
        initNav(this);
    }

    onResume(){
        super.onResume();
        if(!this._content){
            initContent(this,this._version);
        }
    }

    onDestroy(){
        var cor = this.getChildren(),
            len = cor.length;
        while(len--){
            this.removeChild(cor[len]);
        }
        super.onDestroy();
        this._content = null;
    }

//    点击事件
    onReceive(e,p){
        if(e === 'click'&& p.node.listId === 'type0'){
            this.to('merchantGrade');
        }

        if(e === 'click'&& p.node.listId === 'type1'){
            this.to('companyIntro');
        }
        p.stopPropagation();
    }
}

//头部
function initNav (node){
    var navbar = new Nav('关于我们');
    navbar.el.addClass('red_nav');
    node.addChild(navbar);
    node._nav = navbar;
}

//中部
function initContent(node,version){

    var content = node.addChild();
    content
        .setSizeMode('relative','relative')
        .setPosition(0,44)
        .el = new DOMElement(content,{
        classes:['overflow_scoll']
    });

    node._content = content;

    var bgH = 432/750*App.width;
    var headerBg = content.addChild();
    headerBg
        .setSizeMode('relative','absolute')
        .setAbsoluteSize(null,bgH)
        .el = new DOMElement(headerBg,{
        content:'<img width="100%" src = "images/setting/headerbg_01.jpg">'
    });

    var icn = headerBg.addChild();
    icn
        .setSizeMode('relative','absolute')
        .setAbsoluteSize(null,102)
        .setAlign(.5)
        .setMountPoint(.5)
        .setPosition(0,bgH/2)
        .el = new DOMElement(icn,{
        classes:['icn'],
        content:`<p>最新版本：${version}</p>`
    });

    var aboutJson = [
        {'icon':'./images/setting/level.png','desc':'会员等级'},
        {'icon':'./images/setting/me.png','desc':'公司介绍'}
    ];

    var usBox = content.addChild();

    usBox
        .setSizeMode('relative','absolute')
        .setAbsoluteSize(null,2*50)
        .setPosition(0,bgH)

    aboutJson.forEach(function(obj,i){
        var about_item = new IconItem(obj,i,50)

        about_item.listId = 'type'+i;
        about_item.addUIEvent('click');
        usBox.addChild(about_item);
    })

} //initContent end

module.exports = aboutUs;
