"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f;}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e);},l,l.exports,e,t,n,r);}return n[o].exports;}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++){s(r[o]);}return s;})({1:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var Commands=require('../core/Commands');/**
 * Camera is a component that is responsible for sending information to the renderer about where
 * the camera is in the scene.  This allows the user to set the type of projection, the focal depth,
 * and other properties to adjust the way the scenes are rendered.
 *
 * @class Camera
 *
 * @param {Node} node to which the instance of Camera will be a component of
 */function Camera(node){this._node=node;this._projectionType=Camera.ORTHOGRAPHIC_PROJECTION;this._focalDepth=0;this._near=0;this._far=0;this._requestingUpdate=false;this._id=node.addComponent(this);this._viewTransform=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);this._viewDirty=false;this._perspectiveDirty=false;this.setFlat();}Camera.FRUSTUM_PROJECTION=0;Camera.PINHOLE_PROJECTION=1;Camera.ORTHOGRAPHIC_PROJECTION=2;/**
 * @method
 *
 * @return {String} Name of the component
 */Camera.prototype.toString=function toString(){return'Camera';};/**
 * Gets object containing serialized data for the component
 *
 * @method
 *
 * @return {Object} the state of the component
 */Camera.prototype.getValue=function getValue(){return{component:this.toString(),projectionType:this._projectionType,focalDepth:this._focalDepth,near:this._near,far:this._far};};/**
 * Set the components state based on some serialized data
 *
 * @method
 *
 * @param {Object} state an object defining what the state of the component should be
 *
 * @return {Boolean} status of the set
 */Camera.prototype.setValue=function setValue(state){if(this.toString()===state.component){this.set(state.projectionType,state.focalDepth,state.near,state.far);return true;}return false;};/**
 * Set the internals of the component
 *
 * @method
 *
 * @param {Number} type an id corresponding to the type of projection to use
 * @param {Number} depth the depth for the pinhole projection model
 * @param {Number} near the distance of the near clipping plane for a frustum projection
 * @param {Number} far the distance of the far clipping plane for a frustum projection
 *
 * @return {Boolean} status of the set
 */Camera.prototype.set=function set(type,depth,near,far){if(!this._requestingUpdate){this._node.requestUpdate(this._id);this._requestingUpdate=true;}this._projectionType=type;this._focalDepth=depth;this._near=near;this._far=far;};/**
 * Set the camera depth for a pinhole projection model
 *
 * @method
 *
 * @param {Number} depth the distance between the Camera and the origin
 *
 * @return {Camera} this
 */Camera.prototype.setDepth=function setDepth(depth){if(!this._requestingUpdate){this._node.requestUpdate(this._id);this._requestingUpdate=true;}this._perspectiveDirty=true;this._projectionType=Camera.PINHOLE_PROJECTION;this._focalDepth=depth;this._near=0;this._far=0;return this;};/**
 * Gets object containing serialized data for the component
 *
 * @method
 *
 * @param {Number} near distance from the near clipping plane to the camera
 * @param {Number} far distance from the far clipping plane to the camera
 *
 * @return {Camera} this
 */Camera.prototype.setFrustum=function setFrustum(near,far){if(!this._requestingUpdate){this._node.requestUpdate(this._id);this._requestingUpdate=true;}this._perspectiveDirty=true;this._projectionType=Camera.FRUSTUM_PROJECTION;this._focalDepth=0;this._near=near;this._far=far;return this;};/**
 * Set the Camera to have orthographic projection
 *
 * @method
 *
 * @return {Camera} this
 */Camera.prototype.setFlat=function setFlat(){if(!this._requestingUpdate){this._node.requestUpdate(this._id);this._requestingUpdate=true;}this._perspectiveDirty=true;this._projectionType=Camera.ORTHOGRAPHIC_PROJECTION;this._focalDepth=0;this._near=0;this._far=0;return this;};/**
 * When the node this component is attached to updates, the Camera will
 * send new camera information to the Compositor to update the rendering
 * of the scene.
 *
 * @method
 *
 * @return {undefined} undefined
 */Camera.prototype.onUpdate=function onUpdate(){this._requestingUpdate=false;var path=this._node.getLocation();this._node.sendDrawCommand(Commands.WITH).sendDrawCommand(path);if(this._perspectiveDirty){this._perspectiveDirty=false;switch(this._projectionType){case Camera.FRUSTUM_PROJECTION:this._node.sendDrawCommand(Commands.FRUSTRUM_PROJECTION);this._node.sendDrawCommand(this._near);this._node.sendDrawCommand(this._far);break;case Camera.PINHOLE_PROJECTION:this._node.sendDrawCommand(Commands.PINHOLE_PROJECTION);this._node.sendDrawCommand(this._focalDepth);break;case Camera.ORTHOGRAPHIC_PROJECTION:this._node.sendDrawCommand(Commands.ORTHOGRAPHIC_PROJECTION);break;}}if(this._viewDirty){this._viewDirty=false;this._node.sendDrawCommand(Commands.CHANGE_VIEW_TRANSFORM);this._node.sendDrawCommand(this._viewTransform[0]);this._node.sendDrawCommand(this._viewTransform[1]);this._node.sendDrawCommand(this._viewTransform[2]);this._node.sendDrawCommand(this._viewTransform[3]);this._node.sendDrawCommand(this._viewTransform[4]);this._node.sendDrawCommand(this._viewTransform[5]);this._node.sendDrawCommand(this._viewTransform[6]);this._node.sendDrawCommand(this._viewTransform[7]);this._node.sendDrawCommand(this._viewTransform[8]);this._node.sendDrawCommand(this._viewTransform[9]);this._node.sendDrawCommand(this._viewTransform[10]);this._node.sendDrawCommand(this._viewTransform[11]);this._node.sendDrawCommand(this._viewTransform[12]);this._node.sendDrawCommand(this._viewTransform[13]);this._node.sendDrawCommand(this._viewTransform[14]);this._node.sendDrawCommand(this._viewTransform[15]);}};/**
 * When the transform of the node this component is attached to
 * changes, have the Camera update its projection matrix and
 * if needed, flag to node to update.
 *
 * @method
 *
 * @param {Array} transform an array denoting the transform matrix of the node
 *
 * @return {Camera} this
 */Camera.prototype.onTransformChange=function onTransformChange(transform){var a=transform;this._viewDirty=true;if(!this._requestingUpdate){this._node.requestUpdate(this._id);this._requestingUpdate=true;}var a00=a[0],a01=a[1],a02=a[2],a03=a[3],a10=a[4],a11=a[5],a12=a[6],a13=a[7],a20=a[8],a21=a[9],a22=a[10],a23=a[11],a30=a[12],a31=a[13],a32=a[14],a33=a[15],b00=a00*a11-a01*a10,b01=a00*a12-a02*a10,b02=a00*a13-a03*a10,b03=a01*a12-a02*a11,b04=a01*a13-a03*a11,b05=a02*a13-a03*a12,b06=a20*a31-a21*a30,b07=a20*a32-a22*a30,b08=a20*a33-a23*a30,b09=a21*a32-a22*a31,b10=a21*a33-a23*a31,b11=a22*a33-a23*a32,det=1/(b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06);this._viewTransform[0]=(a11*b11-a12*b10+a13*b09)*det;this._viewTransform[1]=(a02*b10-a01*b11-a03*b09)*det;this._viewTransform[2]=(a31*b05-a32*b04+a33*b03)*det;this._viewTransform[3]=(a22*b04-a21*b05-a23*b03)*det;this._viewTransform[4]=(a12*b08-a10*b11-a13*b07)*det;this._viewTransform[5]=(a00*b11-a02*b08+a03*b07)*det;this._viewTransform[6]=(a32*b02-a30*b05-a33*b01)*det;this._viewTransform[7]=(a20*b05-a22*b02+a23*b01)*det;this._viewTransform[8]=(a10*b10-a11*b08+a13*b06)*det;this._viewTransform[9]=(a01*b08-a00*b10-a03*b06)*det;this._viewTransform[10]=(a30*b04-a31*b02+a33*b00)*det;this._viewTransform[11]=(a21*b02-a20*b04-a23*b00)*det;this._viewTransform[12]=(a11*b07-a10*b09-a12*b06)*det;this._viewTransform[13]=(a00*b09-a01*b07+a02*b06)*det;this._viewTransform[14]=(a31*b01-a30*b03-a32*b00)*det;this._viewTransform[15]=(a20*b03-a21*b01+a22*b00)*det;};module.exports=Camera;},{"../core/Commands":3}],2:[function(require,module,exports){'use strict';var Commands=require("./Commands");/**
 * 提供web主线程与worker间函数互相调用的能力
 *
 * @class Chan
 * @constructor
 * @return {undefined} undefined
 */function Chan(){this.running=false;this._funList={};this._CallList={};}/**
 *设置通道
 *
 * @method
 *
 * @param {channel} 
 */Chan.prototype.setChannel=function(ch){this._channel=ch;this.start();};Chan.prototype.start=function(){this._running=true;};Chan.prototype.stop=function(){this._running=false;};/**
 *添加执行函数和回调函数。
 *
 * @method
 *
 * @param {function} 执行函数
 * @param {function} 回调函数
 */Chan.prototype.add=function(fun,call,param){var id=new Date();id="id"+id.getTime()+Math.ceil(Math.random()*10000);this._funList[id]=call;this._push({id:id,args:param,fun:fun.toString()});};/**
 *向channel 推送数据。
 *
 * @method
 *
 * @param {object} obj.id 、obj.res、 obj.fun
 */Chan.prototype._push=function(arg){if(!this._running)return;var CROSS_THREAD_MESSAGE=[Commands.ENGINE,Commands.CROSS_THREAD,arg];if(this._channel.sendMessage)this._channel.sendMessage(CROSS_THREAD_MESSAGE);else this._channel.postMessage(CROSS_THREAD_MESSAGE);};/**
 *channel.onMessage 时调用。
 *
 * @method
 *
 * @param {object} obj.id 、obj.res、 obj.fun
 */Chan.prototype.callback=function(arg){if(!arg.hasOwnProperty("res")){new funCaller(this,arg).exec();}else if(this._funList[arg.id]){this._funList[arg.id](arg.res);this._funList[arg.id]=null;delete this._funList[arg.id];}};function funCaller(ch,arg){this.chan=ch;this.fun=arg.fun;this.id=arg.id;if(!Array.isArray(arg.args))arg.args=[];this.arg=arg.args;}funCaller.prototype.exec=function(argument){var self=this;//暂时用Function 期待更好的方法。 
this.fun=eval("("+this.fun+")");var res=this.fun.apply(this,this.arg);if(typeof res!="undefined")self._call(res);};funCaller.prototype._call=function(arg){this.chan._push({id:this.id,res:arg});};module.exports=new Chan();},{"./Commands":3}],3:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';/**
 * An enumeration of the commands in our command queue.
 */var Commands={INIT_DOM:0,DOM_RENDER_SIZE:1,CHANGE_TRANSFORM:2,CHANGE_SIZE:3,CHANGE_PROPERTY:4,CHANGE_CONTENT:5,CHANGE_ATTRIBUTE:6,ADD_CLASS:7,REMOVE_CLASS:8,SUBSCRIBE:9,GL_SET_DRAW_OPTIONS:10,GL_AMBIENT_LIGHT:11,GL_LIGHT_POSITION:12,GL_LIGHT_COLOR:13,MATERIAL_INPUT:14,GL_SET_GEOMETRY:15,GL_UNIFORMS:16,GL_BUFFER_DATA:17,GL_CUTOUT_STATE:18,GL_MESH_VISIBILITY:19,GL_REMOVE_MESH:20,PINHOLE_PROJECTION:21,ORTHOGRAPHIC_PROJECTION:22,CHANGE_VIEW_TRANSFORM:23,WITH:24,FRAME:25,ENGINE:26,START:27,STOP:28,TIME:29,TRIGGER:30,NEED_SIZE_FOR:31,DOM:32,READY:33,ALLOW_DEFAULT:34,PREVENT_DEFAULT:35,UNSUBSCRIBE:36,CROSS_THREAD:37,prettyPrint:function prettyPrint(buffer,start,count){var callback;start=start?start:0;var data={i:start,result:''};for(var len=count?count+start:buffer.length;data.i<len;data.i++){callback=commandPrinters[buffer[data.i]];if(!callback)throw new Error('PARSE ERROR: no command registered for: '+buffer[data.i]);callback(buffer,data);}return data.result;}};var commandPrinters=[];commandPrinters[Commands.INIT_DOM]=function init_dom(buffer,data){data.result+=data.i+'. INIT_DOM\n    tagName: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.DOM_RENDER_SIZE]=function dom_render_size(buffer,data){data.result+=data.i+'. DOM_RENDER_SIZE\n    selector: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.CHANGE_TRANSFORM]=function change_transform(buffer,data){data.result+=data.i+'. CHANGE_TRANSFORM\n    val: [';for(var j=0;j<16;j++){data.result+=buffer[++data.i]+(j<15?', ':'');}data.result+=']\n\n';};commandPrinters[Commands.CHANGE_SIZE]=function change_size(buffer,data){data.result+=data.i+'. CHANGE_SIZE\n    x: '+buffer[++data.i]+', y: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.CHANGE_PROPERTY]=function change_property(buffer,data){data.result+=data.i+'. CHANGE_PROPERTY\n    key: '+buffer[++data.i]+', value: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.CHANGE_CONTENT]=function change_content(buffer,data){data.result+=data.i+'. CHANGE_CONTENT\n    content: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.CHANGE_ATTRIBUTE]=function change_attribute(buffer,data){data.result+=data.i+'. CHANGE_ATTRIBUTE\n    key: '+buffer[++data.i]+', value: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.ADD_CLASS]=function add_class(buffer,data){data.result+=data.i+'. ADD_CLASS\n    className: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.REMOVE_CLASS]=function remove_class(buffer,data){data.result+=data.i+'. REMOVE_CLASS\n    className: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.SUBSCRIBE]=function subscribe(buffer,data){data.result+=data.i+'. SUBSCRIBE\n    event: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_SET_DRAW_OPTIONS]=function gl_set_draw_options(buffer,data){data.result+=data.i+'. GL_SET_DRAW_OPTIONS\n    options: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_AMBIENT_LIGHT]=function gl_ambient_light(buffer,data){data.result+=data.i+'. GL_AMBIENT_LIGHT\n    r: '+buffer[++data.i]+'g: '+buffer[++data.i]+'b: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_LIGHT_POSITION]=function gl_light_position(buffer,data){data.result+=data.i+'. GL_LIGHT_POSITION\n    x: '+buffer[++data.i]+'y: '+buffer[++data.i]+'z: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_LIGHT_COLOR]=function gl_light_color(buffer,data){data.result+=data.i+'. GL_LIGHT_COLOR\n    r: '+buffer[++data.i]+'g: '+buffer[++data.i]+'b: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.MATERIAL_INPUT]=function material_input(buffer,data){data.result+=data.i+'. MATERIAL_INPUT\n    key: '+buffer[++data.i]+', value: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_SET_GEOMETRY]=function gl_set_geometry(buffer,data){data.result+=data.i+'. GL_SET_GEOMETRY\n   x: '+buffer[++data.i]+', y: '+buffer[++data.i]+', z: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_UNIFORMS]=function gl_uniforms(buffer,data){data.result+=data.i+'. GL_UNIFORMS\n    key: '+buffer[++data.i]+', value: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_BUFFER_DATA]=function gl_buffer_data(buffer,data){data.result+=data.i+'. GL_BUFFER_DATA\n    data: ';for(var i=0;i<5;i++){data.result+=buffer[++data.i]+', ';}data.result+='\n\n';};commandPrinters[Commands.GL_CUTOUT_STATE]=function gl_cutout_state(buffer,data){data.result+=data.i+'. GL_CUTOUT_STATE\n    state: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_MESH_VISIBILITY]=function gl_mesh_visibility(buffer,data){data.result+=data.i+'. GL_MESH_VISIBILITY\n    visibility: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_REMOVE_MESH]=function gl_remove_mesh(buffer,data){data.result+=data.i+'. GL_REMOVE_MESH\n\n';};commandPrinters[Commands.PINHOLE_PROJECTION]=function pinhole_projection(buffer,data){data.result+=data.i+'. PINHOLE_PROJECTION\n    depth: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.ORTHOGRAPHIC_PROJECTION]=function orthographic_projection(buffer,data){data.result+=data.i+'. ORTHOGRAPHIC_PROJECTION\n';};commandPrinters[Commands.CHANGE_VIEW_TRANSFORM]=function change_view_transform(buffer,data){data.result+=data.i+'. CHANGE_VIEW_TRANSFORM\n   value: [';for(var i=0;i<16;i++){data.result+=buffer[++data.i]+(i<15?', ':'');}data.result+=']\n\n';};commandPrinters[Commands.PREVENT_DEFAULT]=function prevent_default(buffer,data){data.result+=data.i+'. PREVENT_DEFAULT\n    value: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.ALLOW_DEFAULT]=function allow_default(buffer,data){data.result+=data.i+'. ALLOW_DEFAULT\n    value: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.READY]=function ready(buffer,data){data.result+=data.i+'. READY\n\n';};commandPrinters[Commands.WITH]=function w(buffer,data){data.result+=data.i+'. **WITH**\n     path: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.TIME]=function time(buffer,data){data.result+=data.i+'. TIME\n     ms: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.NEED_SIZE_FOR]=function need_size_for(buffer,data){data.result+=data.i+'. NEED_SIZE_FOR\n    selector: '+buffer[++data.i]+'\n\n';};module.exports=Commands;},{}],4:[function(require,module,exports){'use strict';var Chan=require("./Chan");/**
 *CrossCall 主要提供线程间的函数调用功能。
 *如在worker内调用 window、document 等对象。
 *
 * @method
 *
 * @param {function}  需要线程外执行的函数，通常会有一个返回值 例如：{id:32, text:"I`m Tester"}
 */function CrossCall(fun,param){this._fun=fun;this._param=param;}/**
 *设置线程外执行函数
 *
 * @method
 *
 * @param {function} 需要线程外执行的函数，通常会有一个返回值 例如：{id:32, text:"I`m Tester"}
 */CrossCall.prototype.setFun=function(fun,param){if(typeof fun!=="function")return;this._fun=fun;this._param=param;return this;};/**
 *执行
 *
 * @method
 *
 * @param {function} 回调函数，非必要。若设置_fun执行之后会调用之。
 */CrossCall.prototype.exec=function(fun){Chan.add(this._fun,fun,this._param);};module.exports=CrossCall;},{"./Chan":2}],5:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';/**
 * A collection of utilities for handling paths.
 *
 * @namespace
 */var Path={/**
     * determines if the passed in path has a trailing slash. Paths of the form
     * 'body/0/1/' return true, while paths of the form 'body/0/1' return false.
     *
     * @method
     *
     * @param {String} path the path
     *
     * @return {Boolean} whether or not the path has a trailing slash
     */hasTrailingSlash:function hasTrailingSlash(path){return path[path.length-1]==='/';},/**
     * Returns the depth in the tree this path represents. Essentially counts
     * the slashes ignoring a trailing slash.
     *
     * @method
     *
     * @param {String} path the path
     *
     * @return {Number} the depth in the tree that this path represents
     */depth:function depth(path){var count=0;var length=path.length;var len=this.hasTrailingSlash(path)?length-1:length;var i=0;for(;i<len;i++){count+=path[i]==='/'?1:0;}return count;},/**
     * Gets the position of this path in relation to its siblings.
     *
     * @method
     *
     * @param {String} path the path
     *
     * @return {Number} the index of this path in relation to its siblings.
     */index:function index(path){var length=path.length;var len=this.hasTrailingSlash(path)?length-1:length;while(len--){if(path[len]==='/')break;}var result=parseInt(path.substring(len+1));return isNaN(result)?0:result;},/**
     * Gets the position of the path at a particular breadth in relationship
     * to its siblings
     *
     * @method
     *
     * @param {String} path the path
     * @param {Number} depth the breadth at which to find the index
     *
     * @return {Number} index at the particular depth
     */indexAtDepth:function indexAtDepth(path,depth){var i=0;var len=path.length;var index=0;for(;i<len;i++){if(path[i]==='/')index++;if(index===depth){path=path.substring(i?i+1:i);index=path.indexOf('/');path=index===-1?path:path.substring(0,index);index=parseInt(path);return isNaN(index)?path:index;}}},/**
     * returns the path of the passed in path's parent.
     *
     * @method
     *
     * @param {String} path the path
     *
     * @return {String} the path of the passed in path's parent
     */parent:function parent(path){return path.substring(0,path.lastIndexOf('/',path.length-2));},/**
     * Determines whether or not the first argument path is the direct child
     * of the second argument path.
     *
     * @method
     *
     * @param {String} child the path that may be a child
     * @param {String} parent the path that may be a parent
     *
     * @return {Boolean} whether or not the first argument path is a child of the second argument path
     */isChildOf:function isChildOf(child,parent){return this.isDescendentOf(child,parent)&&this.depth(child)===this.depth(parent)+1;},/**
     * Returns true if the first argument path is a descendent of the second argument path.
     *
     * @method
     *
     * @param {String} child potential descendent path
     * @param {String} parent potential ancestor path
     *
     * @return {Boolean} whether or not the path is a descendent
     */isDescendentOf:function isDescendentOf(child,parent){if(child===parent)return false;child=this.hasTrailingSlash(child)?child:child+'/';parent=this.hasTrailingSlash(parent)?parent:parent+'/';return this.depth(parent)<this.depth(child)&&child.indexOf(parent)===0;},/**
     * returns the selector portion of the path.
     *
     * @method
     *
     * @param {String} path the path
     *
     * @return {String} the selector portion of the path.
     */getSelector:function getSelector(path){var index=path.indexOf('/');return index===-1?path:path.substring(0,index);}};module.exports=Path;},{}],6:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var ElementCache=require('./ElementCache');var math=require('./Math');var PathUtils=require('../core/Path');var vendorPrefix=require('../utilities/vendorPrefix');var CallbackStore=require('../utilities/CallbackStore');var eventMap=require('./events/EventMap');var TRANSFORM=null;/**
 * DOMRenderer is a class responsible for adding elements
 * to the DOM and writing to those elements.
 * There is a DOMRenderer per context, represented as an
 * element and a selector. It is instantiated in the
 * context class.
 *
 * @class DOMRenderer
 *
 * @param {HTMLElement} element an element.
 * @param {String} selector the selector of the element.
 * @param {Compositor} compositor the compositor controlling the renderer
 */function DOMRenderer(element,selector,compositor){var _this=this;element.classList.add('famous-dom-renderer');TRANSFORM=TRANSFORM||vendorPrefix('transform');this._compositor=compositor;// a reference to the compositor
this._target=null;// a register for holding the current
// element that the Renderer is operating
// upon
this._parent=null;// a register for holding the parent
// of the target
this._path=null;// a register for holding the path of the target
// this register must be set first, and then
// children, target, and parent are all looked
// up from that.
this._children=[];// a register for holding the children of the
// current target.
this._insertElCallbackStore=new CallbackStore();this._removeElCallbackStore=new CallbackStore();this._root=new ElementCache(element,selector);// the root
// of the dom tree that this
// renderer is responsible
// for
this._boundTriggerEvent=function(ev){return _this._triggerEvent(ev);};this._selector=selector;this._elements={};this._elements[selector]=this._root;this.perspectiveTransform=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);this._VPtransform=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);this._lastEv=null;}/**
 * Attaches an EventListener to the element associated with the passed in path.
 * Prevents the default browser action on all subsequent events if
 * `preventDefault` is truthy.
 * All incoming events will be forwarded to the compositor by invoking the
 * `sendEvent` method.
 * Delegates events if possible by attaching the event listener to the context.
 *
 * @method
 *
 * @param {String} type DOM event type (e.g. click, mouseover).
 * @param {Boolean} preventDefault Whether or not the default browser action should be prevented.
 *
 * @return {undefined} undefined
 */DOMRenderer.prototype.subscribe=function subscribe(type){this._assertTargetLoaded();this._listen(type);this._target.subscribe[type]=true;};/**
 * Used to preventDefault if an event of the specified type is being emitted on
 * the currently loaded target.
 *
 * @method
 *
 * @param  {String} type    The type of events that should be prevented.
 * @return {undefined}      undefined
 */DOMRenderer.prototype.preventDefault=function preventDefault(type){this._assertTargetLoaded();this._listen(type);this._target.preventDefault[type]=true;};/**
 * Used to undo a previous call to preventDefault. No longer `preventDefault`
 * for this event on the loaded target.
 *
 * @method
 * @private
 *
 * @param  {String} type    The event type that should no longer be affected by
 *                          `preventDefault`.
 * @return {undefined}      undefined
 */DOMRenderer.prototype.allowDefault=function allowDefault(type){this._assertTargetLoaded();this._listen(type);this._target.preventDefault[type]=false;};/**
 * Internal helper function used for adding an event listener for the the
 * currently loaded ElementCache.
 *
 * If the event can be delegated as specified in the {@link EventMap}, the
 * bound {@link _triggerEvent} function will be added as a listener on the
 * root element. Otherwise, the listener will be added directly to the target
 * element.
 *
 * @private
 * @method
 *
 * @param  {String} type    The event type to listen to (e.g. click).
 * @return {undefined}      undefined
 */DOMRenderer.prototype._listen=function _listen(type){this._assertTargetLoaded();if(!this._target.listeners[type]&&!this._root.listeners[type]){// FIXME Add to content DIV if available
var target=eventMap[type][1]?this._root:this._target;target.listeners[type]=this._boundTriggerEvent;target.element.addEventListener(type,this._boundTriggerEvent);}};/**
 * Unsubscribes from all events that are of the specified type.
 *
 * @method
 *
 * @param {String} type DOM event type (e.g. click, mouseover).
 * @return {undefined} undefined
 */DOMRenderer.prototype.unsubscribe=function unsubscribe(type){this._assertTargetLoaded();this._target.subscribe[type]=false;};/**
 * Function to be added using `addEventListener` to the corresponding
 * DOMElement.
 *
 * @method
 * @private
 *
 * @param {Event} ev DOM Event payload
 *
 * @return {undefined} undefined
 */DOMRenderer.prototype._triggerEvent=function _triggerEvent(ev){if(this._lastEv===ev)return;// Use ev.path, which is an array of Elements (polyfilled if needed).
var evPath=ev.path?ev.path:_getPath(ev);// First element in the path is the element on which the event has actually
// been emitted.
for(var i=0;i<evPath.length;i++){// Skip nodes that don't have a dataset property or data-fa-path
// attribute.
if(!evPath[i].dataset)continue;var path=evPath[i].dataset.faPath;if(!path)continue;// Optionally preventDefault. This needs forther consideration and
// should be optional. Eventually this should be a separate command/
// method.
if(this._elements[path].preventDefault[ev.type]){ev.preventDefault();}// Stop further event propogation and path traversal as soon as the
// first ElementCache subscribing for the emitted event has been found.
if(this._elements[path]&&this._elements[path].subscribe[ev.type]){this._lastEv=ev;var NormalizedEventConstructor=eventMap[ev.type][0];// Finally send the event to the Worker Thread through the
// compositor.
this._compositor.sendEvent(path,ev.type,new NormalizedEventConstructor(ev));break;}}};/**
 * getSizeOf gets the dom size of a particular DOM element.  This is
 * needed for render sizing in the scene graph.
 *
 * @method
 *
 * @param {String} path path of the Node in the scene graph
 *
 * @return {Array} a vec3 of the offset size of the dom element
 */DOMRenderer.prototype.getSizeOf=function getSizeOf(path){var element=this._elements[path];if(!element)return null;var res={val:element.size};this._compositor.sendEvent(path,'resize',res);return res;};function _getPath(ev){// TODO move into _triggerEvent, avoid object allocation
var path=[];var node=ev.target;while(node!==document.body){path.push(node);node=node.parentNode;}return path;}/**
 * Executes the retrieved draw commands. Draw commands only refer to the
 * cross-browser normalized `transform` property.
 *
 * @method
 *
 * @param {Object} renderState description
 *
 * @return {undefined} undefined
 */DOMRenderer.prototype.draw=function draw(renderState){if(renderState.perspectiveDirty){this.perspectiveDirty=true;this.perspectiveTransform[0]=renderState.perspectiveTransform[0];this.perspectiveTransform[1]=renderState.perspectiveTransform[1];this.perspectiveTransform[2]=renderState.perspectiveTransform[2];this.perspectiveTransform[3]=renderState.perspectiveTransform[3];this.perspectiveTransform[4]=renderState.perspectiveTransform[4];this.perspectiveTransform[5]=renderState.perspectiveTransform[5];this.perspectiveTransform[6]=renderState.perspectiveTransform[6];this.perspectiveTransform[7]=renderState.perspectiveTransform[7];this.perspectiveTransform[8]=renderState.perspectiveTransform[8];this.perspectiveTransform[9]=renderState.perspectiveTransform[9];this.perspectiveTransform[10]=renderState.perspectiveTransform[10];this.perspectiveTransform[11]=renderState.perspectiveTransform[11];this.perspectiveTransform[12]=renderState.perspectiveTransform[12];this.perspectiveTransform[13]=renderState.perspectiveTransform[13];this.perspectiveTransform[14]=renderState.perspectiveTransform[14];this.perspectiveTransform[15]=renderState.perspectiveTransform[15];}if(renderState.viewDirty||renderState.perspectiveDirty){math.multiply(this._VPtransform,this.perspectiveTransform,renderState.viewTransform);this._root.element.style[TRANSFORM]=this._stringifyMatrix(this._VPtransform);}};/**
 * Internal helper function used for ensuring that a path is currently loaded.
 *
 * @method
 * @private
 *
 * @return {undefined} undefined
 */DOMRenderer.prototype._assertPathLoaded=function _asserPathLoaded(){if(!this._path)throw new Error('path not loaded');};/**
 * Internal helper function used for ensuring that a parent is currently loaded.
 *
 * @method
 * @private
 *
 * @return {undefined} undefined
 */DOMRenderer.prototype._assertParentLoaded=function _assertParentLoaded(){if(!this._parent)throw new Error('parent not loaded');};/**
 * Internal helper function used for ensuring that children are currently
 * loaded.
 *
 * @method
 * @private
 *
 * @return {undefined} undefined
 */DOMRenderer.prototype._assertChildrenLoaded=function _assertChildrenLoaded(){if(!this._children)throw new Error('children not loaded');};/**
 * Internal helper function used for ensuring that a target is currently loaded.
 *
 * @method  _assertTargetLoaded
 *
 * @return {undefined} undefined
 */DOMRenderer.prototype._assertTargetLoaded=function _assertTargetLoaded(){if(!this._target)throw new Error('No target loaded');};/**
 * Finds and sets the parent of the currently loaded element (path).
 *
 * @method
 * @private
 *
 * @return {ElementCache} Parent element.
 */DOMRenderer.prototype.findParent=function findParent(){this._assertPathLoaded();var path=this._path;var parent;while(!parent&&path.length){path=path.substring(0,path.lastIndexOf('/'));parent=this._elements[path];}this._parent=parent;return parent;};/**
 * Used for determining the target loaded under the current path.
 *
 * @method
 * @deprecated
 *
 * @return {ElementCache|undefined} Element loaded under defined path.
 */DOMRenderer.prototype.findTarget=function findTarget(){this._target=this._elements[this._path];return this._target;};/**
 * Loads the passed in path into the DOMRenderer.
 *
 * @method
 *
 * @param {String} path Path to be loaded
 *
 * @return {String} Loaded path
 */DOMRenderer.prototype.loadPath=function loadPath(path){this._path=path;this._target=this._elements[this._path];return this._path;};/**
 * Finds children of a parent element that are descendents of a inserted element in the scene
 * graph. Appends those children to the inserted element.
 *
 * @method resolveChildren
 * @return {void}
 *
 * @param {HTMLElement} element the inserted element
 * @param {HTMLElement} parent the parent of the inserted element
 */DOMRenderer.prototype.resolveChildren=function resolveChildren(element,parent){var i=0;var childNode;var path=this._path;var childPath;while(childNode=parent.childNodes[i]){if(!childNode.dataset){i++;continue;}childPath=childNode.dataset.faPath;if(!childPath){i++;continue;}if(PathUtils.isDescendentOf(childPath,path))element.appendChild(childNode);else i++;}};/**
 * Inserts a DOMElement at the currently loaded path, assuming no target is
 * loaded. Only one DOMElement can be associated with each path.
 *
 * @method
 *
 * @param {String} tagName Tag name (capitalization will be normalized).
 *
 * @return {undefined} undefined
 */DOMRenderer.prototype.insertEl=function insertEl(tagName){this.findParent();this._assertParentLoaded();if(this._parent.void)throw new Error(this._parent.path+' is a void element. '+'Void elements are not allowed to have children.');if(!this._target)this._target=new ElementCache(document.createElement(tagName),this._path);var el=this._target.element;var parent=this._parent.element;this.resolveChildren(el,parent);parent.appendChild(el);this._elements[this._path]=this._target;this._insertElCallbackStore.trigger(this._path,this._target);};/**
 * Sets a property on the currently loaded target.
 *
 * @method
 *
 * @param {String} name Property name (e.g. background, color, font)
 * @param {String} value Proprty value (e.g. black, 20px)
 *
 * @return {undefined} undefined
 */DOMRenderer.prototype.setProperty=function setProperty(name,value){this._assertTargetLoaded();this._target.element.style[name]=value;};/**
 * Sets the size of the currently loaded target.
 * Removes any explicit sizing constraints when passed in `false`
 * ("true-sizing").
 *
 * Invoking setSize is equivalent to a manual invocation of `setWidth` followed
 * by `setHeight`.
 *
 * @method
 *
 * @param {Number|false} width   Width to be set.
 * @param {Number|false} height  Height to be set.
 *
 * @return {undefined} undefined
 */DOMRenderer.prototype.setSize=function setSize(width,height){this._assertTargetLoaded();this.setWidth(width);this.setHeight(height);};/**
 * Sets the width of the currently loaded ElementCache.
 *
 * @method
 *
 * @param  {Number|false} width     The explicit width to be set on the
 *                                  ElementCache's target (and content) element.
 *                                  `false` removes any explicit sizing
 *                                  constraints from the underlying DOM
 *                                  Elements.
 *
 * @return {undefined} undefined
 */DOMRenderer.prototype.setWidth=function setWidth(width){this._assertTargetLoaded();var contentWrapper=this._target.content;if(width===false){this._target.explicitWidth=true;if(contentWrapper)contentWrapper.style.width='';width=contentWrapper?contentWrapper.offsetWidth:0;this._target.element.style.width=width+'px';}else{this._target.explicitWidth=false;if(contentWrapper)contentWrapper.style.width=width+'px';this._target.element.style.width=width+'px';}this._target.size[0]=width;};/**
 * Sets the height of the currently loaded ElementCache.
 *
 * @method  setHeight
 *
 * @param  {Number|false} height    The explicit height to be set on the
 *                                  ElementCache's target (and content) element.
 *                                  `false` removes any explicit sizing
 *                                  constraints from the underlying DOM
 *                                  Elements.
 *
 * @return {undefined} undefined
 */DOMRenderer.prototype.setHeight=function setHeight(height){this._assertTargetLoaded();var contentWrapper=this._target.content;if(height===false){this._target.explicitHeight=true;if(contentWrapper)contentWrapper.style.height='';height=contentWrapper?contentWrapper.offsetHeight:0;this._target.element.style.height=height+'px';}else{this._target.explicitHeight=false;if(contentWrapper)contentWrapper.style.height=height+'px';this._target.element.style.height=height+'px';}this._target.size[1]=height;};/**
 * Sets an attribute on the currently loaded target.
 *
 * @method
 *
 * @param {String} name Attribute name (e.g. href)
 * @param {String} value Attribute value (e.g. http://famous.org)
 *
 * @return {undefined} undefined
 */DOMRenderer.prototype.setAttribute=function setAttribute(name,value){this._assertTargetLoaded();this._target.element.setAttribute(name,value);if(name==="value")this._target.element.value=value;};/**
 * Sets the `innerHTML` content of the currently loaded target.
 *
 * @method
 *
 * @param {String} content Content to be set as `innerHTML`
 *
 * @return {undefined} undefined
 */DOMRenderer.prototype.setContent=function setContent(content){this._assertTargetLoaded();if(this._target.formElement){this._target.element.value=content;}else{if(!this._target.content){this._target.content=document.createElement('div');this._target.content.classList.add('famous-dom-element-content');this._target.element.insertBefore(this._target.content,this._target.element.firstChild);}this._target.content.innerHTML=content;}this.setSize(this._target.explicitWidth?false:this._target.size[0],this._target.explicitHeight?false:this._target.size[1]);};/**
 * Sets the passed in transform matrix (world space). Inverts the parent's world
 * transform.
 *
 * @method
 *
 * @param {Float32Array} transform The transform for the loaded DOM Element in world space
 *
 * @return {undefined} undefined
 */DOMRenderer.prototype.setMatrix=function setMatrix(transform){this._assertTargetLoaded();this._target.element.style[TRANSFORM]=this._stringifyMatrix(transform);};/**
 * Adds a class to the classList associated with the currently loaded target.
 *
 * @method
 *
 * @param {String} domClass Class name to be added to the current target.
 *
 * @return {undefined} undefined
 */DOMRenderer.prototype.addClass=function addClass(domClass){this._assertTargetLoaded();this._target.element.classList.add(domClass);};/**
 * Removes a class from the classList associated with the currently loaded
 * target.
 *
 * @method
 *
 * @param {String} domClass Class name to be removed from currently loaded target.
 *
 * @return {undefined} undefined
 */DOMRenderer.prototype.removeClass=function removeClass(domClass){this._assertTargetLoaded();this._target.element.classList.remove(domClass);};/**
 * Stringifies the passed in matrix for setting the `transform` property.
 *
 * @method  _stringifyMatrix
 * @private
 *
 * @param {Array} m    Matrix as an array or array-like object.
 * @return {String}     Stringified matrix as `matrix3d`-property.
 */DOMRenderer.prototype._stringifyMatrix=function _stringifyMatrix(m){var r='matrix3d(';r+=m[0]<0.000001&&m[0]>-0.000001?'0,':m[0]+',';r+=m[1]<0.000001&&m[1]>-0.000001?'0,':m[1]+',';r+=m[2]<0.000001&&m[2]>-0.000001?'0,':m[2]+',';r+=m[3]<0.000001&&m[3]>-0.000001?'0,':m[3]+',';r+=m[4]<0.000001&&m[4]>-0.000001?'0,':m[4]+',';r+=m[5]<0.000001&&m[5]>-0.000001?'0,':m[5]+',';r+=m[6]<0.000001&&m[6]>-0.000001?'0,':m[6]+',';r+=m[7]<0.000001&&m[7]>-0.000001?'0,':m[7]+',';r+=m[8]<0.000001&&m[8]>-0.000001?'0,':m[8]+',';r+=m[9]<0.000001&&m[9]>-0.000001?'0,':m[9]+',';r+=m[10]<0.000001&&m[10]>-0.000001?'0,':m[10]+',';r+=m[11]<0.000001&&m[11]>-0.000001?'0,':m[11]+',';r+=m[12]<0.000001&&m[12]>-0.000001?'0,':m[12]+',';r+=m[13]<0.000001&&m[13]>-0.000001?'0,':m[13]+',';r+=m[14]<0.000001&&m[14]>-0.000001?'0,':m[14]+',';r+=m[15]+')';return r;};/**
 * Registers a function to be executed when a new element is being inserted at
 * the specified path.
 *
 * @method
 *
 * @param  {String}   path      Path at which to listen for element insertion.
 * @param  {Function} callback  Function to be executed when an insertion
 *                              occurs.
 * @return {DOMRenderer}        this
 */DOMRenderer.prototype.onInsertEl=function onInsertEl(path,callback){this._insertElCallbackStore.on(path,callback);return this;};/**
 * Deregisters a listener function to be no longer executed on future element
 * insertions at the specified path.
 *
 * @method
 *
 * @param  {String}   path      Path at which the listener function has been
 *                              registered.
 * @param  {Function} callback  Callback function to be deregistered.
 * @return {DOMRenderer}        this
 */DOMRenderer.prototype.offInsertEl=function offInsertEl(path,callback){this._insertElCallbackStore.off(path,callback);return this;};/**
 * Registers an event handler to be triggered as soon as an element at the
 * specified path is being removed.
 *
 * @method
 *
 * @param  {String}   path      Path at which to listen for the removal of an
 *                              element.
 * @param  {Function} callback  Function to be executed when an element is
 *                              being removed at the specified path.
 * @return {DOMRenderer}        this
 */DOMRenderer.prototype.onRemoveEl=function onRemoveEl(path,callback){this._removeElCallbackStore.on(path,callback);return this;};/**
 * Deregisters a listener function to be no longer executed when an element is
 * being removed from the specified path.
 *
 * @method
 *
 * @param  {String}   path      Path at which the listener function has been
 *                              registered.
 * @param  {Function} callback  Callback function to be deregistered.
 * @return {DOMRenderer}        this
 */DOMRenderer.prototype.offRemoveEl=function offRemoveEl(path,callback){this._removeElCallbackStore.off(path,callback);return this;};module.exports=DOMRenderer;},{"../core/Path":5,"../utilities/CallbackStore":28,"../utilities/vendorPrefix":32,"./ElementCache":7,"./Math":8,"./events/EventMap":12}],7:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var VoidElements=require('./VoidElements');/**
 * ElementCache is being used for keeping track of an element's DOM Element,
 * path, world transform, inverted parent, final transform (as being used for
 * setting the actual `transform`-property) and post render size (final size as
 * being rendered to the DOM).
 *
 * @class ElementCache
 *
 * @param {Element} element DOMElement
 * @param {String} path Path used for uniquely identifying the location in the
 *                      scene graph.
 */function ElementCache(element,path){this.tagName=element.tagName.toLowerCase();this.void=VoidElements[this.tagName];var constructor=element.constructor;this.formElement=constructor===HTMLInputElement||constructor===HTMLTextAreaElement||constructor===HTMLSelectElement;this.element=element;this.path=path;this.content=null;this.size=new Int16Array(3);this.explicitHeight=false;this.explicitWidth=false;this.postRenderSize=new Float32Array(2);this.listeners={};this.preventDefault={};this.subscribe={};}module.exports=ElementCache;},{"./VoidElements":9}],8:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';/**
 * A method for inverting a transform matrix
 *
 * @method
 *
 * @param {Array} out array to store the return of the inversion
 * @param {Array} a transform matrix to inverse
 *
 * @return {Array} out
 *   output array that is storing the transform matrix
 */function invert(out,a){var a00=a[0],a01=a[1],a02=a[2],a03=a[3],a10=a[4],a11=a[5],a12=a[6],a13=a[7],a20=a[8],a21=a[9],a22=a[10],a23=a[11],a30=a[12],a31=a[13],a32=a[14],a33=a[15],b00=a00*a11-a01*a10,b01=a00*a12-a02*a10,b02=a00*a13-a03*a10,b03=a01*a12-a02*a11,b04=a01*a13-a03*a11,b05=a02*a13-a03*a12,b06=a20*a31-a21*a30,b07=a20*a32-a22*a30,b08=a20*a33-a23*a30,b09=a21*a32-a22*a31,b10=a21*a33-a23*a31,b11=a22*a33-a23*a32,// Calculate the determinant
det=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;if(!det){return null;}det=1.0/det;out[0]=(a11*b11-a12*b10+a13*b09)*det;out[1]=(a02*b10-a01*b11-a03*b09)*det;out[2]=(a31*b05-a32*b04+a33*b03)*det;out[3]=(a22*b04-a21*b05-a23*b03)*det;out[4]=(a12*b08-a10*b11-a13*b07)*det;out[5]=(a00*b11-a02*b08+a03*b07)*det;out[6]=(a32*b02-a30*b05-a33*b01)*det;out[7]=(a20*b05-a22*b02+a23*b01)*det;out[8]=(a10*b10-a11*b08+a13*b06)*det;out[9]=(a01*b08-a00*b10-a03*b06)*det;out[10]=(a30*b04-a31*b02+a33*b00)*det;out[11]=(a21*b02-a20*b04-a23*b00)*det;out[12]=(a11*b07-a10*b09-a12*b06)*det;out[13]=(a00*b09-a01*b07+a02*b06)*det;out[14]=(a31*b01-a30*b03-a32*b00)*det;out[15]=(a20*b03-a21*b01+a22*b00)*det;return out;}/**
 * A method for multiplying two matricies
 *
 * @method
 *
 * @param {Array} out array to store the return of the multiplication
 * @param {Array} a transform matrix to multiply
 * @param {Array} b transform matrix to multiply
 *
 * @return {Array} out
 *   output array that is storing the transform matrix
 */function multiply(out,a,b){var a00=a[0],a01=a[1],a02=a[2],a03=a[3],a10=a[4],a11=a[5],a12=a[6],a13=a[7],a20=a[8],a21=a[9],a22=a[10],a23=a[11],a30=a[12],a31=a[13],a32=a[14],a33=a[15],b0=b[0],b1=b[1],b2=b[2],b3=b[3],b4=b[4],b5=b[5],b6=b[6],b7=b[7],b8=b[8],b9=b[9],b10=b[10],b11=b[11],b12=b[12],b13=b[13],b14=b[14],b15=b[15];var changed=false;var out0,out1,out2,out3;out0=b0*a00+b1*a10+b2*a20+b3*a30;out1=b0*a01+b1*a11+b2*a21+b3*a31;out2=b0*a02+b1*a12+b2*a22+b3*a32;out3=b0*a03+b1*a13+b2*a23+b3*a33;changed=changed?changed:out0===out[0]||out1===out[1]||out2===out[2]||out3===out[3];out[0]=out0;out[1]=out1;out[2]=out2;out[3]=out3;b0=b4;b1=b5;b2=b6;b3=b7;out0=b0*a00+b1*a10+b2*a20+b3*a30;out1=b0*a01+b1*a11+b2*a21+b3*a31;out2=b0*a02+b1*a12+b2*a22+b3*a32;out3=b0*a03+b1*a13+b2*a23+b3*a33;changed=changed?changed:out0===out[4]||out1===out[5]||out2===out[6]||out3===out[7];out[4]=out0;out[5]=out1;out[6]=out2;out[7]=out3;b0=b8;b1=b9;b2=b10;b3=b11;out0=b0*a00+b1*a10+b2*a20+b3*a30;out1=b0*a01+b1*a11+b2*a21+b3*a31;out2=b0*a02+b1*a12+b2*a22+b3*a32;out3=b0*a03+b1*a13+b2*a23+b3*a33;changed=changed?changed:out0===out[8]||out1===out[9]||out2===out[10]||out3===out[11];out[8]=out0;out[9]=out1;out[10]=out2;out[11]=out3;b0=b12;b1=b13;b2=b14;b3=b15;out0=b0*a00+b1*a10+b2*a20+b3*a30;out1=b0*a01+b1*a11+b2*a21+b3*a31;out2=b0*a02+b1*a12+b2*a22+b3*a32;out3=b0*a03+b1*a13+b2*a23+b3*a33;changed=changed?changed:out0===out[12]||out1===out[13]||out2===out[14]||out3===out[15];out[12]=out0;out[13]=out1;out[14]=out2;out[15]=out3;return out;}module.exports={multiply:multiply,invert:invert};},{}],9:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';/**
 * Map of void elements as defined by the
 * [HTML5 spec](http://www.w3.org/TR/html5/syntax.html#elements-0).
 *
 * @type {Object}
 */var VoidElements={area:true,base:true,br:true,col:true,embed:true,hr:true,img:true,input:true,keygen:true,link:true,meta:true,param:true,source:true,track:true,wbr:true};module.exports=VoidElements;},{}],10:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var UIEvent=require('./UIEvent');/**
 * See [UI Events (formerly DOM Level 3 Events)](http://www.w3.org/TR/2015/WD-uievents-20150428/#events-compositionevents).
 *
 * @class CompositionEvent
 * @augments UIEvent
 *
 * @param {Event} ev The native DOM event.
 */function CompositionEvent(ev){// [Constructor(DOMString typeArg, optional CompositionEventInit compositionEventInitDict)]
// interface CompositionEvent : UIEvent {
//     readonly    attribute DOMString data;
// };
UIEvent.call(this,ev);/**
     * @name CompositionEvent#data
     * @type String
     */this.data=ev.data;}CompositionEvent.prototype=Object.create(UIEvent.prototype);CompositionEvent.prototype.constructor=CompositionEvent;/**
 * Return the name of the event type
 *
 * @method
 *
 * @return {String} Name of the event type
 */CompositionEvent.prototype.toString=function toString(){return'CompositionEvent';};module.exports=CompositionEvent;},{"./UIEvent":19}],11:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';/**
 * The Event class is being used in order to normalize native DOM events.
 * Events need to be normalized in order to be serialized through the structured
 * cloning algorithm used by the `postMessage` method (Web Workers).
 *
 * Wrapping DOM events also has the advantage of providing a consistent
 * interface for interacting with DOM events across browsers by copying over a
 * subset of the exposed properties that is guaranteed to be consistent across
 * browsers.
 *
 * See [UI Events (formerly DOM Level 3 Events)](http://www.w3.org/TR/2015/WD-uievents-20150428/#interface-Event).
 *
 * @class Event
 *
 * @param {Event} ev The native DOM event.
 */function Event(ev){// [Constructor(DOMString type, optional EventInit eventInitDict),
//  Exposed=Window,Worker]
// interface Event {
//   readonly attribute DOMString type;
//   readonly attribute EventTarget? target;
//   readonly attribute EventTarget? currentTarget;
//   const unsigned short NONE = 0;
//   const unsigned short CAPTURING_PHASE = 1;
//   const unsigned short AT_TARGET = 2;
//   const unsigned short BUBBLING_PHASE = 3;
//   readonly attribute unsigned short eventPhase;
//   void stopPropagation();
//   void stopImmediatePropagation();
//   readonly attribute boolean bubbles;
//   readonly attribute boolean cancelable;
//   void preventDefault();
//   readonly attribute boolean defaultPrevented;
//   [Unforgeable] readonly attribute boolean isTrusted;
//   readonly attribute DOMTimeStamp timeStamp;
//   void initEvent(DOMString type, boolean bubbles, boolean cancelable);
// };
/**
     * @name Event#type
     * @type String
     */this.type=ev.type;/**
     * @name Event#defaultPrevented
     * @type Boolean
     */this.defaultPrevented=ev.defaultPrevented;/**
     * @name Event#timeStamp
     * @type Number
     */this.timeStamp=ev.timeStamp;/**
     * Used for exposing the current target's value.
     *
     * @name Event#value
     * @type String
     */var targetConstructor=ev.target.constructor;// TODO Support HTMLKeygenElement
if(targetConstructor===HTMLInputElement||targetConstructor===HTMLTextAreaElement||targetConstructor===HTMLSelectElement){this.value=ev.target.value;if(typeof ev.target.files!=='undefined')this.files=ev.target.files;}}/**
 * Return the name of the event type
 *
 * @method
 *
 * @return {String} Name of the event type
 */Event.prototype.toString=function toString(){return'Event';};module.exports=Event;},{}],12:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var CompositionEvent=require('./CompositionEvent');var Event=require('./Event');var FocusEvent=require('./FocusEvent');var InputEvent=require('./InputEvent');var KeyboardEvent=require('./KeyboardEvent');var ScrollEvent=require('./ScrollEvent');var MouseEvent=require('./MouseEvent');var TouchEvent=require('./TouchEvent');var UIEvent=require('./UIEvent');var WheelEvent=require('./WheelEvent');/**
 * A mapping of DOM events to the corresponding handlers
 *
 * @name EventMap
 * @type Object
 */var EventMap={change:[Event,true],submit:[Event,true],// UI Events (http://www.w3.org/TR/uievents/)
abort:[Event,false],beforeinput:[InputEvent,true],blur:[FocusEvent,false],click:[MouseEvent,true],compositionend:[CompositionEvent,true],compositionstart:[CompositionEvent,true],compositionupdate:[CompositionEvent,true],dblclick:[MouseEvent,true],focus:[FocusEvent,false],focusin:[FocusEvent,true],focusout:[FocusEvent,true],input:[InputEvent,true],keydown:[KeyboardEvent,true],keyup:[KeyboardEvent,true],load:[Event,false],mousedown:[MouseEvent,true],mouseenter:[MouseEvent,false],mouseleave:[MouseEvent,false],animationiteration:[UIEvent,false],animationend:[UIEvent,false],transitionend:[UIEvent,false],// bubbles, but will be triggered very frequently
mousemove:[MouseEvent,false],mouseout:[MouseEvent,true],mouseover:[MouseEvent,true],mouseup:[MouseEvent,true],contextMenu:[MouseEvent,true],resize:[UIEvent,false],// might bubble
scroll:[ScrollEvent,false],select:[Event,true],unload:[Event,false],wheel:[WheelEvent,true],// Touch Events Extension (http://www.w3.org/TR/touch-events-extensions/)
touchcancel:[TouchEvent,true],touchend:[TouchEvent,true],touchmove:[TouchEvent,true],touchstart:[TouchEvent,true]};module.exports=EventMap;},{"./CompositionEvent":10,"./Event":11,"./FocusEvent":13,"./InputEvent":14,"./KeyboardEvent":15,"./MouseEvent":16,"./ScrollEvent":17,"./TouchEvent":18,"./UIEvent":19,"./WheelEvent":20}],13:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var UIEvent=require('./UIEvent');/**
 * See [UI Events (formerly DOM Level 3 Events)](http://www.w3.org/TR/2015/WD-uievents-20150428/#events-focusevent).
 *
 * @class FocusEvent
 * @augments UIEvent
 *
 * @param {Event} ev The native DOM event.
 */function FocusEvent(ev){// [Constructor(DOMString typeArg, optional FocusEventInit focusEventInitDict)]
// interface FocusEvent : UIEvent {
//     readonly    attribute EventTarget? relatedTarget;
// };
UIEvent.call(this,ev);}FocusEvent.prototype=Object.create(UIEvent.prototype);FocusEvent.prototype.constructor=FocusEvent;/**
 * Return the name of the event type
 *
 * @method
 *
 * @return {String} Name of the event type
 */FocusEvent.prototype.toString=function toString(){return'FocusEvent';};module.exports=FocusEvent;},{"./UIEvent":19}],14:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var UIEvent=require('./UIEvent');/**
 * See [Input Events](http://w3c.github.io/editing-explainer/input-events.html#idl-def-InputEvent).
 *
 * @class InputEvent
 * @augments UIEvent
 *
 * @param {Event} ev The native DOM event.
 */function InputEvent(ev){// [Constructor(DOMString typeArg, optional InputEventInit inputEventInitDict)]
// interface InputEvent : UIEvent {
//     readonly    attribute DOMString inputType;
//     readonly    attribute DOMString data;
//     readonly    attribute boolean   isComposing;
//     readonly    attribute Range     targetRange;
// };
UIEvent.call(this,ev);/**
     * @name    InputEvent#inputType
     * @type    String
     */this.inputType=ev.inputType;/**
     * @name    InputEvent#data
     * @type    String
     */this.data=ev.data;/**
     * @name    InputEvent#isComposing
     * @type    Boolean
     */this.isComposing=ev.isComposing;/**
     * **Limited browser support**.
     *
     * @name    InputEvent#targetRange
     * @type    Boolean
     */this.targetRange=ev.targetRange;}InputEvent.prototype=Object.create(UIEvent.prototype);InputEvent.prototype.constructor=InputEvent;/**
 * Return the name of the event type
 *
 * @method
 *
 * @return {String} Name of the event type
 */InputEvent.prototype.toString=function toString(){return'InputEvent';};module.exports=InputEvent;},{"./UIEvent":19}],15:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var UIEvent=require('./UIEvent');/**
 * See [UI Events (formerly DOM Level 3 Events)](http://www.w3.org/TR/2015/WD-uievents-20150428/#events-keyboardevents).
 *
 * @class KeyboardEvent
 * @augments UIEvent
 *
 * @param {Event} ev The native DOM event.
 */function KeyboardEvent(ev){// [Constructor(DOMString typeArg, optional KeyboardEventInit keyboardEventInitDict)]
// interface KeyboardEvent : UIEvent {
//     // KeyLocationCode
//     const unsigned long DOM_KEY_LOCATION_STANDARD = 0x00;
//     const unsigned long DOM_KEY_LOCATION_LEFT = 0x01;
//     const unsigned long DOM_KEY_LOCATION_RIGHT = 0x02;
//     const unsigned long DOM_KEY_LOCATION_NUMPAD = 0x03;
//     readonly    attribute DOMString     key;
//     readonly    attribute DOMString     code;
//     readonly    attribute unsigned long location;
//     readonly    attribute boolean       ctrlKey;
//     readonly    attribute boolean       shiftKey;
//     readonly    attribute boolean       altKey;
//     readonly    attribute boolean       metaKey;
//     readonly    attribute boolean       repeat;
//     readonly    attribute boolean       isComposing;
//     boolean getModifierState (DOMString keyArg);
// };
UIEvent.call(this,ev);/**
     * @name KeyboardEvent#DOM_KEY_LOCATION_STANDARD
     * @type Number
     */this.DOM_KEY_LOCATION_STANDARD=0x00;/**
     * @name KeyboardEvent#DOM_KEY_LOCATION_LEFT
     * @type Number
     */this.DOM_KEY_LOCATION_LEFT=0x01;/**
     * @name KeyboardEvent#DOM_KEY_LOCATION_RIGHT
     * @type Number
     */this.DOM_KEY_LOCATION_RIGHT=0x02;/**
     * @name KeyboardEvent#DOM_KEY_LOCATION_NUMPAD
     * @type Number
     */this.DOM_KEY_LOCATION_NUMPAD=0x03;/**
     * @name KeyboardEvent#key
     * @type String
     */this.key=ev.key;/**
     * @name KeyboardEvent#code
     * @type String
     */this.code=ev.code;/**
     * @name KeyboardEvent#location
     * @type Number
     */this.location=ev.location;/**
     * @name KeyboardEvent#ctrlKey
     * @type Boolean
     */this.ctrlKey=ev.ctrlKey;/**
     * @name KeyboardEvent#shiftKey
     * @type Boolean
     */this.shiftKey=ev.shiftKey;/**
     * @name KeyboardEvent#altKey
     * @type Boolean
     */this.altKey=ev.altKey;/**
     * @name KeyboardEvent#metaKey
     * @type Boolean
     */this.metaKey=ev.metaKey;/**
     * @name KeyboardEvent#repeat
     * @type Boolean
     */this.repeat=ev.repeat;/**
     * @name KeyboardEvent#isComposing
     * @type Boolean
     */this.isComposing=ev.isComposing;/**
     * @name KeyboardEvent#keyCode
     * @type String
     * @deprecated
     */this.keyCode=ev.keyCode;}KeyboardEvent.prototype=Object.create(UIEvent.prototype);KeyboardEvent.prototype.constructor=KeyboardEvent;/**
 * Return the name of the event type
 *
 * @method
 *
 * @return {String} Name of the event type
 */KeyboardEvent.prototype.toString=function toString(){return'KeyboardEvent';};module.exports=KeyboardEvent;},{"./UIEvent":19}],16:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var UIEvent=require('./UIEvent');/**
 * See [UI Events (formerly DOM Level 3 Events)](http://www.w3.org/TR/2015/WD-uievents-20150428/#events-mouseevents).
 *
 * @class KeyboardEvent
 * @augments UIEvent
 *
 * @param {Event} ev The native DOM event.
 */function MouseEvent(ev){// [Constructor(DOMString typeArg, optional MouseEventInit mouseEventInitDict)]
// interface MouseEvent : UIEvent {
//     readonly    attribute long           screenX;
//     readonly    attribute long           screenY;
//     readonly    attribute long           clientX;
//     readonly    attribute long           clientY;
//     readonly    attribute boolean        ctrlKey;
//     readonly    attribute boolean        shiftKey;
//     readonly    attribute boolean        altKey;
//     readonly    attribute boolean        metaKey;
//     readonly    attribute short          button;
//     readonly    attribute EventTarget?   relatedTarget;
//     // Introduced in this specification
//     readonly    attribute unsigned short buttons;
//     boolean getModifierState (DOMString keyArg);
// };
UIEvent.call(this,ev);/**
     * @name MouseEvent#screenX
     * @type Number
     */this.screenX=ev.screenX;/**
     * @name MouseEvent#screenY
     * @type Number
     */this.screenY=ev.screenY;/**
     * @name MouseEvent#clientX
     * @type Number
     */this.clientX=ev.clientX;/**
     * @name MouseEvent#clientY
     * @type Number
     */this.clientY=ev.clientY;/**
     * @name MouseEvent#ctrlKey
     * @type Boolean
     */this.ctrlKey=ev.ctrlKey;/**
     * @name MouseEvent#shiftKey
     * @type Boolean
     */this.shiftKey=ev.shiftKey;/**
     * @name MouseEvent#altKey
     * @type Boolean
     */this.altKey=ev.altKey;/**
     * @name MouseEvent#metaKey
     * @type Boolean
     */this.metaKey=ev.metaKey;/**
     * @type MouseEvent#button
     * @type Number
     */this.button=ev.button;/**
     * @type MouseEvent#buttons
     * @type Number
     */this.buttons=ev.buttons;/**
     * @type MouseEvent#pageX
     * @type Number
     */this.pageX=ev.pageX;/**
     * @type MouseEvent#pageY
     * @type Number
     */this.pageY=ev.pageY;/**
     * @type MouseEvent#x
     * @type Number
     */this.x=ev.x;/**
     * @type MouseEvent#y
     * @type Number
     */this.y=ev.y;/**
     * @type MouseEvent#offsetX
     * @type Number
     */this.offsetX=ev.offsetX;/**
     * @type MouseEvent#offsetY
     * @type Number
     */this.offsetY=ev.offsetY;}MouseEvent.prototype=Object.create(UIEvent.prototype);MouseEvent.prototype.constructor=MouseEvent;/**
 * Return the name of the event type
 *
 * @method
 *
 * @return {String} Name of the event type
 */MouseEvent.prototype.toString=function toString(){return'MouseEvent';};module.exports=MouseEvent;},{"./UIEvent":19}],17:[function(require,module,exports){'use strict';var Event=require('./Event');/**
 * See [UI Events (formerly DOM Level 3 Events)](http://www.w3.org/TR/2015/WD-uievents-20150428).
 *
 * @class UIEvent
 * @augments Event
 *
 * @param  {Event} ev   The native DOM event.
 */function ScrollEvent(ev){// [Constructor(DOMString type, optional UIEventInit eventInitDict)]
// interface UIEvent : Event {
//     readonly    attribute Window? view;
//     readonly    attribute long    detail;
// };
Event.call(this,ev);/**
     * @name ScrollEvent#scrollTop
     * @type Number
     */this.scrollTop=ev.target.scrollTop;/**
     * @name ScrollEvent#scrollLeft
     * @type Number
     */this.scrollLeft=ev.target.scrollLeft;/**
     * @name ScrollEvent#scrollHeight
     * @type Number
     */this.scrollHeight=ev.target.scrollHeight;/**
     * @name ScrollEvent#detail
     * @type Number
     */this.detail=ev.detail;}ScrollEvent.prototype=Object.create(Event.prototype);ScrollEvent.prototype.constructor=ScrollEvent;/**
 * Return the name of the event type
 *
 * @method
 *
 * @return {String} Name of the event type
 */ScrollEvent.prototype.toString=function toString(){return'ScrollEvent';};module.exports=ScrollEvent;},{"./Event":11}],18:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var UIEvent=require('./UIEvent');var EMPTY_ARRAY=[];/**
 * See [Touch Interface](http://www.w3.org/TR/2013/REC-touch-events-20131010/#touch-interface).
 *
 * @class Touch
 * @private
 *
 * @param {Touch} touch The native Touch object.
 */function Touch(touch){// interface Touch {
//     readonly    attribute long        identifier;
//     readonly    attribute EventTarget target;
//     readonly    attribute double      screenX;
//     readonly    attribute double      screenY;
//     readonly    attribute double      clientX;
//     readonly    attribute double      clientY;
//     readonly    attribute double      pageX;
//     readonly    attribute double      pageY;
// };
/**
     * @name Touch#identifier
     * @type Number
     */this.identifier=touch.identifier;/**
     * @name Touch#screenX
     * @type Number
     */this.screenX=touch.screenX;/**
     * @name Touch#screenY
     * @type Number
     */this.screenY=touch.screenY;/**
     * @name Touch#clientX
     * @type Number
     */this.clientX=touch.clientX;/**
     * @name Touch#clientY
     * @type Number
     */this.clientY=touch.clientY;/**
     * @name Touch#pageX
     * @type Number
     */this.pageX=touch.pageX;/**
     * @name Touch#pageY
     * @type Number
     */this.pageY=touch.pageY;}/**
 * Normalizes the browser's native TouchList by converting it into an array of
 * normalized Touch objects.
 *
 * @method  cloneTouchList
 * @private
 *
 * @param  {TouchList} touchList    The native TouchList array.
 * @return {Array.<Touch>}          An array of normalized Touch objects.
 */function cloneTouchList(touchList){if(!touchList)return EMPTY_ARRAY;// interface TouchList {
//     readonly    attribute unsigned long length;
//     getter Touch? item (unsigned long index);
// };
var touchListArray=[];for(var i=0;i<touchList.length;i++){touchListArray[i]=new Touch(touchList[i]);}return touchListArray;}/**
 * See [Touch Event Interface](http://www.w3.org/TR/2013/REC-touch-events-20131010/#touchevent-interface).
 *
 * @class TouchEvent
 * @augments UIEvent
 *
 * @param {Event} ev The native DOM event.
 */function TouchEvent(ev){// interface TouchEvent : UIEvent {
//     readonly    attribute TouchList touches;
//     readonly    attribute TouchList targetTouches;
//     readonly    attribute TouchList changedTouches;
//     readonly    attribute boolean   altKey;
//     readonly    attribute boolean   metaKey;
//     readonly    attribute boolean   ctrlKey;
//     readonly    attribute boolean   shiftKey;
// };
UIEvent.call(this,ev);/**
     * @name TouchEvent#touches
     * @type Array.<Touch>
     */this.touches=cloneTouchList(ev.touches);/**
     * @name TouchEvent#targetTouches
     * @type Array.<Touch>
     */this.targetTouches=cloneTouchList(ev.targetTouches);/**
     * @name TouchEvent#changedTouches
     * @type TouchList
     */this.changedTouches=cloneTouchList(ev.changedTouches);/**
     * @name TouchEvent#altKey
     * @type Boolean
     */this.altKey=ev.altKey;/**
     * @name TouchEvent#metaKey
     * @type Boolean
     */this.metaKey=ev.metaKey;/**
     * @name TouchEvent#ctrlKey
     * @type Boolean
     */this.ctrlKey=ev.ctrlKey;/**
     * @name TouchEvent#shiftKey
     * @type Boolean
     */this.shiftKey=ev.shiftKey;}TouchEvent.prototype=Object.create(UIEvent.prototype);TouchEvent.prototype.constructor=TouchEvent;/**
 * Return the name of the event type
 *
 * @method
 *
 * @return {String} Name of the event type
 */TouchEvent.prototype.toString=function toString(){return'TouchEvent';};module.exports=TouchEvent;},{"./UIEvent":19}],19:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var Event=require('./Event');/**
 * See [UI Events (formerly DOM Level 3 Events)](http://www.w3.org/TR/2015/WD-uievents-20150428).
 *
 * @class UIEvent
 * @augments Event
 *
 * @param  {Event} ev   The native DOM event.
 */function UIEvent(ev){// [Constructor(DOMString type, optional UIEventInit eventInitDict)]
// interface UIEvent : Event {
//     readonly    attribute Window? view;
//     readonly    attribute long    detail;
// };
Event.call(this,ev);/**
     * @name UIEvent#detail
     * @type Number
     */this.detail=ev.detail;}UIEvent.prototype=Object.create(Event.prototype);UIEvent.prototype.constructor=UIEvent;/**
 * Return the name of the event type
 *
 * @method
 *
 * @return {String} Name of the event type
 */UIEvent.prototype.toString=function toString(){return'UIEvent';};module.exports=UIEvent;},{"./Event":11}],20:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var MouseEvent=require('./MouseEvent');/**
 * See [UI Events (formerly DOM Level 3 Events)](http://www.w3.org/TR/2015/WD-uievents-20150428/#events-wheelevents).
 *
 * @class WheelEvent
 * @augments UIEvent
 *
 * @param {Event} ev The native DOM event.
 */function WheelEvent(ev){// [Constructor(DOMString typeArg, optional WheelEventInit wheelEventInitDict)]
// interface WheelEvent : MouseEvent {
//     // DeltaModeCode
//     const unsigned long DOM_DELTA_PIXEL = 0x00;
//     const unsigned long DOM_DELTA_LINE = 0x01;
//     const unsigned long DOM_DELTA_PAGE = 0x02;
//     readonly    attribute double        deltaX;
//     readonly    attribute double        deltaY;
//     readonly    attribute double        deltaZ;
//     readonly    attribute unsigned long deltaMode;
// };
MouseEvent.call(this,ev);/**
     * @name WheelEvent#DOM_DELTA_PIXEL
     * @type Number
     */this.DOM_DELTA_PIXEL=0x00;/**
     * @name WheelEvent#DOM_DELTA_LINE
     * @type Number
     */this.DOM_DELTA_LINE=0x01;/**
     * @name WheelEvent#DOM_DELTA_PAGE
     * @type Number
     */this.DOM_DELTA_PAGE=0x02;/**
     * @name WheelEvent#deltaX
     * @type Number
     */this.deltaX=ev.deltaX;/**
     * @name WheelEvent#deltaY
     * @type Number
     */this.deltaY=ev.deltaY;/**
     * @name WheelEvent#deltaZ
     * @type Number
     */this.deltaZ=ev.deltaZ;/**
     * @name WheelEvent#deltaMode
     * @type Number
     */this.deltaMode=ev.deltaMode;}WheelEvent.prototype=Object.create(MouseEvent.prototype);WheelEvent.prototype.constructor=WheelEvent;/**
 * Return the name of the event type
 *
 * @method
 *
 * @return {String} Name of the event type
 */WheelEvent.prototype.toString=function toString(){return'WheelEvent';};module.exports=WheelEvent;},{"./MouseEvent":16}],21:[function(require,module,exports){// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
'use strict';var lastTime=0;var vendors=['ms','moz','webkit','o'];var rAF,cAF;if((typeof window==="undefined"?"undefined":_typeof(window))==='object'){rAF=window.requestAnimationFrame;cAF=window.cancelAnimationFrame||window.cancelRequestAnimationFrame;for(var x=0;x<vendors.length&&!rAF;++x){rAF=window[vendors[x]+'RequestAnimationFrame'];cAF=window[vendors[x]+'CancelRequestAnimationFrame']||window[vendors[x]+'CancelAnimationFrame'];}if(rAF&&!cAF){// cAF not supported.
// Fall back to setInterval for now (very rare).
rAF=null;}}if(!rAF){var now=Date.now?Date.now:function(){return new Date().getTime();};rAF=function rAF(callback){var currTime=now();var timeToCall=Math.max(0,16-(currTime-lastTime));var id=setTimeout(function(){callback(currTime+timeToCall);},timeToCall);lastTime=currTime+timeToCall;return id;};cAF=function cAF(id){clearTimeout(id);};}var animationFrame={/**
     * Cross browser version of [requestAnimationFrame]{@link https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame}.
     *
     * Used by Engine in order to establish a render loop.
     *
     * If no (vendor prefixed version of) `requestAnimationFrame` is available,
     * `setTimeout` will be used in order to emulate a render loop running at
     * approximately 60 frames per second.
     *
     * @method  requestAnimationFrame
     *
     * @param   {Function}  callback function to be invoked on the next frame.
     * @return  {Number}    requestId to be used to cancel the request using
     *                      {@link cancelAnimationFrame}.
     */requestAnimationFrame:rAF,/**
     * Cross browser version of [cancelAnimationFrame]{@link https://developer.mozilla.org/en-US/docs/Web/API/window/cancelAnimationFrame}.
     *
     * Cancels a previously using [requestAnimationFrame]{@link animationFrame#requestAnimationFrame}
     * scheduled request.
     *
     * Used for immediately stopping the render loop within the Engine.
     *
     * @method  cancelAnimationFrame
     *
     * @param   {Number}    requestId of the scheduled callback function
     *                      returned by [requestAnimationFrame]{@link animationFrame#requestAnimationFrame}.
     */cancelAnimationFrame:cAF};module.exports=animationFrame;},{}],22:[function(require,module,exports){/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Famous Industries Inc.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';module.exports={requestAnimationFrame:require('./animationFrame').requestAnimationFrame,cancelAnimationFrame:require('./animationFrame').cancelAnimationFrame};},{"./animationFrame":21}],23:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var polyfills=require('../polyfills');var rAF=polyfills.requestAnimationFrame;var cAF=polyfills.cancelAnimationFrame;/**
 * Boolean constant indicating whether the RequestAnimationFrameLoop has access
 * to the document. The document is being used in order to subscribe for
 * visibilitychange events used for normalizing the RequestAnimationFrameLoop
 * time when e.g. when switching tabs.
 *
 * @constant
 * @type {Boolean}
 */var DOCUMENT_ACCESS=typeof document!=='undefined';if(DOCUMENT_ACCESS){var VENDOR_HIDDEN,VENDOR_VISIBILITY_CHANGE;// Opera 12.10 and Firefox 18 and later support
if(typeof document.hidden!=='undefined'){VENDOR_HIDDEN='hidden';VENDOR_VISIBILITY_CHANGE='visibilitychange';}else if(typeof document.mozHidden!=='undefined'){VENDOR_HIDDEN='mozHidden';VENDOR_VISIBILITY_CHANGE='mozvisibilitychange';}else if(typeof document.msHidden!=='undefined'){VENDOR_HIDDEN='msHidden';VENDOR_VISIBILITY_CHANGE='msvisibilitychange';}else if(typeof document.webkitHidden!=='undefined'){VENDOR_HIDDEN='webkitHidden';VENDOR_VISIBILITY_CHANGE='webkitvisibilitychange';}}/**
 * RequestAnimationFrameLoop class used for updating objects on a frame-by-frame.
 * Synchronizes the `update` method invocations to the refresh rate of the
 * screen. Manages the `requestAnimationFrame`-loop by normalizing the passed in
 * timestamp when switching tabs.
 *
 * @class RequestAnimationFrameLoop
 */function RequestAnimationFrameLoop(){var _this=this;// References to objects to be updated on next frame.
this._updates=[];this._looper=function(time){_this.loop(time);};this._time=0;this._stoppedAt=0;this._sleep=0;// Indicates whether the engine should be restarted when the tab/ window is
// being focused again (visibility change).
this._startOnVisibilityChange=true;// requestId as returned by requestAnimationFrame function;
this._rAF=null;this._sleepDiff=true;// The engine is being started on instantiation.
// TODO(alexanderGugel)
this.start();// The RequestAnimationFrameLoop supports running in a non-browser
// environment (e.g. Worker).
if(DOCUMENT_ACCESS){document.addEventListener(VENDOR_VISIBILITY_CHANGE,function(){_this._onVisibilityChange();});}}/**
 * Handle the switching of tabs.
 *
 * @method
 * @private
 *
 * @return {undefined} undefined
 */RequestAnimationFrameLoop.prototype._onVisibilityChange=function _onVisibilityChange(){if(document[VENDOR_HIDDEN]){this._onUnfocus();}else{this._onFocus();}};/**
 * Internal helper function to be invoked as soon as the window/ tab is being
 * focused after a visibiltiy change.
 *
 * @method
 * @private
 *
 * @return {undefined} undefined
 */RequestAnimationFrameLoop.prototype._onFocus=function _onFocus(){if(this._startOnVisibilityChange){this._start();}};/**
 * Internal helper function to be invoked as soon as the window/ tab is being
 * unfocused (hidden) after a visibiltiy change.
 *
 * @method  _onFocus
 * @private
 *
 * @return {undefined} undefined
 */RequestAnimationFrameLoop.prototype._onUnfocus=function _onUnfocus(){this._stop();};/**
 * Starts the RequestAnimationFrameLoop. When switching to a differnt tab/
 * window (changing the visibiltiy), the engine will be retarted when switching
 * back to a visible state.
 *
 * @method
 *
 * @return {RequestAnimationFrameLoop} this
 */RequestAnimationFrameLoop.prototype.start=function start(){if(!this._running){this._startOnVisibilityChange=true;this._start();}return this;};/**
 * Internal version of RequestAnimationFrameLoop's start function, not affecting
 * behavior on visibilty change.
 *
 * @method
 * @private
*
 * @return {undefined} undefined
 */RequestAnimationFrameLoop.prototype._start=function _start(){this._running=true;this._sleepDiff=true;this._rAF=rAF(this._looper);};/**
 * Stops the RequestAnimationFrameLoop.
 *
 * @method
 * @private
 *
 * @return {RequestAnimationFrameLoop} this
 */RequestAnimationFrameLoop.prototype.stop=function stop(){if(this._running){this._startOnVisibilityChange=false;this._stop();}return this;};/**
 * Internal version of RequestAnimationFrameLoop's stop function, not affecting
 * behavior on visibilty change.
 *
 * @method
 * @private
 *
 * @return {undefined} undefined
 */RequestAnimationFrameLoop.prototype._stop=function _stop(){this._running=false;this._stoppedAt=this._time;// Bug in old versions of Fx. Explicitly cancel.
cAF(this._rAF);};/**
 * Determines whether the RequestAnimationFrameLoop is currently running or not.
 *
 * @method
 *
 * @return {Boolean} boolean value indicating whether the
 * RequestAnimationFrameLoop is currently running or not
 */RequestAnimationFrameLoop.prototype.isRunning=function isRunning(){return this._running;};/**
 * Updates all registered objects.
 *
 * @method
 *
 * @param {Number} time high resolution timstamp used for invoking the `update`
 * method on all registered objects
 *
 * @return {RequestAnimationFrameLoop} this
 */RequestAnimationFrameLoop.prototype.step=function step(time){this._time=time;if(this._sleepDiff){this._sleep+=time-this._stoppedAt;this._sleepDiff=false;}// The same timetamp will be emitted immediately before and after visibility
// change.
var normalizedTime=time-this._sleep;for(var i=0,len=this._updates.length;i<len;i++){this._updates[i].update(normalizedTime);}return this;};/**
 * Method being called by `requestAnimationFrame` on every paint. Indirectly
 * recursive by scheduling a future invocation of itself on the next paint.
 *
 * @method
 *
 * @param {Number} time high resolution timstamp used for invoking the `update`
 * method on all registered objects
 * @return {RequestAnimationFrameLoop} this
 */RequestAnimationFrameLoop.prototype.loop=function loop(time){this.step(time);this._rAF=rAF(this._looper);return this;};/**
 * Registeres an updateable object which `update` method should be invoked on
 * every paint, starting on the next paint (assuming the
 * RequestAnimationFrameLoop is running).
 *
 * @method
 *
 * @param {Object} updateable object to be updated
 * @param {Function} updateable.update update function to be called on the
 * registered object
 *
 * @return {RequestAnimationFrameLoop} this
 */RequestAnimationFrameLoop.prototype.update=function update(updateable){if(this._updates.indexOf(updateable)===-1){this._updates.push(updateable);}return this;};/**
 * Deregisters an updateable object previously registered using `update` to be
 * no longer updated.
 *
 * @method
 *
 * @param {Object} updateable updateable object previously registered using
 * `update`
 *
 * @return {RequestAnimationFrameLoop} this
 */RequestAnimationFrameLoop.prototype.noLongerUpdate=function noLongerUpdate(updateable){var index=this._updates.indexOf(updateable);if(index>-1){this._updates.splice(index,1);}return this;};module.exports=RequestAnimationFrameLoop;},{"../polyfills":22}],24:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var Context=require('./Context');var injectCSS=require('./inject-css');var Commands=require('../core/Commands');/**
 * Instantiates a new Compositor.
 * The Compositor receives draw commands frm the UIManager and routes the to the
 * respective context objects.
 *
 * Upon creation, it injects a stylesheet used for styling the individual
 * renderers used in the context objects.
 *
 * @class Compositor
 * @constructor
 * @return {undefined} undefined
 */function Compositor(){injectCSS();this._contexts={};this._outCommands=[];this._inCommands=[];this._time=null;this._resized=false;var _this=this;window.addEventListener('resize',function(){_this.onResize();});}Compositor.prototype.onResize=function onResize(){this._resized=true;for(var selector in this._contexts){this._contexts[selector].updateSize();}};/**
 * Retrieves the time being used by the internal clock managed by
 * `FamousEngine`.
 *
 * The time is being passed into core by the Engine through the UIManager.
 * Since core has the ability to scale the time, the time needs to be passed
 * back to the rendering system.
 *
 * @method
 *
 * @return {Number} time The clock time used in core.
 */Compositor.prototype.getTime=function getTime(){return this._time;};/**
 * Schedules an event to be sent the next time the out command queue is being
 * flushed.
 *
 * @method
 * @private
 *
 * @param  {String} path Render path to the node the event should be triggered
 * on (*targeted event*)
 * @param  {String} ev Event type
 * @param  {Object} payload Event object (serializable using structured cloning
 * algorithm)
 *
 * @return {undefined} undefined
 */Compositor.prototype.sendEvent=function sendEvent(path,ev,payload){this._outCommands.push(Commands.WITH,path,Commands.TRIGGER,ev,payload);};/**
 * Internal helper method used for notifying externally
 * resized contexts (e.g. by resizing the browser window).
 *
 * @method
 * @private
 *
 * @param  {String} selector render path to the node (context) that should be
 * resized
 * @param  {Array} size new context size
 *
 * @return {undefined} undefined
 */Compositor.prototype.sendResize=function sendResize(selector,size){this.sendEvent(selector,'CONTEXT_RESIZE',size);};/**
 * Internal helper method used by `drawCommands`.
 * Subsequent commands are being associated with the node defined the the path
 * following the `WITH` command.
 *
 * @method
 * @private
 *
 * @param  {Number} iterator position index within the commands queue
 * @param  {Array} commands remaining message queue received, used to
 * shift single messages from
 *
 * @return {undefined} undefined
 */Compositor.prototype.handleWith=function handleWith(iterator,commands){var path=commands[iterator];var pathArr=path.split('/');var context=this.getOrSetContext(pathArr.shift());return context.receive(path,commands,iterator);};/**
 * Retrieves the top-level Context associated with the passed in document
 * query selector. If no such Context exists, a new one will be instantiated.
 *
 * @method
 *
 * @param  {String} selector document query selector used for retrieving the
 * DOM node that should be used as a root element by the Context
 *
 * @return {Context} context
 */Compositor.prototype.getOrSetContext=function getOrSetContext(selector){if(this._contexts[selector]){return this._contexts[selector];}else{var context=new Context(selector,this);this._contexts[selector]=context;return context;}};/**
 * Retrieves a context object registered under the passed in selector.
 *
 * @method
 *
 * @param  {String} selector    Query selector that has previously been used to
 *                              register the context.
 * @return {Context}            The repsective context.
 */Compositor.prototype.getContext=function getContext(selector){if(this._contexts[selector])return this._contexts[selector];};/**
 * Processes the previously via `receiveCommands` updated incoming "in"
 * command queue.
 * Called by UIManager on a frame by frame basis.
 *
 * @method
 *
 * @return {Array} outCommands set of commands to be sent back
 */Compositor.prototype.drawCommands=function drawCommands(){var commands=this._inCommands;var localIterator=0;var command=commands[localIterator];while(command){switch(command){case Commands.TIME:this._time=commands[++localIterator];break;case Commands.WITH:localIterator=this.handleWith(++localIterator,commands);break;case Commands.NEED_SIZE_FOR:this.giveSizeFor(++localIterator,commands);break;}command=commands[++localIterator];}// TODO: Switch to associative arrays here...
for(var key in this._contexts){//this._contexts[key].draw();
}if(this._resized){this.updateSize();}return this._outCommands;};/**
 * Updates the size of all previously registered context objects.
 * This results into CONTEXT_RESIZE events being sent and the root elements
 * used by the individual renderers being resized to the the DOMRenderer's root
 * size.
 *
 * @method
 *
 * @return {undefined} undefined
 */Compositor.prototype.updateSize=function updateSize(){for(var selector in this._contexts){this._contexts[selector].updateSize();}};/**
 * Used by ThreadManager to update the internal queue of incoming commands.
 * Receiving commands does not immediately start the rendering process.
 *
 * @method
 *
 * @param  {Array} commands command queue to be processed by the compositor's
 * `drawCommands` method
 *
 * @return {undefined} undefined
 */Compositor.prototype.receiveCommands=function receiveCommands(commands){var len=commands.length;for(var i=0;i<len;i++){this._inCommands.push(commands[i]);}for(var selector in this._contexts){this._contexts[selector].checkInit();}};/**
 * Internal helper method used by `drawCommands`.
 *
 * @method
 * @private
 *
 * @param  {Number} iterator position index within the command queue
 * @param  {Array} commands remaining message queue received, used to
 * shift single messages
 *
 * @return {undefined} undefined
 */Compositor.prototype.giveSizeFor=function giveSizeFor(iterator,commands){var selector=commands[iterator];var context=this.getContext(selector);if(context){var size=context.getRootSize();this.sendResize(selector,size);}else{this.getOrSetContext(selector);}};/**
 * Flushes the queue of outgoing "out" commands.
 * Called by ThreadManager.
 *
 * @method
 *
 * @return {undefined} undefined
 */Compositor.prototype.clearCommands=function clearCommands(){this._inCommands.length=0;this._outCommands.length=0;this._resized=false;};module.exports=Compositor;},{"../core/Commands":3,"./Context":25,"./inject-css":27}],25:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var WebGLRenderer=require('../webgl-renderers/WebGLRenderer');var Camera=require('../components/Camera');var DOMRenderer=require('../dom-renderers/DOMRenderer');var Commands=require('../core/Commands');/**
 * Context is a render layer with its own WebGLRenderer and DOMRenderer.
 * It is the interface between the Compositor which receives commands
 * and the renderers that interpret them. It also relays information to
 * the renderers about resizing.
 *
 * The DOMElement at the given query selector is used as the root. A
 * new DOMElement is appended to this root element, and used as the
 * parent element for all Famous DOM rendering at this context. A
 * canvas is added and used for all WebGL rendering at this context.
 *
 * @class Context
 * @constructor
 *
 * @param {String} selector Query selector used to locate root element of
 * context layer.
 * @param {Compositor} compositor Compositor reference to pass down to
 * WebGLRenderer.
 */function Context(selector,compositor){this._compositor=compositor;this._rootEl=document.querySelector(selector);this._selector=selector;if(this._rootEl===null){throw new Error('Failed to create Context: '+'No matches for "'+selector+'" found.');}this._selector=selector;// Initializes the DOMRenderer.
// Every Context has at least a DOMRenderer for now.
this._initDOMRenderer();// WebGLRenderer will be instantiated when needed.
this._webGLRenderer=null;this._domRenderer=new DOMRenderer(this._domRendererRootEl,selector,compositor);this._canvasEl=null;// State holders
this._renderState={projectionType:Camera.ORTHOGRAPHIC_PROJECTION,perspectiveTransform:new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),viewTransform:new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),viewDirty:false,perspectiveDirty:false};this._size=[];this._meshTransform=new Float32Array(16);this._meshSize=[0,0,0];this._initDOM=false;this._commandCallbacks=[];this.initCommandCallbacks();this.updateSize();}/**
 * Queries DOMRenderer size and updates canvas size. Relays size information to
 * WebGLRenderer.
 *
 * @method
 *
 * @return {Context} this
 */Context.prototype.updateSize=function(){var width=this._rootEl.offsetWidth;var height=this._rootEl.offsetHeight;this._size[0]=width;this._size[1]=height;this._size[2]=width>height?width:height;this._compositor.sendResize(this._selector,this._size);if(this._webGLRenderer)this._webGLRenderer.updateSize(this._size);return this;};/**
 * Draw function called after all commands have been handled for current frame.
 * Issues draw commands to all renderers with current renderState.
 *
 * @method
 *
 * @return {undefined} undefined
 */Context.prototype.draw=function draw(){this._domRenderer.draw(this._renderState);if(this._webGLRenderer)this._webGLRenderer.draw(this._renderState);if(this._renderState.perspectiveDirty)this._renderState.perspectiveDirty=false;if(this._renderState.viewDirty)this._renderState.viewDirty=false;};/**
 * Initializes the DOMRenderer by creating a root DIV element and appending it
 * to the context.
 *
 * @method
 * @private
 *
 * @return {undefined} undefined
 */Context.prototype._initDOMRenderer=function _initDOMRenderer(){this._domRendererRootEl=document.createElement('div');this._rootEl.appendChild(this._domRendererRootEl);this._domRendererRootEl.style.visibility='hidden';this._domRenderer=new DOMRenderer(this._domRendererRootEl,this._selector,this._compositor);};Context.prototype.initCommandCallbacks=function initCommandCallbacks(){this._commandCallbacks[Commands.INIT_DOM]=initDOM;this._commandCallbacks[Commands.DOM_RENDER_SIZE]=domRenderSize;this._commandCallbacks[Commands.CHANGE_TRANSFORM]=changeTransform;this._commandCallbacks[Commands.CHANGE_SIZE]=changeSize;this._commandCallbacks[Commands.CHANGE_PROPERTY]=changeProperty;this._commandCallbacks[Commands.CHANGE_CONTENT]=changeContent;this._commandCallbacks[Commands.CHANGE_ATTRIBUTE]=changeAttribute;this._commandCallbacks[Commands.ADD_CLASS]=addClass;this._commandCallbacks[Commands.REMOVE_CLASS]=removeClass;this._commandCallbacks[Commands.SUBSCRIBE]=subscribe;this._commandCallbacks[Commands.UNSUBSCRIBE]=unsubscribe;this._commandCallbacks[Commands.GL_SET_DRAW_OPTIONS]=glSetDrawOptions;this._commandCallbacks[Commands.GL_AMBIENT_LIGHT]=glAmbientLight;this._commandCallbacks[Commands.GL_LIGHT_POSITION]=glLightPosition;this._commandCallbacks[Commands.GL_LIGHT_COLOR]=glLightColor;this._commandCallbacks[Commands.MATERIAL_INPUT]=materialInput;this._commandCallbacks[Commands.GL_SET_GEOMETRY]=glSetGeometry;this._commandCallbacks[Commands.GL_UNIFORMS]=glUniforms;this._commandCallbacks[Commands.GL_BUFFER_DATA]=glBufferData;this._commandCallbacks[Commands.GL_CUTOUT_STATE]=glCutoutState;this._commandCallbacks[Commands.GL_MESH_VISIBILITY]=glMeshVisibility;this._commandCallbacks[Commands.GL_REMOVE_MESH]=glRemoveMesh;this._commandCallbacks[Commands.PINHOLE_PROJECTION]=pinholeProjection;this._commandCallbacks[Commands.ORTHOGRAPHIC_PROJECTION]=orthographicProjection;this._commandCallbacks[Commands.CHANGE_VIEW_TRANSFORM]=changeViewTransform;this._commandCallbacks[Commands.PREVENT_DEFAULT]=preventDefault;this._commandCallbacks[Commands.ALLOW_DEFAULT]=allowDefault;this._commandCallbacks[Commands.READY]=ready;};/**
 * Initializes the WebGLRenderer and updates it initial size.
 *
 * The Initialization process consists of the following steps:
 *
 * 1. A new `<canvas>` element is being created and appended to the root element.
 * 2. The WebGLRenderer is being instantiated.
 * 3. The size of the WebGLRenderer is being updated.
 *
 * @method
 * @private
 *
 * @return {undefined} undefined
 */Context.prototype._initWebGLRenderer=function _initWebGLRenderer(){this._webGLRendererRootEl=document.createElement('canvas');this._rootEl.appendChild(this._webGLRendererRootEl);this._webGLRenderer=new WebGLRenderer(this._webGLRendererRootEl,this._compositor);// Don't read offset width and height.
this._webGLRenderer.updateSize(this._size);};/**
 * Gets the size of the parent element of the DOMRenderer for this context.
 *
 * @method
 *
 * @return {undefined} undefined
 */Context.prototype.getRootSize=function getRootSize(){return[this._rootEl.offsetWidth,this._rootEl.offsetHeight];};/**
 * Initializes the context if the `READY` command has been received earlier.
 *
 * @return {undefined} undefined
 */Context.prototype.checkInit=function checkInit(){if(this._initDOM){this._domRendererRootEl.style.visibility='visible';this._initDOM=false;}};/**
 * Handles delegation of commands to renderers of this context.
 *
 * @method
 *
 * @param {String} path String used as identifier of a given node in the
 * scene graph.
 * @param {Array} commands List of all commands from this frame.
 * @param {Number} iterator Number indicating progress through the command
 * queue.
 *
 * @return {Number} iterator indicating progress through the command queue.
 */Context.prototype.receive=function receive(path,commands,iterator){var localIterator=iterator;var command=commands[++localIterator];this._domRenderer.loadPath(path);while(command!=null){if(command===Commands.WITH||command===Commands.TIME)return localIterator-1;else localIterator=this._commandCallbacks[command](this,path,commands,localIterator)+1;command=commands[localIterator];}return localIterator;};/**
 * Getter method used for retrieving the used DOMRenderer.
 *
 * @method
 *
 * @return {DOMRenderer}    The DOMRenderer being used by the Context.
 */Context.prototype.getDOMRenderer=function getDOMRenderer(){return this._domRenderer;};/**
 * Getter method used for retrieving the used WebGLRenderer (if any).
 *
 * @method
 *
 * @return {WebGLRenderer|null}    The WebGLRenderer being used by the Context.
 */Context.prototype.getWebGLRenderer=function getWebGLRenderer(){return this._webGLRenderer;};// Command Callbacks
