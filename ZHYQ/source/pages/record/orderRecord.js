/**
 * Created by UMZS on 2016/7/21.
 */
var Page = require('Page');
var Node = require('famous/core/Node');
var DOMElement = require('famous/dom-renderables/DOMElement');
var App = require('App');
var nav = require('navbar');
var ListView = require('ListView');
var Blank  = require('../../node_modules/blank.js');
var Ajax  = require('Ajax');
var sign = require('model/SignModel.js');

class orderRecord extends Page{
    constructor(){
        super({id:'orderRecord'});
    }
    onCreate(){
        super.onCreate();
        initNav(this);
        var userSign = sign.findOne();
        this.userId = userSign.id;
        this.token = userSign.token;

        //快餐订购所有信息
        new Ajax('cater_fast/lists_user')
            .data({
                'id':this.userId,
                'did':App.uuid,
                'tk':this.token
            })
            .success(function(d){
                if(d.status === 200){
                    this.caterLists_user = d.data;
                }
            }.bind(this)).post();
    }

    onResume(){
        super.onResume();
        if(!this._content){
            initContent(this,this.caterLists_user);
        }
        
    }

    onDestroy(){
        var cor = this.getChildren(),
            len = cor.length;
        while(len--){
            this.removeChild(cor[len]);
        }
        this._content = null;
        super.onDestroy()
    }

    onReceive(e,p){
        if(e === 'click' && p.node.btnId === 'cancel'){
            confirm('确认取消订单吗？',function(index){
                if(index === 1){
                    new Ajax('cater_fast/cancel')
                        .data({
                            'fid':p.node.orderId,
                            'id':this.userId,
                            'did':App.uuid,
                            'tk':this.token
                        })
                        .success(function(d){
                            if(d.status === 200){
                                p.node.el.setContent('已取消');
                                p.node.el.removeClass('cancel');
                                alert('你已成功取消','','提示信息','确定')
                            }else{
                                alert('超出规定时间，无法取消','','提示信息','确定')
                            }
                        }).post();
                }
            }.bind(this),'提示信息',['确定','取消']);

        }
        p.stopPropagation();
    }
}

function initNav (node){
    node.addChild(new nav('订餐记录'));
}

function initContent(node,data) {

    var content = node.addChild();

    content.setSizeMode('relative','relative')
        .setDifferentialSize(0,-44)
        .setPosition(0,44)
        .el = new DOMElement(content,{
        classes:['overflow_scoll']

    });

    node._content = content;

    if (data === null) {
        node.addChild(new Blank('order'));

    } else {

        node.allList = new ListView({
            threshold: 7,//预加载数 单位个（请根据item 高度适当调整）
            throttle: 16.7,//单位毫秒 控制Scroll执行频率
            itemSize: [null, 108],//item  尺寸
            createItem: function (data, obj) {
                var recordlist = new RecordList(data, obj);
                return recordlist;
            }
        });

        node.allList.BindData(data);

        content.addChild(node.allList);

    }
}

class RecordList extends Node{
    constructor(data,obj){
        super();
        var list = this.addChild();
        var statusTxt = '';
        list
            .setSizeMode('relative', 'absolute')
            .setAbsoluteSize(null, 101)
            .el = new DOMElement(list,{
            classes: ['con'],
            content: '<div class="title"><span>套餐盒饭</span></div>' +
            '<div class="time"><span>下单时间：' + data.time + '</span></div>' +
            '<div class="count"><span>' + data.num + '份</span> <em>￥' + data.money + '</em></div>'
        });

        var num = data.status;
        switch (num) {
            case 0:
                statusTxt = '正在进行，点击可取消';
                break;
            case 1:
                statusTxt = '已完成';
                break;
            case 2:
                statusTxt = '已取消';
                break;
        }

        var cancel = list.addChild();
        cancel
            .setSizeMode('absolute', 'absolute')
            .setAbsoluteSize(App.width * 200 / 326, '60')
            .setAlign(1)
            .setMountPoint(1)
            .el = new DOMElement(cancel, {
            classes: ['statusTxt'],
            content: statusTxt
        });

        cancel.btnId = 'cancel';
        cancel.orderId = data.id;
        num === 0 && cancel.el.addClass('cancel') && cancel.addUIEvent('click');
    }
}
module.exports = orderRecord;