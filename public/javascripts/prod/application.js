/*!
 * Socket.IO v2.3.0
 * (c) 2014-2019 Guillermo Rauch
 * Released under the MIT License.
 */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.io=e():t.io=e()}(this,function(){return function(t){function e(n){if(r[n])return r[n].exports;var o=r[n]={exports:{},id:n,loaded:!1};return t[n].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){"use strict";function n(t,e){"object"===("undefined"==typeof t?"undefined":o(t))&&(e=t,t=void 0),e=e||{};var r,n=i(t),s=n.source,p=n.id,h=n.path,u=c[p]&&h in c[p].nsps,f=e.forceNew||e["force new connection"]||!1===e.multiplex||u;return f?r=a(s,e):(c[p]||(c[p]=a(s,e)),r=c[p]),n.query&&!e.query&&(e.query=n.query),r.socket(n.path,e)}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=r(1),s=r(4),a=r(9);r(3)("socket.io-client");t.exports=e=n;var c=e.managers={};e.protocol=s.protocol,e.connect=n,e.Manager=r(9),e.Socket=r(33)},function(t,e,r){"use strict";function n(t,e){var r=t;e=e||"undefined"!=typeof location&&location,null==t&&(t=e.protocol+"//"+e.host),"string"==typeof t&&("/"===t.charAt(0)&&(t="/"===t.charAt(1)?e.protocol+t:e.host+t),/^(https?|wss?):\/\//.test(t)||(t="undefined"!=typeof e?e.protocol+"//"+t:"https://"+t),r=o(t)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";var n=r.host.indexOf(":")!==-1,i=n?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+i+":"+r.port,r.href=r.protocol+"://"+i+(e&&e.port===r.port?"":":"+r.port),r}var o=r(2);r(3)("socket.io-client:url");t.exports=n},function(t,e){var r=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,n=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];t.exports=function(t){var e=t,o=t.indexOf("["),i=t.indexOf("]");o!=-1&&i!=-1&&(t=t.substring(0,o)+t.substring(o,i).replace(/:/g,";")+t.substring(i,t.length));for(var s=r.exec(t||""),a={},c=14;c--;)a[n[c]]=s[c]||"";return o!=-1&&i!=-1&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a}},function(t,e){"use strict";t.exports=function(){return function(){}}},function(t,e,r){function n(){}function o(t){var r=""+t.type;if(e.BINARY_EVENT!==t.type&&e.BINARY_ACK!==t.type||(r+=t.attachments+"-"),t.nsp&&"/"!==t.nsp&&(r+=t.nsp+","),null!=t.id&&(r+=t.id),null!=t.data){var n=i(t.data);if(n===!1)return m;r+=n}return r}function i(t){try{return JSON.stringify(t)}catch(t){return!1}}function s(t,e){function r(t){var r=l.deconstructPacket(t),n=o(r.packet),i=r.buffers;i.unshift(n),e(i)}l.removeBlobs(t,r)}function a(){this.reconstructor=null}function c(t){var r=0,n={type:Number(t.charAt(0))};if(null==e.types[n.type])return u("unknown packet type "+n.type);if(e.BINARY_EVENT===n.type||e.BINARY_ACK===n.type){for(var o="";"-"!==t.charAt(++r)&&(o+=t.charAt(r),r!=t.length););if(o!=Number(o)||"-"!==t.charAt(r))throw new Error("Illegal attachments");n.attachments=Number(o)}if("/"===t.charAt(r+1))for(n.nsp="";++r;){var i=t.charAt(r);if(","===i)break;if(n.nsp+=i,r===t.length)break}else n.nsp="/";var s=t.charAt(r+1);if(""!==s&&Number(s)==s){for(n.id="";++r;){var i=t.charAt(r);if(null==i||Number(i)!=i){--r;break}if(n.id+=t.charAt(r),r===t.length)break}n.id=Number(n.id)}if(t.charAt(++r)){var a=p(t.substr(r)),c=a!==!1&&(n.type===e.ERROR||d(a));if(!c)return u("invalid payload");n.data=a}return n}function p(t){try{return JSON.parse(t)}catch(t){return!1}}function h(t){this.reconPack=t,this.buffers=[]}function u(t){return{type:e.ERROR,data:"parser error: "+t}}var f=(r(3)("socket.io-parser"),r(5)),l=r(6),d=r(7),y=r(8);e.protocol=4,e.types=["CONNECT","DISCONNECT","EVENT","ACK","ERROR","BINARY_EVENT","BINARY_ACK"],e.CONNECT=0,e.DISCONNECT=1,e.EVENT=2,e.ACK=3,e.ERROR=4,e.BINARY_EVENT=5,e.BINARY_ACK=6,e.Encoder=n,e.Decoder=a;var m=e.ERROR+'"encode error"';n.prototype.encode=function(t,r){if(e.BINARY_EVENT===t.type||e.BINARY_ACK===t.type)s(t,r);else{var n=o(t);r([n])}},f(a.prototype),a.prototype.add=function(t){var r;if("string"==typeof t)r=c(t),e.BINARY_EVENT===r.type||e.BINARY_ACK===r.type?(this.reconstructor=new h(r),0===this.reconstructor.reconPack.attachments&&this.emit("decoded",r)):this.emit("decoded",r);else{if(!y(t)&&!t.base64)throw new Error("Unknown type: "+t);if(!this.reconstructor)throw new Error("got binary data when not reconstructing a packet");r=this.reconstructor.takeBinaryData(t),r&&(this.reconstructor=null,this.emit("decoded",r))}},a.prototype.destroy=function(){this.reconstructor&&this.reconstructor.finishedReconstruction()},h.prototype.takeBinaryData=function(t){if(this.buffers.push(t),this.buffers.length===this.reconPack.attachments){var e=l.reconstructPacket(this.reconPack,this.buffers);return this.finishedReconstruction(),e}return null},h.prototype.finishedReconstruction=function(){this.reconPack=null,this.buffers=[]}},function(t,e,r){function n(t){if(t)return o(t)}function o(t){for(var e in n.prototype)t[e]=n.prototype[e];return t}t.exports=n,n.prototype.on=n.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},n.prototype.once=function(t,e){function r(){this.off(t,r),e.apply(this,arguments)}return r.fn=e,this.on(t,r),this},n.prototype.off=n.prototype.removeListener=n.prototype.removeAllListeners=n.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var r=this._callbacks["$"+t];if(!r)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var n,o=0;o<r.length;o++)if(n=r[o],n===e||n.fn===e){r.splice(o,1);break}return this},n.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),r=this._callbacks["$"+t];if(r){r=r.slice(0);for(var n=0,o=r.length;n<o;++n)r[n].apply(this,e)}return this},n.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},n.prototype.hasListeners=function(t){return!!this.listeners(t).length}},function(t,e,r){function n(t,e){if(!t)return t;if(s(t)){var r={_placeholder:!0,num:e.length};return e.push(t),r}if(i(t)){for(var o=new Array(t.length),a=0;a<t.length;a++)o[a]=n(t[a],e);return o}if("object"==typeof t&&!(t instanceof Date)){var o={};for(var c in t)o[c]=n(t[c],e);return o}return t}function o(t,e){if(!t)return t;if(t&&t._placeholder)return e[t.num];if(i(t))for(var r=0;r<t.length;r++)t[r]=o(t[r],e);else if("object"==typeof t)for(var n in t)t[n]=o(t[n],e);return t}var i=r(7),s=r(8),a=Object.prototype.toString,c="function"==typeof Blob||"undefined"!=typeof Blob&&"[object BlobConstructor]"===a.call(Blob),p="function"==typeof File||"undefined"!=typeof File&&"[object FileConstructor]"===a.call(File);e.deconstructPacket=function(t){var e=[],r=t.data,o=t;return o.data=n(r,e),o.attachments=e.length,{packet:o,buffers:e}},e.reconstructPacket=function(t,e){return t.data=o(t.data,e),t.attachments=void 0,t},e.removeBlobs=function(t,e){function r(t,a,h){if(!t)return t;if(c&&t instanceof Blob||p&&t instanceof File){n++;var u=new FileReader;u.onload=function(){h?h[a]=this.result:o=this.result,--n||e(o)},u.readAsArrayBuffer(t)}else if(i(t))for(var f=0;f<t.length;f++)r(t[f],f,t);else if("object"==typeof t&&!s(t))for(var l in t)r(t[l],l,t)}var n=0,o=t;r(o),n||e(o)}},function(t,e){var r={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==r.call(t)}},function(t,e){function r(t){return n&&Buffer.isBuffer(t)||o&&(t instanceof ArrayBuffer||i(t))}t.exports=r;var n="function"==typeof Buffer&&"function"==typeof Buffer.isBuffer,o="function"==typeof ArrayBuffer,i=function(t){return"function"==typeof ArrayBuffer.isView?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer}},function(t,e,r){"use strict";function n(t,e){if(!(this instanceof n))return new n(t,e);t&&"object"===("undefined"==typeof t?"undefined":o(t))&&(e=t,t=void 0),e=e||{},e.path=e.path||"/socket.io",this.nsps={},this.subs=[],this.opts=e,this.reconnection(e.reconnection!==!1),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.randomizationFactor(e.randomizationFactor||.5),this.backoff=new f({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(null==e.timeout?2e4:e.timeout),this.readyState="closed",this.uri=t,this.connecting=[],this.lastPing=null,this.encoding=!1,this.packetBuffer=[];var r=e.parser||c;this.encoder=new r.Encoder,this.decoder=new r.Decoder,this.autoConnect=e.autoConnect!==!1,this.autoConnect&&this.open()}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=r(10),s=r(33),a=r(5),c=r(4),p=r(35),h=r(36),u=(r(3)("socket.io-client:manager"),r(32)),f=r(37),l=Object.prototype.hasOwnProperty;t.exports=n,n.prototype.emitAll=function(){this.emit.apply(this,arguments);for(var t in this.nsps)l.call(this.nsps,t)&&this.nsps[t].emit.apply(this.nsps[t],arguments)},n.prototype.updateSocketIds=function(){for(var t in this.nsps)l.call(this.nsps,t)&&(this.nsps[t].id=this.generateId(t))},n.prototype.generateId=function(t){return("/"===t?"":t+"#")+this.engine.id},a(n.prototype),n.prototype.reconnection=function(t){return arguments.length?(this._reconnection=!!t,this):this._reconnection},n.prototype.reconnectionAttempts=function(t){return arguments.length?(this._reconnectionAttempts=t,this):this._reconnectionAttempts},n.prototype.reconnectionDelay=function(t){return arguments.length?(this._reconnectionDelay=t,this.backoff&&this.backoff.setMin(t),this):this._reconnectionDelay},n.prototype.randomizationFactor=function(t){return arguments.length?(this._randomizationFactor=t,this.backoff&&this.backoff.setJitter(t),this):this._randomizationFactor},n.prototype.reconnectionDelayMax=function(t){return arguments.length?(this._reconnectionDelayMax=t,this.backoff&&this.backoff.setMax(t),this):this._reconnectionDelayMax},n.prototype.timeout=function(t){return arguments.length?(this._timeout=t,this):this._timeout},n.prototype.maybeReconnectOnOpen=function(){!this.reconnecting&&this._reconnection&&0===this.backoff.attempts&&this.reconnect()},n.prototype.open=n.prototype.connect=function(t,e){if(~this.readyState.indexOf("open"))return this;this.engine=i(this.uri,this.opts);var r=this.engine,n=this;this.readyState="opening",this.skipReconnect=!1;var o=p(r,"open",function(){n.onopen(),t&&t()}),s=p(r,"error",function(e){if(n.cleanup(),n.readyState="closed",n.emitAll("connect_error",e),t){var r=new Error("Connection error");r.data=e,t(r)}else n.maybeReconnectOnOpen()});if(!1!==this._timeout){var a=this._timeout,c=setTimeout(function(){o.destroy(),r.close(),r.emit("error","timeout"),n.emitAll("connect_timeout",a)},a);this.subs.push({destroy:function(){clearTimeout(c)}})}return this.subs.push(o),this.subs.push(s),this},n.prototype.onopen=function(){this.cleanup(),this.readyState="open",this.emit("open");var t=this.engine;this.subs.push(p(t,"data",h(this,"ondata"))),this.subs.push(p(t,"ping",h(this,"onping"))),this.subs.push(p(t,"pong",h(this,"onpong"))),this.subs.push(p(t,"error",h(this,"onerror"))),this.subs.push(p(t,"close",h(this,"onclose"))),this.subs.push(p(this.decoder,"decoded",h(this,"ondecoded")))},n.prototype.onping=function(){this.lastPing=new Date,this.emitAll("ping")},n.prototype.onpong=function(){this.emitAll("pong",new Date-this.lastPing)},n.prototype.ondata=function(t){this.decoder.add(t)},n.prototype.ondecoded=function(t){this.emit("packet",t)},n.prototype.onerror=function(t){this.emitAll("error",t)},n.prototype.socket=function(t,e){function r(){~u(o.connecting,n)||o.connecting.push(n)}var n=this.nsps[t];if(!n){n=new s(this,t,e),this.nsps[t]=n;var o=this;n.on("connecting",r),n.on("connect",function(){n.id=o.generateId(t)}),this.autoConnect&&r()}return n},n.prototype.destroy=function(t){var e=u(this.connecting,t);~e&&this.connecting.splice(e,1),this.connecting.length||this.close()},n.prototype.packet=function(t){var e=this;t.query&&0===t.type&&(t.nsp+="?"+t.query),e.encoding?e.packetBuffer.push(t):(e.encoding=!0,this.encoder.encode(t,function(r){for(var n=0;n<r.length;n++)e.engine.write(r[n],t.options);e.encoding=!1,e.processPacketQueue()}))},n.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var t=this.packetBuffer.shift();this.packet(t)}},n.prototype.cleanup=function(){for(var t=this.subs.length,e=0;e<t;e++){var r=this.subs.shift();r.destroy()}this.packetBuffer=[],this.encoding=!1,this.lastPing=null,this.decoder.destroy()},n.prototype.close=n.prototype.disconnect=function(){this.skipReconnect=!0,this.reconnecting=!1,"opening"===this.readyState&&this.cleanup(),this.backoff.reset(),this.readyState="closed",this.engine&&this.engine.close()},n.prototype.onclose=function(t){this.cleanup(),this.backoff.reset(),this.readyState="closed",this.emit("close",t),this._reconnection&&!this.skipReconnect&&this.reconnect()},n.prototype.reconnect=function(){if(this.reconnecting||this.skipReconnect)return this;var t=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitAll("reconnect_failed"),this.reconnecting=!1;else{var e=this.backoff.duration();this.reconnecting=!0;var r=setTimeout(function(){t.skipReconnect||(t.emitAll("reconnect_attempt",t.backoff.attempts),t.emitAll("reconnecting",t.backoff.attempts),t.skipReconnect||t.open(function(e){e?(t.reconnecting=!1,t.reconnect(),t.emitAll("reconnect_error",e.data)):t.onreconnect()}))},e);this.subs.push({destroy:function(){clearTimeout(r)}})}},n.prototype.onreconnect=function(){var t=this.backoff.attempts;this.reconnecting=!1,this.backoff.reset(),this.updateSocketIds(),this.emitAll("reconnect",t)}},function(t,e,r){t.exports=r(11),t.exports.parser=r(18)},function(t,e,r){function n(t,e){return this instanceof n?(e=e||{},t&&"object"==typeof t&&(e=t,t=null),t?(t=p(t),e.hostname=t.host,e.secure="https"===t.protocol||"wss"===t.protocol,e.port=t.port,t.query&&(e.query=t.query)):e.host&&(e.hostname=p(e.host).host),this.secure=null!=e.secure?e.secure:"undefined"!=typeof location&&"https:"===location.protocol,e.hostname&&!e.port&&(e.port=this.secure?"443":"80"),this.agent=e.agent||!1,this.hostname=e.hostname||("undefined"!=typeof location?location.hostname:"localhost"),this.port=e.port||("undefined"!=typeof location&&location.port?location.port:this.secure?443:80),this.query=e.query||{},"string"==typeof this.query&&(this.query=h.decode(this.query)),this.upgrade=!1!==e.upgrade,this.path=(e.path||"/engine.io").replace(/\/$/,"")+"/",this.forceJSONP=!!e.forceJSONP,this.jsonp=!1!==e.jsonp,this.forceBase64=!!e.forceBase64,this.enablesXDR=!!e.enablesXDR,this.withCredentials=!1!==e.withCredentials,this.timestampParam=e.timestampParam||"t",this.timestampRequests=e.timestampRequests,this.transports=e.transports||["polling","websocket"],this.transportOptions=e.transportOptions||{},this.readyState="",this.writeBuffer=[],this.prevBufferLen=0,this.policyPort=e.policyPort||843,this.rememberUpgrade=e.rememberUpgrade||!1,this.binaryType=null,this.onlyBinaryUpgrades=e.onlyBinaryUpgrades,this.perMessageDeflate=!1!==e.perMessageDeflate&&(e.perMessageDeflate||{}),!0===this.perMessageDeflate&&(this.perMessageDeflate={}),this.perMessageDeflate&&null==this.perMessageDeflate.threshold&&(this.perMessageDeflate.threshold=1024),this.pfx=e.pfx||null,this.key=e.key||null,this.passphrase=e.passphrase||null,this.cert=e.cert||null,this.ca=e.ca||null,this.ciphers=e.ciphers||null,this.rejectUnauthorized=void 0===e.rejectUnauthorized||e.rejectUnauthorized,this.forceNode=!!e.forceNode,this.isReactNative="undefined"!=typeof navigator&&"string"==typeof navigator.product&&"reactnative"===navigator.product.toLowerCase(),("undefined"==typeof self||this.isReactNative)&&(e.extraHeaders&&Object.keys(e.extraHeaders).length>0&&(this.extraHeaders=e.extraHeaders),e.localAddress&&(this.localAddress=e.localAddress)),this.id=null,this.upgrades=null,this.pingInterval=null,this.pingTimeout=null,this.pingIntervalTimer=null,this.pingTimeoutTimer=null,void this.open()):new n(t,e)}function o(t){var e={};for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);return e}var i=r(12),s=r(5),a=(r(3)("engine.io-client:socket"),r(32)),c=r(18),p=r(2),h=r(26);t.exports=n,n.priorWebsocketSuccess=!1,s(n.prototype),n.protocol=c.protocol,n.Socket=n,n.Transport=r(17),n.transports=r(12),n.parser=r(18),n.prototype.createTransport=function(t){var e=o(this.query);e.EIO=c.protocol,e.transport=t;var r=this.transportOptions[t]||{};this.id&&(e.sid=this.id);var n=new i[t]({query:e,socket:this,agent:r.agent||this.agent,hostname:r.hostname||this.hostname,port:r.port||this.port,secure:r.secure||this.secure,path:r.path||this.path,forceJSONP:r.forceJSONP||this.forceJSONP,jsonp:r.jsonp||this.jsonp,forceBase64:r.forceBase64||this.forceBase64,enablesXDR:r.enablesXDR||this.enablesXDR,withCredentials:r.withCredentials||this.withCredentials,timestampRequests:r.timestampRequests||this.timestampRequests,timestampParam:r.timestampParam||this.timestampParam,policyPort:r.policyPort||this.policyPort,pfx:r.pfx||this.pfx,key:r.key||this.key,passphrase:r.passphrase||this.passphrase,cert:r.cert||this.cert,ca:r.ca||this.ca,ciphers:r.ciphers||this.ciphers,rejectUnauthorized:r.rejectUnauthorized||this.rejectUnauthorized,perMessageDeflate:r.perMessageDeflate||this.perMessageDeflate,extraHeaders:r.extraHeaders||this.extraHeaders,forceNode:r.forceNode||this.forceNode,localAddress:r.localAddress||this.localAddress,requestTimeout:r.requestTimeout||this.requestTimeout,protocols:r.protocols||void 0,isReactNative:this.isReactNative});return n},n.prototype.open=function(){var t;if(this.rememberUpgrade&&n.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1)t="websocket";else{if(0===this.transports.length){var e=this;return void setTimeout(function(){e.emit("error","No transports available")},0)}t=this.transports[0]}this.readyState="opening";try{t=this.createTransport(t)}catch(t){return this.transports.shift(),void this.open()}t.open(),this.setTransport(t)},n.prototype.setTransport=function(t){var e=this;this.transport&&this.transport.removeAllListeners(),this.transport=t,t.on("drain",function(){e.onDrain()}).on("packet",function(t){e.onPacket(t)}).on("error",function(t){e.onError(t)}).on("close",function(){e.onClose("transport close")})},n.prototype.probe=function(t){function e(){if(u.onlyBinaryUpgrades){var t=!this.supportsBinary&&u.transport.supportsBinary;h=h||t}h||(p.send([{type:"ping",data:"probe"}]),p.once("packet",function(t){if(!h)if("pong"===t.type&&"probe"===t.data){if(u.upgrading=!0,u.emit("upgrading",p),!p)return;n.priorWebsocketSuccess="websocket"===p.name,u.transport.pause(function(){h||"closed"!==u.readyState&&(c(),u.setTransport(p),p.send([{type:"upgrade"}]),u.emit("upgrade",p),p=null,u.upgrading=!1,u.flush())})}else{var e=new Error("probe error");e.transport=p.name,u.emit("upgradeError",e)}}))}function r(){h||(h=!0,c(),p.close(),p=null)}function o(t){var e=new Error("probe error: "+t);e.transport=p.name,r(),u.emit("upgradeError",e)}function i(){o("transport closed")}function s(){o("socket closed")}function a(t){p&&t.name!==p.name&&r()}function c(){p.removeListener("open",e),p.removeListener("error",o),p.removeListener("close",i),u.removeListener("close",s),u.removeListener("upgrading",a)}var p=this.createTransport(t,{probe:1}),h=!1,u=this;n.priorWebsocketSuccess=!1,p.once("open",e),p.once("error",o),p.once("close",i),this.once("close",s),this.once("upgrading",a),p.open()},n.prototype.onOpen=function(){if(this.readyState="open",n.priorWebsocketSuccess="websocket"===this.transport.name,this.emit("open"),this.flush(),"open"===this.readyState&&this.upgrade&&this.transport.pause)for(var t=0,e=this.upgrades.length;t<e;t++)this.probe(this.upgrades[t])},n.prototype.onPacket=function(t){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState)switch(this.emit("packet",t),this.emit("heartbeat"),t.type){case"open":this.onHandshake(JSON.parse(t.data));break;case"pong":this.setPing(),this.emit("pong");break;case"error":var e=new Error("server error");e.code=t.data,this.onError(e);break;case"message":this.emit("data",t.data),this.emit("message",t.data)}},n.prototype.onHandshake=function(t){this.emit("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this.upgrades=this.filterUpgrades(t.upgrades),this.pingInterval=t.pingInterval,this.pingTimeout=t.pingTimeout,this.onOpen(),"closed"!==this.readyState&&(this.setPing(),this.removeListener("heartbeat",this.onHeartbeat),this.on("heartbeat",this.onHeartbeat))},n.prototype.onHeartbeat=function(t){clearTimeout(this.pingTimeoutTimer);var e=this;e.pingTimeoutTimer=setTimeout(function(){"closed"!==e.readyState&&e.onClose("ping timeout")},t||e.pingInterval+e.pingTimeout)},n.prototype.setPing=function(){var t=this;clearTimeout(t.pingIntervalTimer),t.pingIntervalTimer=setTimeout(function(){t.ping(),t.onHeartbeat(t.pingTimeout)},t.pingInterval)},n.prototype.ping=function(){var t=this;this.sendPacket("ping",function(){t.emit("ping")})},n.prototype.onDrain=function(){this.writeBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,0===this.writeBuffer.length?this.emit("drain"):this.flush()},n.prototype.flush=function(){"closed"!==this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length&&(this.transport.send(this.writeBuffer),this.prevBufferLen=this.writeBuffer.length,this.emit("flush"))},n.prototype.write=n.prototype.send=function(t,e,r){return this.sendPacket("message",t,e,r),this},n.prototype.sendPacket=function(t,e,r,n){if("function"==typeof e&&(n=e,e=void 0),"function"==typeof r&&(n=r,r=null),"closing"!==this.readyState&&"closed"!==this.readyState){r=r||{},r.compress=!1!==r.compress;var o={type:t,data:e,options:r};this.emit("packetCreate",o),this.writeBuffer.push(o),n&&this.once("flush",n),this.flush()}},n.prototype.close=function(){function t(){n.onClose("forced close"),n.transport.close()}function e(){n.removeListener("upgrade",e),n.removeListener("upgradeError",e),t()}function r(){n.once("upgrade",e),n.once("upgradeError",e)}if("opening"===this.readyState||"open"===this.readyState){this.readyState="closing";var n=this;this.writeBuffer.length?this.once("drain",function(){this.upgrading?r():t()}):this.upgrading?r():t()}return this},n.prototype.onError=function(t){n.priorWebsocketSuccess=!1,this.emit("error",t),this.onClose("transport error",t)},n.prototype.onClose=function(t,e){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState){var r=this;clearTimeout(this.pingIntervalTimer),clearTimeout(this.pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),this.readyState="closed",this.id=null,this.emit("close",t,e),r.writeBuffer=[],r.prevBufferLen=0}},n.prototype.filterUpgrades=function(t){for(var e=[],r=0,n=t.length;r<n;r++)~a(this.transports,t[r])&&e.push(t[r]);return e}},function(t,e,r){function n(t){var e,r=!1,n=!1,a=!1!==t.jsonp;if("undefined"!=typeof location){var c="https:"===location.protocol,p=location.port;p||(p=c?443:80),r=t.hostname!==location.hostname||p!==t.port,n=t.secure!==c}if(t.xdomain=r,t.xscheme=n,e=new o(t),"open"in e&&!t.forceJSONP)return new i(t);if(!a)throw new Error("JSONP disabled");return new s(t)}var o=r(13),i=r(15),s=r(29),a=r(30);e.polling=n,e.websocket=a},function(t,e,r){var n=r(14);t.exports=function(t){var e=t.xdomain,r=t.xscheme,o=t.enablesXDR;try{if("undefined"!=typeof XMLHttpRequest&&(!e||n))return new XMLHttpRequest}catch(t){}try{if("undefined"!=typeof XDomainRequest&&!r&&o)return new XDomainRequest}catch(t){}if(!e)try{return new(self[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")}catch(t){}}},function(t,e){try{t.exports="undefined"!=typeof XMLHttpRequest&&"withCredentials"in new XMLHttpRequest}catch(e){t.exports=!1}},function(t,e,r){function n(){}function o(t){if(c.call(this,t),this.requestTimeout=t.requestTimeout,this.extraHeaders=t.extraHeaders,"undefined"!=typeof location){var e="https:"===location.protocol,r=location.port;r||(r=e?443:80),this.xd="undefined"!=typeof location&&t.hostname!==location.hostname||r!==t.port,this.xs=t.secure!==e}}function i(t){this.method=t.method||"GET",this.uri=t.uri,this.xd=!!t.xd,this.xs=!!t.xs,this.async=!1!==t.async,this.data=void 0!==t.data?t.data:null,this.agent=t.agent,this.isBinary=t.isBinary,this.supportsBinary=t.supportsBinary,this.enablesXDR=t.enablesXDR,this.withCredentials=t.withCredentials,this.requestTimeout=t.requestTimeout,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.extraHeaders=t.extraHeaders,this.create()}function s(){for(var t in i.requests)i.requests.hasOwnProperty(t)&&i.requests[t].abort()}var a=r(13),c=r(16),p=r(5),h=r(27);r(3)("engine.io-client:polling-xhr");if(t.exports=o,t.exports.Request=i,h(o,c),o.prototype.supportsBinary=!0,o.prototype.request=function(t){return t=t||{},t.uri=this.uri(),t.xd=this.xd,t.xs=this.xs,t.agent=this.agent||!1,t.supportsBinary=this.supportsBinary,t.enablesXDR=this.enablesXDR,t.withCredentials=this.withCredentials,t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized,t.requestTimeout=this.requestTimeout,t.extraHeaders=this.extraHeaders,new i(t)},o.prototype.doWrite=function(t,e){var r="string"!=typeof t&&void 0!==t,n=this.request({method:"POST",data:t,isBinary:r}),o=this;n.on("success",e),n.on("error",function(t){o.onError("xhr post error",t)}),this.sendXhr=n},o.prototype.doPoll=function(){var t=this.request(),e=this;t.on("data",function(t){e.onData(t)}),t.on("error",function(t){e.onError("xhr poll error",t)}),this.pollXhr=t},p(i.prototype),i.prototype.create=function(){var t={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR};t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized;var e=this.xhr=new a(t),r=this;try{e.open(this.method,this.uri,this.async);try{if(this.extraHeaders){e.setDisableHeaderCheck&&e.setDisableHeaderCheck(!0);for(var n in this.extraHeaders)this.extraHeaders.hasOwnProperty(n)&&e.setRequestHeader(n,this.extraHeaders[n])}}catch(t){}if("POST"===this.method)try{this.isBinary?e.setRequestHeader("Content-type","application/octet-stream"):e.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch(t){}try{e.setRequestHeader("Accept","*/*")}catch(t){}"withCredentials"in e&&(e.withCredentials=this.withCredentials),this.requestTimeout&&(e.timeout=this.requestTimeout),this.hasXDR()?(e.onload=function(){r.onLoad()},e.onerror=function(){r.onError(e.responseText)}):e.onreadystatechange=function(){if(2===e.readyState)try{var t=e.getResponseHeader("Content-Type");(r.supportsBinary&&"application/octet-stream"===t||"application/octet-stream; charset=UTF-8"===t)&&(e.responseType="arraybuffer")}catch(t){}4===e.readyState&&(200===e.status||1223===e.status?r.onLoad():setTimeout(function(){r.onError("number"==typeof e.status?e.status:0)},0))},e.send(this.data)}catch(t){return void setTimeout(function(){r.onError(t)},0)}"undefined"!=typeof document&&(this.index=i.requestsCount++,i.requests[this.index]=this)},i.prototype.onSuccess=function(){this.emit("success"),this.cleanup()},i.prototype.onData=function(t){this.emit("data",t),this.onSuccess()},i.prototype.onError=function(t){this.emit("error",t),this.cleanup(!0)},i.prototype.cleanup=function(t){if("undefined"!=typeof this.xhr&&null!==this.xhr){if(this.hasXDR()?this.xhr.onload=this.xhr.onerror=n:this.xhr.onreadystatechange=n,t)try{this.xhr.abort()}catch(t){}"undefined"!=typeof document&&delete i.requests[this.index],this.xhr=null}},i.prototype.onLoad=function(){var t;try{var e;try{e=this.xhr.getResponseHeader("Content-Type")}catch(t){}t="application/octet-stream"===e||"application/octet-stream; charset=UTF-8"===e?this.xhr.response||this.xhr.responseText:this.xhr.responseText}catch(t){this.onError(t)}null!=t&&this.onData(t)},i.prototype.hasXDR=function(){return"undefined"!=typeof XDomainRequest&&!this.xs&&this.enablesXDR},i.prototype.abort=function(){this.cleanup()},i.requestsCount=0,i.requests={},"undefined"!=typeof document)if("function"==typeof attachEvent)attachEvent("onunload",s);else if("function"==typeof addEventListener){var u="onpagehide"in self?"pagehide":"unload";addEventListener(u,s,!1)}},function(t,e,r){function n(t){var e=t&&t.forceBase64;p&&!e||(this.supportsBinary=!1),o.call(this,t)}var o=r(17),i=r(26),s=r(18),a=r(27),c=r(28);r(3)("engine.io-client:polling");t.exports=n;var p=function(){var t=r(13),e=new t({xdomain:!1});return null!=e.responseType}();a(n,o),n.prototype.name="polling",n.prototype.doOpen=function(){this.poll()},n.prototype.pause=function(t){function e(){r.readyState="paused",t()}var r=this;if(this.readyState="pausing",this.polling||!this.writable){var n=0;this.polling&&(n++,this.once("pollComplete",function(){--n||e()})),this.writable||(n++,this.once("drain",function(){--n||e()}))}else e()},n.prototype.poll=function(){this.polling=!0,this.doPoll(),this.emit("poll")},n.prototype.onData=function(t){var e=this,r=function(t,r,n){return"opening"===e.readyState&&e.onOpen(),"close"===t.type?(e.onClose(),!1):void e.onPacket(t)};s.decodePayload(t,this.socket.binaryType,r),"closed"!==this.readyState&&(this.polling=!1,this.emit("pollComplete"),"open"===this.readyState&&this.poll())},n.prototype.doClose=function(){function t(){e.write([{type:"close"}])}var e=this;"open"===this.readyState?t():this.once("open",t)},n.prototype.write=function(t){var e=this;this.writable=!1;var r=function(){e.writable=!0,e.emit("drain")};s.encodePayload(t,this.supportsBinary,function(t){e.doWrite(t,r)})},n.prototype.uri=function(){var t=this.query||{},e=this.secure?"https":"http",r="";!1!==this.timestampRequests&&(t[this.timestampParam]=c()),this.supportsBinary||t.sid||(t.b64=1),t=i.encode(t),this.port&&("https"===e&&443!==Number(this.port)||"http"===e&&80!==Number(this.port))&&(r=":"+this.port),t.length&&(t="?"+t);var n=this.hostname.indexOf(":")!==-1;return e+"://"+(n?"["+this.hostname+"]":this.hostname)+r+this.path+t}},function(t,e,r){function n(t){this.path=t.path,this.hostname=t.hostname,this.port=t.port,this.secure=t.secure,this.query=t.query,this.timestampParam=t.timestampParam,this.timestampRequests=t.timestampRequests,this.readyState="",this.agent=t.agent||!1,this.socket=t.socket,this.enablesXDR=t.enablesXDR,this.withCredentials=t.withCredentials,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.forceNode=t.forceNode,this.isReactNative=t.isReactNative,this.extraHeaders=t.extraHeaders,this.localAddress=t.localAddress}var o=r(18),i=r(5);t.exports=n,i(n.prototype),n.prototype.onError=function(t,e){var r=new Error(t);return r.type="TransportError",r.description=e,this.emit("error",r),this},n.prototype.open=function(){return"closed"!==this.readyState&&""!==this.readyState||(this.readyState="opening",this.doOpen()),this},n.prototype.close=function(){return"opening"!==this.readyState&&"open"!==this.readyState||(this.doClose(),this.onClose()),this},n.prototype.send=function(t){if("open"!==this.readyState)throw new Error("Transport not open");
this.write(t)},n.prototype.onOpen=function(){this.readyState="open",this.writable=!0,this.emit("open")},n.prototype.onData=function(t){var e=o.decodePacket(t,this.socket.binaryType);this.onPacket(e)},n.prototype.onPacket=function(t){this.emit("packet",t)},n.prototype.onClose=function(){this.readyState="closed",this.emit("close")}},function(t,e,r){function n(t,r){var n="b"+e.packets[t.type]+t.data.data;return r(n)}function o(t,r,n){if(!r)return e.encodeBase64Packet(t,n);var o=t.data,i=new Uint8Array(o),s=new Uint8Array(1+o.byteLength);s[0]=v[t.type];for(var a=0;a<i.length;a++)s[a+1]=i[a];return n(s.buffer)}function i(t,r,n){if(!r)return e.encodeBase64Packet(t,n);var o=new FileReader;return o.onload=function(){e.encodePacket({type:t.type,data:o.result},r,!0,n)},o.readAsArrayBuffer(t.data)}function s(t,r,n){if(!r)return e.encodeBase64Packet(t,n);if(g)return i(t,r,n);var o=new Uint8Array(1);o[0]=v[t.type];var s=new w([o.buffer,t.data]);return n(s)}function a(t){try{t=d.decode(t,{strict:!1})}catch(t){return!1}return t}function c(t,e,r){for(var n=new Array(t.length),o=l(t.length,r),i=function(t,r,o){e(r,function(e,r){n[t]=r,o(e,n)})},s=0;s<t.length;s++)i(s,t[s],o)}var p,h=r(19),u=r(20),f=r(21),l=r(22),d=r(23);"undefined"!=typeof ArrayBuffer&&(p=r(24));var y="undefined"!=typeof navigator&&/Android/i.test(navigator.userAgent),m="undefined"!=typeof navigator&&/PhantomJS/i.test(navigator.userAgent),g=y||m;e.protocol=3;var v=e.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6},b=h(v),k={type:"error",data:"parser error"},w=r(25);e.encodePacket=function(t,e,r,i){"function"==typeof e&&(i=e,e=!1),"function"==typeof r&&(i=r,r=null);var a=void 0===t.data?void 0:t.data.buffer||t.data;if("undefined"!=typeof ArrayBuffer&&a instanceof ArrayBuffer)return o(t,e,i);if("undefined"!=typeof w&&a instanceof w)return s(t,e,i);if(a&&a.base64)return n(t,i);var c=v[t.type];return void 0!==t.data&&(c+=r?d.encode(String(t.data),{strict:!1}):String(t.data)),i(""+c)},e.encodeBase64Packet=function(t,r){var n="b"+e.packets[t.type];if("undefined"!=typeof w&&t.data instanceof w){var o=new FileReader;return o.onload=function(){var t=o.result.split(",")[1];r(n+t)},o.readAsDataURL(t.data)}var i;try{i=String.fromCharCode.apply(null,new Uint8Array(t.data))}catch(e){for(var s=new Uint8Array(t.data),a=new Array(s.length),c=0;c<s.length;c++)a[c]=s[c];i=String.fromCharCode.apply(null,a)}return n+=btoa(i),r(n)},e.decodePacket=function(t,r,n){if(void 0===t)return k;if("string"==typeof t){if("b"===t.charAt(0))return e.decodeBase64Packet(t.substr(1),r);if(n&&(t=a(t),t===!1))return k;var o=t.charAt(0);return Number(o)==o&&b[o]?t.length>1?{type:b[o],data:t.substring(1)}:{type:b[o]}:k}var i=new Uint8Array(t),o=i[0],s=f(t,1);return w&&"blob"===r&&(s=new w([s])),{type:b[o],data:s}},e.decodeBase64Packet=function(t,e){var r=b[t.charAt(0)];if(!p)return{type:r,data:{base64:!0,data:t.substr(1)}};var n=p.decode(t.substr(1));return"blob"===e&&w&&(n=new w([n])),{type:r,data:n}},e.encodePayload=function(t,r,n){function o(t){return t.length+":"+t}function i(t,n){e.encodePacket(t,!!s&&r,!1,function(t){n(null,o(t))})}"function"==typeof r&&(n=r,r=null);var s=u(t);return r&&s?w&&!g?e.encodePayloadAsBlob(t,n):e.encodePayloadAsArrayBuffer(t,n):t.length?void c(t,i,function(t,e){return n(e.join(""))}):n("0:")},e.decodePayload=function(t,r,n){if("string"!=typeof t)return e.decodePayloadAsBinary(t,r,n);"function"==typeof r&&(n=r,r=null);var o;if(""===t)return n(k,0,1);for(var i,s,a="",c=0,p=t.length;c<p;c++){var h=t.charAt(c);if(":"===h){if(""===a||a!=(i=Number(a)))return n(k,0,1);if(s=t.substr(c+1,i),a!=s.length)return n(k,0,1);if(s.length){if(o=e.decodePacket(s,r,!1),k.type===o.type&&k.data===o.data)return n(k,0,1);var u=n(o,c+i,p);if(!1===u)return}c+=i,a=""}else a+=h}return""!==a?n(k,0,1):void 0},e.encodePayloadAsArrayBuffer=function(t,r){function n(t,r){e.encodePacket(t,!0,!0,function(t){return r(null,t)})}return t.length?void c(t,n,function(t,e){var n=e.reduce(function(t,e){var r;return r="string"==typeof e?e.length:e.byteLength,t+r.toString().length+r+2},0),o=new Uint8Array(n),i=0;return e.forEach(function(t){var e="string"==typeof t,r=t;if(e){for(var n=new Uint8Array(t.length),s=0;s<t.length;s++)n[s]=t.charCodeAt(s);r=n.buffer}e?o[i++]=0:o[i++]=1;for(var a=r.byteLength.toString(),s=0;s<a.length;s++)o[i++]=parseInt(a[s]);o[i++]=255;for(var n=new Uint8Array(r),s=0;s<n.length;s++)o[i++]=n[s]}),r(o.buffer)}):r(new ArrayBuffer(0))},e.encodePayloadAsBlob=function(t,r){function n(t,r){e.encodePacket(t,!0,!0,function(t){var e=new Uint8Array(1);if(e[0]=1,"string"==typeof t){for(var n=new Uint8Array(t.length),o=0;o<t.length;o++)n[o]=t.charCodeAt(o);t=n.buffer,e[0]=0}for(var i=t instanceof ArrayBuffer?t.byteLength:t.size,s=i.toString(),a=new Uint8Array(s.length+1),o=0;o<s.length;o++)a[o]=parseInt(s[o]);if(a[s.length]=255,w){var c=new w([e.buffer,a.buffer,t]);r(null,c)}})}c(t,n,function(t,e){return r(new w(e))})},e.decodePayloadAsBinary=function(t,r,n){"function"==typeof r&&(n=r,r=null);for(var o=t,i=[];o.byteLength>0;){for(var s=new Uint8Array(o),a=0===s[0],c="",p=1;255!==s[p];p++){if(c.length>310)return n(k,0,1);c+=s[p]}o=f(o,2+c.length),c=parseInt(c);var h=f(o,0,c);if(a)try{h=String.fromCharCode.apply(null,new Uint8Array(h))}catch(t){var u=new Uint8Array(h);h="";for(var p=0;p<u.length;p++)h+=String.fromCharCode(u[p])}i.push(h),o=f(o,c)}var l=i.length;i.forEach(function(t,o){n(e.decodePacket(t,r,!0),o,l)})}},function(t,e){t.exports=Object.keys||function(t){var e=[],r=Object.prototype.hasOwnProperty;for(var n in t)r.call(t,n)&&e.push(n);return e}},function(t,e,r){function n(t){if(!t||"object"!=typeof t)return!1;if(o(t)){for(var e=0,r=t.length;e<r;e++)if(n(t[e]))return!0;return!1}if("function"==typeof Buffer&&Buffer.isBuffer&&Buffer.isBuffer(t)||"function"==typeof ArrayBuffer&&t instanceof ArrayBuffer||s&&t instanceof Blob||a&&t instanceof File)return!0;if(t.toJSON&&"function"==typeof t.toJSON&&1===arguments.length)return n(t.toJSON(),!0);for(var i in t)if(Object.prototype.hasOwnProperty.call(t,i)&&n(t[i]))return!0;return!1}var o=r(7),i=Object.prototype.toString,s="function"==typeof Blob||"undefined"!=typeof Blob&&"[object BlobConstructor]"===i.call(Blob),a="function"==typeof File||"undefined"!=typeof File&&"[object FileConstructor]"===i.call(File);t.exports=n},function(t,e){t.exports=function(t,e,r){var n=t.byteLength;if(e=e||0,r=r||n,t.slice)return t.slice(e,r);if(e<0&&(e+=n),r<0&&(r+=n),r>n&&(r=n),e>=n||e>=r||0===n)return new ArrayBuffer(0);for(var o=new Uint8Array(t),i=new Uint8Array(r-e),s=e,a=0;s<r;s++,a++)i[a]=o[s];return i.buffer}},function(t,e){function r(t,e,r){function o(t,n){if(o.count<=0)throw new Error("after called too many times");--o.count,t?(i=!0,e(t),e=r):0!==o.count||i||e(null,n)}var i=!1;return r=r||n,o.count=t,0===t?e():o}function n(){}t.exports=r},function(t,e){function r(t){for(var e,r,n=[],o=0,i=t.length;o<i;)e=t.charCodeAt(o++),e>=55296&&e<=56319&&o<i?(r=t.charCodeAt(o++),56320==(64512&r)?n.push(((1023&e)<<10)+(1023&r)+65536):(n.push(e),o--)):n.push(e);return n}function n(t){for(var e,r=t.length,n=-1,o="";++n<r;)e=t[n],e>65535&&(e-=65536,o+=d(e>>>10&1023|55296),e=56320|1023&e),o+=d(e);return o}function o(t,e){if(t>=55296&&t<=57343){if(e)throw Error("Lone surrogate U+"+t.toString(16).toUpperCase()+" is not a scalar value");return!1}return!0}function i(t,e){return d(t>>e&63|128)}function s(t,e){if(0==(4294967168&t))return d(t);var r="";return 0==(4294965248&t)?r=d(t>>6&31|192):0==(4294901760&t)?(o(t,e)||(t=65533),r=d(t>>12&15|224),r+=i(t,6)):0==(4292870144&t)&&(r=d(t>>18&7|240),r+=i(t,12),r+=i(t,6)),r+=d(63&t|128)}function a(t,e){e=e||{};for(var n,o=!1!==e.strict,i=r(t),a=i.length,c=-1,p="";++c<a;)n=i[c],p+=s(n,o);return p}function c(){if(l>=f)throw Error("Invalid byte index");var t=255&u[l];if(l++,128==(192&t))return 63&t;throw Error("Invalid continuation byte")}function p(t){var e,r,n,i,s;if(l>f)throw Error("Invalid byte index");if(l==f)return!1;if(e=255&u[l],l++,0==(128&e))return e;if(192==(224&e)){if(r=c(),s=(31&e)<<6|r,s>=128)return s;throw Error("Invalid continuation byte")}if(224==(240&e)){if(r=c(),n=c(),s=(15&e)<<12|r<<6|n,s>=2048)return o(s,t)?s:65533;throw Error("Invalid continuation byte")}if(240==(248&e)&&(r=c(),n=c(),i=c(),s=(7&e)<<18|r<<12|n<<6|i,s>=65536&&s<=1114111))return s;throw Error("Invalid UTF-8 detected")}function h(t,e){e=e||{};var o=!1!==e.strict;u=r(t),f=u.length,l=0;for(var i,s=[];(i=p(o))!==!1;)s.push(i);return n(s)}/*! https://mths.be/utf8js v2.1.2 by @mathias */
var u,f,l,d=String.fromCharCode;t.exports={version:"2.1.2",encode:a,decode:h}},function(t,e){!function(){"use strict";for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",r=new Uint8Array(256),n=0;n<t.length;n++)r[t.charCodeAt(n)]=n;e.encode=function(e){var r,n=new Uint8Array(e),o=n.length,i="";for(r=0;r<o;r+=3)i+=t[n[r]>>2],i+=t[(3&n[r])<<4|n[r+1]>>4],i+=t[(15&n[r+1])<<2|n[r+2]>>6],i+=t[63&n[r+2]];return o%3===2?i=i.substring(0,i.length-1)+"=":o%3===1&&(i=i.substring(0,i.length-2)+"=="),i},e.decode=function(t){var e,n,o,i,s,a=.75*t.length,c=t.length,p=0;"="===t[t.length-1]&&(a--,"="===t[t.length-2]&&a--);var h=new ArrayBuffer(a),u=new Uint8Array(h);for(e=0;e<c;e+=4)n=r[t.charCodeAt(e)],o=r[t.charCodeAt(e+1)],i=r[t.charCodeAt(e+2)],s=r[t.charCodeAt(e+3)],u[p++]=n<<2|o>>4,u[p++]=(15&o)<<4|i>>2,u[p++]=(3&i)<<6|63&s;return h}}()},function(t,e){function r(t){return t.map(function(t){if(t.buffer instanceof ArrayBuffer){var e=t.buffer;if(t.byteLength!==e.byteLength){var r=new Uint8Array(t.byteLength);r.set(new Uint8Array(e,t.byteOffset,t.byteLength)),e=r.buffer}return e}return t})}function n(t,e){e=e||{};var n=new i;return r(t).forEach(function(t){n.append(t)}),e.type?n.getBlob(e.type):n.getBlob()}function o(t,e){return new Blob(r(t),e||{})}var i="undefined"!=typeof i?i:"undefined"!=typeof WebKitBlobBuilder?WebKitBlobBuilder:"undefined"!=typeof MSBlobBuilder?MSBlobBuilder:"undefined"!=typeof MozBlobBuilder&&MozBlobBuilder,s=function(){try{var t=new Blob(["hi"]);return 2===t.size}catch(t){return!1}}(),a=s&&function(){try{var t=new Blob([new Uint8Array([1,2])]);return 2===t.size}catch(t){return!1}}(),c=i&&i.prototype.append&&i.prototype.getBlob;"undefined"!=typeof Blob&&(n.prototype=Blob.prototype,o.prototype=Blob.prototype),t.exports=function(){return s?a?Blob:o:c?n:void 0}()},function(t,e){e.encode=function(t){var e="";for(var r in t)t.hasOwnProperty(r)&&(e.length&&(e+="&"),e+=encodeURIComponent(r)+"="+encodeURIComponent(t[r]));return e},e.decode=function(t){for(var e={},r=t.split("&"),n=0,o=r.length;n<o;n++){var i=r[n].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}},function(t,e){t.exports=function(t,e){var r=function(){};r.prototype=e.prototype,t.prototype=new r,t.prototype.constructor=t}},function(t,e){"use strict";function r(t){var e="";do e=s[t%a]+e,t=Math.floor(t/a);while(t>0);return e}function n(t){var e=0;for(h=0;h<t.length;h++)e=e*a+c[t.charAt(h)];return e}function o(){var t=r(+new Date);return t!==i?(p=0,i=t):t+"."+r(p++)}for(var i,s="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),a=64,c={},p=0,h=0;h<a;h++)c[s[h]]=h;o.encode=r,o.decode=n,t.exports=o},function(t,e,r){(function(e){function n(){}function o(){return"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof e?e:{}}function i(t){if(s.call(this,t),this.query=this.query||{},!c){var e=o();c=e.___eio=e.___eio||[]}this.index=c.length;var r=this;c.push(function(t){r.onData(t)}),this.query.j=this.index,"function"==typeof addEventListener&&addEventListener("beforeunload",function(){r.script&&(r.script.onerror=n)},!1)}var s=r(16),a=r(27);t.exports=i;var c,p=/\n/g,h=/\\n/g;a(i,s),i.prototype.supportsBinary=!1,i.prototype.doClose=function(){this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),this.form&&(this.form.parentNode.removeChild(this.form),this.form=null,this.iframe=null),s.prototype.doClose.call(this)},i.prototype.doPoll=function(){var t=this,e=document.createElement("script");this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),e.async=!0,e.src=this.uri(),e.onerror=function(e){t.onError("jsonp poll error",e)};var r=document.getElementsByTagName("script")[0];r?r.parentNode.insertBefore(e,r):(document.head||document.body).appendChild(e),this.script=e;var n="undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent);n&&setTimeout(function(){var t=document.createElement("iframe");document.body.appendChild(t),document.body.removeChild(t)},100)},i.prototype.doWrite=function(t,e){function r(){n(),e()}function n(){if(o.iframe)try{o.form.removeChild(o.iframe)}catch(t){o.onError("jsonp polling iframe removal error",t)}try{var t='<iframe src="javascript:0" name="'+o.iframeId+'">';i=document.createElement(t)}catch(t){i=document.createElement("iframe"),i.name=o.iframeId,i.src="javascript:0"}i.id=o.iframeId,o.form.appendChild(i),o.iframe=i}var o=this;if(!this.form){var i,s=document.createElement("form"),a=document.createElement("textarea"),c=this.iframeId="eio_iframe_"+this.index;s.className="socketio",s.style.position="absolute",s.style.top="-1000px",s.style.left="-1000px",s.target=c,s.method="POST",s.setAttribute("accept-charset","utf-8"),a.name="d",s.appendChild(a),document.body.appendChild(s),this.form=s,this.area=a}this.form.action=this.uri(),n(),t=t.replace(h,"\\\n"),this.area.value=t.replace(p,"\\n");try{this.form.submit()}catch(t){}this.iframe.attachEvent?this.iframe.onreadystatechange=function(){"complete"===o.iframe.readyState&&r()}:this.iframe.onload=r}}).call(e,function(){return this}())},function(t,e,r){function n(t){var e=t&&t.forceBase64;e&&(this.supportsBinary=!1),this.perMessageDeflate=t.perMessageDeflate,this.usingBrowserWebSocket=o&&!t.forceNode,this.protocols=t.protocols,this.usingBrowserWebSocket||(u=i),s.call(this,t)}var o,i,s=r(17),a=r(18),c=r(26),p=r(27),h=r(28);r(3)("engine.io-client:websocket");if("undefined"!=typeof WebSocket?o=WebSocket:"undefined"!=typeof self&&(o=self.WebSocket||self.MozWebSocket),"undefined"==typeof window)try{i=r(31)}catch(t){}var u=o||i;t.exports=n,p(n,s),n.prototype.name="websocket",n.prototype.supportsBinary=!0,n.prototype.doOpen=function(){if(this.check()){var t=this.uri(),e=this.protocols,r={agent:this.agent,perMessageDeflate:this.perMessageDeflate};r.pfx=this.pfx,r.key=this.key,r.passphrase=this.passphrase,r.cert=this.cert,r.ca=this.ca,r.ciphers=this.ciphers,r.rejectUnauthorized=this.rejectUnauthorized,this.extraHeaders&&(r.headers=this.extraHeaders),this.localAddress&&(r.localAddress=this.localAddress);try{this.ws=this.usingBrowserWebSocket&&!this.isReactNative?e?new u(t,e):new u(t):new u(t,e,r)}catch(t){return this.emit("error",t)}void 0===this.ws.binaryType&&(this.supportsBinary=!1),this.ws.supports&&this.ws.supports.binary?(this.supportsBinary=!0,this.ws.binaryType="nodebuffer"):this.ws.binaryType="arraybuffer",this.addEventListeners()}},n.prototype.addEventListeners=function(){var t=this;this.ws.onopen=function(){t.onOpen()},this.ws.onclose=function(){t.onClose()},this.ws.onmessage=function(e){t.onData(e.data)},this.ws.onerror=function(e){t.onError("websocket error",e)}},n.prototype.write=function(t){function e(){r.emit("flush"),setTimeout(function(){r.writable=!0,r.emit("drain")},0)}var r=this;this.writable=!1;for(var n=t.length,o=0,i=n;o<i;o++)!function(t){a.encodePacket(t,r.supportsBinary,function(o){if(!r.usingBrowserWebSocket){var i={};if(t.options&&(i.compress=t.options.compress),r.perMessageDeflate){var s="string"==typeof o?Buffer.byteLength(o):o.length;s<r.perMessageDeflate.threshold&&(i.compress=!1)}}try{r.usingBrowserWebSocket?r.ws.send(o):r.ws.send(o,i)}catch(t){}--n||e()})}(t[o])},n.prototype.onClose=function(){s.prototype.onClose.call(this)},n.prototype.doClose=function(){"undefined"!=typeof this.ws&&this.ws.close()},n.prototype.uri=function(){var t=this.query||{},e=this.secure?"wss":"ws",r="";this.port&&("wss"===e&&443!==Number(this.port)||"ws"===e&&80!==Number(this.port))&&(r=":"+this.port),this.timestampRequests&&(t[this.timestampParam]=h()),this.supportsBinary||(t.b64=1),t=c.encode(t),t.length&&(t="?"+t);var n=this.hostname.indexOf(":")!==-1;return e+"://"+(n?"["+this.hostname+"]":this.hostname)+r+this.path+t},n.prototype.check=function(){return!(!u||"__initialize"in u&&this.name===n.prototype.name)}},function(t,e){},function(t,e){var r=[].indexOf;t.exports=function(t,e){if(r)return t.indexOf(e);for(var n=0;n<t.length;++n)if(t[n]===e)return n;return-1}},function(t,e,r){"use strict";function n(t,e,r){this.io=t,this.nsp=e,this.json=this,this.ids=0,this.acks={},this.receiveBuffer=[],this.sendBuffer=[],this.connected=!1,this.disconnected=!0,this.flags={},r&&r.query&&(this.query=r.query),this.io.autoConnect&&this.open()}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=r(4),s=r(5),a=r(34),c=r(35),p=r(36),h=(r(3)("socket.io-client:socket"),r(26)),u=r(20);t.exports=e=n;var f={connect:1,connect_error:1,connect_timeout:1,connecting:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1,ping:1,pong:1},l=s.prototype.emit;s(n.prototype),n.prototype.subEvents=function(){if(!this.subs){var t=this.io;this.subs=[c(t,"open",p(this,"onopen")),c(t,"packet",p(this,"onpacket")),c(t,"close",p(this,"onclose"))]}},n.prototype.open=n.prototype.connect=function(){return this.connected?this:(this.subEvents(),this.io.open(),"open"===this.io.readyState&&this.onopen(),this.emit("connecting"),this)},n.prototype.send=function(){var t=a(arguments);return t.unshift("message"),this.emit.apply(this,t),this},n.prototype.emit=function(t){if(f.hasOwnProperty(t))return l.apply(this,arguments),this;var e=a(arguments),r={type:(void 0!==this.flags.binary?this.flags.binary:u(e))?i.BINARY_EVENT:i.EVENT,data:e};return r.options={},r.options.compress=!this.flags||!1!==this.flags.compress,"function"==typeof e[e.length-1]&&(this.acks[this.ids]=e.pop(),r.id=this.ids++),this.connected?this.packet(r):this.sendBuffer.push(r),this.flags={},this},n.prototype.packet=function(t){t.nsp=this.nsp,this.io.packet(t)},n.prototype.onopen=function(){if("/"!==this.nsp)if(this.query){var t="object"===o(this.query)?h.encode(this.query):this.query;this.packet({type:i.CONNECT,query:t})}else this.packet({type:i.CONNECT})},n.prototype.onclose=function(t){this.connected=!1,this.disconnected=!0,delete this.id,this.emit("disconnect",t)},n.prototype.onpacket=function(t){var e=t.nsp===this.nsp,r=t.type===i.ERROR&&"/"===t.nsp;if(e||r)switch(t.type){case i.CONNECT:this.onconnect();break;case i.EVENT:this.onevent(t);break;case i.BINARY_EVENT:this.onevent(t);break;case i.ACK:this.onack(t);break;case i.BINARY_ACK:this.onack(t);break;case i.DISCONNECT:this.ondisconnect();break;case i.ERROR:this.emit("error",t.data)}},n.prototype.onevent=function(t){var e=t.data||[];null!=t.id&&e.push(this.ack(t.id)),this.connected?l.apply(this,e):this.receiveBuffer.push(e)},n.prototype.ack=function(t){var e=this,r=!1;return function(){if(!r){r=!0;var n=a(arguments);e.packet({type:u(n)?i.BINARY_ACK:i.ACK,id:t,data:n})}}},n.prototype.onack=function(t){var e=this.acks[t.id];"function"==typeof e&&(e.apply(this,t.data),delete this.acks[t.id])},n.prototype.onconnect=function(){this.connected=!0,this.disconnected=!1,this.emit("connect"),this.emitBuffered()},n.prototype.emitBuffered=function(){var t;for(t=0;t<this.receiveBuffer.length;t++)l.apply(this,this.receiveBuffer[t]);for(this.receiveBuffer=[],t=0;t<this.sendBuffer.length;t++)this.packet(this.sendBuffer[t]);this.sendBuffer=[]},n.prototype.ondisconnect=function(){this.destroy(),this.onclose("io server disconnect")},n.prototype.destroy=function(){if(this.subs){for(var t=0;t<this.subs.length;t++)this.subs[t].destroy();this.subs=null}this.io.destroy(this)},n.prototype.close=n.prototype.disconnect=function(){return this.connected&&this.packet({type:i.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this},n.prototype.compress=function(t){return this.flags.compress=t,this},n.prototype.binary=function(t){return this.flags.binary=t,this}},function(t,e){function r(t,e){var r=[];e=e||0;for(var n=e||0;n<t.length;n++)r[n-e]=t[n];return r}t.exports=r},function(t,e){"use strict";function r(t,e,r){return t.on(e,r),{destroy:function(){t.removeListener(e,r)}}}t.exports=r},function(t,e){var r=[].slice;t.exports=function(t,e){if("string"==typeof e&&(e=t[e]),"function"!=typeof e)throw new Error("bind() requires a function");var n=r.call(arguments,2);return function(){return e.apply(t,n.concat(r.call(arguments)))}}},function(t,e){function r(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}t.exports=r,r.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),r=Math.floor(e*this.jitter*t);t=0==(1&Math.floor(10*e))?t-r:t+r}return 0|Math.min(t,this.max)},r.prototype.reset=function(){this.attempts=0},r.prototype.setMin=function(t){this.ms=t},r.prototype.setMax=function(t){this.max=t},r.prototype.setJitter=function(t){this.jitter=t}}])});
//# sourceMappingURL=socket.io.slim.js.map
/*!
 * Bootstrap v3.4.1 (https://getbootstrap.com/)
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under the MIT license
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");!function(t){"use strict";var e=jQuery.fn.jquery.split(" ")[0].split(".");if(e[0]<2&&e[1]<9||1==e[0]&&9==e[1]&&e[2]<1||3<e[0])throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4")}(),function(n){"use strict";n.fn.emulateTransitionEnd=function(t){var e=!1,i=this;n(this).one("bsTransitionEnd",function(){e=!0});return setTimeout(function(){e||n(i).trigger(n.support.transition.end)},t),this},n(function(){n.support.transition=function o(){var t=document.createElement("bootstrap"),e={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var i in e)if(t.style[i]!==undefined)return{end:e[i]};return!1}(),n.support.transition&&(n.event.special.bsTransitionEnd={bindType:n.support.transition.end,delegateType:n.support.transition.end,handle:function(t){if(n(t.target).is(this))return t.handleObj.handler.apply(this,arguments)}})})}(jQuery),function(s){"use strict";var e='[data-dismiss="alert"]',a=function(t){s(t).on("click",e,this.close)};a.VERSION="3.4.1",a.TRANSITION_DURATION=150,a.prototype.close=function(t){var e=s(this),i=e.attr("data-target");i||(i=(i=e.attr("href"))&&i.replace(/.*(?=#[^\s]*$)/,"")),i="#"===i?[]:i;var o=s(document).find(i);function n(){o.detach().trigger("closed.bs.alert").remove()}t&&t.preventDefault(),o.length||(o=e.closest(".alert")),o.trigger(t=s.Event("close.bs.alert")),t.isDefaultPrevented()||(o.removeClass("in"),s.support.transition&&o.hasClass("fade")?o.one("bsTransitionEnd",n).emulateTransitionEnd(a.TRANSITION_DURATION):n())};var t=s.fn.alert;s.fn.alert=function o(i){return this.each(function(){var t=s(this),e=t.data("bs.alert");e||t.data("bs.alert",e=new a(this)),"string"==typeof i&&e[i].call(t)})},s.fn.alert.Constructor=a,s.fn.alert.noConflict=function(){return s.fn.alert=t,this},s(document).on("click.bs.alert.data-api",e,a.prototype.close)}(jQuery),function(s){"use strict";var n=function(t,e){this.$element=s(t),this.options=s.extend({},n.DEFAULTS,e),this.isLoading=!1};function i(o){return this.each(function(){var t=s(this),e=t.data("bs.button"),i="object"==typeof o&&o;e||t.data("bs.button",e=new n(this,i)),"toggle"==o?e.toggle():o&&e.setState(o)})}n.VERSION="3.4.1",n.DEFAULTS={loadingText:"loading..."},n.prototype.setState=function(t){var e="disabled",i=this.$element,o=i.is("input")?"val":"html",n=i.data();t+="Text",null==n.resetText&&i.data("resetText",i[o]()),setTimeout(s.proxy(function(){i[o](null==n[t]?this.options[t]:n[t]),"loadingText"==t?(this.isLoading=!0,i.addClass(e).attr(e,e).prop(e,!0)):this.isLoading&&(this.isLoading=!1,i.removeClass(e).removeAttr(e).prop(e,!1))},this),0)},n.prototype.toggle=function(){var t=!0,e=this.$element.closest('[data-toggle="buttons"]');if(e.length){var i=this.$element.find("input");"radio"==i.prop("type")?(i.prop("checked")&&(t=!1),e.find(".active").removeClass("active"),this.$element.addClass("active")):"checkbox"==i.prop("type")&&(i.prop("checked")!==this.$element.hasClass("active")&&(t=!1),this.$element.toggleClass("active")),i.prop("checked",this.$element.hasClass("active")),t&&i.trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active")};var t=s.fn.button;s.fn.button=i,s.fn.button.Constructor=n,s.fn.button.noConflict=function(){return s.fn.button=t,this},s(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(t){var e=s(t.target).closest(".btn");i.call(e,"toggle"),s(t.target).is('input[type="radio"], input[type="checkbox"]')||(t.preventDefault(),e.is("input,button")?e.trigger("focus"):e.find("input:visible,button:visible").first().trigger("focus"))}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(t){s(t.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(t.type))})}(jQuery),function(p){"use strict";var c=function(t,e){this.$element=p(t),this.$indicators=this.$element.find(".carousel-indicators"),this.options=e,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",p.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",p.proxy(this.pause,this)).on("mouseleave.bs.carousel",p.proxy(this.cycle,this))};function r(n){return this.each(function(){var t=p(this),e=t.data("bs.carousel"),i=p.extend({},c.DEFAULTS,t.data(),"object"==typeof n&&n),o="string"==typeof n?n:i.slide;e||t.data("bs.carousel",e=new c(this,i)),"number"==typeof n?e.to(n):o?e[o]():i.interval&&e.pause().cycle()})}c.VERSION="3.4.1",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(t){if(!/input|textarea/i.test(t.target.tagName)){switch(t.which){case 37:this.prev();break;case 39:this.next();break;default:return}t.preventDefault()}},c.prototype.cycle=function(t){return t||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(p.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(t){return this.$items=t.parent().children(".item"),this.$items.index(t||this.$active)},c.prototype.getItemForDirection=function(t,e){var i=this.getItemIndex(e);if(("prev"==t&&0===i||"next"==t&&i==this.$items.length-1)&&!this.options.wrap)return e;var o=(i+("prev"==t?-1:1))%this.$items.length;return this.$items.eq(o)},c.prototype.to=function(t){var e=this,i=this.getItemIndex(this.$active=this.$element.find(".item.active"));if(!(t>this.$items.length-1||t<0))return this.sliding?this.$element.one("slid.bs.carousel",function(){e.to(t)}):i==t?this.pause().cycle():this.slide(i<t?"next":"prev",this.$items.eq(t))},c.prototype.pause=function(t){return t||(this.paused=!0),this.$element.find(".next, .prev").length&&p.support.transition&&(this.$element.trigger(p.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){if(!this.sliding)return this.slide("next")},c.prototype.prev=function(){if(!this.sliding)return this.slide("prev")},c.prototype.slide=function(t,e){var i=this.$element.find(".item.active"),o=e||this.getItemForDirection(t,i),n=this.interval,s="next"==t?"left":"right",a=this;if(o.hasClass("active"))return this.sliding=!1;var r=o[0],l=p.Event("slide.bs.carousel",{relatedTarget:r,direction:s});if(this.$element.trigger(l),!l.isDefaultPrevented()){if(this.sliding=!0,n&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var h=p(this.$indicators.children()[this.getItemIndex(o)]);h&&h.addClass("active")}var d=p.Event("slid.bs.carousel",{relatedTarget:r,direction:s});return p.support.transition&&this.$element.hasClass("slide")?(o.addClass(t),"object"==typeof o&&o.length&&o[0].offsetWidth,i.addClass(s),o.addClass(s),i.one("bsTransitionEnd",function(){o.removeClass([t,s].join(" ")).addClass("active"),i.removeClass(["active",s].join(" ")),a.sliding=!1,setTimeout(function(){a.$element.trigger(d)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(i.removeClass("active"),o.addClass("active"),this.sliding=!1,this.$element.trigger(d)),n&&this.cycle(),this}};var t=p.fn.carousel;p.fn.carousel=r,p.fn.carousel.Constructor=c,p.fn.carousel.noConflict=function(){return p.fn.carousel=t,this};var e=function(t){var e=p(this),i=e.attr("href");i&&(i=i.replace(/.*(?=#[^\s]+$)/,""));var o=e.attr("data-target")||i,n=p(document).find(o);if(n.hasClass("carousel")){var s=p.extend({},n.data(),e.data()),a=e.attr("data-slide-to");a&&(s.interval=!1),r.call(n,s),a&&n.data("bs.carousel").to(a),t.preventDefault()}};p(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),p(window).on("load",function(){p('[data-ride="carousel"]').each(function(){var t=p(this);r.call(t,t.data())})})}(jQuery),function(a){"use strict";var r=function(t,e){this.$element=a(t),this.options=a.extend({},r.DEFAULTS,e),this.$trigger=a('[data-toggle="collapse"][href="#'+t.id+'"],[data-toggle="collapse"][data-target="#'+t.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};function n(t){var e,i=t.attr("data-target")||(e=t.attr("href"))&&e.replace(/.*(?=#[^\s]+$)/,"");return a(document).find(i)}function l(o){return this.each(function(){var t=a(this),e=t.data("bs.collapse"),i=a.extend({},r.DEFAULTS,t.data(),"object"==typeof o&&o);!e&&i.toggle&&/show|hide/.test(o)&&(i.toggle=!1),e||t.data("bs.collapse",e=new r(this,i)),"string"==typeof o&&e[o]()})}r.VERSION="3.4.1",r.TRANSITION_DURATION=350,r.DEFAULTS={toggle:!0},r.prototype.dimension=function(){return this.$element.hasClass("width")?"width":"height"},r.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var t,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(t=e.data("bs.collapse"))&&t.transitioning)){var i=a.Event("show.bs.collapse");if(this.$element.trigger(i),!i.isDefaultPrevented()){e&&e.length&&(l.call(e,"hide"),t||e.data("bs.collapse",null));var o=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[o](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var n=function(){this.$element.removeClass("collapsing").addClass("collapse in")[o](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return n.call(this);var s=a.camelCase(["scroll",o].join("-"));this.$element.one("bsTransitionEnd",a.proxy(n,this)).emulateTransitionEnd(r.TRANSITION_DURATION)[o](this.$element[0][s])}}}},r.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var t=a.Event("hide.bs.collapse");if(this.$element.trigger(t),!t.isDefaultPrevented()){var e=this.dimension();this.$element[e](this.$element[e]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var i=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};if(!a.support.transition)return i.call(this);this.$element[e](0).one("bsTransitionEnd",a.proxy(i,this)).emulateTransitionEnd(r.TRANSITION_DURATION)}}},r.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},r.prototype.getParent=function(){return a(document).find(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(t,e){var i=a(e);this.addAriaAndCollapsedClass(n(i),i)},this)).end()},r.prototype.addAriaAndCollapsedClass=function(t,e){var i=t.hasClass("in");t.attr("aria-expanded",i),e.toggleClass("collapsed",!i).attr("aria-expanded",i)};var t=a.fn.collapse;a.fn.collapse=l,a.fn.collapse.Constructor=r,a.fn.collapse.noConflict=function(){return a.fn.collapse=t,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(t){var e=a(this);e.attr("data-target")||t.preventDefault();var i=n(e),o=i.data("bs.collapse")?"toggle":e.data();l.call(i,o)})}(jQuery),function(a){"use strict";var r='[data-toggle="dropdown"]',o=function(t){a(t).on("click.bs.dropdown",this.toggle)};function l(t){var e=t.attr("data-target");e||(e=(e=t.attr("href"))&&/#[A-Za-z]/.test(e)&&e.replace(/.*(?=#[^\s]*$)/,""));var i="#"!==e?a(document).find(e):null;return i&&i.length?i:t.parent()}function s(o){o&&3===o.which||(a(".dropdown-backdrop").remove(),a(r).each(function(){var t=a(this),e=l(t),i={relatedTarget:this};e.hasClass("open")&&(o&&"click"==o.type&&/input|textarea/i.test(o.target.tagName)&&a.contains(e[0],o.target)||(e.trigger(o=a.Event("hide.bs.dropdown",i)),o.isDefaultPrevented()||(t.attr("aria-expanded","false"),e.removeClass("open").trigger(a.Event("hidden.bs.dropdown",i)))))}))}o.VERSION="3.4.1",o.prototype.toggle=function(t){var e=a(this);if(!e.is(".disabled, :disabled")){var i=l(e),o=i.hasClass("open");if(s(),!o){"ontouchstart"in document.documentElement&&!i.closest(".navbar-nav").length&&a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click",s);var n={relatedTarget:this};if(i.trigger(t=a.Event("show.bs.dropdown",n)),t.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),i.toggleClass("open").trigger(a.Event("shown.bs.dropdown",n))}return!1}},o.prototype.keydown=function(t){if(/(38|40|27|32)/.test(t.which)&&!/input|textarea/i.test(t.target.tagName)){var e=a(this);if(t.preventDefault(),t.stopPropagation(),!e.is(".disabled, :disabled")){var i=l(e),o=i.hasClass("open");if(!o&&27!=t.which||o&&27==t.which)return 27==t.which&&i.find(r).trigger("focus"),e.trigger("click");var n=i.find(".dropdown-menu li:not(.disabled):visible a");if(n.length){var s=n.index(t.target);38==t.which&&0<s&&s--,40==t.which&&s<n.length-1&&s++,~s||(s=0),n.eq(s).trigger("focus")}}}};var t=a.fn.dropdown;a.fn.dropdown=function e(i){return this.each(function(){var t=a(this),e=t.data("bs.dropdown");e||t.data("bs.dropdown",e=new o(this)),"string"==typeof i&&e[i].call(t)})},a.fn.dropdown.Constructor=o,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=t,this},a(document).on("click.bs.dropdown.data-api",s).on("click.bs.dropdown.data-api",".dropdown form",function(t){t.stopPropagation()}).on("click.bs.dropdown.data-api",r,o.prototype.toggle).on("keydown.bs.dropdown.data-api",r,o.prototype.keydown).on("keydown.bs.dropdown.data-api",".dropdown-menu",o.prototype.keydown)}(jQuery),function(a){"use strict";var s=function(t,e){this.options=e,this.$body=a(document.body),this.$element=a(t),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.fixedContent=".navbar-fixed-top, .navbar-fixed-bottom",this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};function r(o,n){return this.each(function(){var t=a(this),e=t.data("bs.modal"),i=a.extend({},s.DEFAULTS,t.data(),"object"==typeof o&&o);e||t.data("bs.modal",e=new s(this,i)),"string"==typeof o?e[o](n):i.show&&e.show(n)})}s.VERSION="3.4.1",s.TRANSITION_DURATION=300,s.BACKDROP_TRANSITION_DURATION=150,s.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},s.prototype.toggle=function(t){return this.isShown?this.hide():this.show(t)},s.prototype.show=function(i){var o=this,t=a.Event("show.bs.modal",{relatedTarget:i});this.$element.trigger(t),this.isShown||t.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){o.$element.one("mouseup.dismiss.bs.modal",function(t){a(t.target).is(o.$element)&&(o.ignoreBackdropClick=!0)})}),this.backdrop(function(){var t=a.support.transition&&o.$element.hasClass("fade");o.$element.parent().length||o.$element.appendTo(o.$body),o.$element.show().scrollTop(0),o.adjustDialog(),t&&o.$element[0].offsetWidth,o.$element.addClass("in"),o.enforceFocus();var e=a.Event("shown.bs.modal",{relatedTarget:i});t?o.$dialog.one("bsTransitionEnd",function(){o.$element.trigger("focus").trigger(e)}).emulateTransitionEnd(s.TRANSITION_DURATION):o.$element.trigger("focus").trigger(e)}))},s.prototype.hide=function(t){t&&t.preventDefault(),t=a.Event("hide.bs.modal"),this.$element.trigger(t),this.isShown&&!t.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(s.TRANSITION_DURATION):this.hideModal())},s.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(t){document===t.target||this.$element[0]===t.target||this.$element.has(t.target).length||this.$element.trigger("focus")},this))},s.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(t){27==t.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},s.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},s.prototype.hideModal=function(){var t=this;this.$element.hide(),this.backdrop(function(){t.$body.removeClass("modal-open"),t.resetAdjustments(),t.resetScrollbar(),t.$element.trigger("hidden.bs.modal")})},s.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},s.prototype.backdrop=function(t){var e=this,i=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var o=a.support.transition&&i;if(this.$backdrop=a(document.createElement("div")).addClass("modal-backdrop "+i).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(t){this.ignoreBackdropClick?this.ignoreBackdropClick=!1:t.target===t.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide())},this)),o&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!t)return;o?this.$backdrop.one("bsTransitionEnd",t).emulateTransitionEnd(s.BACKDROP_TRANSITION_DURATION):t()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var n=function(){e.removeBackdrop(),t&&t()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",n).emulateTransitionEnd(s.BACKDROP_TRANSITION_DURATION):n()}else t&&t()},s.prototype.handleUpdate=function(){this.adjustDialog()},s.prototype.adjustDialog=function(){var t=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&t?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!t?this.scrollbarWidth:""})},s.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},s.prototype.checkScrollbar=function(){var t=window.innerWidth;if(!t){var e=document.documentElement.getBoundingClientRect();t=e.right-Math.abs(e.left)}this.bodyIsOverflowing=document.body.clientWidth<t,this.scrollbarWidth=this.measureScrollbar()},s.prototype.setScrollbar=function(){var t=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"";var n=this.scrollbarWidth;this.bodyIsOverflowing&&(this.$body.css("padding-right",t+n),a(this.fixedContent).each(function(t,e){var i=e.style.paddingRight,o=a(e).css("padding-right");a(e).data("padding-right",i).css("padding-right",parseFloat(o)+n+"px")}))},s.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad),a(this.fixedContent).each(function(t,e){var i=a(e).data("padding-right");a(e).removeData("padding-right"),e.style.paddingRight=i||""})},s.prototype.measureScrollbar=function(){var t=document.createElement("div");t.className="modal-scrollbar-measure",this.$body.append(t);var e=t.offsetWidth-t.clientWidth;return this.$body[0].removeChild(t),e};var t=a.fn.modal;a.fn.modal=r,a.fn.modal.Constructor=s,a.fn.modal.noConflict=function(){return a.fn.modal=t,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(t){var e=a(this),i=e.attr("href"),o=e.attr("data-target")||i&&i.replace(/.*(?=#[^\s]+$)/,""),n=a(document).find(o),s=n.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(i)&&i},n.data(),e.data());e.is("a")&&t.preventDefault(),n.one("show.bs.modal",function(t){t.isDefaultPrevented()||n.one("hidden.bs.modal",function(){e.is(":visible")&&e.trigger("focus")})}),r.call(n,s,this)})}(jQuery),function(g){"use strict";var o=["sanitize","whiteList","sanitizeFn"],a=["background","cite","href","itemtype","longdesc","poster","src","xlink:href"],t={"*":["class","dir","id","lang","role",/^aria-[\w-]*$/i],a:["target","href","title","rel"],area:[],b:[],br:[],col:[],code:[],div:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:["src","alt","title","width","height"],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]},r=/^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi,l=/^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;function u(t,e){var i=t.nodeName.toLowerCase();if(-1!==g.inArray(i,e))return-1===g.inArray(i,a)||Boolean(t.nodeValue.match(r)||t.nodeValue.match(l));for(var o=g(e).filter(function(t,e){return e instanceof RegExp}),n=0,s=o.length;n<s;n++)if(i.match(o[n]))return!0;return!1}function n(t,e,i){if(0===t.length)return t;if(i&&"function"==typeof i)return i(t);if(!document.implementation||!document.implementation.createHTMLDocument)return t;var o=document.implementation.createHTMLDocument("sanitization");o.body.innerHTML=t;for(var n=g.map(e,function(t,e){return e}),s=g(o.body).find("*"),a=0,r=s.length;a<r;a++){var l=s[a],h=l.nodeName.toLowerCase();if(-1!==g.inArray(h,n))for(var d=g.map(l.attributes,function(t){return t}),p=[].concat(e["*"]||[],e[h]||[]),c=0,f=d.length;c<f;c++)u(d[c],p)||l.removeAttribute(d[c].nodeName);else l.parentNode.removeChild(l)}return o.body.innerHTML}var m=function(t,e){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.inState=null,this.init("tooltip",t,e)};m.VERSION="3.4.1",m.TRANSITION_DURATION=150,m.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0},sanitize:!0,sanitizeFn:null,whiteList:t},m.prototype.init=function(t,e,i){if(this.enabled=!0,this.type=t,this.$element=g(e),this.options=this.getOptions(i),this.$viewport=this.options.viewport&&g(document).find(g.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var o=this.options.trigger.split(" "),n=o.length;n--;){var s=o[n];if("click"==s)this.$element.on("click."+this.type,this.options.selector,g.proxy(this.toggle,this));else if("manual"!=s){var a="hover"==s?"mouseenter":"focusin",r="hover"==s?"mouseleave":"focusout";this.$element.on(a+"."+this.type,this.options.selector,g.proxy(this.enter,this)),this.$element.on(r+"."+this.type,this.options.selector,g.proxy(this.leave,this))}}this.options.selector?this._options=g.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},m.prototype.getDefaults=function(){return m.DEFAULTS},m.prototype.getOptions=function(t){var e=this.$element.data();for(var i in e)e.hasOwnProperty(i)&&-1!==g.inArray(i,o)&&delete e[i];return(t=g.extend({},this.getDefaults(),e,t)).delay&&"number"==typeof t.delay&&(t.delay={show:t.delay,hide:t.delay}),t.sanitize&&(t.template=n(t.template,t.whiteList,t.sanitizeFn)),t},m.prototype.getDelegateOptions=function(){var i={},o=this.getDefaults();return this._options&&g.each(this._options,function(t,e){o[t]!=e&&(i[t]=e)}),i},m.prototype.enter=function(t){var e=t instanceof this.constructor?t:g(t.currentTarget).data("bs."+this.type);if(e||(e=new this.constructor(t.currentTarget,this.getDelegateOptions()),g(t.currentTarget).data("bs."+this.type,e)),t instanceof g.Event&&(e.inState["focusin"==t.type?"focus":"hover"]=!0),e.tip().hasClass("in")||"in"==e.hoverState)e.hoverState="in";else{if(clearTimeout(e.timeout),e.hoverState="in",!e.options.delay||!e.options.delay.show)return e.show();e.timeout=setTimeout(function(){"in"==e.hoverState&&e.show()},e.options.delay.show)}},m.prototype.isInStateTrue=function(){for(var t in this.inState)if(this.inState[t])return!0;return!1},m.prototype.leave=function(t){var e=t instanceof this.constructor?t:g(t.currentTarget).data("bs."+this.type);if(e||(e=new this.constructor(t.currentTarget,this.getDelegateOptions()),g(t.currentTarget).data("bs."+this.type,e)),t instanceof g.Event&&(e.inState["focusout"==t.type?"focus":"hover"]=!1),!e.isInStateTrue()){if(clearTimeout(e.timeout),e.hoverState="out",!e.options.delay||!e.options.delay.hide)return e.hide();e.timeout=setTimeout(function(){"out"==e.hoverState&&e.hide()},e.options.delay.hide)}},m.prototype.show=function(){var t=g.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(t);var e=g.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(t.isDefaultPrevented()||!e)return;var i=this,o=this.tip(),n=this.getUID(this.type);this.setContent(),o.attr("id",n),this.$element.attr("aria-describedby",n),this.options.animation&&o.addClass("fade");var s="function"==typeof this.options.placement?this.options.placement.call(this,o[0],this.$element[0]):this.options.placement,a=/\s?auto?\s?/i,r=a.test(s);r&&(s=s.replace(a,"")||"top"),o.detach().css({top:0,left:0,display:"block"}).addClass(s).data("bs."+this.type,this),this.options.container?o.appendTo(g(document).find(this.options.container)):o.insertAfter(this.$element),this.$element.trigger("inserted.bs."+this.type);var l=this.getPosition(),h=o[0].offsetWidth,d=o[0].offsetHeight;if(r){var p=s,c=this.getPosition(this.$viewport);s="bottom"==s&&l.bottom+d>c.bottom?"top":"top"==s&&l.top-d<c.top?"bottom":"right"==s&&l.right+h>c.width?"left":"left"==s&&l.left-h<c.left?"right":s,o.removeClass(p).addClass(s)}var f=this.getCalculatedOffset(s,l,h,d);this.applyPlacement(f,s);var u=function(){var t=i.hoverState;i.$element.trigger("shown.bs."+i.type),i.hoverState=null,"out"==t&&i.leave(i)};g.support.transition&&this.$tip.hasClass("fade")?o.one("bsTransitionEnd",u).emulateTransitionEnd(m.TRANSITION_DURATION):u()}},m.prototype.applyPlacement=function(t,e){var i=this.tip(),o=i[0].offsetWidth,n=i[0].offsetHeight,s=parseInt(i.css("margin-top"),10),a=parseInt(i.css("margin-left"),10);isNaN(s)&&(s=0),isNaN(a)&&(a=0),t.top+=s,t.left+=a,g.offset.setOffset(i[0],g.extend({using:function(t){i.css({top:Math.round(t.top),left:Math.round(t.left)})}},t),0),i.addClass("in");var r=i[0].offsetWidth,l=i[0].offsetHeight;"top"==e&&l!=n&&(t.top=t.top+n-l);var h=this.getViewportAdjustedDelta(e,t,r,l);h.left?t.left+=h.left:t.top+=h.top;var d=/top|bottom/.test(e),p=d?2*h.left-o+r:2*h.top-n+l,c=d?"offsetWidth":"offsetHeight";i.offset(t),this.replaceArrow(p,i[0][c],d)},m.prototype.replaceArrow=function(t,e,i){this.arrow().css(i?"left":"top",50*(1-t/e)+"%").css(i?"top":"left","")},m.prototype.setContent=function(){var t=this.tip(),e=this.getTitle();this.options.html?(this.options.sanitize&&(e=n(e,this.options.whiteList,this.options.sanitizeFn)),t.find(".tooltip-inner").html(e)):t.find(".tooltip-inner").text(e),t.removeClass("fade in top bottom left right")},m.prototype.hide=function(t){var e=this,i=g(this.$tip),o=g.Event("hide.bs."+this.type);function n(){"in"!=e.hoverState&&i.detach(),e.$element&&e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),t&&t()}if(this.$element.trigger(o),!o.isDefaultPrevented())return i.removeClass("in"),g.support.transition&&i.hasClass("fade")?i.one("bsTransitionEnd",n).emulateTransitionEnd(m.TRANSITION_DURATION):n(),this.hoverState=null,this},m.prototype.fixTitle=function(){var t=this.$element;(t.attr("title")||"string"!=typeof t.attr("data-original-title"))&&t.attr("data-original-title",t.attr("title")||"").attr("title","")},m.prototype.hasContent=function(){return this.getTitle()},m.prototype.getPosition=function(t){var e=(t=t||this.$element)[0],i="BODY"==e.tagName,o=e.getBoundingClientRect();null==o.width&&(o=g.extend({},o,{width:o.right-o.left,height:o.bottom-o.top}));var n=window.SVGElement&&e instanceof window.SVGElement,s=i?{top:0,left:0}:n?null:t.offset(),a={scroll:i?document.documentElement.scrollTop||document.body.scrollTop:t.scrollTop()},r=i?{width:g(window).width(),height:g(window).height()}:null;return g.extend({},o,a,r,s)},m.prototype.getCalculatedOffset=function(t,e,i,o){return"bottom"==t?{top:e.top+e.height,left:e.left+e.width/2-i/2}:"top"==t?{top:e.top-o,left:e.left+e.width/2-i/2}:"left"==t?{top:e.top+e.height/2-o/2,left:e.left-i}:{top:e.top+e.height/2-o/2,left:e.left+e.width}},m.prototype.getViewportAdjustedDelta=function(t,e,i,o){var n={top:0,left:0};if(!this.$viewport)return n;var s=this.options.viewport&&this.options.viewport.padding||0,a=this.getPosition(this.$viewport);if(/right|left/.test(t)){var r=e.top-s-a.scroll,l=e.top+s-a.scroll+o;r<a.top?n.top=a.top-r:l>a.top+a.height&&(n.top=a.top+a.height-l)}else{var h=e.left-s,d=e.left+s+i;h<a.left?n.left=a.left-h:d>a.right&&(n.left=a.left+a.width-d)}return n},m.prototype.getTitle=function(){var t=this.$element,e=this.options;return t.attr("data-original-title")||("function"==typeof e.title?e.title.call(t[0]):e.title)},m.prototype.getUID=function(t){for(;t+=~~(1e6*Math.random()),document.getElementById(t););return t},m.prototype.tip=function(){if(!this.$tip&&(this.$tip=g(this.options.template),1!=this.$tip.length))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip},m.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},m.prototype.enable=function(){this.enabled=!0},m.prototype.disable=function(){this.enabled=!1},m.prototype.toggleEnabled=function(){this.enabled=!this.enabled},m.prototype.toggle=function(t){var e=this;t&&((e=g(t.currentTarget).data("bs."+this.type))||(e=new this.constructor(t.currentTarget,this.getDelegateOptions()),g(t.currentTarget).data("bs."+this.type,e))),t?(e.inState.click=!e.inState.click,e.isInStateTrue()?e.enter(e):e.leave(e)):e.tip().hasClass("in")?e.leave(e):e.enter(e)},m.prototype.destroy=function(){var t=this;clearTimeout(this.timeout),this.hide(function(){t.$element.off("."+t.type).removeData("bs."+t.type),t.$tip&&t.$tip.detach(),t.$tip=null,t.$arrow=null,t.$viewport=null,t.$element=null})},m.prototype.sanitizeHtml=function(t){return n(t,this.options.whiteList,this.options.sanitizeFn)};var e=g.fn.tooltip;g.fn.tooltip=function i(o){return this.each(function(){var t=g(this),e=t.data("bs.tooltip"),i="object"==typeof o&&o;!e&&/destroy|hide/.test(o)||(e||t.data("bs.tooltip",e=new m(this,i)),"string"==typeof o&&e[o]())})},g.fn.tooltip.Constructor=m,g.fn.tooltip.noConflict=function(){return g.fn.tooltip=e,this}}(jQuery),function(n){"use strict";var s=function(t,e){this.init("popover",t,e)};if(!n.fn.tooltip)throw new Error("Popover requires tooltip.js");s.VERSION="3.4.1",s.DEFAULTS=n.extend({},n.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),((s.prototype=n.extend({},n.fn.tooltip.Constructor.prototype)).constructor=s).prototype.getDefaults=function(){return s.DEFAULTS},s.prototype.setContent=function(){var t=this.tip(),e=this.getTitle(),i=this.getContent();if(this.options.html){var o=typeof i;this.options.sanitize&&(e=this.sanitizeHtml(e),"string"===o&&(i=this.sanitizeHtml(i))),t.find(".popover-title").html(e),t.find(".popover-content").children().detach().end()["string"===o?"html":"append"](i)}else t.find(".popover-title").text(e),t.find(".popover-content").children().detach().end().text(i);t.removeClass("fade top bottom left right in"),t.find(".popover-title").html()||t.find(".popover-title").hide()},s.prototype.hasContent=function(){return this.getTitle()||this.getContent()},s.prototype.getContent=function(){var t=this.$element,e=this.options;return t.attr("data-content")||("function"==typeof e.content?e.content.call(t[0]):e.content)},s.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var t=n.fn.popover;n.fn.popover=function e(o){return this.each(function(){var t=n(this),e=t.data("bs.popover"),i="object"==typeof o&&o;!e&&/destroy|hide/.test(o)||(e||t.data("bs.popover",e=new s(this,i)),"string"==typeof o&&e[o]())})},n.fn.popover.Constructor=s,n.fn.popover.noConflict=function(){return n.fn.popover=t,this}}(jQuery),function(s){"use strict";function n(t,e){this.$body=s(document.body),this.$scrollElement=s(t).is(document.body)?s(window):s(t),this.options=s.extend({},n.DEFAULTS,e),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",s.proxy(this.process,this)),this.refresh(),this.process()}function e(o){return this.each(function(){var t=s(this),e=t.data("bs.scrollspy"),i="object"==typeof o&&o;e||t.data("bs.scrollspy",e=new n(this,i)),"string"==typeof o&&e[o]()})}n.VERSION="3.4.1",n.DEFAULTS={offset:10},n.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},n.prototype.refresh=function(){var t=this,o="offset",n=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),s.isWindow(this.$scrollElement[0])||(o="position",n=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var t=s(this),e=t.data("target")||t.attr("href"),i=/^#./.test(e)&&s(e);return i&&i.length&&i.is(":visible")&&[[i[o]().top+n,e]]||null}).sort(function(t,e){return t[0]-e[0]}).each(function(){t.offsets.push(this[0]),t.targets.push(this[1])})},n.prototype.process=function(){var t,e=this.$scrollElement.scrollTop()+this.options.offset,i=this.getScrollHeight(),o=this.options.offset+i-this.$scrollElement.height(),n=this.offsets,s=this.targets,a=this.activeTarget;if(this.scrollHeight!=i&&this.refresh(),o<=e)return a!=(t=s[s.length-1])&&this.activate(t);if(a&&e<n[0])return this.activeTarget=null,this.clear();for(t=n.length;t--;)a!=s[t]&&e>=n[t]&&(n[t+1]===undefined||e<n[t+1])&&this.activate(s[t])},n.prototype.activate=function(t){this.activeTarget=t,this.clear();var e=this.selector+'[data-target="'+t+'"],'+this.selector+'[href="'+t+'"]',i=s(e).parents("li").addClass("active");i.parent(".dropdown-menu").length&&(i=i.closest("li.dropdown").addClass("active")),i.trigger("activate.bs.scrollspy")},n.prototype.clear=function(){s(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var t=s.fn.scrollspy;s.fn.scrollspy=e,s.fn.scrollspy.Constructor=n,s.fn.scrollspy.noConflict=function(){return s.fn.scrollspy=t,this},s(window).on("load.bs.scrollspy.data-api",function(){s('[data-spy="scroll"]').each(function(){var t=s(this);e.call(t,t.data())})})}(jQuery),function(r){"use strict";var a=function(t){this.element=r(t)};function e(i){return this.each(function(){var t=r(this),e=t.data("bs.tab");e||t.data("bs.tab",e=new a(this)),"string"==typeof i&&e[i]()})}a.VERSION="3.4.1",a.TRANSITION_DURATION=150,a.prototype.show=function(){var t=this.element,e=t.closest("ul:not(.dropdown-menu)"),i=t.data("target");if(i||(i=(i=t.attr("href"))&&i.replace(/.*(?=#[^\s]*$)/,"")),!t.parent("li").hasClass("active")){var o=e.find(".active:last a"),n=r.Event("hide.bs.tab",{relatedTarget:t[0]}),s=r.Event("show.bs.tab",{relatedTarget:o[0]});if(o.trigger(n),t.trigger(s),!s.isDefaultPrevented()&&!n.isDefaultPrevented()){var a=r(document).find(i);this.activate(t.closest("li"),e),this.activate(a,a.parent(),function(){o.trigger({type:"hidden.bs.tab",relatedTarget:t[0]}),t.trigger({type:"shown.bs.tab",relatedTarget:o[0]})})}}},a.prototype.activate=function(t,e,i){var o=e.find("> .active"),n=i&&r.support.transition&&(o.length&&o.hasClass("fade")||!!e.find("> .fade").length);function s(){o.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),t.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),n?(t[0].offsetWidth,t.addClass("in")):t.removeClass("fade"),t.parent(".dropdown-menu").length&&t.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),i&&i()}o.length&&n?o.one("bsTransitionEnd",s).emulateTransitionEnd(a.TRANSITION_DURATION):s(),o.removeClass("in")};var t=r.fn.tab;r.fn.tab=e,r.fn.tab.Constructor=a,r.fn.tab.noConflict=function(){return r.fn.tab=t,this};var i=function(t){t.preventDefault(),e.call(r(this),"show")};r(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',i).on("click.bs.tab.data-api",'[data-toggle="pill"]',i)}(jQuery),function(l){"use strict";var h=function(t,e){this.options=l.extend({},h.DEFAULTS,e);var i=this.options.target===h.DEFAULTS.target?l(this.options.target):l(document).find(this.options.target);this.$target=i.on("scroll.bs.affix.data-api",l.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",l.proxy(this.checkPositionWithEventLoop,this)),this.$element=l(t),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};function i(o){return this.each(function(){var t=l(this),e=t.data("bs.affix"),i="object"==typeof o&&o;e||t.data("bs.affix",e=new h(this,i)),"string"==typeof o&&e[o]()})}h.VERSION="3.4.1",h.RESET="affix affix-top affix-bottom",h.DEFAULTS={offset:0,target:window},h.prototype.getState=function(t,e,i,o){var n=this.$target.scrollTop(),s=this.$element.offset(),a=this.$target.height();if(null!=i&&"top"==this.affixed)return n<i&&"top";if("bottom"==this.affixed)return null!=i?!(n+this.unpin<=s.top)&&"bottom":!(n+a<=t-o)&&"bottom";var r=null==this.affixed,l=r?n:s.top;return null!=i&&n<=i?"top":null!=o&&t-o<=l+(r?a:e)&&"bottom"},h.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(h.RESET).addClass("affix");var t=this.$target.scrollTop(),e=this.$element.offset();return this.pinnedOffset=e.top-t},h.prototype.checkPositionWithEventLoop=function(){setTimeout(l.proxy(this.checkPosition,this),1)},h.prototype.checkPosition=function(){if(this.$element.is(":visible")){var t=this.$element.height(),e=this.options.offset,i=e.top,o=e.bottom,n=Math.max(l(document).height(),l(document.body).height());"object"!=typeof e&&(o=i=e),"function"==typeof i&&(i=e.top(this.$element)),"function"==typeof o&&(o=e.bottom(this.$element));var s=this.getState(n,t,i,o);if(this.affixed!=s){null!=this.unpin&&this.$element.css("top","");var a="affix"+(s?"-"+s:""),r=l.Event(a+".bs.affix");if(this.$element.trigger(r),r.isDefaultPrevented())return;this.affixed=s,this.unpin="bottom"==s?this.getPinnedOffset():null,this.$element.removeClass(h.RESET).addClass(a).trigger(a.replace("affix","affixed")+".bs.affix")}"bottom"==s&&this.$element.offset({top:n-t-o})}};var t=l.fn.affix;l.fn.affix=i,l.fn.affix.Constructor=h,l.fn.affix.noConflict=function(){return l.fn.affix=t,this},l(window).on("load",function(){l('[data-spy="affix"]').each(function(){var t=l(this),e=t.data();e.offset=e.offset||{},null!=e.offsetBottom&&(e.offset.bottom=e.offsetBottom),null!=e.offsetTop&&(e.offset.top=e.offsetTop),i.call(t,e)})})}(jQuery);
/**
 *  group class Users list      ---->  user-list-components
 *  group class Public chat     ---->  public-chat-components
 *  group class Private chat    ---->  private-chat-components
 *  group class Announcements   ---->  announcements-components
 *
 *
 */
