/**
 * Created by UMZS on 2016/8/2.
 */
var Page = require('Page');
var Node = require('famous/core/Node');
var DOMElement = require('famous/dom-renderables/DOMElement');
var App = require('App');
var Nav = require('navbar');
var sign = require('model/SignModel.js');

class companyIntro extends Page{
    constructor(){
        super({id:'companyIntro'});
    }
    onCreate(){
        super.onCreate();
        initNav(this);

    }

    onResume(){
        super.onResume();
        if(!this._content){
            initContent(this);
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
}

//头部
function initNav (node){
    var navbar = new Nav('公司介绍');
    navbar.el.addClass('red_nav');
    node.addChild(navbar);
    node._nav = navbar;
}
//中部
function initContent(node){
    var content = node.addChild();
    content
        .setSizeMode('relative','relative')
        .setPosition(0,44)
        .el = new DOMElement(content,{
        classes:['overflow_scoll']
    });

    node._content = content;

    var bgH = 324/750*App.width;
    var headerBg = content.addChild();
    headerBg
        .setSizeMode('relative','absolute')
        .setAbsoluteSize(null,bgH)
        .el = new DOMElement(headerBg,{
        content:'<img width="100%" src = "images/setting/headerbg_02.jpg">'
    });


    var write = content.addChild();
    write
        .setSizeMode('relative','absolute')
        .setAbsoluteSize(null,235)
        .setPosition(0,44+bgH)
        .el = new DOMElement(write,{
        classes:['write'],
        content:'<h2>中益吉城五金机电</h2>' +
        '<p><em>•</em>中益吉城五金机电大市场是由四川中益吉城投资集团有限公司投资开发</p>' +
        '<p><em>•</em>位于成都市政府规划的大型五金机电市场集中发展区——青白江区城厢镇，紧邻成都铁路集装箱中心站及成都二绕金堂出口，' +
        '交通物流四通八达，是集五金机电产品展示交易、仓储、物流配送一体的大型五金机电专业市场。</p>'
    })
}

module.exports = companyIntro;