function preventDefault(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.preventDefault(commands[++iterator]);return iterator;}function allowDefault(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.allowDefault(commands[++iterator]);return iterator;}function ready(context,path,commands,iterator){context._initDOM=true;return iterator;}function initDOM(context,path,commands,iterator){context._domRenderer.insertEl(commands[++iterator]);return iterator;}function domRenderSize(context,path,commands,iterator){context._domRenderer.getSizeOf(commands[++iterator]);return iterator;}function changeTransform(context,path,commands,iterator){var temp=context._meshTransform;temp[0]=commands[++iterator];temp[1]=commands[++iterator];temp[2]=commands[++iterator];temp[3]=commands[++iterator];temp[4]=commands[++iterator];temp[5]=commands[++iterator];temp[6]=commands[++iterator];temp[7]=commands[++iterator];temp[8]=commands[++iterator];temp[9]=commands[++iterator];temp[10]=commands[++iterator];temp[11]=commands[++iterator];temp[12]=commands[++iterator];temp[13]=commands[++iterator];temp[14]=commands[++iterator];temp[15]=commands[++iterator];context._domRenderer.setMatrix(temp);if(context._webGLRenderer)context._webGLRenderer.setCutoutUniform(path,'u_transform',temp);return iterator;}function changeSize(context,path,commands,iterator){var width=commands[++iterator];var height=commands[++iterator];context._domRenderer.setSize(width,height);if(context._webGLRenderer){context._meshSize[0]=width;context._meshSize[1]=height;context._webGLRenderer.setCutoutUniform(path,'u_size',context._meshSize);}return iterator;}function changeProperty(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.setProperty(commands[++iterator],commands[++iterator]);return iterator;}function changeContent(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.setContent(commands[++iterator]);return iterator;}function changeAttribute(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.setAttribute(commands[++iterator],commands[++iterator]);return iterator;}function addClass(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.addClass(commands[++iterator]);return iterator;}function removeClass(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.removeClass(commands[++iterator]);return iterator;}function subscribe(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.subscribe(commands[++iterator]);return iterator;}function unsubscribe(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.unsubscribe(commands[++iterator]);return iterator;}function glSetDrawOptions(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.setMeshOptions(path,commands[++iterator]);return iterator;}function glAmbientLight(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.setAmbientLightColor(path,commands[++iterator],commands[++iterator],commands[++iterator]);return iterator;}function glLightPosition(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.setLightPosition(path,commands[++iterator],commands[++iterator],commands[++iterator]);return iterator;}function glLightColor(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.setLightColor(path,commands[++iterator],commands[++iterator],commands[++iterator]);return iterator;}function materialInput(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.handleMaterialInput(path,commands[++iterator],commands[++iterator]);return iterator;}function glSetGeometry(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.setGeometry(path,commands[++iterator],commands[++iterator],commands[++iterator]);return iterator;}function glUniforms(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.setMeshUniform(path,commands[++iterator],commands[++iterator]);return iterator;}function glBufferData(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.bufferData(commands[++iterator],commands[++iterator],commands[++iterator],commands[++iterator],commands[++iterator]);return iterator;}function glCutoutState(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.setCutoutState(path,commands[++iterator]);return iterator;}function glMeshVisibility(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.setMeshVisibility(path,commands[++iterator]);return iterator;}function glRemoveMesh(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.removeMesh(path);return iterator;}function pinholeProjection(context,path,commands,iterator){context._renderState.projectionType=Camera.PINHOLE_PROJECTION;context._renderState.perspectiveTransform[11]=-1/commands[++iterator];context._renderState.perspectiveDirty=true;return iterator;}function orthographicProjection(context,path,commands,iterator){context._renderState.projectionType=Camera.ORTHOGRAPHIC_PROJECTION;context._renderState.perspectiveTransform[11]=0;context._renderState.perspectiveDirty=true;return iterator;}function changeViewTransform(context,path,commands,iterator){context._renderState.viewTransform[0]=commands[++iterator];context._renderState.viewTransform[1]=commands[++iterator];context._renderState.viewTransform[2]=commands[++iterator];context._renderState.viewTransform[3]=commands[++iterator];context._renderState.viewTransform[4]=commands[++iterator];context._renderState.viewTransform[5]=commands[++iterator];context._renderState.viewTransform[6]=commands[++iterator];context._renderState.viewTransform[7]=commands[++iterator];context._renderState.viewTransform[8]=commands[++iterator];context._renderState.viewTransform[9]=commands[++iterator];context._renderState.viewTransform[10]=commands[++iterator];context._renderState.viewTransform[11]=commands[++iterator];context._renderState.viewTransform[12]=commands[++iterator];context._renderState.viewTransform[13]=commands[++iterator];context._renderState.viewTransform[14]=commands[++iterator];context._renderState.viewTransform[15]=commands[++iterator];context._renderState.viewDirty=true;return iterator;}module.exports=Context;},{"../components/Camera":1,"../core/Commands":3,"../dom-renderers/DOMRenderer":6,"../webgl-renderers/WebGLRenderer":39}],26:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var Commands=require('../core/Commands');var Chan=require('../core/Chan');/**
 * The UIManager is being updated by an Engine by consecutively calling its
 * `update` method. It can either manage a real Web-Worker or the global
 * FamousEngine core singleton.
 *
 * @example
 * var compositor = new Compositor();
 * var engine = new Engine();
 *
 * // Using a Web Worker
 * var worker = new Worker('worker.bundle.js');
 * var threadmanger = new UIManager(worker, compositor, engine);
 *
 * // Without using a Web Worker
 * var threadmanger = new UIManager(Famous, compositor, engine);
 *
 * @class  UIManager
 * @constructor
 *
 * @param {Famous|Worker} thread The thread being used to receive messages
 * from and post messages to. Expected to expose a WebWorker-like API, which
 * means providing a way to listen for updates by setting its `onmessage`
 * property and sending updates using `postMessage`.
 * @param {Compositor} compositor an instance of Compositor used to extract
 * enqueued draw commands from to be sent to the thread.
 * @param {RenderLoop} renderLoop an instance of Engine used for executing
 * the `ENGINE` commands on.
 */function UIManager(thread,compositor,renderLoop){this._thread=thread;this._compositor=compositor;this._renderLoop=renderLoop;Chan.setChannel(thread);this._renderLoop.update(this);var _this=this;this._thread.onmessage=function(ev){var message=ev.data?ev.data:ev;if(message[0]===Commands.ENGINE){switch(message[1]){case Commands.CROSS_THREAD:Chan.callback(message[2]);break;case Commands.START:_this._engine.start();break;case Commands.STOP:_this._engine.stop();break;default:console.error('Unknown ENGINE command "'+message[1]+'"');break;}}else{_this._compositor.receiveCommands(message);}};this._thread.onerror=function(error){console.error(error);};}/**
 * Returns the thread being used by the UIManager.
 * This could either be an an actual web worker or a `FamousEngine` singleton.
 *
 * @method
 *
 * @return {Worker|FamousEngine} Either a web worker or a `FamousEngine` singleton.
 */UIManager.prototype.getThread=function getThread(){return this._thread;};/**
 * Returns the compositor being used by this UIManager.
 *
 * @method
 *
 * @return {Compositor} The compositor used by the UIManager.
 */UIManager.prototype.getCompositor=function getCompositor(){return this._compositor;};/**
 * Returns the engine being used by this UIManager.
 *
 * @method
 * @deprecated Use {@link UIManager#getRenderLoop instead!}
 *
 * @return {Engine} The engine used by the UIManager.
 */UIManager.prototype.getEngine=function getEngine(){return this._renderLoop;};/**
 * Returns the render loop currently being used by the UIManager.
 *
 * @method
 *
 * @return {RenderLoop}  The registered render loop used for updating the
 * UIManager.
 */UIManager.prototype.getRenderLoop=function getRenderLoop(){return this._renderLoop;};/**
 * Update method being invoked by the Engine on every `requestAnimationFrame`.
 * Used for updating the notion of time within the managed thread by sending
 * a FRAME command and sending messages to
 *
 * @method
 *
 * @param  {Number} time unix timestamp to be passed down to the worker as a
 * FRAME command
 * @return {undefined} undefined
 */UIManager.prototype.update=function update(time){this._thread.postMessage([Commands.FRAME,time]);var threadMessages=this._compositor.drawCommands();this._thread.postMessage(threadMessages);this._compositor.clearCommands();};module.exports=UIManager;},{"../core/Chan":2,"../core/Commands":3}],27:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var css='.famous-dom-renderer {'+'width:100%;'+'height:100%;'+'transform-style:preserve-3d;'+'-webkit-transform-style:preserve-3d;'+'}'+'.famous-dom-element {'+'-webkit-transform-origin:0% 0%;'+'transform-origin:0% 0%;'+'-webkit-backface-visibility:visible;'+'backface-visibility:visible;'+'-webkit-transform-style:preserve-3d;'+'transform-style:preserve-3d;'+'-webkit-tap-highlight-color:transparent;'+'pointer-events:auto;'+'z-index:1;'+'}'+'.famous-dom-element-content,'+'.famous-dom-element {'+'position:absolute;'+'box-sizing:border-box;'+'-moz-box-sizing:border-box;'+'-webkit-box-sizing:border-box;'+'}'+'.famous-webgl-renderer {'+'-webkit-transform:translateZ(1000000px);'+/* TODO: Fix when Safari Fixes*/'transform:translateZ(1000000px);'+'pointer-events:none;'+'position:absolute;'+'z-index:1;'+'top:0;'+'width:100%;'+'height:100%;'+'}';var INJECTED=typeof document==='undefined';function injectCSS(){if(INJECTED)return;INJECTED=true;if(document.createStyleSheet){var sheet=document.createStyleSheet();sheet.cssText=css;}else{var head=document.getElementsByTagName('head')[0];var style=document.createElement('style');if(style.styleSheet){style.styleSheet.cssText=css;}else{style.appendChild(document.createTextNode(css));}(head?head:document.documentElement).appendChild(style);}}module.exports=injectCSS;},{}],28:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';/**
 * A lightweight, featureless EventEmitter.
 *
 * @class CallbackStore
 * @constructor
 */function CallbackStore(){this._events={};}/**
 * Adds a listener for the specified event (= key).
 *
 * @method on
 * @chainable
 *
 * @param  {String}   key       The event type (e.g. `click`).
 * @param  {Function} callback  A callback function to be invoked whenever `key`
 *                              event is being triggered.
 * @return {Function} destroy   A function to call if you want to remove the
 *                              callback.
 */CallbackStore.prototype.on=function on(key,callback){if(!this._events[key])this._events[key]=[];var callbackList=this._events[key];callbackList.push(callback);return function(){callbackList.splice(callbackList.indexOf(callback),1);};};/**
 * Removes a previously added event listener.
 *
 * @method off
 * @chainable
 *
 * @param  {String} key         The event type from which the callback function
 *                              should be removed.
 * @param  {Function} callback  The callback function to be removed from the
 *                              listeners for key.
 * @return {CallbackStore} this
 */CallbackStore.prototype.off=function off(key,callback){var events=this._events[key];if(events)events.splice(events.indexOf(callback),1);return this;};/**
 * Invokes all the previously for this key registered callbacks.
 *
 * @method trigger
 * @chainable
 *
 * @param  {String}        key      The event type.
 * @param  {Object}        payload  The event payload (event object).
 * @return {CallbackStore} this
 */CallbackStore.prototype.trigger=function trigger(key,payload){var events=this._events[key];if(events){var i=0;var len=events.length;for(;i<len;i++){events[i](payload);}}return this;};module.exports=CallbackStore;},{}],29:[function(require,module,exports){'use strict';function Registry(){this._keyToValue={};this._values=[];this._keys=[];this._keyToIndex={};this._freedIndices=[];}Registry.prototype.register=function register(key,value){var index=this._keyToIndex[key];if(index==null){index=this._freedIndices.pop();if(index===undefined)index=this._values.length;this._values[index]=value;this._keys[index]=key;this._keyToIndex[key]=index;this._keyToValue[key]=value;}else{this._keyToValue[key]=value;this._values[index]=value;}};Registry.prototype.unregister=function unregister(key){var index=this._keyToIndex[key];if(index!=null){this._freedIndices.push(index);this._keyToValue[key]=null;this._keyToIndex[key]=null;this._values[index]=null;this._keys[index]=null;}};Registry.prototype.get=function get(key){return this._keyToValue[key];};Registry.prototype.getValues=function getValues(){return this._values;};Registry.prototype.getKeys=function getKeys(){return this._keys;};Registry.prototype.getKeyToValue=function getKeyToValue(){return this._keyToValue;};module.exports=Registry;},{}],30:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';/**
 * Deep clone an object.
 *
 * @method  clone
 *
 * @param {Object} b       Object to be cloned.
 * @return {Object} a      Cloned object (deep equality).
 */var clone=function clone(b){var a;if((typeof b==="undefined"?"undefined":_typeof(b))==='object'){a=b instanceof Array?[]:{};for(var key in b){if(_typeof(b[key])==='object'&&b[key]!==null){if(b[key]instanceof Array){a[key]=new Array(b[key].length);for(var i=0;i<b[key].length;i++){a[key][i]=clone(b[key][i]);}}else{a[key]=clone(b[key]);}}else{a[key]=b[key];}}}else{a=b;}return a;};module.exports=clone;},{}],31:[function(require,module,exports){'use strict';/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *//**
 * Takes an object containing keys and values and returns an object
 * comprising two "associate" arrays, one with the keys and the other
 * with the values.
 *
 * @method keyValuesToArrays
 *
 * @param {Object} obj                      Objects where to extract keys and values
 *                                          from.
 * @return {Object}         result
 *         {Array.<String>} result.keys     Keys of `result`, as returned by
 *                                          `Object.keys()`
 *         {Array}          result.values   Values of passed in object.
 */module.exports=function keyValuesToArrays(obj){var keysArray=[],valuesArray=[];var i=0;for(var key in obj){if(obj.hasOwnProperty(key)){keysArray[i]=key;valuesArray[i]=obj[key];i++;}}return{keys:keysArray,values:valuesArray};};},{}],32:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var PREFIXES=['','-ms-','-webkit-','-moz-','-o-'];/**
 * A helper function used for determining the vendor prefixed version of the
 * passed in CSS property.
 *
 * Vendor checks are being conducted in the following order:
 *
 * 1. (no prefix)
 * 2. `-mz-`
 * 3. `-webkit-`
 * 4. `-moz-`
 * 5. `-o-`
 *
 * @method vendorPrefix
 *
 * @param {String} property     CSS property (no camelCase), e.g.
 *                              `border-radius`.
 * @return {String} prefixed    Vendor prefixed version of passed in CSS
 *                              property (e.g. `-webkit-border-radius`).
 */function vendorPrefix(property){for(var i=0;i<PREFIXES.length;i++){var prefixed=PREFIXES[i]+property;if(document.documentElement.style[prefixed]===''){return prefixed;}}return property;}module.exports=vendorPrefix;},{}],33:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';/**
 * Buffer is a private class that wraps the vertex data that defines
 * the the points of the triangles that webgl draws. Each buffer
 * maps to one attribute of a mesh.
 *
 * @class Buffer
 * @constructor
 *
 * @param {Number} target The bind target of the buffer to update: ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER
 * @param {Object} type Array type to be used in calls to gl.bufferData.
 * @param {WebGLContext} gl The WebGL context that the buffer is hosted by.
 *
 * @return {undefined} undefined
 */function Buffer(target,type,gl){this.buffer=null;this.target=target;this.type=type;this.data=[];this.gl=gl;}/**
 * Creates a WebGL buffer if one does not yet exist and binds the buffer to
 * to the context. Runs bufferData with appropriate data.
 *
 * @method
 *
 * @return {undefined} undefined
 */Buffer.prototype.subData=function subData(){var gl=this.gl;var data=[];// to prevent against maximum call-stack issue.
for(var i=0,chunk=10000;i<this.data.length;i+=chunk){data=Array.prototype.concat.apply(data,this.data.slice(i,i+chunk));}this.buffer=this.buffer||gl.createBuffer();gl.bindBuffer(this.target,this.buffer);gl.bufferData(this.target,new this.type(data),gl.STATIC_DRAW);};module.exports=Buffer;},{}],34:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var INDICES='indices';var Buffer=require('./Buffer');/**
 * BufferRegistry is a class that manages allocation of buffers to
 * input geometries.
 *
 * @class BufferRegistry
 * @constructor
 *
 * @param {WebGLContext} context WebGL drawing context to be passed to buffers.
 *
 * @return {undefined} undefined
 */function BufferRegistry(context){this.gl=context;this.registry={};this._dynamicBuffers=[];this._staticBuffers=[];this._arrayBufferMax=30000;this._elementBufferMax=30000;}/**
 * Binds and fills all the vertex data into webgl buffers.  Will reuse buffers if
 * possible.  Populates registry with the name of the buffer, the WebGL buffer
 * object, spacing of the attribute, the attribute's offset within the buffer,
 * and finally the length of the buffer.  This information is later accessed by
 * the root to draw the buffers.
 *
 * @method
 *
 * @param {Number} geometryId Id of the geometry instance that holds the buffers.
 * @param {String} name Key of the input buffer in the geometry.
 * @param {Array} value Flat array containing input data for buffer.
 * @param {Number} spacing The spacing, or itemSize, of the input buffer.
 * @param {Boolean} dynamic Boolean denoting whether a geometry is dynamic or static.
 *
 * @return {undefined} undefined
 */BufferRegistry.prototype.allocate=function allocate(geometryId,name,value,spacing,dynamic){var vertexBuffers=this.registry[geometryId]||(this.registry[geometryId]={keys:[],values:[],spacing:[],offset:[],length:[]});var j=vertexBuffers.keys.indexOf(name);var isIndex=name===INDICES;var bufferFound=false;var newOffset;var offset=0;var length;var buffer;var k;if(j===-1){j=vertexBuffers.keys.length;length=isIndex?value.length:Math.floor(value.length/spacing);if(!dynamic){// Use a previously created buffer if available.
for(k=0;k<this._staticBuffers.length;k++){if(isIndex===this._staticBuffers[k].isIndex){newOffset=this._staticBuffers[k].offset+value.length;if(!isIndex&&newOffset<this._arrayBufferMax||isIndex&&newOffset<this._elementBufferMax){buffer=this._staticBuffers[k].buffer;offset=this._staticBuffers[k].offset;this._staticBuffers[k].offset+=value.length;bufferFound=true;break;}}}// Create a new static buffer in none were found.
if(!bufferFound){buffer=new Buffer(isIndex?this.gl.ELEMENT_ARRAY_BUFFER:this.gl.ARRAY_BUFFER,isIndex?Uint16Array:Float32Array,this.gl);this._staticBuffers.push({buffer:buffer,offset:value.length,isIndex:isIndex});}}else{// For dynamic geometries, always create new buffer.
buffer=new Buffer(isIndex?this.gl.ELEMENT_ARRAY_BUFFER:this.gl.ARRAY_BUFFER,isIndex?Uint16Array:Float32Array,this.gl);this._dynamicBuffers.push({buffer:buffer,offset:value.length,isIndex:isIndex});}// Update the registry for the spec with buffer information.
vertexBuffers.keys.push(name);vertexBuffers.values.push(buffer);vertexBuffers.spacing.push(spacing);vertexBuffers.offset.push(offset);vertexBuffers.length.push(length);}var len=value.length;for(k=0;k<len;k++){vertexBuffers.values[j].data[offset+k]=value[k];}vertexBuffers.values[j].subData();};module.exports=BufferRegistry;},{"./Buffer":33}],35:[function(require,module,exports){'use strict';/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *//**
 * Takes the original rendering contexts' compiler function
 * and augments it with added functionality for parsing and
 * displaying errors.
 *
 * @method
 *
 * @returns {Function} Augmented function
 */function Debug(){return _augmentFunction(this.gl.compileShader,function(shader){if(!this.getShaderParameter(shader,this.COMPILE_STATUS)){var errors=this.getShaderInfoLog(shader);var source=this.getShaderSource(shader);_processErrors(errors,source);}});}// Takes a function, keeps the reference and replaces it by a closure that
// executes the original function and the provided callback.
function _augmentFunction(func,callback){return function(){var res=func.apply(this,arguments);callback.apply(this,arguments);return res;};}// Parses errors and failed source code from shaders in order
// to build displayable error blocks.
// Inspired by Jaume Sanchez Elias.
function _processErrors(errors,source){var css='body,html{background:#e3e3e3;font-family:monaco,monospace;font-size:14px;line-height:1.7em}'+'#shaderReport{left:0;top:0;right:0;box-sizing:border-box;position:absolute;z-index:1000;color:'+'#222;padding:15px;white-space:normal;list-style-type:none;margin:50px auto;max-width:1200px}'+'#shaderReport li{background-color:#fff;margin:13px 0;box-shadow:0 1px 2px rgba(0,0,0,.15);'+'padding:20px 30px;border-radius:2px;border-left:20px solid #e01111}span{color:#e01111;'+'text-decoration:underline;font-weight:700}#shaderReport li p{padding:0;margin:0}'+'#shaderReport li:nth-child(even){background-color:#f4f4f4}'+'#shaderReport li p:first-child{margin-bottom:10px;color:#666}';var el=document.createElement('style');document.getElementsByTagName('head')[0].appendChild(el);el.textContent=css;var report=document.createElement('ul');report.setAttribute('id','shaderReport');document.body.appendChild(report);var re=/ERROR: [\d]+:([\d]+): (.+)/gmi;var lines=source.split('\n');var m;while((m=re.exec(errors))!=null){if(m.index===re.lastIndex)re.lastIndex++;var li=document.createElement('li');var code='<p><span>ERROR</span> "'+m[2]+'" in line '+m[1]+'</p>';code+='<p><b>'+lines[m[1]-1].replace(/^[ \t]+/g,'')+'</b></p>';li.innerHTML=code;report.appendChild(li);}}module.exports=Debug;},{}],36:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var clone=require('../utilities/clone');var keyValueToArrays=require('../utilities/keyValueToArrays');var vertexWrapper=require('../webgl-shaders').vertex;var fragmentWrapper=require('../webgl-shaders').fragment;var Debug=require('./Debug');var VERTEX_SHADER=35633;var FRAGMENT_SHADER=35632;var identityMatrix=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];var header='precision mediump float;\n';var TYPES={undefined:'float ',1:'float ',2:'vec2 ',3:'vec3 ',4:'vec4 ',16:'mat4 '};var inputTypes={u_baseColor:'vec4',u_normals:'vert',u_glossiness:'vec4',u_positionOffset:'vert'};var masks={vert:1,vec3:2,vec4:4,float:8};/**
 * Uniform keys and values
 */var uniforms=keyValueToArrays({u_perspective:identityMatrix,u_view:identityMatrix,u_resolution:[0,0,0],u_transform:identityMatrix,u_size:[1,1,1],u_time:0,u_opacity:1,u_metalness:0,u_glossiness:[0,0,0,0],u_baseColor:[1,1,1,1],u_normals:[1,1,1],u_positionOffset:[0,0,0],u_lightPosition:identityMatrix,u_lightColor:identityMatrix,u_ambientLight:[0,0,0],u_flatShading:0,u_numLights:0});/**
 * Attributes keys and values
 */var attributes=keyValueToArrays({a_pos:[0,0,0],a_texCoord:[0,0],a_normals:[0,0,0]});/**
 * Varyings keys and values
 */var varyings=keyValueToArrays({v_textureCoordinate:[0,0],v_normal:[0,0,0],v_position:[0,0,0],v_eyeVector:[0,0,0]});/**
 * A class that handles interactions with the WebGL shader program
 * used by a specific context.  It manages creation of the shader program
 * and the attached vertex and fragment shaders.  It is also in charge of
 * passing all uniforms to the WebGLContext.
 *
 * @class Program
 * @constructor
 *
 * @param {WebGL_Context} gl Context to be used to create the shader program
 * @param {Object} options Program options
 *
 * @return {undefined} undefined
 */function Program(gl,options){this.gl=gl;this.options=options||{};this.registeredMaterials={};this.cachedUniforms={};this.uniformTypes=[];this.definitionVec4=[];this.definitionVec3=[];this.definitionFloat=[];this.applicationVec3=[];this.applicationVec4=[];this.applicationFloat=[];this.applicationVert=[];this.definitionVert=[];if(this.options.debug){this.gl.compileShader=Debug.call(this);}this.resetProgram();}/**
 * Determines whether a material has already been registered to
 * the shader program.
 *
 * @method
 *
 * @param {String} name Name of target input of material.
 * @param {Object} material Compiled material object being verified.
 *
 * @return {Program} this Current program.
 */Program.prototype.registerMaterial=function registerMaterial(name,material){var compiled=material;var type=inputTypes[name];var mask=masks[type];if((this.registeredMaterials[material._id]&mask)===mask)return this;var k;for(k in compiled.uniforms){if(uniforms.keys.indexOf(k)===-1){uniforms.keys.push(k);uniforms.values.push(compiled.uniforms[k]);}}for(k in compiled.varyings){if(varyings.keys.indexOf(k)===-1){varyings.keys.push(k);varyings.values.push(compiled.varyings[k]);}}for(k in compiled.attributes){if(attributes.keys.indexOf(k)===-1){attributes.keys.push(k);attributes.values.push(compiled.attributes[k]);}}this.registeredMaterials[material._id]|=mask;if(type==='float'){this.definitionFloat.push(material.defines);this.definitionFloat.push('float fa_'+material._id+'() {\n '+compiled.glsl+' \n}');this.applicationFloat.push('if (int(abs(ID)) == '+material._id+') return fa_'+material._id+'();');}if(type==='vec3'){this.definitionVec3.push(material.defines);this.definitionVec3.push('vec3 fa_'+material._id+'() {\n '+compiled.glsl+' \n}');this.applicationVec3.push('if (int(abs(ID.x)) == '+material._id+') return fa_'+material._id+'();');}if(type==='vec4'){this.definitionVec4.push(material.defines);this.definitionVec4.push('vec4 fa_'+material._id+'() {\n '+compiled.glsl+' \n}');this.applicationVec4.push('if (int(abs(ID.x)) == '+material._id+') return fa_'+material._id+'();');}if(type==='vert'){this.definitionVert.push(material.defines);this.definitionVert.push('vec3 fa_'+material._id+'() {\n '+compiled.glsl+' \n}');this.applicationVert.push('if (int(abs(ID.x)) == '+material._id+') return fa_'+material._id+'();');}return this.resetProgram();};/**
 * Clears all cached uniforms and attribute locations.  Assembles
 * new fragment and vertex shaders and based on material from
 * currently registered materials.  Attaches said shaders to new
 * shader program and upon success links program to the WebGL
 * context.
 *
 * @method
 *
 * @return {Program} Current program.
 */Program.prototype.resetProgram=function resetProgram(){var vertexHeader=[header];var fragmentHeader=[header];var fragmentSource;var vertexSource;var program;var name;var value;var i;this.uniformLocations=[];this.attributeLocations={};this.uniformTypes={};this.attributeNames=clone(attributes.keys);this.attributeValues=clone(attributes.values);this.varyingNames=clone(varyings.keys);this.varyingValues=clone(varyings.values);this.uniformNames=clone(uniforms.keys);this.uniformValues=clone(uniforms.values);this.cachedUniforms={};fragmentHeader.push('uniform sampler2D u_textures[7];\n');if(this.applicationVert.length){vertexHeader.push('uniform sampler2D u_textures[7];\n');}for(i=0;i<this.uniformNames.length;i++){name=this.uniformNames[i];value=this.uniformValues[i];vertexHeader.push('uniform '+TYPES[value.length]+name+';\n');fragmentHeader.push('uniform '+TYPES[value.length]+name+';\n');}for(i=0;i<this.attributeNames.length;i++){name=this.attributeNames[i];value=this.attributeValues[i];vertexHeader.push('attribute '+TYPES[value.length]+name+';\n');}for(i=0;i<this.varyingNames.length;i++){name=this.varyingNames[i];value=this.varyingValues[i];vertexHeader.push('varying '+TYPES[value.length]+name+';\n');fragmentHeader.push('varying '+TYPES[value.length]+name+';\n');}vertexSource=vertexHeader.join('')+vertexWrapper.replace('#vert_definitions',this.definitionVert.join('\n')).replace('#vert_applications',this.applicationVert.join('\n'));fragmentSource=fragmentHeader.join('')+fragmentWrapper.replace('#vec3_definitions',this.definitionVec3.join('\n')).replace('#vec3_applications',this.applicationVec3.join('\n')).replace('#vec4_definitions',this.definitionVec4.join('\n')).replace('#vec4_applications',this.applicationVec4.join('\n')).replace('#float_definitions',this.definitionFloat.join('\n')).replace('#float_applications',this.applicationFloat.join('\n'));program=this.gl.createProgram();this.gl.attachShader(program,this.compileShader(this.gl.createShader(VERTEX_SHADER),vertexSource));this.gl.attachShader(program,this.compileShader(this.gl.createShader(FRAGMENT_SHADER),fragmentSource));this.gl.linkProgram(program);if(!this.gl.getProgramParameter(program,this.gl.LINK_STATUS)){console.error('link error: '+this.gl.getProgramInfoLog(program));this.program=null;}else{this.program=program;this.gl.useProgram(this.program);}this.setUniforms(this.uniformNames,this.uniformValues);var textureLocation=this.gl.getUniformLocation(this.program,'u_textures[0]');this.gl.uniform1iv(textureLocation,[0,1,2,3,4,5,6]);return this;};/**
 * Compares the value of the input uniform value against
 * the cached value stored on the Program class.  Updates and
 * creates new entries in the cache when necessary.
 *
 * @method
 * @param {String} targetName Key of uniform spec being evaluated.
 * @param {Number|Array} value Value of uniform spec being evaluated.
 *
 * @return {Boolean} boolean Indicating whether the uniform being set is cached.
 */Program.prototype.uniformIsCached=function(targetName,value){if(this.cachedUniforms[targetName]==null){if(value.length){this.cachedUniforms[targetName]=new Float32Array(value);}else{this.cachedUniforms[targetName]=value;}return false;}else if(value.length){var i=value.length;while(i--){if(value[i]!==this.cachedUniforms[targetName][i]){i=value.length;while(i--){this.cachedUniforms[targetName][i]=value[i];}return false;}}}else if(this.cachedUniforms[targetName]!==value){this.cachedUniforms[targetName]=value;return false;}return true;};/**
 * Handles all passing of uniforms to WebGL drawing context.  This
 * function will find the uniform location and then, based on
 * a type inferred from the javascript value of the uniform, it will call
 * the appropriate function to pass the uniform to WebGL.  Finally,
 * setUniforms will iterate through the passed in shaderChunks (if any)
 * and set the appropriate uniforms to specify which chunks to use.
 *
 * @method
 * @param {Array} uniformNames Array containing the keys of all uniforms to be set.
 * @param {Array} uniformValue Array containing the values of all uniforms to be set.
 *
 * @return {Program} Current program.
 */Program.prototype.setUniforms=function(uniformNames,uniformValue){var gl=this.gl;var location;var value;var name;var len;var i;if(!this.program)return this;len=uniformNames.length;for(i=0;i<len;i++){name=uniformNames[i];value=uniformValue[i];// Retreive the cached location of the uniform,
// requesting a new location from the WebGL context
// if it does not yet exist.
location=this.uniformLocations[name];if(location===null)continue;if(location===undefined){location=gl.getUniformLocation(this.program,name);this.uniformLocations[name]=location;}// Check if the value is already set for the
// given uniform.
if(this.uniformIsCached(name,value))continue;// Determine the correct function and pass the uniform
// value to WebGL.
if(!this.uniformTypes[name]){this.uniformTypes[name]=this.getUniformTypeFromValue(value);}// Call uniform setter function on WebGL context with correct value
switch(this.uniformTypes[name]){case'uniform4fv':gl.uniform4fv(location,value);break;case'uniform3fv':gl.uniform3fv(location,value);break;case'uniform2fv':gl.uniform2fv(location,value);break;case'uniform1fv':gl.uniform1fv(location,value);break;case'uniform1f':gl.uniform1f(location,value);break;case'uniformMatrix3fv':gl.uniformMatrix3fv(location,false,value);break;case'uniformMatrix4fv':gl.uniformMatrix4fv(location,false,value);break;}}return this;};/**
 * Infers uniform setter function to be called on the WebGL context, based
 * on an input value.
 *
 * @method
 *
 * @param {Number|Array} value Value from which uniform type is inferred.
 *
 * @return {String} Name of uniform function for given value.
 */Program.prototype.getUniformTypeFromValue=function getUniformTypeFromValue(value){if(Array.isArray(value)||value instanceof Float32Array){switch(value.length){case 1:return'uniform1fv';case 2:return'uniform2fv';case 3:return'uniform3fv';case 4:return'uniform4fv';case 9:return'uniformMatrix3fv';case 16:return'uniformMatrix4fv';}}else if(!isNaN(parseFloat(value))&&isFinite(value)){return'uniform1f';}throw'cant load uniform "'+name+'" with value:'+JSON.stringify(value);};/**
 * Adds shader source to shader and compiles the input shader.  Checks
 * compile status and logs error if necessary.
 *
 * @method
 *
 * @param {Object} shader Program to be compiled.
 * @param {String} source Source to be used in the shader.
 *
 * @return {Object} Compiled shader.
 */Program.prototype.compileShader=function compileShader(shader,source){var i=1;this.gl.shaderSource(shader,source);this.gl.compileShader(shader);if(!this.gl.getShaderParameter(shader,this.gl.COMPILE_STATUS)){console.error('compile error: '+this.gl.getShaderInfoLog(shader));console.error('1: '+source.replace(/\n/g,function(){return'\n'+(i+=1)+': ';}));}return shader;};module.exports=Program;},{"../utilities/clone":30,"../utilities/keyValueToArrays":31,"../webgl-shaders":43,"./Debug":35}],37:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';/**
 * Texture is a private class that stores image data
 * to be accessed from a shader or used as a render target.
 *
 * @class Texture
 * @constructor
 *
 * @param {GL} gl GL
 * @param {Object} options Options
 *
 * @return {undefined} undefined
 */function Texture(gl,options){options=options||{};this.id=gl.createTexture();this.width=options.width||0;this.height=options.height||0;this.mipmap=options.mipmap;this.format=options.format||'RGBA';this.type=options.type||'UNSIGNED_BYTE';this.gl=gl;this.bind();gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,options.flipYWebgl||false);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,options.premultiplyAlphaWebgl||false);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl[options.magFilter]||gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl[options.minFilter]||gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl[options.wrapS]||gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl[options.wrapT]||gl.CLAMP_TO_EDGE);}/**
 * Binds this texture as the selected target.
 *
 * @method
 * @return {Object} Current texture instance.
 */Texture.prototype.bind=function bind(){this.gl.bindTexture(this.gl.TEXTURE_2D,this.id);return this;};/**
 * Erases the texture data in the given texture slot.
 *
 * @method
 * @return {Object} Current texture instance.
 */Texture.prototype.unbind=function unbind(){this.gl.bindTexture(this.gl.TEXTURE_2D,null);return this;};/**
 * Replaces the image data in the texture with the given image.
 *
 * @method
 *
 * @param {Image}   img     The image object to upload pixel data from.
 * @return {Object}         Current texture instance.
 */Texture.prototype.setImage=function setImage(img){this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl[this.format],this.gl[this.format],this.gl[this.type],img);if(this.mipmap)this.gl.generateMipmap(this.gl.TEXTURE_2D);return this;};/**
 * Replaces the image data in the texture with an array of arbitrary data.
 *
 * @method
 *
 * @param {Array}   input   Array to be set as data to texture.
 * @return {Object}         Current texture instance.
 */Texture.prototype.setArray=function setArray(input){this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl[this.format],this.width,this.height,0,this.gl[this.format],this.gl[this.type],input);return this;};/**
 * Dumps the rgb-pixel contents of a texture into an array for debugging purposes
 *
 * @method
 *
 * @param {Number} x        x-offset between texture coordinates and snapshot
 * @param {Number} y        y-offset between texture coordinates and snapshot
 * @param {Number} width    x-depth of the snapshot
 * @param {Number} height   y-depth of the snapshot
 *
 * @return {Array}          An array of the pixels contained in the snapshot.
 */Texture.prototype.readBack=function readBack(x,y,width,height){var gl=this.gl;var pixels;x=x||0;y=y||0;width=width||this.width;height=height||this.height;var fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,this.id,0);if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE){pixels=new Uint8Array(width*height*4);gl.readPixels(x,y,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);}return pixels;};module.exports=Texture;},{}],38:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var Texture=require('./Texture');var createCheckerboard=require('./createCheckerboard');/**
 * Handles loading, binding, and resampling of textures for WebGLRenderer.
 *
 * @class TextureManager
 * @constructor
 *
 * @param {WebGL_Context} gl Context used to create and bind textures.
 *
 * @return {undefined} undefined
 */function TextureManager(gl){this.registry=[];this._needsResample=[];this._activeTexture=0;this._boundTexture=null;this._checkerboard=createCheckerboard();this.gl=gl;}/**
 * Update function used by WebGLRenderer to queue resamples on
 * registered textures.
 *
 * @method
 *
 * @param {Number}      time    Time in milliseconds according to the compositor.
 * @return {undefined}          undefined
 */TextureManager.prototype.update=function update(time){var registryLength=this.registry.length;for(var i=1;i<registryLength;i++){var texture=this.registry[i];if(texture&&texture.isLoaded&&texture.resampleRate){if(!texture.lastResample||time-texture.lastResample>texture.resampleRate){if(!this._needsResample[texture.id]){this._needsResample[texture.id]=true;texture.lastResample=time;}}}}};/**
 * Creates a spec and creates a texture based on given texture data.
 * Handles loading assets if necessary.
 *
 * @method
 *
 * @param {Object}  input   Object containing texture id, texture data
 *                          and options used to draw texture.
 * @param {Number}  slot    Texture slot to bind generated texture to.
 * @return {undefined}      undefined
 */TextureManager.prototype.register=function register(input,slot){var _this=this;var source=input.data;var textureId=input.id;var options=input.options||{};var texture=this.registry[textureId];var spec;if(!texture){texture=new Texture(this.gl,options);texture.setImage(this._checkerboard);// Add texture to registry
spec=this.registry[textureId]={resampleRate:options.resampleRate||null,lastResample:null,isLoaded:false,texture:texture,source:source,id:textureId,slot:slot};// Handle array
if(Array.isArray(source)||source instanceof Uint8Array||source instanceof Float32Array){this.bindTexture(textureId);texture.setArray(source);spec.isLoaded=true;}// Handle video
else if(source instanceof HTMLVideoElement){source.addEventListener('loadeddata',function(){_this.bindTexture(textureId);texture.setImage(source);spec.isLoaded=true;spec.source=source;});}// Handle image url
else if(typeof source==='string'){loadImage(source,function(img){_this.bindTexture(textureId);texture.setImage(img);spec.isLoaded=true;spec.source=img;});}}return textureId;};/**
 * Loads an image from a string or Image object and executes a callback function.
 *
 * @method
 * @private
 *
 * @param {Object|String} input The input image data to load as an asset.
 * @param {Function} callback The callback function to be fired when the image has finished loading.
 *
 * @return {Object} Image object being loaded.
 */function loadImage(input,callback){var image=(typeof input==='string'?new Image():input)||{};image.crossOrigin='anonymous';if(!image.src)image.src=input;if(!image.complete){image.onload=function(){callback(image);};}else{callback(image);}return image;}/**
 * Sets active texture slot and binds target texture.  Also handles
 * resampling when necessary.
 *
 * @method
 *
 * @param {Number} id Identifier used to retreive texture spec
 *
 * @return {undefined} undefined
 */TextureManager.prototype.bindTexture=function bindTexture(id){var spec=this.registry[id];if(this._activeTexture!==spec.slot){this.gl.activeTexture(this.gl.TEXTURE0+spec.slot);this._activeTexture=spec.slot;}if(this._boundTexture!==id){this._boundTexture=id;spec.texture.bind();}if(this._needsResample[spec.id]){// TODO: Account for resampling of arrays.
spec.texture.setImage(spec.source);this._needsResample[spec.id]=false;}};module.exports=TextureManager;},{"./Texture":37,"./createCheckerboard":41}],39:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var Program=require('./Program');var BufferRegistry=require('./BufferRegistry');var sorter=require('./radixSort');var keyValueToArrays=require('../utilities/keyValueToArrays');var TextureManager=require('./TextureManager');var compileMaterial=require('./compileMaterial');var Registry=require('../utilities/Registry');var identity=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];var globalUniforms=keyValueToArrays({'u_numLights':0,'u_ambientLight':new Array(3),'u_lightPosition':new Array(3),'u_lightColor':new Array(3),'u_perspective':new Array(16),'u_time':0,'u_view':new Array(16)});/**
 * WebGLRenderer is a private class that manages all interactions with the WebGL
 * API. Each frame it receives commands from the compositor and updates its
 * registries accordingly. Subsequently, the draw function is called and the
 * WebGLRenderer issues draw calls for all meshes in its registry.
 *
 * @class WebGLRenderer
 * @constructor
 *
 * @param {Element} canvas The DOM element that GL will paint itself onto.
 * @param {Compositor} compositor Compositor used for querying the time from.
 *
 * @return {undefined} undefined
 */function WebGLRenderer(canvas,compositor){canvas.classList.add('famous-webgl-renderer');this.canvas=canvas;this.compositor=compositor;var gl=this.gl=this.getWebGLContext(this.canvas);gl.clearColor(0.0,0.0,0.0,0.0);gl.polygonOffset(0.1,0.1);gl.enable(gl.POLYGON_OFFSET_FILL);gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.depthFunc(gl.LEQUAL);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);this.meshRegistry=new Registry();this.cutoutRegistry=new Registry();this.lightRegistry=new Registry();this.numLights=0;this.ambientLightColor=[0,0,0];this.lightPositions=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];this.lightColors=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];this.textureManager=new TextureManager(gl);this.bufferRegistry=new BufferRegistry(gl);this.program=new Program(gl,{debug:true});this.state={boundArrayBuffer:null,boundElementBuffer:null,lastDrawn:null,enabledAttributes:{},enabledAttributesKeys:[]};this.resolutionName=['u_resolution'];this.resolutionValues=[[0,0,0]];this.cachedSize=[];/*
    The projectionTransform has some constant components, i.e. the z scale, and the x and y translation.

    The z scale keeps the final z position of any vertex within the clip's domain by scaling it by an
    arbitrarily small coefficient. This has the advantage of being a useful default in the event of the
    user forgoing a near and far plane, an alien convention in dom space as in DOM overlapping is
    conducted via painter's algorithm.

    The x and y translation transforms the world space origin to the top left corner of the screen.

    The final component (this.projectionTransform[15]) is initialized as 1 because certain projection models,
    e.g. the WC3 specified model, keep the XY plane as the projection hyperplane.
    */this.projectionTransform=[1,0,0,0,0,1,0,0,0,0,-0.000001,0,-1,1,0,1];// TODO: remove this hack