let currentContentPageID = '';
let oldContentPageID = '';
let currentContentGroupClass = '';
let userJWT = null;
let user_id = null;
let user_acknowledgement = null;
const apiPath = '/api';
let currentUser = null;
let selectedStatus = null;
let socket = null;
/**
 * On load init
 * @param  {[type]} ) {               if (Cookies.get('username') ! [description]
 * @return {[type]}   [description]
 */
$(function() {
    if (Cookies.get('username') !== undefined) {
        $('.user-name-reference').html(Cookies.get('username'));
    }
    socket = io('/');
    // initialize current user
    currentUser = new User();
    currentUser._id = Cookies.get('user-id');
    // init events for content change
    menuContentChangerEvent();
    globalContentChangerEvent();
    showElementEvent();
    hideElementEvent();
    // init JWT token
    userJWT = Cookies.get('user-jwt-esn');
    // user is not logged in
    if (userJWT == null || userJWT == undefined || userJWT == '') {
        if (window.location.pathname !== '/') {
            window.location.replace('/');
        }
    }
    // user is logged in
    else {
        // TODO test if cookie is expired
        user_id = Cookies.get('user-id');
        user_name = Cookies.get('username');
        user_acknowledgement = Cookies.get('user-acknowledgement');
        if (window.location.pathname == '/') {
            if (user_acknowledgement === 'true') {
                window.location.replace('/app');
            } else {
                swapViewContent('acknowledgement-page-content', 'main-content-block');
            }
        }
        User.getInstance().initCurrentUser();
        $('.hideadble-menu-item a').click(function(event) {
            $('.menu-less').parent().addClass('hidden');
            $('.menu-more').parent().removeClass('hidden');
            $('.hideadble-menu-item').removeClass('active-hideadble-menu-item').addClass('hidden');
            $(this).parent().addClass('active-hideadble-menu-item').removeClass('hidden');
        });
        $('.menu-more').click(function(event) {
            $('.menu-more').parent().addClass('hidden');
            $('.menu-less').parent().removeClass('hidden');
            $('.hideadble-menu-item:not(.active-hideadble-menu-item)').removeClass('hidden');
        });
        $('.menu-less').click(function(event) {
            $('.menu-less').parent().addClass('hidden');
            $('.menu-more').parent().removeClass('hidden');
            $('.hideadble-menu-item:not(.active-hideadble-menu-item)').addClass('hidden');
        });
    }
});


