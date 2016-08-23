'use strict';

var Compositor = require('famous/renderers/Compositor');
var UIManager = require('famous/renderers/UIManager');
var Ajax = require('Ajax');
var versionModel = require('model/VersionModel');
var RequestAnimationFrameLoop = require('famous/render-loops/RequestAnimationFrameLoop');
    require("FastClick");
var compositor;
// var Ajax ;

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    
    compositor = new Compositor();

    new UIManager(new Worker('./work.js'),  compositor, new RequestAnimationFrameLoop());
    //回退功能
    document.addEventListener("backbutton", onBackKeyDown, false);

    if(cordova.platformId == 'android'){

        if(!versionModel.findOne() || !versionModel.findOne().cancel){
            setTimeout(function(){
                checkUpdate();
            },5000);
        }    

            
        
    }else{
    	setTimeout(function(){
        	getAppVersion();
    	},5000);
    }
}

// onDeviceReady();
//
function onBackKeyDown() {
    for (var selector in compositor._contexts)
    compositor.sendEvent(selector, 'backbutton', {});
}

//检测版本
function checkUpdate(){
	cordova.getAppVersion.getVersionNumber(function (v) {
		// console.log(v);
    	new Ajax('/app_version/single').data({'did':device.uuid}).success(function(d){
    		// console.log(d);
    		if(d.status === 200){
    			var data = d.data;
    			var serverV = data.version.split('.')[2];
    			var currentV = v.split('.')[2];
    			if(currentV !== serverV){
    				if(!versionModel.findOne()){
    					versionModel.save({'path':data.path,'version':data.version});	
    				}else{
    					versionModel.update({'version':data.version},{'path':data.path,'version':data.version});
    				}
    				navigator.notification.confirm('我们已发现新版本，是否先前往下载？',function(i){
    					if(i == 1){
                            versionModel.update({'version':data.version},{'cancel':false});
    						window.open(data.path);
    					}else{ //取消后再次进入不在提示
                            versionModel.update({'version':data.version},{'cancel':true});
                        }
    				},'检查更新',['确定','取消']);
    			}
    		}
    	}).post();
	});
}

//获取版本号
function getAppVersion(){

    cordova.getAppVersion.getVersionNumber(function(v){
        if(!versionModel.findOne()){
			versionModel.save({'path':null,'version':v,'cancel':false});	
		}else{
			versionModel.update({'version':v},{'path':null,'version':v,'cancel':false});
		}
    });
}

