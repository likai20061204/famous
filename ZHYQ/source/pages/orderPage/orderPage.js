/**
 * Created by UMZS on 2016/7/18.
 */
var Page = require('Page');
var DOMElement = require('famous/dom-renderables/DOMElement');
var App = require('App');
var navbar = require('twoBtnNav');
var button = require('button');
var Ajax = require('Ajax');
var sign = require('model/SignModel');


class orderPage extends Page{
    constructor(){
        super({id:'orderPage'});
    }
    onCreate(){
        super.onCreate();
        initNav(this);
        var userSign = sign.findOne();
        this.userId = userSign.id;
        this.token = userSign.token;
        //状态
        new Ajax('/cater_fast/status')
            .data({
                'id':this.userId,
                'did':App.uuid,
                'tk':this.token
            })
            .success(function(d){
                if(d.status === 200){
                    this.caterStatus = d.data - 0;
                }
            }.bind(this)).post();

        //    价格
        new Ajax('cater_fast/price')
            .data({
                'id':this.userId,
                'did':App.uuid,
                'tk':this.token
            })
            .success(function(d){
                if(d.status === 200){
                    this.caterPrice = d.data;
                }
            }.bind(this)).post();

        //商家地址
        new Ajax('user_store/list_id')
            .data({
                'id':this.userId,
                'did':App.uuid,
                'tk':this.token
            })
            .success(function(d){
                if(d.status === 200){
                    this.userShop = d.data;
                }
            }.bind(this)).post();

        //    服务提醒
        new Ajax('cater_fast/remark')
            .data({
                'id':this.userId,
                'did':App.uuid,
                'tk':this.token
            })
            .success(function(d){
                if(d.status === 200){
                    this.caterRemark = d.data
                }
            }.bind(this)).post();

    }

    onResume(){
        super.onResume();
        if(!this._con){
            initContent(this,this.caterStatus,this.caterPrice,this.userShop,this.caterRemark);
        }

    }