/**
 * Event registration for menu content changer buttons
 * @return {[type]} [description]
 */
function menuContentChangerEvent() {
    $('.menu-content-changer').click(function(event) {
        $('.menu-content-changer').removeClass('active');
        $('#status-button').removeClass('active');
        $(this).addClass('active');
        event.preventDefault();
        executeSwapContent($(this));
    });
}

/**
 * Event registration for content changer buttons that dont
 * @return {[type]} [description]
 */
function globalContentChangerEvent() {
    $('.content-changer').click(function(event) {
        executeSwapContent($(this));
    });
}

/**
 * Swaps content following id to display of group class to display and classes to hide
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function executeSwapContent(element) {
    const viewID = element.data('view-id');
    const subViewID = element.data('sub-view-id');
    const groupClass = element.data('view-group-class');
    let hideViewClass = element.data('hide-view-class');
    let hideSubViewClass = element.data('sub-view-hide-class');
    let hideGroupClass = element.data('group-hide-class');
    if (hideViewClass == undefined) {
        hideViewClass = 'main-content-block';
    }
    if (hideSubViewClass == undefined) {
        hideSubViewClass = 'hideable-group-component';
    }
    if (hideGroupClass == undefined) {
        hideGroupClass = 'hideable-group-component';
    }
    if (viewID != undefined && viewID != '') {
        swapViewContent(viewID, hideViewClass);
    }
    if (subViewID != undefined && subViewID != '') {
        swapViewContent(subViewID, hideSubViewClass);
    }
    if (groupClass != undefined && groupClass != '') {
        swapGroupContent(groupClass, hideGroupClass);
    }
}

/**
 * [showElementEvent description]
 * @return {[type]} [description]
 */