var cutout=this.cutoutGeometry={spec:{id:-1,bufferValues:[[-1,-1,0,1,-1,0,-1,1,0,1,1,0]],bufferNames:['a_pos'],type:'TRIANGLE_STRIP'}};this.bufferRegistry.allocate(this.cutoutGeometry.spec.id,cutout.spec.bufferNames[0],cutout.spec.bufferValues[0],3);}/**
 * Attempts to retreive the WebGLRenderer context using several
 * accessors. For browser compatability. Throws on error.
 *
 * @method
 *
 * @param {Object} canvas Canvas element from which the context is retreived
 *
 * @return {Object} WebGLContext WebGL context
 */WebGLRenderer.prototype.getWebGLContext=function getWebGLContext(canvas){var names=['webgl','experimental-webgl','webkit-3d','moz-webgl'];var context;for(var i=0,len=names.length;i<len;i++){try{context=canvas.getContext(names[i]);}catch(error){console.error('Error creating WebGL context: '+error.toString());}if(context)return context;}if(!context){console.error('Could not retrieve WebGL context. Please refer to https://www.khronos.org/webgl/ for requirements');return false;}};/**
 * Adds a new base spec to the light registry at a given path.
 *
 * @method
 *
 * @param {String} path Path used as id of new light in lightRegistry
 *
 * @return {Object} Newly created light spec
 */WebGLRenderer.prototype.createLight=function createLight(path){this.numLights++;var light={color:[0,0,0],position:[0,0,0]};this.lightRegistry.register(path,light);return light;};/**
 * Adds a new base spec to the mesh registry at a given path.
 *
 * @method
 *
 * @param {String} path Path used as id of new mesh in meshRegistry.
 *
 * @return {Object} Newly created mesh spec.
 */WebGLRenderer.prototype.createMesh=function createMesh(path){var uniforms=keyValueToArrays({u_opacity:1,u_transform:identity,u_size:[0,0,0],u_baseColor:[0.5,0.5,0.5,1],u_positionOffset:[0,0,0],u_normals:[0,0,0],u_flatShading:0,u_glossiness:[0,0,0,0]});var mesh={depth:null,uniformKeys:uniforms.keys,uniformValues:uniforms.values,buffers:{},geometry:null,drawType:null,textures:[],visible:true};this.meshRegistry.register(path,mesh);return mesh;};/**
 * Sets flag on indicating whether to do skip draw phase for
 * cutout mesh at given path.
 *
 * @method
 *
 * @param {String} path Path used as id of target cutout mesh.
 * @param {Boolean} usesCutout Indicates the presence of a cutout mesh
 *
 * @return {undefined} undefined
 */WebGLRenderer.prototype.setCutoutState=function setCutoutState(path,usesCutout){var cutout=this.getOrSetCutout(path);cutout.visible=usesCutout;};/**
 * Creates or retreives cutout
 *
 * @method
 *
 * @param {String} path Path used as id of target cutout mesh.
 *
 * @return {Object} Newly created cutout spec.
 */WebGLRenderer.prototype.getOrSetCutout=function getOrSetCutout(path){var cutout=this.cutoutRegistry.get(path);if(!cutout){var uniforms=keyValueToArrays({u_opacity:0,u_transform:identity.slice(),u_size:[0,0,0],u_origin:[0,0,0],u_baseColor:[0,0,0,1]});cutout={uniformKeys:uniforms.keys,uniformValues:uniforms.values,geometry:this.cutoutGeometry.spec.id,drawType:this.cutoutGeometry.spec.type,visible:true};this.cutoutRegistry.register(path,cutout);}return cutout;};/**
 * Sets flag on indicating whether to do skip draw phase for
 * mesh at given path.
 *
 * @method
 * @param {String} path Path used as id of target mesh.
 * @param {Boolean} visibility Indicates the visibility of target mesh.
 *
 * @return {undefined} undefined
 */WebGLRenderer.prototype.setMeshVisibility=function setMeshVisibility(path,visibility){var mesh=this.meshRegistry.get(path)||this.createMesh(path);mesh.visible=visibility;};/**
 * Deletes a mesh from the meshRegistry.
 *
 * @method
 * @param {String} path Path used as id of target mesh.
 *
 * @return {undefined} undefined
 */WebGLRenderer.prototype.removeMesh=function removeMesh(path){this.meshRegistry.unregister(path);};/**
 * Creates or retreives cutout
 *
 * @method
 * @param {String} path Path used as id of cutout in cutout registry.
 * @param {String} uniformName Identifier used to upload value
 * @param {Array} uniformValue Value of uniform data
 *
 * @return {undefined} undefined
 */WebGLRenderer.prototype.setCutoutUniform=function setCutoutUniform(path,uniformName,uniformValue){var cutout=this.getOrSetCutout(path);var index=cutout.uniformKeys.indexOf(uniformName);if(uniformValue.length){for(var i=0,len=uniformValue.length;i<len;i++){cutout.uniformValues[index][i]=uniformValue[i];}}else{cutout.uniformValues[index]=uniformValue;}};/**
 * Edits the options field on a mesh
 *
 * @method
 * @param {String} path Path used as id of target mesh
 * @param {Object} options Map of draw options for mesh
 *
 * @return {WebGLRenderer} this
 */WebGLRenderer.prototype.setMeshOptions=function(path,options){var mesh=this.meshRegistry.get(path)||this.createMesh(path);mesh.options=options;return this;};/**
 * Changes the color of the fixed intensity lighting in the scene
 *
 * @method
 *
 * @param {String} path Path used as id of light
 * @param {Number} r red channel
 * @param {Number} g green channel
 * @param {Number} b blue channel
 *
 * @return {WebGLRenderer} this
 */WebGLRenderer.prototype.setAmbientLightColor=function setAmbientLightColor(path,r,g,b){this.ambientLightColor[0]=r;this.ambientLightColor[1]=g;this.ambientLightColor[2]=b;return this;};/**
 * Changes the location of the light in the scene
 *
 * @method
 *
 * @param {String} path Path used as id of light
 * @param {Number} x x position
 * @param {Number} y y position
 * @param {Number} z z position
 *
 * @return {WebGLRenderer} this
 */WebGLRenderer.prototype.setLightPosition=function setLightPosition(path,x,y,z){var light=this.lightRegistry.get(path)||this.createLight(path);light.position[0]=x;light.position[1]=y;light.position[2]=z;return this;};/**
 * Changes the color of a dynamic intensity lighting in the scene
 *
 * @method
 *
 * @param {String} path Path used as id of light in light Registry.
 * @param {Number} r red channel
 * @param {Number} g green channel
 * @param {Number} b blue channel
 *
 * @return {WebGLRenderer} this
 */WebGLRenderer.prototype.setLightColor=function setLightColor(path,r,g,b){var light=this.lightRegistry.get(path)||this.createLight(path);light.color[0]=r;light.color[1]=g;light.color[2]=b;return this;};/**
 * Compiles material spec into program shader
 *
 * @method
 *
 * @param {String} path Path used as id of cutout in cutout registry.
 * @param {String} name Name that the rendering input the material is bound to
 * @param {Object} material Material spec
 *
 * @return {WebGLRenderer} this
 */WebGLRenderer.prototype.handleMaterialInput=function handleMaterialInput(path,name,material){var mesh=this.meshRegistry.get(path)||this.createMesh(path);material=compileMaterial(material,mesh.textures.length);// Set uniforms to enable texture!
mesh.uniformValues[mesh.uniformKeys.indexOf(name)][0]=-material._id;// Register textures!
var i=material.textures.length;while(i--){mesh.textures.push(this.textureManager.register(material.textures[i],mesh.textures.length+i));}// Register material!
this.program.registerMaterial(name,material);return this.updateSize();};/**
 * Changes the geometry data of a mesh
 *
 * @method
 *
 * @param {String} path Path used as id of cutout in cutout registry.
 * @param {Object} geometry Geometry object containing vertex data to be drawn
 * @param {Number} drawType Primitive identifier
 * @param {Boolean} dynamic Whether geometry is dynamic
 *
 * @return {undefined} undefined
 */WebGLRenderer.prototype.setGeometry=function setGeometry(path,geometry,drawType,dynamic){var mesh=this.meshRegistry.get(path)||this.createMesh(path);mesh.geometry=geometry;mesh.drawType=drawType;mesh.dynamic=dynamic;return this;};/**
 * Uploads a new value for the uniform data when the mesh is being drawn
 *
 * @method
 *
 * @param {String} path Path used as id of mesh in mesh registry
 * @param {String} uniformName Identifier used to upload value
 * @param {Array} uniformValue Value of uniform data
 *
 * @return {undefined} undefined
 */WebGLRenderer.prototype.setMeshUniform=function setMeshUniform(path,uniformName,uniformValue){var mesh=this.meshRegistry.get(path)||this.createMesh(path);var index=mesh.uniformKeys.indexOf(uniformName);if(index===-1){mesh.uniformKeys.push(uniformName);mesh.uniformValues.push(uniformValue);}else{mesh.uniformValues[index]=uniformValue;}};/**
 * Allocates a new buffer using the internal BufferRegistry.
 *
 * @method
 *
 * @param {Number} geometryId Id of geometry in geometry registry
 * @param {String} bufferName Attribute location name
 * @param {Array} bufferValue Vertex data
 * @param {Number} bufferSpacing The dimensions of the vertex
 * @param {Boolean} isDynamic Whether geometry is dynamic
 *
 * @return {undefined} undefined
 */WebGLRenderer.prototype.bufferData=function bufferData(geometryId,bufferName,bufferValue,bufferSpacing,isDynamic){this.bufferRegistry.allocate(geometryId,bufferName,bufferValue,bufferSpacing,isDynamic);};/**
 * Triggers the 'draw' phase of the WebGLRenderer. Iterates through registries
 * to set uniforms, set attributes and issue draw commands for renderables.
 *
 * @method
 *
 * @param {Object} renderState Parameters provided by the compositor, that affect the rendering of all renderables.
 *
 * @return {undefined} undefined
 */WebGLRenderer.prototype.draw=function draw(renderState){var time=this.compositor.getTime();this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);this.textureManager.update(time);this.meshRegistryKeys=sorter(this.meshRegistry.getKeys(),this.meshRegistry.getKeyToValue());this.setGlobalUniforms(renderState);this.drawCutouts();this.drawMeshes();};/**
 * Iterates through and draws all registered meshes. This includes
 * binding textures, handling draw options, setting mesh uniforms
 * and drawing mesh buffers.
 *
 * @method
 *
 * @return {undefined} undefined
 */WebGLRenderer.prototype.drawMeshes=function drawMeshes(){var gl=this.gl;var buffers;var mesh;var meshes=this.meshRegistry.getValues();for(var i=0;i<meshes.length;i++){mesh=meshes[i];if(!mesh)continue;buffers=this.bufferRegistry.registry[mesh.geometry];if(!mesh.visible)continue;if(mesh.uniformValues[0]<1){gl.depthMask(false);gl.enable(gl.BLEND);}else{gl.depthMask(true);gl.disable(gl.BLEND);}if(!buffers)continue;var j=mesh.textures.length;while(j--){this.textureManager.bindTexture(mesh.textures[j]);}if(mesh.options)this.handleOptions(mesh.options,mesh);this.program.setUniforms(mesh.uniformKeys,mesh.uniformValues);this.drawBuffers(buffers,mesh.drawType,mesh.geometry);if(mesh.options)this.resetOptions(mesh.options);}};/**
 * Iterates through and draws all registered cutout meshes. Blending
 * is disabled, cutout uniforms are set and finally buffers are drawn.
 *
 * @method
 *
 * @return {undefined} undefined
 */WebGLRenderer.prototype.drawCutouts=function drawCutouts(){var cutout;var buffers;var cutouts=this.cutoutRegistry.getValues();var len=cutouts.length;this.gl.disable(this.gl.CULL_FACE);this.gl.enable(this.gl.BLEND);this.gl.depthMask(true);for(var i=0;i<len;i++){cutout=cutouts[i];if(!cutout)continue;buffers=this.bufferRegistry.registry[cutout.geometry];if(!cutout.visible)continue;this.program.setUniforms(cutout.uniformKeys,cutout.uniformValues);this.drawBuffers(buffers,cutout.drawType,cutout.geometry);}this.gl.enable(this.gl.CULL_FACE);};/**
 * Sets uniforms to be shared by all meshes.
 *
 * @method
 *
 * @param {Object} renderState Draw state options passed down from compositor.
 *
 * @return {undefined} undefined
 */WebGLRenderer.prototype.setGlobalUniforms=function setGlobalUniforms(renderState){var light;var stride;var lights=this.lightRegistry.getValues();var len=lights.length;for(var i=0;i<len;i++){light=lights[i];if(!light)continue;stride=i*4;// Build the light positions' 4x4 matrix
this.lightPositions[0+stride]=light.position[0];this.lightPositions[1+stride]=light.position[1];this.lightPositions[2+stride]=light.position[2];// Build the light colors' 4x4 matrix
this.lightColors[0+stride]=light.color[0];this.lightColors[1+stride]=light.color[1];this.lightColors[2+stride]=light.color[2];}globalUniforms.values[0]=this.numLights;globalUniforms.values[1]=this.ambientLightColor;globalUniforms.values[2]=this.lightPositions;globalUniforms.values[3]=this.lightColors;/*
     * Set time and projection uniforms
     * projecting world space into a 2d plane representation of the canvas.
     * The x and y scale (this.projectionTransform[0] and this.projectionTransform[5] respectively)
     * convert the projected geometry back into clipspace.
     * The perpective divide (this.projectionTransform[11]), adds the z value of the point
     * multiplied by the perspective divide to the w value of the point. In the process
     * of converting from homogenous coordinates to NDC (normalized device coordinates)
     * the x and y values of the point are divided by w, which implements perspective.
     */this.projectionTransform[0]=1/(this.cachedSize[0]*0.5);this.projectionTransform[5]=-1/(this.cachedSize[1]*0.5);this.projectionTransform[11]=renderState.perspectiveTransform[11];globalUniforms.values[4]=this.projectionTransform;globalUniforms.values[5]=this.compositor.getTime()*0.001;globalUniforms.values[6]=renderState.viewTransform;this.program.setUniforms(globalUniforms.keys,globalUniforms.values);};/**
 * Loads the buffers and issues the draw command for a geometry.
 *
 * @method
 *
 * @param {Object} vertexBuffers All buffers used to draw the geometry.
 * @param {Number} mode Enumerator defining what primitive to draw
 * @param {Number} id ID of geometry being drawn.
 *
 * @return {undefined} undefined
 */WebGLRenderer.prototype.drawBuffers=function drawBuffers(vertexBuffers,mode,id){var gl=this.gl;var length=0;var attribute;var location;var spacing;var offset;var buffer;var iter;var j;var i;iter=vertexBuffers.keys.length;for(i=0;i<iter;i++){attribute=vertexBuffers.keys[i];// Do not set vertexAttribPointer if index buffer.
if(attribute==='indices'){j=i;continue;}// Retreive the attribute location and make sure it is enabled.
location=this.program.attributeLocations[attribute];if(location===-1)continue;if(location===undefined){location=gl.getAttribLocation(this.program.program,attribute);this.program.attributeLocations[attribute]=location;if(location===-1)continue;}if(!this.state.enabledAttributes[attribute]){gl.enableVertexAttribArray(location);this.state.enabledAttributes[attribute]=true;this.state.enabledAttributesKeys.push(attribute);}// Retreive buffer information used to set attribute pointer.
buffer=vertexBuffers.values[i];spacing=vertexBuffers.spacing[i];offset=vertexBuffers.offset[i];length=vertexBuffers.length[i];// Skip bindBuffer if buffer is currently bound.
if(this.state.boundArrayBuffer!==buffer){gl.bindBuffer(buffer.target,buffer.buffer);this.state.boundArrayBuffer=buffer;}if(this.state.lastDrawn!==id){gl.vertexAttribPointer(location,spacing,gl.FLOAT,gl.FALSE,0,4*offset);}}// Disable any attributes that not currently being used.
var len=this.state.enabledAttributesKeys.length;for(i=0;i<len;i++){var key=this.state.enabledAttributesKeys[i];if(this.state.enabledAttributes[key]&&vertexBuffers.keys.indexOf(key)===-1){gl.disableVertexAttribArray(this.program.attributeLocations[key]);this.state.enabledAttributes[key]=false;}}if(length){// If index buffer, use drawElements.
if(j!==undefined){buffer=vertexBuffers.values[j];offset=vertexBuffers.offset[j];spacing=vertexBuffers.spacing[j];length=vertexBuffers.length[j];// Skip bindBuffer if buffer is currently bound.
if(this.state.boundElementBuffer!==buffer){gl.bindBuffer(buffer.target,buffer.buffer);this.state.boundElementBuffer=buffer;}gl.drawElements(gl[mode],length,gl.UNSIGNED_SHORT,2*offset);}else{gl.drawArrays(gl[mode],0,length);}}this.state.lastDrawn=id;};/**
 * Updates the width and height of parent canvas, sets the viewport size on
 * the WebGL context and updates the resolution uniform for the shader program.
 * Size is retreived from the container object of the renderer.
 *
 * @method
 *
 * @param {Array} size width, height and depth of canvas
 *
 * @return {undefined} undefined
 */WebGLRenderer.prototype.updateSize=function updateSize(size){if(size){var pixelRatio=window.devicePixelRatio||1;var displayWidth=~~(size[0]*pixelRatio);var displayHeight=~~(size[1]*pixelRatio);this.canvas.width=displayWidth;this.canvas.height=displayHeight;this.gl.viewport(0,0,displayWidth,displayHeight);this.cachedSize[0]=size[0];this.cachedSize[1]=size[1];this.cachedSize[2]=size[0]>size[1]?size[0]:size[1];this.resolutionValues[0]=this.cachedSize;}this.program.setUniforms(this.resolutionName,this.resolutionValues);return this;};/**
 * Updates the state of the WebGL drawing context based on custom parameters
 * defined on a mesh.
 *
 * @method
 *
 * @param {Object} options Draw state options to be set to the context.
 * @param {Mesh} mesh Associated Mesh
 *
 * @return {undefined} undefined
 */WebGLRenderer.prototype.handleOptions=function handleOptions(options,mesh){var gl=this.gl;if(!options)return;if(options.blending)gl.enable(gl.BLEND);switch(options.side){case'double':this.gl.cullFace(this.gl.FRONT);this.drawBuffers(this.bufferRegistry.registry[mesh.geometry],mesh.drawType,mesh.geometry);this.gl.cullFace(this.gl.BACK);break;case'back':gl.cullFace(gl.FRONT);break;}};/**
 * Resets the state of the WebGL drawing context to default values.
 *
 * @method
 *
 * @param {Object} options Draw state options to be set to the context.
 *
 * @return {undefined} undefined
 */WebGLRenderer.prototype.resetOptions=function resetOptions(options){var gl=this.gl;if(!options)return;if(options.blending)gl.disable(gl.BLEND);if(options.side==='back')gl.cullFace(gl.BACK);};module.exports=WebGLRenderer;},{"../utilities/Registry":29,"../utilities/keyValueToArrays":31,"./BufferRegistry":34,"./Program":36,"./TextureManager":38,"./compileMaterial":40,"./radixSort":42}],40:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var types={1:'float ',2:'vec2 ',3:'vec3 ',4:'vec4 '};/**
 * Traverses material to create a string of glsl code to be applied in
 * the vertex or fragment shader.
 *
 * @method
 *
 * @param {Object} material Material to be compiled.
 * @param {Number} textureSlot Next available texture slot for Mesh.
 *
 * @return {undefined} undefined
 */function compileMaterial(material,textureSlot){var glsl='';var uniforms={};var varyings={};var attributes={};var defines=[];var textures=[];material.traverse(function(node,depth){if(!node.chunk)return;var type=types[_getOutputLength(node)];var label=_makeLabel(node);var output=_processGLSL(node.chunk.glsl,node.inputs,textures.length+textureSlot);glsl+=type+label+' = '+output+'\n ';if(node.uniforms)_extend(uniforms,node.uniforms);if(node.varyings)_extend(varyings,node.varyings);if(node.attributes)_extend(attributes,node.attributes);if(node.chunk.defines)defines.push(node.chunk.defines);if(node.texture)textures.push(node.texture);});return{_id:material._id,glsl:glsl+'return '+_makeLabel(material)+';',defines:defines.join('\n'),uniforms:uniforms,varyings:varyings,attributes:attributes,textures:textures};}// Helper function used to infer length of the output