    onDestroy(){
        var _this = this,
            obj = this.getChildren(),
            i = obj.length;

        while(i--)
            this.removeChild(obj[i]);

        super.onDestroy();
        this._con = null;
    }
}
//头部
function initNav(node){
    var _this = node;
    var backButton = new button(" ","","goback2");

    // backButton.setAbsoluteSize(44,44);
    backButton.clickEvent = function(){
        node.back();
    };

    var rightText = new button('订餐记录','','right_text');
    rightText.setAbsoluteSize(100,44);
    rightText.clickEvent = function(){
        _this.to('orderRecord');
    };

    node.addChild(new navbar('订餐',backButton,rightText));
}
//内容
function either(node,data,shop,remind_txt){
    var _this = node;
    var con = node.addChild();
    node._con = con;
    _this.imgH = 120/694*(App.width - 28);
    var conJ = 44+7+_this.imgH+7;
    //shop = null;
    //data = null;

    if(data == null){
        data = 13;
    }

    if(shop == null){
        shop = [];
    }
    var shopData = shop;

    var shopStr = '';
    for(var i = 0 ; i <shopData.length;i++){
        shopStr += '<option value="'+shopData[i].id+'"">'+shopData[i].name+'</option>'
    }

    var imgBox = _this.addChild();
    imgBox
        .setSizeMode('relative','absolute')
        .setAbsoluteSize(null,_this.imgH)
        .setPosition(0,44+7)
        .setDifferentialSize(-28)
        .setAlign(.5)
        .setMountPoint(.5)
        .el = new DOMElement(imgBox,{
        classes:['img_box'],
        content:'<p><span class="title">套餐盒饭</span><span class="price">'+data+'元/份</span></p><img width="100%" src="./images/orderPage/orderPage-bg.png"/>'
    });

    con
        .setSizeMode('relative','absolute')
        .setAbsoluteSize(null,75*3)
        .setDifferentialSize(-28,-conJ)
        .setPosition(0,conJ)
        .setAlign(.5)
        .setMountPoint(.5)
        .el = new DOMElement(con,{
        classes:['con'],
        content:
        '<div class="dic"><div class="bor"><span>请选择份数</span></div>'+
        '<div class="bor"><span>总价</span></div>'+
        '<div class="bor"><span>送餐地点</span><em class="side"><img src="images/common/r_arrow_ico.png" alt=""/></em></div></div>'
    });

    var count = con.addChild();
    count
        .setSizeMode('absolute','absolute')
        .setAbsoluteSize(100,75)
        .setPosition(-10,0)
        .setAlign(1)
        .setMountPoint(1)
        .el = new DOMElement(count,{
    });

    var reduce = count.addChild();
    reduce
        .setSizeMode('absolute','absolute')
        .setAbsoluteSize(25,25)
        .setAlign(0,.5)
        .setMountPoint(0,.5)
        .el = new DOMElement(reduce,{
        content:'<img width="25px" src="images/orderPage/reduce.png">'
    });

    var nm = 1;
    reduce.onReceive = function(e,p){
        if(e === 'click'){
            if(nm == 0){
                return;
            }
            nm--;
            num.el.setContent(nm);
            twelve.el.setContent('￥'+nm*data)
        }
    };

    reduce.addUIEvent('click');
    //份数
    var num = count.addChild();
    num
        .setSizeMode('absolute','absolute')
        .setAbsoluteSize(15,15)
        .setAlign(.5,.5)
        .setMountPoint(.5,.5)
        .el = new DOMElement(num,{
        classes:['num'],
        content:nm
    });


    var add = count.addChild();
    add
        .setSizeMode('absolute','absolute')
        .setAbsoluteSize(25,25)
        .setAlign(1,.5)
        .setMountPoint(1,.5)
        .el = new DOMElement(add,{
        content:'<img width="25px" src="images/orderPage/add.png">'
    });

    add.onReceive = function(e,p){
        if(e === 'click'){
            nm++;
            num.el.setContent(nm);
            twelve.el.setContent('￥'+nm*data)
        }
    };
    add.addUIEvent('click');
    //价格
    var twelve = con.addChild();
    twelve
        .setSizeMode('absolute','absolute')
        .setAbsoluteSize(100,75)
        .setPosition(-10,75)
        .setAlign(1)
        .setMountPoint(1)
        .el = new DOMElement(twelve,{
        classes:['twelve'],
        content:'￥'+data
    });

    var address = con.addChild();
    address
        .setSizeMode('relative','absolute')
        .setAbsoluteSize(null,75)
        .setDifferentialSize(-60)
        .setPosition(70,75*2)
        .el = new DOMElement(address,{
        classes:['address'],
        content:'<select><option value="-1">请选择店铺地址</option>'+shopStr+'</select>'
    });
    var add_id = '';
    address.onReceive = function(e,p){
        if(e === 'change'){
            add_id = p.value;
        }
    };

    address.addUIEvent('change');
    var btn = node.addChild();
    btn
        .setSizeMode('absolute','absolute')
        .setAbsoluteSize(272,42)
        .setPosition(0,44+7+_this.imgH+75*3+45+7)
        .setAlign(.5)
        .setMountPoint(.5)
        .el = new DOMElement(btn,{
        classes:['btn'],
        content:'立即订餐'
    });


//立即订餐点击事件
    btn.onReceive = function(e,p){
        if(e === 'click'){
            if(nm == 0 ){
                alert('请选择份数','','提示信息','确定')
            }else if(add_id == ''){
                alert('请选择送餐地点','','提示信息','确定')
            }else{
                new Ajax('cater_fast/apply')
                    .data({
                        'sid':add_id,
                        'num':nm,
                        'id':_this.userId,
                        'did':App.uuid,
                        'tk':_this.token
                    })
                    .success(function(d){
                        if(d.status === 200){

                            alert('你的订餐信息已收到，将在12点左右送到，请耐心等待',function(){
                                _this.to('orderRecord');
                                add_id = '';
                                nm = 1;
                                num.el.setContent(nm);
                                address.el.setContent('<select><option value="-1">请选择店铺地址</option>'+shopStr+'</select>');
                            },'提示信息','确定');
                        }else{
                            alert(d.msg,'','提示信息','确定')
                        }
                    }.bind(_this)).post();
            }

        }
    };

    btn.addUIEvent('click');
    var remindData = remind_txt;
    var remindStr = '';

    var remind = node.addChild();

    if(remindData == null){
        remindData = ['点餐时间：每日上午09:00-10:30','订餐记录页可取消订单，10:30后无法取消','一张餐券可兑换一份盒饭，请在结账时出示餐券'];
    }

    for(var i = 0;i<remindData.length;i++){
        remindStr +='<p><em>•</em>'+remindData[i]+'</p>'
    }

    remind
        .setSizeMode('relative','absolute')
        .setAbsoluteSize(null,App.width*308/750)
        .setAlign(1,1)
        .setMountPoint(1,1)
        .el = new DOMElement(remind,{
        classes:['remind'],
        content:'<h2><i></i>服务提醒</h2>'+remindStr
    });

}
//判断状态
function initContent(node,flag,price,shop,remind_txt){
    //判断是否可以订餐

    if(flag === 1 ){
        var _this = node;
        var eggplant = _this.addChild();
        eggplant
            .setSizeMode('relative','absolute')
            .setAbsoluteSize(null,App.width*594/726)
            .setProportionalSize(.8)
            .setAlign(.5,.5)
            .setMountPoint(.5,.5)
            .el = new DOMElement(eggplant,{
            classes:['eggplant'],
            content:'<img class="egg" width="100%" src="images/blank/eggplant.png">'
        });

        var mask = _this.addChild();
        mask
            .setPosition(0,44)
            .el = new DOMElement(mask,{
            classes:['mask']
        });
    }
    either(node,price,shop,remind_txt);

}
module.exports = orderPage;