function showElementEvent() {
    $('.visible-controller').change(function(e) {
        const idToDisplay = $(this).data('id-to-display');
        const classToDisplay = $(this).data('class-to-display');
        showElements(idToDisplay, classToDisplay);
    });
    $('.visible-controller').click(function(e) {
        const idToDisplay = $(this).data('id-to-display');
        const classToDisplay = $(this).data('class-to-display');
        showElements(idToDisplay, classToDisplay);
    });
}

/**
 * [showElementEvent description]
 * @return {[type]} [description]
 */
function hideElementEvent() {
    $('.hide-controller').change(function(e) {
        const idToHide = $(this).data('id-to-hide');
        const classToHide = $(this).data('class-to-hide');
        hideElements(idToHide, classToHide);
    });
    $('.hide-controller').click(function(e) {
        const idToHide = $(this).data('id-to-hide');
        const classToHide = $(this).data('class-to-hide');
        hideElements(idToHide, classToHide);
    });
}

/**
 * hide and show actions
 */
/**
 * Swaps visible content. It receives an ID to show and hides everything with the class  main-content-block
 * @param  {[type]} viewID [description]
 * @return {[type]}       [description]
 */
function swapViewContent(viewID, classToHide) {
    if (classToHide == undefined) {
        classToHide = 'main-content-block';
    }
    $('.' + classToHide).addClass('hidden');
    $('#' + viewID).removeClass('hidden');
    $('.' + classToHide).addClass('hidden-main-content-block');
    $('#' + viewID).removeClass('hidden-main-content-block');
    oldContentPageID = currentContentPageID;
    currentContentPageID = viewID;
}