// from a given material node.
function _getOutputLength(node){// Handle constant values
if(typeof node==='number')return 1;if(Array.isArray(node))return node.length;// Handle materials
var output=node.chunk.output;if(typeof output==='number')return output;// Handle polymorphic output
var key=node.inputs.map(function recurse(node){return _getOutputLength(node);}).join(',');return output[key];}// Helper function to run replace inputs and texture tags with
// correct glsl.
function _processGLSL(str,inputs,textureSlot){return str.replace(/%\d/g,function(s){return _makeLabel(inputs[s[1]-1]);}).replace(/\$TEXTURE/,'u_textures['+textureSlot+']');}// Helper function used to create glsl definition of the
// input material node.
function _makeLabel(n){if(Array.isArray(n))return _arrayToVec(n);if((typeof n==="undefined"?"undefined":_typeof(n))==='object')return'fa_'+n._id;else return n.toFixed(6);}// Helper to copy the properties of an object onto another object.
function _extend(a,b){for(var k in b){a[k]=b[k];}}// Helper to create glsl vector representation of a javascript array.
function _arrayToVec(array){var len=array.length;return'vec'+len+'('+array.join(',')+')';}module.exports=compileMaterial;},{}],41:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';/**
 * Generates a checkerboard pattern to be used as a placeholder texture while
 * an image loads over the network.
 *
 * @method  createCheckerBoard
 *
 * @return {HTMLCanvasElement} The `canvas` element that has been used in order
 *                             to generate the pattern.
 */function createCheckerBoard(){var context=document.createElement('canvas').getContext('2d');context.canvas.width=context.canvas.height=128;for(var y=0;y<context.canvas.height;y+=16){for(var x=0;x<context.canvas.width;x+=16){context.fillStyle=(x^y)&16?'#FFF':'#DDD';context.fillRect(x,y,16,16);}}return context.canvas;}module.exports=createCheckerBoard;},{}],42:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var radixBits=11,maxRadix=1<<radixBits,radixMask=maxRadix-1,buckets=new Array(maxRadix*Math.ceil(64/radixBits)),msbMask=1<<(32-1)%radixBits,lastMask=(msbMask<<1)-1,passCount=32/radixBits+0.999999999999999|0,maxOffset=maxRadix*(passCount-1),normalizer=Math.pow(20,6);var buffer=new ArrayBuffer(4);var floatView=new Float32Array(buffer,0,1);var intView=new Int32Array(buffer,0,1);// comparator pulls relevant sorting keys out of mesh
