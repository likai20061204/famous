var FamousEngine = require('famous/core/FamousEngine');
var CrossCall = require('famous/core/CrossCall');
	// require( 'StorageModel' );
var App = require('App');
	require( 'Dialogs' );
var Tips = require('Tips');
var sign = require('model/SignModel');

new CrossCall(function (){
	var App = {};

	// 模拟设备信息，通过浏览器调试时候

	var device = {
		uuid: '0123456789',
		model: 'x86',
		version: '9.0',
		platform: 'android'
	};

	App.height = screen.height;
	// 宽度
	App.width = screen.width;
	// 设备像素比
	App.devicePixelRatio = 2;
	// uuid
	App.uuid = device.uuid.toLowerCase();
	// 设备的模型或产品的名称
	App.model = device.model;
	// 系统版本号
	App.version = device.version;
	// 手机平台 IOS / ANDROID
	App.platform = device.platform.toLowerCase();

	self._call(App);
	
	
    
}).exec(function (arg) {
	// FamousEngine.createScene();
	var Scene = FamousEngine.createScene();
   
	
	for (var k in arg) {
		App[k] = arg[k];
	}

	Scene.addChild( Tips );
	Tips.hide();
    
    var userSign = sign.findOne();

    if(userSign && userSign.token){
		require( 'Router' ).load('home').setAlign(0,0,0);
    }else{
    	require( 'Router' ).load('login').setAlign(0,0,0);
    }
	


});