/**
 * [swapGroupContent description]
 * @param  {[type]} newGroupClass [description]
 * @return {[type]}               [description]
 */
function swapGroupContent(newGroupClass, classToHide) {
    $('.' + classToHide).addClass('hidden');
    $('.' + newGroupClass).removeClass('hidden');
    currentContentGroupClass = newGroupClass;
}
/**
 * Shows elements with a matching class or ID
 * @param  {[type]} idToDisplay    [description]
 * @param  {[type]} classToDisplay [description]
 * @return {[type]}                [description]
 */
function showElements(idToDisplay, classToDisplay) {
    if ($('#' + idToDisplay).length > 0) {
        $('#' + idToDisplay).removeClass('hidden');
    }
    if ($('.' + classToDisplay).length > 0) {
        $('.' + classToDisplay).removeClass('hidden');
    }
}
/**
 * Hides elements with a matching class or ID
 * @param  {[type]} idToHide    [description]
 * @param  {[type]} classToHide [description]
 * @return {[type]}             [description]
 */
function hideElements(idToHide, classToHide) {
    if ($('#' + idToHide).length > 0) {
        $('#' + idToHide).addClass('hidden');
    }
    if ($('.' + classToHide).length > 0) {
        $('.' + classToHide).addClass('hidden');
    }
}

// eslint-disable-next-line no-unused-vars
class GlobalEventDispatcher {
    /**
     * Call the API to notify that every user device should update the user list
     * @return {[type]} [description]
     */
    static updateAllUserLists() {
        APIHandler.getInstance().sendRequest('/usersList/', 'get', {}, true, null, false)
        .then( (res) => {})
        .catch( (err) => {});
    }
}

/**
 * Class that manages all API Requests
 */
class APIHandler {
    /**
     * Sends requests to API for every component or object using Jquery
     * @param  {[type]} url         [description]
     * @param  {[type]} operation   [description]
     * @param  {[type]} data        [description]
     * @param  {[type]} token       [description]
     * @param  {[type]} contentType [description]
     * @return {[type]}             [description]
     */
    sendRequest(url, operation, data, token, contentType, loader) {
        if(loader == undefined || loader === true){
            $('#boxloader').show();
        }

        const jwt = Cookies.get('user-jwt-esn');
        const contentTypeOption = contentType ?
            contentType : 'application/x-www-form-urlencoded; charset=UTF-8';
        const headers = token ? {
            Authorization: jwt
        } : {};
        const dataSend = data ? data : {};
        const options = {
            url: apiPath + url,
            type: operation,
            data: dataSend,
            headers: headers,
            contentType: contentTypeOption
        };

        return new Promise((resolve, reject) => {
            $.ajax(options)
                .done(function(response) {
                    resolve(response);
                })
                .fail(function(e) {
                    if (e.responseText === 'jwt expired' || e.responseText === 'invalid algorithm' || e.responseText === 'invalid token' ||
                        e.responseText === 'jwt malformed' || e.responseText === 'Too many requests from this IP') {
                        SignoutComponent.getInstance().removeCookies();
                        SignoutComponent.getInstance().signout();
                        return reject(false);
                    } else {
                        return reject(e);
                    }
                })
                .always(function() {
                    $('#boxloader').hide();
                });
        });
    }

    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance == null) {
            this.instance = new APIHandler();
        }
        return this.instance;
    }
}

// eslint-disable-next-line no-unused-vars
/**
 * Parent class for message drawing and sycing (private, public and announcements)
 */
class BaseMessage {

    /**
     * [constructor description]
     * @return {[type]} [description]
     */
    constructor(containerWall) {
        this._id = null;
        this.message = '';
        this.type = '';
        this.user_id = null;
        this.containerWall = containerWall;
        this.page = 0;
    }

    /**
     *
     * @param type
     * @param message
     */
    drawMessageItem(message) {
        if (message.sender_user_id != undefined) {
            message.user_id = message.sender_user_id;
        }
        if (message.user_id == null || message.user_id == undefined) {
            return;
        }
        // 1. find template
        const messagesTemplate = document
            .querySelector('template#' + this.type + '-template');
        // 2. find container
        const listContainer = document.getElementById(this.type + '-chat');

        if (listContainer != undefined) {
            const listLength = $('#'+this.type + '-chat > li').length;
            // 3. iterate over users list and draw using the
            // appropiate template based on online/offline state
            const template = messagesTemplate.content.cloneNode(true);
            if (template != undefined && template !=
                null && message != undefined) {
                let rowType = 'even';
                if (listLength % 2 == 1) {
                    rowType = 'odd';
                }
                template.querySelector('.user-post')
                    .classList.add('user-post-' + rowType);

                const user_id = Cookies.get('user-id');
                if (user_id === message.user_id._id) {
                    template.querySelector('.user-post')
                        .classList.add('user-post-current');
                }
                let indicatorStyle = '';
                if (message.status != undefined && message.status != '') {
                    const userStatusLC = message.status.toLowerCase();
                    indicatorStyle = 'background-color-' + userStatusLC;

                    template.querySelector('.status-indicator-element')
                        .classList.add('statusIndicator');
                    if (indicatorStyle != '') {
                        template.querySelector('.status-indicator-element')
                            .classList.add(indicatorStyle);
                    }
                }
                if (!message.spam) {
                    template.querySelector('.msg').innerText = message.message;
                } else {
                    template.querySelector('.msg').classList.add('hidden');
                    template.querySelector('.report-msg-number')
                        .classList.add('hidden');
                    template.querySelector('.report-link')
                        .classList.add('hidden');
                    template.querySelector('.spam-msg')
                        .classList.remove('hidden');
                }
                template.querySelector('.timestamp').innerText =
                    new Date(message.created_at).toLocaleString();
                template.querySelector('.username').innerText =
                    message.user_id.username;
                let msgNumber = 0;
                if (message.reported_spams != undefined) {
                    msgNumber = Object
                        .getOwnPropertyNames(message.reported_spams).length;
                    if (message.reported_spams.hasOwnProperty(user_id)) {
                        template.querySelector('.report-link')
                            .classList.add('report-link-disable');
                    }
                }
                if (msgNumber != 0) {
                    template.querySelector('.report-msg-number')
                        .innerText = '(' + msgNumber + ')';
                }
                let userNumer = 0;
                if (message.user_id.reported_spams != undefined) {
                    userNumer = Object
                        .getOwnPropertyNames(message.user_id.reported_spams)
                        .length;
                }
                if (userNumer != 0) {
                    template.querySelector('.report-user-number')
                        .innerText = '<' + userNumer + '>';
                }
                template.querySelector('.report')
                    .setAttribute('msg_id', message._id);
                template.querySelector('.report')
                    .setAttribute('user_id', message.user_id._id);

                listContainer.appendChild(template);
            }
        }
    }

    /**
     *
     * @param messages
     * @param page
     */
    drawMessages(messages) {
        // only delete previous results if page is 0
        if (this.page == undefined || this.page == 0) {
            $('ul#' + this.type + '-chat li').remove();
        }

        messages.forEach((element) => {
            this.drawMessageItem(element);
        });

        $('#'+this.type+'-msg_area .no-results-message').addClass('hidden');
        if (messages.length == 0) {
            if (this.page == 0) {
                $('#'+this.type+'-msg_area .no-results-message')
                    .removeClass('hidden');
            }
            this.deactivateSearchButtonsLoadMore();
        }
    }

    /**
     * Sends and saves the message the user post.
     * @param type
     */
    sendMessage() {
        const user_id = Cookies.get('user-id');

        let url = '/chat-messages';
        let messageContent = '#public-send-message-content';
        let data = {
            message: $(messageContent).val(),
            user_id: user_id
        };
        // for private messages
        if (this.type === 'private') {
            url = '/private-chat-messages';
            messageContent = '#private-send-message-content';
            data = {
                message: $(messageContent).val(),
                sender_user_id: user_id,
                receiver_user_id: Cookies.get('receiver_user_id')
            };
        }
        // for announcements
        if (this.type === 'announcement') {
            url = '/announcements';
            messageContent = '#announcement-send-message-content';
            data = {
                message: $(messageContent).val(),
                user_id: user_id,
            };
        }
        // ajax calls
        APIHandler.getInstance()
            .sendRequest(url, 'post', data, true, null)
            .then((response) => {
                $(messageContent).val('');
                if (this.type === 'public' && response.spam) {
                    $('#user-spam-modal').modal('show');
                }
            })
            .catch((error) => {
                if (error.responseJSON.msg != undefined) {
                    alert(error.responseJSON.msg);
                }

            });
    }

    /**
     * Get all the messages previously posted
     * @param type
     * @param keywords
     * @param page
     * @returns {Promise<unknown>}
     */
    getMessages(keywords) {
        let url = '/chat-messages';
        let data = {
            'page': this.page,
            'q': keywords
        };

        if (keywords != undefined && keywords.length > 0) {
            this.activateSearchButtonsLoadMore();
        }

        return new Promise((resolve, reject) => {
            // data for private chat
            if (this.type === 'private') {
                url = '/private-chat-messages';
                data = {
                    'page': this.page,
                    'q': keywords,
                    'sender_user_id': Cookies.get('user-id'),
                    'receiver_user_id': Cookies.get('receiver_user_id')
                };
            }
            // data for announcements
            if (this.type === 'announcement') {
                url = '/announcements';
                data = {
                    'page': this.page,
                    'q': keywords
                };
            }

            APIHandler.getInstance()
                .sendRequest(url, 'get', data, true, null)
                .then((response)=>{
                    resolve(response);
                })
                .catch((error) =>{
                    reject(error.message);
                });
        });
    }
    /**
     * [updateMessageListView description]
     * @param  {string} type          [description]
     * @param  {[type]} searchKeyword [description]
     * @param  {number} page          [description]
     */
    updateMessageListView(searchKeyword, page) {
        this.page = page;
        const self = this;
        if (searchKeyword == undefined || searchKeyword.length == 0) {
            this.deactivateSearchButtonsLoadMore();
        }
        // get user data and then get messages to
        // paint and to check for unread messages
        this.getMessages(searchKeyword).then((results) => {
            self.drawMessages(results);
        }).catch((err) => {});
    }

    /**
     * [activateSearchButtonsLoadMore description]
     * @param  {[type]} type [description]
     */
    activateSearchButtonsLoadMore() {
        this.deactivateSearchButtonsLoadMore();
        $('#search-'+this.type+'-chat__more').removeClass('hidden');
    }

    /**
     * [activateSearchButtonsLoadMore description]
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    deactivateSearchButtonsLoadMore() {
        $('.more-results-button-container').addClass('hidden');
    }

    /**
     * [registerEventsAfterDraw description]
     */
    registerEventsAfterDraw() {
        const modelElement = this;
        let stringType = this.type + '-chat';
        if (this.type == 'announcement') {
            stringType = this.type;
        }
        /** **** events declaration ********/
        $('#'+this.type+'-msg-form').on('submit', function(e) {
            e.preventDefault();
            modelElement.sendMessage();
        });
        $('#'+this.type+'-send-btn').click(function(e) {
            modelElement.sendMessage();
        });
        // capture event to load messages and display view
        $('.content-changer, .menu-content-changer').click(function(event) {
            event.preventDefault();
            // eslint-disable-next-line no-invalid-this
            const newID = $(this).data('view-id');
            if (newID === stringType+'-content') {
                modelElement.updateMessageListView('', 0);
                modelElement.containerWall.scrollTop =
                    modelElement.containerWall.scrollHeight;
            }
        });
        /**
         * search form submit and load more
         */
        let page = this.page;
        $('#search-'+stringType+'__button').click(function(e) {
            e.preventDefault();
            const searchKeyword = $('#search-'+stringType+'__input').val();
            modelElement.updateMessageListView(searchKeyword, 0);
        });
        $('#search-'+stringType+'__more-button').click(function(e) {
            e.preventDefault();
            const searchKeyword = $('#search-'+stringType+'__input').val();
            page++;
            modelElement.updateMessageListView(searchKeyword, page);
        });
    }

    /**
     * Reacts and draw received new messages
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    reactToNewMessage(data) {
        this.drawMessageItem(data);
        this.containerWall.scrollTop = this.containerWall.scrollHeight;
    }
}

/**
 * Public chat component, inherits from base message component
 */
class PublicChatMessage extends BaseMessage {
    /**
     * [constructor description]
     * @param  {[type]} containerWall [description]
     * @return {[type]}               [description]
     */
    constructor(containerWall) {
        super(containerWall);
        this.type = 'public';
    }
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance(){
        if (this.instance === undefined) {
            let containerWall = document.getElementById('public-msg_area');
            this.instance = new PublicChatMessage(containerWall);
        }
        return this.instance;
    }

