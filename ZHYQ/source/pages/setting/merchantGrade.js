/**
 * Created by UMZS on 2016/8/5.
 */
var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var Nav = require('navbar');
var App = require('App');
var CrossCall = require('famous/core/CrossCall');
var sign = require('model/SignModel');
var Ajax = require('Ajax');

class merchantGrade extends Page{
    constructor(){
        super({id:'merchantGrade'});
    }
    //创建
    onCreate(){
        super.onCreate();
        initNav(this);
        this.tabList = [];

        var userSign = sign.findOne();
        this.userId = userSign.id;
        this.token = userSign.token;

        new Ajax('/grade/lists_user')
            .data({
                'id':this.userId,
                'did':App.uuid,
                'tk':this.token
            })
            .success(function(d){
                if(d.status === 200){
                    this.listsUser = d.data.reverse();
                }
            }.bind(this)).post();
    }

    onResume(){
        super.onResume();
        if(!this.headBg){
            initContent(this,this.listsUser);
        }

    }
    //返回
    onDestroy(){
        var obj = this.getChildren(),
            i = obj.length;
        while(i--){
            this.removeChild(obj[i]);
        }
        super.onDestroy();
        this.headBg = null;
    }

    onReceive(e,p){
        if(e === 'click' && p.node.listId === 'tab'){
            var  allChild = p.node.getParent().getChildren(),
                len = allChild.length;
            for(var i = 0; i < len;i++ ){
                allChild[i].el.removeClass('tab_color');
            }

            p.node.el.addClass('tab_color');

            new Ajax('/grade_config/lists_id')
                .data({
                    'gid': p.node.gId,
                    'id':this.userId,
                    'did':App.uuid,
                    'tk':this.token
                })
                .success(function(d){
                    if(d.status === 200 ){
                        var liData = d.data;
                        var htmlStr = '';
                        if(liData != null){
                            for(var i = 0;i<liData.length;i++){
                                htmlStr += `<li><em>${liData[i].name}</em><span>${liData[i].desc}</span></li>`;
                            }
                        }else{
                            htmlStr = '<img src="./images/setting/levelblank.png">';
                        }
                        this.mes.el.setContent(`<ul>${htmlStr}</ul>`);
                    }
                }.bind(this)).post();
        }
        p.stopPropagation();
    }
}
//导航
function initNav(node){
    var navbar = new Nav('商家等级',function(){
        //console.log( node.tabList);
        for(var i =0;i<node.tabList.length;i++){
            node.tabList[i].el.removeClass('tab_color')
        }


    });
    navbar.el.addClass('white_nav');
    node.addChild(navbar);
}

//中部内容
function initContent(node,listsUser){
    var _this = node;
    var bgSize = App.width*315/750;
    var headBg = _this.addChild();
    headBg
        .setSizeMode('relative','absolute')
        .setAbsoluteSize(null,bgSize)
        .setPosition(0,44)
        .el = new DOMElement(headBg,{
        content:'<img width="100%" src="./images/setting/grade_bg.jpg">'
    });

    node.headBg = headBg;

    var merchant = _this.addChild();
    merchant
        .setSizeMode('relative','absolute')
        .setAbsoluteSize(null,50)
        .setPosition(0,44+bgSize)
        .el = new DOMElement(merchant,{
        classes:['merchant']
    });

    for(var i = 0; i<listsUser.length;i++){
        var tab = merchant.addChild();
        tab
            .setAlign(i/3)
            .setProportionalSize(1/3)
            .el = new DOMElement(tab,{
            classes:['tab'],
            content:'<span>'+listsUser[i].name+'</span>'
        });

        tab.addUIEvent('click');
        tab.listId = 'tab';
        tab.gId = listsUser[i].id;

        i == 0 &&  tab.el.addClass('tab_color');

        _this.tabList.push(tab);
    }

    _this.mes = _this.addChild();
    _this.mes
        .setSizeMode('relative','absolute')
        .setAbsoluteSize(null,App.height-44-bgSize-50-10)
        .setPosition(0,44+bgSize+50+10)
        .setAlign(.5)
        .setMountPoint(.5)
        .el = new DOMElement(_this.mes,{
        classes:['mes','overflow_scoll']
    });

    new Ajax('/grade_config/lists_id')
        .data({
            'gid':1,
            'id':_this.userId,
            'did':App.uuid,
            'tk':_this.token
        })
        .success(function(d){
            if(d.status === 200){
                var htmlStr = '';
                var firData = d.data;

                if(firData != null){
                    for(var i = 0;i<firData.length;i++){
                        htmlStr += `<li><em>${firData[i].name}</em><span>${firData[i].desc}</span></li>`;
                    }
                    _this.mes.el.setContent(`<ul>${htmlStr}</ul>`)
                }else{
                    _this.mes.el.setContent(`<img src="./images/setting/levelblank.png">`)
                }
            }
      }).post();

}// initContent end

module.exports = merchantGrade;