function comp(list,registry,i){var key=list[i];var item=registry[key];return(item.depth?item.depth:registry[key].uniformValues[1][14])+normalizer;}//mutator function records mesh's place in previous pass
function mutator(list,registry,i,value){var key=list[i];registry[key].depth=intToFloat(value)-normalizer;return key;}//clean function removes mutator function's record
function clean(list,registry,i){registry[list[i]].depth=null;}//converts a javascript float to a 32bit integer using an array buffer
//of size one
function floatToInt(k){floatView[0]=k;return intView[0];}//converts a 32 bit integer to a regular javascript float using an array buffer
//of size one
function intToFloat(k){intView[0]=k;return floatView[0];}/**
 * Sorts an array of mesh IDs according to their z-depth.
 *
 * @param  {Array} list         An array of meshes.
 * @param  {Object} registry    A registry mapping the path names to meshes.
 * @return {Array}              An array of the meshes sorted by z-depth.
 */function radixSort(list,registry){var pass=0;var out=[];var i,j,k,n,div,offset,swap,id,sum,tsum,size;passCount=32/radixBits+0.999999999999999|0;for(i=0,n=maxRadix*passCount;i<n;i++){buckets[i]=0;}for(i=0,n=list.length;i<n;i++){div=floatToInt(comp(list,registry,i));div^=div>>31|0x80000000;for(j=0,k=0;j<maxOffset;j+=maxRadix,k+=radixBits){buckets[j+(div>>>k&radixMask)]++;}buckets[j+(div>>>k&lastMask)]++;}for(j=0;j<=maxOffset;j+=maxRadix){for(id=j,sum=0;id<j+maxRadix;id++){tsum=buckets[id]+sum;buckets[id]=sum-1;sum=tsum;}}if(--passCount){for(i=0,n=list.length;i<n;i++){div=floatToInt(comp(list,registry,i));out[++buckets[div&radixMask]]=mutator(list,registry,i,div^=div>>31|0x80000000);}swap=out;out=list;list=swap;while(++pass<passCount){for(i=0,n=list.length,offset=pass*maxRadix,size=pass*radixBits;i<n;i++){div=floatToInt(comp(list,registry,i));out[++buckets[offset+(div>>>size&radixMask)]]=list[i];}swap=out;out=list;list=swap;}}for(i=0,n=list.length,offset=pass*maxRadix,size=pass*radixBits;i<n;i++){div=floatToInt(comp(list,registry,i));out[++buckets[offset+(div>>>size&lastMask)]]=mutator(list,registry,i,div^(~div>>31|0x80000000));clean(list,registry,i);}return out;}module.exports=radixSort;},{}],43:[function(require,module,exports){/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */'use strict';var shaders={vertex:"#define GLSLIFY 1\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * Calculates transpose inverse matrix from transform\r\n * \r\n * @method random\r\n * @private\r\n *\r\n *\r\n */\r\n\r\n\r\nmat3 getNormalMatrix_1_0(in mat4 t) {\r\n   mat3 matNorm;\r\n   mat4 a = t;\r\n\r\n   float a00 = a[0][0], a01 = a[0][1], a02 = a[0][2], a03 = a[0][3],\r\n   a10 = a[1][0], a11 = a[1][1], a12 = a[1][2], a13 = a[1][3],\r\n   a20 = a[2][0], a21 = a[2][1], a22 = a[2][2], a23 = a[2][3],\r\n   a30 = a[3][0], a31 = a[3][1], a32 = a[3][2], a33 = a[3][3],\r\n   b00 = a00 * a11 - a01 * a10,\r\n   b01 = a00 * a12 - a02 * a10,\r\n   b02 = a00 * a13 - a03 * a10,\r\n   b03 = a01 * a12 - a02 * a11,\r\n   b04 = a01 * a13 - a03 * a11,\r\n   b05 = a02 * a13 - a03 * a12,\r\n   b06 = a20 * a31 - a21 * a30,\r\n   b07 = a20 * a32 - a22 * a30,\r\n   b08 = a20 * a33 - a23 * a30,\r\n   b09 = a21 * a32 - a22 * a31,\r\n   b10 = a21 * a33 - a23 * a31,\r\n   b11 = a22 * a33 - a23 * a32,\r\n\r\n   det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\r\n   det = 1.0 / det;\r\n\r\n   matNorm[0][0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;\r\n   matNorm[0][1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;\r\n   matNorm[0][2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;\r\n\r\n   matNorm[1][0] = (a02 * b10 - a01 * b11 - a03 * b09) * det;\r\n   matNorm[1][1] = (a00 * b11 - a02 * b08 + a03 * b07) * det;\r\n   matNorm[1][2] = (a01 * b08 - a00 * b10 - a03 * b06) * det;\r\n\r\n   matNorm[2][0] = (a31 * b05 - a32 * b04 + a33 * b03) * det;\r\n   matNorm[2][1] = (a32 * b02 - a30 * b05 - a33 * b01) * det;\r\n   matNorm[2][2] = (a30 * b04 - a31 * b02 + a33 * b00) * det;\r\n\r\n   return matNorm;\r\n}\r\n\r\n\n\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * Calculates a matrix that creates the identity when multiplied by m\r\n * \r\n * @method inverse\r\n * @private\r\n *\r\n *\r\n */\r\n\r\n\r\nfloat inverse_2_1(float m) {\r\n    return 1.0 / m;\r\n}\r\n\r\nmat2 inverse_2_1(mat2 m) {\r\n    return mat2(m[1][1],-m[0][1],\r\n               -m[1][0], m[0][0]) / (m[0][0]*m[1][1] - m[0][1]*m[1][0]);\r\n}\r\n\r\nmat3 inverse_2_1(mat3 m) {\r\n    float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];\r\n    float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];\r\n    float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];\r\n\r\n    float b01 =  a22 * a11 - a12 * a21;\r\n    float b11 = -a22 * a10 + a12 * a20;\r\n    float b21 =  a21 * a10 - a11 * a20;\r\n\r\n    float det = a00 * b01 + a01 * b11 + a02 * b21;\r\n\r\n    return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),\r\n                b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),\r\n                b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;\r\n}\r\n\r\nmat4 inverse_2_1(mat4 m) {\r\n    float\r\n        a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],\r\n        a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],\r\n        a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],\r\n        a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],\r\n\r\n        b00 = a00 * a11 - a01 * a10,\r\n        b01 = a00 * a12 - a02 * a10,\r\n        b02 = a00 * a13 - a03 * a10,\r\n        b03 = a01 * a12 - a02 * a11,\r\n        b04 = a01 * a13 - a03 * a11,\r\n        b05 = a02 * a13 - a03 * a12,\r\n        b06 = a20 * a31 - a21 * a30,\r\n        b07 = a20 * a32 - a22 * a30,\r\n        b08 = a20 * a33 - a23 * a30,\r\n        b09 = a21 * a32 - a22 * a31,\r\n        b10 = a21 * a33 - a23 * a31,\r\n        b11 = a22 * a33 - a23 * a32,\r\n\r\n        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\r\n\r\n    return mat4(\r\n        a11 * b11 - a12 * b10 + a13 * b09,\r\n        a02 * b10 - a01 * b11 - a03 * b09,\r\n        a31 * b05 - a32 * b04 + a33 * b03,\r\n        a22 * b04 - a21 * b05 - a23 * b03,\r\n        a12 * b08 - a10 * b11 - a13 * b07,\r\n        a00 * b11 - a02 * b08 + a03 * b07,\r\n        a32 * b02 - a30 * b05 - a33 * b01,\r\n        a20 * b05 - a22 * b02 + a23 * b01,\r\n        a10 * b10 - a11 * b08 + a13 * b06,\r\n        a01 * b08 - a00 * b10 - a03 * b06,\r\n        a30 * b04 - a31 * b02 + a33 * b00,\r\n        a21 * b02 - a20 * b04 - a23 * b00,\r\n        a11 * b07 - a10 * b09 - a12 * b06,\r\n        a00 * b09 - a01 * b07 + a02 * b06,\r\n        a31 * b01 - a30 * b03 - a32 * b00,\r\n        a20 * b03 - a21 * b01 + a22 * b00) / det;\r\n}\r\n\r\n\n\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * Reflects a matrix over its main diagonal.\r\n * \r\n * @method transpose\r\n * @private\r\n *\r\n *\r\n */\r\n\r\n\r\nfloat transpose_3_2(float m) {\r\n    return m;\r\n}\r\n\r\nmat2 transpose_3_2(mat2 m) {\r\n    return mat2(m[0][0], m[1][0],\r\n                m[0][1], m[1][1]);\r\n}\r\n\r\nmat3 transpose_3_2(mat3 m) {\r\n    return mat3(m[0][0], m[1][0], m[2][0],\r\n                m[0][1], m[1][1], m[2][1],\r\n                m[0][2], m[1][2], m[2][2]);\r\n}\r\n\r\nmat4 transpose_3_2(mat4 m) {\r\n    return mat4(m[0][0], m[1][0], m[2][0], m[3][0],\r\n                m[0][1], m[1][1], m[2][1], m[3][1],\r\n                m[0][2], m[1][2], m[2][2], m[3][2],\r\n                m[0][3], m[1][3], m[2][3], m[3][3]);\r\n}\r\n\r\n\n\n\r\n/**\r\n * Converts vertex from modelspace to screenspace using transform\r\n * information from context.\r\n *\r\n * @method applyTransform\r\n * @private\r\n *\r\n *\r\n */\r\n\r\nvec4 applyTransform(vec4 pos) {\r\n    //TODO: move this multiplication to application code. \r\n\r\n    /**\r\n     * Currently multiplied in the vertex shader to avoid consuming the complexity of holding an additional\r\n     * transform as state on the mesh object in WebGLRenderer. Multiplies the object's transformation from object space\r\n     * to world space with its transformation from world space to eye space.\r\n     */\r\n    mat4 MVMatrix = u_view * u_transform;\r\n\r\n    //TODO: move the origin, sizeScale and y axis inversion to application code in order to amortize redundant per-vertex calculations.\r\n\r\n    /**\r\n     * The transform uniform should be changed to the result of the transformation chain:\r\n     *\r\n     * view * modelTransform * invertYAxis * sizeScale * origin\r\n     *\r\n     * which could be simplified to:\r\n     *\r\n     * view * modelTransform * convertToDOMSpace\r\n     *\r\n     * where convertToDOMSpace represents the transform matrix:\r\n     *\r\n     *                           size.x 0       0       size.x \r\n     *                           0      -size.y 0       size.y\r\n     *                           0      0       1       0\r\n     *                           0      0       0       1\r\n     *\r\n     */\r\n\r\n    /**\r\n     * Assuming a unit volume, moves the object space origin [0, 0, 0] to the \"top left\" [1, -1, 0], the DOM space origin.\r\n     * Later in the transformation chain, the projection transform negates the rigidbody translation.\r\n     * Equivalent to (but much faster than) multiplying a translation matrix \"origin\"\r\n     *\r\n     *                           1 0 0 1 \r\n     *                           0 1 0 -1\r\n     *                           0 0 1 0\r\n     *                           0 0 0 1\r\n     *\r\n     * in the transform chain: projection * view * modelTransform * invertYAxis * sizeScale * origin * positionVector.\r\n     */\r\n    pos.x += 1.0;\r\n    pos.y -= 1.0;\r\n\r\n    /**\r\n     * Assuming a unit volume, scales an object to the amount of pixels in the size uniform vector's specified dimensions.\r\n     * Later in the transformation chain, the projection transform transforms the point into clip space by scaling\r\n     * by the inverse of the canvas' resolution.\r\n     * Equivalent to (but much faster than) multiplying a scale matrix \"sizeScale\"\r\n     *\r\n     *                           size.x 0      0      0 \r\n     *                           0      size.y 0      0\r\n     *                           0      0      size.z 0\r\n     *                           0      0      0      1\r\n     *\r\n     * in the transform chain: projection * view * modelTransform * invertYAxis * sizeScale * origin * positionVector.\r\n     */\r\n    pos.xyz *= u_size * 0.5;\r\n\r\n    /**\r\n     * Inverts the object space's y axis in order to match DOM space conventions. \r\n     * Later in the transformation chain, the projection transform reinverts the y axis to convert to clip space.\r\n     * Equivalent to (but much faster than) multiplying a scale matrix \"invertYAxis\"\r\n     *\r\n     *                           1 0 0 0 \r\n     *                           0 -1 0 0\r\n     *                           0 0 1 0\r\n     *                           0 0 0 1\r\n     *\r\n     * in the transform chain: projection * view * modelTransform * invertYAxis * sizeScale * origin * positionVector.\r\n     */\r\n    pos.y *= -1.0;\r\n\r\n    /**\r\n     * Exporting the vertex's position as a varying, in DOM space, to be used for lighting calculations. This has to be in DOM space\r\n     * since light position and direction is derived from the scene graph, calculated in DOM space.\r\n     */\r\n\r\n    v_position = (MVMatrix * pos).xyz;\r\n\r\n    /**\r\n    * Exporting the eye vector (a vector from the center of the screen) as a varying, to be used for lighting calculations.\r\n    * In clip space deriving the eye vector is a matter of simply taking the inverse of the position, as the position is a vector\r\n    * from the center of the screen. However, since our points are represented in DOM space,\r\n    * the position is a vector from the top left corner of the screen, so some additional math is needed (specifically, subtracting\r\n    * the position from the center of the screen, i.e. half the resolution of the canvas).\r\n    */\r\n\r\n    v_eyeVector = (u_resolution * 0.5) - v_position;\r\n\r\n    /**\r\n     * Transforming the position (currently represented in dom space) into view space (with our dom space view transform)\r\n     * and then projecting the point into raster both by applying a perspective transformation and converting to clip space\r\n     * (the perspective matrix is a combination of both transformations, therefore it's probably more apt to refer to it as a\r\n     * projection transform).\r\n     */\r\n\r\n    pos = u_perspective * MVMatrix * pos;\r\n\r\n    return pos;\r\n}\r\n\r\n/**\r\n * Placeholder for positionOffset chunks to be templated in.\r\n * Used for mesh deformation.\r\n *\r\n * @method calculateOffset\r\n * @private\r\n *\r\n *\r\n */\r\n#vert_definitions\r\nvec3 calculateOffset(vec3 ID) {\r\n    #vert_applications\r\n    return vec3(0.0);\r\n}\r\n\r\n/**\r\n * Writes the position of the vertex onto the screen.\r\n * Passes texture coordinate and normal attributes as varyings\r\n * and passes the position attribute through position pipeline.\r\n *\r\n * @method main\r\n * @private\r\n *\r\n *\r\n */\r\nvoid main() {\r\n    v_textureCoordinate = a_texCoord;\r\n    vec3 invertedNormals = a_normals + (u_normals.x < 0.0 ? calculateOffset(u_normals) * 2.0 - 1.0 : vec3(0.0));\r\n    invertedNormals.y *= -1.0;\r\n    v_normal = transpose_3_2(mat3(inverse_2_1(u_transform))) * invertedNormals;\r\n    vec3 offsetPos = a_pos + calculateOffset(u_positionOffset);\r\n    gl_Position = applyTransform(vec4(offsetPos, 1.0));\r\n}\r\n",fragment:"#define GLSLIFY 1\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * Placeholder for fragmentShader  chunks to be templated in.\r\n * Used for normal mapping, gloss mapping and colors.\r\n * \r\n * @method applyMaterial\r\n * @private\r\n *\r\n *\r\n */\r\n\r\n#float_definitions\r\nfloat applyMaterial_1_0(float ID) {\r\n    #float_applications\r\n    return 1.;\r\n}\r\n\r\n#vec3_definitions\r\nvec3 applyMaterial_1_0(vec3 ID) {\r\n    #vec3_applications\r\n    return vec3(0);\r\n}\r\n\r\n#vec4_definitions\r\nvec4 applyMaterial_1_0(vec4 ID) {\r\n    #vec4_applications\r\n\r\n    return vec4(0);\r\n}\r\n\r\n\n\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * Calculates the intensity of light on a surface.\r\n *\r\n * @method applyLight\r\n * @private\r\n *\r\n */\r\nvec4 applyLight_2_1(in vec4 baseColor, in vec3 normal, in vec4 glossiness, int numLights, vec3 ambientColor, vec3 eyeVector, mat4 lightPosition, mat4 lightColor, vec3 v_position) {\r\n    vec3 diffuse = vec3(0.0);\r\n    bool hasGlossiness = glossiness.a > 0.0;\r\n    bool hasSpecularColor = length(glossiness.rgb) > 0.0;\r\n\r\n    for(int i = 0; i < 4; i++) {\r\n        if (i >= numLights) break;\r\n        vec3 lightDirection = normalize(lightPosition[i].xyz - v_position);\r\n        float lambertian = max(dot(lightDirection, normal), 0.0);\r\n\r\n        if (lambertian > 0.0) {\r\n            diffuse += lightColor[i].rgb * baseColor.rgb * lambertian;\r\n            if (hasGlossiness) {\r\n                vec3 halfVector = normalize(lightDirection + eyeVector);\r\n                float specularWeight = pow(max(dot(halfVector, normal), 0.0), glossiness.a);\r\n                vec3 specularColor = hasSpecularColor ? glossiness.rgb : lightColor[i].rgb;\r\n                diffuse += specularColor * specularWeight * lambertian;\r\n            }\r\n        }\r\n\r\n    }\r\n\r\n    return vec4(ambientColor + diffuse, baseColor.a);\r\n}\r\n\r\n\n\n\r\n\r\n/**\r\n * Writes the color of the pixel onto the screen\r\n *\r\n * @method main\r\n * @private\r\n *\r\n *\r\n */\r\nvoid main() {\r\n    vec4 material = u_baseColor.r >= 0.0 ? u_baseColor : applyMaterial_1_0(u_baseColor);\r\n\r\n    /**\r\n     * Apply lights only if flat shading is false\r\n     * and at least one light is added to the scene\r\n     */\r\n    bool lightsEnabled = (u_flatShading == 0.0) && (u_numLights > 0.0 || length(u_ambientLight) > 0.0);\r\n\r\n    vec3 normal = normalize(v_normal);\r\n    vec4 glossiness = u_glossiness.x < 0.0 ? applyMaterial_1_0(u_glossiness) : u_glossiness;\r\n\r\n    vec4 color = lightsEnabled ?\r\n    applyLight_2_1(material, normalize(v_normal), glossiness,\r\n               int(u_numLights),\r\n               u_ambientLight * u_baseColor.rgb,\r\n               normalize(v_eyeVector),\r\n               u_lightPosition,\r\n               u_lightColor,   \r\n               v_position)\r\n    : material;\r\n\r\n    gl_FragColor = color;\r\n    gl_FragColor.a *= u_opacity;   \r\n}\r\n"};module.exports=shaders;},{}],44:[function(require,module,exports){'use strict';var Compositor=require('famous/renderers/Compositor');var UIManager=require('famous/renderers/UIManager');var Ajax=require('Ajax');var versionModel=require('model/VersionModel');var RequestAnimationFrameLoop=require('famous/render-loops/RequestAnimationFrameLoop');require("FastClick");var compositor;// var Ajax ;
document.addEventListener("deviceready",onDeviceReady,false);function onDeviceReady(){compositor=new Compositor();new UIManager(new Worker('./work.js'),compositor,new RequestAnimationFrameLoop());//回退功能
document.addEventListener("backbutton",onBackKeyDown,false);if(cordova.platformId=='android'){if(!versionModel.findOne()||!versionModel.findOne().cancel){setTimeout(function(){checkUpdate();},5000);}}else{setTimeout(function(){getAppVersion();},5000);}}// onDeviceReady();
//
function onBackKeyDown(){for(var selector in compositor._contexts){compositor.sendEvent(selector,'backbutton',{});}}//检测版本
function checkUpdate(){cordova.getAppVersion.getVersionNumber(function(v){// console.log(v);
new Ajax('/app_version/single').data({'did':device.uuid}).success(function(d){// console.log(d);
if(d.status===200){var data=d.data;var serverV=data.version.split('.')[2];var currentV=v.split('.')[2];if(currentV!==serverV){if(!versionModel.findOne()){versionModel.save({'path':data.path,'version':data.version});}else{versionModel.update({'version':data.version},{'path':data.path,'version':data.version});}navigator.notification.confirm('我们已发现新版本，是否先前往下载？',function(i){if(i==1){versionModel.update({'version':data.version},{'cancel':false});window.open(data.path);}else{//取消后再次进入不在提示
versionModel.update({'version':data.version},{'cancel':true});}},'检查更新',['确定','取消']);}}}).post();});}//获取版本号
function getAppVersion(){cordova.getAppVersion.getVersionNumber(function(v){if(!versionModel.findOne()){versionModel.save({'path':null,'version':v,'cancel':false});}else{versionModel.update({'version':v},{'path':null,'version':v,'cancel':false});}});}},{"Ajax":45,"FastClick":46,"famous/render-loops/RequestAnimationFrameLoop":23,"famous/renderers/Compositor":24,"famous/renderers/UIManager":26,"model/VersionModel":49}],45:[function(require,module,exports){var config=require('./config.json');// new Ajax('/xxx')  					只传url版本号之后的地址
// 	.config({timeout: 3000})	配置，timeout 超时时间，async 异步 默认true
// 	.router([])								路由参数，数组，只有一个可以传字符串
// 	.data({})									post参数
// 	.path({})									？之后参数
// 	.success(fn)							成功回调函数
// 	.error(fn)								失败回调函数
// 	.timeout(fn)							超时回掉函数
// .get();post();	put();delete();						最后 用 get / post 发送请求
function Ajax(url){if(typeof url!=='string')throw new Error('Ajax option error!');// 判断是否是完整地址 如果不是则加上
this.url=!~url.indexOf('http')?config.ajax_base+'/v'+config.version+url.replace(/^\/*/,'/'):url;}// Ajax 配置
Ajax.prototype.config=function(cfg){this.cfg=cfg;return this;};// Ajax 路径参数
Ajax.prototype.router=function(router){if(!router)throw new Error('Router参数错误，必须为数组或者字符串');if(router.constructor.name==='String')router='/'+router;else router='/'+router.join('/');var aUrl=this.url.split('?');this.url=aUrl[0].replace(/\/*$/,router);aUrl[1]&&(this.url=this.url+aUrl[1]);this.r=router;return this;};// Ajax data参数
Ajax.prototype.data=function(data){var sData=[];for(var i in data){sData.push(i+'='+data[i]);}sData='&'+sData.join('&');this.d=sData;return this;};// Ajax ?后面参数
Ajax.prototype.path=function(path){var sPath=[];for(var i in path){sPath.push(i+'='+path[i]);}sPath=sPath.join('&');if(!~this.url.indexOf('?'))this.url=this.url.replace(/\/*$/,'?'+sPath);else this.url=this.url.replace(/[&\/]*$/,'&'+sPath);this.p=sPath;return this;};// Ajax 成功回掉函数
Ajax.prototype.success=function(fn){if(!fn||typeof fn!=='function')throw new Error('成功回调函数格式错误!');this.s=fn;return this;};// Ajax 失败回掉函数
Ajax.prototype.error=function(fn){if(!fn||typeof fn!=='function')throw new Error('错误回调函数格式错误!');this.e=fn;return this;};// 超时回掉函数
Ajax.prototype.timeout=function(fn){if(!fn||typeof fn!=='function')throw new Error('超时回调函数格式错误!');this.t=fn;return this;};// get 请求
Ajax.prototype.get=function(){this.m='GET';this.exec();};// post 请求
Ajax.prototype.post=function(xx){this.m='POST';this.exec(xx);};// put 请求
Ajax.prototype.put=function(){this.m='PUT';this.exec();};// delete 请求
Ajax.prototype.delete=function(){this.m='DELETE';this.exec();};Ajax.prototype.exec=function(xx){this.cfg=this.cfg||{};var xhr=new XMLHttpRequest();// 超时默认3000毫秒
xhr.timeout=this.cfg.timeout||3000;// 异步  默认true
if(xx==false){this.async=false;}else{this.async=typeof this.cfg.async==='boolean'?this.cfg.async:true;}xhr.open(this.m,this.url,this.async);if(this.m==='GET')xhr.send(null);else{xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');xhr.send(this.d);}xhr.ontimeout=this.t;if(!this.async)callback(xhr,this);else xhr.onreadystatechange=function(){if(xhr.readyState===4)callback(xhr,this);}.bind(this);};function callback(xhr,obj){var result='';if(xhr.status==200){try{result=JSON.parse(xhr.response);}catch(e){result=xhr.response;}obj.s(result);}else obj.e&&obj.e(xhr);}module.exports=Ajax;},{"./config.json":48}],46:[function(require,module,exports){function FastClick(){var clickThreshold=300;var clickWindow=500;var potentialClicks={};var recentlyDispatched={};var _now=Date.now;document.body.addEventListener('touchstart',function(event){var timestamp=_now();for(var i=0;i<event.changedTouches.length;i++){var touch=event.changedTouches[i];potentialClicks[touch.identifier]=timestamp;}});document.body.addEventListener('touchmove',function(event){for(var i=0;i<event.changedTouches.length;i++){var touch=event.changedTouches[i];delete potentialClicks[touch.identifier];}});document.body.addEventListener('touchend',function(event){var currTime=_now();for(var i=0;i<event.changedTouches.length;i++){var touch=event.changedTouches[i];var startTime=potentialClicks[touch.identifier];if(startTime&&currTime-startTime<clickThreshold){var eventAttr={'screenX':0,'screenY':0,'clientX':0,'clientY':0,'ctrlKey':0,'shiftKey':0,'altKey':0,'metaKey':0,'button':0,'buttons':0,'pageX':0,'pageY':0,'x':0,'y':0,'offsetX':0,'offsetY':0};var clickEvt=new window.CustomEvent('click',{'bubbles':true,'detail':1});recentlyDispatched[currTime]=event;for(var k in eventAttr){event[k]?clickEvt[k]=event[k]:clickEvt[k]=eventAttr[k];}// console.log(11, event,clickEvt);
event.target.dispatchEvent(clickEvt);}//
delete potentialClicks[touch.identifier];}});document.body.addEventListener('click',function(event){var currTime=_now();for(var i in recentlyDispatched){var previousEvent=recentlyDispatched[i];if(currTime-i<clickWindow){// console.log(13, event,previousEvent,event instanceof window.MouseEvent , event.target == previousEvent.target);
//&& event.target == previousEvent.target
if(event instanceof window.MouseEvent){event.stopPropagation();// console.log(14, event,previousEvent);
delete recentlyDispatched[i];}}}},true);}module.exports=new FastClick();},{}],47:[function(require,module,exports){var CrossCall=require('famous/core/CrossCall');function webWorkerStorage(){this._storage={};var _this=this;this.cross=new CrossCall(function(){var obj={};for(var i in window.localStorage){obj[i]=window.localStorage.getItem(i);}return obj;});this.cross.exec(function(arg){_this._storage=arg;});}webWorkerStorage.prototype.constructor=webWorkerStorage;webWorkerStorage.prototype.getItem=function(arg){if(this._storage.hasOwnProperty(arg))return this._storage[arg];return null;};webWorkerStorage.prototype.removeItem=function(arg){delete this._storage[arg];this._callStorage("removeItem",[arg]);};webWorkerStorage.prototype.setItem=function(name,value){this._storage[name]=value;this._callStorage("setItem",[name,value]);};webWorkerStorage.prototype._callStorage=function(fun,arg){this.cross.setFun(function(name,arg){return window.localStorage[name].apply(window.localStorage,arg);},[fun,arg]).exec();};//压缩编译时可能会出现 localStorage 丢失现象
var localStorage=typeof self.localStorage!="undefined"?window.localStorage:new webWorkerStorage();var StorageModel=function(){function StorageModel(table,model){_classCallCheck(this,StorageModel);this._table=table;this._model=model;// 记录 model key值
this._keys=Object.keys(model);this.setStorage();}// 检测数据模型配置Storage
_createClass(StorageModel,[{key:"setStorage",value:function setStorage(){var _storageTable=localStorage.getItem(this._table);_storageTable=_storageTable?JSON.parse(_storageTable):{};// 判断数据库字段和设置字段是否一样,如果不一样则删除数据库该‘表’,待重新加入数据
if(Object.keys(_storageTable).toString()===this._keys.toString())return;//TODO  未知原因会导致清除所有缓存。 下一版本迭代之
//else localStorage.removeItem( this._table );
}// 查找 , 返回 Array 或者 null
},{key:"find",value:function find(opt){var _storageTable=localStorage.getItem(this._table);var result=[];if(!_storageTable)return null;_storageTable=JSON.parse(_storageTable);// 非条件查询 (没有带条件参数opt或者条件不是一个正常条件)
if(!opt||opt.constructor.name!=='Object'){for(var i=0,j=_storageTable[this._keys[0]].length;i<j;i++){var _result={};this._keys.forEach(function(val){return _result[val]=_storageTable[val][i];});result.push(_result);}}else// 先条件查询，再筛选
result=this._check(opt,this.find()).result;return result;}// 查询一条数据，返回 Object 或者 null
},{key:"findOne",value:function findOne(opt){var result=this.find(opt);if(result)return result[0];else return result;}// 添加数据, 在表中添加一条记录
},{key:"save",value:function save(value){var _storageTable=localStorage.getItem(this._table);_storageTable=_storageTable?JSON.parse(_storageTable):{};// 只针对model 中配置的key值字段进行添加，其他没有字段不添加，
// model 设置的字段如果value中没有默认设置为null
this._keys.forEach(function(val){_storageTable[val]=_storageTable[val]||[];_storageTable[val].push(val in value?value[val]:null);});localStorage.setItem(this._table,JSON.stringify(_storageTable));}// 修改操作，必须带参数和值
},{key:"update",value:function update(opt,value){if(!opt||!value||opt.constructor.name!=='Object'||value.constructor.name!=='Object')throw new Error('参数错误!');var result=this.find();if(!result)return;var checkResult=this._check(opt,result);checkResult.index.forEach(function(val){for(var i in value){i in result[val]&&(result[val][i]=value[i]);}});localStorage.setItem(this._table,JSON.stringify(this._format(result)));}// 删除, 不带条件全部删除
},{key:"remove",value:function remove(opt){if(!opt||opt.constructor.name!=='Object')localStorage.removeItem(this._table);else{var result=this.find();if(!result)return;localStorage.setItem(this._table,JSON.stringify(this._format(this._check(opt,result).notResult)));}}// 检测匹配对象 , 返回满足条件的对象数组 和满足条件的 index 数组 以及不满足条件的数组
},{key:"_check",value:function _check(opt,arr){var result=[];var $index=[];var notResult=[];arr.forEach(function(val,index){for(var i in opt){// 符合条件 >= <= != 等
if(opt[i]&&opt[i].constructor.name==='Object'){// TODO
}else if(val[i]!==opt[i]){notResult.push(val);return;}};$index.push(index);result.push(val);});return{result:result,index:$index,notResult:notResult};}// 格式化数组为储存对象
},{key:"_format",value:function _format(o){var result={};for(var i in this._keys){var _i=this._keys[i];result[_i]=[];o.forEach(function(v){return result[_i].push(v[_i]);});}return result;}}]);return StorageModel;}();module.exports=StorageModel;},{"famous/core/CrossCall":4}],48:[function(require,module,exports){module.exports={"version":1,"noticehttp":"http://api.qqn123.com/","ajax_base":"http://zyjcapp.qqn123.com",//内网
"webSocket":"ws://zyjcapp.qqn123.com/websocket"};},{}],49:[function(require,module,exports){var StorageModel=require('StorageModel');var VersionModel=new StorageModel('Version',{version:String,path:String,cancel:Boolean});module.exports=VersionModel;},{"StorageModel":47}]},{},[44]);
//# sourceMappingURL=index.js.map