    /**
     * [registerEventsAfterDraw description]
     * @return {[type]} [description]
     */
     registerEventsAfterDraw() {
        /** **** events declaration ********/
        super.registerEventsAfterDraw();

        $('.list-group').on('click', '.report-link', function(e) {
            e.preventDefault();
            $('#spam_user_id').val(e.toElement.getAttribute('user_id'));
            $('#spam_msg_id').val(e.toElement.getAttribute('msg_id'));
        });
    }
}

let public_wall_container = document.getElementById('public-msg_area');
let publicChatMessageModel =  PublicChatMessage.getInstance();
$(function() {
    // eslint-disable-next-line no-unused-vars
    let page = 0;
    // listen for public chat events
    socket.on('new-chat-message', (data) => {
        publicChatMessageModel.reactToNewMessage(data);
    });

    // listen for spam number update (user/message) events
    socket.on('spam-report-number', (data) => {
        $('#public-chat li').remove();
        publicChatMessageModel.updateMessageListView();
    });

    // init public chat messages
    publicChatMessageModel.updateMessageListView();
    publicChatMessageModel.registerEventsAfterDraw();
});

/**
 * Private chat component, inherits form baseChat
 */
class PrivateChatMessage extends BaseMessage {
    /**
     * [constructor description]
     * @param  {[type]} containerWall [description]
     * @return {[type]}               [description]
     */
    constructor(containerWall) {
        super(containerWall);
        this.type = 'private';
    }

    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            let containerWall = document.getElementById('private-msg_area');
            this.instance = new PrivateChatMessage(containerWall);
        }
        return this.instance;
    }

    /**
     * changes the receiver for the private chat
     * @param  {[type]} receiver_user_id [description]
     */
    initiatePrivateChat(receiver_user_id, username) {
        Cookies.set('receiver_user_id', receiver_user_id);
        $('#private-chat > li').remove();
        $('#receiver-username').html(username);
        let privateChatMessageModel = PrivateChatMessage.getInstance();
        privateChatMessageModel.updateMessageListView('', 0);
    }

    /**
     * Reacts and draw received new messages
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    reactToNewMessage(data){
        // only draw elements received from the user I am speaking with
        if (data.sender_user_id._id == Cookies.get('receiver_user_id') ||
            data.sender_user_id._id == Cookies.get('user-id')) {
            this.drawMessageItem(data);
            this.containerWall.scrollTop =
                this.containerWall.scrollHeight;
        }
    }
}

//* ***********************************************
//* ***********************************************
const privateChatMessageModel =  PrivateChatMessage.getInstance();
$(function() {
    // eslint-disable-next-line no-unused-vars
    const page = 0;
    // sync sockets
    socket.on('connect', (data) => {
        const oldSocketId = Cookies.get('user-socket-id');
        // delete old socket from db
        if (oldSocketId != undefined && oldSocketId != '') {
            if (oldSocketId !== socket.id) {
                User.getInstance().syncSocketId(oldSocketId, true);
            }
        }
        // register new socket in db
        User.getInstance().syncSocketId(socket.id, false);
        // store new socket on cookie for future reference
        Cookies.set('user-socket-id', socket.id);
    });

    // listen for private chat events
    socket.on('new-private-chat-message', (data) => {
        privateChatMessageModel.reactToNewMessage(data);
    });

    // init private chat messages events
    privateChatMessageModel.registerEventsAfterDraw();
});

/**
 * Announcements class, inherits from base message
 */
class Announcement extends BaseMessage {
    /**
     * [constructor description]
     * @param  {[type]} containerWall [description]
     * @return {[type]}               [description]
     */
    constructor(containerWall) {
        super(containerWall);
        this.type = 'announcement';
    }
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance(){
        if(this.instance === undefined) {
            let containerWall = document.getElementById('announcement-msg_area');
            this.instance = new Announcement(containerWall);
        }
        return this.instance;
    }

    /**
     * [initiateAnnouncementsList description]
     * @return {[type]} [description]
     */
    initiateAnnouncementsList() {
        this.updateMessageListView();
        this.containerWall.scrollTop = 0;
        //hide input area for citizen
        if (currentUser.role === 'citizen') {
            $('#announcement-chat-content .type_area').addClass('hidden');
        }
    }

    /**
     * Draws the last announcement
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    drawLastAnnouncement(data) {
        const lastAnnouncementContainer = $('#last-announcement-container');
        lastAnnouncementContainer.html(data.message);
    }

    /**
     * Gets the last announcement
     * @return {[type]} [description]
     */
    getLastAnnouncement() {
        const url = '/announcements';
        const data = {
            last: true,
            limit: 1
        };
        APIHandler.getInstance()
            .sendRequest(url, 'get', data, true, null)
            .then((response) => {
                if (response.length > 0) {
                    Announcement.getInstance()
                        .drawLastAnnouncement(response[0]);
                }
            });
    }

    /**
     * Initial events declarations - only fired once
     * @return {[type]} [description]
     */
    initEvents() {
        const announcementModel = this;
        // announcement button header
        $('#announcement-button').click(function(event) {
            event.preventDefault();
            announcementModel.initiateAnnouncementsList();
        });
    }


    /**
     * Reacts and draw received new messages
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    reactToNewMessage(data) {
        this.drawLastAnnouncement(data);
        super.reactToNewMessage(data);
        this.containerWall.scrollTop = 0;
    }
}

//* ***********************************************
//* ***********************************************

const announcementModel = Announcement.getInstance();
const page = 0;
$(function() {
    // listen for public chat events
    socket.on('new-announcement', (data) => {
        announcementModel.reactToNewMessage(data);
    });
    // init announcement chat messages and announcements
    announcementModel.getLastAnnouncement();
    announcementModel.initEvents();
    announcementModel.registerEventsAfterDraw();
});
// eslint-disable-next-line no-unused-vars
/**
 * User class, makes requests to api
 */
class User {
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new User();
        }
        return this.instance;
    }

    /**
     * [getUserData description]
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
     async getUser(userId) {
        return await new Promise((resolve, reject) => {
            if (userId != null) {
                APIHandler.getInstance()
                    .sendRequest('/users/' + userId, 'get',
                        null, true, null)
                    .then((response) => {
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            } else {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject("ERROR");
            }
        });
    }

    /**
     * Returns a list of users from the API
     * @return {[type]} [description]
     */
     async getPersonalMessage(userId, security_question_answer) {
        const data = {
            'security_question_answer': security_question_answer,
        };
        return await new Promise((resolve, reject) => {
            APIHandler.getInstance()
                .sendRequest('/users/' + userId + '/personal-message', 'get',
                    data, true, null)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error.responseJSON.msg);
                });
        });
    }

    /**
     * Returns a list of users from the API
     * @return {[type]} [description]
     */
     async getUsers(keyword, status) {
        const data = {
            'username': keyword,
            'status': status
        };
        return await new Promise((resolve, reject) => {
            APIHandler.getInstance()
                .sendRequest('/users', 'get', data,
                    true, null)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * Update user information
     * @return {[type]} [description]
     */
     async updateUser(userId, data) {
        return await new Promise((resolve, reject) => {
            APIHandler.getInstance()
                .sendRequest('/users/' + userId, 'put',
                    JSON.stringify(data), true, 'application/json')
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    if (error.responseJSON != undefined) {
                        reject(error.responseJSON.msg);
                    } else {
                        reject(error);
                    }
                });
        });
    }

    /**
     * [initCurrentUser description]
     * @return {[type]} [description]
     */
     updateCurrentUser() {
        User.getInstance().getCurrentUser()
            .then((user) => {
                currentUser = user;
            }).catch((err) => {

            });
    }

    /**
     * [initCurrentUser description]
     * @return {[type]} [description]
     */
     initCurrentUser() {
        User.getInstance().getCurrentUser()
            .then((user) => {
                currentUser = user;
                if (currentUser.name === undefined ||
                    currentUser.name.length === 0) {
                    setTimeout(function(){
                        showElements('profile-update-invite')
                    }, 30000 * 6);
                    User.getInstance().initUpdateInvite();
                }
            }).catch((err) => {

            });
    }

    /**
     * [initCurrentUser description]
     * @return {[type]} [description]
     */
     async getCurrentUser() {
        return await new Promise((resolve, reject) => {
            // init current user
            User.getInstance().getUser(Cookies.get('user-id'))
                .then((user) => {
                    resolve(user);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * [initUpdateInvite description]
     * @return {[type]} [description]
     */
     initUpdateInvite() {
        window.setInterval(function() {
            showElements('profile-update-invite');
        }, 60000 * 20);
    }


    /**
     * Updates de status online of the user
     * @param status
     */
    setOnline(online_status, socketId) {
        const userId = Cookies.get('user-id');
        const data = {
            onLine: online_status,
            acknowledgement: Cookies.get('user-acknowledgement'),
            status: Cookies.get('user-status')
        }
        APIHandler.getInstance()
            .sendRequest('/users/' + userId, 'put',
                JSON.stringify(data), true, 'application/json')
            .then((response) => {
                Cookies.set('online-status', online_status);
            })
            .catch((error) => {});
    }

    /**
     * Syncs socket ids to the users data in the backend. It can delete old socket connections and it can create new ones.
     * @param status
     */
    syncSocketId(socketId, deleteSocket) {
        const user_id = Cookies.get('user-id');
        const jwt = Cookies.get('user-jwt-esn');
        let url = '/users/' + user_id + '/sockets';
        let method = 'post';
        let data = {
            'socketId': socketId
        };
        // delete scenario
        if (deleteSocket) {
            url = '/users/' + user_id + '/sockets/' + socketId;
            method = 'delete';
            data = {};
        }

        APIHandler.getInstance()
            .sendRequest(url, method,
                JSON.stringify(data), true, 'application/json')
            .then((response) => {})
            .catch((error) => {});
    }

}

/**
 * Component for list of users
 */
class UserList {
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new UserList();
        }
        return this.instance;
    }

    /**
     * changes the receiver for the private chat
     * @param  {[type]} receiver_user_id [description]
     */
    initiateUserList() {
        this.updateComponentView(currentUser,
            $('#search-users-list__input').val(), '');
        $('#users-search-form .status-list__color')
            .addClass('non-selected');
    }

    /**
     * [drawUsers description]
     * @param  {[type]} containerId [description]
     * @return {[type]}             [description]
     */
    drawUsers(users, currentUser) {
        const containerId = 'user-list-content__list';
        $('#user-list-content .no-results-message').addClass('hidden');
        // 1. find templates in html
        const onlineTemplate = document.querySelector('template#onlineUserTemplate');
        const offlineTemplate = document.querySelector('template#offlineUserTemplate');
        // 2. find container
        const listContainer = document.getElementById(containerId);
        $('#' + containerId + ' li').remove();
        if (listContainer == undefined || (onlineTemplate == undefined && offlineTemplate == undefined)) {
            return;
        }
        // 3. iterate over users list and draw using the
        // appropriate template based on online/offline state
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            let template = null;
            // 4. online state
            template = onlineTemplate.content.cloneNode(true);
            // 5. offline state
            if (user.onLine == false || user.onLine == undefined) {
                template = offlineTemplate.content.cloneNode(true);
            }

            if (template == undefined || template ==
                null || user == undefined) {
                return;
            }

            // draw
            template.querySelector('.username')
                .innerText = user.username;
            template.querySelector('.username')
                .setAttribute('data-user-id', user._id);
            template.querySelector('.chat-button')
                .setAttribute('data-user-id', user._id);
            template.querySelector('.chat-button')
                .setAttribute('data-username', user.username);
            template.querySelector('.status-button')
                .setAttribute('data-user-id', user._id);
            // set message counter from user
            if (currentUser.unread_messages != undefined &&
                currentUser.unread_messages[user._id] != undefined &&
                currentUser.unread_messages[user._id] > 0) {
                template.querySelector('.message-counter').innerText =
                    currentUser.unread_messages[user._id];
            }

            if (user.status != undefined) {
                this.drawUserStatues(template, user);
            }

            listContainer.appendChild(template);
        }
        this.registerEventsAfterDraw();
    }

    /**
     * Draws status info and icon
     * @param  {[type]} template [description]
     * @return {[type]}          [description]
     */
    drawUserStatues(template, user){
        const userStatusLC = user.status.toLowerCase();
        template.querySelector('#statusSpan')
            .classList.add('background-color-' + userStatusLC);
        template.querySelector('.status-button')
            .setAttribute('data-status', user.status);

        if (user.status === 'OK') {
            template.querySelector('#iconStatus')
                .classList.add('fa-check');
        } else if (user.status === 'HELP') {
            template.querySelector('#iconStatus')
                .classList.add('fa-exclamation');
        } else if (user.status === 'EMERGENCY') {
            template.querySelector('#iconStatus')
                .classList.add('fa-exclamation-triangle');
        } else if (user.status === 'UNDEFINED') {
            template.querySelector('#iconStatus')
                .classList.add('fa-question');
        }
        return template;
    }

    /**
     * Show the detail of an emergency status
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    showEmergencyStatus(userId) {
        $('#userEmergencyDetail').modal('show');
        // display detail
        this.getUserStatusDetail(userId);
        // display picture
        this.getUserStatusPictures(userId);
    }
    /**
     * [getUserStatusDetail description]
     * @return {[type]} [description]
     */
    getUserStatusDetail(userId) {
        // get brief description and location
        APIHandler.getInstance()
            .sendRequest('/emergencyStatusDetail/' + userId,
                'get', null, true, null)
            .then((response) => {
                // brief description
                document.getElementById('userBriefDescriptionPreview')
                    .innerHTML = response.status_description;
                // location description
                document.getElementById('userLocationDescriptionPreview')
                    .innerHTML = response.share_location;
            })
            .catch((error) => {
                $('#get-emergency-detail-alert').html(error);
                $('#get-emergency-detail-alert').show();
            });
    }
    /**
     * Gets picture for user status
     * @return {[type]} [description]
     */
    getUserStatusPictures(userId) {
        $('.userPicAndDesBlock').empty();
        // get picutures and description
        APIHandler.getInstance()
            .sendRequest('/emergencyStatusDetail/picture/' + userId,
                'get', null, true, null)
            .then((response) => {
                response.forEach(function(pictureObj) {
                    const t = document
                        .querySelector('#userPictureAndDescriptionTemplate');
                    t.content.querySelector('img').src =
                        pictureObj.picture_path;
                    t.content.querySelector('div').id =
                        pictureObj._id;
                    t.content.querySelector('p').innerHTML =
                        pictureObj.picture_description;
                    const clone = document.importNode(t.content, true);
                    const pictureContainer = document
                        .getElementsByClassName('userSharePicture');
                    pictureContainer[0].appendChild(clone);
                });
            })
            .catch((error) => {
                $('#get-picture-and-description-alert').html(error);
                $('#get-picture-and-description-alert').show();
            });
    }

    /**
     * draws empty list of users
     * @return {[type]} [description]
     */
     drawNoUsers() {
        $('#user-list-content__list li').remove();
        $('#user-list-content .no-results-message').removeClass('hidden');
    }

    /**
     * Updates the component when needed
     * @param  {[type]} currentUser   [description]
     * @param  {[type]} searchKeyword [description]
     * @param  {[type]} searchStatus  [description]
     * @return {[type]}               [description]
     */
    updateComponentView(currentUser, searchKeyword, searchStatus) {
        // get user data and then get messages to
        // paint and to check for unread messages
        User.getInstance().getUser(currentUser._id).then((user) => {
            currentUser.unread_messages = user.unread_messages;
            return User.getInstance().getUsers(searchKeyword, searchStatus);
        }).then((users) => {
            if (users.length > 0) {
                UserList.getInstance().drawUsers(users, currentUser);
            } else {
                UserList.getInstance().drawNoUsers();
            }
        }).catch((err) => {
        });
    }

    /**
     * [registerEventsAfterDraw description]
     */
    registerEventsAfterDraw() {
        globalContentChangerEvent();
        // assign view change event for chat button for each user in the list
        menuContentChangerEvent();
        $('.chat-button').click(function(event) {
            $('.menu-content-changer').removeClass('active');
            $('#private-chat-content-menu').addClass('active');
            // eslint-disable-next-line no-invalid-this
            PrivateChatMessage.getInstance().initiatePrivateChat($(this).data('user-id'), $(this).data('username'));
        });
        $('.username').click(function(event) {
            // eslint-disable-next-line no-invalid-this
            UserProfile.getInstance().initiateUserProfile($(this).data('user-id'));
        });
        // show emergency status detail
        $('.status-button').unbind().click(function(event) {
            // eslint-disable-next-line no-invalid-this
            const clickedUserId = $(this).data('user-id');
            // eslint-disable-next-line no-invalid-this
            const clickedUserStatus = $(this).data('status');
            if (clickedUserStatus.toLowerCase() == 'emergency') {
                UserList.getInstance().showEmergencyStatus(clickedUserId);
            }
        });
    }
}

/**
 * User List behavior using jquery
 * @param  {[type]} ) {}          [description]
 * @return {[type]}   [description]
 */
$(function() {
    // Initial call to get the user list after login
    UserList.getInstance().updateComponentView(currentUser, '', '');
    // Socket IO implementation to update
    // user list on every change of users data.
    socket.on('user-list-update', () => {
        UserList.getInstance().updateComponentView(currentUser,
            $('#search-users-list__input').val(), '');
    });
    // Click event, to update user list when the user switch between views
    $('.menu-content-changer').click(function(event) {
        event.preventDefault();
        // eslint-disable-next-line no-invalid-this
        const newID = $(this).data('view-id');
        if (newID === 'user-list-content') {
            UserList.getInstance().initiateUserList();
        }
    });
    /**
     * form submit button event
     * triggered by submit and enter event by default
     */
    $('#search-users-list__button, #users-search-form .status-list__color')
        .click(function(e) {
            e.preventDefault();
            const searchKeyword = $('#search-users-list__input').val();
            // eslint-disable-next-line no-invalid-this
            const newSelectedStatus = $(this).data('status');
            if (newSelectedStatus != undefined) {
            // removing filter
                if (selectedStatus == newSelectedStatus) {
                    $('#users-search-form .status-list__color')
                        .addClass('non-selected');
                    selectedStatus = null;
                } else {
                    $('#users-search-form .status-list__color')
                        .addClass('non-selected');
                    // eslint-disable-next-line no-invalid-this
                    $(this).removeClass('non-selected');
                    selectedStatus = newSelectedStatus;
                }
            }
            UserList.getInstance().updateComponentView(currentUser,
                searchKeyword, selectedStatus);
        });
});

class UserProfile {
    static instance;
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new UserProfile();
        }
        return this.instance;
    }

    /**
     * changes the receiver for the private chat
     * @param  {[type]} receiver_user_id [description]
     */
    initiateUserProfile(profile_user_id) {
        Cookies.set('profile_user_id', profile_user_id);
        UserProfile.getInstance().updateComponentView(profile_user_id);
    }
    /**
     * Resets a User's profile view
     * @return {[type]} [description]
     */
    resetProfile() {
        document.getElementById('user-profile-content__container').innerText = '';
    }
    /**
     * [drawUsers description]
     * @param user
     */
    drawProfile(user) {
        const containerId = 'user-profile-content__container';
        // 1. find templates in html
        const profileTemplate = document.querySelector('template#userProfileTemplate');
        // 2. find container
        const profileContainer = document.getElementById(containerId);
        if (profileContainer != undefined) {
            // 3. draw using the template
            if (profileTemplate != undefined && profileTemplate != null && user != undefined) {
                let template = profileTemplate.content.cloneNode(true);
                //part 1 - personal info
                template = this.drawProfilePart1Info(user, template);
                //part 1 - emergency contact
                template = this.drawProfilePart1EmergencyContact(user, template);
                //part 2 - medical info
                template = this.drawProfilePart2Info(user, template);
                //part3 - personal message
                template = this.drawProfilePart3Info(user, template);

                // if user is not the same as current User remove edit buttons
                if (user._id != currentUser._id) {
                    template.querySelectorAll('.edit-profile-button').forEach((element) => element.remove());
                }
                profileContainer.appendChild(template);
            }
        }
    }
    /**
     * Add personal info to template component
     * @param  {[type]} user     [description]
     * @param  {[type]} template [description]
     * @return {[type]}          [description]
     */
    drawProfilePart1Info(user, template) {
        // set emergency_contact
        if (user.emergency_contact != undefined) {
            if (user.emergency_contact.name != undefined) {
                template.querySelector('.user-profile__emergency_contact').innerText = user.emergency_contact.name;
            }
            if (user.emergency_contact.phone_number != undefined) {
                template.querySelector('.user-profile__emergency_contact_phone_number').innerText = user.emergency_contact.phone_number;
            }
            if (user.emergency_contact.address != undefined) {
                template.querySelector('.user-profile__emergency_contact_address').innerText = user.emergency_contact.address;
            }
        }
        return template;
    }
    /**
     * Add emergency contact info to template component
     * @param  {[type]} user     [description]
     * @param  {[type]} template [description]
     * @return {[type]}          [description]
     */
    drawProfilePart1EmergencyContact(user, template) {
        // set username
        template.querySelectorAll('.user-profile__username').forEach((element) => element.innerText = user.username);
        // set name
        if (user.name != undefined) {
            template.querySelector('.user-profile__name').innerText = user.name;
        }
        // set last name
        if (user.last_name != undefined) {
            template.querySelector('.user-profile__last_name').innerText = user.last_name;
        }
        // set birth date
        if ((user.birth_date != undefined)) {
            template.querySelector('.user-profile__birth_date').innerText = new Date(Date.parse(user.birth_date)).toUTCString().toLocaleString();
        }
        // set address
        if (user.address != undefined) {
            template.querySelector('.user-profile__address').innerText = user.address;
        }
        // set city
        if (user.city != undefined) {
            template.querySelector('.user-profile__city').innerText = user.city;
        }
        // set phone number
        if (user.phone_number != undefined) {
            template.querySelector('.user-profile__phone_number').innerText = user.phone_number;
        }
        return template;
    }
    /**
     * Meedical info in profile
     * @param  {[type]} user     [description]
     * @param  {[type]} template [description]
     * @return {[type]}          [description]
     */
    drawProfilePart2Info(user, template) {
        // set medical information
        if (user.medical_information != undefined) {
            if (user.medical_information.blood_type != undefined) {
                template.querySelector('.user-profile__blood_type').innerText = user.medical_information.blood_type;
            }
            if (user.medical_information.prescribed_drugs != undefined) {
                template.querySelector('.user-profile__prescribed_drugs').innerText = user.medical_information.prescribed_drugs;
            }
            if (user.medical_information.allergies != undefined) {
                template.querySelector('.user-profile__allergies').innerText = user.medical_information.allergies;
            }
        }
        return template;
    }
    /**
     * Personal message
     * @param  {[type]} user     [description]
     * @param  {[type]} template [description]
     * @return {[type]}          [description]
     */
    drawProfilePart3Info(user, template) {
        // set personal message information
        if (user.personal_message != undefined) {
            let question = ' -- No question available --';
            if (user.personal_message.security_question != undefined) {
                question = user.personal_message.security_question;
            }
            template.querySelector('.user-profile__personal-message-q').innerText = question;
        }
        return template;
    }
    /**
     * Updates the UI
     * @param  {[type]} currentUser [description]
     */
    updateComponentView(currentUserId) {
        // get user data and then get messages to
        // paint and to check for unread messages
        UserProfile.getInstance().resetProfile();
        User.getInstance().getUser(currentUserId).then((user) => {
            if (user != undefined) {
                UserProfile.getInstance().drawProfile(user);
            }
        }).catch((err) => {
            showElements('profile-not-authorized');
        }).finally(() => {
            UserProfile.getInstance().registerEventsAfterDraw();
        });
    }
    /**
     * Events needed after UI is rendered
     * @return {[type]} [description]
     */
    registerEventsAfterDraw() {
        globalContentChangerEvent();
        if (Cookies.get('profile_user_id') == currentUser._id) {
            $('.edit-profile-button').click(function(event) {
                UserProfileForm.getInstance().initiateUserProfileForm(currentUser._id, 1);
            });
        }
        if (Cookies.get('profile_user_id') == currentUser._id || currentUser.role == "administrator") {
            $('.edit-account-button').click(function(event) {
                UserProfileForm.getInstance().initiateUserProfileForm(Cookies.get('profile_user_id'), 0);
            });
        }
        $('#user-profile__personal-message-form').submit(function(event) {
            event.preventDefault();
            UserProfile.getInstance().validatePersonalMessageQuestion();
        });
        showElementEvent();
        hideElementEvent();
    }
    /**
     * Validate a Users personal message question before displaying the personal message
     * @return {[type]} [description]
     */
    validatePersonalMessageQuestion() {
        const security_question_answer = $('#user-profile__personal-message-q-answer').val();
        const userId = Cookies.get('profile_user_id');
        User.getInstance().getPersonalMessage(userId, security_question_answer).then((result) => {
            $('#user-profile__personal-message').html(result.message);
            showElements('user-profile__personal-message-container');
        }).catch((err) => {
            alert(err);
        });
    }
}
/**
 * User profile behavior using jquery
 * @param  {[type]} ) {}          [description]
 * @return {[type]}   [description]
 */
