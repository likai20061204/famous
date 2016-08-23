"use strict";var _get=function get(object,property,receiver){if(object===null)object=Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc===undefined){var parent=Object.getPrototypeOf(object);if(parent===null){return undefined;}else{return get(parent,property,receiver);}}else if("value"in desc){return desc.value;}else{var getter=desc.get;if(getter===undefined){return undefined;}return getter.call(receiver);}};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f;}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e);},l,l.exports,e,t,n,r);}return n[o].exports;}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++){s(r[o]);}return s;})({1:[function(require,module,exports){/**
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
 */'use strict';var Position=require('./Position');/**
 * Align is a component designed to allow for smooth tweening
 * of the alignment of a node relative to its parent.
 *
 * @class Align
 * @augments Position
 *
 * @param {Node} node Node that the Align component will be attached to
 */function Align(node){Position.call(this,node);var initial=node.getAlign();this._x.set(initial[0]);this._y.set(initial[1]);this._z.set(initial[2]);}/**
 * Return the name of the Align component
 *
 * @method
 *
 * @return {String} Name of the component
 */Align.prototype.toString=function toString(){return'Align';};Align.prototype=Object.create(Position.prototype);Align.prototype.constructor=Align;/**
 * When the node this component is attached to updates, update the value
 * of the Node's align.
 *
 * @method
 *
 * @return {undefined} undefined
 */Align.prototype.update=function update(){this._node.setAlign(this._x.get(),this._y.get(),this._z.get());this._checkUpdate();};Align.prototype.onUpdate=Align.prototype.update;module.exports=Align;},{"./Position":4}],2:[function(require,module,exports){/**
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
 */Camera.prototype.onTransformChange=function onTransformChange(transform){var a=transform;this._viewDirty=true;if(!this._requestingUpdate){this._node.requestUpdate(this._id);this._requestingUpdate=true;}var a00=a[0],a01=a[1],a02=a[2],a03=a[3],a10=a[4],a11=a[5],a12=a[6],a13=a[7],a20=a[8],a21=a[9],a22=a[10],a23=a[11],a30=a[12],a31=a[13],a32=a[14],a33=a[15],b00=a00*a11-a01*a10,b01=a00*a12-a02*a10,b02=a00*a13-a03*a10,b03=a01*a12-a02*a11,b04=a01*a13-a03*a11,b05=a02*a13-a03*a12,b06=a20*a31-a21*a30,b07=a20*a32-a22*a30,b08=a20*a33-a23*a30,b09=a21*a32-a22*a31,b10=a21*a33-a23*a31,b11=a22*a33-a23*a32,det=1/(b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06);this._viewTransform[0]=(a11*b11-a12*b10+a13*b09)*det;this._viewTransform[1]=(a02*b10-a01*b11-a03*b09)*det;this._viewTransform[2]=(a31*b05-a32*b04+a33*b03)*det;this._viewTransform[3]=(a22*b04-a21*b05-a23*b03)*det;this._viewTransform[4]=(a12*b08-a10*b11-a13*b07)*det;this._viewTransform[5]=(a00*b11-a02*b08+a03*b07)*det;this._viewTransform[6]=(a32*b02-a30*b05-a33*b01)*det;this._viewTransform[7]=(a20*b05-a22*b02+a23*b01)*det;this._viewTransform[8]=(a10*b10-a11*b08+a13*b06)*det;this._viewTransform[9]=(a01*b08-a00*b10-a03*b06)*det;this._viewTransform[10]=(a30*b04-a31*b02+a33*b00)*det;this._viewTransform[11]=(a21*b02-a20*b04-a23*b00)*det;this._viewTransform[12]=(a11*b07-a10*b09-a12*b06)*det;this._viewTransform[13]=(a00*b09-a01*b07+a02*b06)*det;this._viewTransform[14]=(a31*b01-a30*b03-a32*b00)*det;this._viewTransform[15]=(a20*b03-a21*b01+a22*b00)*det;};module.exports=Camera;},{"../core/Commands":8}],3:[function(require,module,exports){/**
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
 */'use strict';var CallbackStore=require('../utilities/CallbackStore');var Vec2=require('../math/Vec2');var VEC_REGISTER=new Vec2();var gestures={drag:true,tap:true,rotate:true,pinch:true};/**
 * Component to manage gesture events. Will track 'pinch', 'rotate', 'tap', and 'drag' events, on an
 * as-requested basis.
 *
 * @class GestureHandler
 *
 * @param {Node} node The node with which to register the handler.
 * @param {Array} events An array of event objects specifying .event and .callback properties.
 */function GestureHandler(node,events){this.node=node;this.id=node.addComponent(this);this._events=new CallbackStore();this.last1=new Vec2();this.last2=new Vec2();this.delta1=new Vec2();this.delta2=new Vec2();this.velocity1=new Vec2();this.velocity2=new Vec2();this.dist=0;this.diff12=new Vec2();this.center=new Vec2();this.centerDelta=new Vec2();this.centerVelocity=new Vec2();this.pointer1={position:this.last1,delta:this.delta1,velocity:this.velocity1};this.pointer2={position:this.last2,delta:this.delta2,velocity:this.velocity2};this.event={status:null,time:0,pointers:[],center:this.center,centerDelta:this.centerDelta,centerVelocity:this.centerVelocity,points:0,current:0};this.trackedPointerIDs=[-1,-1];this.timeOfPointer=0;this.multiTap=0;this.mice=[];this.gestures=[];this.options={};this.trackedGestures={};var i;var len;if(events){for(i=0,len=events.length;i<len;i++){this.on(events[i],events[i].callback);}}node.addUIEvent('touchstart');node.addUIEvent('mousedown');node.addUIEvent('touchmove');node.addUIEvent('mousemove');node.addUIEvent('touchend');node.addUIEvent('mouseup');node.addUIEvent('mouseleave');}/**
 * onReceive fires when the node this component is attached to gets an event.
 *
 * @method
 *
 * @param {String} ev name of the event
 * @param {Object} payload data associated with the event
 *
 * @return {undefined} undefined
 */GestureHandler.prototype.onReceive=function onReceive(ev,payload){switch(ev){case'touchstart':case'mousedown':_processPointerStart.call(this,payload);break;case'touchmove':case'mousemove':_processPointerMove.call(this,payload);break;case'touchend':case'mouseup':_processPointerEnd.call(this,payload);break;case'mouseleave':_processMouseLeave.call(this,payload);break;default:break;}};/**
 * Return the name of the GestureHandler component
 *
 * @method
 *
 * @return {String} Name of the component
 */GestureHandler.prototype.toString=function toString(){return'GestureHandler';};/**
 * Register a callback to be invoked on an event.
 *
 * @method
 *
 * @param {Object|String} ev The event object or event name.
 * @param {Function} cb The callback
 *
 * @return {undefined} undefined
 */GestureHandler.prototype.on=function on(ev,cb){var gesture=ev.event||ev;if(gestures[gesture]){this.trackedGestures[gesture]=true;this.gestures.push(gesture);if(ev.event)this.options[gesture]=ev;this._events.on(gesture,cb);}};/**
 * Trigger gestures in the order they were requested, if they occurred.
 *
 * @method
 *
 * @return {undefined} undefined
 */GestureHandler.prototype.triggerGestures=function(){var payload=this.event;for(var i=0,len=this.gestures.length;i<len;i++){var gesture=this.gestures[i];switch(gesture){case'rotate':case'pinch':if(payload.points===2)this.trigger(gesture,payload);break;case'tap':if(payload.status==='start'){if(this.options.tap){var pts=this.options.tap.points||1;if(this.multiTap>=pts&&payload.points>=pts)this.trigger(gesture,payload);}else this.trigger(gesture,payload);}break;default:this.trigger(gesture,payload);break;}}};/**
 * Trigger the callback associated with an event, passing in a payload.
 *
 * @method trigger
 *
 * @param {String} ev The event name
 * @param {Object} payload The event payload
 *
 * @return {undefined} undefined
 */GestureHandler.prototype.trigger=function trigger(ev,payload){this._events.trigger(ev,payload);};/**
 * Process up to the first two touch/mouse move events. Exit out if the first two points are already being tracked.
 *
 * @method _processPointerStart
 * @private
 *
 * @param {Object} e The event object
 *
 * @return {undefined} undefined
 */function _processPointerStart(e){var t;if(!e.targetTouches){this.mice[0]=e;t=this.mice;e.identifier=1;}else t=e.targetTouches;if(t[0]&&t[1]&&this.trackedPointerIDs[0]===t[0].identifier&&this.trackedPointerIDs[1]===t[1].identifier){return;}this.event.time=Date.now();var threshold;var id;if(this.trackedPointerIDs[0]!==t[0].identifier){if(this.trackedGestures.tap){threshold=this.options.tap&&this.options.tap.threshold||250;if(this.event.time-this.timeOfPointer<threshold)this.event.taps++;else this.event.taps=1;this.timeOfPointer=this.event.time;this.multiTap=1;}this.event.current=1;this.event.points=1;id=t[0].identifier;this.trackedPointerIDs[0]=id;this.last1.set(t[0].pageX,t[0].pageY);this.velocity1.clear();this.delta1.clear();this.event.pointers.push(this.pointer1);}if(t[1]&&this.trackedPointerIDs[1]!==t[1].identifier){if(this.trackedGestures.tap){threshold=this.options.tap&&this.options.tap.threshold||250;if(this.event.time-this.timeOfPointer<threshold)this.multiTap=2;}this.event.current=2;this.event.points=2;id=t[1].identifier;this.trackedPointerIDs[1]=id;this.last2.set(t[1].pageX,t[1].pageY);this.velocity2.clear();this.delta2.clear();Vec2.add(this.last1,this.last2,this.center).scale(0.5);this.centerDelta.clear();this.centerVelocity.clear();Vec2.subtract(this.last2,this.last1,this.diff12);this.dist=this.diff12.length();if(this.trackedGestures.pinch){this.event.scale=this.event.scale||1;this.event.scaleDelta=0;this.event.scaleVelocity=0;}if(this.trackedGestures.rotate){this.event.rotation=this.event.rotation||0;this.event.rotationDelta=0;this.event.rotationVelocity=0;}this.event.pointers.push(this.pointer2);}this.event.status='start';if(this.event.points===1){this.center.copy(this.last1);this.centerDelta.clear();this.centerVelocity.clear();if(this.trackedGestures.pinch){this.event.scale=1;this.event.scaleDelta=0;this.event.scaleVelocity=0;}if(this.trackedGestures.rotate){this.event.rotation=0;this.event.rotationDelta=0;this.event.rotationVelocity=0;}}this.triggerGestures();}/**
 * Process up to the first two touch/mouse move events.
 *
 * @method _processPointerMove
 * @private
 *
 * @param {Object} e The event object.
 *
 * @return {undefined} undefined
 */function _processPointerMove(e){var t;if(!e.targetTouches){if(!this.event.current)return;this.mice[0]=e;t=this.mice;e.identifier=1;}else t=e.targetTouches;var time=Date.now();var dt=time-this.event.time;if(dt===0)return;var invDt=1000/dt;this.event.time=time;this.event.current=1;this.event.points=1;if(this.trackedPointerIDs[0]===t[0].identifier){VEC_REGISTER.set(t[0].pageX,t[0].pageY);Vec2.subtract(VEC_REGISTER,this.last1,this.delta1);Vec2.scale(this.delta1,invDt,this.velocity1);this.last1.copy(VEC_REGISTER);}if(t[1]){this.event.current=2;this.event.points=2;VEC_REGISTER.set(t[1].pageX,t[1].pageY);Vec2.subtract(VEC_REGISTER,this.last2,this.delta2);Vec2.scale(this.delta2,invDt,this.velocity2);this.last2.copy(VEC_REGISTER);Vec2.add(this.last1,this.last2,VEC_REGISTER).scale(0.5);Vec2.subtract(VEC_REGISTER,this.center,this.centerDelta);Vec2.add(this.velocity1,this.velocity2,this.centerVelocity).scale(0.5);this.center.copy(VEC_REGISTER);Vec2.subtract(this.last2,this.last1,VEC_REGISTER);if(this.trackedGestures.rotate){var dot=VEC_REGISTER.dot(this.diff12);var cross=VEC_REGISTER.cross(this.diff12);var theta=-Math.atan2(cross,dot);this.event.rotation+=theta;this.event.rotationDelta=theta;this.event.rotationVelocity=theta*invDt;}var dist=VEC_REGISTER.length();var scale=dist/this.dist;this.diff12.copy(VEC_REGISTER);this.dist=dist;if(this.trackedGestures.pinch){this.event.scale*=scale;scale-=1.0;this.event.scaleDelta=scale;this.event.scaleVelocity=scale*invDt;}}this.event.status='move';if(this.event.points===1){this.center.copy(this.last1);this.centerDelta.copy(this.delta1);this.centerVelocity.copy(this.velocity1);if(this.trackedGestures.pinch){this.event.scale=1;this.event.scaleDelta=0;this.event.scaleVelocity=0;}if(this.trackedGestures.rotate){this.event.rotation=0;this.event.rotationDelta=0;this.event.rotationVelocity=0;}}this.triggerGestures();}/**
 * Process up to the first two touch/mouse end events. Exit out if the two points being tracked are still active.
 *
 * @method _processPointerEnd
 * @private
 *
 * @param {Object} e The event object
 *
 * @return {undefined} undefined
 */function _processPointerEnd(e){var t;if(!e.targetTouches){if(!this.event.current)return;this.mice.pop();t=this.mice;}else t=e.targetTouches;if(t[0]&&t[1]&&this.trackedPointerIDs[0]===t[0].identifier&&this.trackedPointerIDs[1]===t[1].identifier){return;}var id;this.event.status='end';if(!t[0]){this.event.current=0;this.trackedPointerIDs[0]=-1;this.trackedPointerIDs[1]=-1;this.triggerGestures();this.event.pointers.pop();this.event.pointers.pop();return;}else if(this.trackedPointerIDs[0]!==t[0].identifier){this.trackedPointerIDs[0]=-1;id=t[0].identifier;this.trackedPointerIDs[0]=id;this.last1.set(t[0].pageX,t[0].pageY);this.velocity1.clear();this.delta1.clear();}if(!t[1]){this.event.current=1;this.trackedPointerIDs[1]=-1;this.triggerGestures();this.event.points=1;this.event.pointers.pop();}else if(this.trackedPointerIDs[1]!==t[1].identifier){this.trackedPointerIDs[1]=-1;this.event.points=2;id=t[1].identifier;this.trackedPointerIDs[1]=id;this.last2.set(t[1].pageX,t[1].pageY);this.velocity2.clear();this.delta2.clear();Vec2.add(this.last1,this.last2,this.center).scale(0.5);this.centerDelta.clear();this.centerVelocity.clear();Vec2.subtract(this.last2,this.last1,this.diff12);this.dist=this.diff12.length();}}/**
 * Treats a mouseleave event as a gesture end.
 *
 * @method _processMouseLeave
 * @private
 *
 * @return {undefined} undefined
 */function _processMouseLeave(){if(this.event.current){this.event.status='end';this.event.current=0;this.trackedPointerIDs[0]=-1;this.triggerGestures();this.event.pointers.pop();}}module.exports=GestureHandler;},{"../math/Vec2":37,"../utilities/CallbackStore":47}],4:[function(require,module,exports){/**
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
 */'use strict';var Transitionable=require('../transitions/Transitionable');/**
 * The Position component serves as a way to tween to translation of a Node.
 *  It is also the base class for the other core components that interact
 * with the Vec3 properties on the Node
 *
 * @class Position
 *
 * @param {Node} node Node that the Position component will be attached to
 */function Position(node){this._node=node;this._id=node.addComponent(this);this._requestingUpdate=false;var initialPosition=node.getPosition();this._x=new Transitionable(initialPosition[0]);this._y=new Transitionable(initialPosition[1]);this._z=new Transitionable(initialPosition[2]);}/**
 * Return the name of the Position component
 *
 * @method
 *
 * @return {String} Name of the component
 */Position.prototype.toString=function toString(){return'Position';};/**
 * Gets object containing stringified constructor, and corresponding dimensional values
 *
 * @method
 *
 * @return {Object} the internal state of the component
 */Position.prototype.getValue=function getValue(){return{component:this.toString(),x:this._x.get(),y:this._y.get(),z:this._z.get()};};/**
 * Set the translation of the Node
 *
 * @method
 *
 * @param {Object} state Object -- component: stringified constructor, x: number, y: number, z: number
 *
 * @return {Boolean} status of the set
 */Position.prototype.setValue=function setValue(state){if(this.toString()===state.component){this.set(state.x,state.y,state.z);return true;}return false;};/**
 * Getter for X translation
 *
 * @method
 *
 * @return {Number} the Node's translation along its x-axis
 */Position.prototype.getX=function getX(){return this._x.get();};/**
 * Getter for Y translation
 *
 * @method
 *
 * @return {Number} the Node's translation along its Y-axis
 */Position.prototype.getY=function getY(){return this._y.get();};/**
 * Getter for z translation
 *
 * @method
 *
 * @return {Number} the Node's translation along its z-axis
 */Position.prototype.getZ=function getZ(){return this._z.get();};/**
 * Whether or not the Position is currently changing
 *
 * @method
 *
 * @return {Boolean} whether or not the Position is changing the Node's position
 */Position.prototype.isActive=function isActive(){return this._x.isActive()||this._y.isActive()||this._z.isActive();};/**
 * Decide whether the component needs to be updated on the next tick.
 *
 * @method
 * @private
 *
 * @return {undefined} undefined
 */Position.prototype._checkUpdate=function _checkUpdate(){if(this.isActive())this._node.requestUpdateOnNextTick(this._id);else this._requestingUpdate=false;};/**
 * When the node this component is attached to updates, update the value
 * of the Node's position
 *
 * @method
 *
 * @return {undefined} undefined
 */Position.prototype.update=function update(){this._node.setPosition(this._x.get(),this._y.get(),this._z.get());this._checkUpdate();};Position.prototype.onUpdate=Position.prototype.update;/** 
 * Setter for X position
 *
 * @method
 * 
 * @param {Number} val used to set x coordinate
 * @param {Object} transition options for the transition
 * @param {Function} callback function to execute after setting X 
 *
 * @return {Position} this
 */Position.prototype.setX=function setX(val,transition,callback){if(!this._requestingUpdate){this._node.requestUpdate(this._id);this._requestingUpdate=true;}this._x.set(val,transition,callback);return this;};/** 
 * Setter for Y position
 *
 * @method
 * 
 * @param {Number} val used to set y coordinate
 * @param {Object} transition options for the transition
 * @param {Function} callback function to execute after setting Y 
 *
 * @return {Position} this
 */Position.prototype.setY=function setY(val,transition,callback){if(!this._requestingUpdate){this._node.requestUpdate(this._id);this._requestingUpdate=true;}this._y.set(val,transition,callback);return this;};/** 
 * Setter for Z position
 *
 * @method
 * 
 * @param {Number} val used to set z coordinate
 * @param {Object} transition options for the transition
 * @param {Function} callback function to execute after setting Z 
 *
 * @return {Position} this
 */Position.prototype.setZ=function setZ(val,transition,callback){if(!this._requestingUpdate){this._node.requestUpdate(this._id);this._requestingUpdate=true;}this._z.set(val,transition,callback);return this;};/** 
 * Setter for X, Y, and Z positions
 *
 * @method
 * 
 * @param {Number} x used to set x coordinate
 * @param {Number} y used to set y coordinate
 * @param {Number} z used to set z coordinate
 * @param {Object} transition options for the transition
 * @param {Function} callback function to execute after setting X 
 *
 * @return {Position} this
 */Position.prototype.set=function set(x,y,z,transition,callback){if(!this._requestingUpdate){this._node.requestUpdate(this._id);this._requestingUpdate=true;}var xCallback;var yCallback;var zCallback;if(z!=null){zCallback=callback;}else if(y!=null){yCallback=callback;}else if(x!=null){xCallback=callback;}if(x!=null)this._x.set(x,transition,xCallback);if(y!=null)this._y.set(y,transition,yCallback);if(z!=null)this._z.set(z,transition,zCallback);return this;};/**
 * Stops transition of Position component
 *
 * @method
 *
 * @return {Position} this
 */Position.prototype.halt=function halt(){this._x.halt();this._y.halt();this._z.halt();return this;};module.exports=Position;},{"../transitions/Transitionable":46}],5:[function(require,module,exports){'use strict';var Commands=require("./Commands");/**
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
this.fun=eval("("+this.fun+")");var res=this.fun.apply(this,this.arg);if(typeof res!="undefined")self._call(res);};funCaller.prototype._call=function(arg){this.chan._push({id:this.id,res:arg});};module.exports=new Chan();},{"./Commands":8}],6:[function(require,module,exports){/**
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
 * Channels are being used for interacting with the UI Thread when running in
 * a Web Worker or with the UIManager/ Compositor when running in single
 * threaded mode (no Web Worker).
 *
 * @class Channel
 * @constructor
 */function Channel(){if(typeof self!=='undefined'&&self.window!==self){this._enterWorkerMode();}}/**
 * Called during construction. Subscribes for `message` event and routes all
 * future `sendMessage` messages to the Main Thread ("UI Thread").
 *
 * Primarily used for testing.
 *
 * @method
 *
 * @return {undefined} undefined
 */Channel.prototype._enterWorkerMode=function _enterWorkerMode(){this._workerMode=true;var _this=this;self.addEventListener('message',function onmessage(ev){_this.onMessage(ev.data);});};/**
 * Meant to be overridden by `Famous`.
 * Assigned method will be invoked for every received message.
 *
 * @type {Function}
 * @override
 *
 * @return {undefined} undefined
 */Channel.prototype.onMessage=null;/**
 * Sends a message to the UIManager.
 *
 * @param  {Any}    message Arbitrary message object.
 *
 * @return {undefined} undefined
 */Channel.prototype.sendMessage=function sendMessage(message){if(this._workerMode){self.postMessage(message);}else{this.onmessage(message);}};/**
 * Meant to be overriden by the UIManager when running in the UI Thread.
 * Used for preserving API compatibility with Web Workers.
 * When running in Web Worker mode, this property won't be mutated.
 *
 * Assigned method will be invoked for every message posted by `famous-core`.
 *
 * @type {Function}
 * @override
 */Channel.prototype.onmessage=null;/**
 * Sends a message to the manager of this channel (the `Famous` singleton) by
 * invoking `onMessage`.
 * Used for preserving API compatibility with Web Workers.
 *
 * @private
 * @alias onMessage
 *
 * @param {Any} message a message to send over the channel
 *
 * @return {undefined} undefined
 */Channel.prototype.postMessage=function postMessage(message){return this.onMessage(message);};module.exports=Channel;},{}],7:[function(require,module,exports){/**
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
 * Equivalent of an Engine in the Worker Thread. Used to synchronize and manage
 * time across different Threads.
 *
 * @class  Clock
 * @constructor
 * @private
 */function Clock(){this._time=0;this._frame=0;this._timerQueue=[];this._updatingIndex=0;this._scale=1;this._scaledTime=this._time;}/**
 * Sets the scale at which the clock time is passing.
 * Useful for slow-motion or fast-forward effects.
 *
 * `1` means no time scaling ("realtime"),
 * `2` means the clock time is passing twice as fast,
 * `0.5` means the clock time is passing two times slower than the "actual"
 * time at which the Clock is being updated via `.step`.
 *
 * Initally the clock time is not being scaled (factor `1`).
 *
 * @method  setScale
 * @chainable
 *
 * @param {Number} scale    The scale at which the clock time is passing.
 *
 * @return {Clock} this
 */Clock.prototype.setScale=function setScale(scale){this._scale=scale;return this;};/**
 * @method  getScale
 *
 * @return {Number} scale    The scale at which the clock time is passing.
 */Clock.prototype.getScale=function getScale(){return this._scale;};/**
 * Updates the internal clock time.
 *
 * @method  step
 * @chainable
 *
 * @param  {Number} time high resolution timestamp used for invoking the
 *                       `update` method on all registered objects
 * @return {Clock}       this
 */Clock.prototype.step=function step(time){this._frame++;this._scaledTime=this._scaledTime+(time-this._time)*this._scale;this._time=time;for(var i=0;i<this._timerQueue.length;i++){if(this._timerQueue[i](this._scaledTime)){this._timerQueue.splice(i,1);}}return this;};/**
 * Returns the internal clock time.
 *
 * @method  now
 *
 * @return  {Number} time high resolution timestamp used for invoking the
 *                       `update` method on all registered objects
 */Clock.prototype.now=function now(){return this._scaledTime;};/**
 * Returns the internal clock time.
 *
 * @method  getTime
 * @deprecated Use #now instead
 *
 * @return  {Number} time high resolution timestamp used for invoking the
 *                       `update` method on all registered objects
 */Clock.prototype.getTime=Clock.prototype.now;/**
 * Returns the number of frames elapsed so far.
 *
 * @method getFrame
 *
 * @return {Number} frames
 */Clock.prototype.getFrame=function getFrame(){return this._frame;};/**
 * Wraps a function to be invoked after a certain amount of time.
 * After a set duration has passed, it executes the function and
 * removes it as a listener to 'prerender'.
 *
 * @method setTimeout
 *
 * @param {Function} callback function to be run after a specified duration
 * @param {Number} delay milliseconds from now to execute the function
 *
 * @return {Function} timer function used for Clock#clearTimer
 */Clock.prototype.setTimeout=function(callback,delay){var params=Array.prototype.slice.call(arguments,2);var startedAt=this._time;var timer=function timer(time){if(time-startedAt>=delay){callback.apply(null,params);return true;}return false;};this._timerQueue.push(timer);return timer;};/**
 * Wraps a function to be invoked after a certain amount of time.
 *  After a set duration has passed, it executes the function and
 *  resets the execution time.
 *
 * @method setInterval
 *
 * @param {Function} callback function to be run after a specified duration
 * @param {Number} delay interval to execute function in milliseconds
 *
 * @return {Function} timer function used for Clock#clearTimer
 */Clock.prototype.setInterval=function setInterval(callback,delay){var params=Array.prototype.slice.call(arguments,2);var startedAt=this._time;var timer=function timer(time){if(time-startedAt>=delay){callback.apply(null,params);startedAt=time;}return false;};this._timerQueue.push(timer);return timer;};/**
 * Removes previously via `Clock#setTimeout` or `Clock#setInterval`
 * registered callback function
 *
 * @method clearTimer
 * @chainable
 *
 * @param  {Function} timer  previously by `Clock#setTimeout` or
 *                              `Clock#setInterval` returned callback function
 * @return {Clock}              this
 */Clock.prototype.clearTimer=function(timer){var index=this._timerQueue.indexOf(timer);if(index!==-1){this._timerQueue.splice(index,1);}return this;};module.exports=Clock;},{}],8:[function(require,module,exports){/**
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
 */var Commands={INIT_DOM:0,DOM_RENDER_SIZE:1,CHANGE_TRANSFORM:2,CHANGE_SIZE:3,CHANGE_PROPERTY:4,CHANGE_CONTENT:5,CHANGE_ATTRIBUTE:6,ADD_CLASS:7,REMOVE_CLASS:8,SUBSCRIBE:9,GL_SET_DRAW_OPTIONS:10,GL_AMBIENT_LIGHT:11,GL_LIGHT_POSITION:12,GL_LIGHT_COLOR:13,MATERIAL_INPUT:14,GL_SET_GEOMETRY:15,GL_UNIFORMS:16,GL_BUFFER_DATA:17,GL_CUTOUT_STATE:18,GL_MESH_VISIBILITY:19,GL_REMOVE_MESH:20,PINHOLE_PROJECTION:21,ORTHOGRAPHIC_PROJECTION:22,CHANGE_VIEW_TRANSFORM:23,WITH:24,FRAME:25,ENGINE:26,START:27,STOP:28,TIME:29,TRIGGER:30,NEED_SIZE_FOR:31,DOM:32,READY:33,ALLOW_DEFAULT:34,PREVENT_DEFAULT:35,UNSUBSCRIBE:36,CROSS_THREAD:37,prettyPrint:function prettyPrint(buffer,start,count){var callback;start=start?start:0;var data={i:start,result:''};for(var len=count?count+start:buffer.length;data.i<len;data.i++){callback=commandPrinters[buffer[data.i]];if(!callback)throw new Error('PARSE ERROR: no command registered for: '+buffer[data.i]);callback(buffer,data);}return data.result;}};var commandPrinters=[];commandPrinters[Commands.INIT_DOM]=function init_dom(buffer,data){data.result+=data.i+'. INIT_DOM\n    tagName: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.DOM_RENDER_SIZE]=function dom_render_size(buffer,data){data.result+=data.i+'. DOM_RENDER_SIZE\n    selector: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.CHANGE_TRANSFORM]=function change_transform(buffer,data){data.result+=data.i+'. CHANGE_TRANSFORM\n    val: [';for(var j=0;j<16;j++){data.result+=buffer[++data.i]+(j<15?', ':'');}data.result+=']\n\n';};commandPrinters[Commands.CHANGE_SIZE]=function change_size(buffer,data){data.result+=data.i+'. CHANGE_SIZE\n    x: '+buffer[++data.i]+', y: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.CHANGE_PROPERTY]=function change_property(buffer,data){data.result+=data.i+'. CHANGE_PROPERTY\n    key: '+buffer[++data.i]+', value: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.CHANGE_CONTENT]=function change_content(buffer,data){data.result+=data.i+'. CHANGE_CONTENT\n    content: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.CHANGE_ATTRIBUTE]=function change_attribute(buffer,data){data.result+=data.i+'. CHANGE_ATTRIBUTE\n    key: '+buffer[++data.i]+', value: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.ADD_CLASS]=function add_class(buffer,data){data.result+=data.i+'. ADD_CLASS\n    className: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.REMOVE_CLASS]=function remove_class(buffer,data){data.result+=data.i+'. REMOVE_CLASS\n    className: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.SUBSCRIBE]=function subscribe(buffer,data){data.result+=data.i+'. SUBSCRIBE\n    event: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_SET_DRAW_OPTIONS]=function gl_set_draw_options(buffer,data){data.result+=data.i+'. GL_SET_DRAW_OPTIONS\n    options: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_AMBIENT_LIGHT]=function gl_ambient_light(buffer,data){data.result+=data.i+'. GL_AMBIENT_LIGHT\n    r: '+buffer[++data.i]+'g: '+buffer[++data.i]+'b: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_LIGHT_POSITION]=function gl_light_position(buffer,data){data.result+=data.i+'. GL_LIGHT_POSITION\n    x: '+buffer[++data.i]+'y: '+buffer[++data.i]+'z: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_LIGHT_COLOR]=function gl_light_color(buffer,data){data.result+=data.i+'. GL_LIGHT_COLOR\n    r: '+buffer[++data.i]+'g: '+buffer[++data.i]+'b: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.MATERIAL_INPUT]=function material_input(buffer,data){data.result+=data.i+'. MATERIAL_INPUT\n    key: '+buffer[++data.i]+', value: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_SET_GEOMETRY]=function gl_set_geometry(buffer,data){data.result+=data.i+'. GL_SET_GEOMETRY\n   x: '+buffer[++data.i]+', y: '+buffer[++data.i]+', z: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_UNIFORMS]=function gl_uniforms(buffer,data){data.result+=data.i+'. GL_UNIFORMS\n    key: '+buffer[++data.i]+', value: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_BUFFER_DATA]=function gl_buffer_data(buffer,data){data.result+=data.i+'. GL_BUFFER_DATA\n    data: ';for(var i=0;i<5;i++){data.result+=buffer[++data.i]+', ';}data.result+='\n\n';};commandPrinters[Commands.GL_CUTOUT_STATE]=function gl_cutout_state(buffer,data){data.result+=data.i+'. GL_CUTOUT_STATE\n    state: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_MESH_VISIBILITY]=function gl_mesh_visibility(buffer,data){data.result+=data.i+'. GL_MESH_VISIBILITY\n    visibility: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.GL_REMOVE_MESH]=function gl_remove_mesh(buffer,data){data.result+=data.i+'. GL_REMOVE_MESH\n\n';};commandPrinters[Commands.PINHOLE_PROJECTION]=function pinhole_projection(buffer,data){data.result+=data.i+'. PINHOLE_PROJECTION\n    depth: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.ORTHOGRAPHIC_PROJECTION]=function orthographic_projection(buffer,data){data.result+=data.i+'. ORTHOGRAPHIC_PROJECTION\n';};commandPrinters[Commands.CHANGE_VIEW_TRANSFORM]=function change_view_transform(buffer,data){data.result+=data.i+'. CHANGE_VIEW_TRANSFORM\n   value: [';for(var i=0;i<16;i++){data.result+=buffer[++data.i]+(i<15?', ':'');}data.result+=']\n\n';};commandPrinters[Commands.PREVENT_DEFAULT]=function prevent_default(buffer,data){data.result+=data.i+'. PREVENT_DEFAULT\n    value: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.ALLOW_DEFAULT]=function allow_default(buffer,data){data.result+=data.i+'. ALLOW_DEFAULT\n    value: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.READY]=function ready(buffer,data){data.result+=data.i+'. READY\n\n';};commandPrinters[Commands.WITH]=function w(buffer,data){data.result+=data.i+'. **WITH**\n     path: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.TIME]=function time(buffer,data){data.result+=data.i+'. TIME\n     ms: '+buffer[++data.i]+'\n\n';};commandPrinters[Commands.NEED_SIZE_FOR]=function need_size_for(buffer,data){data.result+=data.i+'. NEED_SIZE_FOR\n    selector: '+buffer[++data.i]+'\n\n';};module.exports=Commands;},{}],9:[function(require,module,exports){'use strict';var Chan=require("./Chan");/**
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
 */CrossCall.prototype.exec=function(fun){Chan.add(this._fun,fun,this._param);};module.exports=CrossCall;},{"./Chan":5}],10:[function(require,module,exports){/**
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
 */'use strict';var Event=require('./Event');var PathUtils=require('./Path');/**
 * The Dispatch class is used to propogate events down the
 * scene graph.
 *
 * @class Dispatch
 * @param {Scene} context The context on which it operates
 * @constructor
 */function Dispatch(){this._nodes={};// a container for constant time lookup of nodes
this._queue=[];// The queue is used for two purposes
// 1. It is used to list indicies in the
//    Nodes path which are then used to lookup
//    a node in the scene graph.
// 2. It is used to assist dispatching
//    such that it is possible to do a breadth first
//    traversal of the scene graph.
}/**
 * Protected method that sets the updater for the dispatch. The updater will
 * almost certainly be the FamousEngine class.
 *
 * @method
 * @protected
 *
 * @param {FamousEngine} updater The updater which will be passed through the scene graph
 *
 * @return {undefined} undefined
 */Dispatch.prototype._setUpdater=function _setUpdater(updater){this._updater=updater;for(var key in this._nodes){this._nodes[key]._setUpdater(updater);}};/**
 * Enque the children of a node within the dispatcher. Does not clear
 * the dispatchers queue first.
 *
 * @method addChildrenToQueue
 * @return {void}
 *
 * @param {Node} node from which to add children to the queue
 */Dispatch.prototype.addChildrenToQueue=function addChildrenToQueue(node){var children=node.getChildren();var child;for(var i=0,len=children.length;i<len;i++){child=children[i];if(child)this._queue.push(child);}};/**
 * Returns the next item in the Dispatch's queue.
 *
 * @method next
 * @return {Node} next node in the queue
 */Dispatch.prototype.next=function next(){return this._queue.shift();};/**
 * Returns the next node in the queue, but also adds its children to
 * the end of the queue. Continually calling this method will result
 * in a breadth first traversal of the render tree.
 *
 * @method breadthFirstNext
 * @return {Node | undefined} the next node in the traversal if one exists
 */Dispatch.prototype.breadthFirstNext=function breadthFirstNext(){var child=this._queue.shift();if(!child)return void 0;this.addChildrenToQueue(child);return child;};/**
 * Calls the onMount method for the node at a given path and
 * properly registers all of that nodes children to their proper
 * paths. Throws if that path doesn't have a node registered as
 * a parent or if there is no node registered at that path.
 *
 * @method mount
 *
 * @param {String} path at which to begin mounting
 * @param {Node} node the node that was mounted
 *
 * @return {void}
 */Dispatch.prototype.mount=function mount(path,node){if(!node)throw new Error('Dispatch: no node passed to mount at: '+path);if(this._nodes[path])throw new Error('Dispatch: there is a node already registered at: '+path);node._setUpdater(this._updater);this._nodes[path]=node;var parentPath=PathUtils.parent(path);// scenes are their own parents
var parent=!parentPath?node:this._nodes[parentPath];if(!parent)throw new Error('Parent to path: '+path+' doesn\'t exist at expected path: '+parentPath);var children=node.getChildren();var components=node.getComponents();var i;var len;if(parent.isMounted())node._setMounted(true,path);if(parent.isShown())node._setShown(true);if(parent.isMounted()){node._setParent(parent);if(node.onMount)node.onMount(path);for(i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onMount)components[i].onMount(node,i);}for(i=0,len=children.length;i<len;i++){if(children[i]&&children[i].mount)children[i].mount(path+'/'+i);else if(children[i])this.mount(path+'/'+i,children[i]);}}if(parent.isShown()){if(node.onShow)node.onShow();for(i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onShow)components[i].onShow();}}};/**
 * Calls the onDismount method for the node at a given path
 * and deregisters all of that nodes children. Throws if there
 * is no node registered at that path.
 *
 * @method dismount
 * @return {void}
 *
 * @param {String} path at which to begin dismounting
 */Dispatch.prototype.dismount=function dismount(path){var node=this._nodes[path];if(!node)throw new Error('No node registered to path: '+path);var children=node.getRawChildren();var components=node.getComponents();var i;var len;if(node.isShown()){node._setShown(false);if(node.onHide)node.onHide();for(i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onHide)components[i].onHide();}}if(node.isMounted()){if(node.onDismount)node.onDismount(path);for(i=0,len=children.length;i<len;i++){if(children[i]&&children[i].dismount)children[i].dismount();else if(children[i])this.dismount(path+'/'+i);}for(i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onDismount)components[i].onDismount();}node._setMounted(false);node._setParent(null);}this._nodes[path]=null;};/**
 * Returns a the node registered to the given path, or none
 * if no node exists at that path.
 *
 * @method getNode
 * @return {Node | void} node at the given path
 *
 * @param {String} path at which to look up the node
 */Dispatch.prototype.getNode=function getNode(path){return this._nodes[path];};/**
 * Issues the onShow method to the node registered at the given path,
 * and shows the entire subtree below that node. Throws if no node
 * is registered to this path.
 *
 * @method show
 * @return {void}
 *
 * @param {String} path the path of the node to show
 */Dispatch.prototype.show=function show(path){var node=this._nodes[path];if(!node)throw new Error('No node registered to path: '+path);if(node.onShow)node.onShow();var components=node.getComponents();for(var i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onShow)components[i].onShow();}this.addChildrenToQueue(node);var child;while(child=this.breadthFirstNext()){this.show(child.getLocation());}};/**
 * Issues the onHide method to the node registered at the given path,
 * and hides the entire subtree below that node. Throws if no node
 * is registered to this path.
 *
 * @method hide
 * @return {void}
 *
 * @param {String} path the path of the node to hide
 */Dispatch.prototype.hide=function hide(path){var node=this._nodes[path];if(!node)throw new Error('No node registered to path: '+path);if(node.onHide)node.onHide();var components=node.getComponents();for(var i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onHide)components[i].onHide();}this.addChildrenToQueue(node);var child;while(child=this.breadthFirstNext()){this.hide(child.getLocation());}};/**
 * lookupNode takes a path and returns the node at the location specified
 * by the path, if one exists. If not, it returns undefined.
 *
 * @param {String} location The location of the node specified by its path
 *
 * @return {Node | undefined} The node at the requested path
 */Dispatch.prototype.lookupNode=function lookupNode(location){if(!location)throw new Error('lookupNode must be called with a path');this._queue.length=0;var path=this._queue;_splitTo(location,path);for(var i=0,len=path.length;i<len;i++){path[i]=this._nodes[path[i]];}return path[path.length-1];};/**
 * dispatch takes an event name and a payload and dispatches it to the
 * entire scene graph below the node that the dispatcher is on. The nodes
 * receive the events in a breadth first traversal, meaning that parents
 * have the opportunity to react to the event before children.
 *
 * @param {String} path path of the node to send the event to
 * @param {String} event name of the event
 * @param {Any} payload data associated with the event
 *
 * @return {undefined} undefined
 */Dispatch.prototype.dispatch=function dispatch(path,event,payload){if(!path)throw new Error('dispatch requires a path as it\'s first argument');if(!event)throw new Error('dispatch requires an event name as it\'s second argument');var node=this._nodes[path];if(!node)return;this.addChildrenToQueue(node);var child;while(child=this.breadthFirstNext()){if(child&&child.onReceive)child.onReceive(event,payload);}};/**
 * dispatchUIevent takes a path, an event name, and a payload and dispatches them in
 * a manner anologous to DOM bubbling. It first traverses down to the node specified at
 * the path. That node receives the event first, and then every ancestor receives the event
 * until the context.
 *
 * @param {String} path the path of the node
 * @param {String} event the event name
 * @param {Any} payload the payload
 *
 * @return {undefined} undefined
 */Dispatch.prototype.dispatchUIEvent=function dispatchUIEvent(path,event,payload){if(!path)throw new Error('dispatchUIEvent needs a valid path to dispatch to');if(!event)throw new Error('dispatchUIEvent needs an event name as its second argument');var node;Event.call(payload);node=this.getNode(path);if(node){var parent;var components;var i;var len;payload.node=node;while(node){if(node.onReceive)node.onReceive(event,payload);components=node.getComponents();for(i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onReceive)components[i].onReceive(event,payload);}if(payload.propagationStopped)break;parent=node.getParent();if(parent===node)return;node=parent;}}};/**
 * _splitTo is a private method which takes a path and splits it at every '/'
 * pushing the result into the supplied array. This is a destructive change.
 *
 * @private
 * @param {String} string the specified path
 * @param {Array} target the array to which the result should be written
 *
 * @return {Array} the target after having been written to
 */function _splitTo(string,target){target.length=0;// clears the array first.
var last=0;var i;var len=string.length;for(i=0;i<len;i++){if(string[i]==='/'){target.push(string.substring(last,i));last=i+1;}}if(i-last>0)target.push(string.substring(last,i));return target;}module.exports=new Dispatch();},{"./Event":11,"./Path":14}],11:[function(require,module,exports){/**
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
 * The Event class adds the stopPropagation functionality
 * to the UIEvents within the scene graph.
 *
 * @constructor Event
 */function Event(){this.propagationStopped=false;this.stopPropagation=stopPropagation;}/**
 * stopPropagation ends the bubbling of the event in the
 * scene graph.
 *
 * @method stopPropagation
 *
 * @return {undefined} undefined
 */function stopPropagation(){this.propagationStopped=true;}module.exports=Event;},{}],12:[function(require,module,exports){/**
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
 */'use strict';var Clock=require('./Clock');var Scene=require('./Scene');var Channel=require('./Channel');var Chan=require('./Chan');var Dispatch=require('./Dispatch');var UIManager=require('../renderers/UIManager');var Compositor=require('../renderers/Compositor');var RequestAnimationFrameLoop=require('../render-loops/RequestAnimationFrameLoop');var TransformSystem=require('./TransformSystem');var SizeSystem=require('./SizeSystem');var Commands=require('./Commands');var ENGINE_START=[Commands.ENGINE,Commands.START];var ENGINE_STOP=[Commands.ENGINE,Commands.STOP];var TIME_UPDATE=[Commands.TIME,null];/**
 * Famous has two responsibilities, one to act as the highest level
 * updater and another to send messages over to the renderers. It is
 * a singleton.
 *
 * @class FamousEngine
 * @constructor
 */function FamousEngine(){var _this=this;Dispatch._setUpdater(this);this._updateQueue=[];// The updateQueue is a place where nodes
// can place themselves in order to be
// updated on the frame.
this._nextUpdateQueue=[];// the nextUpdateQueue is used to queue
// updates for the next tick.
// this prevents infinite loops where during
// an update a node continuously puts itself
// back in the update queue.
this._scenes={};// a hash of all of the scenes's that the FamousEngine
// is responsible for.
this._messages=TIME_UPDATE;// a queue of all of the draw commands to
// send to the the renderers this frame.
this._inUpdate=false;// when the famous is updating this is true.
// all requests for updates will get put in the
// nextUpdateQueue
this._clock=new Clock();// a clock to keep track of time for the scene
// graph.
this._channel=new Channel();this._channel.onMessage=function(message){_this.handleMessage(message);};Chan.setChannel(this._channel);}/**
 * An init script that initializes the FamousEngine with options
 * or default parameters.
 *
 * @method
 *
 * @param {Object} options a set of options containing a compositor and a render loop
 *
 * @return {FamousEngine} this
 */FamousEngine.prototype.init=function init(options){if(typeof window==='undefined'){throw new Error('FamousEngine#init needs to have access to the global window object. '+'Instantiate Compositor and UIManager manually in the UI thread.');}this.compositor=options&&options.compositor||new Compositor();this.renderLoop=options&&options.renderLoop||new RequestAnimationFrameLoop();this.uiManager=new UIManager(this.getChannel(),this.compositor,this.renderLoop);return this;};/**
 * Sets the channel that the engine will use to communicate to
 * the renderers.
 *
 * @method
 *
 * @param {Channel} channel     The channel to be used for communicating with
 *                              the `UIManager`/ `Compositor`.
 *
 * @return {FamousEngine} this
 */FamousEngine.prototype.setChannel=function setChannel(channel){this._channel=channel;return this;};/**
 * Returns the channel that the engine is currently using
 * to communicate with the renderers.
 *
 * @method
 *
 * @return {Channel} channel    The channel to be used for communicating with
 *                              the `UIManager`/ `Compositor`.
 */FamousEngine.prototype.getChannel=function getChannel(){return this._channel;};/**
 * _update is the body of the update loop. The frame consists of
 * pulling in appending the nextUpdateQueue to the currentUpdate queue
 * then moving through the updateQueue and calling onUpdate with the current
 * time on all nodes. While _update is called _inUpdate is set to true and
 * all requests to be placed in the update queue will be forwarded to the
 * nextUpdateQueue.
 *
 * @method
 *
 * @return {undefined} undefined
 */FamousEngine.prototype._update=function _update(){this._inUpdate=true;var time=this._clock.now();var nextQueue=this._nextUpdateQueue;var queue=this._updateQueue;var item;this._messages[1]=time;SizeSystem.update();TransformSystem.update();while(nextQueue.length){queue.unshift(nextQueue.pop());}while(queue.length){item=queue.shift();if(item&&item.update)item.update(time);if(item&&item.onUpdate)item.onUpdate(time);}this._inUpdate=false;};/**
 * requestUpdates takes a class that has an onUpdate method and puts it
 * into the updateQueue to be updated at the next frame.
 * If FamousEngine is currently in an update, requestUpdate
 * passes its argument to requestUpdateOnNextTick.
 *
 * @method
 *
 * @param {Object} requester an object with an onUpdate method
 *
 * @return {undefined} undefined
 */FamousEngine.prototype.requestUpdate=function requestUpdate(requester){if(!requester)throw new Error('requestUpdate must be called with a class to be updated');if(this._inUpdate)this.requestUpdateOnNextTick(requester);else this._updateQueue.push(requester);};/**
 * requestUpdateOnNextTick is requests an update on the next frame.
 * If FamousEngine is not currently in an update than it is functionally equivalent
 * to requestUpdate. This method should be used to prevent infinite loops where
 * a class is updated on the frame but needs to be updated again next frame.
 *
 * @method
 *
 * @param {Object} requester an object with an onUpdate method
 *
 * @return {undefined} undefined
 */FamousEngine.prototype.requestUpdateOnNextTick=function requestUpdateOnNextTick(requester){this._nextUpdateQueue.push(requester);};/**
 * postMessage sends a message queue into FamousEngine to be processed.
 * These messages will be interpreted and sent into the scene graph
 * as events if necessary.
 *
 * @method
 *
 * @param {Array} messages an array of commands.
 *
 * @return {FamousEngine} this
 */FamousEngine.prototype.handleMessage=function handleMessage(messages){if(!messages)throw new Error('onMessage must be called with an array of messages');var command;while(messages.length>0){command=messages.shift();switch(command){case Commands.WITH:this.handleWith(messages);break;case Commands.FRAME:this.handleFrame(messages);break;case Commands.ENGINE:Chan.callback(messages[1]);messages.length=0;break;default:throw new Error('received unknown command: '+command);}}return this;};/**
 * handleWith is a method that takes an array of messages following the
 * WITH command. It'll then issue the next commands to the path specified
 * by the WITH command.
 *
 * @method
 *
 * @param {Array} messages array of messages.
 *
 * @return {FamousEngine} this
 */FamousEngine.prototype.handleWith=function handleWith(messages){var path=messages.shift();var command=messages.shift();switch(command){case Commands.TRIGGER:// the TRIGGER command sends a UIEvent to the specified path
var type=messages.shift();var ev=messages.shift();Dispatch.dispatchUIEvent(path,type,ev);break;default:throw new Error('received unknown command: '+command);}return this;};/**
 * handleFrame is called when the renderers issue a FRAME command to
 * FamousEngine. FamousEngine will then step updating the scene graph to the current time.
 *
 * @method
 *
 * @param {Array} messages array of messages.
 *
 * @return {FamousEngine} this
 */FamousEngine.prototype.handleFrame=function handleFrame(messages){if(!messages)throw new Error('handleFrame must be called with an array of messages');if(!messages.length)throw new Error('FRAME must be sent with a time');this.step(messages.shift());return this;};/**
 * step updates the clock and the scene graph and then sends the draw commands
 * that accumulated in the update to the renderers.
 *
 * @method
 *
 * @param {Number} time current engine time
 *
 * @return {FamousEngine} this
 */FamousEngine.prototype.step=function step(time){if(time==null)throw new Error('step must be called with a time');this._clock.step(time);this._update();if(this._messages.length){this._channel.sendMessage(this._messages);while(this._messages.length>2){this._messages.pop();}}return this;};/**
 * returns the context of a particular path. The context is looked up by the selector
 * portion of the path and is listed from the start of the string to the first
 * '/'.
 *
 * @method
 *
 * @param {String} selector the path to look up the context for.
 *
 * @return {Context | Undefined} the context if found, else undefined.
 */FamousEngine.prototype.getContext=function getContext(selector){if(!selector)throw new Error('getContext must be called with a selector');var index=selector.indexOf('/');selector=index===-1?selector:selector.substring(0,index);return this._scenes[selector];};/**
 * Returns the instance of clock used by the FamousEngine.
 *
 * @method
 *
 * @return {Clock} FamousEngine's clock
 */FamousEngine.prototype.getClock=function getClock(){return this._clock;};/**
 * Enqueues a message to be transfered to the renderers.
 *
 * @method
 *
 * @param {Any} command Draw Command
 *
 * @return {FamousEngine} this
 */FamousEngine.prototype.message=function message(command){this._messages.push(command);return this;};/**
 * Creates a scene under which a scene graph could be built.
 *
 * @method
 *
 * @param {String} selector a dom selector for where the scene should be placed
 *
 * @return {Scene} a new instance of Scene.
 */FamousEngine.prototype.createScene=function createScene(selector){selector=selector||'body';if(this._scenes[selector])this._scenes[selector].dismount();this._scenes[selector]=new Scene(selector,this);return this._scenes[selector];};/**
 * Introduce an already instantiated scene to the engine.
 *
 * @method
 *
 * @param {Scene} scene the scene to reintroduce to the engine
 *
 * @return {FamousEngine} this
 */FamousEngine.prototype.addScene=function addScene(scene){var selector=scene._selector;var current=this._scenes[selector];if(current&&current!==scene)current.dismount();if(!scene.isMounted())scene.mount(scene.getSelector());this._scenes[selector]=scene;return this;};/**
 * Remove a scene.
 *
 * @method
 *
 * @param {Scene} scene the scene to remove from the engine
 *
 * @return {FamousEngine} this
 */FamousEngine.prototype.removeScene=function removeScene(scene){var selector=scene._selector;var current=this._scenes[selector];if(current&&current===scene){if(scene.isMounted())scene.dismount();delete this._scenes[selector];}return this;};/**
 * Starts the engine running in the Main-Thread.
 * This effects **every** updateable managed by the Engine.
 *
 * @method
 *
 * @return {FamousEngine} this
 */FamousEngine.prototype.startRenderLoop=function startRenderLoop(){this._channel.sendMessage(ENGINE_START);return this;};/**
 * Stops the engine running in the Main-Thread.
 * This effects **every** updateable managed by the Engine.
 *
 * @method
 *
 * @return {FamousEngine} this
 */FamousEngine.prototype.stopRenderLoop=function stopRenderLoop(){this._channel.sendMessage(ENGINE_STOP);return this;};/**
 * @method
 * @deprecated Use {@link FamousEngine#startRenderLoop} instead!
 *
 * @return {FamousEngine} this
 */FamousEngine.prototype.startEngine=function startEngine(){console.warn('FamousEngine.startEngine is deprecated! Use '+'FamousEngine.startRenderLoop instead!');return this.startRenderLoop();};/**
 * @method
 * @deprecated Use {@link FamousEngine#stopRenderLoop} instead!
 *
 * @return {FamousEngine} this
 */FamousEngine.prototype.stopEngine=function stopEngine(){console.warn('FamousEngine.stopEngine is deprecated! Use '+'FamousEngine.stopRenderLoop instead!');return this.stopRenderLoop();};module.exports=new FamousEngine();},{"../render-loops/RequestAnimationFrameLoop":40,"../renderers/Compositor":41,"../renderers/UIManager":43,"./Chan":5,"./Channel":6,"./Clock":7,"./Commands":8,"./Dispatch":10,"./Scene":16,"./SizeSystem":18,"./TransformSystem":20}],13:[function(require,module,exports){/**
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
 *//*jshint -W079 */'use strict';var SizeSystem=require('./SizeSystem');var Dispatch=require('./Dispatch');var TransformSystem=require('./TransformSystem');var Size=require('./Size');var Transform=require('./Transform');/**
 * Nodes define hierarchy and geometrical transformations. They can be moved
 * (translated), scaled and rotated.
 *
 * A Node is either mounted or unmounted. Unmounted nodes are detached from the
 * scene graph. Unmounted nodes have no parent node, while each mounted node has
 * exactly one parent. Nodes have an arbitrary number of children, which can be
 * dynamically added using {@link Node#addChild}.
 *
 * Each Node has an arbitrary number of `components`. Those components can
 * send `draw` commands to the renderer or mutate the node itself, in which case
 * they define behavior in the most explicit way. Components that send `draw`
 * commands are considered `renderables`. From the node's perspective, there is
 * no distinction between nodes that send draw commands and nodes that define
 * behavior.
 *
 * Because of the fact that Nodes themself are very unopinioted (they don't
 * "render" to anything), they are often being subclassed in order to add e.g.
 * components at initialization to them. Because of this flexibility, they might
 * as well have been called `Entities`.
 *
 * @example
 * // create three detached (unmounted) nodes
 * var parent = new Node();
 * var child1 = new Node();
 * var child2 = new Node();
 *
 * // build an unmounted subtree (parent is still detached)
 * parent.addChild(child1);
 * parent.addChild(child2);
 *
 * // mount parent by adding it to the context
 * var context = Famous.createContext("body");
 * context.addChild(parent);
 *
 * @class Node
 * @constructor
 */function Node(){this._requestingUpdate=false;this._inUpdate=false;this._mounted=false;this._shown=true;this._showInEngine=true;this._updater=null;this._opacity=1;this._UIEvents=[];this._updateQueue=[];this._nextUpdateQueue=[];this._freedComponentIndicies=[];this._components=[];this._freedChildIndicies=[];this._children=[];this._fullChildren=[];this._parent=null;this._id=null;this._transformID=null;this._sizeID=null;if(!this.constructor.NO_DEFAULT_COMPONENTS)this._init();}Node.RELATIVE_SIZE=0;Node.ABSOLUTE_SIZE=1;Node.RENDER_SIZE=2;Node.DEFAULT_SIZE=0;Node.NO_DEFAULT_COMPONENTS=false;/**
 * Protected method. Initializes a node with a default Transform and Size component
 *
 * @method
 * @protected
 *
 * @return {undefined} undefined
 */Node.prototype._init=function _init(){this._transformID=this.addComponent(new Transform());this._sizeID=this.addComponent(new Size());};/**
 * Protected method. Sets the parent of this node such that it can be looked up.
 *
 * @method
 *
 * @param {Node} parent The node to set as the parent of this
 *
 * @return {undefined} undefined;
 */Node.prototype._setParent=function _setParent(parent){if(this._parent&&this._parent.getChildren().indexOf(this)!==-1){this._parent.removeChild(this);}this._parent=parent;};/**
 * Protected method. Sets the mount state of the node. Should only be called
 * by the dispatch
 *
 * @method
 *
 * @param {Boolean} mounted whether or not the Node is mounted.
 * @param {String} path The path that the node will be mounted to
 *
 * @return {undefined} undefined
 */Node.prototype._setMounted=function _setMounted(mounted,path){this._mounted=mounted;this._id=path?path:null;};/**
 * Protected method, sets whether or not the Node is shown. Should only
 * be called by the dispatch
 *
 * @method
 *
 * @param {Boolean} shown whether or not the node is shown
 *
 * @return {undefined} undefined
 */Node.prototype._setShown=function _setShown(shown){this._shown=shown;};/**
 * Protected method. Sets the updater of the node.
 *
 * @method
 *
 * @param {FamousEngine} updater the Updater of the node.
 *
 * @return {undefined} undefined
 */Node.prototype._setUpdater=function _setUpdater(updater){this._updater=updater;if(this._requestingUpdate)this._updater.requestUpdate(this);};/**
 * Determine the node's location in the scene graph hierarchy.
 * A location of `body/0/1` can be interpreted as the following scene graph
 * hierarchy (ignoring siblings of ancestors and additional child nodes):
 *
 * `Context:body` -> `Node:0` -> `Node:1`, where `Node:1` is the node the
 * `getLocation` method has been invoked on.
 *
 * @method getLocation
 *
 * @return {String} location (path), e.g. `body/0/1`
 */Node.prototype.getLocation=function getLocation(){return this._id;};/**
 * @alias getId
 *
 * @return {String} the path of the Node
 */Node.prototype.getId=Node.prototype.getLocation;/**
 * Dispatches the event using the Dispatch. All descendent nodes will
 * receive the dispatched event.
 *
 * @method emit
 *
 * @param  {String} event   Event type.
 * @param  {Object} payload Event object to be dispatched.
 *
 * @return {Node} this
 */Node.prototype.emit=function emit(event,payload){Dispatch.dispatch(this.getLocation(),event,payload);return this;};// THIS WILL BE DEPRECATED
Node.prototype.sendDrawCommand=function sendDrawCommand(message){this._updater.message(message);return this;};/**
 * Recursively serializes the Node, including all previously added components.
 *
 * @method getValue
 *
 * @return {Object}     Serialized representation of the node, including
 *                      components.
 */Node.prototype.getValue=function getValue(){var numberOfChildren=this._children.length;var numberOfComponents=this._components.length;var i=0;var value={location:this.getId(),spec:{location:this.getId(),showState:{mounted:this.isMounted(),shown:this.isShown(),opacity:this.getOpacity()||null},offsets:{mountPoint:[0,0,0],align:[0,0,0],origin:[0,0,0]},vectors:{position:[0,0,0],rotation:[0,0,0,1],scale:[1,1,1]},size:{sizeMode:[0,0,0],proportional:[1,1,1],differential:[0,0,0],absolute:[0,0,0],render:[0,0,0]}},UIEvents:this._UIEvents,components:[],children:[]};if(value.location){var transform=TransformSystem.get(this.getId());var size=SizeSystem.get(this.getId());for(i=0;i<3;i++){value.spec.offsets.mountPoint[i]=transform.offsets.mountPoint[i];value.spec.offsets.align[i]=transform.offsets.align[i];value.spec.offsets.origin[i]=transform.offsets.origin[i];value.spec.vectors.position[i]=transform.vectors.position[i];value.spec.vectors.rotation[i]=transform.vectors.rotation[i];value.spec.vectors.scale[i]=transform.vectors.scale[i];value.spec.size.sizeMode[i]=size.sizeMode[i];value.spec.size.proportional[i]=size.proportionalSize[i];value.spec.size.differential[i]=size.differentialSize[i];value.spec.size.absolute[i]=size.absoluteSize[i];value.spec.size.render[i]=size.renderSize[i];}value.spec.vectors.rotation[3]=transform.vectors.rotation[3];}for(i=0;i<numberOfChildren;i++){if(this._children[i]&&this._children[i].getValue)value.children.push(this._children[i].getValue());}for(i=0;i<numberOfComponents;i++){if(this._components[i]&&this._components[i].getValue)value.components.push(this._components[i].getValue());}return value;};/**
 * Similar to {@link Node#getValue}, but returns the actual "computed" value. E.g.
 * a proportional size of 0.5 might resolve into a "computed" size of 200px
 * (assuming the parent has a width of 400px).
 *
 * @method getComputedValue
 *
 * @return {Object}     Serialized representation of the node, including
 *                      children, excluding components.
 */Node.prototype.getComputedValue=function getComputedValue(){console.warn('Node.getComputedValue is depricated. Use Node.getValue instead');var numberOfChildren=this._children.length;var value={location:this.getId(),computedValues:{transform:this.isMounted()?TransformSystem.get(this.getLocation()).getLocalTransform():null,size:this.isMounted()?SizeSystem.get(this.getLocation()).get():null},children:[]};for(var i=0;i<numberOfChildren;i++){if(this._children[i]&&this._children[i].getComputedValue)value.children.push(this._children[i].getComputedValue());}return value;};/**
 * Retrieves all children of the current node.
 *
 * @method getChildren
 *
 * @return {Array.<Node>}   An array of children.
 */Node.prototype.getChildren=function getChildren(){return this._fullChildren;};/**
 * Method used internally to retrieve the children of a node. Each index in the
 * returned array represents a path fragment.
 *
 * @method getRawChildren
 * @private
 *
 * @return {Array}  An array of children. Might contain `null` elements.
 */Node.prototype.getRawChildren=function getRawChildren(){return this._children;};/**
 * Retrieves the parent of the current node. Unmounted nodes do not have a
 * parent node.
 *
 * @method getParent
 *
 * @return {Node}       Parent node.
 */Node.prototype.getParent=function getParent(){return this._parent;};/**
 * Schedules the {@link Node#update} function of the node to be invoked on the
 * next frame (if no update during this frame has been scheduled already).
 * If the node is currently being updated (which means one of the requesters
 * invoked requestsUpdate while being updated itself), an update will be
 * scheduled on the next frame.
 *
 * @method requestUpdate
 *
 * @param  {Object} requester   If the requester has an `onUpdate` method, it
 *                              will be invoked during the next update phase of
 *                              the node.
 *
 * @return {Node} this
 */Node.prototype.requestUpdate=function requestUpdate(requester){if(this._inUpdate||!this.isMounted())return this.requestUpdateOnNextTick(requester);if(this._updateQueue.indexOf(requester)===-1){this._updateQueue.push(requester);if(!this._requestingUpdate)this._requestUpdate();}return this;};/**
 * Schedules an update on the next tick. Similarily to
 * {@link Node#requestUpdate}, `requestUpdateOnNextTick` schedules the node's
 * `onUpdate` function to be invoked on the frame after the next invocation on
 * the node's onUpdate function.
 *
 * @method requestUpdateOnNextTick
 *
 * @param  {Object} requester   If the requester has an `onUpdate` method, it
 *                              will be invoked during the next update phase of
 *                              the node.
 *
 * @return {Node} this
 */Node.prototype.requestUpdateOnNextTick=function requestUpdateOnNextTick(requester){if(this._nextUpdateQueue.indexOf(requester)===-1)this._nextUpdateQueue.push(requester);return this;};/**
 * Checks if the node is mounted. Unmounted nodes are detached from the scene
 * graph.
 *
 * @method isMounted
 *
 * @return {Boolean}    Boolean indicating whether the node is mounted or not.
 */Node.prototype.isMounted=function isMounted(){return this._mounted;};/**
 * Checks if the node is being rendered. A node is being rendererd when it is
 * mounted to a parent node **and** shown.
 *
 * @method isRendered
 *
 * @return {Boolean}    Boolean indicating whether the node is rendered or not.
 */Node.prototype.isRendered=function isRendered(){return this._mounted&&this._shown;};/**
 * Checks if the node is visible ("shown").
 *
 * @method isShown
 *
 * @return {Boolean}    Boolean indicating whether the node is visible
 *                      ("shown") or not.
 */Node.prototype.isShown=function isShown(){return this._shown;};/**
 * Determines the node's relative opacity.
 * The opacity needs to be within [0, 1], where 0 indicates a completely
 * transparent, therefore invisible node, whereas an opacity of 1 means the
 * node is completely solid.
 *
 * @method getOpacity
 *
 * @return {Number}         Relative opacity of the node.
 */Node.prototype.getOpacity=function getOpacity(){return this._opacity;};/**
 * Determines the node's previously set mount point.
 *
 * @method getMountPoint
 *
 * @return {Float32Array}   An array representing the mount point.
 */Node.prototype.getMountPoint=function getMountPoint(){if(!this.constructor.NO_DEFAULT_COMPONENTS)return this.getComponent(this._transformID).getMountPoint();else if(this.isMounted())return TransformSystem.get(this.getLocation()).getMountPoint();else throw new Error('This node does not have access to a transform component');};/**
 * Determines the node's previously set align.
 *
 * @method getAlign
 *
 * @return {Float32Array}   An array representing the align.
 */Node.prototype.getAlign=function getAlign(){if(!this.constructor.NO_DEFAULT_COMPONENTS)return this.getComponent(this._transformID).getAlign();else if(this.isMounted())return TransformSystem.get(this.getLocation()).getAlign();else throw new Error('This node does not have access to a transform component');};/**
 * Determines the node's previously set origin.
 *
 * @method getOrigin
 *
 * @return {Float32Array}   An array representing the origin.
 */Node.prototype.getOrigin=function getOrigin(){if(!this.constructor.NO_DEFAULT_COMPONENTS)return this.getComponent(this._transformID).getOrigin();else if(this.isMounted())return TransformSystem.get(this.getLocation()).getOrigin();else throw new Error('This node does not have access to a transform component');};/**
 * Determines the node's previously set position.
 *
 * @method getPosition
 *
 * @return {Float32Array}   An array representing the position.
 */Node.prototype.getPosition=function getPosition(){if(!this.constructor.NO_DEFAULT_COMPONENTS)return this.getComponent(this._transformID).getPosition();else if(this.isMounted())return TransformSystem.get(this.getLocation()).getPosition();else throw new Error('This node does not have access to a transform component');};/**
 * Returns the node's current rotation
 *
 * @method getRotation
 *
 * @return {Float32Array} an array of four values, showing the rotation as a quaternion
 */Node.prototype.getRotation=function getRotation(){if(!this.constructor.NO_DEFAULT_COMPONENTS)return this.getComponent(this._transformID).getRotation();else if(this.isMounted())return TransformSystem.get(this.getLocation()).getRotation();else throw new Error('This node does not have access to a transform component');};/**
 * Returns the scale of the node
 *
 * @method
 *
 * @return {Float32Array} an array showing the current scale vector
 */Node.prototype.getScale=function getScale(){if(!this.constructor.NO_DEFAULT_COMPONENTS)return this.getComponent(this._transformID).getScale();else if(this.isMounted())return TransformSystem.get(this.getLocation()).getScale();else throw new Error('This node does not have access to a transform component');};/**
 * Returns the current size mode of the node
 *
 * @method
 *
 * @return {Float32Array} an array of numbers showing the current size mode
 */Node.prototype.getSizeMode=function getSizeMode(){if(!this.constructor.NO_DEFAULT_COMPONENTS)return this.getComponent(this._sizeID).getSizeMode();else if(this.isMounted())return SizeSystem.get(this.getLocation()).getSizeMode();else throw new Error('This node does not have access to a size component');};/**
 * Returns the current proportional size
 *
 * @method
 *
 * @return {Float32Array} a vector 3 showing the current proportional size
 */Node.prototype.getProportionalSize=function getProportionalSize(){if(!this.constructor.NO_DEFAULT_COMPONENTS)return this.getComponent(this._sizeID).getProportional();else if(this.isMounted())return SizeSystem.get(this.getLocation()).getProportional();else throw new Error('This node does not have access to a size component');};/**
 * Returns the differential size of the node
 *
 * @method
 *
 * @return {Float32Array} a vector 3 showing the current differential size
 */Node.prototype.getDifferentialSize=function getDifferentialSize(){if(!this.constructor.NO_DEFAULT_COMPONENTS)return this.getComponent(this._sizeID).getDifferential();else if(this.isMounted())return SizeSystem.get(this.getLocation()).getDifferential();else throw new Error('This node does not have access to a size component');};/**
 * Returns the absolute size of the node
 *
 * @method
 *
 * @return {Float32Array} a vector 3 showing the current absolute size of the node
 */Node.prototype.getAbsoluteSize=function getAbsoluteSize(){if(!this.constructor.NO_DEFAULT_COMPONENTS)return this.getComponent(this._sizeID).getAbsolute();else if(this.isMounted())return SizeSystem.get(this.getLocation()).getAbsolute();else throw new Error('This node does not have access to a size component');};/**
 * Returns the current Render Size of the node. Note that the render size
 * is asynchronous (will always be one frame behind) and needs to be explicitely
 * calculated by setting the proper size mode.
 *
 * @method
 *
 * @return {Float32Array} a vector 3 showing the current render size
 */Node.prototype.getRenderSize=function getRenderSize(){if(!this.constructor.NO_DEFAULT_COMPONENTS)return this.getComponent(this._sizeID).getRender();else if(this.isMounted())return SizeSystem.get(this.getLocation()).getRender();else throw new Error('This node does not have access to a size component');};/**
 * Returns the external size of the node
 *
 * @method
 *
 * @return {Float32Array} a vector 3 of the final calculated side of the node
 */Node.prototype.getSize=function getSize(){if(!this.constructor.NO_DEFAULT_COMPONENTS)return this.getComponent(this._sizeID).get();else if(this.isMounted())return SizeSystem.get(this.getLocation()).get();else throw new Error('This node does not have access to a size component');};/**
 * Returns the current world transform of the node
 *
 * @method
 *
 * @return {Float32Array} a 16 value transform
 */Node.prototype.getTransform=function getTransform(){return TransformSystem.get(this.getLocation());};/**
 * Get the list of the UI Events that are currently associated with this node
 *
 * @method
 *
 * @return {Array} an array of strings representing the current subscribed UI event of this node
 */Node.prototype.getUIEvents=function getUIEvents(){return this._UIEvents;};/**
 * Adds a new child to this node. If this method is called with no argument it will
 * create a new node, however it can also be called with an existing node which it will
 * append to the node that this method is being called on. Returns the new or passed in node.
 *
 * @method
 *
 * @param {Node | void} child the node to appended or no node to create a new node.
 *
 * @return {Node} the appended node.
 */Node.prototype.addChild=function addChild(child){var index=child?this._children.indexOf(child):-1;child=child?child:new Node();if(index===-1){index=this._freedChildIndicies.length?this._freedChildIndicies.pop():this._children.length;this._children[index]=child;this._fullChildren.push(child);}if(this.isMounted())child.mount(this.getLocation()+'/'+index);return child;};/**
 * Removes a child node from another node. The passed in node must be
 * a child of the node that this method is called upon.
 *
 * @method
 *
 * @param {Node} child node to be removed
 *
 * @return {Boolean} whether or not the node was successfully removed
 */Node.prototype.removeChild=function removeChild(child){var index=this._children.indexOf(child);if(index>-1){this._freedChildIndicies.push(index);this._children[index]=null;if(child.isMounted())child.dismount();var fullChildrenIndex=this._fullChildren.indexOf(child);var len=this._fullChildren.length;var i=0;for(i=fullChildrenIndex;i<len-1;i++){this._fullChildren[i]=this._fullChildren[i+1];}this._fullChildren.pop();return true;}else{return false;}};/**
 * Each component can only be added once per node.
 *
 * @method addComponent
 *
 * @param {Object} component    A component to be added.
 * @return {Number} index       The index at which the component has been
 *                              registered. Indices aren't necessarily
 *                              consecutive.
 */Node.prototype.addComponent=function addComponent(component){var index=this._components.indexOf(component);if(index===-1){index=this._freedComponentIndicies.length?this._freedComponentIndicies.pop():this._components.length;this._components[index]=component;if(this.isMounted()&&component.onMount)component.onMount(this,index);if(this.isShown()&&component.onShow)component.onShow();}return index;};/**
 * @method  getComponent
 *
 * @param  {Number} index   Index at which the component has been registered
 *                          (using `Node#addComponent`).
 * @return {*}              The component registered at the passed in index (if
 *                          any).
 */Node.prototype.getComponent=function getComponent(index){return this._components[index];};/**
 * Removes a previously via {@link Node#addComponent} added component.
 *
 * @method removeComponent
 *
 * @param  {Object} component   An component that has previously been added
 *                              using {@link Node#addComponent}.
 *
 * @return {Node} this
 */Node.prototype.removeComponent=function removeComponent(component){var index=this._components.indexOf(component);if(index!==-1){this._freedComponentIndicies.push(index);if(this.isShown()&&component.onHide)component.onHide();if(this.isMounted()&&component.onDismount)component.onDismount();this._components[index]=null;}return component;};/**
 * Removes a node's subscription to a particular UIEvent. All components
 * on the node will have the opportunity to remove all listeners depending
 * on this event.
 *
 * @method
 *
 * @param {String} eventName the name of the event
 *
 * @return {undefined} undefined
 */Node.prototype.removeUIEvent=function removeUIEvent(eventName){var UIEvents=this.getUIEvents();var components=this._components;var component;var index=UIEvents.indexOf(eventName);if(index!==-1){UIEvents.splice(index,1);for(var i=0,len=components.length;i<len;i++){component=components[i];if(component&&component.onRemoveUIEvent)component.onRemoveUIEvent(eventName);}}};/**
 * Subscribes a node to a UI Event. All components on the node
 * will have the opportunity to begin listening to that event
 * and alerting the scene graph.
 *
 * @method
 *
 * @param {String} eventName the name of the event
 *
 * @return {Node} this
 */Node.prototype.addUIEvent=function addUIEvent(eventName){var UIEvents=this.getUIEvents();var components=this._components;var component;var added=UIEvents.indexOf(eventName)!==-1;if(!added){UIEvents.push(eventName);for(var i=0,len=components.length;i<len;i++){component=components[i];if(component&&component.onAddUIEvent)component.onAddUIEvent(eventName);}}return this;};/**
 * Private method for the Node to request an update for itself.
 *
 * @method
 * @private
 *
 * @param {Boolean} force whether or not to force the update
 *
 * @return {undefined} undefined
 */Node.prototype._requestUpdate=function _requestUpdate(force){if(force||!this._requestingUpdate){if(this._updater)this._updater.requestUpdate(this);this._requestingUpdate=true;}};/**
 * Private method to set an optional value in an array, and
 * request an update if this changes the value of the array.
 *
 * @method
 *
 * @param {Array} vec the array to insert the value into
 * @param {Number} index the index at which to insert the value
 * @param {Any} val the value to potentially insert (if not null or undefined)
 *
 * @return {Boolean} whether or not a new value was inserted.
 */Node.prototype._vecOptionalSet=function _vecOptionalSet(vec,index,val){if(val!=null&&vec[index]!==val){vec[index]=val;if(!this._requestingUpdate)this._requestUpdate();return true;}return false;};/**
 * Shows the node, which is to say, calls onShow on all of the
 * node's components. Renderable components can then issue the
 * draw commands necessary to be shown.
 *
 * @method
 *
 * @return {Node} this
 */Node.prototype.show=function show(){Dispatch.show(this.getLocation());this._shown=true;return this;};/**
 * Hides the node, which is to say, calls onHide on all of the
 * node's components. Renderable components can then issue
 * the draw commands necessary to be hidden
 *
 * @method
 *
 * @return {Node} this
 */Node.prototype.hide=function hide(){Dispatch.hide(this.getLocation());this._shown=false;return this;};/**
 * Sets the showInEngine value of the node. 
 *
 * @method
 *
 * @param {Boolean} Bool showInEngine value.
 *
 * @return {Node} this
 * @return {Boolean} this.showInEngine
 */Node.prototype.showInEngine=function(Bool){if(typeof Bool!="boolean")return this._showInEngine;this._showInEngine=Bool;return this;};/**
 * Sets the align value of the node. Will call onAlignChange
 * on all of the Node's components.
 *
 * @method
 *
 * @param {Number} x Align value in the x dimension.
 * @param {Number} y Align value in the y dimension.
 * @param {Number} z Align value in the z dimension.
 *
 * @return {Node} this
 */Node.prototype.setAlign=function setAlign(x,y,z){if(!this.constructor.NO_DEFAULT_COMPONENTS)this.getComponent(this._transformID).setAlign(x,y,z);else if(this.isMounted())TransformSystem.get(this.getLocation()).setAlign(x,y,z);else throw new Error('This node does not have access to a transform component');return this;};/**
 * Sets the mount point value of the node. Will call onMountPointChange
 * on all of the node's components.
 *
 * @method
 *
 * @param {Number} x MountPoint value in x dimension
 * @param {Number} y MountPoint value in y dimension
 * @param {Number} z MountPoint value in z dimension
 *
 * @return {Node} this
 */Node.prototype.setMountPoint=function setMountPoint(x,y,z){if(!this.constructor.NO_DEFAULT_COMPONENTS)this.getComponent(this._transformID).setMountPoint(x,y,z);else if(this.isMounted())TransformSystem.get(this.getLocation()).setMountPoint(x,y,z);else throw new Error('This node does not have access to a transform component');return this;};/**
 * Sets the origin value of the node. Will call onOriginChange
 * on all of the node's components.
 *
 * @method
 *
 * @param {Number} x Origin value in x dimension
 * @param {Number} y Origin value in y dimension
 * @param {Number} z Origin value in z dimension
 *
 * @return {Node} this
 */Node.prototype.setOrigin=function setOrigin(x,y,z){if(!this.constructor.NO_DEFAULT_COMPONENTS)this.getComponent(this._transformID).setOrigin(x,y,z);else if(this.isMounted())TransformSystem.get(this.getLocation()).setOrigin(x,y,z);else throw new Error('This node does not have access to a transform component');return this;};/**
 * Sets the position of the node. Will call onPositionChange
 * on all of the node's components.
 *
 * @method
 *
 * @param {Number} x Position in x
 * @param {Number} y Position in y
 * @param {Number} z Position in z
 *
 * @return {Node} this
 */Node.prototype.setPosition=function setPosition(x,y,z){if(!this.constructor.NO_DEFAULT_COMPONENTS)this.getComponent(this._transformID).setPosition(x,y,z);else if(this.isMounted())TransformSystem.get(this.getLocation()).setPosition(x,y,z);else throw new Error('This node does not have access to a transform component');return this;};/**
 * Sets the rotation of the node. Will call onRotationChange
 * on all of the node's components. This method takes either
 * Euler angles or a quaternion. If the fourth argument is undefined
 * Euler angles are assumed.
 *
 * @method
 *
 * @param {Number} x Either the rotation around the x axis or the magnitude in x of the axis of rotation.
 * @param {Number} y Either the rotation around the y axis or the magnitude in y of the axis of rotation.
 * @param {Number} z Either the rotation around the z axis or the magnitude in z of the axis of rotation.
 * @param {Number|undefined} w the amount of rotation around the axis of rotation, if a quaternion is specified.
 *
 * @return {Node} this
 */Node.prototype.setRotation=function setRotation(x,y,z,w){if(!this.constructor.NO_DEFAULT_COMPONENTS)this.getComponent(this._transformID).setRotation(x,y,z,w);else if(this.isMounted())TransformSystem.get(this.getLocation()).setRotation(x,y,z,w);else throw new Error('This node does not have access to a transform component');return this;};/**
 * Sets the scale of the node. The default value is 1 in all dimensions.
 * The node's components will have onScaleChanged called on them.
 *
 * @method
 *
 * @param {Number} x Scale value in x
 * @param {Number} y Scale value in y
 * @param {Number} z Scale value in z
 *
 * @return {Node} this
 */Node.prototype.setScale=function setScale(x,y,z){if(!this.constructor.NO_DEFAULT_COMPONENTS)this.getComponent(this._transformID).setScale(x,y,z);else if(this.isMounted())TransformSystem.get(this.getLocation()).setScale(x,y,z);else throw new Error('This node does not have access to a transform component');return this;};/**
 * Sets the value of the opacity of this node. All of the node's
 * components will have onOpacityChange called on them/
 *
 * @method
 *
 * @param {Number} val Value of the opacity. 1 is the default.
 *
 * @return {Node} this
 */Node.prototype.setOpacity=function setOpacity(val){if(val!==this._opacity){this._opacity=val;if(!this._requestingUpdate)this._requestUpdate();var i=0;var list=this._components;var len=list.length;var item;for(;i<len;i++){item=list[i];if(item&&item.onOpacityChange)item.onOpacityChange(val);}}return this;};/**
 * Sets the size mode being used for determining the node's final width, height
 * and depth.
 * Size modes are a way to define the way the node's size is being calculated.
 * Size modes are enums set on the {@link Size} constructor (and aliased on
 * the Node).
 *
 * @example
 * node.setSizeMode(Node.RELATIVE_SIZE, Node.ABSOLUTE_SIZE, Node.ABSOLUTE_SIZE);
 * // Instead of null, any proportional height or depth can be passed in, since
 * // it would be ignored in any case.
 * node.setProportionalSize(0.5, null, null);
 * node.setAbsoluteSize(null, 100, 200);
 *
 * @method setSizeMode
 *
 * @param {SizeMode} x    The size mode being used for determining the size in
 *                        x direction ("width").
 * @param {SizeMode} y    The size mode being used for determining the size in
 *                        y direction ("height").
 * @param {SizeMode} z    The size mode being used for determining the size in
 *                        z direction ("depth").
 *
 * @return {Node} this
 */Node.prototype.setSizeMode=function setSizeMode(x,y,z){if(!this.constructor.NO_DEFAULT_COMPONENTS)this.getComponent(this._sizeID).setSizeMode(x,y,z);else if(this.isMounted())SizeSystem.get(this.getLocation()).setSizeMode(x,y,z);else throw new Error('This node does not have access to a size component');return this;};/**
 * A proportional size defines the node's dimensions relative to its parents
 * final size.
 * Proportional sizes need to be within the range of [0, 1].
 *
 * @method setProportionalSize
 *
 * @param {Number} x    x-Size in pixels ("width").
 * @param {Number} y    y-Size in pixels ("height").
 * @param {Number} z    z-Size in pixels ("depth").
 *
 * @return {Node} this
 */Node.prototype.setProportionalSize=function setProportionalSize(x,y,z){if(!this.constructor.NO_DEFAULT_COMPONENTS)this.getComponent(this._sizeID).setProportional(x,y,z);else if(this.isMounted())SizeSystem.get(this.getLocation()).setProportional(x,y,z);else throw new Error('This node does not have access to a size component');return this;};/**
 * Differential sizing can be used to add or subtract an absolute size from an
 * otherwise proportionally sized node.
 * E.g. a differential width of `-10` and a proportional width of `0.5` is
 * being interpreted as setting the node's size to 50% of its parent's width
 * *minus* 10 pixels.
 *
 * @method setDifferentialSize
 *
 * @param {Number} x    x-Size to be added to the relatively sized node in
 *                      pixels ("width").
 * @param {Number} y    y-Size to be added to the relatively sized node in
 *                      pixels ("height").
 * @param {Number} z    z-Size to be added to the relatively sized node in
 *                      pixels ("depth").
 *
 * @return {Node} this
 */Node.prototype.setDifferentialSize=function setDifferentialSize(x,y,z){if(!this.constructor.NO_DEFAULT_COMPONENTS)this.getComponent(this._sizeID).setDifferential(x,y,z);else if(this.isMounted())SizeSystem.get(this.getLocation()).setDifferential(x,y,z);else throw new Error('This node does not have access to a size component');return this;};/**
 * Sets the node's size in pixels, independent of its parent.
 *
 * @method setAbsoluteSize
 *
 * @param {Number} x x-Size in pixels ("width").
 * @param {Number} y y-Size in pixels ("height").
 * @param {Number} z z-Size in pixels ("depth").
 *
 * @return {Node} this
 */Node.prototype.setAbsoluteSize=function setAbsoluteSize(x,y,z){if(!this.constructor.NO_DEFAULT_COMPONENTS)this.getComponent(this._sizeID).setAbsolute(x,y,z);else if(this.isMounted())SizeSystem.get(this.getLocation()).setAbsolute(x,y,z);else throw new Error('This node does not have access to a size component');return this;};/**
 * Method for getting the current frame. Will be deprecated.
 *
 * @method
 *
 * @return {Number} current frame
 */Node.prototype.getFrame=function getFrame(){return this._updater.getFrame();};/**
 * returns an array of the components currently attached to this
 * node.
 *
 * @method getComponents
 *
 * @return {Array} list of components.
 */Node.prototype.getComponents=function getComponents(){return this._components;};/**
 * Enters the node's update phase while updating its own spec and updating its components.
 *
 * @method update
 *
 * @param  {Number} time    high-resolution timestamp, usually retrieved using
 *                          requestAnimationFrame
 *
 * @return {Node} this
 */Node.prototype.update=function update(time){this._inUpdate=true;var nextQueue=this._nextUpdateQueue;var queue=this._updateQueue;var item;while(nextQueue.length){queue.unshift(nextQueue.pop());}while(queue.length){item=this._components[queue.shift()];if(item&&item.onUpdate)item.onUpdate(time);}this._inUpdate=false;this._requestingUpdate=false;if(!this.isMounted()){// last update
this._parent=null;this._id=null;}else if(this._nextUpdateQueue.length){this._updater.requestUpdateOnNextTick(this);this._requestingUpdate=true;}return this;};/**
 * Mounts the node and therefore its subtree by setting it as a child of the
 * passed in parent.
 *
 * @method mount
 *
 * @param  {String} path unique path of node (e.g. `body/0/1`)
 *
 * @return {Node} this
 */Node.prototype.mount=function mount(path){if(this.isMounted())throw new Error('Node is already mounted at: '+this.getLocation());if(!this.constructor.NO_DEFAULT_COMPONENTS){TransformSystem.registerTransformAtPath(path,this.getComponent(this._transformID));SizeSystem.registerSizeAtPath(path,this.getComponent(this._sizeID));}else{TransformSystem.registerTransformAtPath(path);SizeSystem.registerSizeAtPath(path);}Dispatch.mount(path,this);if(!this._requestingUpdate)this._requestUpdate();return this;};/**
 * Dismounts (detaches) the node from the scene graph by removing it as a
 * child of its parent.
 *
 * @method
 *
 * @return {Node} this
 */Node.prototype.dismount=function dismount(){if(!this.isMounted())throw new Error('Node is not mounted');var path=this.getLocation();TransformSystem.deregisterTransformAtPath(path);SizeSystem.deregisterSizeAtPath(path);Dispatch.dismount(path);if(!this._requestingUpdate)this._requestUpdate();};module.exports=Node;},{"./Dispatch":10,"./Size":17,"./SizeSystem":18,"./Transform":19,"./TransformSystem":20}],14:[function(require,module,exports){/**
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
     */getSelector:function getSelector(path){var index=path.indexOf('/');return index===-1?path:path.substring(0,index);}};module.exports=Path;},{}],15:[function(require,module,exports){/**
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
 *//*jshint -W079 */'use strict';var PathUtils=require('./Path');/**
 * A class that can be used to associate any item with a path.
 * Items and paths are kept in flat arrays for easy iteration
 * and a memo is used to provide constant time lookup.
 *
 * @class
 *
 */function PathStore(){this.items=[];this.paths=[];this.memo={};}/**
 * Associates an item with the given path. Errors if an item
 * already exists at the given path.
 *
 * @method
 *
 * @param {String} path The path at which to insert the item
 * @param {Any} item The item to associate with the given path.
 *
 * @return {undefined} undefined
 */PathStore.prototype.insert=function(path,item){var parent=PathUtils.parent(path);var paths=this.paths;var index=paths.indexOf(path);var i=paths.length;if(index!==-1)throw new Error('item already exists at path: '+path);if(i){// The item will be inserted at a point in the array
// such that it is within its own breadth in the tree
// that the paths represent
while(!this.memo.hasOwnProperty(parent)){parent=PathUtils.parent(parent);}parent=paths.indexOf(parent);index=1+parent;while(index<i&&PathUtils.isDescendentOf(paths[index],paths[parent])){index++;}i=index;}// insert the items in the path
paths.splice(i,0,path);this.items.splice(i,0,item);// store the relationship between path and index in the memo
this.memo[path]=i;// all items behind the inserted item are now no longer
// accurately stored in the memo. Thus the memo must be cleared for
// these items.
for(var len=this.paths.length;i<len;i++){this.memo[this.paths[i]]=null;}};/**
 * Removes the the item from the store at the given path.
 * Errors if no item exists at the given path.
 *
 * @method
 *
 * @param {String} path The path at which to remove the item.
 *
 * @return {undefined} undefined
 */PathStore.prototype.remove=function remove(path){var paths=this.paths;var index=this.memo[path]?this.memo[path]:paths.indexOf(path);if(index===-1)throw new Error('Cannot remove. No item exists at path: '+path);paths.splice(index,1);this.items.splice(index,1);this.memo[path]=null;for(var len=this.paths.length;index<len;index++){this.memo[this.paths[index]]=null;}};/**
 * Returns the item stored at the current path. Returns undefined
 * if no item is stored at that path.
 *
 * @method
 *
 * @param {String} path The path to lookup the item for
 *
 * @return {Any | undefined} the item stored or undefined
 */PathStore.prototype.get=function get(path){if(this.memo[path])return this.items[this.memo[path]];var index=this.paths.indexOf(path);if(index===-1)return void 0;this.memo[path]=index;return this.items[index];};/**
 * Returns an array of the items currently stored in this
 * PathStore.
 *
 * @method
 *
 * @return {Array} items currently stored
 */PathStore.prototype.getItems=function getItems(){return this.items;};/**
 * Returns an array of the paths currently stored in this
 * PathStore.
 *
 * @method
 *
 * @return {Array} paths currently stored
 */PathStore.prototype.getPaths=function getPaths(){return this.paths;};module.exports=PathStore;},{"./Path":14}],16:[function(require,module,exports){/**
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
 *//*jshint -W079 */'use strict';var Node=require('./Node');var Dispatch=require('./Dispatch');var Commands=require('./Commands');var TransformSystem=require('./TransformSystem');var SizeSystem=require('./SizeSystem');/**
 * Scene is the bottom of the scene graph. It is its own
 * parent and provides the global updater to the scene graph.
 *
 * @class Scene
 * @constructor
 * @extends Node
 *
 * @param {String} selector a string which is a dom selector
 *                 signifying which dom element the context
 *                 should be set upon
 * @param {Famous} updater a class which conforms to Famous' interface
 *                 it needs to be able to send methods to
 *                 the renderers and update nodes in the scene graph
 */function Scene(selector,updater){if(!selector)throw new Error('Scene needs to be created with a DOM selector');if(!updater)throw new Error('Scene needs to be created with a class like Famous');Node.call(this);// Scene inherits from node
this._globalUpdater=updater;// The updater that will both
// send messages to the renderers
// and update dirty nodes
this._selector=selector;// reference to the DOM selector
// that represents the element
// in the dom that this context
// inhabits
this.mount(selector);// Mount the context to itself
// (it is its own parent)
this._globalUpdater// message a request for the dom
.message(Commands.NEED_SIZE_FOR)// size of the context so that
.message(selector);// the scene graph has a total size
this.show();// the context begins shown (it's already present in the dom)
}// Scene inherits from node
Scene.prototype=Object.create(Node.prototype);Scene.prototype.constructor=Scene;Scene.NO_DEFAULT_COMPONENTS=true;/**
 * Scene getUpdater function returns the passed in updater
 *
 * @return {Famous} the updater for this Scene
 */Scene.prototype.getUpdater=function getUpdater(){return this._updater;};/**
 * Returns the selector that the context was instantiated with
 *
 * @return {String} dom selector
 */Scene.prototype.getSelector=function getSelector(){return this._selector;};/**
 * Returns the dispatcher of the context. Used to send events
 * to the nodes in the scene graph.
 *
 * @return {Dispatch} the Scene's Dispatch
 * @deprecated
 */Scene.prototype.getDispatch=function getDispatch(){console.warn('Scene#getDispatch is deprecated, require the dispatch directly');return Dispatch;};/**
 * Receives an event. If the event is 'CONTEXT_RESIZE' it sets the size of the scene
 * graph to the payload, which must be an array of numbers of at least
 * length three representing the pixel size in 3 dimensions.
 *
 * @param {String} event the name of the event being received
 * @param {*} payload the object being sent
 *
 * @return {undefined} undefined
 */Scene.prototype.onReceive=function onReceive(event,payload){// TODO: In the future the dom element that the context is attached to
// should have a representation as a component. It would be render sized
// and the context would receive its size the same way that any render size
// component receives its size.
if(event==='CONTEXT_RESIZE'){if(payload.length<2)throw new Error('CONTEXT_RESIZE\'s payload needs to be at least a pair'+' of pixel sizes');this.setSizeMode('absolute','absolute','absolute');this.setAbsoluteSize(payload[0],payload[1],payload[2]?payload[2]:0);this._updater.message(Commands.WITH).message(this._selector).message(Commands.READY);}};Scene.prototype.mount=function mount(path){if(this.isMounted())throw new Error('Scene is already mounted at: '+this.getLocation());Dispatch.mount(path,this);this._id=path;this._mounted=true;this._parent=this;TransformSystem.registerTransformAtPath(path);SizeSystem.registerSizeAtPath(path);};module.exports=Scene;},{"./Commands":8,"./Dispatch":10,"./Node":13,"./SizeSystem":18,"./TransformSystem":20}],17:[function(require,module,exports){/**
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
 */'use strict';var ONES=[1,1,1];var ZEROS=[0,0,0];/**
 * The Size class is responsible for processing Size from a node
 * @constructor Size
 *
 * @param {Size} parent the parent size
 */function Size(parent){this.finalSize=new Float32Array(3);this.sizeChanged=false;this.sizeMode=new Uint8Array(3);this.sizeModeChanged=false;this.absoluteSize=new Float32Array(3);this.absoluteSizeChanged=false;this.proportionalSize=new Float32Array(ONES);this.proportionalSizeChanged=false;this.differentialSize=new Float32Array(3);this.differentialSizeChanged=false;this.renderSize=new Float32Array(3);this.renderSizeChanged=false;this.parent=parent!=null?parent:null;}// an enumeration of the different types of size modes
Size.RELATIVE=0;Size.ABSOLUTE=1;Size.RENDER=2;Size.DEFAULT=Size.RELATIVE;/**
 * Private method which sets a value within an array
 * and report if the value has changed.
 *
 * @method
 *
 * @param {Array} vec The array to set the value in
 * @param {Number} index The index at which to set the value
 * @param {Any} val If the val is undefined or null, or if the value
 *                  is the same as what is already there, then nothing
 *                  is set.
 *
 * @return {Boolean} returns true if anything changed
 */function _vecOptionalSet(vec,index,val){if(val!=null&&vec[index]!==val){vec[index]=val;return true;}else return false;}/**
 * Private method which sets three values within an array of three
 * using _vecOptionalSet. Returns whether anything has changed.
 *
 * @method
 *
 * @param {Array} vec The array to set the values of
 * @param {Any} x The first value to set within the array
 * @param {Any} y The second value to set within the array
 * @param {Any} z The third value to set within the array
 *
 * @return {Boolean} whether anything has changed
 */function setVec(vec,x,y,z){var propagate=false;propagate=_vecOptionalSet(vec,0,x)||propagate;propagate=_vecOptionalSet(vec,1,y)||propagate;propagate=_vecOptionalSet(vec,2,z)||propagate;return propagate;}/**
 * Private method to allow for polymorphism in the size mode such that strings
 * or the numbers from the enumeration can be used.
 *
 * @method
 *
 * @param {String|Number} val The Size mode to resolve.
 *
 * @return {Number} the resolved size mode from the enumeration.
 */function resolveSizeMode(val){if(val.constructor===String){switch(val.toLowerCase()){case'relative':case'default':return Size.RELATIVE;case'absolute':return Size.ABSOLUTE;case'render':return Size.RENDER;default:throw new Error('unknown size mode: '+val);}}else if(val<0||val>Size.RENDER)throw new Error('unknown size mode: '+val);return val;}/**
 * Sets the parent of this size.
 *
 * @method
 *
 * @param {Size} parent The parent size component
 *
 * @return {Size} this
 */Size.prototype.setParent=function setParent(parent){this.parent=parent;return this;};/**
 * Gets the parent of this size.
 *
 * @method
 *
 * @returns {Size|undefined} the parent if one exists
 */Size.prototype.getParent=function getParent(){return this.parent;};/**
 * Gets the size mode of this size representation
 *
 * @method
 *
 * @param {Number} x the size mode to use for the width
 * @param {Number} y the size mode to use for the height
 * @param {Number} z the size mode to use for the depth
 *
 * @return {array} array of size modes
 */Size.prototype.setSizeMode=function setSizeMode(x,y,z){if(x!=null)x=resolveSizeMode(x);if(y!=null)y=resolveSizeMode(y);if(z!=null)z=resolveSizeMode(z);this.sizeModeChanged=setVec(this.sizeMode,x,y,z);return this;};/**
 * Returns the size mode of this component.
 *
 * @method
 *
 * @return {Array} the current size mode of the this.
 */Size.prototype.getSizeMode=function getSizeMode(){return this.sizeMode;};/**
 * Sets the absolute size of this size representation.
 *
 * @method
 *
 * @param {Number} x The x dimension of the absolute size
 * @param {Number} y The y dimension of the absolute size
 * @param {Number} z The z dimension of the absolute size
 *
 * @return {Size} this
 */Size.prototype.setAbsolute=function setAbsolute(x,y,z){this.absoluteSizeChanged=setVec(this.absoluteSize,x,y,z);return this;};/**
 * Gets the absolute size of this size representation
 *
 * @method
 *
 * @return {array} array of absolute size
 */Size.prototype.getAbsolute=function getAbsolute(){return this.absoluteSize;};/**
 * Sets the proportional size of this size representation.
 *
 * @method
 *
 * @param {Number} x The x dimension of the proportional size
 * @param {Number} y The y dimension of the proportional size
 * @param {Number} z The z dimension of the proportional size
 *
 * @return {Size} this
 */Size.prototype.setProportional=function setProportional(x,y,z){this.proportionalSizeChanged=setVec(this.proportionalSize,x,y,z);return this;};/**
 * Gets the propotional size of this size representation
 *
 * @method
 *
 * @return {array} array of proportional size
 */Size.prototype.getProportional=function getProportional(){return this.proportionalSize;};/**
 * Sets the differential size of this size representation.
 *
 * @method
 *
 * @param {Number} x The x dimension of the differential size
 * @param {Number} y The y dimension of the differential size
 * @param {Number} z The z dimension of the differential size
 *
 * @return {Size} this
 */Size.prototype.setDifferential=function setDifferential(x,y,z){this.differentialSizeChanged=setVec(this.differentialSize,x,y,z);return this;};/**
 * Gets the differential size of this size representation
 *
 * @method
 *
 * @return {array} array of differential size
 */Size.prototype.getDifferential=function getDifferential(){return this.differentialSize;};/**
 * Sets the size of this size representation.
 *
 * @method
 *
 * @param {Number} x The x dimension of the size
 * @param {Number} y The y dimension of the size
 * @param {Number} z The z dimension of the size
 *
 * @return {Size} this
 */Size.prototype.get=function get(){return this.finalSize;};/**
 * fromSpecWithParent takes the parent node's size, the target node's spec,
 * and a target array to write to. Using the node's size mode it calculates
 * a final size for the node from the node's spec. Returns whether or not
 * the final size has changed from its last value.
 *
 * @method
 *
 * @param {Array} components the node's components
 *
 * @return {Boolean} true if the size of the node has changed.
 */Size.prototype.fromComponents=function fromComponents(components){var mode=this.sizeMode;var target=this.finalSize;var parentSize=this.parent?this.parent.get():ZEROS;var prev;var changed=false;var len=components.length;var j;for(var i=0;i<3;i++){prev=target[i];switch(mode[i]){case Size.RELATIVE:target[i]=parentSize[i]*this.proportionalSize[i]+this.differentialSize[i];break;case Size.ABSOLUTE:target[i]=this.absoluteSize[i];break;case Size.RENDER:var candidate;var component;for(j=0;j<len;j++){component=components[j];if(component&&component.getRenderSize){candidate=component.getRenderSize()[i];target[i]=target[i]<candidate||target[i]===0?candidate:target[i];}}break;}changed=changed||prev!==target[i];}this.sizeChanged=changed;return changed;};module.exports=Size;},{}],18:[function(require,module,exports){/**
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
 */'use strict';var PathStore=require('./PathStore');var Size=require('./Size');var Dispatch=require('./Dispatch');var PathUtils=require('./Path');/**
 * The size system is used to calculate size throughout the scene graph.
 * It holds size components and operates upon them.
 *
 * @constructor
 */function SizeSystem(){this.pathStore=new PathStore();}/**
 * Registers a size component to a give path. A size component can be passed as the second argument
 * or a default one will be created. Throws if no size component has been added at the parent path.
 *
 * @method
 *
 * @param {String} path The path at which to register the size component
 * @param {Size | undefined} size The size component to be registered or undefined.
 *
 * @return {undefined} undefined
 */SizeSystem.prototype.registerSizeAtPath=function registerSizeAtPath(path,size){if(!PathUtils.depth(path))return this.pathStore.insert(path,size?size:new Size());var parent=this.pathStore.get(PathUtils.parent(path));if(!parent)throw new Error('No parent size registered at expected path: '+PathUtils.parent(path));if(size)size.setParent(parent);this.pathStore.insert(path,size?size:new Size(parent));};/**
 * Removes the size component from the given path. Will throw if no component is at that
 * path
 *
 * @method
 *
 * @param {String} path The path at which to remove the size.
 *
 * @return {undefined} undefined
 */SizeSystem.prototype.deregisterSizeAtPath=function deregisterSizeAtPath(path){this.pathStore.remove(path);};/**
 * Returns the size component stored at a given path. Returns undefined if no
 * size component is registered to that path.
 *
 * @method
 *
 * @param {String} path The path at which to get the size component.
 *
 * @return {undefined} undefined
 */SizeSystem.prototype.get=function get(path){return this.pathStore.get(path);};/**
 * Updates the sizes in the scene graph. Called internally by the famous engine.
 *
 * @method
 *
 * @return {undefined} undefined
 */SizeSystem.prototype.update=function update(){var sizes=this.pathStore.getItems();var paths=this.pathStore.getPaths();var node;var size;var i;var len;var components;var j;for(i=0,len=sizes.length;i<len;i++){node=Dispatch.getNode(paths[i]);components=node.getComponents();if(!node)continue;if(!node.showInEngine()){j=i+1;while(j<len&&PathUtils.isDescendentOf(paths[j],paths[i])){j++;}i=j-1;continue;}size=sizes[i];if(size.sizeModeChanged)sizeModeChanged(node,components,size);if(size.absoluteSizeChanged)absoluteSizeChanged(node,components,size);if(size.proportionalSizeChanged)proportionalSizeChanged(node,components,size);if(size.differentialSizeChanged)differentialSizeChanged(node,components,size);if(size.renderSizeChanged)renderSizeChanged(node,components,size);if(size.fromComponents(components))sizeChanged(node,components,size);}};// private methods
/**
 * Private method to alert the node and components that size mode changed.
 *
 * @method
 * @private
 *
 * @param {Node} node Node to potentially call sizeModeChanged on
 * @param {Array} components a list of the nodes' components
 * @param {Size} size the size class for the Node
 *
 * @return {undefined} undefined
 */function sizeModeChanged(node,components,size){var sizeMode=size.getSizeMode();var x=sizeMode[0];var y=sizeMode[1];var z=sizeMode[2];if(node.onSizeModeChange)node.onSizeModeChange(x,y,z);for(var i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onSizeModeChange)components[i].onSizeModeChange(x,y,z);}size.sizeModeChanged=false;}/**
 * Private method to alert the node and components that absoluteSize changed.
 *
 * @method
 * @private
 *
 * @param {Node} node Node to potentially call onAbsoluteSizeChange on
 * @param {Array} components a list of the nodes' components
 * @param {Size} size the size class for the Node
 *
 * @return {undefined} undefined
 */function absoluteSizeChanged(node,components,size){var absoluteSize=size.getAbsolute();var x=absoluteSize[0];var y=absoluteSize[1];var z=absoluteSize[2];if(node.onAbsoluteSizeChange)node.onAbsoluteSizeChange(x,y,z);for(var i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onAbsoluteSizeChange)components[i].onAbsoluteSizeChange(x,y,z);}size.absoluteSizeChanged=false;}/**
 * Private method to alert the node and components that the proportional size changed.
 *
 * @method
 * @private
 *
 * @param {Node} node Node to potentially call onProportionalSizeChange on
 * @param {Array} components a list of the nodes' components
 * @param {Size} size the size class for the Node
 *
 * @return {undefined} undefined
 */function proportionalSizeChanged(node,components,size){var proportionalSize=size.getProportional();var x=proportionalSize[0];var y=proportionalSize[1];var z=proportionalSize[2];if(node.onProportionalSizeChange)node.onProportionalSizeChange(x,y,z);for(var i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onProportionalSizeChange)components[i].onProportionalSizeChange(x,y,z);}size.proportionalSizeChanged=false;}/**
 * Private method to alert the node and components that differential size changed.
 *
 * @method
 * @private
 *
 * @param {Node} node Node to potentially call onDifferentialSize on
 * @param {Array} components a list of the nodes' components
 * @param {Size} size the size class for the Node
 *
 * @return {undefined} undefined
 */function differentialSizeChanged(node,components,size){var differentialSize=size.getDifferential();var x=differentialSize[0];var y=differentialSize[1];var z=differentialSize[2];if(node.onDifferentialSizeChange)node.onDifferentialSizeChange(x,y,z);for(var i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onDifferentialSizeChange)components[i].onDifferentialSizeChange(x,y,z);}size.differentialSizeChanged=false;}/**
 * Private method to alert the node and components that render size changed.
 *
 * @method
 * @private
 *
 * @param {Node} node Node to potentially call onRenderSizeChange on
 * @param {Array} components a list of the nodes' components
 * @param {Size} size the size class for the Node
 *
 * @return {undefined} undefined
 */function renderSizeChanged(node,components,size){var renderSize=size.getRenderSize();var x=renderSize[0];var y=renderSize[1];var z=renderSize[2];if(node.onRenderSizeChange)node.onRenderSizeChange(x,y,z);for(var i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onRenderSizeChange)components[i].onRenderSizeChange(x,y,z);}size.renderSizeChanged=false;}/**
 * Private method to alert the node and components that the size changed.
 *
 * @method
 * @private
 *
 * @param {Node} node Node to potentially call onSizeChange on
 * @param {Array} components a list of the nodes' components
 * @param {Size} size the size class for the Node
 *
 * @return {undefined} undefined
 */function sizeChanged(node,components,size){var finalSize=size.get();var x=finalSize[0];var y=finalSize[1];var z=finalSize[2];if(node.onSizeChange)node.onSizeChange(x,y,z);for(var i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onSizeChange)components[i].onSizeChange(x,y,z);}size.sizeChanged=false;}module.exports=new SizeSystem();},{"./Dispatch":10,"./Path":14,"./PathStore":15,"./Size":17}],19:[function(require,module,exports){/**
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
 */'use strict';var QUAT=[0,0,0,1];var ONES=[1,1,1];/**
 * The transform class is responsible for calculating the transform of a particular
 * node from the data on the node and its parent
 *
 * @constructor Transform
 *
 * @param {Transform} parent the parent Transform
 */function Transform(parent){this.local=new Float32Array(Transform.IDENT);this.global=new Float32Array(Transform.IDENT);this.offsets={align:new Float32Array(3),alignChanged:false,mountPoint:new Float32Array(3),mountPointChanged:false,origin:new Float32Array(3),originChanged:false};this.vectors={position:new Float32Array(3),positionChanged:false,rotation:new Float32Array(QUAT),rotationChanged:false,scale:new Float32Array(ONES),scaleChanged:false};this._lastEulerVals=[0,0,0];this._lastEuler=false;this.parent=parent?parent:null;this.breakPoint=false;this.calculatingWorldMatrix=false;}Transform.IDENT=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];Transform.WORLD_CHANGED=1;Transform.LOCAL_CHANGED=2;/**
 * resets the transform state such that it no longer has a parent
 * and is not a breakpoint.
 *
 * @method
 *
 * @return {undefined} undefined
 */Transform.prototype.reset=function reset(){this.parent=null;this.breakPoint=false;this.calculatingWorldMatrix=false;};/**
 * sets the parent of this transform.
 *
 * @method
 *
 * @param {Transform} parent The transform class that parents this class
 *
 * @return {undefined} undefined
 */Transform.prototype.setParent=function setParent(parent){this.parent=parent;};/**
 * returns the parent of this transform
 *
 * @method
 *
 * @return {Transform | null} the parent of this transform if one exists
 */Transform.prototype.getParent=function getParent(){return this.parent;};/**
 * Makes this transform a breakpoint. This will cause it to calculate
 * both a local (relative to the nearest ancestor breakpoint) and a world
 * matrix (relative to the scene).
 *
 * @method
 *
 * @return {undefined} undefined
 */Transform.prototype.setBreakPoint=function setBreakPoint(){this.breakPoint=true;this.calculatingWorldMatrix=true;};/**
 * Set this node to calculate the world matrix.
 *
 * @method
 *
 * @return {undefined} undefined
 */Transform.prototype.setCalculateWorldMatrix=function setCalculateWorldMatrix(){this.calculatingWorldMatrix=true;};/**
 * returns whether or not this transform is a breakpoint.
 *
 * @method
 *
 * @return {Boolean} true if this transform is a breakpoint
 */Transform.prototype.isBreakPoint=function isBreakPoint(){return this.breakPoint;};/**
 * returns the local transform
 *
 * @method
 *
 * @return {Float32Array} local transform
 */Transform.prototype.getLocalTransform=function getLocalTransform(){return this.local;};/**
 * returns the world transform. Requires that this transform is a breakpoint.
 *
 * @method
 *
 * @return {Float32Array} world transform.
 */Transform.prototype.getWorldTransform=function getWorldTransform(){if(!this.isBreakPoint()&&!this.calculatingWorldMatrix)throw new Error('This transform is not calculating world transforms');return this.global;};/**
 * Takes a node and calculates the proper transform from it.
 *
 * @method
 *
 * @param {Node} node the node to calculate the transform from
 *
 * @return {undefined} undefined
 */Transform.prototype.calculate=function calculate(node){if(!this.parent||this.parent.isBreakPoint())return fromNode(node,this);else return fromNodeWithParent(node,this);};/**
 * A private method to potentially set a value within an
 * array. Will set the value if a value was given
 * for the third argument and if that value is different
 * than the value that is currently in the array at the given index.
 * Returns true if a value was set and false if not.
 *
 * @method
 *
 * @param {Array} vec The array to set the value within
 * @param {Number} index The index at which to set the value
 * @param {Any} val The value to potentially set in the array
 *
 * @return {Boolean} whether or not a value was set
 */function _vecOptionalSet(vec,index,val){if(val!=null&&vec[index]!==val){vec[index]=val;return true;}else return false;}/**
 * private method to set values within an array.
 * Returns whether or not the array has been changed.
 *
 * @method
 *
 * @param {Array} vec The vector to be operated upon
 * @param {Number | null | undefined} x The x value of the vector
 * @param {Number | null | undefined} y The y value of the vector
 * @param {Number | null | undefined} z The z value of the vector
 * @param {Number | null | undefined} w the w value of the vector
 *
 * @return {Boolean} whether or not the array was changed
 */function setVec(vec,x,y,z,w){var propagate=false;propagate=_vecOptionalSet(vec,0,x)||propagate;propagate=_vecOptionalSet(vec,1,y)||propagate;propagate=_vecOptionalSet(vec,2,z)||propagate;if(w!=null)propagate=_vecOptionalSet(vec,3,w)||propagate;return propagate;}/**
 * Gets the position component of the transform
 *
 * @method
 *
 * @return {Float32Array} the position component of the transform
 */Transform.prototype.getPosition=function getPosition(){return this.vectors.position;};/**
 * Sets the position component of the transform.
 *
 * @method
 *
 * @param {Number} x The x dimension of the position
 * @param {Number} y The y dimension of the position
 * @param {Number} z The z dimension of the position
 *
 * @return {undefined} undefined
 */Transform.prototype.setPosition=function setPosition(x,y,z){this.vectors.positionChanged=setVec(this.vectors.position,x,y,z);};/**
 * Gets the rotation component of the transform. Will return a quaternion.
 *
 * @method
 *
 * @return {Float32Array} the quaternion representation of the transform's rotation
 */Transform.prototype.getRotation=function getRotation(){return this.vectors.rotation;};/**
 * Sets the rotation component of the transform. Can take either Euler
 * angles or a quaternion.
 *
 * @method
 *
 * @param {Number} x The rotation about the x axis or the extent in the x dimension
 * @param {Number} y The rotation about the y axis or the extent in the y dimension
 * @param {Number} z The rotation about the z axis or the extent in the z dimension
 * @param {Number} w The rotation about the proceeding vector
 *
 * @return {undefined} undefined
 */Transform.prototype.setRotation=function setRotation(x,y,z,w){var quat=this.vectors.rotation;var qx,qy,qz,qw;if(w!=null){qx=x;qy=y;qz=z;qw=w;this._lastEulerVals[0]=null;this._lastEulerVals[1]=null;this._lastEulerVals[2]=null;this._lastEuler=false;}else{if(x==null||y==null||z==null){if(this._lastEuler){x=x==null?this._lastEulerVals[0]:x;y=y==null?this._lastEulerVals[1]:y;z=z==null?this._lastEulerVals[2]:z;}else{var sp=-2*(quat[1]*quat[2]-quat[3]*quat[0]);if(Math.abs(sp)>0.99999){y=y==null?Math.PI*0.5*sp:y;x=x==null?Math.atan2(-quat[0]*quat[2]+quat[3]*quat[1],0.5-quat[1]*quat[1]-quat[2]*quat[2]):x;z=z==null?0:z;}else{y=y==null?Math.asin(sp):y;x=x==null?Math.atan2(quat[0]*quat[2]+quat[3]*quat[1],0.5-quat[0]*quat[0]-quat[1]*quat[1]):x;z=z==null?Math.atan2(quat[0]*quat[1]+quat[3]*quat[2],0.5-quat[0]*quat[0]-quat[2]*quat[2]):z;}}}var hx=x*0.5;var hy=y*0.5;var hz=z*0.5;var sx=Math.sin(hx);var sy=Math.sin(hy);var sz=Math.sin(hz);var cx=Math.cos(hx);var cy=Math.cos(hy);var cz=Math.cos(hz);var sysz=sy*sz;var cysz=cy*sz;var sycz=sy*cz;var cycz=cy*cz;qx=sx*cycz+cx*sysz;qy=cx*sycz-sx*cysz;qz=cx*cysz+sx*sycz;qw=cx*cycz-sx*sysz;this._lastEuler=true;this._lastEulerVals[0]=x;this._lastEulerVals[1]=y;this._lastEulerVals[2]=z;}this.vectors.rotationChanged=setVec(quat,qx,qy,qz,qw);};/**
 * Gets the scale component of the transform
 *
 * @method
 *
 * @return {Float32Array} the scale component of the transform
 */Transform.prototype.getScale=function getScale(){return this.vectors.scale;};/**
 * Sets the scale component of the transform.
 *
 * @method
 *
 * @param {Number | null | undefined} x The x dimension of the scale
 * @param {Number | null | undefined} y The y dimension of the scale
 * @param {Number | null | undefined} z The z dimension of the scale
 *
 * @return {undefined} undefined
 */Transform.prototype.setScale=function setScale(x,y,z){this.vectors.scaleChanged=setVec(this.vectors.scale,x,y,z);};/**
 * Gets the align value of the transform
 *
 * @method
 *
 * @return {Float32Array} the align value of the transform
 */Transform.prototype.getAlign=function getAlign(){return this.offsets.align;};/**
 * Sets the align value of the transform.
 *
 * @method
 *
 * @param {Number | null | undefined} x The x dimension of the align
 * @param {Number | null | undefined} y The y dimension of the align
 * @param {Number | null | undefined} z The z dimension of the align
 *
 * @return {undefined} undefined
 */Transform.prototype.setAlign=function setAlign(x,y,z){this.offsets.alignChanged=setVec(this.offsets.align,x,y,z!=null?z-0.5:z);};/**
 * Gets the mount point value of the transform.
 *
 * @method
 *
 * @return {Float32Array} the mount point of the transform
 */Transform.prototype.getMountPoint=function getMountPoint(){return this.offsets.mountPoint;};/**
 * Sets the mount point value of the transform.
 *
 * @method
 *
 * @param {Number | null | undefined} x the x dimension of the mount point
 * @param {Number | null | undefined} y the y dimension of the mount point
 * @param {Number | null | undefined} z the z dimension of the mount point
 *
 * @return {undefined} undefined
 */Transform.prototype.setMountPoint=function setMountPoint(x,y,z){this.offsets.mountPointChanged=setVec(this.offsets.mountPoint,x,y,z!=null?z-0.5:z);};/**
 * Gets the origin of the transform.
 *
 * @method
 *
 * @return {Float32Array} the origin
 */Transform.prototype.getOrigin=function getOrigin(){return this.offsets.origin;};/**
 * Sets the origin of the transform.
 *
 * @method
 *
 * @param {Number | null | undefined} x the x dimension of the origin
 * @param {Number | null | undefined} y the y dimension of the origin
 * @param {Number | null | undefined} z the z dimension of the origin
 *
 * @return {undefined} undefined
 */Transform.prototype.setOrigin=function setOrigin(x,y,z){this.offsets.originChanged=setVec(this.offsets.origin,x,y,z!=null?z-0.5:z);};/**
 * Calculates the world for this particular transform.
 *
 * @method
 *
 * @return {undefined} undefined
 */Transform.prototype.calculateWorldMatrix=function calculateWorldMatrix(){var nearestBreakPoint=this.parent;while(nearestBreakPoint&&!nearestBreakPoint.isBreakPoint()){nearestBreakPoint=nearestBreakPoint.parent;}if(nearestBreakPoint)return multiply(this.global,nearestBreakPoint.getWorldTransform(),this.local);else{for(var i=0;i<16;i++){this.global[i]=this.local[i];}return false;}};/**
 * Private function. Creates a transformation matrix from a Node's spec.
 *
 * @param {Node} node the node to create a transform for
 * @param {Transform} transform transform to apply
 *
 * @return {Boolean} whether or not the target array was changed
 */function fromNode(node,transform){var target=transform.getLocalTransform();var mySize=node.getSize();var vectors=transform.vectors;var offsets=transform.offsets;var parentSize=node.getParent().getSize();var changed=0;var t00=target[0];var t01=target[1];var t02=target[2];var t10=target[4];var t11=target[5];var t12=target[6];var t20=target[8];var t21=target[9];var t22=target[10];var t30=target[12];var t31=target[13];var t32=target[14];var posX=vectors.position[0];var posY=vectors.position[1];var posZ=vectors.position[2];var rotX=vectors.rotation[0];var rotY=vectors.rotation[1];var rotZ=vectors.rotation[2];var rotW=vectors.rotation[3];var scaleX=vectors.scale[0];var scaleY=vectors.scale[1];var scaleZ=vectors.scale[2];var alignX=offsets.align[0]*parentSize[0];var alignY=offsets.align[1]*parentSize[1];var alignZ=offsets.align[2]*parentSize[2];var mountPointX=offsets.mountPoint[0]*mySize[0];var mountPointY=offsets.mountPoint[1]*mySize[1];var mountPointZ=offsets.mountPoint[2]*mySize[2];var originX=offsets.origin[0]*mySize[0];var originY=offsets.origin[1]*mySize[1];var originZ=offsets.origin[2]*mySize[2];var wx=rotW*rotX;var wy=rotW*rotY;var wz=rotW*rotZ;var xx=rotX*rotX;var yy=rotY*rotY;var zz=rotZ*rotZ;var xy=rotX*rotY;var xz=rotX*rotZ;var yz=rotY*rotZ;target[0]=(1-2*(yy+zz))*scaleX;target[1]=2*(xy+wz)*scaleX;target[2]=2*(xz-wy)*scaleX;target[3]=0;target[4]=2*(xy-wz)*scaleY;target[5]=(1-2*(xx+zz))*scaleY;target[6]=2*(yz+wx)*scaleY;target[7]=0;target[8]=2*(xz+wy)*scaleZ;target[9]=2*(yz-wx)*scaleZ;target[10]=(1-2*(xx+yy))*scaleZ;target[11]=0;target[12]=alignX+posX-mountPointX+originX-(target[0]*originX+target[4]*originY+target[8]*originZ);target[13]=alignY+posY-mountPointY+originY-(target[1]*originX+target[5]*originY+target[9]*originZ);target[14]=alignZ+posZ-mountPointZ+originZ-(target[2]*originX+target[6]*originY+target[10]*originZ);target[15]=1;if(transform.calculatingWorldMatrix&&transform.calculateWorldMatrix())changed|=Transform.WORLD_CHANGED;if(t00!==target[0]||t01!==target[1]||t02!==target[2]||t10!==target[4]||t11!==target[5]||t12!==target[6]||t20!==target[8]||t21!==target[9]||t22!==target[10]||t30!==target[12]||t31!==target[13]||t32!==target[14])changed|=Transform.LOCAL_CHANGED;return changed;}/**
 * Private function. Uses the parent transform, the node's spec, the node's size, and the parent's size
 * to calculate a final transform for the node. Returns true if the transform has changed.
 *
 * @private
 *
 * @param {Node} node the node to create a transform for
 * @param {Transform} transform transform to apply
 *
 * @return {Boolean} whether or not the transform changed
 */function fromNodeWithParent(node,transform){var target=transform.getLocalTransform();var parentMatrix=transform.parent.getLocalTransform();var mySize=node.getSize();var vectors=transform.vectors;var offsets=transform.offsets;var parentSize=node.getParent().getSize();var changed=false;// local cache of everything
var t00=target[0];var t01=target[1];var t02=target[2];var t10=target[4];var t11=target[5];var t12=target[6];var t20=target[8];var t21=target[9];var t22=target[10];var t30=target[12];var t31=target[13];var t32=target[14];var p00=parentMatrix[0];var p01=parentMatrix[1];var p02=parentMatrix[2];var p10=parentMatrix[4];var p11=parentMatrix[5];var p12=parentMatrix[6];var p20=parentMatrix[8];var p21=parentMatrix[9];var p22=parentMatrix[10];var p30=parentMatrix[12];var p31=parentMatrix[13];var p32=parentMatrix[14];var posX=vectors.position[0];var posY=vectors.position[1];var posZ=vectors.position[2];var rotX=vectors.rotation[0];var rotY=vectors.rotation[1];var rotZ=vectors.rotation[2];var rotW=vectors.rotation[3];var scaleX=vectors.scale[0];var scaleY=vectors.scale[1];var scaleZ=vectors.scale[2];var alignX=offsets.align[0]*parentSize[0];var alignY=offsets.align[1]*parentSize[1];var alignZ=offsets.align[2]*parentSize[2];var mountPointX=offsets.mountPoint[0]*mySize[0];var mountPointY=offsets.mountPoint[1]*mySize[1];var mountPointZ=offsets.mountPoint[2]*mySize[2];var originX=offsets.origin[0]*mySize[0];var originY=offsets.origin[1]*mySize[1];var originZ=offsets.origin[2]*mySize[2];var wx=rotW*rotX;var wy=rotW*rotY;var wz=rotW*rotZ;var xx=rotX*rotX;var yy=rotY*rotY;var zz=rotZ*rotZ;var xy=rotX*rotY;var xz=rotX*rotZ;var yz=rotY*rotZ;var rs0=(1-2*(yy+zz))*scaleX;var rs1=2*(xy+wz)*scaleX;var rs2=2*(xz-wy)*scaleX;var rs3=2*(xy-wz)*scaleY;var rs4=(1-2*(xx+zz))*scaleY;var rs5=2*(yz+wx)*scaleY;var rs6=2*(xz+wy)*scaleZ;var rs7=2*(yz-wx)*scaleZ;var rs8=(1-2*(xx+yy))*scaleZ;var tx=alignX+posX-mountPointX+originX-(rs0*originX+rs3*originY+rs6*originZ);var ty=alignY+posY-mountPointY+originY-(rs1*originX+rs4*originY+rs7*originZ);var tz=alignZ+posZ-mountPointZ+originZ-(rs2*originX+rs5*originY+rs8*originZ);target[0]=p00*rs0+p10*rs1+p20*rs2;target[1]=p01*rs0+p11*rs1+p21*rs2;target[2]=p02*rs0+p12*rs1+p22*rs2;target[3]=0;target[4]=p00*rs3+p10*rs4+p20*rs5;target[5]=p01*rs3+p11*rs4+p21*rs5;target[6]=p02*rs3+p12*rs4+p22*rs5;target[7]=0;target[8]=p00*rs6+p10*rs7+p20*rs8;target[9]=p01*rs6+p11*rs7+p21*rs8;target[10]=p02*rs6+p12*rs7+p22*rs8;target[11]=0;target[12]=p00*tx+p10*ty+p20*tz+p30;target[13]=p01*tx+p11*ty+p21*tz+p31;target[14]=p02*tx+p12*ty+p22*tz+p32;target[15]=1;if(transform.calculatingWorldMatrix&&transform.calculateWorldMatrix())changed|=Transform.WORLD_CHANGED;if(t00!==target[0]||t01!==target[1]||t02!==target[2]||t10!==target[4]||t11!==target[5]||t12!==target[6]||t20!==target[8]||t21!==target[9]||t22!==target[10]||t30!==target[12]||t31!==target[13]||t32!==target[14])changed|=Transform.LOCAL_CHANGED;return changed;}/**
 * private method to multiply two transforms.
 *
 * @method
 *
 * @param {Array} out The array to write the result to
 * @param {Array} a the left hand transform
 * @param {Array} b the right hand transform
 *
 * @return {undefined} undefined
 */function multiply(out,a,b){var a00=a[0],a01=a[1],a02=a[2],a10=a[4],a11=a[5],a12=a[6],a20=a[8],a21=a[9],a22=a[10],a30=a[12],a31=a[13],a32=a[14];var changed=false;var res;// Cache only the current line of the second matrix
var b0=b[0],b1=b[1],b2=b[2],b3=b[3];res=b0*a00+b1*a10+b2*a20+b3*a30;changed=changed?changed:out[0]!==res;out[0]=res;res=b0*a01+b1*a11+b2*a21+b3*a31;changed=changed?changed:out[1]!==res;out[1]=res;res=b0*a02+b1*a12+b2*a22+b3*a32;changed=changed?changed:out[2]!==res;out[2]=res;out[3]=0;b0=b[4];b1=b[5];b2=b[6];b3=b[7];res=b0*a00+b1*a10+b2*a20+b3*a30;changed=changed?changed:out[4]!==res;out[4]=res;res=b0*a01+b1*a11+b2*a21+b3*a31;changed=changed?changed:out[5]!==res;out[5]=res;res=b0*a02+b1*a12+b2*a22+b3*a32;changed=changed?changed:out[6]!==res;out[6]=res;out[7]=0;b0=b[8];b1=b[9];b2=b[10];b3=b[11];res=b0*a00+b1*a10+b2*a20+b3*a30;changed=changed?changed:out[8]!==res;out[8]=res;res=b0*a01+b1*a11+b2*a21+b3*a31;changed=changed?changed:out[9]!==res;out[9]=res;res=b0*a02+b1*a12+b2*a22+b3*a32;changed=changed?changed:out[10]!==res;out[10]=res;out[11]=0;b0=b[12];b1=b[13];b2=b[14];b3=b[15];res=b0*a00+b1*a10+b2*a20+b3*a30;changed=changed?changed:(0|out[12])!==(0|res);out[12]=res;res=b0*a01+b1*a11+b2*a21+b3*a31;changed=changed?changed:(0|out[13])!==(0|res);out[13]=res;res=b0*a02+b1*a12+b2*a22+b3*a32;changed=changed?changed:out[14]!==res;out[14]=res;out[15]=1;return changed;}module.exports=Transform;},{}],20:[function(require,module,exports){/**
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
 */'use strict';var PathUtils=require('./Path');var Transform=require('./Transform');var Dispatch=require('./Dispatch');var PathStore=require('./PathStore');/**
 * The transform class is responsible for calculating the transform of a particular
 * node from the data on the node and its parent
 *
 * @constructor {TransformSystem}
 */function TransformSystem(){this.pathStore=new PathStore();}/**
 * registers a new Transform for the given path. This transform will be updated
 * when the TransformSystem updates.
 *
 * @method registerTransformAtPath
 * @return {undefined} undefined
 *
 * @param {String} path for the transform to be registered to.
 * @param {Transform | undefined} transform optional transform to register.
 */TransformSystem.prototype.registerTransformAtPath=function registerTransformAtPath(path,transform){if(!PathUtils.depth(path))return this.pathStore.insert(path,transform?transform:new Transform());var parent=this.pathStore.get(PathUtils.parent(path));if(!parent)throw new Error('No parent transform registered at expected path: '+PathUtils.parent(path));if(transform)transform.setParent(parent);this.pathStore.insert(path,transform?transform:new Transform(parent));};/**
 * deregisters a transform registered at the given path.
 *
 * @method deregisterTransformAtPath
 * @return {void}
 *
 * @param {String} path at which to register the transform
 */TransformSystem.prototype.deregisterTransformAtPath=function deregisterTransformAtPath(path){this.pathStore.remove(path);};/**
 * Method which will make the transform currently stored at the given path a breakpoint.
 * A transform being a breakpoint means that both a local and world transform will be calculated
 * for that point. The local transform being the concatinated transform of all ancestor transforms up
 * until the nearest breakpoint, and the world being the concatinated transform of all ancestor transforms.
 * This method throws if no transform is at the provided path.
 *
 * @method
 *
 * @param {String} path The path at which to turn the transform into a breakpoint
 *
 * @return {undefined} undefined
 */TransformSystem.prototype.makeBreakPointAt=function makeBreakPointAt(path){var transform=this.pathStore.get(path);if(!transform)throw new Error('No transform Registered at path: '+path);transform.setBreakPoint();};/**
 * Method that will make the transform at this location calculate a world matrix.
 *
 * @method
 *
 * @param {String} path The path at which to make the transform calculate a world matrix
 *
 * @return {undefined} undefined
 */TransformSystem.prototype.makeCalculateWorldMatrixAt=function makeCalculateWorldMatrixAt(path){var transform=this.pathStore.get(path);if(!transform)throw new Error('No transform Registered at path: '+path);transform.setCalculateWorldMatrix();};/**
 * Returns the instance of the transform class associated with the given path,
 * or undefined if no transform is associated.
 *
 * @method
 * 
 * @param {String} path The path to lookup
 *
 * @return {Transform | undefined} the transform at that path is available, else undefined.
 */TransformSystem.prototype.get=function get(path){return this.pathStore.get(path);};/**
 * update is called when the transform system requires an update.
 * It traverses the transform array and evaluates the necessary transforms
 * in the scene graph with the information from the corresponding node
 * in the scene graph
 *
 * @method update
 *
 * @return {undefined} undefined
 */TransformSystem.prototype.update=function update(){var transforms=this.pathStore.getItems();var paths=this.pathStore.getPaths();var transform;var changed;var node;var vectors;var offsets;var components;var j;for(var i=0,len=transforms.length;i<len;i++){node=Dispatch.getNode(paths[i]);if(!node)continue;if(!node.showInEngine()){j=i+1;while(j<len&&PathUtils.isDescendentOf(paths[j],paths[i])){j++;}i=j-1;continue;}components=node.getComponents();transform=transforms[i];vectors=transform.vectors;offsets=transform.offsets;if(offsets.alignChanged)alignChanged(node,components,offsets);if(offsets.mountPointChanged)mountPointChanged(node,components,offsets);if(offsets.originChanged)originChanged(node,components,offsets);if(vectors.positionChanged)positionChanged(node,components,vectors);if(vectors.rotationChanged)rotationChanged(node,components,vectors);if(vectors.scaleChanged)scaleChanged(node,components,vectors);if(changed=transform.calculate(node)){transformChanged(node,components,transform);if(changed&Transform.LOCAL_CHANGED)localTransformChanged(node,components,transform.getLocalTransform());if(changed&Transform.WORLD_CHANGED)worldTransformChanged(node,components,transform.getWorldTransform());}}};// private methods
/**
 * Private method to call when align changes. Triggers 'onAlignChange' methods
 * on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to call onAlignChange if necessary
 * @param {Array} components the components on which to call onAlignChange if necessary
 * @param {Object} offsets the set of offsets from the transform
 *
 * @return {undefined} undefined
 */function alignChanged(node,components,offsets){var x=offsets.align[0];var y=offsets.align[1];var z=offsets.align[2];if(node.onAlignChange)node.onAlignChange(x,y,z);for(var i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onAlignChange)components[i].onAlignChange(x,y,z);}offsets.alignChanged=false;}/**
 * Private method to call when MountPoint changes. Triggers 'onMountPointChange' methods
 * on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Object} offsets the set of offsets from the transform
 *
 * @return {undefined} undefined
 */function mountPointChanged(node,components,offsets){var x=offsets.mountPoint[0];var y=offsets.mountPoint[1];var z=offsets.mountPoint[2];if(node.onMountPointChange)node.onMountPointChange(x,y,z);for(var i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onMountPointChange)components[i].onMountPointChange(x,y,z);}offsets.mountPointChanged=false;}/**
 * Private method to call when Origin changes. Triggers 'onOriginChange' methods
 * on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Object} offsets the set of offsets from the transform
 *
 * @return {undefined} undefined
 */function originChanged(node,components,offsets){var x=offsets.origin[0];var y=offsets.origin[1];var z=offsets.origin[2];if(node.onOriginChange)node.onOriginChange(x,y,z);for(var i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onOriginChange)components[i].onOriginChange(x,y,z);}offsets.originChanged=false;}/**
 * Private method to call when Position changes. Triggers 'onPositionChange' methods
 * on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Object} vectors the set of vectors from the transform
 *
 * @return {undefined} undefined
 */function positionChanged(node,components,vectors){var x=vectors.position[0];var y=vectors.position[1];var z=vectors.position[2];if(node.onPositionChange)node.onPositionChange(x,y,z);for(var i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onPositionChange)components[i].onPositionChange(x,y,z);}vectors.positionChanged=false;}/**
 * Private method to call when Rotation changes. Triggers 'onRotationChange' methods
 * on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Object} vectors the set of vectors from the transform
 *
 * @return {undefined} undefined
 */function rotationChanged(node,components,vectors){var x=vectors.rotation[0];var y=vectors.rotation[1];var z=vectors.rotation[2];var w=vectors.rotation[3];if(node.onRotationChange)node.onRotationChange(x,y,z,w);for(var i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onRotationChange)components[i].onRotationChange(x,y,z,w);}vectors.rotationChanged=false;}/**
 * Private method to call when Scale changes. Triggers 'onScaleChange' methods
 * on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Object} vectors the set of vectors from the transform
 *
 * @return {undefined} undefined
 */function scaleChanged(node,components,vectors){var x=vectors.scale[0];var y=vectors.scale[1];var z=vectors.scale[2];if(node.onScaleChange)node.onScaleChange(x,y,z);for(var i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onScaleChange)components[i].onScaleChange(x,y,z);}vectors.scaleChanged=false;}/**
 * Private method to call when either the Local or World Transform changes.
 * Triggers 'onTransformChange' methods on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Transform} transform the transform class that changed
 *
 * @return {undefined} undefined
 */function transformChanged(node,components,transform){if(node.onTransformChange)node.onTransformChange(transform);for(var i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onTransformChange)components[i].onTransformChange(transform);}}/**
 * Private method to call when the local transform changes. Triggers 'onLocalTransformChange' methods
 * on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Array} transform the local transform
 *
 * @return {undefined} undefined
 */function localTransformChanged(node,components,transform){if(node.onLocalTransformChange)node.onLocalTransformChange(transform);for(var i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onLocalTransformChange)components[i].onLocalTransformChange(transform);}}/**
 * Private method to call when the world transform changes. Triggers 'onWorldTransformChange' methods
 * on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Array} transform the world transform
 *
 * @return {undefined} undefined
 */function worldTransformChanged(node,components,transform){if(node.onWorldTransformChange)node.onWorldTransformChange(transform);for(var i=0,len=components.length;i<len;i++){if(components[i]&&components[i].onWorldTransformChange)components[i].onWorldTransformChange(transform);}}module.exports=new TransformSystem();},{"./Dispatch":10,"./Path":14,"./PathStore":15,"./Transform":19}],21:[function(require,module,exports){/**
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
 */'use strict';var CallbackStore=require('../utilities/CallbackStore');var TransformSystem=require('../core/TransformSystem');var Commands=require('../core/Commands');var Size=require('../core/Size');/**
 * A DOMElement is a component that can be added to a Node with the
 * purpose of sending draw commands to the renderer. Renderables send draw commands
 * to through their Nodes to the Compositor where they are acted upon.
 *
 * @class DOMElement
 *
 * @param {Node} node                   The Node to which the `DOMElement`
 *                                      renderable should be attached to.
 * @param {Object} options              Initial options used for instantiating
 *                                      the Node.
 * @param {Object} options.properties   CSS properties that should be added to
 *                                      the actual DOMElement on the initial draw.
 * @param {Object} options.attributes   Element attributes that should be added to
 *                                      the actual DOMElement.
 * @param {String} options.id           String to be applied as 'id' of the actual
 *                                      DOMElement.
 * @param {String} options.content      String to be applied as the content of the
 *                                      actual DOMElement.
 * @param {Boolean} options.cutout      Specifies the presence of a 'cutout' in the
 *                                      WebGL canvas over this element which allows
 *                                      for DOM and WebGL layering.  On by default.
 */function DOMElement(node,options){if(!node)throw new Error('DOMElement must be instantiated on a node');this._changeQueue=[];this._requestingUpdate=false;this._renderSized=false;this._requestRenderSize=false;this._UIEvents=node.getUIEvents().slice(0);this._classes=['famous-dom-element'];this._requestingEventListeners=[];this._styles={};this._attributes={};this._content='';this._tagName=options&&options.tagName?options.tagName:'div';this._renderSize=[0,0,0];this._node=node;if(node)node.addComponent(this);this._callbacks=new CallbackStore();this.setProperty('display',node.isShown()?'block':'none');this.onOpacityChange(node.getOpacity());if(!options)return;var i;var key;if(options.classes)for(i=0;i<options.classes.length;i++){this.addClass(options.classes[i]);}if(options.attributes)for(key in options.attributes){this.setAttribute(key,options.attributes[key]);}if(options.properties)for(key in options.properties){this.setProperty(key,options.properties[key]);}if(options.id)this.setId(options.id);if(options.content)this.setContent(options.content);if(options.cutout===false)this.setCutoutState(options.cutout);}/**
 * Serializes the state of the DOMElement.
 *
 * @method
 *
 * @return {Object} serialized interal state
 */DOMElement.prototype.getValue=function getValue(){return{classes:this._classes,styles:this._styles,attributes:this._attributes,content:this._content,id:this._attributes.id,tagName:this._tagName};};/**
 * Method to be invoked by the node as soon as an update occurs. This allows
 * the DOMElement renderable to dynamically react to state changes on the Node.
 *
 * This flushes the internal draw command queue by sending individual commands
 * to the node using `sendDrawCommand`.
 *
 * @method
 *
 * @return {undefined} undefined
 */DOMElement.prototype.onUpdate=function onUpdate(){var node=this._node;var queue=this._changeQueue;var len=queue.length;if(len&&node){node.sendDrawCommand(Commands.WITH);node.sendDrawCommand(node.getLocation());while(len--){node.sendDrawCommand(queue.shift());}if(this._requestRenderSize){node.sendDrawCommand(Commands.DOM_RENDER_SIZE);node.sendDrawCommand(node.getLocation());this._requestRenderSize=false;}}this._requestingUpdate=false;};/**
 * Method to be invoked by the Node as soon as the node (or any of its
 * ancestors) is being mounted.
 *
 * @method onMount
 *
 * @param {Node} node      Parent node to which the component should be added.
 * @param {String} id      Path at which the component (or node) is being
 *                          attached. The path is being set on the actual
 *                          DOMElement as a `data-fa-path`-attribute.
 *
 * @return {undefined} undefined
 */DOMElement.prototype.onMount=function onMount(node,id){this._node=node;this._id=id;this._UIEvents=node.getUIEvents().slice(0);TransformSystem.makeBreakPointAt(node.getLocation());this.onSizeModeChange.apply(this,node.getSizeMode());this.draw();this.setAttribute('data-fa-path',node.getLocation());};/**
 * Method to be invoked by the Node as soon as the node is being dismounted
 * either directly or by dismounting one of its ancestors.
 *
 * @method
 *
 * @return {undefined} undefined
 */DOMElement.prototype.onDismount=function onDismount(){this.setProperty('display','none');this.setAttribute('data-fa-path','');this.setCutoutState(false);this.onUpdate();this._initialized=false;};/**
 * Method to be invoked by the node as soon as the DOMElement is being shown.
 * This results into the DOMElement setting the `display` property to `block`
 * and therefore visually showing the corresponding DOMElement (again).
 *
 * @method
 *
 * @return {undefined} undefined
 */DOMElement.prototype.onShow=function onShow(){this.setProperty('display','block');};/**
 * Method to be invoked by the node as soon as the DOMElement is being hidden.
 * This results into the DOMElement setting the `display` property to `none`
 * and therefore visually hiding the corresponding DOMElement (again).
 *
 * @method
 *
 * @return {undefined} undefined
 */DOMElement.prototype.onHide=function onHide(){this.setProperty('display','none');};/**
 * Enables or disables WebGL 'cutout' for this element, which affects
 * how the element is layered with WebGL objects in the scene.
 *
 * @method
 *
 * @param {Boolean} usesCutout  The presence of a WebGL 'cutout' for this element.
 *
 * @return {DOMElement} this
 */DOMElement.prototype.setCutoutState=function setCutoutState(usesCutout){if(this._initialized)this._changeQueue.push(Commands.GL_CUTOUT_STATE,usesCutout);if(!this._requestingUpdate)this._requestUpdate();return this;};/**
 * Method to be invoked by the node as soon as the transform matrix associated
 * with the node changes. The DOMElement will react to transform changes by sending
 * `CHANGE_TRANSFORM` commands to the `DOMRenderer`.
 *
 * @method
 *
 * @param {Float32Array} transform The final transform matrix
 *
 * @return {undefined} undefined
 */DOMElement.prototype.onTransformChange=function onTransformChange(transform){this._changeQueue.push(Commands.CHANGE_TRANSFORM);transform=transform.getLocalTransform();for(var i=0,len=transform.length;i<len;i++){this._changeQueue.push(transform[i]);}if(!this._requestingUpdate)this._requestUpdate();};/**
 * Method to be invoked by the node as soon as its computed size changes.
 *
 * @method
 *
 * @param {Number} x width of the Node the DOMElement is attached to
 * @param {Number} y height of the Node the DOMElement is attached to
 *
 * @return {DOMElement} this
 */DOMElement.prototype.onSizeChange=function onSizeChange(x,y){var sizeMode=this._node.getSizeMode();var sizedX=sizeMode[0]!==Size.RENDER;var sizedY=sizeMode[1]!==Size.RENDER;if(this._initialized)this._changeQueue.push(Commands.CHANGE_SIZE,sizedX?x:sizedX,sizedY?y:sizedY);if(!this._requestingUpdate)this._requestUpdate();return this;};/**
 * Method to be invoked by the node as soon as its opacity changes
 *
 * @method
 *
 * @param {Number} opacity The new opacity, as a scalar from 0 to 1
 *
 * @return {DOMElement} this
 */DOMElement.prototype.onOpacityChange=function onOpacityChange(opacity){return this.setProperty('opacity',opacity);};/**
 * Method to be invoked by the node as soon as a new UIEvent is being added.
 * This results into an `ADD_EVENT_LISTENER` command being sent.
 *
 * @param {String} uiEvent uiEvent to be subscribed to (e.g. `click`)
 *
 * @return {undefined} undefined
 */DOMElement.prototype.onAddUIEvent=function onAddUIEvent(uiEvent){if(this._UIEvents.indexOf(uiEvent)===-1){this._subscribe(uiEvent);this._UIEvents.push(uiEvent);}else if(this._inDraw){this._subscribe(uiEvent);}return this;};/**
 * Method to be invoked by the node as soon as a UIEvent is removed from
 * the node.  This results into an `UNSUBSCRIBE` command being sent.
 *
 * @param {String} UIEvent UIEvent to be removed (e.g. `mousedown`)
 *
 * @return {undefined} undefined
 */DOMElement.prototype.onRemoveUIEvent=function onRemoveUIEvent(UIEvent){var index=this._UIEvents.indexOf(UIEvent);if(index!==-1){this._unsubscribe(UIEvent);this._UIEvents.splice(index,1);}else if(this._inDraw){this._unsubscribe(UIEvent);}return this;};/**
 * Appends an `SUBSCRIBE` command to the command queue.
 *
 * @method
 * @private
 *
 * @param {String} uiEvent Event type (e.g. `click`)
 *
 * @return {undefined} undefined
 */DOMElement.prototype._subscribe=function _subscribe(uiEvent){if(this._initialized){this._changeQueue.push(Commands.SUBSCRIBE,uiEvent);}if(!this._requestingUpdate)this._requestUpdate();};/**
 * When running in a worker, the browser's default action for specific events
 * can't be prevented on a case by case basis (via `e.preventDefault()`).
 * Instead this function should be used to register an event to be prevented by
 * default.
 *
 * @method
 *
 * @param  {String} uiEvent     UI Event (e.g. wheel) for which to prevent the
 *                              browser's default action (e.g. form submission,
 *                              scrolling)
 * @return {undefined}          undefined
 */DOMElement.prototype.preventDefault=function preventDefault(uiEvent){if(this._initialized){this._changeQueue.push(Commands.PREVENT_DEFAULT,uiEvent);}if(!this._requestingUpdate)this._requestUpdate();};/**
 * Opposite of {@link DOMElement#preventDefault}. No longer prevent the
 * browser's default action on subsequent events of this type.
 *
 * @method
 *
 * @param  {type} uiEvent       UI Event previously registered using
 *                              {@link DOMElement#preventDefault}.
 * @return {undefined}          undefined
 */DOMElement.prototype.allowDefault=function allowDefault(uiEvent){if(this._initialized){this._changeQueue.push(Commands.ALLOW_DEFAULT,uiEvent);}if(!this._requestingUpdate)this._requestUpdate();};/**
 * Appends an `UNSUBSCRIBE` command to the command queue.
 *
 * @method
 * @private
 *
 * @param {String} UIEvent Event type (e.g. `click`)
 *
 * @return {undefined} undefined
 */DOMElement.prototype._unsubscribe=function _unsubscribe(UIEvent){if(this._initialized){this._changeQueue.push(Commands.UNSUBSCRIBE,UIEvent);}if(!this._requestingUpdate)this._requestUpdate();};/**
 * Method to be invoked by the node as soon as the underlying size mode
 * changes. This results into the size being fetched from the node in
 * order to update the actual, rendered size.
 *
 * @method
 *
 * @param {Number} x the sizing mode in use for determining size in the x direction
 * @param {Number} y the sizing mode in use for determining size in the y direction
 * @param {Number} z the sizing mode in use for determining size in the z direction
 *
 * @return {undefined} undefined
 */DOMElement.prototype.onSizeModeChange=function onSizeModeChange(x,y,z){if(x===Size.RENDER||y===Size.RENDER||z===Size.RENDER){this._renderSized=true;this._requestRenderSize=true;}var size=this._node.getSize();this.onSizeChange(size[0],size[1]);};/**
 * Method to be retrieve the rendered size of the DOM element that is
 * drawn for this node.
 *
 * @method
 *
 * @return {Array} size of the rendered DOM element in pixels
 */DOMElement.prototype.getRenderSize=function getRenderSize(){return this._renderSize;};/**
 * Method to have the component request an update from its Node
 *
 * @method
 * @private
 *
 * @return {undefined} undefined
 */DOMElement.prototype._requestUpdate=function _requestUpdate(){if(!this._requestingUpdate&&this._id){this._node.requestUpdate(this._id);this._requestingUpdate=true;}};/**
 * Initializes the DOMElement by sending the `INIT_DOM` command. This creates
 * or reallocates a new Element in the actual DOM hierarchy.
 *
 * @method
 *
 * @return {undefined} undefined
 */DOMElement.prototype.init=function init(){this._changeQueue.push(Commands.INIT_DOM,this._tagName);this._initialized=true;this.onTransformChange(TransformSystem.get(this._node.getLocation()));var size=this._node.getSize();this.onSizeChange(size[0],size[1]);if(!this._requestingUpdate)this._requestUpdate();};/**
 * Sets the id attribute of the DOMElement.
 *
 * @method
 *
 * @param {String} id New id to be set
 *
 * @return {DOMElement} this
 */DOMElement.prototype.setId=function setId(id){this.setAttribute('id',id);return this;};/**
 * Adds a new class to the internal class list of the underlying Element in the
 * DOM.
 *
 * @method
 *
 * @param {String} value New class name to be added
 *
 * @return {DOMElement} this
 */DOMElement.prototype.addClass=function addClass(value){if(this._classes.indexOf(value)<0){if(this._initialized)this._changeQueue.push(Commands.ADD_CLASS,value);this._classes.push(value);if(!this._requestingUpdate)this._requestUpdate();if(this._renderSized)this._requestRenderSize=true;return this;}if(this._inDraw){if(this._initialized)this._changeQueue.push(Commands.ADD_CLASS,value);if(!this._requestingUpdate)this._requestUpdate();}return this;};/**
 * Removes a class from the DOMElement's classList.
 *
 * @method
 *
 * @param {String} value Class name to be removed
 *
 * @return {DOMElement} this
 */DOMElement.prototype.removeClass=function removeClass(value){var index=this._classes.indexOf(value);if(index<0)return this;this._changeQueue.push(Commands.REMOVE_CLASS,value);this._classes.splice(index,1);if(!this._requestingUpdate)this._requestUpdate();return this;};/**
 * Checks if the DOMElement has the passed in class.
 *
 * @method
 *
 * @param {String} value The class name
 *
 * @return {Boolean} Boolean value indicating whether the passed in class name is in the DOMElement's class list.
 */DOMElement.prototype.hasClass=function hasClass(value){return this._classes.indexOf(value)!==-1;};/**
 * Sets an attribute of the DOMElement.
 *
 * @method
 *
 * @param {String} name Attribute key (e.g. `src`)
 * @param {String} value Attribute value (e.g. `http://famo.us`)
 *
 * @return {DOMElement} this
 */DOMElement.prototype.setAttribute=function setAttribute(name,value){if(this._attributes[name]!==value||this._inDraw){this._attributes[name]=value;if(this._initialized)this._changeQueue.push(Commands.CHANGE_ATTRIBUTE,name,value);if(!this._requestUpdate)this._requestUpdate();}return this;};/**
 * Sets a CSS property
 *
 * @chainable
 *
 * @param {String} name  Name of the CSS rule (e.g. `background-color`)
 * @param {String} value Value of CSS property (e.g. `red`)
 *
 * @return {DOMElement} this
 */DOMElement.prototype.setProperty=function setProperty(name,value){if(this._styles[name]!==value||this._inDraw){this._styles[name]=value;if(this._initialized)this._changeQueue.push(Commands.CHANGE_PROPERTY,name,value);if(!this._requestingUpdate)this._requestUpdate();if(this._renderSized)this._requestRenderSize=true;}return this;};/**
 * Sets the content of the DOMElement. This is using `innerHTML`, escaping user
 * generated content is therefore essential for security purposes.
 *
 * @method
 *
 * @param {String} content Content to be set using `.innerHTML = ...`
 *
 * @return {DOMElement} this
 */DOMElement.prototype.setContent=function setContent(content){if(this._content!==content||this._inDraw){this._content=content;if(this._initialized)this._changeQueue.push(Commands.CHANGE_CONTENT,content);if(!this._requestingUpdate)this._requestUpdate();if(this._renderSized)this._requestRenderSize=true;}return this;};/**
 * Subscribes to a DOMElement using.
 *
 * @method on
 *
 * @param {String} event       The event type (e.g. `click`).
 * @param {Function} listener  Handler function for the specified event type
 *                              in which the payload event object will be
 *                              passed into.
 *
 * @return {Function} A function to call if you want to remove the callback
 */DOMElement.prototype.on=function on(event,listener){return this._callbacks.on(event,listener);};/**
 * Function to be invoked by the Node whenever an event is being received.
 * There are two different ways to subscribe for those events:
 *
 * 1. By overriding the onReceive method (and possibly using `switch` in order
 *     to differentiate between the different event types).
 * 2. By using DOMElement and using the built-in CallbackStore.
 *
 * @method
 *
 * @param {String} event Event type (e.g. `click`)
 * @param {Object} payload Event object.
 *
 * @return {undefined} undefined
 */DOMElement.prototype.onReceive=function onReceive(event,payload){if(event==='resize'){this._renderSize[0]=payload.val[0];this._renderSize[1]=payload.val[1];if(!this._requestingUpdate)this._requestUpdate();}this._callbacks.trigger(event,payload);};/**
 * The draw function is being used in order to allow mutating the DOMElement
 * before actually mounting the corresponding node.
 *
 * @method
 * @private
 *
 * @return {undefined} undefined
 */DOMElement.prototype.draw=function draw(){var key;var i;var len;this._inDraw=true;this.init();for(i=0,len=this._classes.length;i<len;i++){this.addClass(this._classes[i]);}if(this._content)this.setContent(this._content);for(key in this._styles){if(this._styles[key]!=null)this.setProperty(key,this._styles[key]);}for(key in this._attributes){if(this._attributes[key]!=null)this.setAttribute(key,this._attributes[key]);}for(i=0,len=this._UIEvents.length;i<len;i++){this.onAddUIEvent(this._UIEvents[i]);}this._inDraw=false;};module.exports=DOMElement;},{"../core/Commands":8,"../core/Size":17,"../core/TransformSystem":20,"../utilities/CallbackStore":47}],22:[function(require,module,exports){/**
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
 */DOMRenderer.prototype.offRemoveEl=function offRemoveEl(path,callback){this._removeElCallbackStore.off(path,callback);return this;};module.exports=DOMRenderer;},{"../core/Path":14,"../utilities/CallbackStore":47,"../utilities/vendorPrefix":51,"./ElementCache":23,"./Math":24,"./events/EventMap":28}],23:[function(require,module,exports){/**
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
 */function ElementCache(element,path){this.tagName=element.tagName.toLowerCase();this.void=VoidElements[this.tagName];var constructor=element.constructor;this.formElement=constructor===HTMLInputElement||constructor===HTMLTextAreaElement||constructor===HTMLSelectElement;this.element=element;this.path=path;this.content=null;this.size=new Int16Array(3);this.explicitHeight=false;this.explicitWidth=false;this.postRenderSize=new Float32Array(2);this.listeners={};this.preventDefault={};this.subscribe={};}module.exports=ElementCache;},{"./VoidElements":25}],24:[function(require,module,exports){/**
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
 */function multiply(out,a,b){var a00=a[0],a01=a[1],a02=a[2],a03=a[3],a10=a[4],a11=a[5],a12=a[6],a13=a[7],a20=a[8],a21=a[9],a22=a[10],a23=a[11],a30=a[12],a31=a[13],a32=a[14],a33=a[15],b0=b[0],b1=b[1],b2=b[2],b3=b[3],b4=b[4],b5=b[5],b6=b[6],b7=b[7],b8=b[8],b9=b[9],b10=b[10],b11=b[11],b12=b[12],b13=b[13],b14=b[14],b15=b[15];var changed=false;var out0,out1,out2,out3;out0=b0*a00+b1*a10+b2*a20+b3*a30;out1=b0*a01+b1*a11+b2*a21+b3*a31;out2=b0*a02+b1*a12+b2*a22+b3*a32;out3=b0*a03+b1*a13+b2*a23+b3*a33;changed=changed?changed:out0===out[0]||out1===out[1]||out2===out[2]||out3===out[3];out[0]=out0;out[1]=out1;out[2]=out2;out[3]=out3;b0=b4;b1=b5;b2=b6;b3=b7;out0=b0*a00+b1*a10+b2*a20+b3*a30;out1=b0*a01+b1*a11+b2*a21+b3*a31;out2=b0*a02+b1*a12+b2*a22+b3*a32;out3=b0*a03+b1*a13+b2*a23+b3*a33;changed=changed?changed:out0===out[4]||out1===out[5]||out2===out[6]||out3===out[7];out[4]=out0;out[5]=out1;out[6]=out2;out[7]=out3;b0=b8;b1=b9;b2=b10;b3=b11;out0=b0*a00+b1*a10+b2*a20+b3*a30;out1=b0*a01+b1*a11+b2*a21+b3*a31;out2=b0*a02+b1*a12+b2*a22+b3*a32;out3=b0*a03+b1*a13+b2*a23+b3*a33;changed=changed?changed:out0===out[8]||out1===out[9]||out2===out[10]||out3===out[11];out[8]=out0;out[9]=out1;out[10]=out2;out[11]=out3;b0=b12;b1=b13;b2=b14;b3=b15;out0=b0*a00+b1*a10+b2*a20+b3*a30;out1=b0*a01+b1*a11+b2*a21+b3*a31;out2=b0*a02+b1*a12+b2*a22+b3*a32;out3=b0*a03+b1*a13+b2*a23+b3*a33;changed=changed?changed:out0===out[12]||out1===out[13]||out2===out[14]||out3===out[15];out[12]=out0;out[13]=out1;out[14]=out2;out[15]=out3;return out;}module.exports={multiply:multiply,invert:invert};},{}],25:[function(require,module,exports){/**
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
 */var VoidElements={area:true,base:true,br:true,col:true,embed:true,hr:true,img:true,input:true,keygen:true,link:true,meta:true,param:true,source:true,track:true,wbr:true};module.exports=VoidElements;},{}],26:[function(require,module,exports){/**
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
 */CompositionEvent.prototype.toString=function toString(){return'CompositionEvent';};module.exports=CompositionEvent;},{"./UIEvent":35}],27:[function(require,module,exports){/**
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
 */Event.prototype.toString=function toString(){return'Event';};module.exports=Event;},{}],28:[function(require,module,exports){/**
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
touchcancel:[TouchEvent,true],touchend:[TouchEvent,true],touchmove:[TouchEvent,true],touchstart:[TouchEvent,true]};module.exports=EventMap;},{"./CompositionEvent":26,"./Event":27,"./FocusEvent":29,"./InputEvent":30,"./KeyboardEvent":31,"./MouseEvent":32,"./ScrollEvent":33,"./TouchEvent":34,"./UIEvent":35,"./WheelEvent":36}],29:[function(require,module,exports){/**
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
 */FocusEvent.prototype.toString=function toString(){return'FocusEvent';};module.exports=FocusEvent;},{"./UIEvent":35}],30:[function(require,module,exports){/**
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
 */InputEvent.prototype.toString=function toString(){return'InputEvent';};module.exports=InputEvent;},{"./UIEvent":35}],31:[function(require,module,exports){/**
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
 */KeyboardEvent.prototype.toString=function toString(){return'KeyboardEvent';};module.exports=KeyboardEvent;},{"./UIEvent":35}],32:[function(require,module,exports){/**
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
 */MouseEvent.prototype.toString=function toString(){return'MouseEvent';};module.exports=MouseEvent;},{"./UIEvent":35}],33:[function(require,module,exports){'use strict';var Event=require('./Event');/**
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
 */ScrollEvent.prototype.toString=function toString(){return'ScrollEvent';};module.exports=ScrollEvent;},{"./Event":27}],34:[function(require,module,exports){/**
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
 */TouchEvent.prototype.toString=function toString(){return'TouchEvent';};module.exports=TouchEvent;},{"./UIEvent":35}],35:[function(require,module,exports){/**
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
 */UIEvent.prototype.toString=function toString(){return'UIEvent';};module.exports=UIEvent;},{"./Event":27}],36:[function(require,module,exports){/**
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
 */WheelEvent.prototype.toString=function toString(){return'WheelEvent';};module.exports=WheelEvent;},{"./MouseEvent":32}],37:[function(require,module,exports){/**
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
 * A two-dimensional vector.
 *
 * @class Vec2
 *
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 */var Vec2=function Vec2(x,y){if(x instanceof Array||x instanceof Float32Array){this.x=x[0]||0;this.y=x[1]||0;}else{this.x=x||0;this.y=y||0;}};/**
 * Set the components of the current Vec2.
 *
 * @method
 *
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 *
 * @return {Vec2} this
 */Vec2.prototype.set=function set(x,y){if(x!=null)this.x=x;if(y!=null)this.y=y;return this;};/**
 * Add the input v to the current Vec2.
 *
 * @method
 *
 * @param {Vec2} v The Vec2 to add.
 *
 * @return {Vec2} this
 */Vec2.prototype.add=function add(v){this.x+=v.x;this.y+=v.y;return this;};/**
 * Subtract the input v from the current Vec2.
 *
 * @method
 *
 * @param {Vec2} v The Vec2 to subtract.
 *
 * @return {Vec2} this
 */Vec2.prototype.subtract=function subtract(v){this.x-=v.x;this.y-=v.y;return this;};/**
 * Scale the current Vec2 by a scalar or Vec2.
 *
 * @method
 *
 * @param {Number|Vec2} s The Number or vec2 by which to scale.
 *
 * @return {Vec2} this
 */Vec2.prototype.scale=function scale(s){if(s instanceof Vec2){this.x*=s.x;this.y*=s.y;}else{this.x*=s;this.y*=s;}return this;};/**
 * Rotate the Vec2 counter-clockwise by theta about the z-axis.
 *
 * @method
 *
 * @param {Number} theta Angle by which to rotate.
 *
 * @return {Vec2} this
 */Vec2.prototype.rotate=function(theta){var x=this.x;var y=this.y;var cosTheta=Math.cos(theta);var sinTheta=Math.sin(theta);this.x=x*cosTheta-y*sinTheta;this.y=x*sinTheta+y*cosTheta;return this;};/**
 * The dot product of of the current Vec2 with the input Vec2.
 *
 * @method
 *
 * @param {Number} v The other Vec2.
 *
 * @return {Vec2} this
 */Vec2.prototype.dot=function(v){return this.x*v.x+this.y*v.y;};/**
 * The cross product of of the current Vec2 with the input Vec2.
 *
 * @method
 *
 * @param {Number} v The other Vec2.
 *
 * @return {Vec2} this
 */Vec2.prototype.cross=function(v){return this.x*v.y-this.y*v.x;};/**
 * Preserve the magnitude but invert the orientation of the current Vec2.
 *
 * @method
 *
 * @return {Vec2} this
 */Vec2.prototype.invert=function invert(){this.x*=-1;this.y*=-1;return this;};/**
 * Apply a function component-wise to the current Vec2.
 *
 * @method
 *
 * @param {Function} fn Function to apply.
 *
 * @return {Vec2} this
 */Vec2.prototype.map=function map(fn){this.x=fn(this.x);this.y=fn(this.y);return this;};/**
 * Get the magnitude of the current Vec2.
 *
 * @method
 *
 * @return {Number} the length of the vector
 */Vec2.prototype.length=function length(){var x=this.x;var y=this.y;return Math.sqrt(x*x+y*y);};/**
 * Copy the input onto the current Vec2.
 *
 * @method
 *
 * @param {Vec2} v Vec2 to copy
 *
 * @return {Vec2} this
 */Vec2.prototype.copy=function copy(v){this.x=v.x;this.y=v.y;return this;};/**
 * Reset the current Vec2.
 *
 * @method
 *
 * @return {Vec2} this
 */Vec2.prototype.clear=function clear(){this.x=0;this.y=0;return this;};/**
 * Check whether the magnitude of the current Vec2 is exactly 0.
 *
 * @method
 *
 * @return {Boolean} whether or not the length is 0
 */Vec2.prototype.isZero=function isZero(){if(this.x!==0||this.y!==0)return false;else return true;};/**
 * The array form of the current Vec2.
 *
 * @method
 *
 * @return {Array} the Vec to as an array
 */Vec2.prototype.toArray=function toArray(){return[this.x,this.y];};/**
 * Normalize the input Vec2.
 *
 * @method
 *
 * @param {Vec2} v The reference Vec2.
 * @param {Vec2} output Vec2 in which to place the result.
 *
 * @return {Vec2} The normalized Vec2.
 */Vec2.normalize=function normalize(v,output){var x=v.x;var y=v.y;var length=Math.sqrt(x*x+y*y)||1;length=1/length;output.x=v.x*length;output.y=v.y*length;return output;};/**
 * Clone the input Vec2.
 *
 * @method
 *
 * @param {Vec2} v The Vec2 to clone.
 *
 * @return {Vec2} The cloned Vec2.
 */Vec2.clone=function clone(v){return new Vec2(v.x,v.y);};/**
 * Add the input Vec2's.
 *
 * @method
 *
 * @param {Vec2} v1 The left Vec2.
 * @param {Vec2} v2 The right Vec2.
 * @param {Vec2} output Vec2 in which to place the result.
 *
 * @return {Vec2} The result of the addition.
 */Vec2.add=function add(v1,v2,output){output.x=v1.x+v2.x;output.y=v1.y+v2.y;return output;};/**
 * Subtract the second Vec2 from the first.
 *
 * @method
 *
 * @param {Vec2} v1 The left Vec2.
 * @param {Vec2} v2 The right Vec2.
 * @param {Vec2} output Vec2 in which to place the result.
 *
 * @return {Vec2} The result of the subtraction.
 */Vec2.subtract=function subtract(v1,v2,output){output.x=v1.x-v2.x;output.y=v1.y-v2.y;return output;};/**
 * Scale the input Vec2.
 *
 * @method
 *
 * @param {Vec2} v The reference Vec2.
 * @param {Number} s Number to scale by.
 * @param {Vec2} output Vec2 in which to place the result.
 *
 * @return {Vec2} The result of the scaling.
 */Vec2.scale=function scale(v,s,output){output.x=v.x*s;output.y=v.y*s;return output;};/**
 * The dot product of the input Vec2's.
 *
 * @method
 *
 * @param {Vec2} v1 The left Vec2.
 * @param {Vec2} v2 The right Vec2.
 *
 * @return {Number} The dot product.
 */Vec2.dot=function dot(v1,v2){return v1.x*v2.x+v1.y*v2.y;};/**
 * The cross product of the input Vec2's.
 *
 * @method
 *
 * @param {Number} v1 The left Vec2.
 * @param {Number} v2 The right Vec2.
 *
 * @return {Number} The z-component of the cross product.
 */Vec2.cross=function(v1,v2){return v1.x*v2.y-v1.y*v2.x;};module.exports=Vec2;},{}],38:[function(require,module,exports){// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
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
     */cancelAnimationFrame:cAF};module.exports=animationFrame;},{}],39:[function(require,module,exports){/**
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
 */'use strict';module.exports={requestAnimationFrame:require('./animationFrame').requestAnimationFrame,cancelAnimationFrame:require('./animationFrame').cancelAnimationFrame};},{"./animationFrame":38}],40:[function(require,module,exports){/**
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
 */RequestAnimationFrameLoop.prototype.noLongerUpdate=function noLongerUpdate(updateable){var index=this._updates.indexOf(updateable);if(index>-1){this._updates.splice(index,1);}return this;};module.exports=RequestAnimationFrameLoop;},{"../polyfills":39}],41:[function(require,module,exports){/**
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
 */Compositor.prototype.clearCommands=function clearCommands(){this._inCommands.length=0;this._outCommands.length=0;this._resized=false;};module.exports=Compositor;},{"../core/Commands":8,"./Context":42,"./inject-css":44}],42:[function(require,module,exports){/**
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
function preventDefault(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.preventDefault(commands[++iterator]);return iterator;}function allowDefault(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.allowDefault(commands[++iterator]);return iterator;}function ready(context,path,commands,iterator){context._initDOM=true;return iterator;}function initDOM(context,path,commands,iterator){context._domRenderer.insertEl(commands[++iterator]);return iterator;}function domRenderSize(context,path,commands,iterator){context._domRenderer.getSizeOf(commands[++iterator]);return iterator;}function changeTransform(context,path,commands,iterator){var temp=context._meshTransform;temp[0]=commands[++iterator];temp[1]=commands[++iterator];temp[2]=commands[++iterator];temp[3]=commands[++iterator];temp[4]=commands[++iterator];temp[5]=commands[++iterator];temp[6]=commands[++iterator];temp[7]=commands[++iterator];temp[8]=commands[++iterator];temp[9]=commands[++iterator];temp[10]=commands[++iterator];temp[11]=commands[++iterator];temp[12]=commands[++iterator];temp[13]=commands[++iterator];temp[14]=commands[++iterator];temp[15]=commands[++iterator];context._domRenderer.setMatrix(temp);if(context._webGLRenderer)context._webGLRenderer.setCutoutUniform(path,'u_transform',temp);return iterator;}function changeSize(context,path,commands,iterator){var width=commands[++iterator];var height=commands[++iterator];context._domRenderer.setSize(width,height);if(context._webGLRenderer){context._meshSize[0]=width;context._meshSize[1]=height;context._webGLRenderer.setCutoutUniform(path,'u_size',context._meshSize);}return iterator;}function changeProperty(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.setProperty(commands[++iterator],commands[++iterator]);return iterator;}function changeContent(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.setContent(commands[++iterator]);return iterator;}function changeAttribute(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.setAttribute(commands[++iterator],commands[++iterator]);return iterator;}function addClass(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.addClass(commands[++iterator]);return iterator;}function removeClass(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.removeClass(commands[++iterator]);return iterator;}function subscribe(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.subscribe(commands[++iterator]);return iterator;}function unsubscribe(context,path,commands,iterator){if(context._webGLRenderer)context._webGLRenderer.getOrSetCutout(path);context._domRenderer.unsubscribe(commands[++iterator]);return iterator;}function glSetDrawOptions(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.setMeshOptions(path,commands[++iterator]);return iterator;}function glAmbientLight(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.setAmbientLightColor(path,commands[++iterator],commands[++iterator],commands[++iterator]);return iterator;}function glLightPosition(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.setLightPosition(path,commands[++iterator],commands[++iterator],commands[++iterator]);return iterator;}function glLightColor(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.setLightColor(path,commands[++iterator],commands[++iterator],commands[++iterator]);return iterator;}function materialInput(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.handleMaterialInput(path,commands[++iterator],commands[++iterator]);return iterator;}function glSetGeometry(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.setGeometry(path,commands[++iterator],commands[++iterator],commands[++iterator]);return iterator;}function glUniforms(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.setMeshUniform(path,commands[++iterator],commands[++iterator]);return iterator;}function glBufferData(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.bufferData(commands[++iterator],commands[++iterator],commands[++iterator],commands[++iterator],commands[++iterator]);return iterator;}function glCutoutState(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.setCutoutState(path,commands[++iterator]);return iterator;}function glMeshVisibility(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.setMeshVisibility(path,commands[++iterator]);return iterator;}function glRemoveMesh(context,path,commands,iterator){if(!context._webGLRenderer)context._initWebGLRenderer();context._webGLRenderer.removeMesh(path);return iterator;}function pinholeProjection(context,path,commands,iterator){context._renderState.projectionType=Camera.PINHOLE_PROJECTION;context._renderState.perspectiveTransform[11]=-1/commands[++iterator];context._renderState.perspectiveDirty=true;return iterator;}function orthographicProjection(context,path,commands,iterator){context._renderState.projectionType=Camera.ORTHOGRAPHIC_PROJECTION;context._renderState.perspectiveTransform[11]=0;context._renderState.perspectiveDirty=true;return iterator;}function changeViewTransform(context,path,commands,iterator){context._renderState.viewTransform[0]=commands[++iterator];context._renderState.viewTransform[1]=commands[++iterator];context._renderState.viewTransform[2]=commands[++iterator];context._renderState.viewTransform[3]=commands[++iterator];context._renderState.viewTransform[4]=commands[++iterator];context._renderState.viewTransform[5]=commands[++iterator];context._renderState.viewTransform[6]=commands[++iterator];context._renderState.viewTransform[7]=commands[++iterator];context._renderState.viewTransform[8]=commands[++iterator];context._renderState.viewTransform[9]=commands[++iterator];context._renderState.viewTransform[10]=commands[++iterator];context._renderState.viewTransform[11]=commands[++iterator];context._renderState.viewTransform[12]=commands[++iterator];context._renderState.viewTransform[13]=commands[++iterator];context._renderState.viewTransform[14]=commands[++iterator];context._renderState.viewTransform[15]=commands[++iterator];context._renderState.viewDirty=true;return iterator;}module.exports=Context;},{"../components/Camera":2,"../core/Commands":8,"../dom-renderers/DOMRenderer":22,"../webgl-renderers/WebGLRenderer":58}],43:[function(require,module,exports){/**
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
 */UIManager.prototype.update=function update(time){this._thread.postMessage([Commands.FRAME,time]);var threadMessages=this._compositor.drawCommands();this._thread.postMessage(threadMessages);this._compositor.clearCommands();};module.exports=UIManager;},{"../core/Chan":5,"../core/Commands":8}],44:[function(require,module,exports){/**
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
 */'use strict';var css='.famous-dom-renderer {'+'width:100%;'+'height:100%;'+'transform-style:preserve-3d;'+'-webkit-transform-style:preserve-3d;'+'}'+'.famous-dom-element {'+'-webkit-transform-origin:0% 0%;'+'transform-origin:0% 0%;'+'-webkit-backface-visibility:visible;'+'backface-visibility:visible;'+'-webkit-transform-style:preserve-3d;'+'transform-style:preserve-3d;'+'-webkit-tap-highlight-color:transparent;'+'pointer-events:auto;'+'z-index:1;'+'}'+'.famous-dom-element-content,'+'.famous-dom-element {'+'position:absolute;'+'box-sizing:border-box;'+'-moz-box-sizing:border-box;'+'-webkit-box-sizing:border-box;'+'}'+'.famous-webgl-renderer {'+'-webkit-transform:translateZ(1000000px);'+/* TODO: Fix when Safari Fixes*/'transform:translateZ(1000000px);'+'pointer-events:none;'+'position:absolute;'+'z-index:1;'+'top:0;'+'width:100%;'+'height:100%;'+'}';var INJECTED=typeof document==='undefined';function injectCSS(){if(INJECTED)return;INJECTED=true;if(document.createStyleSheet){var sheet=document.createStyleSheet();sheet.cssText=css;}else{var head=document.getElementsByTagName('head')[0];var style=document.createElement('style');if(style.styleSheet){style.styleSheet.cssText=css;}else{style.appendChild(document.createTextNode(css));}(head?head:document.documentElement).appendChild(style);}}module.exports=injectCSS;},{}],45:[function(require,module,exports){/**
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
 *//*jshint -W008 */'use strict';/**
 * A library of curves which map an animation explicitly as a function of time.
 *
 * @namespace
 * @property {Function} linear
 * @property {Function} easeIn
 * @property {Function} easeOut
 * @property {Function} easeInOut
 * @property {Function} easeOutBounce
 * @property {Function} spring
 * @property {Function} inQuad
 * @property {Function} outQuad
 * @property {Function} inOutQuad
 * @property {Function} inCubic
 * @property {Function} outCubic
 * @property {Function} inOutCubic
 * @property {Function} inQuart
 * @property {Function} outQuart
 * @property {Function} inOutQuart
 * @property {Function} inQuint
 * @property {Function} outQuint
 * @property {Function} inOutQuint
 * @property {Function} inSine
 * @property {Function} outSine
 * @property {Function} inOutSine
 * @property {Function} inExpo
 * @property {Function} outExpo
 * @property {Function} inOutExp
 * @property {Function} inCirc
 * @property {Function} outCirc
 * @property {Function} inOutCirc
 * @property {Function} inElastic
 * @property {Function} outElastic
 * @property {Function} inOutElastic
 * @property {Function} inBounce
 * @property {Function} outBounce
 * @property {Function} inOutBounce
 * @property {Function} flat            - Useful for delaying the execution of
 *                                        a subsequent transition.
 */var Curves={linear:function linear(t){return t;},easeIn:function easeIn(t){return t*t;},easeOut:function easeOut(t){return t*(2-t);},easeInOut:function easeInOut(t){if(t<=0.5)return 2*t*t;else return-2*t*t+4*t-1;},easeOutBounce:function easeOutBounce(t){return t*(3-2*t);},spring:function spring(t){return(1-t)*Math.sin(6*Math.PI*t)+t;},inQuad:function inQuad(t){return t*t;},outQuad:function outQuad(t){return-(t-=1)*t+1;},inOutQuad:function inOutQuad(t){if((t/=.5)<1)return .5*t*t;return-.5*(--t*(t-2)-1);},inCubic:function inCubic(t){return t*t*t;},outCubic:function outCubic(t){return--t*t*t+1;},inOutCubic:function inOutCubic(t){if((t/=.5)<1)return .5*t*t*t;return .5*((t-=2)*t*t+2);},inQuart:function inQuart(t){return t*t*t*t;},outQuart:function outQuart(t){return-(--t*t*t*t-1);},inOutQuart:function inOutQuart(t){if((t/=.5)<1)return .5*t*t*t*t;return-.5*((t-=2)*t*t*t-2);},inQuint:function inQuint(t){return t*t*t*t*t;},outQuint:function outQuint(t){return--t*t*t*t*t+1;},inOutQuint:function inOutQuint(t){if((t/=.5)<1)return .5*t*t*t*t*t;return .5*((t-=2)*t*t*t*t+2);},inSine:function inSine(t){return-1.0*Math.cos(t*(Math.PI/2))+1.0;},outSine:function outSine(t){return Math.sin(t*(Math.PI/2));},inOutSine:function inOutSine(t){return-.5*(Math.cos(Math.PI*t)-1);},inExpo:function inExpo(t){return t===0?0.0:Math.pow(2,10*(t-1));},outExpo:function outExpo(t){return t===1.0?1.0:-Math.pow(2,-10*t)+1;},inOutExpo:function inOutExpo(t){if(t===0)return 0.0;if(t===1.0)return 1.0;if((t/=.5)<1)return .5*Math.pow(2,10*(t-1));return .5*(-Math.pow(2,-10*--t)+2);},inCirc:function inCirc(t){return-(Math.sqrt(1-t*t)-1);},outCirc:function outCirc(t){return Math.sqrt(1- --t*t);},inOutCirc:function inOutCirc(t){if((t/=.5)<1)return-.5*(Math.sqrt(1-t*t)-1);return .5*(Math.sqrt(1-(t-=2)*t)+1);},inElastic:function inElastic(t){var s=1.70158;var p=0;var a=1.0;if(t===0)return 0.0;if(t===1)return 1.0;if(!p)p=.3;s=p/(2*Math.PI)*Math.asin(1.0/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t-s)*(2*Math.PI)/p));},outElastic:function outElastic(t){var s=1.70158;var p=0;var a=1.0;if(t===0)return 0.0;if(t===1)return 1.0;if(!p)p=.3;s=p/(2*Math.PI)*Math.asin(1.0/a);return a*Math.pow(2,-10*t)*Math.sin((t-s)*(2*Math.PI)/p)+1.0;},inOutElastic:function inOutElastic(t){var s=1.70158;var p=0;var a=1.0;if(t===0)return 0.0;if((t/=.5)===2)return 1.0;if(!p)p=.3*1.5;s=p/(2*Math.PI)*Math.asin(1.0/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t-s)*(2*Math.PI)/p));return a*Math.pow(2,-10*(t-=1))*Math.sin((t-s)*(2*Math.PI)/p)*.5+1.0;},inBack:function inBack(t,s){if(s===undefined)s=1.70158;return t*t*((s+1)*t-s);},outBack:function outBack(t,s){if(s===undefined)s=1.70158;return--t*t*((s+1)*t+s)+1;},inOutBack:function inOutBack(t,s){if(s===undefined)s=1.70158;if((t/=.5)<1)return .5*(t*t*(((s*=1.525)+1)*t-s));return .5*((t-=2)*t*(((s*=1.525)+1)*t+s)+2);},inBounce:function inBounce(t){return 1.0-Curves.outBounce(1.0-t);},outBounce:function outBounce(t){if(t<1/2.75){return 7.5625*t*t;}else if(t<2/2.75){return 7.5625*(t-=1.5/2.75)*t+.75;}else if(t<2.5/2.75){return 7.5625*(t-=2.25/2.75)*t+.9375;}else{return 7.5625*(t-=2.625/2.75)*t+.984375;}},inOutBounce:function inOutBounce(t){if(t<.5)return Curves.inBounce(t*2)*.5;return Curves.outBounce(t*2-1.0)*.5+.5;},flat:function flat(){return 0;}};module.exports=Curves;},{}],46:[function(require,module,exports){/**
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
 */'use strict';var Curves=require('./Curves');var FamousEngine=require('../core/FamousEngine');/**
 * A state maintainer for a smooth transition between
 *    numerically-specified states. Example numeric states include floats and
 *    arrays of floats objects.
 *
 * An initial state is set with the constructor or using
 *     {@link Transitionable#from}. Subsequent transitions consist of an
 *     intermediate state, easing curve, duration and callback. The final state
 *     of each transition is the initial state of the subsequent one. Calls to
 *     {@link Transitionable#get} provide the interpolated state along the way.
 *
 * Note that there is no event loop here - calls to {@link Transitionable#get}
 *    are the only way to find state projected to the current (or provided)
 *    time and are the only way to trigger callbacks and mutate the internal
 *    transition queue.
 *
 * @example
 * var t = new Transitionable([0, 0]);
 * t
 *     .to([100, 0], 'linear', 1000)
 *     .delay(1000)
 *     .to([200, 0], 'outBounce', 1000);
 *
 * var div = document.createElement('div');
 * div.style.background = 'blue';
 * div.style.width = '100px';
 * div.style.height = '100px';
 * document.body.appendChild(div);
 *
 * div.addEventListener('click', function() {
 *     t.isPaused() ? t.resume() : t.pause();
 * });
 *
 * requestAnimationFrame(function loop() {
 *     div.style.transform = 'translateX(' + t.get()[0] + 'px)' + ' translateY(' + t.get()[1] + 'px)';
 *     requestAnimationFrame(loop);
 * });
 *
 * @class Transitionable
 * @constructor
 * @param {Number|Array.Number} initialState    initial state to transition
 *                                              from - equivalent to a pursuant
 *                                              invocation of
 *                                              {@link Transitionable#from}
 */function Transitionable(initialState){this._queue=[];this._from=null;this._state=null;this._startedAt=null;this._pausedAt=null;if(initialState!=null)this.from(initialState);}/**
 * Internal Clock used for determining the current time for the ongoing
 * transitions.
 *
 * @type {Performance|Date|Clock}
 */Transitionable.Clock=FamousEngine.getClock();/**
 * Registers a transition to be pushed onto the internal queue.
 *
 * @method to
 * @chainable
 *
 * @param  {Number|Array.Number}    finalState              final state to
 *                                                          transiton to
 * @param  {String|Function}        [curve=Curves.linear]   easing function
 *                                                          used for
 *                                                          interpolating
 *                                                          [0, 1]
 * @param  {Number}                 [duration=100]          duration of
 *                                                          transition
 * @param  {Function}               [callback]              callback function
 *                                                          to be called after
 *                                                          the transition is
 *                                                          complete
 * @param  {String}                 [method]                method used for
 *                                                          interpolation
 *                                                          (e.g. slerp)
 * @return {Transitionable}         this
 */Transitionable.prototype.to=function to(finalState,curve,duration,callback,method){curve=curve!=null&&curve.constructor===String?Curves[curve]:curve;if(this._queue.length===0){this._startedAt=this.constructor.Clock.now();this._pausedAt=null;}this._queue.push(finalState,curve!=null?curve:Curves.linear,duration!=null?duration:100,callback,method);return this;};/**
 * Resets the transition queue to a stable initial state.
 *
 * @method from
 * @chainable
 *
 * @param  {Number|Array.Number}    initialState    initial state to
 *                                                  transition from
 * @return {Transitionable}         this
 */Transitionable.prototype.from=function from(initialState){this._state=initialState;this._from=this._sync(null,this._state);this._queue.length=0;this._startedAt=this.constructor.Clock.now();this._pausedAt=null;return this;};/**
 * Delays the execution of the subsequent transition for a certain period of
 * time.
 *
 * @method delay
 * @chainable
 *
 * @param {Number}      duration    delay time in ms
 * @param {Function}    [callback]  Zero-argument function to call on observed
 *                                  completion (t=1)
 * @return {Transitionable}         this
 */Transitionable.prototype.delay=function delay(duration,callback){var endState=this._queue.length>0?this._queue[this._queue.length-5]:this._state;return this.to(endState,Curves.flat,duration,callback);};/**
 * Overrides current transition.
 *
 * @method override
 * @chainable
 *
 * @param  {Number|Array.Number}    [finalState]    final state to transiton to
 * @param  {String|Function}        [curve]         easing function used for
 *                                                  interpolating [0, 1]
 * @param  {Number}                 [duration]      duration of transition
 * @param  {Function}               [callback]      callback function to be
 *                                                  called after the transition
 *                                                  is complete
 * @param {String}                  [method]        optional method used for
 *                                                  interpolating between the
 *                                                  values. Set to `slerp` for
 *                                                  spherical linear
 *                                                  interpolation.
 * @return {Transitionable}         this
 */Transitionable.prototype.override=function override(finalState,curve,duration,callback,method){if(this._queue.length>0){if(finalState!=null)this._queue[0]=finalState;if(curve!=null)this._queue[1]=curve.constructor===String?Curves[curve]:curve;if(duration!=null)this._queue[2]=duration;if(callback!=null)this._queue[3]=callback;if(method!=null)this._queue[4]=method;}return this;};/**
 * Used for interpolating between the start and end state of the currently
 * running transition
 *
 * @method  _interpolate
 * @private
 *
 * @param  {Object|Array|Number} output     Where to write to (in order to avoid
 *                                          object allocation and therefore GC).
 * @param  {Object|Array|Number} from       Start state of current transition.
 * @param  {Object|Array|Number} to         End state of current transition.
 * @param  {Number} progress                Progress of the current transition,
 *                                          in [0, 1]
 * @param  {String} method                  Method used for interpolation (e.g.
 *                                          slerp)
 * @return {Object|Array|Number}            output
 */Transitionable.prototype._interpolate=function _interpolate(output,from,to,progress,method){if(to instanceof Object){if(method==='slerp'){var x,y,z,w;var qx,qy,qz,qw;var omega,cosomega,sinomega,scaleFrom,scaleTo;x=from[0];y=from[1];z=from[2];w=from[3];qx=to[0];qy=to[1];qz=to[2];qw=to[3];if(progress===1){output[0]=qx;output[1]=qy;output[2]=qz;output[3]=qw;return output;}cosomega=w*qw+x*qx+y*qy+z*qz;if(1.0-cosomega>1e-5){omega=Math.acos(cosomega);sinomega=Math.sin(omega);scaleFrom=Math.sin((1.0-progress)*omega)/sinomega;scaleTo=Math.sin(progress*omega)/sinomega;}else{scaleFrom=1.0-progress;scaleTo=progress;}output[0]=x*scaleFrom+qx*scaleTo;output[1]=y*scaleFrom+qy*scaleTo;output[2]=z*scaleFrom+qz*scaleTo;output[3]=w*scaleFrom+qw*scaleTo;}else if(to instanceof Array){for(var i=0,len=to.length;i<len;i++){output[i]=this._interpolate(output[i],from[i],to[i],progress,method);}}else{for(var key in to){output[key]=this._interpolate(output[key],from[key],to[key],progress,method);}}}else{output=from+progress*(to-from);}return output;};/**
 * Internal helper method used for synchronizing the current, absolute state of
 * a transition to a given output array, object literal or number. Supports
 * nested state objects by through recursion.
 *
 * @method  _sync
 * @private
 *
 * @param  {Number|Array|Object} output     Where to write to (in order to avoid
 *                                          object allocation and therefore GC).
 * @param  {Number|Array|Object} input      Input state to proxy onto the
 *                                          output.
 * @return {Number|Array|Object} output     Passed in output object.
 */Transitionable.prototype._sync=function _sync(output,input){if(typeof input==='number')output=input;else if(input instanceof Array){if(output==null)output=[];for(var i=0,len=input.length;i<len;i++){output[i]=_sync(output[i],input[i]);}}else if(input instanceof Object){if(output==null)output={};for(var key in input){output[key]=_sync(output[key],input[key]);}}return output;};/**
 * Get interpolated state of current action at provided time. If the last
 *    action has completed, invoke its callback.
 *
 * @method get
 *
 * @param {Number=} t               Evaluate the curve at a normalized version
 *                                  of this time. If omitted, use current time
 *                                  (Unix epoch time retrieved from Clock).
 * @return {Number|Array.Number}    Beginning state interpolated to this point
 *                                  in time.
 */Transitionable.prototype.get=function get(t){if(this._queue.length===0)return this._state;t=this._pausedAt?this._pausedAt:t;t=t?t:this.constructor.Clock.now();var progress=(t-this._startedAt)/this._queue[2];this._state=this._interpolate(this._state,this._from,this._queue[0],this._queue[1](progress>1?1:progress),this._queue[4]);var state=this._state;if(progress>=1){this._startedAt=this._startedAt+this._queue[2];this._from=this._sync(this._from,this._state);this._queue.shift();this._queue.shift();this._queue.shift();var callback=this._queue.shift();this._queue.shift();if(callback)callback();}return progress>1?this.get():state;};/**
 * Is there at least one transition pending completion?
 *
 * @method isActive
 *
 * @return {Boolean}    Boolean indicating whether there is at least one pending
 *                      transition. Paused transitions are still being
 *                      considered active.
 */Transitionable.prototype.isActive=function isActive(){return this._queue.length>0;};/**
 * Halt transition at current state and erase all pending actions.
 *
 * @method halt
 * @chainable
 *
 * @return {Transitionable} this
 */Transitionable.prototype.halt=function halt(){return this.from(this.get());};/**
 * Pause transition. This will not erase any actions.
 *
 * @method pause
 * @chainable
 *
 * @return {Transitionable} this
 */Transitionable.prototype.pause=function pause(){this._pausedAt=this.constructor.Clock.now();return this;};/**
 * Has the current action been paused?
 *
 * @method isPaused
 * @chainable
 *
 * @return {Boolean} if the current action has been paused
 */Transitionable.prototype.isPaused=function isPaused(){return!!this._pausedAt;};/**
 * Resume a previously paused transition.
 *
 * @method resume
 * @chainable
 *
 * @return {Transitionable} this
 */Transitionable.prototype.resume=function resume(){var diff=this._pausedAt-this._startedAt;this._startedAt=this.constructor.Clock.now()-diff;this._pausedAt=null;return this;};/**
 * Cancel all transitions and reset to a stable state
 *
 * @method reset
 * @chainable
 * @deprecated Use `.from` instead!
 *
 * @param {Number|Array.Number|Object.<number, number>} start
 *    stable state to set to
 * @return {Transitionable}                             this
 */Transitionable.prototype.reset=function(start){return this.from(start);};/**
 * Add transition to end state to the queue of pending transitions. Special
 *    Use: calling without a transition resets the object to that state with
 *    no pending actions
 *
 * @method set
 * @chainable
 * @deprecated Use `.to` instead!
 *
 * @param {Number|FamousEngineMatrix|Array.Number|Object.<number, number>} state
 *    end state to which we interpolate
 * @param {transition=} transition object of type {duration: number, curve:
 *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
 *    instantaneous.
 * @param {function()=} callback Zero-argument function to call on observed
 *    completion (t=1)
 * @return {Transitionable} this
 */Transitionable.prototype.set=function(state,transition,callback){if(transition==null){this.from(state);if(callback)callback();}else{this.to(state,transition.curve,transition.duration,callback,transition.method);}return this;};module.exports=Transitionable;},{"../core/FamousEngine":12,"./Curves":45}],47:[function(require,module,exports){/**
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
 */CallbackStore.prototype.trigger=function trigger(key,payload){var events=this._events[key];if(events){var i=0;var len=events.length;for(;i<len;i++){events[i](payload);}}return this;};module.exports=CallbackStore;},{}],48:[function(require,module,exports){'use strict';function Registry(){this._keyToValue={};this._values=[];this._keys=[];this._keyToIndex={};this._freedIndices=[];}Registry.prototype.register=function register(key,value){var index=this._keyToIndex[key];if(index==null){index=this._freedIndices.pop();if(index===undefined)index=this._values.length;this._values[index]=value;this._keys[index]=key;this._keyToIndex[key]=index;this._keyToValue[key]=value;}else{this._keyToValue[key]=value;this._values[index]=value;}};Registry.prototype.unregister=function unregister(key){var index=this._keyToIndex[key];if(index!=null){this._freedIndices.push(index);this._keyToValue[key]=null;this._keyToIndex[key]=null;this._values[index]=null;this._keys[index]=null;}};Registry.prototype.get=function get(key){return this._keyToValue[key];};Registry.prototype.getValues=function getValues(){return this._values;};Registry.prototype.getKeys=function getKeys(){return this._keys;};Registry.prototype.getKeyToValue=function getKeyToValue(){return this._keyToValue;};module.exports=Registry;},{}],49:[function(require,module,exports){/**
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
 */var clone=function clone(b){var a;if((typeof b==="undefined"?"undefined":_typeof(b))==='object'){a=b instanceof Array?[]:{};for(var key in b){if(_typeof(b[key])==='object'&&b[key]!==null){if(b[key]instanceof Array){a[key]=new Array(b[key].length);for(var i=0;i<b[key].length;i++){a[key][i]=clone(b[key][i]);}}else{a[key]=clone(b[key]);}}else{a[key]=b[key];}}}else{a=b;}return a;};module.exports=clone;},{}],50:[function(require,module,exports){'use strict';/**
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
 */module.exports=function keyValuesToArrays(obj){var keysArray=[],valuesArray=[];var i=0;for(var key in obj){if(obj.hasOwnProperty(key)){keysArray[i]=key;valuesArray[i]=obj[key];i++;}}return{keys:keysArray,values:valuesArray};};},{}],51:[function(require,module,exports){/**
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
 */function vendorPrefix(property){for(var i=0;i<PREFIXES.length;i++){var prefixed=PREFIXES[i]+property;if(document.documentElement.style[prefixed]===''){return prefixed;}}return property;}module.exports=vendorPrefix;},{}],52:[function(require,module,exports){/**
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
for(var i=0,chunk=10000;i<this.data.length;i+=chunk){data=Array.prototype.concat.apply(data,this.data.slice(i,i+chunk));}this.buffer=this.buffer||gl.createBuffer();gl.bindBuffer(this.target,this.buffer);gl.bufferData(this.target,new this.type(data),gl.STATIC_DRAW);};module.exports=Buffer;},{}],53:[function(require,module,exports){/**
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
vertexBuffers.keys.push(name);vertexBuffers.values.push(buffer);vertexBuffers.spacing.push(spacing);vertexBuffers.offset.push(offset);vertexBuffers.length.push(length);}var len=value.length;for(k=0;k<len;k++){vertexBuffers.values[j].data[offset+k]=value[k];}vertexBuffers.values[j].subData();};module.exports=BufferRegistry;},{"./Buffer":52}],54:[function(require,module,exports){'use strict';/**
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
function _processErrors(errors,source){var css='body,html{background:#e3e3e3;font-family:monaco,monospace;font-size:14px;line-height:1.7em}'+'#shaderReport{left:0;top:0;right:0;box-sizing:border-box;position:absolute;z-index:1000;color:'+'#222;padding:15px;white-space:normal;list-style-type:none;margin:50px auto;max-width:1200px}'+'#shaderReport li{background-color:#fff;margin:13px 0;box-shadow:0 1px 2px rgba(0,0,0,.15);'+'padding:20px 30px;border-radius:2px;border-left:20px solid #e01111}span{color:#e01111;'+'text-decoration:underline;font-weight:700}#shaderReport li p{padding:0;margin:0}'+'#shaderReport li:nth-child(even){background-color:#f4f4f4}'+'#shaderReport li p:first-child{margin-bottom:10px;color:#666}';var el=document.createElement('style');document.getElementsByTagName('head')[0].appendChild(el);el.textContent=css;var report=document.createElement('ul');report.setAttribute('id','shaderReport');document.body.appendChild(report);var re=/ERROR: [\d]+:([\d]+): (.+)/gmi;var lines=source.split('\n');var m;while((m=re.exec(errors))!=null){if(m.index===re.lastIndex)re.lastIndex++;var li=document.createElement('li');var code='<p><span>ERROR</span> "'+m[2]+'" in line '+m[1]+'</p>';code+='<p><b>'+lines[m[1]-1].replace(/^[ \t]+/g,'')+'</b></p>';li.innerHTML=code;report.appendChild(li);}}module.exports=Debug;},{}],55:[function(require,module,exports){/**
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
 */Program.prototype.compileShader=function compileShader(shader,source){var i=1;this.gl.shaderSource(shader,source);this.gl.compileShader(shader);if(!this.gl.getShaderParameter(shader,this.gl.COMPILE_STATUS)){console.error('compile error: '+this.gl.getShaderInfoLog(shader));console.error('1: '+source.replace(/\n/g,function(){return'\n'+(i+=1)+': ';}));}return shader;};module.exports=Program;},{"../utilities/clone":49,"../utilities/keyValueToArrays":50,"../webgl-shaders":62,"./Debug":54}],56:[function(require,module,exports){/**
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
 */Texture.prototype.readBack=function readBack(x,y,width,height){var gl=this.gl;var pixels;x=x||0;y=y||0;width=width||this.width;height=height||this.height;var fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,this.id,0);if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE){pixels=new Uint8Array(width*height*4);gl.readPixels(x,y,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);}return pixels;};module.exports=Texture;},{}],57:[function(require,module,exports){/**
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
spec.texture.setImage(spec.source);this._needsResample[spec.id]=false;}};module.exports=TextureManager;},{"./Texture":56,"./createCheckerboard":60}],58:[function(require,module,exports){/**
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
 */WebGLRenderer.prototype.resetOptions=function resetOptions(options){var gl=this.gl;if(!options)return;if(options.blending)gl.disable(gl.BLEND);if(options.side==='back')gl.cullFace(gl.BACK);};module.exports=WebGLRenderer;},{"../utilities/Registry":48,"../utilities/keyValueToArrays":50,"./BufferRegistry":53,"./Program":55,"./TextureManager":57,"./compileMaterial":59,"./radixSort":61}],59:[function(require,module,exports){/**
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
function _arrayToVec(array){var len=array.length;return'vec'+len+'('+array.join(',')+')';}module.exports=compileMaterial;},{}],60:[function(require,module,exports){/**
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
 */function createCheckerBoard(){var context=document.createElement('canvas').getContext('2d');context.canvas.width=context.canvas.height=128;for(var y=0;y<context.canvas.height;y+=16){for(var x=0;x<context.canvas.width;x+=16){context.fillStyle=(x^y)&16?'#FFF':'#DDD';context.fillRect(x,y,16,16);}}return context.canvas;}module.exports=createCheckerBoard;},{}],61:[function(require,module,exports){/**
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
 */function radixSort(list,registry){var pass=0;var out=[];var i,j,k,n,div,offset,swap,id,sum,tsum,size;passCount=32/radixBits+0.999999999999999|0;for(i=0,n=maxRadix*passCount;i<n;i++){buckets[i]=0;}for(i=0,n=list.length;i<n;i++){div=floatToInt(comp(list,registry,i));div^=div>>31|0x80000000;for(j=0,k=0;j<maxOffset;j+=maxRadix,k+=radixBits){buckets[j+(div>>>k&radixMask)]++;}buckets[j+(div>>>k&lastMask)]++;}for(j=0;j<=maxOffset;j+=maxRadix){for(id=j,sum=0;id<j+maxRadix;id++){tsum=buckets[id]+sum;buckets[id]=sum-1;sum=tsum;}}if(--passCount){for(i=0,n=list.length;i<n;i++){div=floatToInt(comp(list,registry,i));out[++buckets[div&radixMask]]=mutator(list,registry,i,div^=div>>31|0x80000000);}swap=out;out=list;list=swap;while(++pass<passCount){for(i=0,n=list.length,offset=pass*maxRadix,size=pass*radixBits;i<n;i++){div=floatToInt(comp(list,registry,i));out[++buckets[offset+(div>>>size&radixMask)]]=list[i];}swap=out;out=list;list=swap;}}for(i=0,n=list.length,offset=pass*maxRadix,size=pass*radixBits;i<n;i++){div=floatToInt(comp(list,registry,i));out[++buckets[offset+(div>>>size&lastMask)]]=mutator(list,registry,i,div^(~div>>31|0x80000000));clean(list,registry,i);}return out;}module.exports=radixSort;},{}],62:[function(require,module,exports){/**
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
 */'use strict';var shaders={vertex:"#define GLSLIFY 1\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * Calculates transpose inverse matrix from transform\r\n * \r\n * @method random\r\n * @private\r\n *\r\n *\r\n */\r\n\r\n\r\nmat3 getNormalMatrix_1_0(in mat4 t) {\r\n   mat3 matNorm;\r\n   mat4 a = t;\r\n\r\n   float a00 = a[0][0], a01 = a[0][1], a02 = a[0][2], a03 = a[0][3],\r\n   a10 = a[1][0], a11 = a[1][1], a12 = a[1][2], a13 = a[1][3],\r\n   a20 = a[2][0], a21 = a[2][1], a22 = a[2][2], a23 = a[2][3],\r\n   a30 = a[3][0], a31 = a[3][1], a32 = a[3][2], a33 = a[3][3],\r\n   b00 = a00 * a11 - a01 * a10,\r\n   b01 = a00 * a12 - a02 * a10,\r\n   b02 = a00 * a13 - a03 * a10,\r\n   b03 = a01 * a12 - a02 * a11,\r\n   b04 = a01 * a13 - a03 * a11,\r\n   b05 = a02 * a13 - a03 * a12,\r\n   b06 = a20 * a31 - a21 * a30,\r\n   b07 = a20 * a32 - a22 * a30,\r\n   b08 = a20 * a33 - a23 * a30,\r\n   b09 = a21 * a32 - a22 * a31,\r\n   b10 = a21 * a33 - a23 * a31,\r\n   b11 = a22 * a33 - a23 * a32,\r\n\r\n   det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\r\n   det = 1.0 / det;\r\n\r\n   matNorm[0][0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;\r\n   matNorm[0][1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;\r\n   matNorm[0][2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;\r\n\r\n   matNorm[1][0] = (a02 * b10 - a01 * b11 - a03 * b09) * det;\r\n   matNorm[1][1] = (a00 * b11 - a02 * b08 + a03 * b07) * det;\r\n   matNorm[1][2] = (a01 * b08 - a00 * b10 - a03 * b06) * det;\r\n\r\n   matNorm[2][0] = (a31 * b05 - a32 * b04 + a33 * b03) * det;\r\n   matNorm[2][1] = (a32 * b02 - a30 * b05 - a33 * b01) * det;\r\n   matNorm[2][2] = (a30 * b04 - a31 * b02 + a33 * b00) * det;\r\n\r\n   return matNorm;\r\n}\r\n\r\n\n\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * Calculates a matrix that creates the identity when multiplied by m\r\n * \r\n * @method inverse\r\n * @private\r\n *\r\n *\r\n */\r\n\r\n\r\nfloat inverse_2_1(float m) {\r\n    return 1.0 / m;\r\n}\r\n\r\nmat2 inverse_2_1(mat2 m) {\r\n    return mat2(m[1][1],-m[0][1],\r\n               -m[1][0], m[0][0]) / (m[0][0]*m[1][1] - m[0][1]*m[1][0]);\r\n}\r\n\r\nmat3 inverse_2_1(mat3 m) {\r\n    float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];\r\n    float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];\r\n    float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];\r\n\r\n    float b01 =  a22 * a11 - a12 * a21;\r\n    float b11 = -a22 * a10 + a12 * a20;\r\n    float b21 =  a21 * a10 - a11 * a20;\r\n\r\n    float det = a00 * b01 + a01 * b11 + a02 * b21;\r\n\r\n    return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),\r\n                b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),\r\n                b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;\r\n}\r\n\r\nmat4 inverse_2_1(mat4 m) {\r\n    float\r\n        a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],\r\n        a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],\r\n        a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],\r\n        a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],\r\n\r\n        b00 = a00 * a11 - a01 * a10,\r\n        b01 = a00 * a12 - a02 * a10,\r\n        b02 = a00 * a13 - a03 * a10,\r\n        b03 = a01 * a12 - a02 * a11,\r\n        b04 = a01 * a13 - a03 * a11,\r\n        b05 = a02 * a13 - a03 * a12,\r\n        b06 = a20 * a31 - a21 * a30,\r\n        b07 = a20 * a32 - a22 * a30,\r\n        b08 = a20 * a33 - a23 * a30,\r\n        b09 = a21 * a32 - a22 * a31,\r\n        b10 = a21 * a33 - a23 * a31,\r\n        b11 = a22 * a33 - a23 * a32,\r\n\r\n        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\r\n\r\n    return mat4(\r\n        a11 * b11 - a12 * b10 + a13 * b09,\r\n        a02 * b10 - a01 * b11 - a03 * b09,\r\n        a31 * b05 - a32 * b04 + a33 * b03,\r\n        a22 * b04 - a21 * b05 - a23 * b03,\r\n        a12 * b08 - a10 * b11 - a13 * b07,\r\n        a00 * b11 - a02 * b08 + a03 * b07,\r\n        a32 * b02 - a30 * b05 - a33 * b01,\r\n        a20 * b05 - a22 * b02 + a23 * b01,\r\n        a10 * b10 - a11 * b08 + a13 * b06,\r\n        a01 * b08 - a00 * b10 - a03 * b06,\r\n        a30 * b04 - a31 * b02 + a33 * b00,\r\n        a21 * b02 - a20 * b04 - a23 * b00,\r\n        a11 * b07 - a10 * b09 - a12 * b06,\r\n        a00 * b09 - a01 * b07 + a02 * b06,\r\n        a31 * b01 - a30 * b03 - a32 * b00,\r\n        a20 * b03 - a21 * b01 + a22 * b00) / det;\r\n}\r\n\r\n\n\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * Reflects a matrix over its main diagonal.\r\n * \r\n * @method transpose\r\n * @private\r\n *\r\n *\r\n */\r\n\r\n\r\nfloat transpose_3_2(float m) {\r\n    return m;\r\n}\r\n\r\nmat2 transpose_3_2(mat2 m) {\r\n    return mat2(m[0][0], m[1][0],\r\n                m[0][1], m[1][1]);\r\n}\r\n\r\nmat3 transpose_3_2(mat3 m) {\r\n    return mat3(m[0][0], m[1][0], m[2][0],\r\n                m[0][1], m[1][1], m[2][1],\r\n                m[0][2], m[1][2], m[2][2]);\r\n}\r\n\r\nmat4 transpose_3_2(mat4 m) {\r\n    return mat4(m[0][0], m[1][0], m[2][0], m[3][0],\r\n                m[0][1], m[1][1], m[2][1], m[3][1],\r\n                m[0][2], m[1][2], m[2][2], m[3][2],\r\n                m[0][3], m[1][3], m[2][3], m[3][3]);\r\n}\r\n\r\n\n\n\r\n/**\r\n * Converts vertex from modelspace to screenspace using transform\r\n * information from context.\r\n *\r\n * @method applyTransform\r\n * @private\r\n *\r\n *\r\n */\r\n\r\nvec4 applyTransform(vec4 pos) {\r\n    //TODO: move this multiplication to application code. \r\n\r\n    /**\r\n     * Currently multiplied in the vertex shader to avoid consuming the complexity of holding an additional\r\n     * transform as state on the mesh object in WebGLRenderer. Multiplies the object's transformation from object space\r\n     * to world space with its transformation from world space to eye space.\r\n     */\r\n    mat4 MVMatrix = u_view * u_transform;\r\n\r\n    //TODO: move the origin, sizeScale and y axis inversion to application code in order to amortize redundant per-vertex calculations.\r\n\r\n    /**\r\n     * The transform uniform should be changed to the result of the transformation chain:\r\n     *\r\n     * view * modelTransform * invertYAxis * sizeScale * origin\r\n     *\r\n     * which could be simplified to:\r\n     *\r\n     * view * modelTransform * convertToDOMSpace\r\n     *\r\n     * where convertToDOMSpace represents the transform matrix:\r\n     *\r\n     *                           size.x 0       0       size.x \r\n     *                           0      -size.y 0       size.y\r\n     *                           0      0       1       0\r\n     *                           0      0       0       1\r\n     *\r\n     */\r\n\r\n    /**\r\n     * Assuming a unit volume, moves the object space origin [0, 0, 0] to the \"top left\" [1, -1, 0], the DOM space origin.\r\n     * Later in the transformation chain, the projection transform negates the rigidbody translation.\r\n     * Equivalent to (but much faster than) multiplying a translation matrix \"origin\"\r\n     *\r\n     *                           1 0 0 1 \r\n     *                           0 1 0 -1\r\n     *                           0 0 1 0\r\n     *                           0 0 0 1\r\n     *\r\n     * in the transform chain: projection * view * modelTransform * invertYAxis * sizeScale * origin * positionVector.\r\n     */\r\n    pos.x += 1.0;\r\n    pos.y -= 1.0;\r\n\r\n    /**\r\n     * Assuming a unit volume, scales an object to the amount of pixels in the size uniform vector's specified dimensions.\r\n     * Later in the transformation chain, the projection transform transforms the point into clip space by scaling\r\n     * by the inverse of the canvas' resolution.\r\n     * Equivalent to (but much faster than) multiplying a scale matrix \"sizeScale\"\r\n     *\r\n     *                           size.x 0      0      0 \r\n     *                           0      size.y 0      0\r\n     *                           0      0      size.z 0\r\n     *                           0      0      0      1\r\n     *\r\n     * in the transform chain: projection * view * modelTransform * invertYAxis * sizeScale * origin * positionVector.\r\n     */\r\n    pos.xyz *= u_size * 0.5;\r\n\r\n    /**\r\n     * Inverts the object space's y axis in order to match DOM space conventions. \r\n     * Later in the transformation chain, the projection transform reinverts the y axis to convert to clip space.\r\n     * Equivalent to (but much faster than) multiplying a scale matrix \"invertYAxis\"\r\n     *\r\n     *                           1 0 0 0 \r\n     *                           0 -1 0 0\r\n     *                           0 0 1 0\r\n     *                           0 0 0 1\r\n     *\r\n     * in the transform chain: projection * view * modelTransform * invertYAxis * sizeScale * origin * positionVector.\r\n     */\r\n    pos.y *= -1.0;\r\n\r\n    /**\r\n     * Exporting the vertex's position as a varying, in DOM space, to be used for lighting calculations. This has to be in DOM space\r\n     * since light position and direction is derived from the scene graph, calculated in DOM space.\r\n     */\r\n\r\n    v_position = (MVMatrix * pos).xyz;\r\n\r\n    /**\r\n    * Exporting the eye vector (a vector from the center of the screen) as a varying, to be used for lighting calculations.\r\n    * In clip space deriving the eye vector is a matter of simply taking the inverse of the position, as the position is a vector\r\n    * from the center of the screen. However, since our points are represented in DOM space,\r\n    * the position is a vector from the top left corner of the screen, so some additional math is needed (specifically, subtracting\r\n    * the position from the center of the screen, i.e. half the resolution of the canvas).\r\n    */\r\n\r\n    v_eyeVector = (u_resolution * 0.5) - v_position;\r\n\r\n    /**\r\n     * Transforming the position (currently represented in dom space) into view space (with our dom space view transform)\r\n     * and then projecting the point into raster both by applying a perspective transformation and converting to clip space\r\n     * (the perspective matrix is a combination of both transformations, therefore it's probably more apt to refer to it as a\r\n     * projection transform).\r\n     */\r\n\r\n    pos = u_perspective * MVMatrix * pos;\r\n\r\n    return pos;\r\n}\r\n\r\n/**\r\n * Placeholder for positionOffset chunks to be templated in.\r\n * Used for mesh deformation.\r\n *\r\n * @method calculateOffset\r\n * @private\r\n *\r\n *\r\n */\r\n#vert_definitions\r\nvec3 calculateOffset(vec3 ID) {\r\n    #vert_applications\r\n    return vec3(0.0);\r\n}\r\n\r\n/**\r\n * Writes the position of the vertex onto the screen.\r\n * Passes texture coordinate and normal attributes as varyings\r\n * and passes the position attribute through position pipeline.\r\n *\r\n * @method main\r\n * @private\r\n *\r\n *\r\n */\r\nvoid main() {\r\n    v_textureCoordinate = a_texCoord;\r\n    vec3 invertedNormals = a_normals + (u_normals.x < 0.0 ? calculateOffset(u_normals) * 2.0 - 1.0 : vec3(0.0));\r\n    invertedNormals.y *= -1.0;\r\n    v_normal = transpose_3_2(mat3(inverse_2_1(u_transform))) * invertedNormals;\r\n    vec3 offsetPos = a_pos + calculateOffset(u_positionOffset);\r\n    gl_Position = applyTransform(vec4(offsetPos, 1.0));\r\n}\r\n",fragment:"#define GLSLIFY 1\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * Placeholder for fragmentShader  chunks to be templated in.\r\n * Used for normal mapping, gloss mapping and colors.\r\n * \r\n * @method applyMaterial\r\n * @private\r\n *\r\n *\r\n */\r\n\r\n#float_definitions\r\nfloat applyMaterial_1_0(float ID) {\r\n    #float_applications\r\n    return 1.;\r\n}\r\n\r\n#vec3_definitions\r\nvec3 applyMaterial_1_0(vec3 ID) {\r\n    #vec3_applications\r\n    return vec3(0);\r\n}\r\n\r\n#vec4_definitions\r\nvec4 applyMaterial_1_0(vec4 ID) {\r\n    #vec4_applications\r\n\r\n    return vec4(0);\r\n}\r\n\r\n\n\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * Calculates the intensity of light on a surface.\r\n *\r\n * @method applyLight\r\n * @private\r\n *\r\n */\r\nvec4 applyLight_2_1(in vec4 baseColor, in vec3 normal, in vec4 glossiness, int numLights, vec3 ambientColor, vec3 eyeVector, mat4 lightPosition, mat4 lightColor, vec3 v_position) {\r\n    vec3 diffuse = vec3(0.0);\r\n    bool hasGlossiness = glossiness.a > 0.0;\r\n    bool hasSpecularColor = length(glossiness.rgb) > 0.0;\r\n\r\n    for(int i = 0; i < 4; i++) {\r\n        if (i >= numLights) break;\r\n        vec3 lightDirection = normalize(lightPosition[i].xyz - v_position);\r\n        float lambertian = max(dot(lightDirection, normal), 0.0);\r\n\r\n        if (lambertian > 0.0) {\r\n            diffuse += lightColor[i].rgb * baseColor.rgb * lambertian;\r\n            if (hasGlossiness) {\r\n                vec3 halfVector = normalize(lightDirection + eyeVector);\r\n                float specularWeight = pow(max(dot(halfVector, normal), 0.0), glossiness.a);\r\n                vec3 specularColor = hasSpecularColor ? glossiness.rgb : lightColor[i].rgb;\r\n                diffuse += specularColor * specularWeight * lambertian;\r\n            }\r\n        }\r\n\r\n    }\r\n\r\n    return vec4(ambientColor + diffuse, baseColor.a);\r\n}\r\n\r\n\n\n\r\n\r\n/**\r\n * Writes the color of the pixel onto the screen\r\n *\r\n * @method main\r\n * @private\r\n *\r\n *\r\n */\r\nvoid main() {\r\n    vec4 material = u_baseColor.r >= 0.0 ? u_baseColor : applyMaterial_1_0(u_baseColor);\r\n\r\n    /**\r\n     * Apply lights only if flat shading is false\r\n     * and at least one light is added to the scene\r\n     */\r\n    bool lightsEnabled = (u_flatShading == 0.0) && (u_numLights > 0.0 || length(u_ambientLight) > 0.0);\r\n\r\n    vec3 normal = normalize(v_normal);\r\n    vec4 glossiness = u_glossiness.x < 0.0 ? applyMaterial_1_0(u_glossiness) : u_glossiness;\r\n\r\n    vec4 color = lightsEnabled ?\r\n    applyLight_2_1(material, normalize(v_normal), glossiness,\r\n               int(u_numLights),\r\n               u_ambientLight * u_baseColor.rgb,\r\n               normalize(v_eyeVector),\r\n               u_lightPosition,\r\n               u_lightColor,   \r\n               v_position)\r\n    : material;\r\n\r\n    gl_FragColor = color;\r\n    gl_FragColor.a *= u_opacity;   \r\n}\r\n"};module.exports=shaders;},{}],63:[function(require,module,exports){var config=require('./config.json');// new Ajax('/xxx')  					只传url版本号之后的地址
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
if(xx==false){this.async=false;}else{this.async=typeof this.cfg.async==='boolean'?this.cfg.async:true;}xhr.open(this.m,this.url,this.async);if(this.m==='GET')xhr.send(null);else{xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');xhr.send(this.d);}xhr.ontimeout=this.t;if(!this.async)callback(xhr,this);else xhr.onreadystatechange=function(){if(xhr.readyState===4)callback(xhr,this);}.bind(this);};function callback(xhr,obj){var result='';if(xhr.status==200){try{result=JSON.parse(xhr.response);}catch(e){result=xhr.response;}obj.s(result);}else obj.e&&obj.e(xhr);}module.exports=Ajax;},{"./config.json":76}],64:[function(require,module,exports){module.exports=new function(){// 设备相关
// 高度
this.height=0;// 宽度
this.width=0;// 设备像素比
this.devicePixelRatio=0;// uuid
this.uuid=null;// 设备的模型或产品的名称
this.model=null;// 系统版本号
this.version=null;// 手机平台 IOS / ANDROID
this.platform=null;}();},{}],65:[function(require,module,exports){/**
*  为window OR webworker 提供全局 alert、confirm、prompt、beep 函数。
*  依赖 cordova-plugin-dialogs 扩展
*/var CrossCall=require("famous/core/CrossCall");var _self=typeof window=="undefined"?self:window;/**
*Shows a custom alert or dialog box. Most Cordova implementations use a native dialog box for this feature,
 but some platforms use the browser's alert function, which is typically less customizable.
* 
*Example
*
*alert(
    'You are the winner!',  // message
    alertDismissed,         // callback
    'Game Over',            // title
    'Done'                  // buttonName
*);	
*/_self.alert=function(message,resultCallback,title,buttonLabel){_call("alert",message,resultCallback,title,buttonLabel);};/**
*Displays a customizable confirmation dialog box.
* 
*Example
*
*confirm(
    'You are the winner!', // message
     onConfirm,            // callback to invoke with index of button pressed
    'Game Over',           // title
    ['Restart','Exit']     // buttonLabels
);
*/_self.confirm=function(message,resultCallback,title,buttonLabels){_call("confirm",message,resultCallback,title,buttonLabels);};/**
* Displays a native dialog box that is more customizable than the browser's prompt function.
* 
* message: Dialog message. (String)
* resultCallback: Callback to invoke with index of button pressed (1, 2, or 3) or when the dialog is dismissed without a button press (0). (Function)
* title: Dialog title (String) (Optional, defaults to Prompt)
* buttonLabels: Array of strings specifying button labels (Array) (Optional, defaults to ["OK","Cancel"])
* defaultText: Default textbox input value (String) (Optional, Default: empty string)
*
*Example
*
*prompt(
    'Please enter your name',  // message
    onPrompt,                  // callback to invoke
    'Registration',            // title
    ['Ok','Exit'],             // buttonLabels
    'Jane Doe'                 // defaultText
);
*/_self.prompt=function(message,resultCallback,title,buttonLabels,defaultText){_call("prompt",message,resultCallback,title,buttonLabels,defaultText);};/**
* The device plays a beep sound.
* times: The number of times to repeat the beep. (Number)
*/_self.beep=function(times){_call("beep",times);};function _call(name,message,resultCallback,title,buttonLabels,defaultText){new CrossCall(function(name,message,title,buttonLabels,defaultText){navigator.notification[name].call(navigator.notification,message,function(arg){self._call(arg);},title,buttonLabels,defaultText);},[name,message,title,buttonLabels,defaultText]).exec(function(arg){if(resultCallback)resultCallback(arg);});}},{"famous/core/CrossCall":9}],66:[function(require,module,exports){var CrossCall=require('famous/core/CrossCall');//依赖于cordova-plugin-google-analytics 
//插件安装 cordova plugin add https://github.com/danwilson/google-analytics-plugin.git
function googleAnalytics(){this.cross=new CrossCall();}//To track a Screen (PageView):
googleAnalytics.prototype.trackView=function(arg){this._callWin("trackView",[arg]);};//To track User Timing (App Speed):
googleAnalytics.prototype.trackTiming=function(Category,IntervalInMilliseconds,Variable,Label){this._callWin("trackTiming",[Category,IntervalInMilliseconds,Variable,Label]);};//To track an Exception:
googleAnalytics.prototype.trackException=function(Description,Fatal){this._callWin("trackException",[Description,Fatal]);};//To add a Transaction (Ecommerce)
googleAnalytics.prototype.addTransaction=function(ID,Affiliation,Revenue,Tax,Shipping,CurrencyCode){this._callWin("addTransaction",[ID,Affiliation,Revenue,Tax,Shipping,CurrencyCode]);};//To add a Transaction Item (Ecommerce)
googleAnalytics.prototype.addTransactionItem=function(ID,Name,SKU,Category,Price,Quantity,CurrencyCode){this._callWin("addTransactionItem",[ID,Name,SKU,Category,Price,Quantity,CurrencyCode]);};//To add a Custom Dimension
googleAnalytics.prototype.addCustomDimension=function(Key,Value,success,error){this.cross.setFun(function(Key,Value){window.analytics.addCustomDimension(Key,Value,function(e){self._call({stats:1,res:e});},function(e){self._call({stats:0,res:e});});},[Key,Value]).exec(function(e){if(e.stats&&typeof success==='function')success(e.res);else typeof error==='function'&&error(e.res);});};//To set a UserId:
googleAnalytics.prototype.setUserId=function(myuserid){this._callWin('setUserId',[myuserid]);};//To enable verbose logging:
googleAnalytics.prototype.debugMode=function(){this._callWin('debugMode',[]);};//To enable/disable automatic reporting of uncaught exceptions
googleAnalytics.prototype.enableUncaughtExceptionReporting=function(Enable,success,error){this.cross.setFun(function(Enable){window.analytics.enableUncaughtExceptionReporting(Enable,function(e){self._call({stats:1,res:e});},function(e){self._call({stats:0,res:e});});},[Enable]).exec(function(e){if(e.stats&&typeof success==='function')success(e.res);else typeof error==='function'&&error(e.res);});};googleAnalytics.prototype._callWin=function(name,arg){this.cross.setFun(function(name,arg){window.analytics[name].apply(window.analytics,arg);},[name,arg]).exec();};module.exports=new googleAnalytics();},{"famous/core/CrossCall":9}],67:[function(require,module,exports){var Node=require('famous/core/Node');var DOMElement=require('famous/dom-renderables/DOMElement');var Button=require('button');/*
*obj：对象
*i:索引
*height：高度
*
*/var IconItem=function(_Node){_inherits(IconItem,_Node);function IconItem(obj,i,height){_classCallCheck(this,IconItem);var _this2=_possibleConstructorReturn(this,Object.getPrototypeOf(IconItem).call(this));_this2.setSizeMode('relative','absolute').setAbsoluteSize(null,height).setPosition(0,i*height).setAlign(.5).setMountPoint(.5).el=new DOMElement(_this2,{classes:['icon_item','fa-button'],content:'<div class="inner_item"><img src="'+obj.icon+'"><span>'+obj.desc+'</span></div>'});_this2.addUIEvent('touchstart');_this2.addUIEvent('touchend');return _this2;}_createClass(IconItem,[{key:"onReceive",value:function onReceive(e,p){if(e==='touchstart'){this.el.addClass("bt-active");}else if(e==='touchend'){this.el.removeClass("bt-active");}}}]);return IconItem;}(Node);module.exports=IconItem;},{"button":75,"famous/core/Node":13,"famous/dom-renderables/DOMElement":21}],68:[function(require,module,exports){var Node=require('famous/core/Node');var DOMElement=require('famous/dom-renderables/DOMElement');var IconText=function(_Node2){_inherits(IconText,_Node2);function IconText(obj,i,countX,sizeY,mt,cls){_classCallCheck(this,IconText);var _this3=_possibleConstructorReturn(this,Object.getPrototypeOf(IconText).call(this));_this3.setSizeMode('relative','absolute').setAbsoluteSize(null,sizeY).setProportionalSize(1/countX).setPosition(0,Math.floor(i/countX)*sizeY+(Math.floor(i/countX)+1)*mt).setAlign(i%countX/countX,0).el=new DOMElement(_this3,{classes:[cls,'fa-button'],content:'<img src="'+obj.icon+'"><p>'+obj.text+'</p>'});_this3.listId=IconText;_this3.addUIEvent('touchstart');_this3.addUIEvent('touchend');return _this3;}_createClass(IconText,[{key:"onReceive",value:function onReceive(e,p){if(e==='touchstart'){this.el.addClass("bt-active");}else if(e==='touchend'){this.el.removeClass("bt-active");}}}]);return IconText;}(Node);module.exports=IconText;},{"famous/core/Node":13,"famous/dom-renderables/DOMElement":21}],69:[function(require,module,exports){var Node=require("famous/core/Node");var DOMElement=require('famous/dom-renderables/DOMElement');var GestureHandler=require("famous/components/GestureHandler");var timer=null;/**
*ListView 解决 一次加载太多节点出现假死问题
*/function ListView(arg){Node.call(this);this._allData=[];this._domList=[];this._lock=false;//初始参数
this.opt={threshold:2,//预加载数 单位个（请根据item 高度适当调整）
throttle:32,//单位毫秒 控制Scroll执行频率
itemSize:[200,65],//item  尺寸
margin:[0,0,0,0],// Margin
animate:false,//TODO 是否开启动画
createItem:null};this.optInit(arg);//存放已经渲染的第一个节点和最后一个节点
this._temp=null;this.scrollTop=0;//height+marginTop = itemH
this.itemH=this.opt.itemSize[1]+this.opt.margin[0];this.linked=new LinkedListViewSequence([]);//this._addPullDownRefreshNode();
//this._addPullUpRefreshNode();
this._addScrollCentent();this.c.addUIEvent("scroll");this.addUIEvent("click");this.addUIEvent("touchstart");this.addComponent({onSizeChange:function(x,y,z){if(!x)return;this.renderDom();}.bind(this)});}ListView.prototype=Object.create(Node.prototype);// 初始化 参数
ListView.prototype.optInit=function(opt){for(var k in opt){this.opt[k]=opt[k];}if(this.opt.createItem===null)throw new Error('createItem is null');};ListView.prototype.renderDom=function(){if(this.opt.itemMax===undefined){this.height=this.getSize()[1];this.opt.itemMax=0|this.height/this.itemH+this.opt.threshold*2;}//初始化Dom 节点
this._domList=this.linked.slice(0,this.opt.itemMax);for(var i=0;i<this._domList.length;i++){this.c.addChild(this.createItem(this._domList[i]));this._domList[i]._isMounted=true;this._domList[i]._index=i;};};ListView.prototype.onReceive=function(e,p){if(e==='scroll'&&!this._lock){this.top=p.scrollTop;if(timer)return;timer=setTimeout(function(){this.throttle();timer=0;}.bind(this),this.opt.throttle);}// if( e==="click"){
// 	console.log(p.node);
// }
if(e==="touchstart"&&this.linked[this.linked.length-1]==this._domList[this._domList.length-1]){}};ListView.prototype.lock=function(){this._lock=true;this.c.el.setProperty('overflow-y','hidden');};ListView.prototype.unLock=function(){this._lock=false;this.c.el.setProperty('overflow-y','scroll');};ListView.prototype.isLock=function(){return this._lock;};//节流函数
ListView.prototype.throttle=function(arg){this._onScroll(this.top);this.scrollTop=this.top;};//绑定数据
ListView.prototype.BindData=function(arr){for(var i=0;i<arr.length;i++){this.linked.insert(arr[i]);};};ListView.prototype.createItem=function(obj){var o=this.opt,h=this.itemH;return this.opt.createItem(obj.data,obj).setPosition(o.margin[3],obj._id*h,0).setAbsoluteSize(o.itemSize[0],o.itemSize[1]);};//设置下拉或上拉样式
ListView.prototype.setPullStyle=function(){};ListView.prototype._addPullDownRefreshNode=function(){this.addChild(this.setPullStyle()).setSizeMode('relative','absolute').setAbsoluteSize(1,1,1).setMountPoint(0,1,0).setAlign(0,1,null).setProportionalSize(null,60);};ListView.prototype._addPullUpRefreshNode=function(){this.addChild(this.setPullStyle()).setSizeMode('relative','absolute').setAbsoluteSize(1,1,2).setMountPoint(0,1,0).setAlign(0,1,null).setProportionalSize(null,60);};ListView.prototype._addScrollCentent=function(){this.c=this.addChild().setSizeMode('relative','relative')//.setAbsoluteSize( null, 88 / App.devicePixelRatio )
.setProportionalSize(1,1,3);this.c.el=new DOMElement(this.c,{classes:['page-content']}).setProperty("overflow-y","scroll").setProperty("overflow-x","hidden");};ListView.prototype.onScrollEnd=function(){//ToDo
};//添加节点
ListView.prototype.AddData=function(arr,index){//ToDo
this.BindData(arr);this._onScroll(this.scrollTop);//this.initItem();
};//删除Item
ListView.prototype.RemoveItem=function(index){var item=this.linked.splice(index,1)[0];if(!item||!item._isMounted)return;//找到下一个节点
var next=this.linked.findByIndex(this._domList[this._domList.length-1]._id+1);if(next===undefined){next=this.linked.findByIndex(this._domList[0]._id-1);}item._isMounted=false;this.c.removeChild(this.c.getRawChildren()[item._index]);//节点长度不够 this.opt.itemMax 直接返回
if(item===next||next===undefined){// 重新获得Domlist
this._onScroll(this.scrollTop);return this.reSetItem();}next._index=item._index;next._isMounted=true;// 挂载新节点
this.c.addChild(this.createItem(next));// 重新获得Domlist
this._onScroll(this.scrollTop);//重置Position
this.reSetItem();};// 初始化节点位置
ListView.prototype.initItem=function(){var o=this.opt,h=this.itemH;this._allData.forEach(function(v,i){v.setPosition(o.margin[3],i*h,0);v.setAbsoluteSize(o.itemSize[0],o.itemSize[1]);});this.contentH=this._allData.length*h;};// 初始化节点位置
ListView.prototype.reSetItem=function(){var o=this.opt,h=this.itemH,child=this.c.getRawChildren();this._domList.forEach(function(v,i){child[v._index].setPosition(o.margin[3],v._id*h,1);//v.setAbsoluteSize(o.itemSize[0], o.itemSize[1] );
});};//渲染节点
ListView.prototype._addItem2Dom=function(item,index){if(this._domList.length<this.opt.itemMax){this.c.addChild(this.createItem(item));item._isMounted=true;item._index=index;return;}this._temp=this._domList[this.opt.itemMax-1-index];this._temp._isMounted=false;item._isMounted=true;// 添加item 在 DomList 里的下标
item._index=this._temp._index;// 移除不必要节点
this.c.removeChild(this.c.getRawChildren()[item._index]);// 挂载新节点
this.c.addChild(this.createItem(item));};//获取应渲染节点
ListView.prototype._onScroll=function(top){//修正最小下标
var domTop=top-this.opt.threshold*this.itemH;domTop<0?domTop=0:domTop=domTop;domTop=0|domTop/this.itemH;var item=this.linked.slice(domTop,domTop+this.opt.itemMax);//修正正最大下标
if(item.length<this.opt.itemMax){item=this.linked.slice(-this.opt.itemMax);}for(var i=0;i<item.length;i++){if(item[i]._isMounted)continue;this._addItem2Dom(item[i],i);};//console.log(item);
this._domList=item;};//内部对象
function LinkedListViewSequence(arr){this._arr=[];for(var i in arr){this.insert(arr[i]);};}LinkedListViewSequence.prototype={get length(){return this._arr.length;}};LinkedListViewSequence.prototype.findByIndex=function(index){return this._arr[index];};LinkedListViewSequence.prototype.insert=function(obj){this._arr.push({_isMounted:false,_id:this._arr.length,data:obj});};LinkedListViewSequence.prototype.slice=function(){for(var _len=arguments.length,x=Array(_len),_key=0;_key<_len;_key++){x[_key]=arguments[_key];}return[].slice.apply(this._arr,x);};LinkedListViewSequence.prototype.splice=function(){for(var _len2=arguments.length,x=Array(_len2),_key2=0;_key2<_len2;_key2++){x[_key2]=arguments[_key2];}var item=[].splice.apply(this._arr,x);this._arr.forEach(function(v,i){v._id=i;});return item;};module.exports=ListView;},{"famous/components/GestureHandler":3,"famous/core/Node":13,"famous/dom-renderables/DOMElement":21}],70:[function(require,module,exports){var Node=require('famous/core/Node');var DOMElement=require('famous/dom-renderables/DOMElement');var Page=function(_Node3){_inherits(Page,_Node3);function Page(opt){_classCallCheck(this,Page);var _this4=_possibleConstructorReturn(this,Object.getPrototypeOf(Page).call(this));opt=opt||{};_this4._el=new DOMElement(_this4,opt);_this4._el.addClass('white_backgound');_this4._status="Dead";return _this4;}_createClass(Page,[{key:"to",value:function to(id,opt){this._updater.getContext(this.getLocation())._Router.to(id,opt);return this;}},{key:"back",value:function back(opt){this._updater.getContext(this.getLocation())._Router.back(opt);return this;}},{key:"getDOM",value:function getDOM(){return this._el;}//通常用于Page初始化设置
},{key:"onCreate",value:function onCreate(){this.showInEngine(true);//this._ContentNode = this.addChild();
}//当Page可见未获得用户焦点不能交互时系统会调用	
},{key:"onStart",value:function onStart(){this._status="Running";}//当Page已经停止然后重新被启动时系统会调用
},{key:"onRestart",value:function onRestart(){this.showInEngine(true);this._status="Running";}//当Page可见且获得用户焦点能交互时系统会调用
},{key:"onResume",value:function onResume(){this._status="Running";}//当系统启动另外一个新的Page时,在新Page启动之前被系统调用保存现有的Page中的持久数据、停止动画等,这个实现方法必须非常快。
},{key:"onPause",value:function onPause(){this._status="Paused";}//当Page被新的Page完全覆盖不可见时被系统调用
},{key:"onStop",value:function onStop(){this.showInEngine(false);this._status="Stopped";}//当Page(用户调用finish()或系统由于内存不足)被系统销毁杀掉时系统调用,（整个生命周期只调用1次）用来释放onCreate ()方法中创建的资源
},{key:"onDestroy",value:function onDestroy(){this.showInEngine(true);this._status="Dead";//this.dismount();
}},{key:"finish",value:function finish(){this.onDestroy();}}]);return Page;}(Node);module.exports=Page;},{"famous/core/Node":13,"famous/dom-renderables/DOMElement":21}],71:[function(require,module,exports){var pages=require('pages.js');var App=require('App');var GoogleAnalytics=require('GoogleAnalytics');var signModel=require('model/signModel');var FamousEngine=require('famous/core/FamousEngine');var Commands=require('famous/core/Commands');var Align=require('famous/components/Align');var Ajax=require('Ajax');var CrossCall=require('famous/core/CrossCall');function reSetSceneReceive(node){var _this=node;_this.scene.onReceive=function(e,p){if(e==='backbutton'&&!_this._animationRunning){//TODO 检测场景是否isShow
//调用当前页面的Back 函数
_this.currentPage.back(p);}else if(e==='CONTEXT_RESIZE'){//重写CONTEXT_RESIZE 事件 实现软键盘监听
if(p.length<2)throw new Error('CONTEXT_RESIZE\'s payload needs to be at least a pair'+' of pixel sizes');var size=_this.scene.getAbsoluteSize();if(size[1]!=0&&size[1]==p[1]){_this.currentPage.emit("softKeyBoardDown",p);}else if(size[1]!=0&&50<size[1]-p[1]<size[1]/2){_this.currentPage.emit("softKeyBoardUp",p);}else{_this.scene.setSizeMode('absolute','absolute','absolute');_this.scene.setAbsoluteSize(p[0],p[1],p[2]?p[2]:0);_this.scene._updater.message(Commands.WITH).message(_this.scene._selector).message(Commands.READY);}}else if(_this.currentPage&&_this.currentPage.onReceive){_this.currentPage.onReceive(e,p);}};}var Router=function(){function Router(){_classCallCheck(this,Router);//var _this = this;
this.pages=pages;this._timer=null;//页面是否缓存
this.pageCache=[];this.scene=FamousEngine._scenes.body;//反链接 this
this.scene._Router=this;//堆
this.history=[];//过场动画是否进行
this._animationRunning=false;//To 结束时调用
this._onToEnd={onReceive:this._onToAnimationEnd.bind(this)};//back 结束时调用
this._onBackEnd={onReceive:this._onBackAnimationEnd.bind(this)};//重写场景事件调度器
reSetSceneReceive(this);}// 检测页面是否存在历史记录里面，存在返回该历史节点（包括id和node），否则返回null
_createClass(Router,[{key:"find",value:function find(id){for(var i=0;i<this.history.length;i++){if(this.history[i].id===id)return i;}return null;}// 格式化opt
},{key:"format",value:function format(opt,method){opt=opt||{};var directions={rtl:[-1,0,0,1,0,0],ltr:[1,0,0,-1,0,0],ttb:[0,1,0,0,-1,0],btt:[0,-1,0,0,1,0]};var direction=directions[opt.direction];direction=direction?direction:directions[method];opt.direction=direction;opt.animate=opt.animate||{};opt.animate.duration=opt.animate.duration||200;opt.animate.curev=opt.animate.curev||'linear';return opt;}// 加载一个某一个页面
},{key:"load",value:function load(id,data){if(!this.pages[id])throw new Error('Not found the page : '+id);var nowPage=this.pageCache[id];if(!nowPage){nowPage=new this.pages[id](data);this.pageCache[id]=nowPage;nowPage.setAlign(1,0,0).getDOM().addClass('page_change').setProperty("transition-duration","0s");nowPage.addUIEvent("transitionend");//理应检测场景ID
nowPage.mount("body/"+id);nowPage.getDOM().draw();}this.loadPage=nowPage;this.history.push({id:id,node:nowPage});//通常用于Page初始化设置
nowPage.onCreate(data);return nowPage;}// 前往一个页面
// id            加载页面ID
// opt.data      加载的页面的数据
// opt.direction 页面动画方向,默认值: to: 'rtl', back: 'ltr'
// opt.animate   动画效果
//     .duration 动画时长 默认: 400
//     .curev    动画曲线 默认: outCubic  可选：详情查看http://famous.org/learn/easing-curves.html
},{key:"to",value:function to(id,opt){//检测网络连接
if(!this.checkConnection())return;//检测是否登录过期
if(opt){if(opt.data){if(opt.data.checkLogin!=0){if(!this.checkLogin()){// id = 'login';
signModel.update({id:signModel.findOne.id},{'token':null});return;}}}}else{if(!this.checkLogin()){// id = 'login';
signModel.update({id:signModel.findOne.id},{'token':null});return;}}if(!this.pages[id])throw new Error('Not found the page : '+id);//当动画进行时阻断操作
if(this._animationRunning)return;if(this.currentPage)this.currentPage.onPause();//当系统启动另外一个新的Page时,在新Page启动之前被系统调用保存现有的Page中的持久数据、停止动画等,这个实现方法必须非常快。
opt=this.format(opt,'rtl');var loadPageID=this.find(id);var nowPage=this.history[this.history.length-1].node;//检测加载页面是否已经挂载
if(loadPageID!==null){this.history.splice(loadPageID,1);}//加载当前页面并设置From 位置
var loadPage=this.load(id,opt.data).setAlign(opt.direction[3],opt.direction[4],opt.direction[5]);//添加动画完毕事件监听
loadPage.addComponent(this._onToEnd);loadPage.getDOM().setProperty("transition-duration",".2s").draw();//当Page可见未获得用户焦点不能交互时系统会调用	
loadPage.onStart(opt.data);setTimeout(function(){this._animationRunning=true;nowPage.setAlign(opt.direction[0]*.15,opt.direction[1]*.15,opt.direction[2]);loadPage.setAlign(0,0,0);}.bind(this),20);//this.history.push({id: id, node: loadPage});
this._timer=setTimeout(function(){this._animationRunning&&this._onToAnimationEnd('transitionend',{});}.bind(this),400);//页面监听
GoogleAnalytics.trackView(id);}},{key:"_onToAnimationEnd",value:function _onToAnimationEnd(e,p){if(e!=='transitionend')return;clearTimeout(this._timer);//隐藏上一张页面
this.currentPage&&this.currentPage.onStop();//关闭动画监听
this.currentPage&&this.currentPage.getDOM().setProperty("transition-duration","0s");this.currentPage=this.loadPage;//理应检测 _status
this.currentPage.onResume();//移除动画监听
this.currentPage.removeComponent(this._onToEnd);this._animationRunning=false;}},{key:"_onBackAnimationEnd",value:function _onBackAnimationEnd(e,p){if(e!=='transitionend')return;// clearTimeout(this._timer);
this.history.pop();//移除动画监听
this.currentPage.removeComponent(this._onBackEnd);//注销onCreate ()方法中创建的资源
this.currentPage.onDestroy();//关闭动画监听
this.currentPage.getDOM().setProperty("transition-duration","0s");//调整当前页指向
this.currentPage=this.loadPage;//当Page可见且获得用户焦点能交互时系统会调用
this.currentPage.onResume();this.currentPage.getDOM().setProperty("transition-duration",".3s");this._animationRunning=false;}// 返回上一个页面,
// opt.pageId    指定回到某张页面
// opt.reload    是否刷新数据
// opt.direction 页面动画方向,默认值: to: 'rtl', back: 'ltr'
// opt.animate   动画效果
//     .duration 动画时长 默认: 400
//     .curev    动画曲线 默认: outCubic  可选：详情查看http://famous.org/learn/easing-curves.html
},{key:"back",value:function back(opt){var _this=this;opt=this.format(opt,'ltr');if(this.history.length==1)return this.exitApp();//双击CallBack 退出应用
//当动画进行时阻断操作
if(this._animationRunning)return;var nowPage=this.currentPage;var showPage=this._getPageFromHistory(opt.pageId);// this.history[this.history.length-2].node;
this.loadPage=showPage;nowPage.addComponent(this._onBackEnd);//当Page已经停止然后重新被启动时系统会调用
showPage.onRestart(opt);showPage.setAlign(0,0,0);setTimeout(function(){this._animationRunning=true;nowPage.setAlign(opt.direction[0],opt.direction[1],opt.direction[2]);}.bind(this),20);// this._timer = setTimeout(function(){
// 	this._onBackAnimationEnd('transitionend',{});
// }.bind(this),400);
}},{key:"_getPageFromHistory",value:function _getPageFromHistory(pageId){var key,disNode;if(typeof pageId=='number'&&this.history[pageId]){key=pageId;}else if(typeof pageId=='string'){this.history.forEach(function(v,i){if(v.id===pageId){key=i;}});}else{key=this.history.length-2;}disNode=this.history.splice(key+1,this.history.length-key-2);//异步效果是否更好
disNode.forEach(function(v){//v.node.onRestart();
v.node.setAlign(1,0,0).onDestroy();});return this.history[key].node;}//双击CallBack 退出应用
},{key:"exitApp",value:function exitApp(){if(!this._BackTime){this._BackTime=Date.now();require('Tips').open('再按一次退出应用');}else{if(Date.now()-this._BackTime>3000){this._BackTime=0;return;}new CrossCall(function(){navigator.app.exitApp();}).exec();}}//检测网络
},{key:"checkConnection",value:function checkConnection(){var networkState=self.navigator.connection?navigator.connection.type:'';var status=true;if(networkState==='none'){require('Tips').open('请检查你的网络连接');status=false;}return status;}//检测页面是否登录过期
},{key:"checkLogin",value:function checkLogin(){var loginStatus=true;new Ajax('/user_store/list_id').data({'id':signModel.findOne().id,'did':App.uuid,'tk':signModel.findOne().token}).success(function(res){if(res.status==5){loginStatus=false;alert('登录过期，请重新登录！',function(){signModel.update({'id':signModel.findOne().id},{'token':null});new CrossCall(function(){window.location.reload();}).exec();},'提示消息','确定');}}.bind(this)).error(function(res){console.log(res);}).post(false);return loginStatus;}}]);return Router;}();module.exports=new Router();},{"Ajax":63,"App":64,"GoogleAnalytics":66,"Tips":73,"famous/components/Align":1,"famous/core/Commands":8,"famous/core/CrossCall":9,"famous/core/FamousEngine":12,"model/signModel":84,"pages.js":86}],72:[function(require,module,exports){var CrossCall=require('famous/core/CrossCall');function webWorkerStorage(){this._storage={};var _this=this;this.cross=new CrossCall(function(){var obj={};for(var i in window.localStorage){obj[i]=window.localStorage.getItem(i);}return obj;});this.cross.exec(function(arg){_this._storage=arg;});}webWorkerStorage.prototype.constructor=webWorkerStorage;webWorkerStorage.prototype.getItem=function(arg){if(this._storage.hasOwnProperty(arg))return this._storage[arg];return null;};webWorkerStorage.prototype.removeItem=function(arg){delete this._storage[arg];this._callStorage("removeItem",[arg]);};webWorkerStorage.prototype.setItem=function(name,value){this._storage[name]=value;this._callStorage("setItem",[name,value]);};webWorkerStorage.prototype._callStorage=function(fun,arg){this.cross.setFun(function(name,arg){return window.localStorage[name].apply(window.localStorage,arg);},[fun,arg]).exec();};//压缩编译时可能会出现 localStorage 丢失现象
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
},{key:"_format",value:function _format(o){var result={};for(var i in this._keys){var _i=this._keys[i];result[_i]=[];o.forEach(function(v){return result[_i].push(v[_i]);});}return result;}}]);return StorageModel;}();module.exports=StorageModel;},{"famous/core/CrossCall":9}],73:[function(require,module,exports){var Node=require('famous/core/Node');var DOMElement=require('famous/dom-renderables/DOMElement');function Tips(){Node.call(this);this.setSizeMode('relative','absolute').setAbsoluteSize(null,50).setProportionalSize(.9).setAlign(.5).setMountPoint(.5).el=new DOMElement(this,{classes:['bubble_tips']});this.showing=false;}Tips.prototype=Object.create(Node.prototype);Tips.prototype.constructor=Tips;Tips.prototype.open=function(errStr){var _this=this;this.el.setProperty('opacity','1').setContent('<span>'+errStr+'</span>');if(this.showing){return;}this.show();this.showing=true;setTimeout(function(){_this.close();},1000);return false;};Tips.prototype.close=function(){this.el.setProperty('opacity','0').setProperty('transition','all .3s ease-in');setTimeout(function(){this.hide();this.showing=false;}.bind(this),300);};var Tip=new Tips();module.exports=Tip;},{"famous/core/Node":13,"famous/dom-renderables/DOMElement":21}],74:[function(require,module,exports){/**
 * Created by UMZS on 2016/7/15.
 */var Node=require('famous/core/Node');var DOMElement=require('famous/dom-renderables/DOMElement');var App=require('App');var blankArr={'apply':{'img':'./images/blank/apply.png','height':'82.5','txt1':'暂时还没有任何记录','txt2':'您可以返回申请页开始您的记录'},//申请
'find':{'img':'./images/blank/find.png','height':'143','txt1':'活动正在紧锣密鼓的策划中','txt2':'参加统一举办的活动助力您的好生意'},//发现策划
'mes':{'img':'./images/blank/mes.png','height':'135','txt1':'消息正在以火箭般的速度赶来','txt2':'任何重要的信息会第一时间展示在此页面'},//信息
'notice':{'img':'./images/blank/notice.png','height':'82.5','txt1':'暂时还没有任何公告','txt2':'任何重要的公告会第一时间展示在此页面'},//园区公告
'order':{'img':'./images/blank/order.png','height':'103','txt1':'没有任何点餐记录','txt2':'您的点餐记录都会保存在这个页面'},//订餐
'business':{'img':'./images/blank/apply.png','height':'82.5','txt1':'暂时还没有商家生涯记录','txt2':'任何重要的生涯记录会第一时间展示在此页面'}//商家记录
};var blank=function(_Node4){_inherits(blank,_Node4);function blank(type){_classCallCheck(this,blank);var _this5=_possibleConstructorReturn(this,Object.getPrototypeOf(blank).call(this));var obj=null;if(type==='apply'){obj=blankArr.apply;}else if(type==='find'){obj=blankArr.find;}else if(type==='mes'){obj=blankArr.mes;}else if(type==='notice'){obj=blankArr.notice;}else if(type==='order'){obj=blankArr.order;}else if(type==='business'){obj=blankArr.business;}createBlank(_this5,obj);return _this5;}return blank;}(Node);function createBlank(node,obj){var content=node.addChild();content.setSizeMode('relative','absolute').setAlign(.5,.3).setMountPoint(.5,.3).el=new DOMElement(content,{classes:['blank_content'],content:'<img src="'+obj.img+'" height="'+obj.height+'">'+'<p>'+obj.txt1+'</p><p>'+obj.txt2+'</p>'});}module.exports=blank;},{"App":64,"famous/core/Node":13,"famous/dom-renderables/DOMElement":21}],75:[function(require,module,exports){/*
navigation：按钮组件
author：hei
*/var FamousEngine=require('famous/core/FamousEngine');var DOMElement=require('famous/dom-renderables/DOMElement');var Node=require('famous/core/Node');function button(buttonText,bgColor,cusClass){this.cusClass=typeof cusClass!="undefined"?[cusClass,"fa-button","text-center"]:["fa-button","text-center"];Node.call(this);this.addUIEvent('touchstart').addUIEvent('touchend').addUIEvent("click").el=new DOMElement(this,{classes:this.cusClass,content:"<input type='button' value='"+buttonText+"' />",properties:{"background-color":bgColor}});this.clickEvent="";}button.prototype=Object.create(Node.prototype);button.prototype.constructor=button;button.prototype.onReceive=function(e,p){if(e=="touchend"){this.el.removeClass("bt-active");}if(e=="touchstart"){this.el.addClass("bt-active");}if(e=="click"){if(this.clickEvent){this.clickEvent(e,p);}}};module.exports=button;},{"famous/core/FamousEngine":12,"famous/core/Node":13,"famous/dom-renderables/DOMElement":21}],76:[function(require,module,exports){module.exports={"version":1,"noticehttp":"http://api.qqn123.com/","ajax_base":"http://zyjcapp.qqn123.com",//内网
"webSocket":"ws://zyjcapp.qqn123.com/websocket"};},{}],77:[function(require,module,exports){/*
navigation：input输入组件
*/var FamousEngine=require('famous/core/FamousEngine');var DOMElement=require('famous/dom-renderables/DOMElement');var Node=require('famous/core/Node');function inputCustom(){Node.call(this);this.setSizeMode(0,1).addUIEvent('input').el=new DOMElement(this,{classes:['input-custom'],// properties:{'border':'none','background':'none'},
tagName:'input'});this.inputEvent="";}inputCustom.prototype=Object.create(Node.prototype);inputCustom.prototype.constructor=inputCustom;inputCustom.prototype.onReceive=function(e,p){if(e=="input"){if(this.inputEvent){this.inputEvent(e,p);}}};module.exports=inputCustom;},{"famous/core/FamousEngine":12,"famous/core/Node":13,"famous/dom-renderables/DOMElement":21}],78:[function(require,module,exports){arguments[4][69][0].apply(exports,arguments);},{"dup":69,"famous/components/GestureHandler":3,"famous/core/Node":13,"famous/dom-renderables/DOMElement":21}],79:[function(require,module,exports){var StorageModel=require('StorageModel');var SignModel=new StorageModel('Sign',{id:Number,tel:Number,token:String,first:String});module.exports=SignModel;},{"StorageModel":72}],80:[function(require,module,exports){var StorageModel=require('StorageModel');var VersionModel=new StorageModel('Version',{version:String,path:String,cancel:Boolean});module.exports=VersionModel;},{"StorageModel":72}],81:[function(require,module,exports){var StorageModel=require('StorageModel');var incrementModel=new StorageModel('incrementModel',{messageId:Number});module.exports=incrementModel;},{"StorageModel":72}],82:[function(require,module,exports){var StorageModel=require('StorageModel');var messageModel=new StorageModel('messageModel',{id:Number,imgSrc:String,type:String,InfoTitle:String,InfoCtime:Date,InfoType:Number,isRead:Boolean,InfoDesc:String,InfoAuthor:String});module.exports=messageModel;},{"StorageModel":72}],83:[function(require,module,exports){var StorageModel=require('StorageModel');var myInfoModel=new StorageModel('myInfoModel',{imgSrc:String});module.exports=myInfoModel;},{"StorageModel":72}],84:[function(require,module,exports){arguments[4][79][0].apply(exports,arguments);},{"StorageModel":72,"dup":79}],85:[function(require,module,exports){/*
navigation：顶部导航条
author：hei
*/var FamousEngine=require('famous/core/FamousEngine');var DOMElement=require('famous/dom-renderables/DOMElement');var Node=require('famous/core/Node');var Button=require('button');//顶部导航条
function navbar(title,fun){Node.call(this);this.fun=fun;var _this=this;this.setAlign(0,0).setSizeMode(0,1).setAbsoluteSize(null,44).el=new DOMElement(this,{classes:["navbar"],content:"<p class='font-lg text-center'><a class='goback'></a><span>"+title+"</span></p>"});this.backButton=this.addChild(new Button(" ","","navBackBtn"));this.backButton.setSizeMode('absolute','absolute').setAbsoluteSize(80,44).setPosition(0,0);this.backButton.el=new DOMElement(this.backButton);this.backButton.clickEvent=function(e,p){if(_this.fun){_this.fun();}_this.getParent().back();p.stopPropagation();};}navbar.prototype=Object.create(Node.prototype);navbar.prototype.constructor=navbar;navbar.prototype.setTitle=function(title){this.el.setContent("<p class='font-lg text-center'><a class='goback'></a><span>"+title+"</span></p>");};module.exports=navbar;},{"button":75,"famous/core/FamousEngine":12,"famous/core/Node":13,"famous/dom-renderables/DOMElement":21}],86:[function(require,module,exports){module.exports={home:require('../pages/home/index.js'),message1:require('../pages/home/message1.js'),apply_hall:require('../pages/conService/apply_hall.js'),//大厅申请
apply_yard:require('../pages/conService/apply_yard.js'),//堆场申请
apply_wl:require('../pages/conService/apply_wl.js'),//物流信息
myinfo:require('../pages/home/myinfo.js'),//我的资料
record_hall:require('../pages/record/record_hall.js'),//大厅申请记录
record_yard:require('../pages/record/record_yard.js'),//堆场申请记录
login:require('../pages/sign/login'),//登录
resetPwd:require('../pages/sign/resetPwd'),//重设密码
confirmPwd:require('../pages/sign/confirmPwd'),//确认密码
notice:require('../pages/messages/notice'),//园区公告
noticeDetail:require('../pages/messages/noticeDetail'),//公告详情
repair:require('../pages/service/repair'),//在线报修
service:require('../pages/service/index'),//便民服务
card:require('../pages/service/card'),//一卡通
licence:require('../pages/service/licence'),//营业执照
setting:require('../pages/setting/index'),//设置中心
aboutUs:require('../pages/setting/about_us'),//关于我们
companyIntro:require('../pages/setting/company_intro'),//公司介绍
shopChoose:require('../pages/apply/shopChoose'),//店铺选择
adApply:require('../pages/apply/adApply'),//广告位申请
repairRecord:require('../pages/record/repairRecord'),//报修记录
adRecord:require('../pages/record/adRecord'),//广告位申请记录
orderPage:require('../pages/orderPage/orderPage'),//订餐页面
orderRecord:require('../pages/record/orderRecord'),//订餐记录页面
code:require('../pages/home/code'),//查看二维码
businessRecord:require('../pages/record/businessRecord'),//商家生涯
merchantGrade:require('../pages/setting/merchantGrade')//商家等级
};},{"../pages/apply/adApply":88,"../pages/apply/shopChoose":89,"../pages/conService/apply_hall.js":90,"../pages/conService/apply_wl.js":91,"../pages/conService/apply_yard.js":92,"../pages/home/code":93,"../pages/home/index.js":95,"../pages/home/message1.js":98,"../pages/home/myinfo.js":99,"../pages/messages/notice":101,"../pages/messages/noticeDetail":102,"../pages/orderPage/orderPage":103,"../pages/record/adRecord":104,"../pages/record/businessRecord":105,"../pages/record/orderRecord":106,"../pages/record/record_hall.js":107,"../pages/record/record_yard.js":108,"../pages/record/repairRecord":109,"../pages/service/card":110,"../pages/service/index":111,"../pages/service/licence":112,"../pages/service/repair":113,"../pages/setting/about_us":114,"../pages/setting/company_intro":115,"../pages/setting/index":116,"../pages/setting/merchantGrade":117,"../pages/sign/confirmPwd":118,"../pages/sign/login":119,"../pages/sign/resetPwd":120}],87:[function(require,module,exports){var DOMElement=require('famous/dom-renderables/DOMElement');var Node=require('famous/core/Node');var button=require('button');function twoBtnNav(title,leftBtn,rightBtn){Node.call(this);this.setSizeMode(0,1).setAbsoluteSize(null,44).el=new DOMElement(this,{classes:["navbar"],content:"<p class='font-lg text-center'><span>"+title+"</span></p>"});this.leftBtn=this.addChild(leftBtn);this.leftBtn.setSizeMode(1,1).setAbsoluteSize(80,44).el=new DOMElement(this.leftBtn);this.rightBtn=this.addChild(rightBtn);this.rightBtn.setSizeMode(1,1).setAlign(1,0).setMountPoint(1,0).el=new DOMElement(this.rightBtn);}twoBtnNav.prototype=Object.create(Node.prototype);twoBtnNav.prototype.constructor=twoBtnNav;module.exports=twoBtnNav;;},{"button":75,"famous/core/Node":13,"famous/dom-renderables/DOMElement":21}],88:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var navbar=require('twoBtnNav');var button=require('button');var App=require('App');var Ajax=require('Ajax');var sign=require('model/SignModel');var area=-1,building=-1,number=-1,type=-1;var AdApply=function(_Page){_inherits(AdApply,_Page);function AdApply(data){_classCallCheck(this,AdApply);// console.log(data);
var _this6=_possibleConstructorReturn(this,Object.getPrototypeOf(AdApply).call(this,{id:'AdApply'}));_this6.shopId=data;var userSign=sign.findOne();_this6.userId=userSign.id;_this6.token=userSign.token;return _this6;}_createClass(AdApply,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(AdApply.prototype),"onCreate",this).call(this);initNav(this);//区域
new Ajax('/advert/domain').data({'id':this.userId,'did':App.uuid,'tk':this.token}).success(function(d){if(d.status===200){this.areaJson=d.data;}}.bind(this)).post();//性质
new Ajax('/advert_apply/apply_type').data({'id':this.userId,'did':App.uuid,'tk':this.token}).success(function(d){if(d.status===200){this.typeJson=d.data;}}.bind(this)).post();}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(AdApply.prototype),"onResume",this).call(this);if(!this._content){initContent(this,this.areaJson,this.typeJson);}}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(AdApply.prototype),"onDestroy",this).call(this);this._content=null;}}]);return AdApply;}(Page);function initNav(node){var backButton=new button(" ","","goback2");var _this=node;//返回按钮
// backButton.setAbsoluteSize(44,44);
backButton.clickEvent=function(e,p){node.back();p.stopPropagation();};//记录按钮
var rightText=new button('申请记录','','right_text');rightText.setAbsoluteSize(100,44);rightText.clickEvent=function(){_this.to('adRecord');};node.addChild(new navbar('广告位选择',backButton,rightText));}function initContent(node,areaJson,typeJson){var _this=node;_this.buildingJson=null;// var shopJson = [
// 	{'adds':'天府软件园A区','value':'天府软件园A区'},
// 	{'adds':'天府软件园B区','value':'天府软件园B区'},
// 	{'adds':'天府软件园C区','value':'天府软件园C区'},
// 	{'adds':'天府软件园D区','value':'天府软件园D区'},
// 	{'adds':'天府软件园E区','value':'天府软件园E区'},
// ]
var content=node.addChild();content.setSizeMode('relative','relative').setDifferentialSize(0,-44).setPosition(0,44).el=new DOMElement(content,{classes:['apply_con']});node._content=content;var form=content.addChild();var form_item="<ul>\n\t\t\t\t\t\t<li class=\"area\"></li>\n\t\t\t\t\t\t<li class=\"building\"></li>\n\t\t\t\t\t\t<li class=\"number\"></li>\n\t\t\t\t\t\t<li class=\"type\"></li>\n\t\t\t\t    </ul>";form.setSizeMode('relative','absolute').setAbsoluteSize(null,240).el=new DOMElement(form,{classes:['repair_form'],content:form_item});var areaSelect=form.addChild();areaSelect.setSizeMode('relative','absolute').setAbsoluteSize(null,60).setDifferentialSize(-50).setPosition(50,0).el=new DOMElement(areaSelect,{classes:['select_box'],content:function(){var str="<select><option value=\"-1\">请选择区域</option>";if(areaJson!==null){areaJson.forEach(function(v){str+="<option value=\""+v.id+"\">"+v.name+"</option>";});}return str+"</select>";}()});areaSelect.addUIEvent('change');areaSelect.onReceive=function(e,p){if(e==='change'){area=p.value;new Ajax('/advert/tree_data').data({'aid':area,'id':_this.userId,'did':App.uuid,'tk':_this.token}).success(function(d){if(d.status===200){_this.buildingJson=d.data;var str="<select><option value=\"-1\">请选择栋数</option>";var str2="<select><option value=\"-1\">请选择编号</option></select>";//判断返回对象是否为null
if(_this.buildingJson!==null){_this.buildingJson.forEach(function(v){str+="<option value=\""+v.id+"\">"+v.oname+"</option>";});}//重置栋数
_this.buildingSelect.el.setContent(str);//重置编号
_this.numberSelect.el.setContent(str2);}}).post();}};_this.buildingSelect=form.addChild();_this.buildingSelect.setSizeMode('relative','absolute').setAbsoluteSize(null,60).setDifferentialSize(-50).setPosition(50,60).el=new DOMElement(_this.buildingSelect,{classes:['select_box'],content:function(){var str="<select><option value=\"-1\">请选择栋数</option>";return str+"</select>";}()});_this.buildingSelect.addUIEvent('change');_this.buildingSelect.onReceive=function(e,p){if(e==='change'){building=p.value;new Ajax('/advert/tree_data').data({'aid':building,'id':_this.userId,'did':App.uuid,'tk':_this.token}).success(function(d){if(d.status===200){_this.numberJson=d.data;var str="<select><option value=\"-1\">请选择编号</option>";//判断返回对象是否为空
if(_this.numberJson!==null){_this.numberJson.forEach(function(v){str+="<option value=\""+v.id+"\">"+v.oname+"</option>";});}//重置编号
_this.numberSelect.el.setContent(str);}}).post();}};_this.numberSelect=form.addChild();_this.numberSelect.setSizeMode('relative','absolute').setAbsoluteSize(null,60).setDifferentialSize(-50).setPosition(50,120).el=new DOMElement(_this.numberSelect,{classes:['select_box'],content:function(){var str="<select><option value=\"-1\">请选择编号</option>";return str+"</select>";}()});_this.numberSelect.addUIEvent('change');_this.numberSelect.onReceive=function(e,p){if(e==='change'){number=p.value;}};var typeSelect=form.addChild();typeSelect.setSizeMode('relative','absolute').setAbsoluteSize(null,60).setDifferentialSize(-50).setPosition(50,180).el=new DOMElement(typeSelect,{classes:['select_box'],content:function(){var str="<select><option value=\"-1\">请选择广告位性质</option>";if(typeJson!==null){typeJson.forEach(function(v){str+="<option value=\""+v+"\">"+v+"</option>";});}return str+"</select>";}()});typeSelect.addUIEvent('change');typeSelect.onReceive=function(e,p){if(e==='change'){type=p.value;}};var submit=new button('确认申请','#fe6a71','submit_btn');submit.setSizeMode('relative','absolute').setAbsoluteSize(null,40).setPosition(0,240+App.height*0.15).setProportionalSize(.85).setAlign(.5).setMountPoint(.5).clickEvent=function(e,p){if(e==='click'){if(~area&&~building&&~number&&~type){new Ajax('/advert_apply/apply').data({'sid':_this.shopId,'aid':number,'id':_this.userId,'tid':type,'did':App.uuid,'tk':_this.token}).success(function(d){if(d.status===200){alert('提交成功',function(){_this.back();},'提示信息','确定');}else{alert(d.msg,'','提示信息','确定');}}).post();}else{alert('请正确选择相关信息','','提示信息','确定');}}};content.addChild(submit);var remind=content.addChild();remind.setSizeMode('relative','absolute').setAbsoluteSize(null,130).setAlign(0,1).setMountPoint(0,1).el=new DOMElement(remind,{classes:['remind'],content:"<h2><i></i>服务提醒</h2>\n\t\t\t\t\t <p><em>·</em>请先前往商务中心确认所需要的广告位；</p>\n\t\t\t\t\t <p><em>·</em>申请成功后，请在3个工作日内到商家中心办理手续。</p>"});}module.exports=AdApply;},{"Ajax":63,"App":64,"Page":70,"button":75,"famous/dom-renderables/DOMElement":21,"model/SignModel":79,"twoBtnNav":87}],89:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var Nav=require('twoBtnNav');var button=require('button');var App=require('App');var Ajax=require('Ajax');var sign=require('model/SignModel');var ShopChoose=function(_Page2){_inherits(ShopChoose,_Page2);function ShopChoose(data){_classCallCheck(this,ShopChoose);var _this7=_possibleConstructorReturn(this,Object.getPrototypeOf(ShopChoose).call(this,{id:'ShopChoose'}));_this7.type=data;return _this7;}_createClass(ShopChoose,[{key:"onCreate",value:function onCreate(data){_get(Object.getPrototypeOf(ShopChoose.prototype),"onCreate",this).call(this);this.type=data;initNav(this,this.type);var userSign=sign.findOne();new Ajax('/user_store/list_id').data({'id':userSign.id,'did':App.uuid,'tk':userSign.token}).success(function(d){this.shopList=d.data;}.bind(this)).post();}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(ShopChoose.prototype),"onResume",this).call(this);if(!this._con){initContent(this,this.applyType,this.shopList);}}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(ShopChoose.prototype),"onDestroy",this).call(this);this._con=null;}},{key:"onReceive",value:function onReceive(e,p){if(e==='click'&&p.node.listId==='shopSelect'&&this.type===1){this.to('adApply',{data:p.node.shopId});//广告位申请
}if(e==='click'&&p.node.listId==='shopSelect'&&this.type===2){this.to('apply_yard');//堆场申请
}if(e==='click'&&p.node.listId==='shopSelect'&&this.type===3){this.to('apply_hall');//大厅申请
}p.stopPropagation();}}]);return ShopChoose;}(Page);function initNav(node,type){var backButton=new button(" ","","goback2");var _this=node;var src='';node.applyType='';// backButton.setAbsoluteSize(44,44);
backButton.clickEvent=function(e,p){node.back();p.stopPropagation();};var rightText=new button('申请记录','','right_text');rightText.setAbsoluteSize(100,44);rightText.clickEvent=function(e,p){//跳转相应页面申请页面
switch(type){case 1:_this.to('adRecord');break;case 2:_this.to('record_yard');break;case 3:_this.to('record_hall');break;}p.stopPropagation();};//店铺选择header图片
node.addChild(new Nav('店铺选择',backButton,rightText));switch(type){case 1:src="./images/apply/shop_apply_"+type+".jpg";node.applyType='广告位';break;case 2:src="./images/apply/shop_apply_"+type+".png";node.applyType='堆场';break;case 3:src="./images/apply/shop_apply_"+type+".png";node.applyType='大厅';break;}var shopBg=node.addChild();shopBg.setSizeMode('relative','absolute').setAbsoluteSize(null,App.width*23/75).setPosition(0,44).el=new DOMElement(shopBg,{tagName:'img',attributes:{'src':src}});}function initContent(node,type,data){var con=node.addChild();con.setSizeMode('relative','relative').setDifferentialSize(0,-(44+App.width*23/75)).setPosition(0,44+App.width*23/75);node._con=con;//横幅
var HD=con.addChild();HD.setSizeMode('relative','absolute').setAbsoluteSize(null,15).setPosition(0,15).el=new DOMElement(HD,{classes:['HD'],content:"<span></span>请点击选择需要申请"+type+"的店铺："}).setProperty('lineHeight','15px');var shopItemBox=con.addChild();shopItemBox.setSizeMode('relative','relative').setDifferentialSize(0,-(40+25)).setPosition(0,40).el=new DOMElement(shopItemBox,{classes:['overflow_scoll']});var shopjson=data;if(shopjson===null){return false;}// 循环每个店铺
for(var i=0;i<shopjson.length;i++){var shopItem=shopItemBox.addChild();// var align = i % 2 ? 1 : 0;
shopItem.setSizeMode('relative','absolute').setAbsoluteSize(null,60).setProportionalSize(1/2).setDifferentialSize(-14).setAlign(i%2/2)// .setAlign(align)
// .setMountPoint(align)
// .setPosition(align ? -14 : 14,Math.floor(i/2)*61)
.setPosition(i%2?0:14,Math.floor(i/2)*60).el=new DOMElement(shopItem,{classes:['shop_item'],content:shopjson[i].name});// align ? shopItem.el.setProperty('borderRight','1px solid #e0e0e0') : shopItem.el.setProperty('borderLeft','1px solid #e0e0e0');
//绑定事件
shopItem.addUIEvent('click');shopItem.listId='shopSelect';shopItem.shopId=shopjson[i].id;}}module.exports=ShopChoose;},{"Ajax":63,"App":64,"Page":70,"button":75,"famous/dom-renderables/DOMElement":21,"model/SignModel":79,"twoBtnNav":87}],90:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var navbar=require('twoBtnNav');var button=require('button');var Tips=require('Tips');var App=require('App');var Ajax=require('Ajax');var signModel=require('model/signModel');var apply_hall=function(_Page3){_inherits(apply_hall,_Page3);function apply_hall(){_classCallCheck(this,apply_hall);return _possibleConstructorReturn(this,Object.getPrototypeOf(apply_hall).call(this,{id:'apply'}));}_createClass(apply_hall,[{key:"onCreate",value:function onCreate(opt){_get(Object.getPrototypeOf(apply_hall.prototype),"onCreate",this).call(this);this.opt=opt;initNav(this);this.content=this.addChild();this.content.setSizeMode('relative','relative').setDifferentialSize(0,-45).setPosition(0,45);new DOMElement(this.content,{classes:['overflow_auto']});}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(apply_hall.prototype),"onResume",this).call(this);if(!this.content.inode2){initPage(this.content);initData(this.content);}}},{key:"onDestroy",value:function onDestroy(){var obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(apply_hall.prototype),"onDestroy",this).call(this);}},{key:"onReceive",value:function onReceive(e,p){//选择区域
if(e==='change'&&p.node.liId==='area'){initNumber(this.content,p.value);p.stopPropagation();}// //选择入场时间
// if (e === 'click' && p.node.liId === 'getTime') {
// 	p.node.el.addClass('l_getTime');
// 	p.stopPropagation();
// }
// //选择入场时间
// if (e === 'change' && p.node.liId === 'getTime') {
// 	this.getTime = p.value;
// 	//把日期转换为时间戳
// 	this.timestamp = Date.parse(new Date(this.getTime)) / 1000;
// 	p.stopPropagation();
// }
//选择经营品类
if(e==='input'&&p.node.liId==='productText'){this.productText=p.value;p.stopPropagation();}//选择租货周期
if(e==='change'&&p.node.liId==='cycle'){this.cycle=p.value;p.stopPropagation();}//选择好编号，下方出现大厅相关信息
if(e==='change'&&p.node.liId==='number'){this.hid=p.value;initHallInfo(this.content,p.value);p.stopPropagation();}//确认申请
if(e==='click'&&p.node.liId==='submit'){if(this.hid&&this.cycle&&this.productText){new Ajax('/hall_apply/apply').data({'sid':this.opt,'hid':this.hid,'id':signModel.findOne().id,'cid':this.cycle,'product':this.productText,'did':App.uuid,'tk':signModel.findOne().token}).success(function(res){this.hid='';this.cycle='';this.productText='';if(res.status==200){alert('提交成功！',null,'提示信息','确定');setTimeout(function(){// this.content.inode4.el.removeClass('l_getTime');
this.back();}.bind(this),1000);}else{alert(res.msg,null,'提示信息','确定');}}.bind(this)).post();}else{alert('请填写完整的信息！',null,'提示信息','确定');}p.stopPropagation();}}}]);return apply_hall;}(Page);function initHallInfo(nodeAll,value){//获取大厅相关信息
new Ajax('/hall/detail').data({'hid':value,'id':signModel.findOne().id,'did':App.uuid,'tk':signModel.findOne().token}).success(function(res){var list=res.data;nodeAll.info.el.setContent("<div class=\"pad24\"><table border=\"1\">\n\t\t<tr>\n\t\t\t<td colspan=\"2\" style=\"height:38px\">以下是你选择的大厅相关信息</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>底层面积 /㎡：   <em>"+list.area+"</em></td>\n\t\t\t<td>二楼夹层面积 /㎡：   <em>"+list.oarea+"</em></td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td colspan=\"2\" style=\"padding: 0;height: 40px;\"><a href=\"javascript:;\">确认申请</a></td>\n\t\t</tr>\n\t  </table>\n\t  </div>\n\t\t<dl>\n\t\t\t<dt><i></i>服务提醒</dt>\n\t\t\t<dd>\n\t\t\t\t<p>请先前往商家中心确认所需要的大厅位置；</p>\n\t\t\t\t<p>申请成功后，请在3个工作日内到商家中心办理手续。</p>\n\t\t\t</dd>\n\t\t</dl>\n\t\t");}).post();}function initNumber(nodeAll,value){//第二个接口选择编号
new Ajax('/hall/tree_data').data({'hid':value,'id':signModel.findOne().id,'did':App.uuid,'tk':signModel.findOne().token}).success(function(res){var list=res.data;var len=res.data.length;var str='';str+="<select><option value=\"-1\">请选择编号</option>";for(var i=0;i<len;i++){str+="<option value=\""+list[i].id+"\">"+list[i].name+"</option>";}str+="</select>";nodeAll.inode2.el.setContent("<img src=\"images/conService/con2.png\"/>\n\t\t\t\t\t\t \t\t\t"+str+"\n\t\t\t\t\t\t\t  \t<a href=\"javascript:;\"></a>");nodeAll.inode2.liId='number';nodeAll.inode2.addUIEvent('change');}).post();}function initNav(node){var backButton=new button(" ","","goback2");var _this=node;// backButton.setAbsoluteSize(44,44);
backButton.clickEvent=function(){node.back();};var rightText=new button('申请记录','','right_text');rightText.setAbsoluteSize(100,44);rightText.clickEvent=function(){_this.hid='';_this.cycle='';_this.timestamp='';_this.to('record_hall');};node.addChild(new navbar('大厅申请',backButton,rightText));}function initPage(nodeAll){//请选择栋数
var inode=nodeAll.addChild();var str='';str+="<select><option value=\"-1\">请选择栋数</option>";str+="</select>";inode.setSizeMode('relative','absolute').setAbsoluteSize(null,60).setPosition(0,0*60);inode.el=new DOMElement(inode,{classes:['apply_list'],content:"<img src=\"images/conService/con1.png\"/>\n\t\t\t\t\t\t \t\t\t"+str+"\n\t\t\t\t\t\t\t  \t<a href=\"javascript:;\"></a>"});inode.liId='area';inode.addUIEvent('change');//请选择编号
nodeAll.inode2=nodeAll.addChild();var str='';str+="<select><option value=\"-1\">请选择编号</option>";str+="</select>";nodeAll.inode2.setSizeMode('relative','absolute').setAbsoluteSize(null,60).setPosition(0,1*60);nodeAll.inode2.el=new DOMElement(nodeAll.inode2,{classes:['apply_list'],content:"<img src=\"images/conService/con2.png\"/>\n\t\t\t\t\t\t \t\t\t"+str+"\n\t\t\t\t\t\t\t  \t<a href=\"javascript:;\"></a>"});nodeAll.inode2.liId='number';nodeAll.inode2.addUIEvent('change');//请选择租赁周期
nodeAll.inode3=nodeAll.addChild();var str='';str+="<select><option value=\"-1\">请选择租赁周期</option>";str+="</select>";nodeAll.inode3.setSizeMode('relative','absolute').setAbsoluteSize(null,60).setPosition(0,2*60);nodeAll.inode3.el=new DOMElement(nodeAll.inode3,{classes:['apply_list'],content:"<img src=\"images/conService/con3.png\"/>\n\t\t\t\t\t\t \t\t\t"+str+"\n\t\t\t\t\t\t\t  \t<a href=\"javascript:;\"></a>"});nodeAll.inode3.liId='cycle';nodeAll.inode3.addUIEvent('change');//请选择入场时间
// nodeAll.inode4 = nodeAll.addChild();
// var str = '';
// str = `<p>请选择入场时间</p><input type="datetime-local"/>`;
// nodeAll.inode4.setSizeMode('relative', 'absolute')
// 	.setAbsoluteSize(null, 60)
// 	.setPosition(0, 3 * 60)
// nodeAll.inode4.el = new DOMElement(nodeAll.inode4, {
// 	classes: ['apply_list'],
// 	content: `<img src="images/conService/con4.png"/>
// 					 			${str}
// 						  	<a href="javascript:;"></a>`
// });
// nodeAll.inode4.liId = 'getTime';
// nodeAll.inode4.addUIEvent('click');
// nodeAll.inode4.addUIEvent('change');
//填写经营品类
var inode2=nodeAll.addChild(),str2="<input type=\"text\" placeholder=\"请填写经营品类\" style=\"opacity:1\"/>";inode2.setSizeMode('relative','absolute').setAbsoluteSize(null,60).setPosition(0,3*60);inode2.el=new DOMElement(inode2,{classes:['apply_list'],content:"<img src=\"images/conService/con6.png\"/>\n\t\t\t\t\t\t\t\t \t\t\t"+str2});inode2.liId='productText';inode2.addUIEvent('input');//第一个请选择栋数接口
new Ajax('/hall/tree_data').data({'hid':1,'id':signModel.findOne().id,'did':App.uuid,'tk':signModel.findOne().token}).success(function(res){var list=res.data;var len=res.data.length;var str='';str+="<select><option value=\"-1\">请选择栋数</option>";for(var i=0;i<len;i++){str+="<option value=\""+list[i].id+"\">"+list[i].name+"</option>";}str+="</select>";inode.el.setContent("<img src=\"images/conService/con1.png\"/>\n\t\t\t\t\t\t\t \t\t\t"+str+"\n\t\t\t\t\t\t\t\t  \t<a href=\"javascript:;\"></a>");}).post();//第三个接口选择租赁周期
new Ajax('/hall_apply/hall_cycle').data({'id':signModel.findOne().id,'did':App.uuid,'tk':signModel.findOne().token}).success(function(res){var list=res.data;var len=res.data.length;var str='';str+="<select><option value=\"-1\">请选择租赁周期</option>";for(var i=0;i<len;i++){str+="<option value=\""+i+"\">"+list[i]+"</option>";}str+="</select>";nodeAll.inode3.el.setContent("<img src=\"images/conService/con3.png\"/>\n\t\t\t\t\t\t \t\t\t"+str+"\n\t\t\t\t\t\t\t  \t<a href=\"javascript:;\"></a>");}).post();}function initData(nodeAll){nodeAll.info=nodeAll.addChild();nodeAll.info.setPosition(0,240).setDifferentialSize(0,-240);nodeAll.info.el=new DOMElement(nodeAll.info,{classes:['apply_info'],content:"<div class=\"pad24\"><table border=\"1\">\n\t\t<tr>\n\t\t\t<td colspan=\"2\" style=\"height:38px\">以下是你选择的大厅相关信息</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>底层面积 /㎡：   <em>0</em></td>\n\t\t\t<td>二楼夹层面积 /㎡：   <em>0</em></td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td colspan=\"2\" style=\"padding: 0;height: 40px;\"><a href=\"javascript:;\">确认申请</a></td>\n\t\t</tr>\n\t  </table>\n\t  </div>\n\t\t<dl>\n\t\t\t<dt><i></i>服务提醒</dt>\n\t\t\t<dd>\n\t\t\t\t<p>请先前往商务中心确认所需要的大厅位置；</p>\n\t\t\t\t<p>申请成功后，请在3个工作日内到商务中心办理手续。</p>\n\t\t\t</dd>\n\t\t</dl>\n\t\t"});nodeAll.submit=nodeAll.info.addChild();nodeAll.submit.setSizeMode('relative','absolute').setAbsoluteSize(null,40).setPosition(24,150).setDifferentialSize(-48,0);nodeAll.submit.el=new DOMElement(nodeAll.submit);nodeAll.submit.el.setProperty('background','none');nodeAll.submit.liId='submit';nodeAll.submit.addUIEvent('click');}module.exports=apply_hall;},{"Ajax":63,"App":64,"Page":70,"Tips":73,"button":75,"famous/dom-renderables/DOMElement":21,"model/signModel":84,"twoBtnNav":87}],91:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var CrossCall=require('famous/core/CrossCall');var navbar=require('navbar');var Ajax=require('Ajax');var signModel=require('model/signModel');var App=require('App');var apply_wl=function(_Page4){_inherits(apply_wl,_Page4);function apply_wl(){_classCallCheck(this,apply_wl);return _possibleConstructorReturn(this,Object.getPrototypeOf(apply_wl).call(this,{id:'apply'}));}_createClass(apply_wl,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(apply_wl.prototype),"onCreate",this).call(this);this.addChild(new navbar('物流信息'));this.content=this.addChild();this.content.setSizeMode('relative','relative').setDifferentialSize(0,-45).setPosition(0,45);new DOMElement(this.content,{classes:['overflow_auto','bgh']});}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(apply_wl.prototype),"onResume",this).call(this);initPage(this.content);}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(apply_wl.prototype),"onDestroy",this).call(this);}},{key:"onReceive",value:function onReceive(e,p){if(e==="click"&&p.node.liId==="phone_wl"){var phoneNumber=p.node.phoneNumber;this.phoneId=p.node.phoneId;confirm("确定要拨打电话"+phoneNumber+"？",function(res){var phoneId=this.phoneId;if(res==1){new CrossCall(function(phoneId){console.log(phoneId);document.getElementById(phoneId).click();},[phoneId]).exec();}}.bind(this),"拨打电话",["确定","取消"]);p.stopPropagation();}}}]);return apply_wl;}(Page);function initPage(nodeAll){new Ajax('/transport/lists').data({'id':signModel.findOne().id,'did':App.uuid,'tk':signModel.findOne().token}).success(function(res){var list=res.data;var len=list.length;for(var i=0;i<len;i++){var str='';// var phoneArray = list[i].phone.split('~');
// var len2 = phoneArray.length;
// for(var j = 0; j < len2; j++){
str+="<a href=\"javascript:;\">"+list[i].phone+"</a>";// }
var inode=nodeAll.addChild();inode.setSizeMode('relative','absolute').setAbsoluteSize(null,170).setPosition(0,i*(170+8));inode.el=new DOMElement(inode,{classes:['list_wl'],content:"<dl>\n\t\t\t\t\t\t\t\t\t\t\t\t<dt>"+list[i].name+"</dt>\n\t\t\t\t\t\t\t\t\t\t\t\t<dd>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<p class=\"p1\"><i></i>"+list[i].address+"</p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<p class=\"p2\"><i></i>"+list[i].range+"</p>\n\t\t\t\t\t\t\t\t\t\t\t\t</dd>\n\t\t\t\t\t\t\t\t\t\t\t</dl>\n\t\t\t\t\t\t\t\t\t\t\t<p class=\"ul_phone\">\n\t\t\t\t\t\t\t\t\t\t\t\t<i></i>\n\t\t\t\t\t\t\t\t\t\t\t\t"+str+"\n\t\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t"});inode.phoneNumber=list[i].phone;inode.liId='phone_wl';inode.phoneId="playPhone"+i;inode.addUIEvent('click');//拨打电话专用
var playPhone=nodeAll.addChild();playPhone.setAlign(-2,0);playPhone.el=new DOMElement(playPhone,{content:"<a href=\"tel:"+list[i].phone+"\" id=\"playPhone"+i+"\"></a>"});}}).post();}module.exports=apply_wl;},{"Ajax":63,"App":64,"Page":70,"famous/core/CrossCall":9,"famous/dom-renderables/DOMElement":21,"model/signModel":84,"navbar":85}],92:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var navbar=require('twoBtnNav');var button=require('button');var Tips=require('Tips');var App=require('App');var Ajax=require('Ajax');var signModel=require('model/signModel');var apply_yard=function(_Page5){_inherits(apply_yard,_Page5);function apply_yard(){_classCallCheck(this,apply_yard);return _possibleConstructorReturn(this,Object.getPrototypeOf(apply_yard).call(this,{id:'apply'}));}_createClass(apply_yard,[{key:"onCreate",value:function onCreate(opt){_get(Object.getPrototypeOf(apply_yard.prototype),"onCreate",this).call(this);this.opt=opt;initNav(this);this.content=this.addChild();this.content.setSizeMode('relative','relative').setDifferentialSize(0,-45).setPosition(0,45);new DOMElement(this.content,{classes:['overflow_auto']});}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(apply_yard.prototype),"onResume",this).call(this);if(!this.number){// initTime(this.content);
initPage(this.content);initData(this.content);}}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(apply_yard.prototype),"onDestroy",this).call(this);}},{key:"onReceive",value:function onReceive(e,p){// if(e === 'input' && p.node.liId === 'time1'){
// 	this.time1 = Date.parse(p.value) / 1000;
// 	p.node.el.addClass('opa1');
// 	p.stopPropagation();
// }
// if(e === 'input' && p.node.liId === 'time2'){
// 	this.time2 = Date.parse(p.value) / 1000;
// 	p.node.el.addClass('opa1');
// 	p.stopPropagation();
// }
if(e==='input'&&p.node.liId==='productText'){this.productText=p.value;p.stopPropagation();}if(e==='change'&&p.node.liId==='area'){this.area=p.value;}if(e==='change'&&p.node.liId==='number'){this.number=p.value;//改变堆场面积
new Ajax('/yard/detail').data({'yid':this.number,'id':signModel.findOne().id,'did':App.uuid,'tk':signModel.findOne().token}).success(function(res){var list=res.data;this.content.info.el.setContent("<div class=\"pad24\"><table border=\"1\">\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td style=\"padding:0 50px\">您选择的堆场面积 /㎡： <em>"+list.area+"</em></td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td colspan=\"2\" style=\"padding: 0;height: 40px;\"><a href=\"javascript:;\">确认申请</a></td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t  </table>\n\t\t\t\t\t  </div>\n\t\t\t\t\t\t<dl>\n\t\t\t\t\t\t\t<dt><i></i>服务提醒</dt>\n\t\t\t\t\t\t\t<dd>\n\t\t\t\t\t\t\t\t<p>请先前往商务中心确认所需要的堆场；</p>\n\t\t\t\t\t\t\t\t<p>申请成功后，请在3个工作日内到商务中心办理手续。</p>\n\t\t\t\t\t\t\t</dd>\n\t\t\t\t\t\t</dl>\n\t\t\t\t\t\t");}.bind(this)).post();p.stopPropagation();}if(e==='click'&&p.node.liId==='submit'){if(this.number&&this.productText){new Ajax('/yard_apply/apply').data({'sid':this.opt,'yid':this.number,'id':signModel.findOne().id,// 'cdate':this.time1,
// 'edate':this.time2,
'product':this.productText,'did':App.uuid,'tk':signModel.findOne().token}).success(function(res){console.log(res);this.number='';this.area='';// this.time1 = '';
// this.time2 = '';
this.productText='';if(res.status==200){alert('提交成功！',null,'提示信息','确定');setTimeout(function(){// this.content.time1.el.removeClass('opa1');
// this.content.time2.el.removeClass('opa1');
this.back();}.bind(this),1000);}else{alert(res.msg,null,'提示信息','确定');}}.bind(this)).post();}else{alert('请填写完整的信息！',null,'提示信息','确定');}p.stopPropagation();}}}]);return apply_yard;}(Page);function initNav(node){var backButton=new button(" ","","goback2");var _this=node;// backButton.setAbsoluteSize(44,44);
backButton.clickEvent=function(){node.back();};var rightText=new button('申请记录','','right_text');rightText.setAbsoluteSize(100,44);rightText.clickEvent=function(){_this.to('record_yard');};node.addChild(new navbar('堆场申请',backButton,rightText));}function initTime(nodeAll){nodeAll.time=nodeAll.addChild();nodeAll.time.setSizeMode('relative','absolute').setAbsoluteSize(null,90);nodeAll.time.el=new DOMElement(nodeAll.time,{classes:['timebg'],content:"<div class=\"timebg_left\">请选择入场时间</div><i></i><div class=\"timebg_right\">请选择出场时间</div>"});//选择入场时间
nodeAll.time1=nodeAll.time.addChild();nodeAll.time1.setSizeMode('relative','absolute').setAbsoluteSize(null,53).setProportionalSize(0.4).setDifferentialSize(-24,0).setPosition(24,20);nodeAll.time1.el=new DOMElement(nodeAll.time1,{classes:['time1'],content:"<input type=\"date\"/>"});nodeAll.time1.liId='time1';nodeAll.time1.addUIEvent('input');//选择出场时间
nodeAll.time2=nodeAll.time.addChild();nodeAll.time2.setSizeMode('relative','absolute').setAbsoluteSize(null,53).setProportionalSize(0.4).setDifferentialSize(-24,0).setAlign(1,0).setMountPoint(1,0).setPosition(-24,20);nodeAll.time2.el=new DOMElement(nodeAll.time2,{classes:['time1'],content:"<input type=\"date\"/>"});nodeAll.time2.liId='time2';nodeAll.time2.addUIEvent('input');}function initPage(nodeAll){new Ajax('/yard/tree_data').data({'yid':1,'id':signModel.findOne().id,'did':App.uuid,'tk':signModel.findOne().token}).success(function(res){//请选择区域
new Ajax('/yard/domain').data({'id':signModel.findOne().id,'did':App.uuid,'tk':signModel.findOne().token}).success(function(res2){var list2=res2.data,len2=list2.length;var area=nodeAll.addChild();area.setSizeMode('relative','absolute').setAbsoluteSize(null,60);var str2='';str2+="<select><option value=\"-1\">请选择区域</option>";for(var j=0;j<len2;j++){str2+="<option value=\""+list2[j].id+"\">"+list2[j].name+"</option>";}str2+="</select><a href=\"javascript:;\"></a>";area.el=new DOMElement(area,{classes:['apply_list'],content:"<img src=\"images/apply/area_ico.png\"/>\n\t\t\t\t\t\t\t\t \t\t\t"+str2});area.liId='area';area.addUIEvent('change');}).post();//请选择编号
var list=res.data;var len=list.length;var inode=nodeAll.addChild();var str='';str+="<select><option value=\"-1\">请选择编号</option>";for(var i=0;i<len;i++){str+="<option value=\""+list[i].id+"\">"+list[i].name+"</option>";}str+="</select><a href=\"javascript:;\"></a>";inode.setSizeMode('relative','absolute').setAbsoluteSize(null,60).setPosition(0,60);inode.el=new DOMElement(inode,{classes:['apply_list'],content:"<img src=\"images/conService/con2.png\"/>\n\t\t\t\t\t\t\t \t\t\t"+str});inode.liId='number';inode.addUIEvent('change');//填写堆场产品
var inode2=nodeAll.addChild(),str2="<input type=\"text\" placeholder=\"请填写堆场产品\" style=\"opacity:1;width:80%;line-height:50px;\"/>";inode2.setSizeMode('relative','absolute').setAbsoluteSize(null,60).setPosition(0,2*60);inode2.el=new DOMElement(inode2,{classes:['apply_list'],content:"<img src=\"images/conService/con6.png\"/>\n\t\t\t\t\t\t\t\t \t\t\t"+str2});inode2.liId='productText';inode2.addUIEvent('input');}).post();}function initData(nodeAll){nodeAll.info=nodeAll.addChild();nodeAll.info.setPosition(0,180).setDifferentialSize(0,-180);nodeAll.info.el=new DOMElement(nodeAll.info,{classes:['apply_info'],content:"<div class=\"pad24\"><table border=\"1\">\n\t\t\n\t\t<tr>\n\t\t\t<td style=\"padding:0 50px\">您选择的堆场面积 /㎡： <em>0</em></td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td colspan=\"2\" style=\"padding: 0;height: 40px;\"><a href=\"javascript:;\">确认申请</a></td>\n\t\t</tr>\n\t  </table>\n\t  </div>\n\t\t<dl>\n\t\t\t<dt><i></i>服务提醒</dt>\n\t\t\t<dd>\n\t\t\t\t<p>请先前往商务中心确认所需要的堆场；</p>\n\t\t\t\t<p>申请成功后，请在3个工作日内到商家中心办理手续。</p>\n\t\t\t</dd>\n\t\t</dl>\n\t\t"});nodeAll.submit=nodeAll.info.addChild();nodeAll.submit.setSizeMode('relative','absolute').setAbsoluteSize(null,40).setPosition(24,110).setDifferentialSize(-48,0);nodeAll.submit.el=new DOMElement(nodeAll.submit);nodeAll.submit.el.setProperty('background','none');nodeAll.submit.liId='submit';nodeAll.submit.addUIEvent('click');}module.exports=apply_yard;},{"Ajax":63,"App":64,"Page":70,"Tips":73,"button":75,"famous/dom-renderables/DOMElement":21,"model/signModel":84,"twoBtnNav":87}],93:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var navbar=require('navbar');var signModel=require('model/signModel');var config=require('config.json');var code=function(_Page6){_inherits(code,_Page6);function code(){_classCallCheck(this,code);return _possibleConstructorReturn(this,Object.getPrototypeOf(code).call(this));}_createClass(code,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(code.prototype),"onCreate",this).call(this);this.addChild(new navbar('查看二维码'));this.content=this.addChild();this.content.setSizeMode('relative','relative').setDifferentialSize(0,-45).setPosition(0,45);new DOMElement(this.content,{classes:['overflow_auto']});}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(code.prototype),"onResume",this).call(this);initPage(this.content);}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(code.prototype),"onDestroy",this).call(this);}}]);return code;}(Page);function initPage(nodeAll){nodeAll.setProportionalSize(.8).setAlign(.1);nodeAll.el=new DOMElement(nodeAll,{content:"<img src=\""+config.ajax_base+"/v1/qrcode/?uid="+signModel.findOne().id+"\" class=\"l_code\">"});}module.exports=code;},{"Page":70,"config.json":76,"famous/dom-renderables/DOMElement":21,"model/signModel":84,"navbar":85}],94:[function(require,module,exports){var Node=require('famous/core/Node');var DOMElement=require('famous/dom-renderables/DOMElement');var navbar=require('navbar');var blank=require('blank');var find=function(_Node5){_inherits(find,_Node5);function find(){_classCallCheck(this,find);var _this12=_possibleConstructorReturn(this,Object.getPrototypeOf(find).call(this,{id:'find'}));new DOMElement(_this12,{'id':'l_find'});_this12.addChild(new navbar('活动')).el.setContent("<p class='font-lg text-center'><span>活动</span></p>");_this12.addChild(new blank('find'));return _this12;}return find;}(Node);module.exports=find;},{"blank":74,"famous/core/Node":13,"famous/dom-renderables/DOMElement":21,"navbar":85}],95:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var GestureHandler=require('famous/components/GestureHandler');var CrossCall=require('famous/core/CrossCall');var Ajax=require('Ajax');var personalCenter=require('./personalCenter');var message=require('./message');var find=require('./find');var App=require('App');var signModel=require('model/signModel');var home=function(_Page7){_inherits(home,_Page7);function home(){_classCallCheck(this,home);return _possibleConstructorReturn(this,Object.getPrototypeOf(home).call(this,{id:'home'}));}_createClass(home,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(home.prototype),"onCreate",this).call(this);//获取电话号码
new Ajax('/app_config/detail_user').data({'key':'CUSTOMER_SERVICE','id':signModel.findOne().id,'did':App.uuid,'tk':signModel.findOne().token}).success(function(d){if(d.status===200){this.phoneNmuber=d.data;}}.bind(this)).post();//第一屏页面
this.content=this.addChild();this.content.setDifferentialSize(0,-50);this.content.el=new DOMElement(this.content,{classes:['content1','overflow_auto']});//初始化banner
initBanner(this.content);//初始化Message
initMessage(this.content);//初始化功能列表
initActivity(this,this.content);//初始化温度背景界面
initTemp(this.content);//第二屏页面（发现）
this.content2=this.addChild(new find('find'));this.content2.setDifferentialSize(0,-50).setAlign(1,0);this.content2.el=new DOMElement(this.content2);//第三屏页面（消息）
this.content3=this.addChild(new message());this.content3.setDifferentialSize(0,-50).setAlign(1,0);this.content3.el=new DOMElement(this.content3,{id:'message'});//第四屏页面（个人中心）
this.content4=this.addChild(new personalCenter());this.content4.setDifferentialSize(0,-50).setAlign(1,0);this.content4.el=new DOMElement(this.content4,{classes:['personalCenter']});//初始化底部
initFoot(this);}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(home.prototype),"onResume",this).call(this);}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(home.prototype),"onDestroy",this).call(this);}},{key:"onReceive",value:function onReceive(e,p){// var list2 = ['首页', '发现', '消息', '我的'];
if(p.node.mark==='foot'){if(e==='click'&&p.node.liId==='foot0'){this.content.setAlign(0,0);this.content2.setAlign(1,0);this.content3.setAlign(1,0);this.content4.setAlign(1,0);}if(e==='click'&&p.node.liId==='foot1'){this.content.setAlign(1,0);this.content2.setAlign(0,0);this.content3.setAlign(1,0);this.content4.setAlign(1,0);}if(e==='click'&&p.node.liId==='foot2'){this.content.setAlign(1,0);this.content2.setAlign(1,0);this.content3.setAlign(0,0);this.content4.setAlign(1,0);}if(e==='click'&&p.node.liId==='foot3'){this.content.setAlign(1,0);this.content2.setAlign(1,0);this.content3.setAlign(1,0);this.content4.setAlign(0,0);}var nodeChildren=p.node.getParent().getChildren();for(var i=0;i<nodeChildren.length;i++){// nodeChildren[i].el.setContent(`<img src="images/home/foot${(i + 1)}.png"/><p>${list2[i]}</p>`);
nodeChildren[i].el.setContent("<img src=\"images/home/foot"+(i+1)+".png\"/>");}var index=nodeChildren.indexOf(p.node);// p.node.el.setContent(`<img src="images/home/foot${(index + 1)}_h.png"/><p style="color:#fe6a71;">${list2[index]}</p>`);
p.node.el.setContent("<img src=\"images/home/foot"+(index+1)+"_h.png\"/>");}//首页6个按钮
if(e==='click'&&p.node.liId==='to0'){this.to('notice');}if(e==='click'&&p.node.liId==='to1'){this.to('repair');}if(e==='click'&&p.node.liId==='to2'){this.to('card');}if(e==='click'&&p.node.liId==='to3'){// var phoneNmuber = p.node.phoneNmuber;
new Ajax('/app_config/detail_user').data({'key':'CUSTOMER_SERVICE','id':signModel.findOne().id,'did':App.uuid,'tk':signModel.findOne().token}).success(function(d){if(d.status===200){var phoneNmuber=d.data;this.playPhone.el.setAttribute('href','tel:'+phoneNmuber).draw();// console.log(this.playPhone)
confirm("确定要拨打电话"+phoneNmuber+"？",function(res){if(res==1){new CrossCall(function(){document.getElementById('playPhone').click();}).exec();}},'专属客服',['确定','取消']);}else if(d.status===5){signModel.update({'id':signModel.findOne().id},{'token':null});alert('登录已过期，请登录后再联系！',function(){new CrossCall(function(){location.reload();}).exec();},'提示信息','确定');}}.bind(this)).post();p.stopPropagation();}if(e==='click'&&p.node.liId==='to4'){this.to('service');}if(e==='click'&&p.node.liId==='to5'){this.to('businessRecord');}if(e==='touchstart'&&p.node.mark==='tt'){p.node.el.addClass('opa8');}if(e==='touchend'&&p.node.mark==='tt'){p.node.el.removeClass('opa8');}if(e==='click'&&p.node.listId==='toMsgDetail'){this.to('noticeDetail',{'data':p.node.noticeData});}p.stopPropagation();}}]);return home;}(Page);//初始化温度背景界面
function initTemp(nodeAll){var date=new Date();var month=date.getMonth()+1;var day=date.getDate();nodeAll.temp=nodeAll.addChild();nodeAll.temp.setSizeMode('relative','absolute').setPosition(0,App.width*49/75-20+53+210).setAbsoluteSize(null,App.width*208/750);nodeAll.temp.el=new DOMElement(nodeAll.temp,{classes:['temp'],content:"<h2>25℃</h2><p>chengdu<span>01/01</span></p>"});new Ajax('/weather/').data({'cityname':'成都','key':signModel.findOne().token}).success(function(res){var res=JSON.parse(res);nodeAll.temp.el.setContent("<h2>"+res.result.data.realtime.weather.temperature+"℃</h2><p>chengdu<span>"+month+"/"+day+"</span></p>");}).error(function(res){console.log(res);}).get();}//初始化底部
function initFoot(nodeAll){nodeAll.foot=nodeAll.addChild();nodeAll.foot.setSizeMode('relative','absolute').setAbsoluteSize(null,50).setAlign(0,1).setMountPoint(0,1);nodeAll.foot.el=new DOMElement(nodeAll.foot,{classes:['footbox']});// var list2 = ['首页', '发现', '消息', '我的'];
var inode=nodeAll.foot.addChild();inode.setSizeMode('relative','absolute').setAbsoluteSize(null,50).setProportionalSize(1/4);inode.el=new DOMElement(inode,{classes:['footList'],// content:`<img src="images/home/foot1_h.png"/><p style="color:#fe6a71;">${list2[0]}</p>`
content:"<img src=\"images/home/foot1_h.png\"/>"});inode.mark='foot';inode.liId="foot0";inode.addUIEvent('click');for(var i=1;i<4;i++){var inode=nodeAll.foot.addChild();inode.setSizeMode('relative','absolute').setAbsoluteSize(null,50).setProportionalSize(1/4).setAlign(i/4,0);inode.el=new DOMElement(inode,{classes:['footList'],// content:`<img src="images/home/foot${(i + 1)}.png"/><p>${list2[i]}</p>`
content:"<img src=\"images/home/foot"+(i+1)+".png\"/>"});inode.mark='foot';inode.liId="foot"+i;inode.addUIEvent('click');}}//初始化功能列表
function initActivity(node,nodeAll){nodeAll.activity=nodeAll.addChild();nodeAll.activity.setSizeMode('relative','absolute').setPosition(0,App.width*49/75-20+55).setAbsoluteSize(null,210);nodeAll.activity.el=new DOMElement(nodeAll.activity,{classes:['activity']});var list=[{'img':'icon1.png','txt':'市场公告'},{'img':'icon2.png','txt':'在线报修'},{'img':'icon3.png','txt':'一卡通'},{'img':'icon4.png','txt':'专属客服'},{'img':'icon5.png','txt':'便民服务'},{'img':'icon6.png','txt':'商家生涯'}];var len=list.length;for(var i=0;i<len;i++){var str='';var num=Math.ceil((i+0.1)/3-1);var inode=nodeAll.activity.addChild();inode.setSizeMode('relative','absolute').setAbsoluteSize(null,95).setProportionalSize(1/3).setPosition(0,15+num*95).setAlign(i%3*1/3,0);// if(list[i].phoneNmuber){
// 	var kfPhone = list[i].phoneNmuber;
// 	str = `<img src="images/home/${list[i].img}" id="phoneNmuber"/><p>${list[i].txt}</p>`
// 	inode.phoneNmuber = list[i].phoneNmuber;
// }else{
str="<img src=\"images/home/"+list[i].img+"\"/><p>"+list[i].txt+"</p>";// }
inode.el=new DOMElement(inode,{classes:['icoBox'],content:str});// if(list[i].phoneNmuber){
// 	inode.phoneNmuber = list[i].phoneNmuber;
// }
inode.liId="to"+i;inode.addUIEvent('click');inode.mark='tt';inode.addUIEvent('touchstart');inode.addUIEvent('touchend');}//拨打电话专用
node.playPhone=nodeAll.addChild();node.playPhone.setAlign(-2,0).el=new DOMElement(node.playPhone,{'tagName':'a','id':'playPhone'});}//初始化Message
function initMessage(nodeAll){var userSign=signModel.findOne();var msgData='';nodeAll.message=nodeAll.addChild();nodeAll.message.setSizeMode('relative','absolute').setPosition(0,App.width*49/75-20).setAbsoluteSize(null,55);nodeAll.message.el=new DOMElement(nodeAll.message,{classes:['l_message'],content:"<div class=\"messageBox\"><i></i><p>9月26日中益吉城青白江园区正式开业啦！</p></div>"});nodeAll.message.addUIEvent('click');nodeAll.message.listId='toMsgDetail';new Ajax('/message_info/lists_user').data({'type':1,'id':userSign.id,'did':App.uuid,'tk':userSign.token}).success(function(d){if(d.status===200){msgData=d.data[0];nodeAll.message.el.setContent("<div class=\"messageBox\"><i></i><p>"+msgData.InfoTitle+"</p></div>");nodeAll.message.noticeData=d.data[0];}}).post();}//初始化banner
function initBanner(nodeAll){new Ajax('/app_advert/lists_user').data({'did':App.uuid}).success(function(res){var bannerList=res.data;var banner=nodeAll.addChild();banner.setSizeMode('relative','absolute').setAbsoluteSize(null,App.width*49/75-20);banner.el=new DOMElement(banner,{classes:['banner']});banner.addUIEvent('click');var len=bannerList.length;if(len==1){var bannerItem=banner.addChild();bannerItem.setSizeMode('relative','absolute').setAbsoluteSize(null,App.width*49/75-20).setAlign(0,0);bannerItem.el=new DOMElement(bannerItem,{content:"<img src=\""+bannerList[0].img+"\">"});return;}//左边第一个bannerItem
var bannerFirstItem=banner.addChild();bannerFirstItem.setSizeMode('relative','absolute').setAbsoluteSize(null,App.width*49/75-20).setAlign(-1,0);bannerFirstItem.el=new DOMElement(bannerFirstItem,{content:"<img src=\""+bannerList[len-1].img+"\">"});for(var i=0;i<len;i++){var bannerItem=banner.addChild();bannerItem.setSizeMode('relative','absolute').setAbsoluteSize(null,App.width*49/75-20).setAlign(i,0);bannerItem.el=new DOMElement(bannerItem,{content:"<img src=\""+bannerList[i].img+"\">"});}//右边最后一个bannerItem
var bannerLastItem=banner.addChild();bannerLastItem.setSizeMode('relative','absolute').setAbsoluteSize(null,App.width*49/75-20).setAlign(len,0);bannerLastItem.el=new DOMElement(bannerLastItem,{content:"<img src=\""+bannerList[0].img+"\">"});//banner图的圆点
var str='';for(var i=0;i<len-1;i++){str+='<div class="point"></div>';}banner.pointBox=banner.addChild();banner.pointBox.setSizeMode('relative','absolute').setAbsoluteSize(null,18).setAlign(0,1).setMountPoint(0,1);banner.pointBox.el=new DOMElement(banner.pointBox,{content:"<div class=\"pointBox\" id=\"pointBox\"><div class=\"point on\"></div>"+str+"</div>"});banner.pointBox.addUIEvent('click');//banner图滑动
var sonGesture=new GestureHandler(banner);var index=0;len+=1;sonGesture.on('drag',function(e){if(e.status=='end'&&e.centerDelta.x!=0){banner.childrens=banner.getChildren();if(e.centerDelta.x<0){index++;for(var i=0;i<len+1;i++){banner.childrens[i].setAlign(banner.childrens[i].getAlign()[0]-1,0);banner.childrens[i].el.addClass('l_trans');if(i==len&&index==len-1){setTimeout(function(){for(var i=0;i<len+1;i++){banner.childrens[i].el.removeClass('l_trans');banner.childrens[i].setAlign(i-1,0);}index=0;},300);}}}else if(e.centerDelta.x>0){index--;for(var i=0;i<len+1;i++){banner.childrens[i].setAlign(banner.childrens[i].getAlign()[0]+1,0);banner.childrens[i].el.addClass('l_trans');if(i==len&&index==-1){setTimeout(function(){for(var i=0;i<len+1;i++){banner.childrens[i].el.removeClass('l_trans');banner.childrens[i].setAlign(i-len+1,0);}index=len-2;},300);}}}//给banner图加圆点
var args={};args.index=index;args.len=len-1;new CrossCall(function(args){if(args.index==args.len){args.index=0;}else if(args.index==-1){args.index=args.len-1;}var pointBox=document.getElementById('pointBox').getElementsByTagName('div');var len2=pointBox.length;for(var i=0;i<len2;i++){pointBox[i].className='point';}pointBox[args.index].className='point on';},[args]).exec();}});}).error(function(){var banner=nodeAll.addChild();banner.setSizeMode('relative','absolute').setAbsoluteSize(null,App.width*49/75-20);banner.el=new DOMElement(banner,{classes:['banner']});var bannerItem=banner.addChild();bannerItem.setSizeMode('relative','absolute').setAbsoluteSize(null,App.width*49/75-20);bannerItem.el=new DOMElement(bannerItem,{content:"<img src=\"images/home/default_bg.png\">"});}).post();}module.exports=home;},{"./find":94,"./message":97,"./personalCenter":100,"Ajax":63,"App":64,"Page":70,"famous/components/GestureHandler":3,"famous/core/CrossCall":9,"famous/dom-renderables/DOMElement":21,"model/signModel":84}],96:[function(require,module,exports){var Node=require('famous/core/Node');var DOMElement=require('famous/dom-renderables/DOMElement');function listItem(list,index){Node.call(this);var array=['message_item'];this.setSizeMode('relative','absolute').setAbsoluteSize(null,75).setPosition(0,index._id*75);this.allInfo=index;this.el=new DOMElement(this,{classes:array,content:"<dl class=\"dl"+list.InfoType+"\">\n\t\t\t\t\t\t\t\t<dt><img src=\"images/home/message"+list.InfoType+".png\"><i class=\""+list.isRead+"\"></i></dt>\n\t\t\t\t\t\t\t\t<dd>\n\t\t\t\t\t\t\t\t\t<h3><em>["+list.type+"]</em><span>"+list.InfoTitle+"</span></h3>\n\t\t\t\t\t\t\t\t\t<p>"+list.InfoCtime+"</p>\n\t\t\t\t\t\t\t\t</dd>\n\t\t\t\t\t\t\t</dl>"});//加入关闭按钮
var inode=this.addChild();inode.setSizeMode('absolute','absolute').setAbsoluteSize(22,22).setAlign(1,0).setMountPoint(1,0).setPosition(-14,25);inode.el=new DOMElement(inode,{classes:['l_close'],content:"<img src=\"images/home/close.png\">"});inode.liId=index;inode.mark='close';inode.addUIEvent('click');}listItem.prototype=Object.create(Node.prototype);module.exports=listItem;},{"famous/core/Node":13,"famous/dom-renderables/DOMElement":21}],97:[function(require,module,exports){var Node=require('famous/core/Node');var DOMElement=require('famous/dom-renderables/DOMElement');var CrossCall=require('famous/core/CrossCall');var navbar=require('navbar');var ListView=require('listview');var listItem=require('./listItem');var messageModel=require('model/messageModel');var incrementModel=require('model/incrementModel');var blank=require('blank');var signModel=require('model/signModel');var config=require('config.json');var message=function(_Node6){_inherits(message,_Node6);function message(){_classCallCheck(this,message);var _this14=_possibleConstructorReturn(this,Object.getPrototypeOf(message).call(this));_this14.addChild(new navbar('消息')).el.setContent("<p class='font-lg text-center'><span>消息</span></p>");_this14.content=_this14.addChild();_this14.content.setDifferentialSize(0,-44).setPosition(0,44);_this14.content.el=new DOMElement(_this14.content,{classes:['overflow_auto']});setTimeout(function(){initPage(this.content);}.bind(_this14),100);return _this14;}_createClass(message,[{key:"onReceive",value:function onReceive(e,p){//删除该条消息
if(e==='click'&&p.node.mark==='close'){confirm('确定要删除该条消息？',function(res){if(res==1){messageModel.remove({id:p.node.getParent().tip});var num=p.node.liId._id;this.content.ListView.RemoveItem(num);//判断是否还有数据
if(messageModel.findOne()==undefined){//没有数据，加入空白页面
this.addChild(new blank('mes')).setDifferentialSize(0,-45).setPosition(0,45);}setTimeout(function(){if(!messageModel.findOne()){this.content.el.removeClass('bgfff');}}.bind(this),100);}}.bind(this),'提示消息',['确定','取消']);p.stopPropagation();}//阅读该条消息
if(e==='click'&&p.node.liId==='musicList'){messageModel.update({id:p.node.tip},{isRead:true});var readMessage=messageModel.findOne({'id':p.node.tip});var list=p.node.allInfo.data;p.node.el.setContent("<dl class=\"dl"+list.InfoType+"\">\n\t\t\t\t\t\t\t\t<dt><img src=\"images/home/message"+list.InfoType+".png\"><i class=\"true\"></i></dt>\n\t\t\t\t\t\t\t\t<dd>\n\t\t\t\t\t\t\t\t\t<h3><em>["+list.type+"]</em><span>"+list.InfoTitle+"</span></h3>\n\t\t\t\t\t\t\t\t\t<p>"+list.InfoCtime+"</p>\n\t\t\t\t\t\t\t\t</dd>\n\t\t\t\t\t\t\t</dl>");this.getParent().to('noticeDetail',{'data':readMessage});p.stopPropagation();}}}]);return message;}(Node);function initPage(nodeAll){//读取数据
if(messageModel.findOne()){var list=messageModel.find().reverse();var len=list.length;nodeAll.ListView=new ListView({threshold:3,//预加载数 单位个（请根据item 高度适当调整）
throttle:16.7,//单位毫秒 控制Scroll执行频率
itemSize:[null,75],//item  尺寸
createItem:function createItem(list,index){var inode=new listItem(list,index);inode.liId="musicList";inode.tip=list.id;inode.addUIEvent("click");return inode;}});nodeAll.ListView.setSizeMode('relative','relative').setProportionalSize(1,1).BindData(list);nodeAll.addChild(nodeAll.ListView);}else{//没有数据，加入空白页面
nodeAll.getParent().addChild(new blank('mes')).setDifferentialSize(0,-45).setPosition(0,45);}//建立长链接
var websocket=new WebSocket(config.webSocket);websocket.onopen=function(evt){console.log(evt);websocket.send(JSON.stringify({msgtype:"auth",token:signModel.findOne().token}));};websocket.onerror=function(evt){console.log(evt);};websocket.onmessage=function(evt){console.log(evt);nodeAll.el.addClass('bgfff');var evt=JSON.parse(evt.data);var res=evt.msg;var obj=nodeAll.getChildren(),i=obj.length;while(i--){nodeAll.removeChild(obj[i]);}var messageId=incrementModel.findOne()?incrementModel.findOne().messageId:0;incrementModel.remove();incrementModel.save({'messageId':messageId+1});//存入一条数据
messageModel.save({'id':messageId,'imgSrc':res.imgSrc,'InfoType':res.InfoType,'InfoCtime':res.InfoCtime,'InfoTitle':res.InfoTitle,'type':res.type,'isRead':false,'InfoDesc':res.InfoDesc,'InfoAuthor':res.InfoAuthor});var list=messageModel.find().reverse();var len=list.length;nodeAll.ListView=new ListView({threshold:3,//预加载数 单位个（请根据item 高度适当调整）
throttle:16.7,//单位毫秒 控制Scroll执行频率
itemSize:[null,75],//item  尺寸
createItem:function createItem(list,index){var inode=new listItem(list,index);inode.liId="musicList";inode.tip=list.id;inode.addUIEvent("click");return inode;}});nodeAll.ListView.setSizeMode('relative','relative').setProportionalSize(1,1).BindData(list);nodeAll.addChild(nodeAll.ListView);};websocket.onclose=function(evt){alert(evt,'你的账号可能在其他地方登录，请重新登录',null,'提示消息','确定');};}module.exports=message;},{"./listItem":96,"blank":74,"config.json":76,"famous/core/CrossCall":9,"famous/core/Node":13,"famous/dom-renderables/DOMElement":21,"listview":78,"model/incrementModel":81,"model/messageModel":82,"model/signModel":84,"navbar":85}],98:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var CrossCall=require('famous/core/CrossCall');var navbar=require('navbar');var ListView=require('listview');var listItem=require('./listItem');var messageModel=require('model/messageModel');var incrementModel=require('model/incrementModel');var blank=require('blank');var signModel=require('model/signModel');var message=function(_Page8){_inherits(message,_Page8);function message(){_classCallCheck(this,message);return _possibleConstructorReturn(this,Object.getPrototypeOf(message).call(this,{id:'message'}));}_createClass(message,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(message.prototype),"onCreate",this).call(this);this.addChild(new navbar('消息'));this.content=this.addChild();this.content.setDifferentialSize(0,-44).setPosition(0,44);this.content.el=new DOMElement(this.content,{classes:['overflow_auto']});}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(message.prototype),"onResume",this).call(this);initPage(this.content);}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(message.prototype),"onDestroy",this).call(this);}},{key:"onReceive",value:function onReceive(e,p){//删除该条消息
if(e==='click'&&p.node.mark==='close'){messageModel.remove({id:p.node.getParent().tip});var num=p.node.liId._id;this.content.ListView.RemoveItem(num);setTimeout(function(){if(!messageModel.findOne()){this.content.el.removeClass('bgfff');}}.bind(this),100);}//阅读该条消息
if(e==='click'&&p.node.liId==='musicList'){messageModel.update({id:p.node.tip},{isRead:true});p.node.el.addClass('l_haveread');this.to('noticeDetail');}p.stopPropagation();}}]);return message;}(Page);function initPage(nodeAll){//读取数据
if(messageModel.findOne()){var list=messageModel.find().reverse();var len=list.length;nodeAll.ListView=new ListView({threshold:3,//预加载数 单位个（请根据item 高度适当调整）
throttle:16.7,//单位毫秒 控制Scroll执行频率
itemSize:[null,75],//item  尺寸
createItem:function createItem(list,index){var inode=new listItem(list,index);inode.liId="musicList";inode.tip=list.id;inode.addUIEvent("click");return inode;}});nodeAll.ListView.setSizeMode('relative','relative').setProportionalSize(1,1).BindData(list);nodeAll.addChild(nodeAll.ListView);}else{//没有数据，加入空白页面
nodeAll.getParent().addChild(new blank('mes')).setDifferentialSize(0,-45).setPosition(0,45);}//建立长链接
var websocket=new WebSocket('ws://10.100.1.14:9999');websocket.onopen=function(evt){console.log(evt);websocket.send(JSON.stringify({msgtype:"auth",token:signModel.findOne().token}));};websocket.onerror=function(evt){console.log(evt);};websocket.onmessage=function(evt){nodeAll.el.addClass('bgfff');var evt=JSON.parse(evt.data);var res=evt.msg;var obj=nodeAll.getChildren(),i=obj.length;while(i--){nodeAll.removeChild(obj[i]);}var messageId=incrementModel.findOne()?incrementModel.findOne().messageId:0;incrementModel.remove();incrementModel.save({'messageId':messageId+1});//存入一条数据
messageModel.save({'id':messageId,'imgSrc':res.imgSrc,'status':res.status,'InfoCtime':res.InfoCtime,'InfoTitle':res.InfoTitle,'type':res.type,'isRead':false,'InfoDesc':res.InfoDesc,'InfoAuthor':res.InfoAuthor});var list=messageModel.find().reverse();var len=list.length;nodeAll.ListView=new ListView({threshold:3,//预加载数 单位个（请根据item 高度适当调整）
throttle:16.7,//单位毫秒 控制Scroll执行频率
itemSize:[null,75],//item  尺寸
createItem:function createItem(list,index){var inode=new listItem(list,index);inode.liId="musicList";inode.tip=list.id;inode.addUIEvent("click");return inode;}});nodeAll.ListView.setSizeMode('relative','relative').setProportionalSize(1,1).BindData(list);nodeAll.addChild(nodeAll.ListView);};websocket.onclose=function(evt){console.log(evt);};}module.exports=message;},{"./listItem":96,"Page":70,"blank":74,"famous/core/CrossCall":9,"famous/dom-renderables/DOMElement":21,"listview":78,"model/incrementModel":81,"model/messageModel":82,"model/signModel":84,"navbar":85}],99:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var navbar=require('navbar');var App=require('App');var Ajax=require('Ajax');var signModel=require('model/signModel');var CrossCall=require('famous/core/CrossCall');var myinfo=function(_Page9){_inherits(myinfo,_Page9);function myinfo(){_classCallCheck(this,myinfo);return _possibleConstructorReturn(this,Object.getPrototypeOf(myinfo).call(this,{id:'myinfo'}));}_createClass(myinfo,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(myinfo.prototype),"onCreate",this).call(this);initPage(this);initContent(this);}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(myinfo.prototype),"onResume",this).call(this);}},{key:"onDestroy",value:function onDestroy(){var obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(myinfo.prototype),"onDestroy",this).call(this);}},{key:"onReceive",value:function onReceive(e,p){if(e==='click'&&p.node.liId==='seemore'){new CrossCall(function(){var info=document.getElementsByClassName('infoShopBox');var l_more=document.getElementsByClassName('l_more');info[0].className='infoShopBox';l_more[0].className='l_more hide';}).exec();}}}]);return myinfo;}(Page);function initContent(nodeAll){new Ajax('/user_store/list_id').data({'id':signModel.findOne().id,'did':App.uuid,'tk':signModel.findOne().token}).success(function(res){// res = {
//   "data": [
//     {
//       "id": 217,
//       "name": "C01-1-116"
//     },
//     {
//       "id": 217,
//       "name": "C01-1-116"
//     },
//     {
//       "id": 217,
//       "name": "C01-1-116"
//     },
//     {
//       "id": 217,
//       "name": "C01-1-116"
//     },
//     {
//       "id": 217,
//       "name": "C01-1-116"
//     }
//   ],
//   "msg": "成功",
//   "status": 200
// }
var list=res.data,len=list.length,str='',abc=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','R','S','T','U','V','W','X','Y','Z'];str+="<div class=\"infoShopBox infoShopBox_h\">";for(var i=0;i<len;i++){str+="<dl class=\"info_dl\">\n\t\t\t\t\t\t\t\t<dt>\n\t\t\t\t\t\t\t\t\t<h2>"+abc[i]+"</h2>\n\t\t\t\t\t\t\t\t\t<p>店铺</p>\n\t\t\t\t\t\t\t\t</dt>\n\t\t\t\t\t\t\t\t<dd>\n\t\t\t\t\t\t\t\t\t<h2>"+list[i].name+"</h2>\n\t\t\t\t\t\t\t\t\t<p>青白江区城清泉大道街53号  (国际物流园区旁)</p>\n\t\t\t\t\t\t\t\t</dd>\n\t\t\t\t\t\t\t</dl>";}str+="</div>";new Ajax('/grade_config/lists_user').data({'id':signModel.findOne().id,'did':App.uuid,'tk':signModel.findOne().token}).success(function(res){var list=res.data,len2=list.list.length;if(len<3){str+="\n\t\t\t\t\t\t<div class=\"infoBox\">\n\t\t\t\t\t\t\t<div class=\"infoname\">\n\t\t\t\t\t\t\t\t<img src=\"images/home/myinfo.png\"/>\n\t\t\t\t\t\t\t\t<p>"+list.gradename+"</p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"l_info\">\n\t\t\t\t\t\t\t\t<h2>尊敬的"+list.username+":</h2>\n\t\t\t\t\t\t\t\t<p>根据你当前的商户等级，你可享有的权益如下</p>\n\t\t\t\t\t\t\t";}else{str+="<div class=\"l_more\">查看更多店铺信息</div>\n\t\t\t\t\t\t<div class=\"infoBox\">\n\t\t\t\t\t\t\t<div class=\"infoname\">\n\t\t\t\t\t\t\t\t<img src=\"images/home/myinfo.png\"/>\n\t\t\t\t\t\t\t\t<p>"+list.gradename+"</p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"l_info\">\n\t\t\t\t\t\t\t\t<h2>尊敬的"+list.username+":</h2>\n\t\t\t\t\t\t\t\t<p>根据你当前的商户等级，你可享有的权益如下</p>\n\t\t\t\t\t\t\t";}for(var j=0;j<len2;j++){str+="<dl>\n\t\t\t\t\t\t\t\t\t<dt>"+list.list[j].name+"</dt>\n\t\t\t\t\t\t\t\t\t<dd>"+list.list[j].desc+"</dd>\n\t\t\t\t\t\t\t\t</dl>";}str+="</div>\n\t\t\t\t\t\t</div>";nodeAll.content=nodeAll.addChild();nodeAll.content.setDifferentialSize(-20,-100).setPosition(10,50);nodeAll.content.el=new DOMElement(nodeAll.content,{classes:['overflow_auto','myinfoContent'],content:str});var seemore=nodeAll.addChild();seemore.setSizeMode('relative','absolute').setAbsoluteSize(null,80).setPosition(0,220);seemore.el=new DOMElement(seemore);seemore.el.setProperty('z-index','100');seemore.liId='seemore';seemore.addUIEvent('click');}).post();}).post();}function initPage(nodeAll){nodeAll.top=nodeAll.addChild();nodeAll.top.setSizeMode('relative','absolute').setAbsoluteSize(null,175);nodeAll.top.el=new DOMElement(nodeAll.top,{classes:['myinfo_top']});nodeAll.title=nodeAll.addChild(new navbar('我的资料'));nodeAll.title.el.setProperty('background','none');}module.exports=myinfo;},{"Ajax":63,"App":64,"Page":70,"famous/core/CrossCall":9,"famous/dom-renderables/DOMElement":21,"model/signModel":84,"navbar":85}],100:[function(require,module,exports){var Node=require('famous/core/Node');var DOMElement=require('famous/dom-renderables/DOMElement');var IconItem=require('IconItem');var CrossCall=require("famous/core/CrossCall");var myInfoModel=require('model/myInfoModel');var signModel=require('model/signModel');var App=require('App');var Ajax=require('Ajax');var personalCenter=function(_Node7){_inherits(personalCenter,_Node7);function personalCenter(){_classCallCheck(this,personalCenter);var _this17=_possibleConstructorReturn(this,Object.getPrototypeOf(personalCenter).call(this));initPage(_this17);return _this17;}_createClass(personalCenter,[{key:"onReceive",value:function onReceive(e,p){if(e==='click'&&p.node.liId==='mine1'){this.getParent().to('myinfo');}if(e==='click'&&p.node.liId==='mine2'){this.getParent().to('code');}if(e==='click'&&p.node.liId==='mine3'){this.getParent().to('setting');}if(e==='click'&&p.node.liId==='canmera'){new CrossCall(function(){navigator.camera.getPicture(function(imageURI){document.getElementById('p_avatar').src=imageURI;self._call(imageURI);});}).exec(function(imageURI){myInfoModel.save({imgSrc:imageURI});this.imgSrc=myInfoModel.findOne().imgSrc;});}}}]);return personalCenter;}(Node);function initPage(nodeAll){setTimeout(function(){new Ajax('/member/detail_custom').data({'id':signModel.findOne().id,'did':App.uuid,'tk':signModel.findOne().token}).success(function(res){var str='';if(res.status===200){var list=res.data;if(myInfoModel.findOne()){str="<h2>"+list.name+"</h2>\n\t\t\t\t\t\t\t\t<p>欢迎您，欢迎使用智慧云平台物业APP</p>\n\t\t\t\t\t\t\t\t<div class=\"p_avatar\"><img src=\""+myInfoModel.findOne().imgSrc+"\"  id=\"p_avatar\"/></div>\n\t\t\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\t<img src=\"images/home/p1.png\"/>"+list.address+"\n\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\t<img src=\"images/home/p2.png\"/>"+list.gradename+"\n\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\t<img src=\"images/home/p3.png\"/>"+list.store+" 家\n\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t</ul>";}else{str="\n\t\t\t\t\t\t<h2>"+list.name+"</h2>\n\t\t\t\t\t\t<p>欢迎您，欢迎使用智慧云平台物业APP</p>\n\t\t\t\t\t\t<div class=\"p_avatar\"><img src=\"images/home/p_lk.jpg\"  id=\"p_avatar\"/></div>\n\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t<img src=\"images/home/p1.png\"/>"+list.address+"\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t<img src=\"images/home/p2.png\"/>"+list.gradename+"\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t<img src=\"images/home/p3.png\"/>"+list.store+" 家\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t";}}else if(res.status===5){var userSign=signModel.findOne();alert('登录已过期，请重新登录！',function(){signModel.update({'id':userSign.id},{'token':null});new CrossCall(function(){location.reload();}).exec();},'提示信息','确定');}nodeAll.head=nodeAll.addChild();nodeAll.head.setSizeMode('relative','absolute').setAbsoluteSize(null,310);nodeAll.head.el=new DOMElement(nodeAll.head,{classes:['p_top'],content:str});//照相机
nodeAll.head.canmera=nodeAll.head.addChild();nodeAll.head.canmera.setSizeMode('absolute','absolute').setAbsoluteSize(90,90).setPosition(0,100).setAlign(.5,0).setMountPoint(.5,0);nodeAll.head.canmera.el=new DOMElement(nodeAll.head.canmera);nodeAll.head.canmera.liId='canmera';nodeAll.head.canmera.addUIEvent('click');//个人中心按钮
nodeAll.listBox=nodeAll.addChild();nodeAll.listBox.setDifferentialSize(0,0);nodeAll.listBox.el=new DOMElement(nodeAll.listBox);var inode1=nodeAll.listBox.addChild(new IconItem({'icon':'images/home/p_list1.png','desc':'我的资料'},0,50));inode1.liId='mine1';inode1.addUIEvent('click');var inode2=nodeAll.listBox.addChild(new IconItem({'icon':'images/home/p_list2.png','desc':'我的二维码'},1,50));inode2.liId='mine2';inode2.addUIEvent('click');var inode3=nodeAll.listBox.addChild(new IconItem({'icon':'images/home/p_list3.png','desc':'设置'},2,50));inode3.liId='mine3';inode3.addUIEvent('click');}).post();},100);}module.exports=personalCenter;},{"Ajax":63,"App":64,"IconItem":67,"famous/core/CrossCall":9,"famous/core/Node":13,"famous/dom-renderables/DOMElement":21,"model/myInfoModel":83,"model/signModel":84}],101:[function(require,module,exports){var Page=require('Page');var Node=require('famous/core/Node');var DOMElement=require('famous/dom-renderables/DOMElement');var navbar=require('navbar');var ListView=require('ListView');var Blank=require('blank');var Ajax=require('Ajax');var App=require('App');var sign=require('model/SignModel');var Notice=function(_Page10){_inherits(Notice,_Page10);function Notice(){_classCallCheck(this,Notice);return _possibleConstructorReturn(this,Object.getPrototypeOf(Notice).call(this,{id:'Notice'}));}_createClass(Notice,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(Notice.prototype),"onCreate",this).call(this);initNav(this);var userSign=sign.findOne();this.userId=userSign.id;this.token=userSign.token;}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(Notice.prototype),"onResume",this).call(this);if(!this._content){new Ajax('/message_info/lists_user').data({'type':1,'id':this.userId,'did':App.uuid,'tk':this.token}).success(function(d){this.listjson=d.data;initContent(this,this.listjson);}.bind(this)).post();}}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(Notice.prototype),"onDestroy",this).call(this);this._content=null;}},{key:"onReceive",value:function onReceive(e,p){if(e==='click'&&p.node.clickType==='detail'){this.to('noticeDetail',{'data':p.node.noticeData});}//TODO 删除 ?
// if(e === 'click' && p.node.clickType === 'del'){
// alert('删除:'+p.node.listId);
// this.listjson.splice(p.node._index,1);
// this._content.removeChild(p.node.getParent());
// this._content.getChildren().forEach(function(n,i){
// 	n.setPosition(0,i*65 + 8*(i+1))
// })
// this.allList.RemoveItem(p.node.obj._id);
// if(!this.allList._domList.length){
// 	this._content.el.setContent('由于你的手贱而导致没有公告信息！！').setProperty('font-size','15px');
// }
// console.log(this.allList);
// console.log(p.node.obj);
// }
p.stopPropagation();}}]);return Notice;}(Page);//导航
function initNav(node){node.addChild(new navbar('市场公告'));}//内容
function initContent(node,data){var content=node.addChild();content.setSizeMode('relative','relative').setDifferentialSize(0,-44).setPosition(0,44).el=new DOMElement(content,{classes:['notice_box','overflow_scoll']});node._content=content;if(data===null){content.addChild(new Blank('notice'));return false;}node.allList=new ListView({threshold:6,//预加载数 单位个（请根据item 高度适当调整）
throttle:16.7,//单位毫秒 控制Scroll执行频率
itemSize:[null,73],//item  尺寸
createItem:function createItem(data,obj){var noticelist=new NoticeList(data,obj);return noticelist;}});node.allList.BindData(data);content.addChild(node.allList);}var NoticeList=function(_Node8){_inherits(NoticeList,_Node8);function NoticeList(data,obj){_classCallCheck(this,NoticeList);var _this19=_possibleConstructorReturn(this,Object.getPrototypeOf(NoticeList).call(this));var list=_this19.addChild();var del=list.addChild();//列表节点设置
list.setSizeMode('relative','absolute').setAbsoluteSize(null,65)// .setPosition(0,8)
.el=new DOMElement(list,{classes:['notice_list'],content:"<p>"+data.InfoTitle+"</p><span>"+data.InfoCtime+"</span>"}).setProperty('border-top','8px solid #efefef');list.noticeData=data;//删除节点设置
// del.setSizeMode('absolute','absolute')
//   .setAbsoluteSize(40,65)
//   .setAlign(1)
//   .setMountPoint(1)
//   .setPosition(-16)
//   .el = new DOMElement(del,{
//   	content:'<i class="del_ico"></i>'
//   })
// 添加事件 
list.addUIEvent('click');list.listId=data.Id;list.clickType='detail';// del.addUIEvent('click');
// del.listId = data.id;
// del.obj = obj;
// del.clickType = 'del';
return _this19;}return NoticeList;}(Node);module.exports=Notice;},{"Ajax":63,"App":64,"ListView":69,"Page":70,"blank":74,"famous/core/Node":13,"famous/dom-renderables/DOMElement":21,"model/SignModel":79,"navbar":85}],102:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var Nav=require('navbar');var config=require('config.json');var NoticeDetail=function(_Page11){_inherits(NoticeDetail,_Page11);function NoticeDetail(opt){_classCallCheck(this,NoticeDetail);return _possibleConstructorReturn(this,Object.getPrototypeOf(NoticeDetail).call(this,{id:'NoticeDetail'}));}_createClass(NoticeDetail,[{key:"onCreate",value:function onCreate(opt){_get(Object.getPrototypeOf(NoticeDetail.prototype),"onCreate",this).call(this);this.opt=opt;this.type=this.opt?this.opt.InfoType:1;switch(this.type){case 1:this.title='市场公告';break;case 2:this.title='系统消息';break;case 3:this.title='通知';break;default:this.title='市场公告';break;}initNav(this,this.title);}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(NoticeDetail.prototype),"onResume",this).call(this);if(!this._content){initContent(this,this.opt);}}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(NoticeDetail.prototype),"onDestroy",this).call(this);this._content=null;}}]);return NoticeDetail;}(Page);function initNav(node){node.addChild(new Nav(node.title));}function initContent(node,obj){var content=node.addChild();node._content=content;if(obj==null){return;}obj.InfoDesc=obj.InfoDesc.replace(/src="\//g,'src="'+config.noticehttp);var DetailStr="<div class=\"notice_header\">\n\t\t\t\t\t\t<h2>"+obj.InfoTitle+"</h2>\n\t\t\t\t\t\t<time>"+obj.InfoCtime+"</time>\n\t\t\t\t\t</div>\t\t\t\t\t\n\t\t\t\t\t<div class=\"notice_con\">"+obj.InfoDesc+"</div>\n\t\t\t\t\t<div class=\"notice_footer\">\n\t\t\t\t\t\t<p>"+obj.InfoAuthor+"</p>\n\t\t\t\t\t\t<time>"+obj.InfoCtime+"</time>\n\t\t\t\t\t</div>";content.setSizeMode('relative','relative').setDifferentialSize(0,-44).setPosition(0,44).el=new DOMElement(content,{classes:['notice_bg','overflow_scoll'],content:DetailStr});}module.exports=NoticeDetail;},{"Page":70,"config.json":76,"famous/dom-renderables/DOMElement":21,"navbar":85}],103:[function(require,module,exports){/**
 * Created by UMZS on 2016/7/18.
 */var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var App=require('App');var navbar=require('twoBtnNav');var button=require('button');var Ajax=require('Ajax');var sign=require('model/SignModel');var orderPage=function(_Page12){_inherits(orderPage,_Page12);function orderPage(){_classCallCheck(this,orderPage);return _possibleConstructorReturn(this,Object.getPrototypeOf(orderPage).call(this,{id:'orderPage'}));}_createClass(orderPage,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(orderPage.prototype),"onCreate",this).call(this);initNav(this);var userSign=sign.findOne();this.userId=userSign.id;this.token=userSign.token;//状态
new Ajax('/cater_fast/status').data({'id':this.userId,'did':App.uuid,'tk':this.token}).success(function(d){if(d.status===200){this.caterStatus=d.data-0;}}.bind(this)).post();//    价格
new Ajax('cater_fast/price').data({'id':this.userId,'did':App.uuid,'tk':this.token}).success(function(d){if(d.status===200){this.caterPrice=d.data;}}.bind(this)).post();//商家地址
new Ajax('user_store/list_id').data({'id':this.userId,'did':App.uuid,'tk':this.token}).success(function(d){if(d.status===200){this.userShop=d.data;}}.bind(this)).post();//    服务提醒
new Ajax('cater_fast/remark').data({'id':this.userId,'did':App.uuid,'tk':this.token}).success(function(d){if(d.status===200){this.caterRemark=d.data;}}.bind(this)).post();}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(orderPage.prototype),"onResume",this).call(this);if(!this._con){initContent(this,this.caterStatus,this.caterPrice,this.userShop,this.caterRemark);}}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(orderPage.prototype),"onDestroy",this).call(this);this._con=null;}}]);return orderPage;}(Page);//头部
function initNav(node){var _this=node;var backButton=new button(" ","","goback2");// backButton.setAbsoluteSize(44,44);
backButton.clickEvent=function(){node.back();};var rightText=new button('订餐记录','','right_text');rightText.setAbsoluteSize(100,44);rightText.clickEvent=function(){_this.to('orderRecord');};node.addChild(new navbar('订餐',backButton,rightText));}//内容
function either(node,data,shop,remind_txt){var _this=node;var con=node.addChild();node._con=con;_this.imgH=120/694*(App.width-28);var conJ=44+7+_this.imgH+7;//shop = null;
//data = null;
if(data==null){data=13;}if(shop==null){shop=[];}var shopData=shop;var shopStr='';for(var i=0;i<shopData.length;i++){shopStr+='<option value="'+shopData[i].id+'"">'+shopData[i].name+'</option>';}var imgBox=_this.addChild();imgBox.setSizeMode('relative','absolute').setAbsoluteSize(null,_this.imgH).setPosition(0,44+7).setDifferentialSize(-28).setAlign(.5).setMountPoint(.5).el=new DOMElement(imgBox,{classes:['img_box'],content:'<p><span class="title">套餐盒饭</span><span class="price">'+data+'元/份</span></p><img width="100%" src="./images/orderPage/orderPage-bg.png"/>'});con.setSizeMode('relative','absolute').setAbsoluteSize(null,75*3).setDifferentialSize(-28,-conJ).setPosition(0,conJ).setAlign(.5).setMountPoint(.5).el=new DOMElement(con,{classes:['con'],content:'<div class="dic"><div class="bor"><span>请选择份数</span></div>'+'<div class="bor"><span>总价</span></div>'+'<div class="bor"><span>送餐地点</span><em class="side"><img src="images/common/r_arrow_ico.png" alt=""/></em></div></div>'});var count=con.addChild();count.setSizeMode('absolute','absolute').setAbsoluteSize(100,75).setPosition(-10,0).setAlign(1).setMountPoint(1).el=new DOMElement(count,{});var reduce=count.addChild();reduce.setSizeMode('absolute','absolute').setAbsoluteSize(25,25).setAlign(0,.5).setMountPoint(0,.5).el=new DOMElement(reduce,{content:'<img width="25px" src="images/orderPage/reduce.png">'});var nm=1;reduce.onReceive=function(e,p){if(e==='click'){if(nm==0){return;}nm--;num.el.setContent(nm);twelve.el.setContent('￥'+nm*data);}};reduce.addUIEvent('click');//份数
var num=count.addChild();num.setSizeMode('absolute','absolute').setAbsoluteSize(15,15).setAlign(.5,.5).setMountPoint(.5,.5).el=new DOMElement(num,{classes:['num'],content:nm});var add=count.addChild();add.setSizeMode('absolute','absolute').setAbsoluteSize(25,25).setAlign(1,.5).setMountPoint(1,.5).el=new DOMElement(add,{content:'<img width="25px" src="images/orderPage/add.png">'});add.onReceive=function(e,p){if(e==='click'){nm++;num.el.setContent(nm);twelve.el.setContent('￥'+nm*data);}};add.addUIEvent('click');//价格
var twelve=con.addChild();twelve.setSizeMode('absolute','absolute').setAbsoluteSize(100,75).setPosition(-10,75).setAlign(1).setMountPoint(1).el=new DOMElement(twelve,{classes:['twelve'],content:'￥'+data});var address=con.addChild();address.setSizeMode('relative','absolute').setAbsoluteSize(null,75).setDifferentialSize(-60).setPosition(70,75*2).el=new DOMElement(address,{classes:['address'],content:'<select><option value="-1">请选择店铺地址</option>'+shopStr+'</select>'});var add_id='';address.onReceive=function(e,p){if(e==='change'){add_id=p.value;}};address.addUIEvent('change');var btn=node.addChild();btn.setSizeMode('absolute','absolute').setAbsoluteSize(272,42).setPosition(0,44+7+_this.imgH+75*3+45+7).setAlign(.5).setMountPoint(.5).el=new DOMElement(btn,{classes:['btn'],content:'立即订餐'});//立即订餐点击事件
btn.onReceive=function(e,p){if(e==='click'){if(nm==0){alert('请选择份数','','提示信息','确定');}else if(add_id==''){alert('请选择送餐地点','','提示信息','确定');}else{new Ajax('cater_fast/apply').data({'sid':add_id,'num':nm,'id':_this.userId,'did':App.uuid,'tk':_this.token}).success(function(d){if(d.status===200){alert('你的订餐信息已收到，将在12点左右送到，请耐心等待',function(){_this.to('orderRecord');add_id='';nm=1;num.el.setContent(nm);address.el.setContent('<select><option value="-1">请选择店铺地址</option>'+shopStr+'</select>');},'提示信息','确定');}else{alert(d.msg,'','提示信息','确定');}}.bind(_this)).post();}}};btn.addUIEvent('click');var remindData=remind_txt;var remindStr='';var remind=node.addChild();if(remindData==null){remindData=['点餐时间：每日上午09:00-10:30','订餐记录页可取消订单，10:30后无法取消','一张餐券可兑换一份盒饭，请在结账时出示餐券'];}for(var i=0;i<remindData.length;i++){remindStr+='<p><em>•</em>'+remindData[i]+'</p>';}remind.setSizeMode('relative','absolute').setAbsoluteSize(null,App.width*308/750).setAlign(1,1).setMountPoint(1,1).el=new DOMElement(remind,{classes:['remind'],content:'<h2><i></i>服务提醒</h2>'+remindStr});}//判断状态
function initContent(node,flag,price,shop,remind_txt){//判断是否可以订餐
if(flag===1){var _this=node;var eggplant=_this.addChild();eggplant.setSizeMode('relative','absolute').setAbsoluteSize(null,App.width*594/726).setProportionalSize(.8).setAlign(.5,.5).setMountPoint(.5,.5).el=new DOMElement(eggplant,{classes:['eggplant'],content:'<img class="egg" width="100%" src="images/blank/eggplant.png">'});var mask=_this.addChild();mask.setPosition(0,44).el=new DOMElement(mask,{classes:['mask']});}either(node,price,shop,remind_txt);}module.exports=orderPage;},{"Ajax":63,"App":64,"Page":70,"button":75,"famous/dom-renderables/DOMElement":21,"model/SignModel":79,"twoBtnNav":87}],104:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var Nav=require('navbar');var Blank=require('blank');var Ajax=require('Ajax');var App=require('App');var sign=require('model/SignModel');var AdRecord=function(_Page13){_inherits(AdRecord,_Page13);function AdRecord(){_classCallCheck(this,AdRecord);return _possibleConstructorReturn(this,Object.getPrototypeOf(AdRecord).call(this,{id:'Record'}));}_createClass(AdRecord,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(AdRecord.prototype),"onCreate",this).call(this);var userSign=sign.findOne();new Ajax('/advert_apply/lists_user').data({'id':userSign.id,'did':App.uuid,'tk':userSign.token}).success(function(d){if(d.status===200){this.data=d.data;}}.bind(this)).post();initNav(this);}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(AdRecord.prototype),"onResume",this).call(this);// var data = null;
initListCon(this,this.data);}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(AdRecord.prototype),"onDestroy",this).call(this);// this._content = null;
}}]);return AdRecord;}(Page);function initNav(node){node.addChild(new Nav('广告位申请记录'));}function initListCon(node,data){var content=node.addChild();if(data==null){content.addChild(new Blank('apply'));return false;}var recordStr='';for(var i=0;i<data.length;i++){recordStr+="<div class=\"record_list\"><i class=\"record_status status_"+data[i].status+"\"></i><table border=\"1\">\n\t\t\t\t\t\t<tr><td class=\"title\">店铺地址</td><td>"+data[i].store+"</td></tr>\n\t\t\t\t\t\t<tr><td class=\"title\">广告位编号</td><td>"+data[i].adposition+"</td></tr>\n\t\t\t\t\t\t<tr><td class=\"title\">广告性质</td><td>"+data[i].adtype+"</td></tr>\n\t\t\t\t\t\t<tr><td class=\"title\">申请时间</td><td>"+data[i].ctime+"</td></tr>\n\t\t\t\t\t</table></div>";}content.setSizeMode('relative','relative').setDifferentialSize(0,-(44+8)).setPosition(0,44).el=new DOMElement(content,{classes:['con','overflow_scoll'],content:recordStr});}module.exports=AdRecord;},{"Ajax":63,"App":64,"Page":70,"blank":74,"famous/dom-renderables/DOMElement":21,"model/SignModel":79,"navbar":85}],105:[function(require,module,exports){/**
 * Created by UMZS on 2016/8/4.
 */var Page=require('Page');var Node=require('famous/core/Node');var nav=require('navbar');var Blank=require('../../node_modules/blank.js');var Ajax=require('Ajax');var businessRecord=function(_Page14){_inherits(businessRecord,_Page14);function businessRecord(){_classCallCheck(this,businessRecord);return _possibleConstructorReturn(this,Object.getPrototypeOf(businessRecord).call(this,{id:'businessRecord'}));}_createClass(businessRecord,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(businessRecord.prototype),"onCreate",this).call(this);initNav(this);}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(businessRecord.prototype),"onResume",this).call(this);initContent(this);}},{key:"onDestroy",value:function onDestroy(){var cor=this.getChildren(),len=cor.length;while(len--){this.removeChild(cor[len]);}//this._content = null;
_get(Object.getPrototypeOf(businessRecord.prototype),"onDestroy",this).call(this);}}]);return businessRecord;}(Page);function initNav(node){node.addChild(new nav('商家生涯'));}function initContent(node){node.addChild(new Blank('business'));}module.exports=businessRecord;},{"../../node_modules/blank.js":74,"Ajax":63,"Page":70,"famous/core/Node":13,"navbar":85}],106:[function(require,module,exports){/**
 * Created by UMZS on 2016/7/21.
 */var Page=require('Page');var Node=require('famous/core/Node');var DOMElement=require('famous/dom-renderables/DOMElement');var App=require('App');var nav=require('navbar');var ListView=require('ListView');var Blank=require('../../node_modules/blank.js');var Ajax=require('Ajax');var sign=require('model/SignModel.js');var orderRecord=function(_Page15){_inherits(orderRecord,_Page15);function orderRecord(){_classCallCheck(this,orderRecord);return _possibleConstructorReturn(this,Object.getPrototypeOf(orderRecord).call(this,{id:'orderRecord'}));}_createClass(orderRecord,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(orderRecord.prototype),"onCreate",this).call(this);initNav(this);var userSign=sign.findOne();this.userId=userSign.id;this.token=userSign.token;//快餐订购所有信息
new Ajax('cater_fast/lists_user').data({'id':this.userId,'did':App.uuid,'tk':this.token}).success(function(d){if(d.status===200){this.caterLists_user=d.data;}}.bind(this)).post();}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(orderRecord.prototype),"onResume",this).call(this);if(!this._content){initContent(this,this.caterLists_user);}}},{key:"onDestroy",value:function onDestroy(){var cor=this.getChildren(),len=cor.length;while(len--){this.removeChild(cor[len]);}this._content=null;_get(Object.getPrototypeOf(orderRecord.prototype),"onDestroy",this).call(this);}},{key:"onReceive",value:function onReceive(e,p){if(e==='click'&&p.node.btnId==='cancel'){confirm('确认取消订单吗？',function(index){if(index===1){new Ajax('cater_fast/cancel').data({'fid':p.node.orderId,'id':this.userId,'did':App.uuid,'tk':this.token}).success(function(d){if(d.status===200){p.node.el.setContent('已取消');p.node.el.removeClass('cancel');alert('你已成功取消','','提示信息','确定');}else{alert('超出规定时间，无法取消','','提示信息','确定');}}).post();}}.bind(this),'提示信息',['确定','取消']);}p.stopPropagation();}}]);return orderRecord;}(Page);function initNav(node){node.addChild(new nav('订餐记录'));}function initContent(node,data){var content=node.addChild();content.setSizeMode('relative','relative').setDifferentialSize(0,-44).setPosition(0,44).el=new DOMElement(content,{classes:['overflow_scoll']});node._content=content;if(data===null){node.addChild(new Blank('order'));}else{node.allList=new ListView({threshold:7,//预加载数 单位个（请根据item 高度适当调整）
throttle:16.7,//单位毫秒 控制Scroll执行频率
itemSize:[null,108],//item  尺寸
createItem:function createItem(data,obj){var recordlist=new RecordList(data,obj);return recordlist;}});node.allList.BindData(data);content.addChild(node.allList);}}var RecordList=function(_Node9){_inherits(RecordList,_Node9);function RecordList(data,obj){_classCallCheck(this,RecordList);var _this25=_possibleConstructorReturn(this,Object.getPrototypeOf(RecordList).call(this));var list=_this25.addChild();var statusTxt='';list.setSizeMode('relative','absolute').setAbsoluteSize(null,101).el=new DOMElement(list,{classes:['con'],content:'<div class="title"><span>套餐盒饭</span></div>'+'<div class="time"><span>下单时间：'+data.time+'</span></div>'+'<div class="count"><span>'+data.num+'份</span> <em>￥'+data.money+'</em></div>'});var num=data.status;switch(num){case 0:statusTxt='正在进行，点击可取消';break;case 1:statusTxt='已完成';break;case 2:statusTxt='已取消';break;}var cancel=list.addChild();cancel.setSizeMode('absolute','absolute').setAbsoluteSize(App.width*200/326,'60').setAlign(1).setMountPoint(1).el=new DOMElement(cancel,{classes:['statusTxt'],content:statusTxt});cancel.btnId='cancel';cancel.orderId=data.id;num===0&&cancel.el.addClass('cancel')&&cancel.addUIEvent('click');return _this25;}return RecordList;}(Node);module.exports=orderRecord;},{"../../node_modules/blank.js":74,"Ajax":63,"App":64,"ListView":69,"Page":70,"famous/core/Node":13,"famous/dom-renderables/DOMElement":21,"model/SignModel.js":79,"navbar":85}],107:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var navbar=require('navbar');var blank=require('blank');var App=require('App');var Ajax=require('Ajax');var signModel=require('model/signModel');var record_hall=function(_Page16){_inherits(record_hall,_Page16);function record_hall(){_classCallCheck(this,record_hall);return _possibleConstructorReturn(this,Object.getPrototypeOf(record_hall).call(this,{id:'record_hall'}));}_createClass(record_hall,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(record_hall.prototype),"onCreate",this).call(this);this.addChild(new navbar('大厅申请记录'));this.content=this.addChild();this.content.setDifferentialSize(-30,-70).setPosition(15,60);this.content.el=new DOMElement(this.content,{classes:['overflow_auto']});initPage(this.content);}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(record_hall.prototype),"onResume",this).call(this);}},{key:"onDestroy",value:function onDestroy(){var obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(record_hall.prototype),"onDestroy",this).call(this);}}]);return record_hall;}(Page);function initPage(nodeAll){new Ajax('/hall_apply/lists_user').data({'id':signModel.findOne().id,'did':App.uuid,'tk':signModel.findOne().token}).success(function(res){var list=res.data;if(list==null){nodeAll.addChild(new blank('apply'));}else{var len=list.length,str='';for(var i=0;i<len;i++){str+="\n\t\t\t\t\t<div class=\"table_div\">\n\t\t\t\t\t <img src=\"images/record/status_"+list[i].status+".png\">\t\n\t\t\t\t\t <table>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td>大厅编号</td>\n\t\t\t\t\t\t\t<td>"+list[i].store+"</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td rowspan=\"2\">申请面积/㎡</td>\n\t\t\t\t\t\t\t<td>底层面积"+list[i].size+"</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td style=\"background:#fff;color:#666;\">二楼夹层面积"+list[i].size+"</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td>租赁周期/年</td>\n\t\t\t\t\t\t\t<td>"+list[i].cycle+"</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td>申请时间</td>\n\t\t\t\t\t\t\t<td>"+list[i].ctime+"</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t </table>\n\t\t\t\t  </div>\n\t\t\t\t";}nodeAll.el=new DOMElement(nodeAll,{classes:['table_hall'],content:str});}}).post();}module.exports=record_hall;},{"Ajax":63,"App":64,"Page":70,"blank":74,"famous/dom-renderables/DOMElement":21,"model/signModel":84,"navbar":85}],108:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var navbar=require('navbar');var blank=require('blank');var App=require('App');var Ajax=require('Ajax');var signModel=require('model/signModel');var record_yard=function(_Page17){_inherits(record_yard,_Page17);function record_yard(){_classCallCheck(this,record_yard);return _possibleConstructorReturn(this,Object.getPrototypeOf(record_yard).call(this,{id:'record_hall'}));}_createClass(record_yard,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(record_yard.prototype),"onCreate",this).call(this);this.addChild(new navbar('堆场申请记录'));this.content=this.addChild();this.content.setDifferentialSize(-30,-70).setPosition(15,60);this.content.el=new DOMElement(this.content,{classes:['overflow_auto']});}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(record_yard.prototype),"onResume",this).call(this);initPage(this.content);}},{key:"onDestroy",value:function onDestroy(){var obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(record_yard.prototype),"onDestroy",this).call(this);}}]);return record_yard;}(Page);function initPage(nodeAll){new Ajax('/yard_apply/lists_user').data({'id':signModel.findOne().id,'did':App.uuid,'tk':signModel.findOne().token}).success(function(res){var list=res.data;if(list==null){nodeAll.addChild(new blank('apply'));}else{var len=list.length,str='';for(var i=0;i<len;i++){str+="\n\t\t\t\t\t<div class=\"table_div\">\n\t\t\t\t\t <img src=\"images/record/status_"+list[i].status+".png\">\t\n\t\t\t\t\t <table>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td>堆场编号</td>\n\t\t\t\t\t\t\t<td>"+list[i].id+"</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td>堆场面积/㎡</td>\n\t\t\t\t\t\t\t<td>"+list[i].size+"</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td>入场时间</td>\n\t\t\t\t\t\t\t<td>"+list[i].ctime+"</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td>退场时间</td>\n\t\t\t\t\t\t\t<td>"+list[i].etime+"</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td>申请时间</td>\n\t\t\t\t\t\t\t<td>"+list[i].stime+"</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t </table>\n\t\t\t\t  </div>\n\t\t\t\t";}nodeAll.el=new DOMElement(nodeAll,{classes:['table_hall'],content:str});}}).post();}module.exports=record_yard;},{"Ajax":63,"App":64,"Page":70,"blank":74,"famous/dom-renderables/DOMElement":21,"model/signModel":84,"navbar":85}],109:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var Nav=require('navbar');var Blank=require('blank');var App=require('App');var sign=require('model/SignModel');var Ajax=require('Ajax');var RepairRecord=function(_Page18){_inherits(RepairRecord,_Page18);function RepairRecord(){_classCallCheck(this,RepairRecord);return _possibleConstructorReturn(this,Object.getPrototypeOf(RepairRecord).call(this,{id:'Record'}));}_createClass(RepairRecord,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(RepairRecord.prototype),"onCreate",this).call(this);initNav(this);}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(RepairRecord.prototype),"onResume",this).call(this);var userSign=sign.findOne();new Ajax('/property_repair/lists_user').data({'id':userSign.id,'did':App.uuid,'tk':userSign.token}).success(function(d){if(d.status===200){this.data=d.data;initListCon(this,this.data);}}.bind(this)).post();}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(RepairRecord.prototype),"onDestroy",this).call(this);// this._content = null;
}}]);return RepairRecord;}(Page);function initNav(node){node.addChild(new Nav('报修记录'));}function initListCon(node,data){var content=node.addChild();if(data===null){content.addChild(new Blank('apply'));return;}var recordStr='';for(var i=0;i<data.length;i++){recordStr+="<div class=\"record_list\"><i class=\"record_status status_"+data[i].status+"\"></i><table border=\"1\">"+("<tr><td class=\"title\">报修时间</td><td>"+data[i].ctime+"</td></tr>")+("<tr><td class=\"title\">联系号码</td><td>"+data[i].phone+"</td></tr>")+("<tr><td class=\"title\">报修地址</td><td>"+data[i].store+"</td></tr>")+("<tr><td class=\"title\">问题描述</td><td>"+data[i].desc+"</td></tr>")+"</table></div>";}content.setSizeMode('relative','relative').setDifferentialSize(0,-(44+8)).setPosition(0,44).el=new DOMElement(content,{classes:['con','overflow_scoll'],content:recordStr});}module.exports=RepairRecord;},{"Ajax":63,"App":64,"Page":70,"blank":74,"famous/dom-renderables/DOMElement":21,"model/SignModel":79,"navbar":85}],110:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var Navbar=require('navbar');var IconText=require('IconText');var Tips=require('Tips');var Card=function(_Page19){_inherits(Card,_Page19);function Card(){_classCallCheck(this,Card);return _possibleConstructorReturn(this,Object.getPrototypeOf(Card).call(this,{id:'Card'}));}_createClass(Card,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(Card.prototype),"onCreate",this).call(this);initNav(this);}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(Card.prototype),"onResume",this).call(this);initContent(this);}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(Card.prototype),"onDestroy",this).call(this);// this._content = null;
}},{key:"onReceive",value:function onReceive(e,p){if(e==='click'&&p.node.listId==='type0'){alert('物业未欠费','','提示信息','确定');}if(e==='click'&&p.node.listId==='type1'){alert('停车未欠费','','提示信息','确定');}if(e==='click'&&p.node.listId==='type2'){alert('餐饮未欠费','','提示信息','确定');}p.stopPropagation();}}]);return Card;}(Page);function initNav(node){node.addChild(new Navbar('一卡通'));}//内容
function initContent(node){var content=node.addChild();content.setSizeMode('relative','absolute').setDifferentialSize(0,-44).setPosition(0,44);var IconJson=[{'icon':'./images/service/wuye.png','text':'物业费'},{'icon':'./images/service/tingche.png','text':'停车费'},{'icon':'./images/service/canyin.png','text':'餐饮费'}];for(var i=0;i<IconJson.length;i++){//实例化icon文字图标
var CardType=new IconText(IconJson[i],i,3,85,33,'ico_box');CardType.listId='type'+i;CardType.addUIEvent('click');content.addChild(CardType);}}module.exports=Card;},{"IconText":68,"Page":70,"Tips":73,"famous/dom-renderables/DOMElement":21,"navbar":85}],111:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var Navbar=require('navbar');var IconText=require('IconText');var Ajax=require('Ajax');var App=require('App');var sign=require('model/SignModel');var ServiceIndex=function(_Page20){_inherits(ServiceIndex,_Page20);function ServiceIndex(){_classCallCheck(this,ServiceIndex);return _possibleConstructorReturn(this,Object.getPrototypeOf(ServiceIndex).call(this,{id:'ServiceIndex'}));}_createClass(ServiceIndex,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(ServiceIndex.prototype),"onCreate",this).call(this);initNav(this);var userSign=sign.findOne();new Ajax('/user_store/list_id').data({'id':userSign.id,'did':App.uuid,'tk':userSign.token}).success(function(d){if(d.status===200){this.shopData=d.data;this.shopLen=this.shopData.length;}}.bind(this)).post();}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(ServiceIndex.prototype),"onResume",this).call(this);if(!this._content){initContent(this);}}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(ServiceIndex.prototype),"onDestroy",this).call(this);this._content=null;}},{key:"onReceive",value:function onReceive(e,p){if(e==='click'&&p.node.listId==='type0'){//广告位大厅
if(this.shopLen===1){this.to('adApply',{data:this.shopData[0].id});p.stopPropagation();return false;}this.to('shopChoose',{data:1});}if(e==='click'&&p.node.listId==='type1'){//堆场
if(this.shopLen===1){this.to('apply_yard',{data:this.shopData[0].id});p.stopPropagation();return false;}this.to('shopChoose',{data:2});}if(e==='click'&&p.node.listId==='type2'){//大厅
if(this.shopLen===1){this.to('apply_hall',{data:this.shopData[0].id});p.stopPropagation();return false;}this.to('shopChoose',{data:3});}if(e==='click'&&p.node.listId==='type3'){this.to('orderPage');}if(e==='click'&&p.node.listId==='type4'){this.to('licence');}if(e==='click'&&p.node.listId==='type5'){this.to('apply_wl');}p.stopPropagation();}}]);return ServiceIndex;}(Page);//导航
function initNav(node){node.addChild(new Navbar('便民服务'));}//内容
function initContent(node){var content=node.addChild();content.setSizeMode('relative','absolute').setDifferentialSize(0,-44).setPosition(0,44);node._content=content;var IconJson=[{'icon':'./images/service/guanggao.png','text':'广告位申请'},{'icon':'./images/service/duichang.png','text':'堆场申请'},{'icon':'./images/service/dating.png','text':'大厅申请'},{'icon':'./images/service/dingcan.png','text':'订餐'},{'icon':'./images/service/zhizhao.png','text':'营业执照办理指南'},{'icon':'./images/service/banjia.png','text':'物流信息'}];for(var i=0;i<IconJson.length;i++){//实例化icon文字图标
var ServeType=new IconText(IconJson[i],i,3,85,51,'ico_box');ServeType.listId='type'+i;ServeType.addUIEvent('click');content.addChild(ServeType);}}module.exports=ServiceIndex;},{"Ajax":63,"App":64,"IconText":68,"Page":70,"famous/dom-renderables/DOMElement":21,"model/SignModel":79,"navbar":85}],112:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var Nav=require('navbar');var App=require('App');var Licence=function(_Page21){_inherits(Licence,_Page21);function Licence(){_classCallCheck(this,Licence);return _possibleConstructorReturn(this,Object.getPrototypeOf(Licence).call(this,{id:'Licence'}));}_createClass(Licence,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(Licence.prototype),"onCreate",this).call(this);initPage(this);}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(Licence.prototype),"onDestroy",this).call(this);// this._content = null;
}}]);return Licence;}(Page);function initPage(node){node.addChild(new Nav('营业执照办理指南'));var con=node.addChild();con.setSizeMode('relative','relative').setDifferentialSize(0,-44).setPosition(0,44).el=new DOMElement(con,{classes:['img_con','overflow_scoll'],content:function(){var str='';var imgW=App.width-28;var imgSrc='./images/service/step_';for(var i=1;i<5;i++){str+="<img width=\""+imgW+"\" style=\"margin-top:34px;\" src = \""+imgSrc+i+".png\"/>";}str+="<img width=\""+App.width+"\" style=\"margin-top:34px;\" src = \""+imgSrc+"5.png\"/>";return str;}(),properties:{'fontSize':'0','textAlign':'center'}});}module.exports=Licence;},{"App":64,"Page":70,"famous/dom-renderables/DOMElement":21,"navbar":85}],113:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var navbar=require('twoBtnNav');var button=require('button');var inputCustom=require('inputCustom');var App=require('App');var Ajax=require('Ajax');var sign=require('model/SignModel');var datetime='',mobile='',adds='',desc='';var Repair=function(_Page22){_inherits(Repair,_Page22);function Repair(){_classCallCheck(this,Repair);return _possibleConstructorReturn(this,Object.getPrototypeOf(Repair).call(this,{id:'Repair'}));}_createClass(Repair,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(Repair.prototype),"onCreate",this).call(this);initNav(this);var userSign=sign.findOne();new Ajax('/user_store/list_id').data({'id':userSign.id,'did':App.uuid,'tk':userSign.token}).success(function(d){if(d.status===200){this.shopData=d.data;}else{this.shopData=null;}}.bind(this)).post();}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(Repair.prototype),"onResume",this).call(this);if(!this._content){initContent(this,this.shopData);}}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(Repair.prototype),"onDestroy",this).call(this);this._content=null;}},{key:"clean",value:function clean(){this.telInput.el.setAttribute('value','').draw();this.descTextarea.el.setAttribute('value','').draw();}}]);return Repair;}(Page);function initNav(node){var backButton=new button(" ","","goback2");var _this=node;// backButton.setAbsoluteSize(44,44);
backButton.clickEvent=function(){_this.clean();_this.back();};var rightText=new button('报修记录','','right_text');rightText.setAbsoluteSize(100,44);rightText.clickEvent=function(){_this.to('repairRecord');};node.addChild(new navbar('在线报修',backButton,rightText));}function getNowDate(){var date=new Date();var year=date.getFullYear(),mon=('0'+(date.getMonth()+1)).substr(-2),day=('0'+date.getDate()).substr(-2),hour=('0'+date.getHours()).substr(-2),min=('0'+date.getMinutes()).substr(-2),sec=('0'+date.getSeconds()).substr(-2);return year+'-'+mon+'-'+day+'T'+hour+':'+min+':'+sec;}function initContent(node,data){var _this=node;var shopJson=data;var content=node.addChild();content.setSizeMode('relative','relative').setDifferentialSize(0,-44).setPosition(0,44).el=new DOMElement(content,{classes:['repair_con']});node._content=content;var form=content.addChild();var form_item="<ul>\n\t\t\t\t\t\t<li class=\"date\"><span>报修时间</span></li>\n\t\t\t\t\t\t<li class=\"tel\"><span>联系号码</span></li>\n\t\t\t\t\t\t<li class=\"adds\"><span>报修地址</span></li>\n\t\t\t\t\t\t<li class=\"desc\"><span>问题描述</span></li>\n\t\t\t\t    </ul>";form.setSizeMode('relative','absolute').setAbsoluteSize(null,414).setDifferentialSize(-28).setAlign(.5).setMountPoint(.5).setPosition(0,16).el=new DOMElement(form,{classes:['repair_form'],content:form_item});var dateInput=new inputCustom();datetime=getNowDate();// console.log(nowTime);
dateInput.setSizeMode('relative','absolute').setAbsoluteSize(null,60).setDifferentialSize(-120).setPosition(120).el.setProperty('line-height','60px').setAttribute('value',datetime)// .setAttribute('min', nowTime)
.setAttribute('type','datetime-local').setAttribute('readonly','readonly');// dateInput.addUIEvent('change')
// dateInput.onReceive = function(e,p){
// 		if(e === 'change'){
// 			datetime = p.value;
// 		}
// 	}
form.addChild(dateInput);_this.telInput=new inputCustom();_this.telInput.setSizeMode('relative','absolute').setAbsoluteSize(null,60).setDifferentialSize(-120).setPosition(120,60).el.setAttribute('type','tel').setAttribute('placeholder','请填写手机号码').setAttribute('maxlength','11');_this.telInput.inputEvent=function(e,p){if(e==='input'){mobile=p.value;}};form.addChild(_this.telInput);var addsSelect=form.addChild();addsSelect.setSizeMode('relative','absolute').setAbsoluteSize(null,60).setDifferentialSize(-120).setPosition(120,120).el=new DOMElement(addsSelect,{classes:['adds_select'],content:function(){var str="<select>";// console.log(shopJson);
if(shopJson){shopJson.forEach(function(v){str+="<option value=\""+v.id+"\">"+v.name+"</option>";});adds=shopJson[0].id;}return str+"</select>";}()});addsSelect.addUIEvent('change');addsSelect.onReceive=function(e,p){if(e==='change'){adds=p.value;}};_this.descTextarea=form.addChild();_this.descTextarea.setSizeMode('relative','absolute').setAbsoluteSize(null,150).setDifferentialSize(-46).setPosition(34,230).el=new DOMElement(_this.descTextarea,{tagName:'textarea',classes:['desc_textarea']}).setAttribute('placeholder','请描述下您遇到的问题');_this.descTextarea.addUIEvent('input');_this.descTextarea.onReceive=function(e,p){if(e==='input'){desc=p.value;}};var submit=new button('完成提交','#fe6a71','submit_btn');submit.setSizeMode('relative','absolute').setAbsoluteSize(null,40).setPosition(0,16+414+27).setProportionalSize(.7).setAlign(.5).setMountPoint(.5).clickEvent=function(e,p){if(e==='click'){if(!/^(\+?86 ?)?1\d{10}$/g.test(mobile)){alert('请输入正确手机号码','','提示信息','确定');return false;}else if(!adds){alert('请选择报修店铺地址 ','','提示信息','确定');return false;}else if(!desc){alert('请填写问题描述','','提示信息','确定');return false;}else{var userSign=sign.findOne();new Ajax('/property_repair/add').data({'store':adds,'desc':desc,'id':userSign.id,'datetime':datetime.split('T')[0]+' '+datetime.split('T')[1],'phone':mobile,'did':App.uuid,'tk':userSign.token}).success(function(d){if(d.status===200){alert('提交成功',function(){_this.clean();_this.back();},'提示信息','确定');}else{alert(d.msg,'','提示信息','确定');}}).post();}}};content.addChild(submit);}module.exports=Repair;},{"Ajax":63,"App":64,"Page":70,"button":75,"famous/dom-renderables/DOMElement":21,"inputCustom":77,"model/SignModel":79,"twoBtnNav":87}],114:[function(require,module,exports){/**
 * Created by UMZS on 2016/8/1.
 */var Page=require('Page');var Node=require('famous/core/Node');var DOMElement=require('famous/dom-renderables/DOMElement');var App=require('App');var Nav=require('navbar');var IconItem=require('IconItem');var sign=require('model/SignModel');var aboutUs=function(_Page23){_inherits(aboutUs,_Page23);function aboutUs(data){_classCallCheck(this,aboutUs);var _this33=_possibleConstructorReturn(this,Object.getPrototypeOf(aboutUs).call(this,{id:'aboutUs'}));_this33._version=data?data:'V1.0.1';return _this33;}_createClass(aboutUs,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(aboutUs.prototype),"onCreate",this).call(this);initNav(this);}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(aboutUs.prototype),"onResume",this).call(this);if(!this._content){initContent(this,this._version);}}},{key:"onDestroy",value:function onDestroy(){var cor=this.getChildren(),len=cor.length;while(len--){this.removeChild(cor[len]);}_get(Object.getPrototypeOf(aboutUs.prototype),"onDestroy",this).call(this);this._content=null;}//    点击事件
},{key:"onReceive",value:function onReceive(e,p){if(e==='click'&&p.node.listId==='type0'){this.to('merchantGrade');}if(e==='click'&&p.node.listId==='type1'){this.to('companyIntro');}p.stopPropagation();}}]);return aboutUs;}(Page);//头部
function initNav(node){var navbar=new Nav('关于我们');navbar.el.addClass('red_nav');node.addChild(navbar);node._nav=navbar;}//中部
function initContent(node,version){var content=node.addChild();content.setSizeMode('relative','relative').setPosition(0,44).el=new DOMElement(content,{classes:['overflow_scoll']});node._content=content;var bgH=432/750*App.width;var headerBg=content.addChild();headerBg.setSizeMode('relative','absolute').setAbsoluteSize(null,bgH).el=new DOMElement(headerBg,{content:'<img width="100%" src = "images/setting/headerbg_01.jpg">'});var icn=headerBg.addChild();icn.setSizeMode('relative','absolute').setAbsoluteSize(null,102).setAlign(.5).setMountPoint(.5).setPosition(0,bgH/2).el=new DOMElement(icn,{classes:['icn'],content:"<p>最新版本："+version+"</p>"});var aboutJson=[{'icon':'./images/setting/level.png','desc':'会员等级'},{'icon':'./images/setting/me.png','desc':'公司介绍'}];var usBox=content.addChild();usBox.setSizeMode('relative','absolute').setAbsoluteSize(null,2*50).setPosition(0,bgH);aboutJson.forEach(function(obj,i){var about_item=new IconItem(obj,i,50);about_item.listId='type'+i;about_item.addUIEvent('click');usBox.addChild(about_item);});}//initContent end
module.exports=aboutUs;},{"App":64,"IconItem":67,"Page":70,"famous/core/Node":13,"famous/dom-renderables/DOMElement":21,"model/SignModel":79,"navbar":85}],115:[function(require,module,exports){/**
 * Created by UMZS on 2016/8/2.
 */var Page=require('Page');var Node=require('famous/core/Node');var DOMElement=require('famous/dom-renderables/DOMElement');var App=require('App');var Nav=require('navbar');var sign=require('model/SignModel.js');var companyIntro=function(_Page24){_inherits(companyIntro,_Page24);function companyIntro(){_classCallCheck(this,companyIntro);return _possibleConstructorReturn(this,Object.getPrototypeOf(companyIntro).call(this,{id:'companyIntro'}));}_createClass(companyIntro,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(companyIntro.prototype),"onCreate",this).call(this);initNav(this);}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(companyIntro.prototype),"onResume",this).call(this);if(!this._content){initContent(this);}}},{key:"onDestroy",value:function onDestroy(){var cor=this.getChildren(),len=cor.length;while(len--){this.removeChild(cor[len]);}_get(Object.getPrototypeOf(companyIntro.prototype),"onDestroy",this).call(this);this._content=null;}}]);return companyIntro;}(Page);//头部
function initNav(node){var navbar=new Nav('公司介绍');navbar.el.addClass('red_nav');node.addChild(navbar);node._nav=navbar;}//中部
function initContent(node){var content=node.addChild();content.setSizeMode('relative','relative').setPosition(0,44).el=new DOMElement(content,{classes:['overflow_scoll']});node._content=content;var bgH=324/750*App.width;var headerBg=content.addChild();headerBg.setSizeMode('relative','absolute').setAbsoluteSize(null,bgH).el=new DOMElement(headerBg,{content:'<img width="100%" src = "images/setting/headerbg_02.jpg">'});var write=content.addChild();write.setSizeMode('relative','absolute').setAbsoluteSize(null,235).setPosition(0,44+bgH).el=new DOMElement(write,{classes:['write'],content:'<h2>中益吉城五金机电</h2>'+'<p><em>•</em>中益吉城五金机电大市场是由四川中益吉城投资集团有限公司投资开发</p>'+'<p><em>•</em>位于成都市政府规划的大型五金机电市场集中发展区——青白江区城厢镇，紧邻成都铁路集装箱中心站及成都二绕金堂出口，'+'交通物流四通八达，是集五金机电产品展示交易、仓储、物流配送一体的大型五金机电专业市场。</p>'});}module.exports=companyIntro;},{"App":64,"Page":70,"famous/core/Node":13,"famous/dom-renderables/DOMElement":21,"model/SignModel.js":79,"navbar":85}],116:[function(require,module,exports){var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var Nav=require('navbar');var IconItem=require('IconItem');var App=require('App');var CrossCall=require('famous/core/CrossCall');var Tips=require('Tips');var Ajax=require('Ajax');var sign=require('model/SignModel');var versionModel=require('model/VersionModel');var Setting=function(_Page25){_inherits(Setting,_Page25);function Setting(){_classCallCheck(this,Setting);return _possibleConstructorReturn(this,Object.getPrototypeOf(Setting).call(this,{id:'Setting'}));}_createClass(Setting,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(Setting.prototype),"onCreate",this).call(this);initNav(this);}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(Setting.prototype),"onResume",this).call(this);initContent(this);}},{key:"onDestroy",value:function onDestroy(){var obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(Setting.prototype),"onDestroy",this).call(this);}},{key:"onReceive",value:function onReceive(e,p){if(e==='click'&&p.node.listId==='type0'){var version=versionModel?versionModel.findOne().version:'1.0.5';version?this.to('aboutUs',{data:version}):this.to('aboutUs');}if(e==='click'&&p.node.listId==='type1'){// console.log('update');
new CrossCall(function(){cordova.getAppVersion.getVersionNumber(function(v){self._call(v);});}).exec(function(v){checkUpdate(v);});// alert('当前已是最新版本','','提示信息','确定');
}if(e==='click'&&p.node.listId==='type2'){var userSign=sign.findOne();confirm('确认要退出登录？',function(i){if(i===1){new Ajax('/users/loginout').path({'id':userSign.id,'tk':userSign.token,'did':App.uuid}).success(function(d){alert('你已安全退出',function(){sign.update({'id':userSign.id},{'token':null});new CrossCall(function(){location.reload();}).exec();},'提示信息','确定');}).get();}},'提示信息',['确认','取消']);}p.stopPropagation();}}]);return Setting;}(Page);function initNav(node){var navbar=new Nav('设置');navbar.el.addClass('no_color_nav');node.addChild(navbar);}function initContent(node){//设置itemJson数据('android')
var SetJson=[{'icon':'./images/setting/about_us.png','desc':'关于我们','tp':'type0'},{'icon':'./images/setting/check.png','desc':'检查新版本','tp':'type1'},{'icon':'./images/setting/sign_out.png','desc':'退出登陆','tp':'type2'}];if(App.platform=='ios'){SetJson=[{'icon':'./images/setting/about_us.png','desc':'关于我们','tp':'type0'},{'icon':'./images/setting/sign_out.png','desc':'退出登陆','tp':'type2'}];}var con=node.addChild();con.setSizeMode('relative','relative').el=new DOMElement(con,{classes:['setting_con']});var headerBg=con.addChild();var bgH=0.4226666*App.width;headerBg.setSizeMode('relative','absolute').setAbsoluteSize(null,bgH).el=new DOMElement(headerBg,{tagName:'img',attributes:{'src':'./images/setting/header_bg.jpg'}});var itemBox=con.addChild();itemBox.setSizeMode('relative','absolute').setAbsoluteSize(null,3*50).setPosition(0,bgH);SetJson.forEach(function(obj,i){var setting_item=new IconItem(obj,i,50);setting_item.listId=obj.tp;setting_item.addUIEvent('click');itemBox.addChild(setting_item);});}//检测版本信息
function checkUpdate(v){new Ajax('/app_version/single').data({'did':App.uuid}).success(function(d){if(d.status===200){if(d.data){var data=d.data;// console.log(data)
var serverV=data.version.split('.')[2];var currentV=v.split('.')[2];if(currentV!==serverV){confirm('我们已发现新版本，是否先前往下载？',function(i){if(i==1){new CrossCall(function(data){window.open(data.path);},[data]).exec();}},'检查更新',['确定','取消']);}else{alert('当前版本已经是最新',null,'提示','确定');}}else{alert('当前版本已经是最新',null,'提示','确定');}}else{alert(d.msg,null,'提示','确定');}}).post();}module.exports=Setting;},{"Ajax":63,"App":64,"IconItem":67,"Page":70,"Tips":73,"famous/core/CrossCall":9,"famous/dom-renderables/DOMElement":21,"model/SignModel":79,"model/VersionModel":80,"navbar":85}],117:[function(require,module,exports){/**
 * Created by UMZS on 2016/8/5.
 */var Page=require('Page');var DOMElement=require('famous/dom-renderables/DOMElement');var Nav=require('navbar');var App=require('App');var CrossCall=require('famous/core/CrossCall');var sign=require('model/SignModel');var Ajax=require('Ajax');var merchantGrade=function(_Page26){_inherits(merchantGrade,_Page26);function merchantGrade(){_classCallCheck(this,merchantGrade);return _possibleConstructorReturn(this,Object.getPrototypeOf(merchantGrade).call(this,{id:'merchantGrade'}));}//创建
_createClass(merchantGrade,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(merchantGrade.prototype),"onCreate",this).call(this);initNav(this);this.tabList=[];var userSign=sign.findOne();this.userId=userSign.id;this.token=userSign.token;new Ajax('/grade/lists_user').data({'id':this.userId,'did':App.uuid,'tk':this.token}).success(function(d){if(d.status===200){this.listsUser=d.data.reverse();}}.bind(this)).post();}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(merchantGrade.prototype),"onResume",this).call(this);if(!this.headBg){initContent(this,this.listsUser);}}//返回
},{key:"onDestroy",value:function onDestroy(){var obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(merchantGrade.prototype),"onDestroy",this).call(this);this.headBg=null;}},{key:"onReceive",value:function onReceive(e,p){if(e==='click'&&p.node.listId==='tab'){var allChild=p.node.getParent().getChildren(),len=allChild.length;for(var i=0;i<len;i++){allChild[i].el.removeClass('tab_color');}p.node.el.addClass('tab_color');new Ajax('/grade_config/lists_id').data({'gid':p.node.gId,'id':this.userId,'did':App.uuid,'tk':this.token}).success(function(d){if(d.status===200){var liData=d.data;var htmlStr='';if(liData!=null){for(var i=0;i<liData.length;i++){htmlStr+="<li><em>"+liData[i].name+"</em><span>"+liData[i].desc+"</span></li>";}}else{htmlStr='<img src="./images/setting/levelblank.png">';}this.mes.el.setContent("<ul>"+htmlStr+"</ul>");}}.bind(this)).post();}p.stopPropagation();}}]);return merchantGrade;}(Page);//导航
function initNav(node){var navbar=new Nav('商家等级',function(){//console.log( node.tabList);
for(var i=0;i<node.tabList.length;i++){node.tabList[i].el.removeClass('tab_color');}});navbar.el.addClass('white_nav');node.addChild(navbar);}//中部内容
function initContent(node,listsUser){var _this=node;var bgSize=App.width*315/750;var headBg=_this.addChild();headBg.setSizeMode('relative','absolute').setAbsoluteSize(null,bgSize).setPosition(0,44).el=new DOMElement(headBg,{content:'<img width="100%" src="./images/setting/grade_bg.jpg">'});node.headBg=headBg;var merchant=_this.addChild();merchant.setSizeMode('relative','absolute').setAbsoluteSize(null,50).setPosition(0,44+bgSize).el=new DOMElement(merchant,{classes:['merchant']});for(var i=0;i<listsUser.length;i++){var tab=merchant.addChild();tab.setAlign(i/3).setProportionalSize(1/3).el=new DOMElement(tab,{classes:['tab'],content:'<span>'+listsUser[i].name+'</span>'});tab.addUIEvent('click');tab.listId='tab';tab.gId=listsUser[i].id;i==0&&tab.el.addClass('tab_color');_this.tabList.push(tab);}_this.mes=_this.addChild();_this.mes.setSizeMode('relative','absolute').setAbsoluteSize(null,App.height-44-bgSize-50-10).setPosition(0,44+bgSize+50+10).setAlign(.5).setMountPoint(.5).el=new DOMElement(_this.mes,{classes:['mes','overflow_scoll']});new Ajax('/grade_config/lists_id').data({'gid':1,'id':_this.userId,'did':App.uuid,'tk':_this.token}).success(function(d){if(d.status===200){var htmlStr='';var firData=d.data;if(firData!=null){for(var i=0;i<firData.length;i++){htmlStr+="<li><em>"+firData[i].name+"</em><span>"+firData[i].desc+"</span></li>";}_this.mes.el.setContent("<ul>"+htmlStr+"</ul>");}else{_this.mes.el.setContent("<img src=\"./images/setting/levelblank.png\">");}}}).post();}// initContent end
module.exports=merchantGrade;},{"Ajax":63,"App":64,"Page":70,"famous/core/CrossCall":9,"famous/dom-renderables/DOMElement":21,"model/SignModel":79,"navbar":85}],118:[function(require,module,exports){var DOMElement=require('famous/dom-renderables/DOMElement');var Page=require('Page');var Nav=require('navbar');var Button=require('button');var InputCustom=require('inputCustom');var App=require('App');var Tips=require('Tips');var Ajax=require('Ajax');var pwd='',rpwd='';var ResetPwd=function(_Page27){_inherits(ResetPwd,_Page27);function ResetPwd(data){_classCallCheck(this,ResetPwd);var _this37=_possibleConstructorReturn(this,Object.getPrototypeOf(ResetPwd).call(this,{id:'ResetPwd'}));_this37.data=data;// console.log(data);
return _this37;}_createClass(ResetPwd,[{key:"onCreate",value:function onCreate(data){_get(Object.getPrototypeOf(ResetPwd.prototype),"onCreate",this).call(this);initHeader(this);}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(ResetPwd.prototype),"onResume",this).call(this);if(!this._formCon){initForm(this);}}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(ResetPwd.prototype),"onDestroy",this).call(this);this._formCon=null;}}]);return ResetPwd;}(Page);//初始化头部
function initHeader(node){var navbar=new Nav('重设密码');navbar.el.addClass('no_color_nav');node.addChild(navbar);var resetBg=node.addChild();resetBg.setSizeMode('relative','absolute').setAbsoluteSize(null,0.741333*App.width).el=new DOMElement(resetBg,{tagName:'img',attributes:{'src':'./images/sign/setpwd_bg.jpg'}});var logo=node.addChild();logo.setSizeMode('absolute','absolute').setAbsoluteSize(90,90).setAlign(0.5,0.2).setMountPoint(0.5,0.2).el=new DOMElement(logo,{tagName:'img',attributes:{'src':'./images/sign/login_logo.png'}});}//初始化表单
function initForm(node){var _this=node;var FormCon=node.addChild();FormCon.setSizeMode('relative','relative').setProportionalSize(0.7,0.5).setAlign(.5,.5).setMountPoint(.5).el=new DOMElement(FormCon,{classes:['form_con']});node._formCon=FormCon;var pwdInput_1=FormCon.addChild(new InputCustom());pwdInput_1.setSizeMode('relative','absolute').setAbsoluteSize(null,50).setProportionalSize(.8).setAlign(.5).setMountPoint(.5).el=new DOMElement(pwdInput_1,{classes:['pwd_input'],attributes:{'type':'password','placeholder':'输入新密码','maxlength':12}});pwdInput_1.inputEvent=function(e,p){pwd=p.value;};var pwdInput_2=FormCon.addChild(new InputCustom());pwdInput_2.setSizeMode('relative','absolute').setAbsoluteSize(null,50).setProportionalSize(.8).setAlign(.5).setMountPoint(.5).setPosition(0,50+20).el=new DOMElement(pwdInput_2,{classes:['pwd_input'],attributes:{'type':'password','placeholder':'确认密码','maxlength':12}});pwdInput_2.inputEvent=function(e,p){rpwd=p.value;};var submitBtn=FormCon.addChild(new Button('确定'));submitBtn.setSizeMode('relative','absolute').setAbsoluteSize(null,50).setPosition(0,135+20).setAlign(.5).setMountPoint(.5).el=new DOMElement(submitBtn,{classes:['submit_btn']});submitBtn.clickEvent=function(e,p){if(!pwd||!rpwd){alert('密码不能为空','','提示信息','确定');return false;}else if(pwd!=rpwd){alert('两次输入的密码不一致','','提示信息','确定');return false;}else{new Ajax('/users/retrieve').data({'phone':_this.data.tel,'vcode':_this.data.vcode,'pwd':pwd,'rpwd':rpwd,'did':App.uuid}).success(function(d){if(d.status===200){_this.to('home');}else{alert(d.msg,'','提示信息','确定');}}).post();}};}module.exports=ResetPwd;},{"Ajax":63,"App":64,"Page":70,"Tips":73,"button":75,"famous/dom-renderables/DOMElement":21,"inputCustom":77,"navbar":85}],119:[function(require,module,exports){var DOMElement=require('famous/dom-renderables/DOMElement');var Page=require('Page');var Button=require('button');var InputCustom=require('inputCustom');var Tips=require('Tips');var App=require('App');var Ajax=require('Ajax');var sign=require('model/SignModel');var phoneNum='',psd='';var Login=function(_Page28){_inherits(Login,_Page28);function Login(){_classCallCheck(this,Login);return _possibleConstructorReturn(this,Object.getPrototypeOf(Login).call(this,{id:'Login'}));}_createClass(Login,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(Login.prototype),"onCreate",this).call(this);initContent(this);}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(Login.prototype),"onDestroy",this).call(this);}}]);return Login;}(Page);function initContent(node){var _this=node;var logo=node.addChild();logo.setSizeMode('absolute','absolute').setAbsoluteSize(90,90).setAlign(0.5,0.2).setMountPoint(0.5,0.2).el=new DOMElement(logo,{tagName:'img',attributes:{'src':'./images/sign/login_logo.png'}});var loginCon=node.addChild();loginCon.setSizeMode('relative','relative').setProportionalSize(0.7,0.5).setAlign(.5,.5).setMountPoint(.5).el=new DOMElement(loginCon,{classes:['login_con']});//输入手机号input框
var phoneInput=loginCon.addChild(new InputCustom());phoneInput.setSizeMode('relative','absolute').setAbsoluteSize(null,50).setProportionalSize(.8).setAlign(.5).setMountPoint(.5).el=new DOMElement(phoneInput,{classes:['phone_input'],attributes:{'type':'tel','maxlength':'11','placeholder':'请输入手机号'}});phoneInput.inputEvent=function(e,p){phoneNum=p.value;};//输入密码input框
var pwdInput=loginCon.addChild(new InputCustom());pwdInput.setSizeMode('relative','absolute').setAbsoluteSize(null,50).setProportionalSize(.8).setAlign(.5).setMountPoint(.5).setPosition(0,50+20).el=new DOMElement(pwdInput,{classes:['password_input'],attributes:{'type':'password','placeholder':'密码'}});pwdInput.inputEvent=function(e,p){psd=p.value;};//登录按钮
var loginBtn=loginCon.addChild(new Button('登录'));loginBtn.setSizeMode('relative','absolute').setAbsoluteSize(null,50).setPosition(0,135+20).setAlign(.5).setMountPoint(.5).el=new DOMElement(loginBtn,{classes:['login_btn']});loginBtn.clickEvent=function(e,p){if(!/^(\+?86 ?)?1\d{10}$/g.test(phoneNum)){alert('请输入正确手机号码','','提示信息','确定');return false;}var userSign=sign.findOne();new Ajax('users/login').data({'name':phoneNum,'pwd':psd,'did':App.uuid}).success(function(d){if(d.status===200){var data=d.data;if(userSign){sign.update({'id':userSign.id},{'id':data.id,'token':data.tk,'tel':phoneNum,'first':false});}else{sign.save({'id':data.id,'token':data.tk,'tel':phoneNum,'first':true});}_this.to('home',{data:{'checkLogin':0}});phoneInput.el.setAttribute('value','').draw();pwdInput.el.setAttribute('value','').draw();phoneNum='';psd='';_this.onDestroy();}else{alert(d.msg,'','提示信息','确定');return false;}}).error(function(){alert('服务器请求超时！','','提示信息','确定');}).timeout(function(){alert('服务器请求超时！','','提示信息','确定');}).post();};//修改密码按钮
var changePwd=loginCon.addChild(new Button('忘记密码？'));changePwd.setSizeMode('absolute','absolute').setAbsoluteSize(80,30).setAlign(.5,.9).setMountPoint(.5,.9).el=new DOMElement(changePwd,{classes:['change_pwd']});changePwd.clickEvent=function(e,p){_this.to('resetPwd',{data:{'checkLogin':0}});};}module.exports=Login;},{"Ajax":63,"App":64,"Page":70,"Tips":73,"button":75,"famous/dom-renderables/DOMElement":21,"inputCustom":77,"model/SignModel":79}],120:[function(require,module,exports){var DOMElement=require('famous/dom-renderables/DOMElement');var Page=require('Page');var Nav=require('navbar');var Button=require('button');var InputCustom=require('inputCustom');var App=require('App');var Ajax=require('Ajax');var Tips=require('Tips');var phoneNum='',codeNum='';var timer=null;var loading=false;var ResetPwd=function(_Page29){_inherits(ResetPwd,_Page29);function ResetPwd(){_classCallCheck(this,ResetPwd);return _possibleConstructorReturn(this,Object.getPrototypeOf(ResetPwd).call(this,{id:'ResetPwd'}));}_createClass(ResetPwd,[{key:"onCreate",value:function onCreate(){_get(Object.getPrototypeOf(ResetPwd.prototype),"onCreate",this).call(this);initHeader(this);}},{key:"onResume",value:function onResume(){_get(Object.getPrototypeOf(ResetPwd.prototype),"onResume",this).call(this);if(!this._fromCon){initForm(this);}}},{key:"onDestroy",value:function onDestroy(){var _this=this,obj=this.getChildren(),i=obj.length;while(i--){this.removeChild(obj[i]);}_get(Object.getPrototypeOf(ResetPwd.prototype),"onDestroy",this).call(this);this._fromCon=null;}}]);return ResetPwd;}(Page);function initHeader(node){var navbar=new Nav('重设密码');navbar.el.addClass('no_color_nav');node.addChild(navbar);var resetBg=node.addChild();resetBg.setSizeMode('relative','absolute').setAbsoluteSize(null,0.741333*App.width).el=new DOMElement(resetBg,{tagName:'img',attributes:{'src':'./images/sign/setpwd_bg.jpg'}});var logo=node.addChild();logo.setSizeMode('absolute','absolute').setAbsoluteSize(90,90).setAlign(0.5,0.2).setMountPoint(0.5,0.2).el=new DOMElement(logo,{tagName:'img',attributes:{'src':'./images/sign/login_logo.png'}});}function initForm(node){var _this=node;var FormCon=node.addChild();FormCon.setSizeMode('relative','relative').setProportionalSize(0.7,0.5).setAlign(.5,.5).setMountPoint(.5).el=new DOMElement(FormCon,{classes:['form_con']});node._fromCon=FormCon;var phoneInput=FormCon.addChild(new InputCustom());phoneInput.setSizeMode('relative','absolute').setAbsoluteSize(null,50).setProportionalSize(.8).setAlign(.5).setMountPoint(.5).el=new DOMElement(phoneInput,{classes:['phone_input'],attributes:{'type':'tel','maxlength':'11','placeholder':'请输入手机号'}});phoneInput.inputEvent=function(e,p){phoneNum=p.value;};var codeBox=FormCon.addChild();codeBox.setSizeMode('relative','absolute').setAbsoluteSize(null,50).setProportionalSize(.8).setAlign(.5).setMountPoint(.5).setPosition(0,50+20).el=new DOMElement(codeBox,{classes:['code_box']});var codeInput=codeBox.addChild(new InputCustom());codeInput.setSizeMode('relative','absolute').setAbsoluteSize(null,50).setProportionalSize(.4).el=new DOMElement(codeInput,{classes:['code_input'],attributes:{'type':'text','placeholder':'验证码','maxlength':'6'}});codeInput.inputEvent=function(e,p){codeNum=p.value;};var codeBtn=codeBox.addChild(new Button('获取验证码'));codeBtn.setSizeMode('absolute','absolute').setAbsoluteSize(85,25).setPosition(0,18).setAlign(1).setMountPoint(1).el=new DOMElement(codeBtn,{classes:['code_btn']});codeBtn.clickEvent=function(e,p){if(!/^(\+?86 ?)?1\d{10}$/g.test(phoneNum)){alert('你输入的手机号有误','','提示信息','确定');return false;}new Ajax('/users/vcode').path({'phone':phoneNum,'gtype':2,'did':App.uuid}).success(function(d){if(d.status===200){alert('验证码已发送到你的手机，3分钟内输入有效',codeTimer(codeBtn,d.data.time),'提示信息','确定');}else{alert(d.msg,'','提示信息','确定');}}).get();};var nextBtn=FormCon.addChild(new Button('下一步'));nextBtn.setSizeMode('relative','absolute').setAbsoluteSize(null,50).setPosition(0,135+20).setAlign(.5).setMountPoint(.5).el=new DOMElement(nextBtn,{classes:['login_btn']});nextBtn.clickEvent=function(e,p){if(!/^(\+?86 ?)?1\d{10}$/g.test(phoneNum)){alert('你输入的手机号有误','','提示信息','确定');return false;}if(!codeNum){alert('验证码不正确','','提示信息','确定');return false;}_this.to('confirmPwd',{data:{'tel':phoneNum,'vcode':codeNum,'checkLogin':0}});phoneNum='';codeNum='';clearValue([phoneInput,codeInput]);};}//验证码倒计时
function codeTimer(node,t){var _this=node;var time=t;if(!loading){_this.el.setContent(time+'s');timer=setInterval(function(){loading=true;time--;if(time<0){clearInterval(timer);_this.el.setContent('获取验证码');loading=false;}else{_this.el.setContent(time+'s');}},1000);}}//清除value值
function clearValue(obj){obj.forEach(function(o){o.el.setAttribute('value','').draw();});}module.exports=ResetPwd;},{"Ajax":63,"App":64,"Page":70,"Tips":73,"button":75,"famous/dom-renderables/DOMElement":21,"inputCustom":77,"navbar":85}],121:[function(require,module,exports){var FamousEngine=require('famous/core/FamousEngine');var CrossCall=require('famous/core/CrossCall');// require( 'StorageModel' );
var App=require('App');require('Dialogs');var Tips=require('Tips');var sign=require('model/SignModel');new CrossCall(function(){var App={};// 模拟设备信息，通过浏览器调试时候
var device={uuid:'0123456789',model:'x86',version:'9.0',platform:'android'};App.height=screen.height;// 宽度
App.width=screen.width;// 设备像素比
App.devicePixelRatio=2;// uuid
App.uuid=device.uuid.toLowerCase();// 设备的模型或产品的名称
App.model=device.model;// 系统版本号
App.version=device.version;// 手机平台 IOS / ANDROID
App.platform=device.platform.toLowerCase();self._call(App);}).exec(function(arg){// FamousEngine.createScene();
var Scene=FamousEngine.createScene();for(var k in arg){App[k]=arg[k];}Scene.addChild(Tips);Tips.hide();var userSign=sign.findOne();if(userSign&&userSign.token){require('Router').load('home').setAlign(0,0,0);}else{require('Router').load('login').setAlign(0,0,0);}});},{"App":64,"Dialogs":65,"Router":71,"Tips":73,"famous/core/CrossCall":9,"famous/core/FamousEngine":12,"model/SignModel":79}]},{},[121]);
//# sourceMappingURL=work.js.map