$(function() {
    // from menu clicking on profile displays a users own profile
    $('.menu-content-changer').click(function(event) {
        // eslint-disable-next-line no-invalid-this
        const newID = $(this).data('view-id');
        if (newID === 'user-profile-content') {
            UserProfile.getInstance().initiateUserProfile(currentUser._id);
        }
    });
    $('.btn-profile-update-invite').click(function(event) {
        // eslint-disable-next-line no-invalid-this
        const newID = $(this).data('view-id');
        if (newID === 'user-profile-content') {
            UserProfile.getInstance().initiateUserProfile(currentUser._id);
        }
    });
});
// eslint-disable-next-line no-unused-vars
/**
* Class in charge of drawing a use's profile form, 3 steps
*/
class UserProfileForm {
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new UserProfileForm();
        }
        return this.instance;
    }

    /**
     * changes the receiver for the private chat
     * @param profileFormUserId
     */
    initiateUserProfileForm(profileFormUserId, step) {
        Cookies.set('profile_form_user_id', profileFormUserId);
        this.updateComponentView(profileFormUserId, step);
        this.initEvent();
    }

    /**
     * [drawUsers description]
     * @param user
     * @param step
     */
    drawUserProfileForm(user, step) {
        const containerId = 'user-profile-form-content__container-' + step;
        // 1. find templates in html
        const profileTemplate = document.querySelector('template#userProfileFormTemplate' + step);
        // 2. find container
        const profileFormContainer = document.getElementById(containerId);
        profileFormContainer.innerText = '';
        if (profileFormContainer != undefined) {
            // 3. draw using the template
            if (profileTemplate != undefined && profileTemplate !=
                null && user != undefined) {
                let template = profileTemplate.content.cloneNode(true);
                template.querySelector('input#form_user_id')
                    .value = (user._id != undefined) ? user._id : '';
                // set username
                template.querySelector('.user-profile__username')
                    .innerText = user.username;
                if (step == 0) {
                    template = this.fillProfileFormStep0(user, template);
                } else if (step == 1) {
                    template = this.fillProfileFormStep1(user, template);
                } else if (step == 2) {
                    template = this.fillProfileFormStep2(user, template);
                } else if (step == 3) {
                    template = this.fillProfileFormStep3(user, template);
                }
                profileFormContainer.appendChild(template);
            }
        }
    }

    /**
     * [fillProfileFormStep0 description]
     * @param  {[type]} user     [description]
     * @param  {[type]} template [description]
     * @return {[type]}          [description]
     */
    fillProfileFormStep0(user, template) {
        // set name
        if (user.username != undefined) {
            template.querySelector('input#user-profile-form__username').value = user.username;
        }
        // set last name
        if (user.password != undefined) {
            template.querySelector('input#user-profile-form__password').value = '';
        }
        // set privilege
        if (user != undefined && (currentUser.role == 'coordinator' || currentUser.role == 'administrator')) {
            template.querySelector('select#user-profile-form__role').value = user.role;
        } else {
            template.querySelector('select#user-profile-form__role').remove();
            template.querySelector('label#user-profile-form__role_label').remove();
        }
        // set privilege
        template.querySelector('select#user-profile-form__active').value = 1;
        if (user.active != undefined && (currentUser.role == 'coordinator' || currentUser.role == 'administrator')) {
            template.querySelector('select#user-profile-form__active').value = 0;
        } else {
            template.querySelector('select#user-profile-form__active').remove();
            template.querySelector('label#user-profile-form__active_label').remove();
        }
        return template;
    }

    /**
     * [fillProfileFormStep1 description]
     * @param  {[type]} user     [description]
     * @param  {[type]} template [description]
     * @return {[type]}          [description]
     */
    fillProfileFormStep1(user, template) {
        // set name
        if (user.name != undefined) {
            template.querySelector('input#user-profile-form__name').value = user.name;
        }
        // set last name
        if (user.last_name != undefined) {
            template.querySelector('input#user-profile-form__last_name').value = user.last_name;
        }
        // set birth date
        if (user.birth_date != undefined) {
            template.querySelector('input#user-profile-form__birth_date').value = user.birth_date;
        }
        // set address
        if (user.address != undefined) {
            template.querySelector('input#user-profile-form__address').value = user.address;
        }
        // set city
        if (user.city != undefined) {
            template.querySelector('input#user-profile-form__city').value = user.city;
        }
        // set phone number
        if (user.phone_number != undefined) {
            template.querySelector('input#user-profile-form__phone_number').value = user.phone_number;
        }
        // set emergency_contact
        if (user.emergency_contact != undefined) {
            if (user.emergency_contact.name != undefined) {
                template.querySelector('input#user-profile-form__emergency_contact').value = user.emergency_contact.name;
            }
            if (user.emergency_contact.phone_number != undefined) {
                template.querySelector('input#user-profile-form__emergency_contact_phone_number').value = user.emergency_contact.phone_number;
            }
            if (user.emergency_contact.address != undefined) {
                template.querySelector('input#user-profile-form__emergency_contact_address').value = user.emergency_contact.address;
            }
        }
        return template;
    }

    /**
     * Fills the content in the form of step2
     * @param  {[type]} user     [description]
     * @param  {[type]} template the template loaded in the draw function
     * @return {[type]}          the template with all the data
     */
    fillProfileFormStep2(user, template) {
        // set emergency_contact
        if (user.medical_information != undefined && user.medical_information.blood_type != undefined) {
            template.querySelector('select#user-profile-form__blood_type').value = user.medical_information.blood_type;
        }
        if (user.medical_information != undefined && user.medical_information.prescribed_drugs != undefined) {
            template.querySelector('textarea#user-profile-form__prescribed_drugs').innerText = user.medical_information.prescribed_drugs;
        }
        if (user.medical_information != undefined && user.medical_information.prescribed_drugs != undefined && user.medical_information.prescribed_drugs != '') {
            template.querySelector('textarea#user-profile-form__prescribed_drugs').innerText = user.medical_information.prescribed_drugs;
            template.querySelector('input#has_prescribed_drugs1').checked = 'checked';
            template.querySelector('textarea#user-profile-form__prescribed_drugs').classList.remove('hidden');
        } else {
            template.querySelector('textarea#user-profile-form__prescribed_drugs').innerText = '';
            template.querySelector('input#has_prescribed_drugs0').checked = 'checked';
        }
        if (user.medical_information != undefined && user.medical_information.allergies != undefined && user.medical_information.allergies != '') {
            template.querySelector('textarea#user-profile-form__allergies').innerText = user.medical_information.allergies;
            template.querySelector('textarea#user-profile-form__allergies').classList.remove('hidden');
            template.querySelector('input#has_allergies1').checked = 'checked';
        } else {
            template.querySelector('textarea#user-profile-form__allergies').innerText = '';
            template.querySelector('input#has_allergies0').checked = 'checked';
        }
        return template;
    }

    /**
     * Fills the content in the form of step3
     * @param  {[type]} user     [description]
     * @param  {[type]} template the template loaded in the draw function
     * @return {[type]}          the template with all the data
     */
    fillProfileFormStep3(user, template) {
        // set emergency_contact
        if (user.personal_message != undefined && user.personal_message.message != undefined) {
            template.querySelector('textarea#user-profile-form__personal_message').innerText = user.personal_message.message;
        }
        if (user.personal_message != undefined && user.personal_message.security_question != undefined) {
            template.querySelector('input#user-profile-form__security_question').value = user.personal_message.security_question;
        }
        if (user.personal_message != undefined && user.personal_message.security_question_answer != undefined) {
            template.querySelector('input#user-profile-form__security_question_answer').value = user.personal_message.security_question_answer;
        }
        return template;
    }

    /**
     * Saves the data of a submitted form
     * @param  {[type]} formId [description]
     * @return {[type]}        [description]
     */
    saveUserProfile(formId, step) {
        return new Promise((resolve, reject) => {
            const userId = $('#' + formId).find('#form_user_id').val();
            const data = this.buildData(formId);
            User.getInstance().updateUser(userId, data)
                .then((user) => {
                    User.getInstance().updateCurrentUser();
                    if (step >= 1 && step < 3) {
                        const newStep = parseInt(step) + 1;
                        swapViewContent('user-profile-form' + newStep,
                            'main-content-block');
                        UserProfileForm.getInstance().updateComponentView(user._id, newStep);
                    } else {
                        UserProfile.getInstance().initiateUserProfile(userId);
                        swapViewContent('user-profile-content',
                            'main-content-block');
                    }
                }).catch((err) => {
                    alert(err);
                });
        });
    }

    /**
     * Build data for submission to API
     * @param  {[type]} formId [description]
     * @return {[type]}        [description]
     */
    buildData(formId) {
        const data = $('#' + formId).serializeArray();
        const step = $('#' + formId).find('#form_step').val();
        let finalData = {};
        for (let i = 0; i < data.length; i++) {
            const object = data[i];
            const key = object.name;
            const value = object.value;
            if (step == 1) {
                finalData = this.buildDataStep1(finalData, key, value);
            } else if (step == 2) {
                finalData = this.buildDataStep2(finalData, key, value);
            } else if (step == 3) {
                finalData = this.buildDataStep3(finalData, key, value);
            } else {
                finalData = this.buildDataDefaultStep(finalData, key, value);
            }
        }
        return finalData;
    }

    /**
     * [buildDataStep1 description]
     * @param  {[type]} finalData [description]
     * @param  {[type]} key       [description]
     * @param  {[type]} value     [description]
     * @return {[type]}           [description]
     */
    buildDataDefaultStep(finalData, key, value) {
        finalData[key] = value;
        return finalData;
    }

    /**
     * [buildDataStep1 description]
     * @param  {[type]} finalData [description]
     * @param  {[type]} key       [description]
     * @param  {[type]} value     [description]
     * @return {[type]}           [description]
     */
    buildDataStep1(finalData, key, value) {
        if (finalData.emergency_contact == undefined) {
            finalData.emergency_contact = {};
        }
        if (key == 'emergency_contact') {
            finalData.emergency_contact.name = value;
        } else if (key == 'emergency_contact_phone_number') {
            finalData.emergency_contact.phone_number = value;
        } else if (key == 'emergency_contact_address') {
            finalData.emergency_contact.address = value;
        } else {
            finalData[key] = value;
        }
        return finalData;
    }

    /**
     * [buildDataStep2 description]
     * @param  {[type]} finalData [description]
     * @param  {[type]} key       [description]
     * @param  {[type]} value     [description]
     * @return {[type]}           [description]
     */
    buildDataStep2(finalData, key, value) {
        if (finalData.medical_information == undefined) {
            finalData.medical_information = {};
        }
        if (key == 'prescribed_drugs') {
            finalData.medical_information.prescribed_drugs = '';
            if (finalData.has_prescribed_drugs == '1') {
                finalData.medical_information.prescribed_drugs = value;
            }
        } else if (key == 'allergies') {
            finalData.medical_information.allergies = '';
            if (finalData.has_allergies == '1') {
                finalData.medical_information.allergies = value;
            }
        }
        if (key == 'step') {
            finalData.step = value;
        } else {
            finalData.medical_information[key] = value;
        }
        return finalData;
    }

    /**
     * [buildDataStep3 description]
     * @param  {[type]} finalData [description]
     * @param  {[type]} key       [description]
     * @param  {[type]} value     [description]
     * @return {[type]}           [description]
     */
    buildDataStep3(finalData, key, value) {
        if (finalData.personal_message == undefined) {
            finalData.personal_message = {};
        }
        if (key == 'security_question') {
            finalData.personal_message.security_question = value;
        } else if (key == 'security_question_answer') {
            finalData.personal_message.security_question_answer = value;
        } else if (key == 'message') {
            finalData.personal_message.message = value;
        } else {
            finalData[key] = value;
        }
        return finalData;
    }

    /**
     * [updateComponentView description]
     * @param  {[type]} currentUser [description]
     * @param  {[type]} step        [description]
     * @return {[type]}             [description]
     */
    updateComponentView(currentUserId, step) {
        // get user data and then get messages
        // to paint and to check for unread messages
        User.getInstance().getUser(currentUserId).then((user) => {
            if (user != undefined) {
                this.drawUserProfileForm(user, step);
                this.registerEventsAfterDraw(step);
            }
        }).catch((err) => {
        });
    }

    /**
     * [registerEventsAfterDraw description]
     * @param  {[type]} step [description]
     * @return {[type]}      [description]
     */
    registerEventsAfterDraw(step) {
        $('.profile-form').submit(function(event) {
            event.preventDefault();
            // eslint-disable-next-line no-invalid-this
            UserProfileForm.getInstance().saveUserProfile($(this).attr('id'), step);
        });
        showElementEvent();
        hideElementEvent();
        globalContentChangerEvent();
        this.initEvent();
    }

    /**
     * init event when drawn first time
     * @return {[type]} [description]
     */
    initEvent() {
        $('.user-profile-menu-btn').click(function(event) {
            // eslint-disable-next-line no-invalid-this
            const newID = $(this).data('view-id');
            if (newID.includes('user-profile-form')) {
                UserProfileForm.getInstance().updateComponentView(currentUser._id, newID[newID.length - 1]);
            }
        });
    }
}

$(function() {
    /**
     * [postMessage description]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    function signup() {
        const name = $('#name').val();
        const last_name = $('#last_name').val();
        let username = $('#username').val();
        const password = $('#password').val();


        const data = {
            'name': name,
            'last_name': last_name,
            'username': username,
            'password': password
        };

        APIHandler.getInstance()
            .sendRequest('/users/', 'post', data,
                false, null).then((response) => {
                if (response.user != undefined &&
                    response.tokens != undefined) {
                    user_id = response.user.userId;
                    username = response.user.username;
                    userJWT = response.tokens.token;
                    user_acknowledgement = response.user.acknowledgement;
                    user_status = response.user.status;
                    // set token in cookies since it is more secure
                    Cookies.set('user-jwt-esn', userJWT);
                    Cookies.set('user-jwt-refresh-esn',
                        response.tokens.ex_token);
                    Cookies.set('user-id', user_id);
                    Cookies.set('username', username);
                    Cookies.set('user-acknowledgement', user_acknowledgement);
                    Cookies.set('user-status', user_status);
                    Cookies.set('online-status', response.user.onLine);

                    $('.user-name-placeholder').html(username);
                    if (user_acknowledgement) {
                        User.getInstance().setOnline(true);
                        GlobalEventDispatcher.updateAllUserLists();
                        window.location.replace('/app');
                    } else {
                        swapViewContent('acknowledgement-page-content',
                            'main-content-block');
                    }
                }
                $('#signup-error-alert').hide();
            })
            .catch((error) => {
                $('#signup-error-alert').html(error.responseJSON.msg);
                $('#signup-error-alert').show();
            });
    }

    /**
     * [submitAcknowledgment description]
     * @return {[type]} [description]
     */
    function submitAcknowledgment() {
        if ($('#signup-acknowledgement').is(':checked')) {
            const user_id = Cookies.get('user-id');
            // //validations
            $.ajax({
                url: apiPath + '/users/' + user_id,
                type: 'put',
                data: {
                    'acknowledgement': true,
                    'status': 'UNDEFINED',
                    'onLine': true
                },
                headers: {'Authorization': userJWT}
            }).done(function(response) {
                user_acknowledgement = response.acknowledgement;
                Cookies.set('user-acknowledgement', user_acknowledgement);
                User.getInstance().setOnline(true);
                GlobalEventDispatcher.updateAllUserLists();
                window.location.replace('/app');
            }).fail(function() {
                $('#signup-error-alert').html();
                $('#signup-error-alert').show();
            }).always(function() {});
        }
    }


    /** **** events declaration ********/

    $('#signup-submit-button').click(function(e) {
        e.preventDefault();
        signup();
    });
    $('#acknowledgement-submit-button').click(function(e) {
        e.preventDefault();
        submitAcknowledgment();
    });
});


class SignoutComponent {
    /**
     * Initializing view
     */
    constructor() {
        this.instance = undefined;
    }

    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new SignoutComponent();
        }
        return this.instance;
    }

    /**
     * Log out function
     * @return {[type]} [description]
     */
    signout() {
        User.getInstance().setOnline(false);
        if(Cookies.remove('user-jwt-esn') != undefined){
            //update all users
            GlobalEventDispatcher.updateAllUserLists();
        }
        this.removeCookies();
        this.redirectHomePage();
    }
    /**
     * Remove all the info from the cookie
     * @return {[type]} [description]
     */
    removeCookies() {
        Cookies.remove('user-jwt-esn', {path: ''});
        Cookies.remove('user-jwt-refresh-esn', {path: ''});
        Cookies.remove('user-id', {path: ''});
        Cookies.remove('user-name', {path: ''});
        Cookies.remove('user-acknowledgement', {path: ''});
        Cookies.remove('user-status', {path: ''});
    }
    /**
     * Redirect user to home page
     * @return {[type]} [description]
     */
    redirectHomePage() {
        if(window!= undefined && window.location != undefined){
            window.location.replace('/');
        }
    }

    /**
     * Register logout events
     * @return {[type]} [description]
     */
    registerEvents() {

        /** **** events declaration ********/
        $('a[href="#signout-action"]').click(function(e) {
            e.preventDefault();
            SignoutComponent.getInstance().signout();
            SignoutComponent.getInstance().redirectHomePage();
        });

        socket.on('logout-user', (data) => {
            SignoutComponent.getInstance().signout();
            showElements('sign-out-poppup');
        });

        $('.btn-exit-popup').on('click', (e) => {
            SignoutComponent.getInstance().redirectHomePage();
        });
    }

}
$(function() {
    SignoutComponent.getInstance().registerEvents();
});
/**
 * modal component for status selection
 */
class StatusSelection {
    /**
     * [constructor description]
     * @return {[type]} [description]
     */
    constructor() {
        const statusButton = document.getElementById('status-button');
        statusButton.addEventListener('click', this.showModal);
        const confirmButton = document.getElementById('statusConfirmButton');
        confirmButton.addEventListener('click', this.statusConfirm);
    }
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new StatusSelection();
        }
        return this.instance;
    }

    /**
     * [statusConfirm description]
     * @return {[type]} [description]
     */
    statusConfirm() {
        const status = $('.modal-instructions :checked').val();
        const user_id = Cookies.get('user-id');
        const data = {'status': status};

        APIHandler.getInstance()
            .sendRequest('/users/' + user_id + '/status',
                'put', data, true, null)
            .then((response) => {
                $('#status-modal').modal('toggle');
                Cookies.set('user-status', response.status);

                GlobalEventDispatcher.updateAllUserLists();
                // change header icon for status
                if (status === 'OK') {
                    $('#statusIcon').removeClass();
                    $('#statusIcon').addClass('fa fa-check');
                } else if (status === 'HELP') {
                    $('#statusIcon').removeClass();
                    $('#statusIcon').addClass('fa fa-exclamation');
                } else if (status === 'EMERGENCY') {
                    $('#statusIcon').removeClass();
                    $('#statusIcon').addClass('fa fa-exclamation-triangle');
                } else if (status === 'UNDEFINED') {
                    $('#statusIcon').removeClass();
                    $('#statusIcon').addClass('fa fa-question');
                }
                // if status is emergency
                if (status === 'EMERGENCY') {
                    $('.content-changer').removeClass('active');
                    $('#status-button').addClass('active');
                    event.preventDefault();
                    const newID = $('#status-button').data('view-id');
                    if (newID != undefined && newID != '') {
                        swapViewContent(newID);
                    }
                }
            })
            .catch((error) => {
                $('#update-status-alert').html(error);
                $('#update-status-alert').show();
            });
    }
    /**
     * Displays the modal
     * @return {[type]} [description]
     */
    showModal() {
        const newID = $(this).data('view-id');
        if (newID === 'status-content') {
            // $('#status-modal').modal({ show: true });
            $('#status-modal').modal('toggle');
            const status = Cookies.get('user-status');
            $('#' + status).prop('checked', true);
        }
    }
}

$(function() {
    StatusSelection.getInstance();
});

class SpamForm {
    static instance;
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new SpamForm();
        }
        return this.instance;
    }

    sendSpamReport() {
        const spamMsgId = $('#spam_msg_id').val();
        const spamUserId = $('#spam_user_id').val();
        const level = $('input[name=\'level\']:checked').val();
        const type = $('input[name=\'type\']:checked').val();
        const desc = $('#description').val();
        const data = {
            'level': level,
            'type': type,
            'description': desc,
            'current_user_id': Cookies.get('user-id'),
            'reported_user_id': spamUserId,
            'message_id': spamMsgId
        };

        APIHandler.getInstance()
            .sendRequest('/spam-report',
                'post', data, true, null)
            .then((response) => {
                $('#spam-modal').modal('hide');
            })
            .catch((error) => {});
    }
}

$(function() {
    $('#spam-modal').on('hidden.bs.modal', function() {
        $('#spam-report-form').get(0).reset();
        $('#spam-error-alert').hide();
    });
    $('#spam-report-button').on('click', function(e) {
        e.preventDefault();
        if ($('input[name=\'type\']:checked').val() == undefined) {
            $('#spam-error-alert').html('Please choose a spam type.');
            $('#spam-error-alert').show();
            return false;
        }
        if ($('#description').val().length == 0) {
            $('#spam-error-alert').html('Please provide spam description.');
            $('#spam-error-alert').show();
            return false;
        }
        const spamForm = SpamForm.getInstance();
        spamForm.sendSpamReport();
    });
    $('#spam-modal').modal('hide');
    return false;
});

/**
 * Class for Resources Module
 */
class Resources {
    /**
     * Initializing view
     */
    constructor() {
        this.instance = undefined;
        this.initializeStepButtonEvents();
        this.initializeResourceTypeButtons();
        this.initializePictureEvents();
        $('#resource-submit-btn').on('click', async (e) => {
            const valid = await Resources.getInstance().validateRequireFields();
            if (valid.length === 0) {
                Resources.getInstance().getValues();
            } else {
                $('#modaltext').text(valid);
                $('#validationsModal').modal('show');
            }
        });
    }
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new Resources();
        }
        return this.instance;
    }

    /**
     * Initialize events for controlling image functionality
     */
    initializePictureEvents() {
        $('#erasePicture').on('click', async (e) => {
            e.preventDefault();
            $('#resource-picture').val('');
            $('#image-preview').attr('src', '#');
            Resources.getInstance().addRemoveClassElements('hidden-main-content-block', 'add',
                $('#imageDiv'));
        });


        $('#resource-picture').on('change', (e) => {
            Resources.getInstance().readURL();
            Resources.getInstance().addRemoveClassElements('hidden-main-content-block', 'remove',
                $('#imageDiv'));
        });
    }


    /**
     * Remove and add button classes to selected option
     * @param idElementSelected
     * @param idElementOneHide
     * @param idElementTwoHide
     */
    buttonSelectionElements(idElementSelected, idElementOneHide, idElementTwoHide) {
        Resources.getInstance().addRemoveClassElements('selected-btn', 'add', $('#' + idElementSelected + '-btn'));
        Resources.getInstance().addRemoveClassElements('selected-btn', 'remove', $('#' + idElementOneHide + '-btn'),
            $('#' + idElementTwoHide + '-btn'));
    }
    /**
     * Initialize button events for Resource Type
     */
    initializeResourceTypeButtons() {
        $('#supplies-btn, #medical-btn, #shelter-btn').on('click', (e) => {
            let select;
            let hideOne;
            let hideTwo;
            if (e.currentTarget.id === 'supplies-btn') {
                select = 'supplies';
                hideOne = 'shelter';
                hideTwo = 'medical';
            } else if (e.currentTarget.id === 'medical-btn') {
                select = 'medical';
                hideOne = 'supplies';
                hideTwo = 'shelter';
            } else {
                select = 'shelter';
                hideOne = 'medical';
                hideTwo = 'medical';
            }
            Resources.getInstance().buttonSelectionElements(select, hideOne,
                hideTwo);
            Resources.getInstance().addRemoveClassElements('hidden-main-content-block', 'remove',
                $('#' + select + '-content-div'));
            Resources.getInstance().addRemoveClassElements('hidden-main-content-block', 'add',
                $('#' + hideOne + '-content-div'), $('#' + hideTwo + '-content-div'));
        });
    }
    /**
     * Initialize buttons for steps events
     */
    initializeStepButtonEvents() {
        $('#step-one-btn, #step-two-btn, #step-three-btn').on('click', (e) => {
            let buttonSelected;
            let buttonideOne;
            let butonHideTwo;
            let hideTwo = '';
            let hideOne = '';
            let hideThree = '';
            let showOne = '';
            let showTwo = '';
            if (e.target.id === 'step-one-btn') {
                buttonSelected = 'step-one';
                buttonideOne = 'step-two';
                butonHideTwo = 'step-three';
                hideOne = $('#resource-location-div');
                hideTwo = $('#resource-picture-div');
                showOne = $('#step-one-content');
                showTwo = $('#div-resource-type');
            } else if (e.target.id === 'step-two-btn') {
                buttonSelected = 'step-two';
                buttonideOne = 'step-one';
                butonHideTwo = 'step-three';
                showOne = $('#resource-location-div');
                hideOne = $('#step-one-content');
                hideTwo = $('#resource-picture-div');
                hideThree = $('#div-resource-type');
            } else {
                buttonSelected = 'step-three';
                buttonideOne = 'step-one';
                butonHideTwo = 'step-two';
                showOne = $('#resource-picture-div');
                hideOne = $('#step-one-content');
                hideTwo = $('#resource-location-div');
                hideThree = $('#div-resource-type');
            }
            Resources.getInstance().buttonSelectionElements(buttonSelected, buttonideOne,
                butonHideTwo);
            Resources.getInstance().addRemoveClassElements('hidden-main-content-block', 'remove',
                showOne, showTwo);
            Resources.getInstance().addRemoveClassElements('hidden-main-content-block', 'add',
                hideOne, hideTwo, hideThree);
        });
    }
    /**
     * Initialize buttons selection
     */
    initializeFirstSelection() {
        $('#step-one-btn').trigger('click');
        $('#supplies-btn').trigger('click');
    }
    /**
     * Remove classes from elements
     * @param nameClass
     * @param operation
     * @param showElement
     */
    addRemoveClassElements(nameClass, operation, ...showElement) {
        for (const element of showElement) {
            if (element !== '' && operation === 'add') {
                element.addClass(nameClass);
            }
            if (element !== '' && operation === 'remove') {
                element.removeClass(nameClass);
            }
        }
    }
    /**
     * Method to read the image and show a preview
     */
    readURL() {
        const input = $('#resource-picture').prop('files');
        if (input && input[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#image-preview').attr('src', e.target.result);
            };
            reader.readAsDataURL(input[0]); // convert to base64 string
        }
    }


    /**
     * Getting values from the form to save the resource
     */
    getValues() {
        let questionTwo = false;
        const resourceType = $('#div-resource-type button.selected-btn').attr('name').toLowerCase();
        const description = $('#' + resourceType + '-description-id').val();
        const questionOne = $('#' + resourceType + '-q1-div input[type=\'radio\']:checked').val();
        // Only medical supplies type has one question
        if (resourceType !== 'medical') {
            questionTwo = $('#' + resourceType + '-q2-div input[type=\'radio\']:checked').val();
        }
        const resourceObject = {
            user_id: Cookies.get('user-id'),
            resourceType: resourceType,
            name: $('#resource-name-id').val(),
            location: $('#resource-location').val(),
            description: description,
            questionOne: questionOne,
            questionTwo: questionTwo,
        };
        Resources.getInstance().postResource(resourceObject);
    }

    /**
     * Frontend validations
     * @return {[type]} [description]
     */
    validateRequireFields() {
        const resourceType = $('#div-resource-type button.selected-btn');
        const pictureElement = $('#resource-picture').prop('files');
        let stringValidations = '';
        if (resourceType.length === 0) {
            stringValidations += 'Please select a Resource Type, ';
        }
        if ($('#resource-location').val() === '') {
            stringValidations += 'Resource  Location is a required field, ';
        }
        if ($('#resource-name-id').val() === '') {
            stringValidations += 'Resource Name is  a required field, ';
        }
        if (pictureElement.length !== 0 && pictureElement[0].size > 2000000) {
            stringValidations += 'Picture Size limit 2Mb, ';
        }
        const selectedResource = resourceType.attr('name').toLowerCase();
        stringValidations += Resources.getInstance().validateDescriptionQuestionsValues(selectedResource);
        return stringValidations;
    }

    /**
     * Method to validate questions fields are selected
     * @param id
     */
    validateDescriptionQuestionsValues(id) {
        let validateMessage = '';
        if ($('#' + id + '-description-id').val() === '') {
            validateMessage += 'Description is a mandatory field, ';
        }
        if ($('#' + id + '-q1-div input[type=\'radio\']:checked').length === 0) {
            validateMessage += 'Question 1 answers is a mandatory field, ';
        } else if (id !== 'medical' && $('#' + id + '-q2-div input[type=\'radio\']:checked').length === 0) {
            validateMessage += 'Question 2 answer is a mandatory field, ';
        }
        return validateMessage;
    }

    /**
     * Saving resource information
     * @param resourceObject
     * @return {Promise<unknown>}
     */
    postResource(resourceObject) {
        const formData = new FormData();
        const fileElement = $('#resource-picture').prop('files');
        formData.append('user_id', Cookies.get('user-id'));
        formData.append('resourceType', $('#div-resource-type button.selected-btn').attr('name'));
        formData.append('name', $('#resource-name-id').val());
        formData.append('location', $('#resource-location').val());
        formData.append('description', resourceObject.description);
        formData.append('questionOne', resourceObject.questionOne);
        formData.append('questionTwo', resourceObject.questionTwo);

        if (fileElement.length !== 0) {
            formData.append('resourceImage',
                fileElement[0]);
        }

        Resources.getInstance().ajaxResourcePost(formData)
            .then()
            .catch((error) => {
                alert('Error saving resource ' + error);
            });
    }

    /**
     * Ajax request to save resources values
     * @param formData
     * @returns {Promise<unknown>}
     */
    ajaxResourcePost(formData) {
        return new Promise((resolve, reject) => {
            const jwt = Cookies.get('user-jwt-esn');
            $.ajax({
                url: apiPath + '/resources/',
                processData: false,
                contentType: false,
                type: 'post',
                headers: {
                    'Authorization': jwt
                },
                data: formData,
            }).done(function(response) {
                $('#supplies-form').trigger('reset');
                $('#image-preview').attr('src', '#');
                Resources.getInstance().initializeFirstSelection();
                swapViewContent('public-chat-content');
                resolve(response);
            }).fail(function(e) {
                reject(e.message);
            });
        });
    }
}


$(function() {
    Resources.getInstance().initializeFirstSelection();
});



/**
 * Class for Resource List
 */
class ResourcesList {
    /**
     * Initializing Resource Class
     */
    constructor() {
        this.instance = undefined;
        $(document).on('click', '#icon', function(event) {
            // eslint-disable-next-line no-invalid-this
            for (const cssClass of this.classList) {
                if (cssClass.includes('id')) {
                    const index = cssClass.indexOf('-');
                    const resourceId = cssClass.substring(index + 1);
                    ResourcesList.getInstance().getResourceById(resourceId);
                    break;
                }
            }
        });

        $('#addResourceIcon').on('click', (e) => {
            swapViewContent('resources-content');
        });

        // Click event, to update user list when the user switch between views
        $('.menu-content-changer').click(function(event) {
            event.preventDefault();
            // eslint-disable-next-line no-invalid-this
            const newID = $(this).data('view-id');
            if (newID === 'resources-list-content') {
                ResourcesList.getInstance().updateResourceListView();
            }
        });
    }
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new ResourcesList();
        }
        return this.instance;
    }

    /**
     * Method to initializae common elements
     */
    initializeCommonElements(resource) {
        // Changing labels
        $('.modal-body #resource-type-label').text('Resource Type:');
        $('.modal-body #picture-label').text('Picture:');
        ResourcesList.getInstance().addClassElements('hidden-main-content-block',
            $('.modal-body #div-steps'), $('.modal-body #resource-picture'), $('.modal-body #erasePicture'),
            $('.modal-body #resource-submit-btn'));

        ResourcesList.getInstance().removeClassElements('hidden-main-content-block',
            $('.modal-body #resource-location-div'), $('.modal-body #resource-picture-div'),
            $('.modal-body  #imageDiv'));
        ResourcesList.getInstance().readURL(resource.image);
        // Adding Location
        $('.modal-body #resource-location').text(resource.location).attr('readonly', true);
        // Adding resource name
        $('.modal-body #resource-name-id').val(resource.name).attr('readonly', true);
    }

    /**
     * Method to initialize resource view
     * @param resource
     */
    showResourceDetail(resource) {
        ResourcesList.getInstance().initializeCommonElements(resource);
        const resourceSelected= resource.resource_type.toLowerCase();
        let resourceOneToHide;
        let resourceTwoToHide;
        if (resource.resource_type === 'SUPPLIES') {
            resourceOneToHide = 'medical';
            resourceTwoToHide = 'shelter';
        } else if (resource.resource_type === 'MEDICAL') {
            resourceOneToHide = 'supplies';
            resourceTwoToHide = 'shelter';
        } else {
            resourceOneToHide = 'supplies';
            resourceTwoToHide = 'medical';
        }
        ResourcesList.getInstance().addClassElements('hidden-main-content-block',
            $('.modal-body #'+ resourceOneToHide +'-btn'), $('.modal-body #'+ resourceTwoToHide +'-btn'),
            $('.modal-body #'+ resourceOneToHide +'-content-div'), $('.modal-body #'+ resourceTwoToHide +'-content-div'));
        ResourcesList.getInstance().removeClassElements('hidden-main-content-block',
            $('.modal-body #'+ resourceSelected +'-btn'), $('.modal-body #'+ resourceSelected +'-content-div'));
        $('.modal-body #'+ resourceSelected +'-description-id').text(resource.description).attr('readonly', true);
        ResourcesList.getInstance().initializingQuestions(resource, resourceSelected);
        $('.modal-body #resources-content').removeClass('hidden-main-content-block').removeClass('hidden');
        $('#exampleModalCenter').modal('show');
    }

    /**
     * Method to set previous values to questions
     * @param resource
     * @param resourceSelected
     */
    initializingQuestions(resource, resourceSelected) {
        let questionActivate;
        if (resource.question_one) {
            questionActivate = '-q1-yes';
        } else {
            questionActivate = '-q1-no';
        }
        ResourcesList.getInstance().setQuestionValue(resourceSelected + questionActivate);
        questionActivate = '';
        if (resource.resource_type !== 'MEDICAL' ) {
            if (resource.question_two) {
                questionActivate = '-q2-yes';
            } else {
                questionActivate = '-q2-no';
            }
            ResourcesList.getInstance().setQuestionValue(resourceSelected + questionActivate);
        }
    }

    /**
     * Activvate the checkbox of the selected question
     * @param id
     */
    setQuestionValue(id) {
        $('.modal-body #'+ id ).prop('checked', true).attr('readonly', true);
    }


    /**
     * Method to show the image on the page
     * @param image
     * @returns {Promise<void>}
     */
    async readURL(image) {
        const base64Flag = 'data:image/png;base64,';
        const imageStr =
            await ResourcesList.getInstance().arrayBufferToBase64(image.data.data);
        $('.modal-body  #image-preview').attr('src', base64Flag + imageStr);
    }

    /**
     * Convert image data to Base64 to render on the view
     * @param buffer
     * @returns {string}
     */
    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };


    /**
     * Method to request an specific resource information
     * @param resourceId
     * @returns {Promise<unknown>}
     */
    getResourceById(resourceId) {
        return new Promise((resolve, reject) => {
            APIHandler.getInstance()
                .sendRequest('/resources/' + resourceId,
                    'get', null, true, null)
                .then((response) => {
                    ResourcesList.getInstance().showResourceDetail(response);
                    resolve(response);
                })
                .catch((error) => {
                    reject(error.message);
                });
        });
    }

    /**
     * Method to request all the resources registered
     * @returns {Promise<unknown>}
     */
    getResources() {
        return new Promise((resolve, reject) => {
            APIHandler.getInstance()
                .sendRequest('/resources/',
                    'get', null, true, null)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error.message);
                });
        });
    }

    /**
     * Method to draw all resources on the list
     * @param resources
     */
    drawResources(resources) {
        const containerId = 'resources_list-content';
        $('#resources-list-div .no-results-message').addClass('hidden');
        // 1. find templates in html
        const resourceTemplate = document.querySelector('template#resources-template');
        // 2. find container
        const listContainer = document.getElementById(containerId);
        $('#' + containerId + ' li').remove();
        if (listContainer != undefined) {
            for (let i = 0; i < resources.length; i++) {
                const resource = resources[i];
                let template = null;
                // 4. online state
                if (resourceTemplate != undefined) {
                    template = resourceTemplate.content.cloneNode(true);
                }
                if (template != undefined && template != null) {
                    template.querySelector('.resource-name').innerText = resource.name;
                    template.querySelector('.fa-info-circle').classList.add('id-' + resource._id);
                    // set message counter from user
                    listContainer.appendChild(template);
                }
            }
            contentChangerEvent();
        }
    }

    /**
     * Update the resource view
     */
    updateResourceListView() {
        // get resource data
        ResourcesList.getInstance().getResources().then((resources) => {
            if (resources.length > 0) {
                ResourcesList.getInstance().drawResources(resources);
            }
        }).catch((err) => {
        });
    }

    /**
     * Remove classes from elements
     * @param nameClass
     * @param showElement
     */
    removeClassElements(nameClass, ...showElement) {
        for (const element of showElement) {
            element.removeClass(nameClass);
        }
    }

    /**
     * Add classes to elements
     * @param nameClass
     * @param showElement
     */
    addClassElements(nameClass, ...showElement) {
        for (const element of showElement) {
            element.addClass(nameClass);
        }
    }
}


$(function() {
    ResourcesList.getInstance().updateResourceListView();
});


/**
 * Emergency status detail class
 */
class EmergencyStatusDetail {
    /**
     * Constructor for EmergencyStatusDetail class
     * @return {[type]} [description]
     */
    constructor() {
        this.instance = null;
        this._id = null;
        this.userId = null;
    }
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new EmergencyStatusDetail();
        }
        return this.instance;
    }
    /**
     * Set up the click event for edit button for both
     * brief description of situation and location
     * description
     */
    setEditDescriptionEvent() {
        $('.edit-button').click(function(event) {
            event.preventDefault();
            // hide paragraph and edit button
            $('#briefDescriptionPreview').addClass('hidden');
            $('.edit-button').addClass('hidden');
            // show textarea and save button
            $('#briefDescriptionEdit').removeClass('hidden');
            $('.save-button').removeClass('hidden');
        });

        $('.loc-edit-button').click(function(event) {
            event.preventDefault();
            // hide paragraph and edit button
            $('#locationDescriptionPreview').addClass('hidden');
            $('.loc-edit-button').addClass('hidden');
            // show textarea and save button
            $('#locationDescriptionEdit').removeClass('hidden');
            $('.loc-save-button').removeClass('hidden');
        });
    }
    /**
     * Set up the click event for saving
     * brief description
     */
    setSaveBriefDescriptionEvent() {
        $('.save-button').click(function(event) {
            event.preventDefault(); // hide textarea and save button
            $('#briefDescriptionEdit').addClass('hidden');
            $('.save-button').addClass('hidden');
            const data = {
                description: $('#briefDescriptionEdit').val(),
                detailType: 'situation',
            };
            EmergencyStatusDetail.getInstance().saveDescriptionEvent('situation', data);
        });
    }
    /**
     * Set up the click event for saving
     * location description
     */
    setSaveLocationDescriptionEvent() {
        $('.loc-save-button').click(function(event) {
            event.preventDefault();
            // hide textarea and save button
            $('#locationDescriptionEdit').addClass('hidden');
            $('.loc-save-button').addClass('hidden');
            const data = {
                description: $('#locationDescriptionEdit').val(),
                detailType: 'location',
            };
            EmergencyStatusDetail.getInstance().saveDescriptionEvent('location', data);
        });
    }


    /**
     * Saves the emergency status data by type of detail
     * @param  {[type]} type [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    saveDescriptionEvent(type, data) {
        const userId = Cookies.get('user-id');
        APIHandler.getInstance()
            .sendRequest(
                '/emergencyStatusDetail/' + userId,
                'put',
                data,
                true,
                null
            )
            .then((response) => {
                if (type.localeCompare('situation') == 0) {
                    document.getElementById('briefDescriptionPreview').innerHTML =
                        response.status_description;
                    document.getElementById('briefDescriptionEdit').innerHTML =
                        response.status_description;
                    $('#briefDescriptionPreview').removeClass('hidden');
                    $('.edit-button').removeClass('hidden');
                } else {
                    document.getElementById('locationDescriptionPreview').innerHTML =
                        response.share_location;
                    document.getElementById('locationDescriptionEdit').innerHTML =
                        response.share_location;
                    $('#locationDescriptionPreview').removeClass('hidden');
                    $('.loc-edit-button').removeClass('hidden');
                }

                // show paragraph and edit button
                $('#locationDescriptionPreview').removeClass('hidden');
                $('.loc-edit-button').removeClass('hidden');
            })
            .catch((error) => {
                alert(error);
            });
    }

    /**
     * Set up the click event for delete one picture and
     * its description
     */
    setDeletePictureEvent(pictureId) {
        $('#' + pictureId).click(function(event) {
            event.preventDefault();

            APIHandler.getInstance()
                .sendRequest(
                    '/emergencyStatusDetail/picture/' + pictureId,
                    'delete',
                    null,
                    true,
                    null
                )
                .then((response) => { })
                .catch((error) => {
                    $('#delete-alert').html(error);
                    $('#delte-alert').show();
                });

            // delete picture in the frontend
            $('*[data-pic-id="' + pictureId + '"]').remove();

            // $("#"+pictureId).remove();
        });
    }
    /**
     * Set up the click event for adding one picture and
     * its description
     */
    setAddPictureEvent() {
        $('.add-button').click(function(event) {
            event.preventDefault();
            $('#addPictureModal').modal('show');

            $('#file').change(function() {
                $('#picDiscription').removeClass('hidden');
                $('.upload-button').removeClass('hidden');
            });

            EmergencyStatusDetail.getInstance().setUploadEvent();
        });
    }
    /**
     * Set up the click event for uploading one picture and
     * its description
     */
    setUploadEvent() {
        $('.upload-button')
            .unbind()
            .click(function(event) {
                event.preventDefault();
                const jwt = Cookies.get('user-jwt-esn');
                const userId = Cookies.get('user-id');
                const fd = new FormData();
                const files = $('#file')[0].files[0];
                fd.append('picture', files);
                fd.append('pictureDescription', $('#picDiscription').val());

                $('#addPictureModal').modal('hide');

                $.ajax({
                    url: apiPath + '/emergencyStatusDetail/' + userId,
                    type: 'post',
                    headers: {
                        Authorization: jwt,
                    },
                    data: fd,
                    contentType: false,
                    processData: false,
                })
                    .done(function(response) {
                        EmergencyStatusDetail.getInstance().drawPictureAndDescription(
                            response
                        );
                        $('#picDiscription').val('');
                        $('#file').val('');
                        $('#picDiscription').addClass('hidden');
                        $('.upload-button').addClass('hidden');
                    })
                    .fail(function(e) {
                        $('#upload-alert').html(e);
                        $('#upload-alert').show();
                    });
            });
    }
    /**
     * Function for drawing pictures and discriptions to the view
     */
    drawPictureAndDescription(pictureObj) {
        const t = document.querySelector('#pictureAndDescriptionTemplate');
        t.content.querySelector('img').src = pictureObj.picture_path;
        t.content.querySelector('button').id = pictureObj._id;
        t.content.querySelector('p').innerHTML = pictureObj.picture_description;
        const clone = document.importNode(t.content, true);
        clone
            .querySelector('.picAndDesBlock')
            .setAttribute('data-pic-id', pictureObj._id);
        const pictureContainer = document.getElementsByClassName('sharePicture');
        pictureContainer[0].appendChild(clone);

        EmergencyStatusDetail.getInstance().setDeletePictureEvent(pictureObj._id);
    }
    /**
     * Function for generating the emergency status detail page
     */
    generatePreviewPage() {
        EmergencyStatusDetail.getInstance().setEditDescriptionEvent();
        EmergencyStatusDetail.getInstance().setSaveBriefDescriptionEvent();
        EmergencyStatusDetail.getInstance().setSaveLocationDescriptionEvent();
        EmergencyStatusDetail.getInstance().setAddPictureEvent();
        // retrieve brief description and location description
        EmergencyStatusDetail.getInstance().retrieveBriefAndLocDescription();
        // get picture and description
        EmergencyStatusDetail.getInstance().retrievePicAndDescription();
    }
    /**
     * Function for retrieving brief description and location description
     */
    retrieveBriefAndLocDescription() {
        const userId = Cookies.get('user-id');
        // get brief description and location description
        APIHandler.getInstance()
            .sendRequest('/emergencyStatusDetail/' + userId, 'get', null, true, null)
            .then((response) => {
                if (response != null) {
                    // brief description
                    document.getElementById('briefDescriptionPreview').innerHTML =
                        response.status_description;
                    document.getElementById('briefDescriptionEdit').innerHTML =
                        response.status_description;
                    $('#briefDescriptionPreview').removeClass('hidden');
                    // location description
                    document.getElementById('locationDescriptionPreview').innerHTML =
                        response.share_location;
                    document.getElementById('locationDescriptionEdit').innerHTML =
                        response.share_location;
                    $('#locationDescriptionPreview').removeClass('hidden');
                }
            })
            .catch((error) => {
                $('#get-emergency-detail-alert').html(error);
                $('#get-emergency-detail-alert').show();
            });
    }
    /**
     * Function for getting picture and description
     */
    retrievePicAndDescription() {
        const userId = Cookies.get('user-id');
        APIHandler.getInstance()
            .sendRequest(
                '/emergencyStatusDetail/picture/' + userId,
                'get',
                null,
                true,
                null
            )
            .then((response) => {
                response.forEach(function(pictureObj) {
                    EmergencyStatusDetail.getInstance().drawPictureAndDescription(
                        pictureObj
                    );
                });
            })
            .catch((error) => {
                $('#get-picture-and-description-alert').html(error);
                $('#get-picture-and-description-alert').show();
            });
    }
}

$(function() {
    EmergencyStatusDetail.getInstance().generatePreviewPage();
});
