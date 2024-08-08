'use strict';{window.DOMHandler=class DOMHandler{constructor(iRuntime,componentId){this._iRuntime=iRuntime;this._componentId=componentId;this._hasTickCallback=false;this._tickCallback=()=>this.Tick()}Attach(){}PostToRuntime(handler,data,dispatchOpts,transferables){this._iRuntime.PostToRuntimeComponent(this._componentId,handler,data,dispatchOpts,transferables)}PostToRuntimeAsync(handler,data,dispatchOpts,transferables){return this._iRuntime.PostToRuntimeComponentAsync(this._componentId,handler,data,
dispatchOpts,transferables)}_PostToRuntimeMaybeSync(name,data,dispatchOpts){if(this._iRuntime.UsesWorker())this.PostToRuntime(name,data,dispatchOpts);else this._iRuntime._GetLocalRuntime()["_OnMessageFromDOM"]({"type":"event","component":this._componentId,"handler":name,"dispatchOpts":dispatchOpts||null,"data":data,"responseId":null})}AddRuntimeMessageHandler(handler,func){this._iRuntime.AddRuntimeComponentMessageHandler(this._componentId,handler,func)}AddRuntimeMessageHandlers(list){for(const [handler,
func]of list)this.AddRuntimeMessageHandler(handler,func)}GetRuntimeInterface(){return this._iRuntime}GetComponentID(){return this._componentId}_StartTicking(){if(this._hasTickCallback)return;this._iRuntime._AddRAFCallback(this._tickCallback);this._hasTickCallback=true}_StopTicking(){if(!this._hasTickCallback)return;this._iRuntime._RemoveRAFCallback(this._tickCallback);this._hasTickCallback=false}Tick(){}};window.RateLimiter=class RateLimiter{constructor(callback,interval){this._callback=callback;
this._interval=interval;this._timerId=-1;this._lastCallTime=-Infinity;this._timerCallFunc=()=>this._OnTimer();this._ignoreReset=false;this._canRunImmediate=false}SetCanRunImmediate(c){this._canRunImmediate=!!c}Call(){if(this._timerId!==-1)return;const nowTime=Date.now();const timeSinceLastCall=nowTime-this._lastCallTime;const interval=this._interval;if(timeSinceLastCall>=interval&&this._canRunImmediate){this._lastCallTime=nowTime;this._RunCallback()}else this._timerId=self.setTimeout(this._timerCallFunc,
Math.max(interval-timeSinceLastCall,4))}_RunCallback(){this._ignoreReset=true;this._callback();this._ignoreReset=false}Reset(){if(this._ignoreReset)return;this._CancelTimer();this._lastCallTime=Date.now()}_OnTimer(){this._timerId=-1;this._lastCallTime=Date.now();this._RunCallback()}_CancelTimer(){if(this._timerId!==-1){self.clearTimeout(this._timerId);this._timerId=-1}}Release(){this._CancelTimer();this._callback=null;this._timerCallFunc=null}}};


'use strict';{class ElementState{constructor(elem){this._elem=elem;this._hadFirstUpdate=false;this._isVisibleFlag=true;this._wantHtmlIndex=-1;this._actualHtmlIndex=-1;this._htmlZIndex=-1}SetVisibleFlag(f){this._isVisibleFlag=!!f}GetVisibleFlag(){return this._isVisibleFlag}HadFirstUpdate(){return this._hadFirstUpdate}SetHadFirstUpdate(){this._hadFirstUpdate=true}GetWantHTMLIndex(){return this._wantHtmlIndex}SetWantHTMLIndex(i){this._wantHtmlIndex=i}GetActualHTMLIndex(){return this._actualHtmlIndex}SetActualHTMLIndex(i){this._actualHtmlIndex=
i}SetHTMLZIndex(z){this._htmlZIndex=z}GetHTMLZIndex(){return this._htmlZIndex}GetElement(){return this._elem}}window.DOMElementHandler=class DOMElementHandler extends self.DOMHandler{constructor(iRuntime,componentId){super(iRuntime,componentId);this._elementMap=new Map;this._autoAttach=true;this.AddRuntimeMessageHandlers([["create",e=>this._OnCreate(e)],["destroy",e=>this._OnDestroy(e)],["set-visible",e=>this._OnSetVisible(e)],["update-position",e=>this._OnUpdatePosition(e)],["update-state",e=>this._OnUpdateState(e)],
["focus",e=>this._OnSetFocus(e)],["set-css-style",e=>this._OnSetCssStyle(e)],["set-attribute",e=>this._OnSetAttribute(e)],["remove-attribute",e=>this._OnRemoveAttribute(e)]]);this.AddDOMElementMessageHandler("get-element",elem=>elem)}SetAutoAttach(e){this._autoAttach=!!e}AddDOMElementMessageHandler(handler,func){this.AddRuntimeMessageHandler(handler,e=>{const elementId=e["elementId"];const elem=this.GetElementById(elementId);return func(elem,e)})}_OnCreate(e){const elementId=e["elementId"];const elem=
this.CreateElement(elementId,e);const elementState=new ElementState(elem);this._elementMap.set(elementId,elementState);elem.style.boxSizing="border-box";elem.style.display="none";elementState.SetVisibleFlag(e["isVisible"]);const focusElem=this._GetFocusElement(elem);focusElem.addEventListener("focus",e=>this._OnFocus(elementId));focusElem.addEventListener("blur",e=>this._OnBlur(elementId));const wantHtmlIndex=e["htmlIndex"];elementState.SetWantHTMLIndex(wantHtmlIndex);elementState.SetHTMLZIndex(e["htmlZIndex"]);
if(this._autoAttach){const actualHtmlIndex=this.GetRuntimeInterface().GetAvailableHTMLIndex(wantHtmlIndex);elementState.SetActualHTMLIndex(actualHtmlIndex);const parent=this.GetRuntimeInterface().GetHTMLWrapElement(actualHtmlIndex);parent.appendChild(elem)}}CreateElement(elementId,e){throw new Error("required override");}DestroyElement(elem){}_OnDestroy(e){const elementId=e["elementId"];const elem=this.GetElementById(elementId);this.DestroyElement(elem);if(this._autoAttach)elem.parentElement.removeChild(elem);
this._elementMap.delete(elementId)}PostToRuntimeElement(handler,elementId,data){if(!data)data={};data["elementId"]=elementId;this.PostToRuntime(handler,data)}_PostToRuntimeElementMaybeSync(handler,elementId,data){if(!data)data={};data["elementId"]=elementId;this._PostToRuntimeMaybeSync(handler,data)}_OnSetVisible(e){if(!this._autoAttach)return;const elemState=this._elementMap.get(e["elementId"]);const elem=elemState.GetElement();if(elemState.HadFirstUpdate())elem.style.display=e["isVisible"]?"":"none";
else elemState.SetVisibleFlag(e["isVisible"])}_OnUpdatePosition(e){if(!this._autoAttach)return;const elemState=this._elementMap.get(e["elementId"]);const elem=elemState.GetElement();const iRuntime=this.GetRuntimeInterface();elem.style.left=e["left"]+"px";elem.style.top=e["top"]+"px";elem.style.width=e["width"]+"px";elem.style.height=e["height"]+"px";const fontSize=e["fontSize"];if(fontSize!==null)elem.style.fontSize=fontSize+"em";const wantHtmlIndex=e["htmlIndex"];elemState.SetWantHTMLIndex(wantHtmlIndex);
const actualHtmlIndex=iRuntime.GetAvailableHTMLIndex(wantHtmlIndex);if(actualHtmlIndex!==elemState.GetActualHTMLIndex()){elem.remove();const parent=iRuntime.GetHTMLWrapElement(actualHtmlIndex);parent.appendChild(elem);elemState.SetActualHTMLIndex(actualHtmlIndex);iRuntime._UpdateHTMLElementsZOrder()}const htmlZIndex=e["htmlZIndex"];if(htmlZIndex!==elemState.GetHTMLZIndex()){elemState.SetHTMLZIndex(htmlZIndex);iRuntime._UpdateHTMLElementsZOrder()}if(!elemState.HadFirstUpdate()){elemState.SetHadFirstUpdate();
if(elemState.GetVisibleFlag())elem.style.display=""}}_OnHTMLLayersChanged(){if(!this._autoAttach)return;for(const elemState of this._elementMap.values()){const wantHtmlIndex=this.GetRuntimeInterface().GetAvailableHTMLIndex(elemState.GetWantHTMLIndex());const actualHtmlIndex=elemState.GetActualHTMLIndex();if(wantHtmlIndex!==-1&&actualHtmlIndex!==-1&&wantHtmlIndex!==actualHtmlIndex){const elem=elemState.GetElement();elem.remove();const parent=this.GetRuntimeInterface().GetHTMLWrapElement(wantHtmlIndex);
parent.appendChild(elem);elemState.SetActualHTMLIndex(wantHtmlIndex)}}}_GetAllElementStatesForZOrderUpdate(){if(!this._autoAttach)return null;return[...this._elementMap.values()]}_OnUpdateState(e){const elem=this.GetElementById(e["elementId"]);this.UpdateState(elem,e)}UpdateState(elem,e){throw new Error("required override");}_GetFocusElement(elem){return elem}_OnFocus(elementId){this.PostToRuntimeElement("elem-focused",elementId)}_OnBlur(elementId){this.PostToRuntimeElement("elem-blurred",elementId)}_OnSetFocus(e){const elem=
this._GetFocusElement(this.GetElementById(e["elementId"]));if(e["focus"])elem.focus();else elem.blur()}_OnSetCssStyle(e){const elem=this.GetElementById(e["elementId"]);const prop=e["prop"];const val=e["val"];if(prop.startsWith("--"))elem.style.setProperty(prop,val);else elem.style[prop]=val}_OnSetAttribute(e){const elem=this.GetElementById(e["elementId"]);elem.setAttribute(e["name"],e["val"])}_OnRemoveAttribute(e){const elem=this.GetElementById(e["elementId"]);elem.removeAttribute(e["name"])}GetElementById(elementId){const elementState=
this._elementMap.get(elementId);if(!elementState)throw new Error(`no element with id ${elementId}`);return elementState.GetElement()}}};


'use strict';{const isiOSLike=/(iphone|ipod|ipad|macos|macintosh|mac os x)/i.test(navigator.userAgent);const isAndroid=/android/i.test(navigator.userAgent);const isSafari=/safari/i.test(navigator.userAgent)&&!/(chrome|chromium|edg\/|OPR\/|nwjs)/i.test(navigator.userAgent);let resolveCounter=0;function AddScript(url){const elem=document.createElement("script");elem.async=false;elem.type="module";if(url.isStringSrc)return new Promise(resolve=>{const resolveName="c3_resolve_"+resolveCounter;++resolveCounter;
self[resolveName]=resolve;elem.textContent=url.str+`\n\nself["${resolveName}"]();`;document.head.appendChild(elem)});else return new Promise((resolve,reject)=>{elem.onload=resolve;elem.onerror=reject;elem.src=url;document.head.appendChild(elem)})}async function CheckSupportsWorkerMode(){if(!navigator["userActivation"]||typeof OffscreenCanvas==="undefined")return false;try{const workerScript=`
	self.addEventListener("message", () =>
	{
		try {
			const offscreenCanvas = new OffscreenCanvas(32, 32);
			const gl = offscreenCanvas.getContext("webgl");
			self.postMessage(!!gl);
		}
		catch (err)
		{
			console.warn("Feature detection worker error:", err);
			self.postMessage(false);
		}
	});`;let isWorkerModuleSupported=false;const workerScriptBlob=new Blob([workerScript],{"type":"text/javascript"});const w=new Worker(URL.createObjectURL(workerScriptBlob),{get type(){isWorkerModuleSupported=true}});const result=await new Promise(resolve=>{w.addEventListener("message",e=>{w.terminate();resolve(e.data)});w.postMessage("")});return isWorkerModuleSupported&&result}catch(err){console.warn("Error feature detecting worker mode: ",err);return false}}let tmpAudio=new Audio;const supportedAudioFormats=
{"audio/webm; codecs=opus":!!tmpAudio.canPlayType("audio/webm; codecs=opus"),"audio/ogg; codecs=opus":!!tmpAudio.canPlayType("audio/ogg; codecs=opus"),"audio/webm; codecs=vorbis":!!tmpAudio.canPlayType("audio/webm; codecs=vorbis"),"audio/ogg; codecs=vorbis":!!tmpAudio.canPlayType("audio/ogg; codecs=vorbis"),"audio/mp4":!!tmpAudio.canPlayType("audio/mp4"),"audio/mpeg":!!tmpAudio.canPlayType("audio/mpeg")};tmpAudio=null;async function BlobToString(blob){const arrayBuffer=await BlobToArrayBuffer(blob);
const textDecoder=new TextDecoder("utf-8");return textDecoder.decode(arrayBuffer)}function BlobToArrayBuffer(blob){return new Promise((resolve,reject)=>{const fileReader=new FileReader;fileReader.onload=e=>resolve(e.target.result);fileReader.onerror=err=>reject(err);fileReader.readAsArrayBuffer(blob)})}const queuedArrayBufferReads=[];let activeArrayBufferReads=0;const MAX_ARRAYBUFFER_READS=8;window["RealFile"]=window["File"];const domHandlerClasses=[];const runtimeEventHandlers=new Map;const pendingResponsePromises=
new Map;let nextResponseId=0;const runOnStartupFunctions=[];self.runOnStartup=function runOnStartup(f){if(typeof f!=="function")throw new Error("runOnStartup called without a function");runOnStartupFunctions.push(f)};const WEBVIEW_EXPORT_TYPES=new Set(["cordova","playable-ad","instant-games"]);function IsWebViewExportType(exportType){return WEBVIEW_EXPORT_TYPES.has(exportType)}let isWrapperFullscreen=false;window.RuntimeInterface=class RuntimeInterface{constructor(opts){this._useWorker=opts.useWorker;
this._messageChannelPort=null;this._runtimeBaseUrl="";this._scriptFolder=opts.scriptFolder;this._workerScriptURLs={};this._worker=null;this._localRuntime=null;this._domHandlers=[];this._runtimeDomHandler=null;this._isFirstSizeUpdate=true;this._canvasLayers=[];this._pendingRemoveElements=[];this._pendingUpdateHTMLZOrder=false;this._updateHTMLZOrderRAFCallback=()=>this._DoUpdateHTMLElementsZOrder();this._isExportingToVideo=false;this._exportToVideoDuration=0;this._jobScheduler=null;this._rafId=-1;this._rafFunc=
()=>this._OnRAFCallback();this._rafCallbacks=new Set;this._wrapperInitResolve=null;this._wrapperComponentIds=[];this._exportType=opts.exportType;this._isFileProtocol=location.protocol.substr(0,4)==="file";this._directoryHandles=[];if(this._exportType==="playable-ad"||this._exportType==="instant-games")this._useWorker=false;if(isSafari)this._useWorker=false;if(this._exportType==="cordova"&&this._useWorker)if(isAndroid){const chromeVer=/Chrome\/(\d+)/i.exec(navigator.userAgent);if(!chromeVer||!(parseInt(chromeVer[1],
10)>=90))this._useWorker=false}if(this.IsAnyWebView2Wrapper())self["chrome"]["webview"].addEventListener("message",e=>this._OnWrapperMessage(e.data,e["additionalObjects"]));else if(this._exportType==="macos-wkwebview")self["C3WrapperOnMessage"]=msg=>this._OnWrapperMessage(msg);this._localFileBlobs=null;this._localFileStrings=null;if(this._exportType==="html5"&&!window.isSecureContext)console.warn("[Construct] Warning: the browser indicates this is not a secure context. Some features may be unavailable. Use secure (HTTPS) hosting to ensure all features are available.");
this.AddRuntimeComponentMessageHandler("canvas","update-size",e=>this._OnUpdateCanvasSize(e));this.AddRuntimeComponentMessageHandler("canvas","set-html-layer-count",e=>this["_OnSetHTMLLayerCount"](e));this.AddRuntimeComponentMessageHandler("canvas","cleanup-html-layers",()=>this._OnCleanUpHTMLLayers());this.AddRuntimeComponentMessageHandler("runtime","cordova-fetch-local-file",e=>this._OnCordovaFetchLocalFile(e));this.AddRuntimeComponentMessageHandler("runtime","create-job-worker",e=>this._OnCreateJobWorker(e));
this.AddRuntimeComponentMessageHandler("runtime","send-wrapper-extension-message",e=>this._OnSendWrapperExtensionMessage(e));if(this._exportType==="cordova")document.addEventListener("deviceready",()=>this._Init(opts));else this._Init(opts)}Release(){this._CancelAnimationFrame();if(this._messageChannelPort){this._messageChannelPort.onmessage=null;this._messageChannelPort=null}if(this._worker){this._worker.terminate();this._worker=null}if(this._localRuntime){this._localRuntime.Release();this._localRuntime=
null}for(const {canvas,htmlWrap}of this._canvasLayers){canvas.remove();htmlWrap.remove()}this._canvasLayers.length=0}GetMainCanvas(){return this._canvasLayers[0].canvas}GetAvailableHTMLIndex(index){return Math.min(index,this._canvasLayers.length-1)}GetHTMLWrapElement(index){if(index<0||index>=this._canvasLayers.length)throw new RangeError("invalid canvas layer");return this._canvasLayers[index].htmlWrap}["_GetHTMLWrapElement"](index){return this.GetHTMLWrapElement(index)}GetRuntimeBaseURL(){return this._runtimeBaseUrl}UsesWorker(){return this._useWorker}GetExportType(){return this._exportType}IsFileProtocol(){return this._isFileProtocol}GetScriptFolder(){return this._scriptFolder}IsiOSCordova(){return isiOSLike&&
this._exportType==="cordova"}IsiOSWebView(){const ua=navigator.userAgent;return isiOSLike&&IsWebViewExportType(this._exportType)||navigator["standalone"]||/crios\/|fxios\/|edgios\//i.test(ua)}IsAndroid(){return isAndroid}IsAndroidWebView(){return isAndroid&&IsWebViewExportType(this._exportType)}IsWindowsWebView2(){return this._exportType==="windows-webview2"||!!(this._exportType==="preview"&&window["chrome"]&&window["chrome"]["webview"]&&window["chrome"]["webview"]["postMessage"])}IsAnyWebView2Wrapper(){return this.IsWindowsWebView2()||
this._exportType==="xbox-uwp-webview2"}async _Init(opts){if(this._useWorker){const isWorkerModeSupported=await CheckSupportsWorkerMode();if(!isWorkerModeSupported)this._useWorker=false}if(this._exportType==="macos-wkwebview")this._SendWrapperMessage({"type":"ready"});else if(this.IsAnyWebView2Wrapper()){this._SetupWebView2Polyfills();const result=await this._InitWrapper();this._wrapperComponentIds=result["registeredComponentIds"]}if(this._exportType==="playable-ad"){this._localFileBlobs=self["c3_base64files"];
this._localFileStrings={};await this._ConvertDataUrisToBlobs();for(let i=0,len=opts.engineScripts.length;i<len;++i){const src=opts.engineScripts[i];if(this._localFileStrings.hasOwnProperty(src))opts.engineScripts[i]={isStringSrc:true,str:this._localFileStrings[src]};else if(this._localFileBlobs.hasOwnProperty(src))opts.engineScripts[i]=URL.createObjectURL(this._localFileBlobs[src])}opts.workerDependencyScripts=[]}if(this._exportType==="nwjs"&&self["nw"]&&self["nw"]["App"]["manifest"]["c3-steam-mode"]){let frameNum=
0;this._AddRAFCallback(()=>{frameNum++;document.documentElement.style.opacity=frameNum%2===0?"1":"0.999"})}if(opts.runtimeBaseUrl)this._runtimeBaseUrl=opts.runtimeBaseUrl;else{const origin=location.origin;this._runtimeBaseUrl=(origin==="null"?"file:///":origin)+location.pathname;const i=this._runtimeBaseUrl.lastIndexOf("/");if(i!==-1)this._runtimeBaseUrl=this._runtimeBaseUrl.substr(0,i+1)}if(opts.workerScripts)this._workerScriptURLs=opts.workerScripts;const messageChannel=new MessageChannel;this._messageChannelPort=
messageChannel.port1;this._messageChannelPort.onmessage=e=>this["_OnMessageFromRuntime"](e.data);if(window["c3_addPortMessageHandler"])window["c3_addPortMessageHandler"](e=>this._OnMessageFromDebugger(e));this._jobScheduler=new self.JobSchedulerDOM(this);await this._jobScheduler.Init();if(typeof window["StatusBar"]==="object")window["StatusBar"]["hide"]();if(typeof window["AndroidFullScreen"]==="object")try{await new Promise((resolve,reject)=>{window["AndroidFullScreen"]["immersiveMode"](resolve,
reject)})}catch(err){console.error("Failed to enter Android immersive mode: ",err)}if(this._useWorker)await this._InitWorker(opts,messageChannel.port2);else await this._InitDOM(opts,messageChannel.port2)}_GetWorkerURL(url){let ret;if(this._workerScriptURLs.hasOwnProperty(url))ret=this._workerScriptURLs[url];else if(url.endsWith("/workermain.js")&&this._workerScriptURLs.hasOwnProperty("workermain.js"))ret=this._workerScriptURLs["workermain.js"];else if(this._exportType==="playable-ad"&&this._localFileBlobs.hasOwnProperty(url))ret=
this._localFileBlobs[url];else ret=url;if(ret instanceof Blob)ret=URL.createObjectURL(ret);return ret}async CreateWorker(url,baseUrl,workerOpts){if(url.startsWith("blob:"))return new Worker(url,workerOpts);if(this._exportType==="cordova"&&this._isFileProtocol){let filePath="";if(workerOpts.isC3MainWorker)filePath=url;else filePath=this._scriptFolder+url;const arrayBuffer=await this.CordovaFetchLocalFileAsArrayBuffer(filePath);const blob=new Blob([arrayBuffer],{type:"application/javascript"});return new Worker(URL.createObjectURL(blob),
workerOpts)}const absUrl=new URL(url,baseUrl);const isCrossOrigin=location.origin!==absUrl.origin;if(isCrossOrigin){const response=await fetch(absUrl);if(!response.ok)throw new Error("failed to fetch worker script");const blob=await response.blob();return new Worker(URL.createObjectURL(blob),workerOpts)}else return new Worker(absUrl,workerOpts)}_GetWindowInnerWidth(){return Math.max(window.innerWidth,1)}_GetWindowInnerHeight(){return Math.max(window.innerHeight,1)}GetCssDisplayMode(){if(this.IsAnyWebView2Wrapper())return"standalone";
const exportType=this.GetExportType();const standaloneExportTypes=new Set(["cordova","nwjs","macos-wkwebview"]);if(standaloneExportTypes.has(exportType))return"standalone";if(window.matchMedia("(display-mode: fullscreen)").matches)return"fullscreen";else if(window.matchMedia("(display-mode: standalone)").matches)return"standalone";else if(window.matchMedia("(display-mode: minimal-ui)").matches)return"minimal-ui";else if(navigator["standalone"])return"standalone";else return"browser"}_GetCommonRuntimeOptions(opts){return{"runtimeBaseUrl":this._runtimeBaseUrl,
"previewUrl":location.href,"windowInnerWidth":this._GetWindowInnerWidth(),"windowInnerHeight":this._GetWindowInnerHeight(),"cssDisplayMode":this.GetCssDisplayMode(),"devicePixelRatio":window.devicePixelRatio,"isFullscreen":RuntimeInterface.IsDocumentFullscreen(),"projectData":opts.projectData,"previewImageBlobs":window["cr_previewImageBlobs"]||this._localFileBlobs,"previewProjectFileBlobs":window["cr_previewProjectFileBlobs"],"previewProjectFileSWUrls":window["cr_previewProjectFiles"],"swClientId":window["cr_swClientId"]||
"","exportType":opts.exportType,"isDebug":(new URLSearchParams(self.location.search)).has("debug"),"ife":!!self.ife,"jobScheduler":this._jobScheduler.GetPortData(),"supportedAudioFormats":supportedAudioFormats,"opusWasmScriptUrl":window["cr_opusWasmScriptUrl"]||this._scriptFolder+"opus.wasm.js","opusWasmBinaryUrl":window["cr_opusWasmBinaryUrl"]||this._scriptFolder+"opus.wasm.wasm","isFileProtocol":this._isFileProtocol,"isiOSCordova":this.IsiOSCordova(),"isiOSWebView":this.IsiOSWebView(),"isWindowsWebView2":this.IsWindowsWebView2(),
"isAnyWebView2Wrapper":this.IsAnyWebView2Wrapper(),"wrapperComponentIds":this._wrapperComponentIds,"isFBInstantAvailable":typeof self["FBInstant"]!=="undefined"}}async _InitWorker(opts,port2){const workerMainUrl=this._GetWorkerURL(opts.workerMainUrl);if(this._exportType==="preview"){this._worker=new Worker("previewworker.js",{type:"module",name:"Runtime"});await new Promise((resolve,reject)=>{const messageHandler=e=>{this._worker.removeEventListener("message",messageHandler);if(e.data&&e.data["type"]===
"ok")resolve();else reject()};this._worker.addEventListener("message",messageHandler);this._worker.postMessage({"type":"construct-worker-init","import":(new URL(workerMainUrl,this._runtimeBaseUrl)).toString()})})}else this._worker=await this.CreateWorker(workerMainUrl,this._runtimeBaseUrl,{type:"module",name:"Runtime",isC3MainWorker:true});const canvas=document.createElement("canvas");canvas.style.display="none";const offscreenCanvas=canvas["transferControlToOffscreen"]();document.body.appendChild(canvas);
const htmlWrap=document.createElement("div");htmlWrap.className="c3htmlwrap";document.body.appendChild(htmlWrap);this._canvasLayers.push({canvas,htmlWrap});window["c3canvas"]=canvas;if(self["C3_InsertHTMLPlaceholders"])self["C3_InsertHTMLPlaceholders"]();let workerDependencyScripts=opts.workerDependencyScripts||[];let engineScripts=opts.engineScripts;workerDependencyScripts=await Promise.all(workerDependencyScripts.map(url=>this._MaybeGetCordovaScriptURL(url)));engineScripts=await Promise.all(engineScripts.map(url=>
this._MaybeGetCordovaScriptURL(url)));if(this._exportType==="cordova")for(let i=0,len=opts.projectScripts.length;i<len;++i){const info=opts.projectScripts[i];const originalUrl=info[0];if(originalUrl===opts.mainProjectScript||(originalUrl==="scriptsInEvents.js"||originalUrl.endsWith("/scriptsInEvents.js")))info[1]=await this._MaybeGetCordovaScriptURL(originalUrl)}this._worker.postMessage(Object.assign(this._GetCommonRuntimeOptions(opts),{"type":"init-runtime","isInWorker":true,"messagePort":port2,
"canvas":offscreenCanvas,"workerDependencyScripts":workerDependencyScripts,"engineScripts":engineScripts,"projectScripts":opts.projectScripts,"mainProjectScript":opts.mainProjectScript,"projectScriptsStatus":self["C3_ProjectScriptsStatus"]}),[port2,offscreenCanvas,...this._jobScheduler.GetPortTransferables()]);this._domHandlers=domHandlerClasses.map(C=>new C(this));this._FindRuntimeDOMHandler();this._runtimeDomHandler._AddDefaultCanvasEventHandlers(canvas);this._runtimeDomHandler._AddDefaultHTMLWrapEventHandlers(htmlWrap);
this._runtimeDomHandler._EnableWindowResizeEvent();self["c3_callFunction"]=(name,params)=>this._runtimeDomHandler._InvokeFunctionFromJS(name,params);if(this._exportType==="preview")self["goToLastErrorScript"]=()=>this.PostToRuntimeComponent("runtime","go-to-last-error-script")}async _InitDOM(opts,port2){const canvas=document.createElement("canvas");canvas.style.display="none";document.body.appendChild(canvas);const htmlWrap=document.createElement("div");htmlWrap.className="c3htmlwrap";document.body.appendChild(htmlWrap);
this._canvasLayers.push({canvas,htmlWrap});window["c3canvas"]=canvas;if(self["C3_InsertHTMLPlaceholders"])self["C3_InsertHTMLPlaceholders"]();this._domHandlers=domHandlerClasses.map(C=>new C(this));this._FindRuntimeDOMHandler();this._runtimeDomHandler._AddDefaultCanvasEventHandlers(canvas);this._runtimeDomHandler._AddDefaultHTMLWrapEventHandlers(htmlWrap);let engineScripts=opts.engineScripts.map(url=>typeof url==="string"?(new URL(url,this._runtimeBaseUrl)).toString():url);if(Array.isArray(opts.workerDependencyScripts)){const workerDependencyScripts=
[...opts.workerDependencyScripts].map(s=>s instanceof Blob?URL.createObjectURL(s):s);engineScripts.unshift(...workerDependencyScripts)}engineScripts=await Promise.all(engineScripts.map(url=>this._MaybeGetCordovaScriptURL(url)));await Promise.all(engineScripts.map(url=>AddScript(url)));const scriptsStatus=self["C3_ProjectScriptsStatus"];const mainProjectScript=opts.mainProjectScript;const allProjectScripts=opts.projectScripts;for(let [originalUrl,loadUrl]of allProjectScripts){if(!loadUrl)loadUrl=originalUrl;
if(originalUrl===mainProjectScript)try{loadUrl=await this._MaybeGetCordovaScriptURL(loadUrl);await AddScript(loadUrl);if(this._exportType==="preview"&&!scriptsStatus[originalUrl])this._ReportProjectMainScriptError(originalUrl,"main script did not run to completion")}catch(err){this._ReportProjectMainScriptError(originalUrl,err)}else if(originalUrl==="scriptsInEvents.js"||originalUrl.endsWith("/scriptsInEvents.js")){loadUrl=await this._MaybeGetCordovaScriptURL(loadUrl);await AddScript(loadUrl)}}if(this._exportType===
"preview"&&typeof self.C3.ScriptsInEvents!=="object"){this._RemoveLoadingMessage();const msg="Failed to load JavaScript code used in events. Check all your JavaScript code has valid syntax.";console.error("[C3 runtime] "+msg);alert(msg);return}const runtimeOpts=Object.assign(this._GetCommonRuntimeOptions(opts),{"isInWorker":false,"messagePort":port2,"canvas":canvas,"runOnStartupFunctions":runOnStartupFunctions});this._runtimeDomHandler._EnableWindowResizeEvent();this._OnBeforeCreateRuntime();this._localRuntime=
self["C3_CreateRuntime"](runtimeOpts);await self["C3_InitRuntime"](this._localRuntime,runtimeOpts)}_ReportProjectMainScriptError(url,err){this._RemoveLoadingMessage();console.error(`[Preview] Failed to load project main script (${url}): `,err);alert(`Failed to load project main script (${url}). Check all your JavaScript code has valid syntax. Press F12 and check the console for error details.`)}_OnBeforeCreateRuntime(){this._RemoveLoadingMessage()}_RemoveLoadingMessage(){const loadingElem=window["cr_previewLoadingElem"];
if(loadingElem){loadingElem.parentElement.removeChild(loadingElem);window["cr_previewLoadingElem"]=null}}async _OnCreateJobWorker(e){const outputPort=await this._jobScheduler._CreateJobWorker();return{"outputPort":outputPort,"transferables":[outputPort]}}_OnUpdateCanvasSize(e){if(this.IsExportingToVideo())return;const widthPx=e["styleWidth"]+"px";const heightPx=e["styleHeight"]+"px";const leftPx=e["marginLeft"]+"px";const topPx=e["marginTop"]+"px";for(const {canvas,htmlWrap}of this._canvasLayers){canvas.style.width=
widthPx;canvas.style.height=heightPx;canvas.style.marginLeft=leftPx;canvas.style.marginTop=topPx;htmlWrap.style.width=widthPx;htmlWrap.style.height=heightPx;htmlWrap.style.marginLeft=leftPx;htmlWrap.style.marginTop=topPx;if(this._isFirstSizeUpdate){canvas.style.display="";htmlWrap.style.display=""}}document.documentElement.style.setProperty("--construct-scale",e["displayScale"]);this._isFirstSizeUpdate=false}["_OnSetHTMLLayerCount"](e){const count=e["count"];const immediate=e["immediate"];const widthPx=
e["styleWidth"]+"px";const heightPx=e["styleHeight"]+"px";const leftPx=e["marginLeft"]+"px";const topPx=e["marginTop"]+"px";const addedCanvases=[];const transferables=[];if(count<this._canvasLayers.length)while(this._canvasLayers.length>count){const {canvas,htmlWrap}=this._canvasLayers.pop();htmlWrap.remove();if(this._useWorker&&!immediate)this._pendingRemoveElements.push(canvas);else canvas.remove()}else if(count>this._canvasLayers.length)for(let i=0,len=count-this._canvasLayers.length;i<len;++i){const canvas=
document.createElement("canvas");canvas.classList.add("c3overlay");if(this._useWorker){const offscreenCanvas=canvas["transferControlToOffscreen"]();addedCanvases.push(offscreenCanvas);transferables.push(offscreenCanvas)}else addedCanvases.push(canvas);document.body.appendChild(canvas);const htmlWrap=document.createElement("div");htmlWrap.classList.add("c3htmlwrap","c3overlay");document.body.appendChild(htmlWrap);canvas.style.width=widthPx;canvas.style.height=heightPx;canvas.style.marginLeft=leftPx;
canvas.style.marginTop=topPx;htmlWrap.style.width=widthPx;htmlWrap.style.height=heightPx;htmlWrap.style.marginLeft=leftPx;htmlWrap.style.marginTop=topPx;this._runtimeDomHandler._AddDefaultCanvasEventHandlers(canvas);this._runtimeDomHandler._AddDefaultHTMLWrapEventHandlers(htmlWrap);this._canvasLayers.push({canvas,htmlWrap})}for(const domHandler of this._domHandlers)if(domHandler instanceof window.DOMElementHandler)domHandler._OnHTMLLayersChanged();this._UpdateHTMLElementsZOrder();return{"addedCanvases":addedCanvases,
"transferables":transferables}}_OnCleanUpHTMLLayers(){for(const elem of this._pendingRemoveElements)elem.remove();this._pendingRemoveElements.length=0}_UpdateHTMLElementsZOrder(){if(this._pendingUpdateHTMLZOrder)return;this._pendingUpdateHTMLZOrder=true;this._AddRAFCallback(this._updateHTMLZOrderRAFCallback)}_DoUpdateHTMLElementsZOrder(){this._RemoveRAFCallback(this._updateHTMLZOrderRAFCallback);this._pendingUpdateHTMLZOrder=false;let allElementStates=[];for(const domHandler of this._domHandlers)if(domHandler instanceof
window.DOMElementHandler){const elemStates=domHandler._GetAllElementStatesForZOrderUpdate();if(elemStates)allElementStates.push(...elemStates)}allElementStates.sort((a,b)=>{const a1=a.GetActualHTMLIndex();const b1=b.GetActualHTMLIndex();if(a1!==b1)return a1-b1;const a2=a.GetHTMLZIndex();const b2=b.GetHTMLZIndex();return a2-b2});let curHtmlIndex=0;let s=0,i=0,len=allElementStates.length;for(;i<len;++i){const es=allElementStates[i];if(es.GetActualHTMLIndex()!==curHtmlIndex){this._DoUpdateHTMLElementsZOrderOnHTMLLayer(curHtmlIndex,
allElementStates.slice(s,i));curHtmlIndex=es.GetActualHTMLIndex();s=i}}if(s<i)this._DoUpdateHTMLElementsZOrderOnHTMLLayer(curHtmlIndex,allElementStates.slice(s,i))}_DoUpdateHTMLElementsZOrderOnHTMLLayer(htmlIndex,arr){if(arr.length<=1)return;if(htmlIndex>=this._canvasLayers.length)return;const newChildren=arr.map(es=>es.GetElement());const newChildrenSet=new Set(newChildren);const htmlWrap=this.GetHTMLWrapElement(htmlIndex);const existingChildren=Array.from(htmlWrap.children).filter(elem=>newChildrenSet.has(elem));
let i=0,len=Math.min(newChildren.length,existingChildren.length);for(;i<len;++i)if(newChildren[i]!==existingChildren[i])break;let j=i;for(;j<len;++j)existingChildren[j].remove();j=i;for(;j<len;++j)htmlWrap.appendChild(newChildren[j])}_GetLocalRuntime(){if(this._useWorker)throw new Error("not available in worker mode");return this._localRuntime}PostToRuntimeComponent(component,handler,data,dispatchOpts,transferables){this._messageChannelPort.postMessage({"type":"event","component":component,"handler":handler,
"dispatchOpts":dispatchOpts||null,"data":data,"responseId":null},transferables)}PostToRuntimeComponentAsync(component,handler,data,dispatchOpts,transferables){const responseId=nextResponseId++;const ret=new Promise((resolve,reject)=>{pendingResponsePromises.set(responseId,{resolve,reject})});this._messageChannelPort.postMessage({"type":"event","component":component,"handler":handler,"dispatchOpts":dispatchOpts||null,"data":data,"responseId":responseId},transferables);return ret}["_OnMessageFromRuntime"](data){const type=
data["type"];if(type==="event")return this._OnEventFromRuntime(data);else if(type==="result")this._OnResultFromRuntime(data);else if(type==="runtime-ready")this._OnRuntimeReady();else if(type==="alert-error"){this._RemoveLoadingMessage();alert(data["message"])}else if(type==="creating-runtime")this._OnBeforeCreateRuntime();else throw new Error(`unknown message '${type}'`);}_OnEventFromRuntime(e){const component=e["component"];const handler=e["handler"];const data=e["data"];const responseId=e["responseId"];
const handlerMap=runtimeEventHandlers.get(component);if(!handlerMap){console.warn(`[DOM] No event handlers for component '${component}'`);return}const func=handlerMap.get(handler);if(!func){console.warn(`[DOM] No handler '${handler}' for component '${component}'`);return}let ret=null;try{ret=func(data)}catch(err){console.error(`Exception in '${component}' handler '${handler}':`,err);if(responseId!==null)this._PostResultToRuntime(responseId,false,""+err);return}if(responseId===null)return ret;else if(ret&&
ret.then)ret.then(result=>this._PostResultToRuntime(responseId,true,result)).catch(err=>{console.error(`Rejection from '${component}' handler '${handler}':`,err);this._PostResultToRuntime(responseId,false,""+err)});else this._PostResultToRuntime(responseId,true,ret)}_PostResultToRuntime(responseId,isOk,result){let transferables;if(result&&result["transferables"])transferables=result["transferables"];this._messageChannelPort.postMessage({"type":"result","responseId":responseId,"isOk":isOk,"result":result},
transferables)}_OnResultFromRuntime(data){const responseId=data["responseId"];const isOk=data["isOk"];const result=data["result"];const pendingPromise=pendingResponsePromises.get(responseId);if(isOk)pendingPromise.resolve(result);else pendingPromise.reject(result);pendingResponsePromises.delete(responseId)}AddRuntimeComponentMessageHandler(component,handler,func){let handlerMap=runtimeEventHandlers.get(component);if(!handlerMap){handlerMap=new Map;runtimeEventHandlers.set(component,handlerMap)}if(handlerMap.has(handler))throw new Error(`[DOM] Component '${component}' already has handler '${handler}'`);
handlerMap.set(handler,func)}static AddDOMHandlerClass(Class){if(domHandlerClasses.includes(Class))throw new Error("DOM handler already added");domHandlerClasses.push(Class)}_FindRuntimeDOMHandler(){for(const dh of this._domHandlers)if(dh.GetComponentID()==="runtime"){this._runtimeDomHandler=dh;return}throw new Error("cannot find runtime DOM handler");}_OnMessageFromDebugger(e){this.PostToRuntimeComponent("debugger","message",e)}_OnRuntimeReady(){for(const h of this._domHandlers)h.Attach()}static IsDocumentFullscreen(){return!!(document["fullscreenElement"]||
document["webkitFullscreenElement"]||document["mozFullScreenElement"]||isWrapperFullscreen)}static _SetWrapperIsFullscreenFlag(f){isWrapperFullscreen=!!f}async GetRemotePreviewStatusInfo(){return await this.PostToRuntimeComponentAsync("runtime","get-remote-preview-status-info")}_AddRAFCallback(f){this._rafCallbacks.add(f);this._RequestAnimationFrame()}_RemoveRAFCallback(f){this._rafCallbacks.delete(f);if(this._rafCallbacks.size===0)this._CancelAnimationFrame()}_RequestAnimationFrame(){if(this._rafId===
-1&&this._rafCallbacks.size>0)this._rafId=requestAnimationFrame(this._rafFunc)}_CancelAnimationFrame(){if(this._rafId!==-1){cancelAnimationFrame(this._rafId);this._rafId=-1}}_OnRAFCallback(){this._rafId=-1;for(const f of this._rafCallbacks)f();this._RequestAnimationFrame()}TryPlayMedia(mediaElem){this._runtimeDomHandler.TryPlayMedia(mediaElem)}RemovePendingPlay(mediaElem){this._runtimeDomHandler.RemovePendingPlay(mediaElem)}_PlayPendingMedia(){this._runtimeDomHandler._PlayPendingMedia()}SetSilent(s){this._runtimeDomHandler.SetSilent(s)}IsAudioFormatSupported(typeStr){return!!supportedAudioFormats[typeStr]}async _WasmDecodeWebMOpus(arrayBuffer){const result=
await this.PostToRuntimeComponentAsync("runtime","opus-decode",{"arrayBuffer":arrayBuffer},null,[arrayBuffer]);return new Float32Array(result)}SetIsExportingToVideo(duration){this._isExportingToVideo=true;this._exportToVideoDuration=duration}IsExportingToVideo(){return this._isExportingToVideo}GetExportToVideoDuration(){return this._exportToVideoDuration}IsAbsoluteURL(url){return/^(?:[a-z\-]+:)?\/\//.test(url)||url.substr(0,5)==="data:"||url.substr(0,5)==="blob:"}IsRelativeURL(url){return!this.IsAbsoluteURL(url)}async _MaybeGetCordovaScriptURL(url){if(this._exportType===
"cordova"&&(url.startsWith("file:")||this._isFileProtocol&&this.IsRelativeURL(url))){let filename=url;if(filename.startsWith(this._runtimeBaseUrl))filename=filename.substr(this._runtimeBaseUrl.length);const arrayBuffer=await this.CordovaFetchLocalFileAsArrayBuffer(filename);const blob=new Blob([arrayBuffer],{type:"application/javascript"});return URL.createObjectURL(blob)}else return url}async _OnCordovaFetchLocalFile(e){const filename=e["filename"];switch(e["as"]){case "text":return await this.CordovaFetchLocalFileAsText(filename);
case "buffer":return await this.CordovaFetchLocalFileAsArrayBuffer(filename);default:throw new Error("unsupported type");}}_GetPermissionAPI(){const api=window["cordova"]&&window["cordova"]["plugins"]&&window["cordova"]["plugins"]["permissions"];if(typeof api!=="object")throw new Error("Permission API is not loaded");return api}_MapPermissionID(api,permission){const permissionID=api[permission];if(typeof permissionID!=="string")throw new Error("Invalid permission name");return permissionID}_HasPermission(id){const api=
this._GetPermissionAPI();return new Promise((resolve,reject)=>api["checkPermission"](this._MapPermissionID(api,id),status=>resolve(!!status["hasPermission"]),reject))}_RequestPermission(id){const api=this._GetPermissionAPI();return new Promise((resolve,reject)=>api["requestPermission"](this._MapPermissionID(api,id),status=>resolve(!!status["hasPermission"]),reject))}async RequestPermissions(permissions){if(this.GetExportType()!=="cordova")return true;if(this.IsiOSCordova())return true;for(const id of permissions){const alreadyGranted=
await this._HasPermission(id);if(alreadyGranted)continue;const granted=await this._RequestPermission(id);if(granted===false)return false}return true}async RequirePermissions(...permissions){if(await this.RequestPermissions(permissions)===false)throw new Error("Permission not granted");}CordovaFetchLocalFile(filename){const path=window["cordova"]["file"]["applicationDirectory"]+"www/"+filename;return new Promise((resolve,reject)=>{window["resolveLocalFileSystemURL"](path,entry=>{entry["file"](resolve,
reject)},reject)})}async CordovaFetchLocalFileAsText(filename){const file=await this.CordovaFetchLocalFile(filename);return await BlobToString(file)}_CordovaMaybeStartNextArrayBufferRead(){if(!queuedArrayBufferReads.length)return;if(activeArrayBufferReads>=MAX_ARRAYBUFFER_READS)return;activeArrayBufferReads++;const job=queuedArrayBufferReads.shift();this._CordovaDoFetchLocalFileAsAsArrayBuffer(job.filename,job.successCallback,job.errorCallback)}CordovaFetchLocalFileAsArrayBuffer(filename){return new Promise((resolve,
reject)=>{queuedArrayBufferReads.push({filename:filename,successCallback:result=>{activeArrayBufferReads--;this._CordovaMaybeStartNextArrayBufferRead();resolve(result)},errorCallback:err=>{activeArrayBufferReads--;this._CordovaMaybeStartNextArrayBufferRead();reject(err)}});this._CordovaMaybeStartNextArrayBufferRead()})}async _CordovaDoFetchLocalFileAsAsArrayBuffer(filename,successCallback,errorCallback){try{const file=await this.CordovaFetchLocalFile(filename);const arrayBuffer=await BlobToArrayBuffer(file);
successCallback(arrayBuffer)}catch(err){errorCallback(err)}}_OnWrapperMessage(msg,additionalObjects){if(msg==="entered-fullscreen"){RuntimeInterface._SetWrapperIsFullscreenFlag(true);this._runtimeDomHandler._OnFullscreenChange()}else if(msg==="exited-fullscreen"){RuntimeInterface._SetWrapperIsFullscreenFlag(false);this._runtimeDomHandler._OnFullscreenChange()}else if(typeof msg==="object"){const type=msg["type"];if(type==="directory-handles")this._directoryHandles=additionalObjects;else if(type===
"wrapper-init-response"){this._wrapperInitResolve(msg);this._wrapperInitResolve=null}else if(type==="extension-message")this.PostToRuntimeComponent("runtime","wrapper-extension-message",msg);else console.warn("Unknown wrapper message: ",msg)}else console.warn("Unknown wrapper message: ",msg)}_OnSendWrapperExtensionMessage(data){this._SendWrapperMessage({"type":"extension-message","componentId":data["componentId"],"messageId":data["messageId"],"params":data["params"]||[],"asyncId":data["asyncId"]})}_SendWrapperMessage(o){if(this.IsAnyWebView2Wrapper())window["chrome"]["webview"]["postMessage"](JSON.stringify(o));
else if(this._exportType==="macos-wkwebview")window["webkit"]["messageHandlers"]["C3Wrapper"]["postMessage"](JSON.stringify(o));else;}_SetupWebView2Polyfills(){window.moveTo=(x,y)=>{this._SendWrapperMessage({"type":"set-window-position","windowX":Math.ceil(x),"windowY":Math.ceil(y)})};window.resizeTo=(w,h)=>{this._SendWrapperMessage({"type":"set-window-size","windowWidth":Math.ceil(w),"windowHeight":Math.ceil(h)})}}_InitWrapper(){if(!this.IsAnyWebView2Wrapper())return Promise.resolve();return new Promise(resolve=>
{this._wrapperInitResolve=resolve;this._SendWrapperMessage({"type":"wrapper-init"})})}_GetDirectoryHandles(){return this._directoryHandles}async _ConvertDataUrisToBlobs(){const promises=[];for(const [filename,data]of Object.entries(this._localFileBlobs))promises.push(this._ConvertDataUriToBlobs(filename,data));await Promise.all(promises)}async _ConvertDataUriToBlobs(filename,data){if(typeof data==="object"){this._localFileBlobs[filename]=new Blob([data["str"]],{"type":data["type"]});this._localFileStrings[filename]=
data["str"]}else{let blob=await this._FetchDataUri(data);if(!blob)blob=this._DataURIToBinaryBlobSync(data);this._localFileBlobs[filename]=blob}}async _FetchDataUri(dataUri){try{const response=await fetch(dataUri);return await response.blob()}catch(err){console.warn("Failed to fetch a data: URI. Falling back to a slower workaround. This is probably because the Content Security Policy unnecessarily blocked it. Allow data: URIs in your CSP to avoid this.",err);return null}}_DataURIToBinaryBlobSync(datauri){const o=
this._ParseDataURI(datauri);return this._BinaryStringToBlob(o.data,o.mime_type)}_ParseDataURI(datauri){const comma=datauri.indexOf(",");if(comma<0)throw new URIError("expected comma in data: uri");const typepart=datauri.substring(5,comma);const datapart=datauri.substring(comma+1);const typearr=typepart.split(";");const mimetype=typearr[0]||"";const encoding1=typearr[1];const encoding2=typearr[2];let decodeddata;if(encoding1==="base64"||encoding2==="base64")decodeddata=atob(datapart);else decodeddata=
decodeURIComponent(datapart);return{mime_type:mimetype,data:decodeddata}}_BinaryStringToBlob(binstr,mime_type){let len=binstr.length;let len32=len>>2;let a8=new Uint8Array(len);let a32=new Uint32Array(a8.buffer,0,len32);let i,j;for(i=0,j=0;i<len32;++i)a32[i]=binstr.charCodeAt(j++)|binstr.charCodeAt(j++)<<8|binstr.charCodeAt(j++)<<16|binstr.charCodeAt(j++)<<24;let tailLength=len&3;while(tailLength--){a8[j]=binstr.charCodeAt(j);++j}return new Blob([a8],{"type":mime_type})}}};


'use strict';{const RuntimeInterface=self.RuntimeInterface;function IsCompatibilityMouseEvent(e){return e["sourceCapabilities"]&&e["sourceCapabilities"]["firesTouchEvents"]||e["originalEvent"]&&e["originalEvent"]["sourceCapabilities"]&&e["originalEvent"]["sourceCapabilities"]["firesTouchEvents"]}const KEY_CODE_ALIASES=new Map([["OSLeft","MetaLeft"],["OSRight","MetaRight"]]);const DISPATCH_RUNTIME_AND_SCRIPT={"dispatchRuntimeEvent":true,"dispatchUserScriptEvent":true};const DISPATCH_SCRIPT_ONLY={"dispatchUserScriptEvent":true};
const DISPATCH_RUNTIME_ONLY={"dispatchRuntimeEvent":true};function AddStyleSheet(cssUrl){return new Promise((resolve,reject)=>{const styleLink=document.createElement("link");styleLink.onload=()=>resolve(styleLink);styleLink.onerror=err=>reject(err);styleLink.rel="stylesheet";styleLink.href=cssUrl;document.head.appendChild(styleLink)})}function FetchImage(url){return new Promise((resolve,reject)=>{const img=new Image;img.onload=()=>resolve(img);img.onerror=err=>reject(err);img.src=url})}async function BlobToImage(blob){const blobUrl=
URL.createObjectURL(blob);try{return await FetchImage(blobUrl)}finally{URL.revokeObjectURL(blobUrl)}}function BlobToString(blob){return new Promise((resolve,reject)=>{let fileReader=new FileReader;fileReader.onload=e=>resolve(e.target.result);fileReader.onerror=err=>reject(err);fileReader.readAsText(blob)})}function IsInContentEditable(el){do{if(el.parentNode&&el.hasAttribute("contenteditable"))return true;el=el.parentNode}while(el);return false}const keyboardInputElementTagNames=new Set(["input",
"textarea","datalist","select"]);function IsKeyboardInputElement(elem){return keyboardInputElementTagNames.has(elem.tagName.toLowerCase())||IsInContentEditable(elem)}const canvasOrDocTags=new Set(["canvas","body","html"]);function PreventDefaultOnCanvasOrDoc(e){if(!e.target.tagName)return;const tagName=e.target.tagName.toLowerCase();if(canvasOrDocTags.has(tagName))e.preventDefault()}function PreventDefaultOnHTMLWrap(e){if(!e.target.tagName)return;if(e.target.classList.contains("c3htmlwrap"))e.preventDefault()}
function BlockWheelZoom(e){if(e.metaKey||e.ctrlKey)e.preventDefault()}self["C3_GetSvgImageSize"]=async function(blob){const img=await BlobToImage(blob);if(img.width>0&&img.height>0)return[img.width,img.height];else{img.style.position="absolute";img.style.left="0px";img.style.top="0px";img.style.visibility="hidden";document.body.appendChild(img);const rc=img.getBoundingClientRect();document.body.removeChild(img);return[rc.width,rc.height]}};self["C3_RasterSvgImageBlob"]=async function(blob,imageWidth,
imageHeight,surfaceWidth,surfaceHeight){const img=await BlobToImage(blob);const canvas=document.createElement("canvas");canvas.width=surfaceWidth;canvas.height=surfaceHeight;const ctx=canvas.getContext("2d");ctx.drawImage(img,0,0,imageWidth,imageHeight);return canvas};let isCordovaPaused=false;document.addEventListener("pause",()=>isCordovaPaused=true);document.addEventListener("resume",()=>isCordovaPaused=false);function ParentHasFocus(){try{return window.parent&&window.parent.document.hasFocus()}catch(err){return false}}
const DOM_COMPONENT_ID="runtime";const HANDLER_CLASS=class RuntimeDOMHandler extends self.DOMHandler{constructor(iRuntime){super(iRuntime,DOM_COMPONENT_ID);this._enableWindowResizeEvent=false;this._simulatedResizeTimerId=-1;this._targetOrientation="any";this._attachedDeviceOrientationEvent=false;this._attachedDeviceMotionEvent=false;this._pageVisibilityIsHidden=false;this._screenReaderTextWrap=document.createElement("div");this._screenReaderTextWrap.className="c3-screen-reader-text";this._screenReaderTextWrap.setAttribute("aria-live",
"polite");document.body.appendChild(this._screenReaderTextWrap);this._debugHighlightElem=null;this._isExportToVideo=false;this._exportVideoProgressMessage="";this._exportVideoUpdateTimerId=-1;this._enableAndroidVKDetection=false;this._lastWindowWidth=iRuntime._GetWindowInnerWidth();this._lastWindowHeight=iRuntime._GetWindowInnerHeight();this._virtualKeyboardHeight=0;this._vkTranslateYOffset=0;iRuntime.AddRuntimeComponentMessageHandler("runtime","invoke-download",e=>this._OnInvokeDownload(e));iRuntime.AddRuntimeComponentMessageHandler("runtime",
"load-webfonts",e=>this._OnLoadWebFonts(e));iRuntime.AddRuntimeComponentMessageHandler("runtime","raster-svg-image",e=>this._OnRasterSvgImage(e));iRuntime.AddRuntimeComponentMessageHandler("runtime","get-svg-image-size",e=>this._OnGetSvgImageSize(e));iRuntime.AddRuntimeComponentMessageHandler("runtime","set-target-orientation",e=>this._OnSetTargetOrientation(e));iRuntime.AddRuntimeComponentMessageHandler("runtime","register-sw",()=>this._OnRegisterSW());iRuntime.AddRuntimeComponentMessageHandler("runtime",
"post-to-debugger",e=>this._OnPostToDebugger(e));iRuntime.AddRuntimeComponentMessageHandler("runtime","go-to-script",e=>this._OnPostToDebugger(e));iRuntime.AddRuntimeComponentMessageHandler("runtime","before-start-ticking",()=>this._OnBeforeStartTicking());iRuntime.AddRuntimeComponentMessageHandler("runtime","debug-highlight",e=>this._OnDebugHighlight(e));iRuntime.AddRuntimeComponentMessageHandler("runtime","enable-device-orientation",()=>this._AttachDeviceOrientationEvent());iRuntime.AddRuntimeComponentMessageHandler("runtime",
"enable-device-motion",()=>this._AttachDeviceMotionEvent());iRuntime.AddRuntimeComponentMessageHandler("runtime","add-stylesheet",e=>this._OnAddStylesheet(e));iRuntime.AddRuntimeComponentMessageHandler("runtime","script-create-worker",e=>this._OnScriptCreateWorker(e));iRuntime.AddRuntimeComponentMessageHandler("runtime","alert",e=>this._OnAlert(e));iRuntime.AddRuntimeComponentMessageHandler("runtime","screen-reader-text",e=>this._OnScreenReaderTextEvent(e));iRuntime.AddRuntimeComponentMessageHandler("runtime",
"hide-cordova-splash",()=>this._OnHideCordovaSplash());iRuntime.AddRuntimeComponentMessageHandler("runtime","set-exporting-to-video",e=>this._SetExportingToVideo(e));iRuntime.AddRuntimeComponentMessageHandler("runtime","export-to-video-progress",e=>this._OnExportVideoProgress(e));iRuntime.AddRuntimeComponentMessageHandler("runtime","exported-to-video",e=>this._OnExportedToVideo(e));iRuntime.AddRuntimeComponentMessageHandler("runtime","exported-to-image-sequence",e=>this._OnExportedToImageSequence(e));
const allowDefaultContextMenuTagNames=new Set(["input","textarea","datalist"]);window.addEventListener("contextmenu",e=>{const t=e.target;const name=t.tagName.toLowerCase();if(!allowDefaultContextMenuTagNames.has(name)&&!IsInContentEditable(t))e.preventDefault()});window.addEventListener("selectstart",PreventDefaultOnCanvasOrDoc);window.addEventListener("gesturehold",PreventDefaultOnCanvasOrDoc);window.addEventListener("touchstart",PreventDefaultOnCanvasOrDoc,{"passive":false});window.addEventListener("pointerdown",
PreventDefaultOnCanvasOrDoc,{"passive":false});this._mousePointerLastButtons=0;window.addEventListener("mousedown",e=>{if(e.button===1)e.preventDefault()});window.addEventListener("mousewheel",BlockWheelZoom,{"passive":false});window.addEventListener("wheel",BlockWheelZoom,{"passive":false});window.addEventListener("resize",()=>this._OnWindowResize());window.addEventListener("fullscreenchange",()=>this._OnFullscreenChange());window.addEventListener("webkitfullscreenchange",()=>this._OnFullscreenChange());
window.addEventListener("mozfullscreenchange",()=>this._OnFullscreenChange());window.addEventListener("fullscreenerror",e=>this._OnFullscreenError(e));window.addEventListener("webkitfullscreenerror",e=>this._OnFullscreenError(e));window.addEventListener("mozfullscreenerror",e=>this._OnFullscreenError(e));if(iRuntime.IsiOSWebView()){let lastVisualViewportHeight=Infinity;window["visualViewport"].addEventListener("resize",()=>{const curVisualViewportHeight=window["visualViewport"].height;if(curVisualViewportHeight>
lastVisualViewportHeight){document.scrollingElement.scrollTop=0;document.scrollingElement.scrollLeft=0}lastVisualViewportHeight=curVisualViewportHeight});document.documentElement.setAttribute("ioswebview","")}this._mediaPendingPlay=new Set;this._mediaRemovedPendingPlay=new WeakSet;this._isSilent=false}_AddDefaultCanvasEventHandlers(canvas){canvas.addEventListener("selectstart",PreventDefaultOnCanvasOrDoc);canvas.addEventListener("gesturehold",PreventDefaultOnCanvasOrDoc);canvas.addEventListener("pointerdown",
PreventDefaultOnCanvasOrDoc)}_AddDefaultHTMLWrapEventHandlers(htmlwrap){htmlwrap.addEventListener("selectstart",PreventDefaultOnHTMLWrap);htmlwrap.addEventListener("gesturehold",PreventDefaultOnHTMLWrap);htmlwrap.addEventListener("touchstart",PreventDefaultOnHTMLWrap)}_OnBeforeStartTicking(){self.setTimeout(()=>{this._enableAndroidVKDetection=true},1E3);if(this._iRuntime.GetExportType()==="cordova"){document.addEventListener("pause",()=>this._OnVisibilityChange(true));document.addEventListener("resume",
()=>this._OnVisibilityChange(false))}else document.addEventListener("visibilitychange",()=>this._OnVisibilityChange(document.visibilityState==="hidden"));this._pageVisibilityIsHidden=!!(document.visibilityState==="hidden"||isCordovaPaused);return{"isSuspended":this._pageVisibilityIsHidden}}Attach(){window.addEventListener("focus",()=>this._PostRuntimeEvent("window-focus"));window.addEventListener("blur",()=>{this._PostRuntimeEvent("window-blur",{"parentHasFocus":ParentHasFocus()});this._mousePointerLastButtons=
0});window.addEventListener("focusin",e=>{if(IsKeyboardInputElement(e.target))this._PostRuntimeEvent("keyboard-blur")});window.addEventListener("keydown",e=>this._OnKeyEvent("keydown",e));window.addEventListener("keyup",e=>this._OnKeyEvent("keyup",e));window.addEventListener("mousedown",e=>this._OnMouseEvent("mousedown",e,DISPATCH_SCRIPT_ONLY));window.addEventListener("mousemove",e=>this._OnMouseEvent("mousemove",e,DISPATCH_SCRIPT_ONLY));window.addEventListener("mouseup",e=>this._OnMouseEvent("mouseup",
e,DISPATCH_SCRIPT_ONLY));window.addEventListener("dblclick",e=>this._OnMouseEvent("dblclick",e,DISPATCH_RUNTIME_AND_SCRIPT));window.addEventListener("wheel",e=>this._OnMouseWheelEvent("wheel",e,DISPATCH_RUNTIME_AND_SCRIPT));window.addEventListener("pointerdown",e=>{this._HandlePointerDownFocus(e);this._OnPointerEvent("pointerdown",e)});if(this._iRuntime.UsesWorker()&&typeof window["onpointerrawupdate"]!=="undefined"&&self===self.top)window.addEventListener("pointerrawupdate",e=>this._OnPointerRawUpdate(e));
else window.addEventListener("pointermove",e=>this._OnPointerEvent("pointermove",e));window.addEventListener("pointerup",e=>this._OnPointerEvent("pointerup",e));window.addEventListener("pointercancel",e=>this._OnPointerEvent("pointercancel",e));const playFunc=()=>this._PlayPendingMedia();window.addEventListener("pointerup",playFunc,true);window.addEventListener("touchend",playFunc,true);window.addEventListener("click",playFunc,true);window.addEventListener("keydown",playFunc,true);window.addEventListener("gamepadconnected",
playFunc,true);if(this._iRuntime.IsAndroid()&&!this._iRuntime.IsAndroidWebView()&&navigator["virtualKeyboard"]){navigator["virtualKeyboard"]["overlaysContent"]=true;navigator["virtualKeyboard"].addEventListener("geometrychange",()=>{this._OnAndroidVirtualKeyboardChange(this._GetWindowInnerHeight(),navigator["virtualKeyboard"]["boundingRect"]["height"])})}if(this._iRuntime.IsiOSWebView()){document.scrollingElement.scrollTop=0;document.scrollingElement.scrollLeft=0}}_OnAndroidVirtualKeyboardChange(windowHeight,
vkHeight){document.body.style.position="";document.body.style.overflow="";document.body.style.transform="";this._vkTranslateYOffset=0;if(vkHeight>0){const activeElement=document.activeElement;if(activeElement){const rc=activeElement.getBoundingClientRect();const rcMidY=(rc.top+rc.bottom)/2;const targetY=(windowHeight-vkHeight)/2;let shiftY=rcMidY-targetY;if(shiftY>vkHeight)shiftY=vkHeight;if(shiftY<0)shiftY=0;if(shiftY>0){document.body.style.position="absolute";document.body.style.overflow="visible";
document.body.style.transform=`translateY(${-shiftY}px)`;this._vkTranslateYOffset=shiftY}}}}_PostRuntimeEvent(name,data){this.PostToRuntime(name,data||null,DISPATCH_RUNTIME_ONLY)}_GetWindowInnerWidth(){return this._iRuntime._GetWindowInnerWidth()}_GetWindowInnerHeight(){return this._iRuntime._GetWindowInnerHeight()}_EnableWindowResizeEvent(){this._enableWindowResizeEvent=true;this._lastWindowWidth=this._iRuntime._GetWindowInnerWidth();this._lastWindowHeight=this._iRuntime._GetWindowInnerHeight()}_OnWindowResize(){if(this._isExportToVideo)return;
if(!this._enableWindowResizeEvent)return;const width=this._GetWindowInnerWidth();const height=this._GetWindowInnerHeight();if(this._iRuntime.IsAndroidWebView())if(this._enableAndroidVKDetection)if(this._lastWindowWidth===width&&height<this._lastWindowHeight){this._virtualKeyboardHeight=this._lastWindowHeight-height;this._OnAndroidVirtualKeyboardChange(this._lastWindowHeight,this._virtualKeyboardHeight);return}else{if(this._virtualKeyboardHeight>0){this._virtualKeyboardHeight=0;this._OnAndroidVirtualKeyboardChange(height,
this._virtualKeyboardHeight)}this._lastWindowWidth=width;this._lastWindowHeight=height}else{this._lastWindowWidth=width;this._lastWindowHeight=height}this.PostToRuntime("window-resize",{"innerWidth":width,"innerHeight":height,"devicePixelRatio":window.devicePixelRatio,"isFullscreen":RuntimeInterface.IsDocumentFullscreen(),"cssDisplayMode":this._iRuntime.GetCssDisplayMode()});if(this._iRuntime.IsiOSWebView()){if(this._simulatedResizeTimerId!==-1)clearTimeout(this._simulatedResizeTimerId);this._OnSimulatedResize(width,
height,0)}}_ScheduleSimulatedResize(width,height,count){if(this._simulatedResizeTimerId!==-1)clearTimeout(this._simulatedResizeTimerId);this._simulatedResizeTimerId=setTimeout(()=>this._OnSimulatedResize(width,height,count),48)}_OnSimulatedResize(originalWidth,originalHeight,count){const width=this._GetWindowInnerWidth();const height=this._GetWindowInnerHeight();this._simulatedResizeTimerId=-1;if(width!=originalWidth||height!=originalHeight)this.PostToRuntime("window-resize",{"innerWidth":width,"innerHeight":height,
"devicePixelRatio":window.devicePixelRatio,"isFullscreen":RuntimeInterface.IsDocumentFullscreen(),"cssDisplayMode":this._iRuntime.GetCssDisplayMode()});else if(count<10)this._ScheduleSimulatedResize(width,height,count+1)}_OnSetTargetOrientation(e){this._targetOrientation=e["targetOrientation"]}_TrySetTargetOrientation(){const orientation=this._targetOrientation;if(screen["orientation"]&&screen["orientation"]["lock"])screen["orientation"]["lock"](orientation).catch(err=>console.warn("[Construct] Failed to lock orientation: ",
err));else try{let result=false;if(screen["lockOrientation"])result=screen["lockOrientation"](orientation);else if(screen["webkitLockOrientation"])result=screen["webkitLockOrientation"](orientation);else if(screen["mozLockOrientation"])result=screen["mozLockOrientation"](orientation);else if(screen["msLockOrientation"])result=screen["msLockOrientation"](orientation);if(!result)console.warn("[Construct] Failed to lock orientation")}catch(err){console.warn("[Construct] Failed to lock orientation: ",
err)}}_OnFullscreenChange(){if(this._isExportToVideo)return;const isDocFullscreen=RuntimeInterface.IsDocumentFullscreen();if(isDocFullscreen&&this._targetOrientation!=="any")this._TrySetTargetOrientation();this.PostToRuntime("fullscreenchange",{"isFullscreen":isDocFullscreen,"innerWidth":this._GetWindowInnerWidth(),"innerHeight":this._GetWindowInnerHeight()})}_OnFullscreenError(e){console.warn("[Construct] Fullscreen request failed: ",e);this.PostToRuntime("fullscreenerror",{"isFullscreen":RuntimeInterface.IsDocumentFullscreen(),
"innerWidth":this._GetWindowInnerWidth(),"innerHeight":this._GetWindowInnerHeight()})}_OnVisibilityChange(isHidden){if(this._pageVisibilityIsHidden===isHidden)return;this._pageVisibilityIsHidden=isHidden;if(isHidden)this._iRuntime._CancelAnimationFrame();else this._iRuntime._RequestAnimationFrame();this.PostToRuntime("visibilitychange",{"hidden":isHidden});if(!isHidden&&this._iRuntime.IsiOSWebView()){const resetScrollFunc=()=>{document.scrollingElement.scrollTop=0;document.scrollingElement.scrollLeft=
0};setTimeout(resetScrollFunc,50);setTimeout(resetScrollFunc,100);setTimeout(resetScrollFunc,250);setTimeout(resetScrollFunc,500)}}_OnKeyEvent(name,e){if(e.key==="Backspace")PreventDefaultOnCanvasOrDoc(e);if(this._iRuntime.GetExportType()==="nwjs"&&e.key==="u"&&(e.ctrlKey||e.metaKey))e.preventDefault();if(this._isExportToVideo)return;const code=KEY_CODE_ALIASES.get(e.code)||e.code;this._PostToRuntimeMaybeSync(name,{"code":code,"key":e.key,"which":e.which,"repeat":e.repeat,"altKey":e.altKey,"ctrlKey":e.ctrlKey,
"metaKey":e.metaKey,"shiftKey":e.shiftKey,"timeStamp":e.timeStamp},DISPATCH_RUNTIME_AND_SCRIPT)}_OnMouseWheelEvent(name,e,opts){if(this._isExportToVideo)return;this.PostToRuntime(name,{"clientX":e.clientX,"clientY":e.clientY+this._vkTranslateYOffset,"pageX":e.pageX,"pageY":e.pageY+this._vkTranslateYOffset,"deltaX":e.deltaX,"deltaY":e.deltaY,"deltaZ":e.deltaZ,"deltaMode":e.deltaMode,"timeStamp":e.timeStamp},opts)}_OnMouseEvent(name,e,opts){if(this._isExportToVideo)return;if(IsCompatibilityMouseEvent(e))return;
this._PostToRuntimeMaybeSync(name,{"button":e.button,"buttons":e.buttons,"clientX":e.clientX,"clientY":e.clientY+this._vkTranslateYOffset,"pageX":e.pageX,"pageY":e.pageY+this._vkTranslateYOffset,"movementX":e.movementX||0,"movementY":e.movementY||0,"timeStamp":e.timeStamp},opts)}_OnPointerEvent(name,e){if(this._isExportToVideo)return;let lastButtons=0;if(e.pointerType==="mouse")lastButtons=this._mousePointerLastButtons;this._PostToRuntimeMaybeSync(name,{"pointerId":e.pointerId,"pointerType":e.pointerType,
"button":e.button,"buttons":e.buttons,"lastButtons":lastButtons,"clientX":e.clientX,"clientY":e.clientY+this._vkTranslateYOffset,"pageX":e.pageX,"pageY":e.pageY+this._vkTranslateYOffset,"movementX":e.movementX||0,"movementY":e.movementY||0,"width":e.width||0,"height":e.height||0,"pressure":e.pressure||0,"tangentialPressure":e["tangentialPressure"]||0,"tiltX":e.tiltX||0,"tiltY":e.tiltY||0,"twist":e["twist"]||0,"timeStamp":e.timeStamp},DISPATCH_RUNTIME_AND_SCRIPT);if(e.pointerType==="mouse")this._mousePointerLastButtons=
e.buttons}_OnPointerRawUpdate(e){this._OnPointerEvent("pointermove",e)}_OnTouchEvent(fireName,e){if(this._isExportToVideo)return;for(let i=0,len=e.changedTouches.length;i<len;++i){const t=e.changedTouches[i];this._PostToRuntimeMaybeSync(fireName,{"pointerId":t.identifier,"pointerType":"touch","button":0,"buttons":0,"lastButtons":0,"clientX":t.clientX,"clientY":t.clientY+this._vkTranslateYOffset,"pageX":t.pageX,"pageY":t.pageY+this._vkTranslateYOffset,"movementX":e.movementX||0,"movementY":e.movementY||
0,"width":(t["radiusX"]||t["webkitRadiusX"]||0)*2,"height":(t["radiusY"]||t["webkitRadiusY"]||0)*2,"pressure":t["force"]||t["webkitForce"]||0,"tangentialPressure":0,"tiltX":0,"tiltY":0,"twist":t["rotationAngle"]||0,"timeStamp":e.timeStamp},DISPATCH_RUNTIME_AND_SCRIPT)}}_HandlePointerDownFocus(e){if(window!==window.top)window.focus();if(this._IsElementCanvasOrDocument(e.target)&&document.activeElement&&!this._IsElementCanvasOrDocument(document.activeElement))document.activeElement.blur()}_IsElementCanvasOrDocument(elem){return!elem||
elem===document||elem===window||elem===document.body||elem.tagName.toLowerCase()==="canvas"}_AttachDeviceOrientationEvent(){if(this._attachedDeviceOrientationEvent)return;this._attachedDeviceOrientationEvent=true;window.addEventListener("deviceorientation",e=>this._OnDeviceOrientation(e));window.addEventListener("deviceorientationabsolute",e=>this._OnDeviceOrientationAbsolute(e))}_AttachDeviceMotionEvent(){if(this._attachedDeviceMotionEvent)return;this._attachedDeviceMotionEvent=true;window.addEventListener("devicemotion",
e=>this._OnDeviceMotion(e))}_OnDeviceOrientation(e){if(this._isExportToVideo)return;this.PostToRuntime("deviceorientation",{"absolute":!!e["absolute"],"alpha":e["alpha"]||0,"beta":e["beta"]||0,"gamma":e["gamma"]||0,"timeStamp":e.timeStamp,"webkitCompassHeading":e["webkitCompassHeading"],"webkitCompassAccuracy":e["webkitCompassAccuracy"]},DISPATCH_RUNTIME_AND_SCRIPT)}_OnDeviceOrientationAbsolute(e){if(this._isExportToVideo)return;this.PostToRuntime("deviceorientationabsolute",{"absolute":!!e["absolute"],
"alpha":e["alpha"]||0,"beta":e["beta"]||0,"gamma":e["gamma"]||0,"timeStamp":e.timeStamp},DISPATCH_RUNTIME_AND_SCRIPT)}_OnDeviceMotion(e){if(this._isExportToVideo)return;let accProp=null;const acc=e["acceleration"];if(acc)accProp={"x":acc["x"]||0,"y":acc["y"]||0,"z":acc["z"]||0};let withGProp=null;const withG=e["accelerationIncludingGravity"];if(withG)withGProp={"x":withG["x"]||0,"y":withG["y"]||0,"z":withG["z"]||0};let rotationRateProp=null;const rotationRate=e["rotationRate"];if(rotationRate)rotationRateProp=
{"alpha":rotationRate["alpha"]||0,"beta":rotationRate["beta"]||0,"gamma":rotationRate["gamma"]||0};this.PostToRuntime("devicemotion",{"acceleration":accProp,"accelerationIncludingGravity":withGProp,"rotationRate":rotationRateProp,"interval":e["interval"],"timeStamp":e.timeStamp},DISPATCH_RUNTIME_AND_SCRIPT)}_OnInvokeDownload(e){const url=e["url"];const filename=e["filename"];const a=document.createElement("a");const body=document.body;a.textContent=filename;a.href=url;a.download=filename;body.appendChild(a);
a.click();body.removeChild(a)}async _OnLoadWebFonts(e){const webfonts=e["webfonts"];await Promise.all(webfonts.map(async info=>{const fontFace=new FontFace(info.name,`url('${info.url}')`);document.fonts.add(fontFace);await fontFace.load()}))}async _OnRasterSvgImage(e){const blob=e["blob"];const imageWidth=e["imageWidth"];const imageHeight=e["imageHeight"];const surfaceWidth=e["surfaceWidth"];const surfaceHeight=e["surfaceHeight"];const imageBitmapOpts=e["imageBitmapOpts"];const canvas=await self["C3_RasterSvgImageBlob"](blob,
imageWidth,imageHeight,surfaceWidth,surfaceHeight);let ret;if(imageBitmapOpts)ret=await createImageBitmap(canvas,imageBitmapOpts);else ret=await createImageBitmap(canvas);return{"imageBitmap":ret,"transferables":[ret]}}async _OnGetSvgImageSize(e){return await self["C3_GetSvgImageSize"](e["blob"])}async _OnAddStylesheet(e){await AddStyleSheet(e["url"])}_PlayPendingMedia(){const mediaToTryPlay=[...this._mediaPendingPlay];this._mediaPendingPlay.clear();if(!this._isSilent)for(const mediaElem of mediaToTryPlay){const playRet=
mediaElem.play();if(playRet)playRet.catch(err=>{if(!this._mediaRemovedPendingPlay.has(mediaElem))this._mediaPendingPlay.add(mediaElem)})}}TryPlayMedia(mediaElem){if(typeof mediaElem.play!=="function")throw new Error("missing play function");this._mediaRemovedPendingPlay.delete(mediaElem);let playRet;try{playRet=mediaElem.play()}catch(err){this._mediaPendingPlay.add(mediaElem);return}if(playRet)playRet.catch(err=>{if(!this._mediaRemovedPendingPlay.has(mediaElem))this._mediaPendingPlay.add(mediaElem)})}RemovePendingPlay(mediaElem){this._mediaPendingPlay.delete(mediaElem);
this._mediaRemovedPendingPlay.add(mediaElem)}SetSilent(s){this._isSilent=!!s}_OnHideCordovaSplash(){if(navigator["splashscreen"]&&navigator["splashscreen"]["hide"])navigator["splashscreen"]["hide"]()}_OnDebugHighlight(e){const show=e["show"];if(!show){if(this._debugHighlightElem)this._debugHighlightElem.style.display="none";return}if(!this._debugHighlightElem){this._debugHighlightElem=document.createElement("div");this._debugHighlightElem.id="inspectOutline";document.body.appendChild(this._debugHighlightElem)}const elem=
this._debugHighlightElem;elem.style.display="";elem.style.left=e["left"]-1+"px";elem.style.top=e["top"]-1+"px";elem.style.width=e["width"]+2+"px";elem.style.height=e["height"]+2+"px";elem.textContent=e["name"]}_OnRegisterSW(){if(window["C3_RegisterSW"])window["C3_RegisterSW"]()}_OnPostToDebugger(data){if(!window["c3_postToMessagePort"])return;data["from"]="runtime";window["c3_postToMessagePort"](data)}_InvokeFunctionFromJS(name,params){return this.PostToRuntimeAsync("js-invoke-function",{"name":name,
"params":params})}_OnScriptCreateWorker(e){const url=e["url"];const opts=e["opts"];const port2=e["port2"];const worker=new Worker(url,opts);worker.postMessage({"type":"construct-worker-init","port2":port2},[port2])}_OnAlert(e){alert(e["message"])}_OnScreenReaderTextEvent(e){const type=e["type"];if(type==="create"){const p=document.createElement("p");p.id="c3-sr-"+e["id"];p.textContent=e["text"];this._screenReaderTextWrap.appendChild(p)}else if(type==="update"){const p=document.getElementById("c3-sr-"+
e["id"]);if(p)p.textContent=e["text"];else console.warn(`[Construct] Missing screen reader text with id ${e["id"]}`)}else if(type==="release"){const p=document.getElementById("c3-sr-"+e["id"]);if(p)p.remove();else console.warn(`[Construct] Missing screen reader text with id ${e["id"]}`)}else console.warn(`[Construct] Unknown screen reader text update '${type}'`)}_SetExportingToVideo(e){this._isExportToVideo=true;const headerElem=document.createElement("h1");headerElem.id="exportToVideoMessage";headerElem.textContent=
e["message"];document.body.prepend(headerElem);document.body.classList.add("exportingToVideo");this.GetRuntimeInterface().GetMainCanvas().style.display="";this._iRuntime.SetIsExportingToVideo(e["duration"])}_OnExportVideoProgress(e){this._exportVideoProgressMessage=e["message"];if(this._exportVideoUpdateTimerId===-1)this._exportVideoUpdateTimerId=setTimeout(()=>this._DoUpdateExportVideoProgressMessage(),250)}_DoUpdateExportVideoProgressMessage(){this._exportVideoUpdateTimerId=-1;const headerElem=
document.getElementById("exportToVideoMessage");if(headerElem)headerElem.textContent=this._exportVideoProgressMessage}_OnExportedToVideo(e){window.c3_postToMessagePort({"type":"exported-video","arrayBuffer":e["arrayBuffer"],"contentType":e["contentType"],"time":e["time"]})}_OnExportedToImageSequence(e){window.c3_postToMessagePort({"type":"exported-image-sequence","blobArr":e["blobArr"],"time":e["time"],"gif":e["gif"]})}};RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS)};


'use strict';{const DISPATCH_WORKER_SCRIPT_NAME="dispatchworker.js";const JOB_WORKER_SCRIPT_NAME="jobworker.js";self.JobSchedulerDOM=class JobSchedulerDOM{constructor(runtimeInterface){this._runtimeInterface=runtimeInterface;this._baseUrl=runtimeInterface.GetRuntimeBaseURL();if(runtimeInterface.GetExportType()==="preview")this._baseUrl+="workers/";else this._baseUrl+=runtimeInterface.GetScriptFolder();this._maxNumWorkers=Math.min(navigator.hardwareConcurrency||2,16);this._dispatchWorker=null;this._jobWorkers=
[];this._inputPort=null;this._outputPort=null}_GetWorkerScriptFolder(){if(this._runtimeInterface.GetExportType()==="playable-ad")return this._runtimeInterface.GetScriptFolder();else return""}async Init(){if(this._hasInitialised)throw new Error("already initialised");this._hasInitialised=true;const dispatchWorkerScriptUrl=this._runtimeInterface._GetWorkerURL(this._GetWorkerScriptFolder()+DISPATCH_WORKER_SCRIPT_NAME);this._dispatchWorker=await this._runtimeInterface.CreateWorker(dispatchWorkerScriptUrl,
this._baseUrl,{name:"DispatchWorker"});const messageChannel=new MessageChannel;this._inputPort=messageChannel.port1;this._dispatchWorker.postMessage({"type":"_init","in-port":messageChannel.port2},[messageChannel.port2]);this._outputPort=await this._CreateJobWorker()}async _CreateJobWorker(){const number=this._jobWorkers.length;const jobWorkerScriptUrl=this._runtimeInterface._GetWorkerURL(this._GetWorkerScriptFolder()+JOB_WORKER_SCRIPT_NAME);const jobWorker=await this._runtimeInterface.CreateWorker(jobWorkerScriptUrl,
this._baseUrl,{name:"JobWorker"+number});const dispatchChannel=new MessageChannel;const outputChannel=new MessageChannel;this._dispatchWorker.postMessage({"type":"_addJobWorker","port":dispatchChannel.port1},[dispatchChannel.port1]);jobWorker.postMessage({"type":"init","number":number,"dispatch-port":dispatchChannel.port2,"output-port":outputChannel.port2},[dispatchChannel.port2,outputChannel.port2]);this._jobWorkers.push(jobWorker);return outputChannel.port1}GetPortData(){return{"inputPort":this._inputPort,
"outputPort":this._outputPort,"maxNumWorkers":this._maxNumWorkers}}GetPortTransferables(){return[this._inputPort,this._outputPort]}}};


'use strict';{if(window["C3_Is_Supported"]){const enableWorker=true;window["c3_runtimeInterface"]=new self.RuntimeInterface({useWorker:enableWorker,workerMainUrl:"workermain.js",engineScripts:["scripts/c3runtime.js"],projectScripts:[],mainProjectScript:"",scriptFolder:"scripts/",workerDependencyScripts:[],exportType:"html5"})}};
'use strict';{const DOM_COMPONENT_ID="touch";const HANDLER_CLASS=class TouchDOMHandler extends self.DOMHandler{constructor(iRuntime){super(iRuntime,DOM_COMPONENT_ID);this.AddRuntimeMessageHandler("request-permission",e=>this._OnRequestPermission(e))}async _OnRequestPermission(e){const type=e["type"];let result=true;if(type===0)result=await this._RequestOrientationPermission();else if(type===1)result=await this._RequestMotionPermission();this.PostToRuntime("permission-result",{"type":type,"result":result})}async _RequestOrientationPermission(){if(!self["DeviceOrientationEvent"]||
!self["DeviceOrientationEvent"]["requestPermission"])return true;try{const state=await self["DeviceOrientationEvent"]["requestPermission"]();return state==="granted"}catch(err){console.warn("[Touch] Failed to request orientation permission: ",err);return false}}async _RequestMotionPermission(){if(!self["DeviceMotionEvent"]||!self["DeviceMotionEvent"]["requestPermission"])return true;try{const state=await self["DeviceMotionEvent"]["requestPermission"]();return state==="granted"}catch(err){console.warn("[Touch] Failed to request motion permission: ",
err);return false}}};self.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS)};
'use strict';{const DOM_COMPONENT_ID="mouse";const HANDLER_CLASS=class MouseDOMHandler extends self.DOMHandler{constructor(iRuntime){super(iRuntime,DOM_COMPONENT_ID);this.AddRuntimeMessageHandlers([["cursor",e=>this._OnChangeCursorStyle(e)],["request-pointer-lock",()=>this._OnRequestPointerLock()],["release-pointer-lock",()=>this._OnReleasePointerLock()]]);document.addEventListener("pointerlockchange",e=>this._OnPointerLockChange());document.addEventListener("pointerlockerror",e=>this._OnPointerLockError())}_OnChangeCursorStyle(e){document.documentElement.style.cursor=
e}_OnRequestPointerLock(){this._iRuntime.GetMainCanvas().requestPointerLock()}_OnReleasePointerLock(){document.exitPointerLock()}_OnPointerLockChange(){this.PostToRuntime("pointer-lock-change",{"has-pointer-lock":!!document.pointerLockElement})}_OnPointerLockError(){this.PostToRuntime("pointer-lock-error",{"has-pointer-lock":!!document.pointerLockElement})}};self.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS)};
'use strict';{const R_TO_D=180/Math.PI;const DOM_COMPONENT_ID="audio";self.AudioDOMHandler=class AudioDOMHandler extends self.DOMHandler{constructor(iRuntime){super(iRuntime,DOM_COMPONENT_ID);this._audioContext=null;this._destinationNode=null;this._hasUnblocked=false;this._hasAttachedUnblockEvents=false;this._unblockFunc=()=>this._UnblockAudioContext();this._audioBuffers=[];this._audioInstances=[];this._lastAudioInstance=null;this._lastPlayedTags=[];this._loadedAudioUrls=new Set;this._lastTickCount=
-1;this._pendingTags=new Map;this._masterVolume=1;this._isSilent=false;this._timeScaleMode=0;this._timeScale=1;this._gameTime=0;this._panningModel="HRTF";this._distanceModel="inverse";this._refDistance=600;this._maxDistance=1E4;this._rolloffFactor=1;this._lastListenerPos=[0,0,0];this._lastListenerOrientation=[0,0,-1,0,1,0];this._playMusicAsSound=false;this._hasAnySoftwareDecodedMusic=false;this._supportsWebMOpus=this._iRuntime.IsAudioFormatSupported("audio/webm; codecs=opus");this._effects=new Map;
this._analysers=new Set;this._isPendingPostFxState=false;this._hasStartedOfflineRender=false;this._microphoneTag="";this._microphoneSource=null;self["C3Audio_OnMicrophoneStream"]=(localMediaStream,tag)=>this._OnMicrophoneStream(localMediaStream,tag);this._destMediaStreamNode=null;self["C3Audio_GetOutputStream"]=()=>this._OnGetOutputStream();self["C3Audio_DOMInterface"]=this;this.AddRuntimeMessageHandlers([["create-audio-context",e=>this._CreateAudioContext(e)],["play",e=>this._Play(e)],["stop",e=>
this._Stop(e)],["stop-all",()=>this._StopAll()],["set-paused",e=>this._SetPaused(e)],["set-volume",e=>this._SetVolume(e)],["fade-volume",e=>this._FadeVolume(e)],["set-master-volume",e=>this._SetMasterVolume(e)],["set-muted",e=>this._SetMuted(e)],["set-silent",e=>this._SetSilent(e)],["set-looping",e=>this._SetLooping(e)],["set-playback-rate",e=>this._SetPlaybackRate(e)],["set-stereo-pan",e=>this._SetStereoPan(e)],["seek",e=>this._Seek(e)],["preload",e=>this._Preload(e)],["unload",e=>this._Unload(e)],
["unload-all",()=>this._UnloadAll()],["set-suspended",e=>this._SetSuspended(e)],["add-effect",e=>this._AddEffect(e)],["set-effect-param",e=>this._SetEffectParam(e)],["remove-effects",e=>this._RemoveEffects(e)],["tick",e=>this._OnTick(e)],["load-state",e=>this._OnLoadState(e)],["offline-render-audio",e=>this._OnOfflineRenderAudio(e)],["offline-render-finish",()=>this._OnOfflineRenderFinish()]])}async _CreateAudioContext(e){if(e["usePlayMusicAsSoundWorkaround"])this._playMusicAsSound=true;this._timeScaleMode=
e["timeScaleMode"];this._panningModel=["equalpower","HRTF","soundfield"][e["panningModel"]];this._distanceModel=["linear","inverse","exponential"][e["distanceModel"]];this._refDistance=e["refDistance"];this._maxDistance=e["maxDistance"];this._rolloffFactor=e["rolloffFactor"];if(this._iRuntime.IsExportingToVideo()){this._playMusicAsSound=true;const sampleRate=48E3;this._audioContext=new OfflineAudioContext({"numberOfChannels":2,"sampleRate":sampleRate,"length":Math.ceil(this._iRuntime.GetExportToVideoDuration()*
sampleRate)})}else{const opts={"latencyHint":e["latencyHint"]};if(!this.SupportsWebMOpus())opts["sampleRate"]=48E3;if(typeof AudioContext!=="undefined")this._audioContext=new AudioContext(opts);else if(typeof webkitAudioContext!=="undefined")this._audioContext=new webkitAudioContext(opts);else throw new Error("Web Audio API not supported");this._AttachUnblockEvents();this._audioContext.onstatechange=()=>{if(this._audioContext.state!=="running")this._AttachUnblockEvents();this.PostToRuntime("audiocontext-state",
{"audioContextState":this._audioContext.state})}}this._destinationNode=this._audioContext["createGain"]();this._destinationNode["connect"](this._audioContext["destination"]);const listenerPos=e["listenerPos"];this._lastListenerPos[0]=listenerPos[0];this._lastListenerPos[1]=listenerPos[1];this._lastListenerPos[2]=listenerPos[2];this._audioContext["listener"]["setPosition"](listenerPos[0],listenerPos[1],listenerPos[2]);this._audioContext["listener"]["setOrientation"](...this._lastListenerOrientation);
self["C3_GetAudioContextCurrentTime"]=()=>this.GetAudioCurrentTime();try{await Promise.all(e["preloadList"].map(o=>this._GetAudioBuffer(o["originalUrl"],o["url"],o["type"],false)))}catch(err){console.error("[Construct] Preloading sounds failed: ",err)}return{"sampleRate":this._audioContext["sampleRate"],"audioContextState":this._audioContext.state,"outputLatency":this._audioContext["outputLatency"]||0}}_AttachUnblockEvents(){if(this._hasAttachedUnblockEvents)return;this._hasUnblocked=false;window.addEventListener("pointerup",
this._unblockFunc,true);window.addEventListener("touchend",this._unblockFunc,true);window.addEventListener("click",this._unblockFunc,true);window.addEventListener("keydown",this._unblockFunc,true);this._hasAttachedUnblockEvents=true}_DetachUnblockEvents(){if(!this._hasAttachedUnblockEvents)return;this._hasUnblocked=true;window.removeEventListener("pointerup",this._unblockFunc,true);window.removeEventListener("touchend",this._unblockFunc,true);window.removeEventListener("click",this._unblockFunc,true);
window.removeEventListener("keydown",this._unblockFunc,true);this._hasAttachedUnblockEvents=false}_UnblockAudioContext(){if(this._hasUnblocked)return;const audioContext=this._audioContext;if(audioContext["state"]==="suspended"&&audioContext["resume"])audioContext["resume"]();const buffer=audioContext["createBuffer"](1,220,22050);const source=audioContext["createBufferSource"]();source["buffer"]=buffer;source["connect"](audioContext["destination"]);source["start"](0);if(audioContext["state"]==="running")this._DetachUnblockEvents()}_MatchTagLists(tagArr1,
tagArr2){for(const t2 of tagArr2){let found=false;for(const t1 of tagArr1)if(self.AudioDOMHandler.EqualsNoCase(t1,t2)){found=true;break}if(!found)return false}return true}GetAudioContext(){return this._audioContext}GetAudioCurrentTime(){return this._audioContext["currentTime"]}GetDestinationNode(){return this._destinationNode}["GetAudioContextExtern"](){return this.GetAudioContext()}["GetDestinationNodeExtern"](){return this.GetDestinationNode()}GetDestinationForTag(tag){const fxChain=this._effects.get(tag.toLowerCase());
if(fxChain)return fxChain[0].GetInputNode();else return this.GetDestinationNode()}AddEffectForTag(tag,effect){tag=tag.toLowerCase();let fxChain=this._effects.get(tag);if(!fxChain){fxChain=[];this._effects.set(tag,fxChain)}effect._SetIndex(fxChain.length);effect._SetTag(tag);fxChain.push(effect);this._ReconnectEffects(tag)}_ReconnectEffects(tag){tag=tag.toLowerCase();let destNode=this.GetDestinationNode();const fxChain=this._effects.get(tag);if(fxChain&&fxChain.length){destNode=fxChain[0].GetInputNode();
for(let i=0,len=fxChain.length;i<len;++i){const n=fxChain[i];if(i+1===len)n.ConnectTo(this.GetDestinationNode());else n.ConnectTo(fxChain[i+1].GetInputNode())}}for(const ai of this.audioInstancesByEffectTag(tag))ai.Reconnect(destNode);if(this._microphoneSource&&this._microphoneTag===tag){this._microphoneSource["disconnect"]();this._microphoneSource["connect"](destNode)}}GetMasterVolume(){return this._masterVolume}IsSilent(){return this._isSilent}GetTimeScaleMode(){return this._timeScaleMode}GetTimeScale(){return this._timeScale}GetGameTime(){return this._gameTime}IsPlayMusicAsSound(){return this._playMusicAsSound}SupportsWebMOpus(){return this._supportsWebMOpus}_SetHasAnySoftwareDecodedMusic(){this._hasAnySoftwareDecodedMusic=
true}GetPanningModel(){return this._panningModel}GetDistanceModel(){return this._distanceModel}GetReferenceDistance(){return this._refDistance}GetMaxDistance(){return this._maxDistance}GetRolloffFactor(){return this._rolloffFactor}DecodeAudioData(audioData,needsSoftwareDecode){if(needsSoftwareDecode)return this._iRuntime._WasmDecodeWebMOpus(audioData).then(rawAudio=>{const audioBuffer=this._audioContext["createBuffer"](1,rawAudio.length,48E3);const channelBuffer=audioBuffer["getChannelData"](0);channelBuffer.set(rawAudio);
return audioBuffer});else return new Promise((resolve,reject)=>{this._audioContext["decodeAudioData"](audioData,resolve,reject)})}TryPlayMedia(mediaElem){this._iRuntime.TryPlayMedia(mediaElem)}RemovePendingPlay(mediaElem){this._iRuntime.RemovePendingPlay(mediaElem)}ReleaseInstancesForBuffer(buffer){let j=0;for(let i=0,len=this._audioInstances.length;i<len;++i){const a=this._audioInstances[i];this._audioInstances[j]=a;if(a.GetBuffer()===buffer)a.Release();else++j}this._audioInstances.length=j}ReleaseAllMusicBuffers(){let j=
0;for(let i=0,len=this._audioBuffers.length;i<len;++i){const b=this._audioBuffers[i];this._audioBuffers[j]=b;if(b.IsMusic())b.Release();else++j}this._audioBuffers.length=j}*audioInstancesMatchingTags(tags){if(tags.length>0)for(const ai of this._audioInstances){if(this._MatchTagLists(ai.GetTags(),tags))yield ai}else if(this._lastAudioInstance&&!this._lastAudioInstance.HasEnded())yield this._lastAudioInstance}*audioInstancesByEffectTag(tag){if(tag)for(const ai of this._audioInstances){if(self.AudioDOMHandler.EqualsNoCase(ai.GetEffectTag(),
tag))yield ai}else if(this._lastAudioInstance&&!this._lastAudioInstance.HasEnded())yield this._lastAudioInstance}async _GetAudioBuffer(originalUrl,url,type,isMusic,dontCreate){for(const ab of this._audioBuffers)if(ab.GetUrl()===url){await ab.Load();return ab}if(dontCreate)return null;if(isMusic&&(this._playMusicAsSound||this._hasAnySoftwareDecodedMusic))this.ReleaseAllMusicBuffers();const ret=self.C3AudioBuffer.Create(this,originalUrl,url,type,isMusic);this._audioBuffers.push(ret);await ret.Load();
if(!this._loadedAudioUrls.has(originalUrl)){this.PostToRuntime("buffer-metadata",{"originalUrl":originalUrl,"duration":ret.GetDuration()});this._loadedAudioUrls.add(originalUrl)}return ret}async _GetAudioInstance(originalUrl,url,type,tags,isMusic){for(const ai of this._audioInstances)if(ai.GetUrl()===url&&(ai.CanBeRecycled()||isMusic)){ai.SetTags(tags);return ai}const buffer=await this._GetAudioBuffer(originalUrl,url,type,isMusic);const ret=buffer.CreateInstance(tags);this._audioInstances.push(ret);
return ret}_AddPendingTags(tags){const tagStr=tags.join(" ");let info=this._pendingTags.get(tagStr);if(!info){let resolve=null;const promise=new Promise(r=>resolve=r);info={pendingCount:0,promise,resolve};this._pendingTags.set(tagStr,info)}info.pendingCount++}_RemovePendingTags(tags){const tagStr=tags.join(" ");const info=this._pendingTags.get(tagStr);if(!info)throw new Error("expected pending tag");info.pendingCount--;if(info.pendingCount===0){info.resolve();this._pendingTags.delete(tagStr)}}TagsReady(tags){const tagStr=
(tags.length===0?this._lastPlayedTags:tags).join(" ");const info=this._pendingTags.get(tagStr);if(info)return info.promise;else return Promise.resolve()}_MaybeStartTicking(){if(this._analysers.size>0){this._StartTicking();return}for(const ai of this._audioInstances)if(ai.IsActive()){this._StartTicking();return}}Tick(){for(const a of this._analysers)a.Tick();const currentTime=this.GetAudioCurrentTime();for(const ai of this._audioInstances)ai.Tick(currentTime);const instStates=this._audioInstances.filter(a=>
a.IsActive()).map(a=>a.GetState());this.PostToRuntime("state",{"tickCount":this._lastTickCount,"outputLatency":this._audioContext["outputLatency"]||0,"audioInstances":instStates,"analysers":[...this._analysers].map(a=>a.GetData())});if(instStates.length===0&&this._analysers.size===0)this._StopTicking()}PostTrigger(type,tags,aiid){this.PostToRuntime("trigger",{"type":type,"tags":tags,"aiid":aiid})}async _Play(e){const originalUrl=e["originalUrl"];const url=e["url"];const type=e["type"];const isMusic=
e["isMusic"];const tags=e["tags"];const isLooping=e["isLooping"];const volume=e["vol"];const position=e["pos"];const panning=e["panning"];const stereoPan=e["stereoPan"];let startTime=e["off"];if(startTime>0&&!e["trueClock"])if(this._audioContext["getOutputTimestamp"]){const outputTimestamp=this._audioContext["getOutputTimestamp"]();startTime=startTime-outputTimestamp["performanceTime"]/1E3+outputTimestamp["contextTime"]}else startTime=startTime-performance.now()/1E3+this._audioContext["currentTime"];
this._lastPlayedTags=tags.slice(0);this._AddPendingTags(tags);try{this._lastAudioInstance=await this._GetAudioInstance(originalUrl,url,type,tags,isMusic);if(panning){this._lastAudioInstance.SetPannerEnabled(true);this._lastAudioInstance.SetPan(panning["x"],panning["y"],panning["z"],panning["angle"],panning["innerAngle"],panning["outerAngle"],panning["outerGain"]);if(panning.hasOwnProperty("uid"))this._lastAudioInstance.SetUID(panning["uid"])}else if(typeof stereoPan==="number"&&stereoPan!==0){this._lastAudioInstance.SetStereoPannerEnabled(true);
this._lastAudioInstance.SetStereoPan(stereoPan)}else{this._lastAudioInstance.SetPannerEnabled(false);this._lastAudioInstance.SetStereoPannerEnabled(false)}this._lastAudioInstance.Play(isLooping,volume,position,startTime)}catch(err){console.error("[Construct] Audio: error starting playback: ",err);return}finally{this._RemovePendingTags(tags)}this._StartTicking()}_Stop(e){const tags=e["tags"];for(const ai of this.audioInstancesMatchingTags(tags))ai.Stop()}_StopAll(){for(const ai of this._audioInstances)ai.Stop()}_SetPaused(e){const tags=
e["tags"];const paused=e["paused"];for(const ai of this.audioInstancesMatchingTags(tags))if(paused)ai.Pause();else ai.Resume();this._MaybeStartTicking()}_SetVolume(e){const tags=e["tags"];const vol=e["vol"];for(const ai of this.audioInstancesMatchingTags(tags))ai.SetVolume(vol)}_SetStereoPan(e){const tags=e["tags"];const p=e["p"];for(const ai of this.audioInstancesMatchingTags(tags)){ai.SetStereoPannerEnabled(true);ai.SetStereoPan(p)}}async _FadeVolume(e){const tags=e["tags"];const vol=e["vol"];const duration=
e["duration"];const stopOnEnd=e["stopOnEnd"];await this.TagsReady(tags);for(const ai of this.audioInstancesMatchingTags(tags))ai.FadeVolume(vol,duration,stopOnEnd);this._MaybeStartTicking()}_SetMasterVolume(e){this._masterVolume=e["vol"];this._destinationNode["gain"]["value"]=this._masterVolume}_SetMuted(e){const tags=e["tags"];const isMuted=e["isMuted"];for(const ai of this.audioInstancesMatchingTags(tags))ai.SetMuted(isMuted)}_SetSilent(e){this._isSilent=e["isSilent"];this._iRuntime.SetSilent(this._isSilent);
for(const ai of this._audioInstances)ai._UpdateMuted()}_SetLooping(e){const tags=e["tags"];const isLooping=e["isLooping"];for(const ai of this.audioInstancesMatchingTags(tags))ai.SetLooping(isLooping)}async _SetPlaybackRate(e){const tags=e["tags"];const rate=e["rate"];await this.TagsReady(tags);for(const ai of this.audioInstancesMatchingTags(tags))ai.SetPlaybackRate(rate)}async _Seek(e){const tags=e["tags"];const pos=e["pos"];await this.TagsReady(tags);for(const ai of this.audioInstancesMatchingTags(tags))ai.Seek(pos)}async _Preload(e){const originalUrl=
e["originalUrl"];const url=e["url"];const type=e["type"];const isMusic=e["isMusic"];try{await this._GetAudioInstance(originalUrl,url,type,"",isMusic)}catch(err){console.error("[Construct] Audio: error preloading: ",err)}}async _Unload(e){const url=e["url"];const type=e["type"];const isMusic=e["isMusic"];const buffer=await this._GetAudioBuffer("",url,type,isMusic,true);if(!buffer)return;buffer.Release();const i=this._audioBuffers.indexOf(buffer);if(i!==-1)this._audioBuffers.splice(i,1)}_UnloadAll(){for(const buffer of this._audioBuffers)buffer.Release();
this._audioBuffers.length=0}_SetSuspended(e){const isSuspended=e["isSuspended"];if(!isSuspended&&this._audioContext["resume"])this._audioContext["resume"]();for(const ai of this._audioInstances)ai.SetSuspended(isSuspended);if(isSuspended&&this._audioContext["suspend"])this._audioContext["suspend"]()}_OnTick(e){this._timeScale=e["timeScale"];this._gameTime=e["gameTime"];this._lastTickCount=e["tickCount"];if(this._timeScaleMode!==0)for(const ai of this._audioInstances)ai._UpdatePlaybackRate();const listenerPos=
e["listenerPos"];if(listenerPos&&(this._lastListenerPos[0]!==listenerPos[0]||this._lastListenerPos[1]!==listenerPos[1]||this._lastListenerPos[2]!==listenerPos[2])){this._lastListenerPos[0]=listenerPos[0];this._lastListenerPos[1]=listenerPos[1];this._lastListenerPos[2]=listenerPos[2];this._audioContext["listener"]["setPosition"](listenerPos[0],listenerPos[1],listenerPos[2])}const listenerOrientation=e["listenerOrientation"];if(listenerOrientation&&(this._lastListenerOrientation[0]!==listenerOrientation[0]||
this._lastListenerOrientation[1]!==listenerOrientation[1]||this._lastListenerOrientation[2]!==listenerOrientation[2]||this._lastListenerOrientation[3]!==listenerOrientation[3]||this._lastListenerOrientation[4]!==listenerOrientation[4]||this._lastListenerOrientation[5]!==listenerOrientation[5])){for(let i=0;i<6;++i)this._lastListenerOrientation[i]=listenerOrientation[i];this._audioContext["listener"]["setOrientation"](...this._lastListenerOrientation)}for(const instPan of e["instPans"]){const uid=
instPan["uid"];for(const ai of this._audioInstances)if(ai.GetUID()===uid)ai.SetPanXYZA(instPan["x"],instPan["y"],instPan["z"],instPan["angle"])}}async _AddEffect(e){const type=e["type"];const tags=e.hasOwnProperty("tags")?e["tags"]:[e["tag"]];const params=e["params"];let effect;let convolutionBuffer;if(type==="convolution")try{convolutionBuffer=await this._GetAudioBuffer(e["bufferOriginalUrl"],e["bufferUrl"],e["bufferType"],false)}catch(err){console.log("[Construct] Audio: error loading convolution: ",
err);return}for(const tag of tags){if(type==="filter")effect=new self.C3AudioFilterFX(this,...params);else if(type==="delay")effect=new self.C3AudioDelayFX(this,...params);else if(type==="convolution"){effect=new self.C3AudioConvolveFX(this,convolutionBuffer.GetAudioBuffer(),...params);effect._SetBufferInfo(e["bufferOriginalUrl"],e["bufferUrl"],e["bufferType"])}else if(type==="flanger")effect=new self.C3AudioFlangerFX(this,...params);else if(type==="phaser")effect=new self.C3AudioPhaserFX(this,...params);
else if(type==="gain")effect=new self.C3AudioGainFX(this,...params);else if(type==="stereopan")effect=new self.C3AudioStereoPanFX(this,...params);else if(type==="tremolo")effect=new self.C3AudioTremoloFX(this,...params);else if(type==="ringmod")effect=new self.C3AudioRingModFX(this,...params);else if(type==="distortion")effect=new self.C3AudioDistortionFX(this,...params);else if(type==="compressor")effect=new self.C3AudioCompressorFX(this,...params);else if(type==="analyser")effect=new self.C3AudioAnalyserFX(this,
...params);else throw new Error("invalid effect type");this.AddEffectForTag(tag,effect)}this._PostUpdatedFxState()}_SetEffectParam(e){const tags=e["tags"];const index=e["index"];const param=e["param"];const value=e["value"];const ramp=e["ramp"];const time=e["time"];for(const tag of tags){const fxChain=this._effects.get(tag.toLowerCase());if(!fxChain||index<0||index>=fxChain.length)continue;fxChain[index].SetParam(param,value,ramp,time)}this._PostUpdatedFxState()}_RemoveEffects(e){const tags=e["tags"];
for(const tag of tags){const lowerTag=tag.toLowerCase();const fxChain=this._effects.get(lowerTag);if(!fxChain||!fxChain.length)return;for(const effect of fxChain)effect.Release();this._effects.delete(lowerTag);this._ReconnectEffects(lowerTag)}}_AddAnalyser(analyser){this._analysers.add(analyser);this._MaybeStartTicking()}_RemoveAnalyser(analyser){this._analysers.delete(analyser)}_PostUpdatedFxState(){if(this._isPendingPostFxState)return;this._isPendingPostFxState=true;Promise.resolve().then(()=>this._DoPostUpdatedFxState())}_DoPostUpdatedFxState(){const fxstate=
{};for(const [tag,fxChain]of this._effects)fxstate[tag]=fxChain.map(e=>e.GetState());this.PostToRuntime("fxstate",{"fxstate":fxstate});this._isPendingPostFxState=false}async _OnLoadState(e){const saveLoadMode=e["saveLoadMode"];if(saveLoadMode!==3){const keepAudioInstances=[];for(const ai of this._audioInstances)if(ai.IsMusic()&&saveLoadMode===1||!ai.IsMusic()&&saveLoadMode===2)keepAudioInstances.push(ai);else ai.Release();this._audioInstances=keepAudioInstances}for(const fxChain of this._effects.values())for(const effect of fxChain)effect.Release();
this._effects.clear();this._timeScale=e["timeScale"];this._gameTime=e["gameTime"];const listenerPos=e["listenerPos"];this._lastListenerPos[0]=listenerPos[0];this._lastListenerPos[1]=listenerPos[1];this._lastListenerPos[2]=listenerPos[2];this._audioContext["listener"]["setPosition"](listenerPos[0],listenerPos[1],listenerPos[2]);const listenerOrientation=e["listenerOrientation"];if(Array.isArray(listenerOrientation)){for(let i=0;i<6;++i)this._lastListenerOrientation[i]=listenerOrientation[i];this._audioContext["listener"]["setOrientation"](...this._lastListenerOrientation)}this._isSilent=
e["isSilent"];this._iRuntime.SetSilent(this._isSilent);this._masterVolume=e["masterVolume"];this._destinationNode["gain"]["value"]=this._masterVolume;const promises=[];for(const fxChainData of Object.values(e["effects"]))promises.push(Promise.all(fxChainData.map(d=>this._AddEffect(d))));await Promise.all(promises);await Promise.all(e["playing"].map(d=>this._LoadAudioInstance(d,saveLoadMode)));this._MaybeStartTicking()}async _LoadAudioInstance(d,saveLoadMode){if(saveLoadMode===3)return;const originalUrl=
d["bufferOriginalUrl"];const url=d["bufferUrl"];const type=d["bufferType"];const isMusic=d["isMusic"];const tags=d["tags"];const isLooping=d["isLooping"];const volume=d["volume"];const position=d["playbackTime"];if(isMusic&&saveLoadMode===1)return;if(!isMusic&&saveLoadMode===2)return;let ai=null;try{ai=await this._GetAudioInstance(originalUrl,url,type,tags,isMusic)}catch(err){console.error("[Construct] Audio: error loading audio state: ",err);return}ai.LoadPanState(d["pan"]);ai.LoadStereoPanState(d["stereoPan"]);
ai.Play(isLooping,volume,position,0);if(!d["isPlaying"])ai.Pause();ai._LoadAdditionalState(d)}_OnMicrophoneStream(localMediaStream,tag){if(this._microphoneSource)this._microphoneSource["disconnect"]();this._microphoneTag=tag.toLowerCase();this._microphoneSource=this._audioContext["createMediaStreamSource"](localMediaStream);this._microphoneSource["connect"](this.GetDestinationForTag(this._microphoneTag))}_OnGetOutputStream(){if(!this._destMediaStreamNode){this._destMediaStreamNode=this._audioContext["createMediaStreamDestination"]();
this._destinationNode["connect"](this._destMediaStreamNode)}return this._destMediaStreamNode["stream"]}async _OnOfflineRenderAudio(e){try{const time=e["time"];const suspendPromise=this._audioContext["suspend"](time);if(!this._hasStartedOfflineRender){this._audioContext["startRendering"]().then(buffer=>this._OnOfflineRenderCompleted(buffer)).catch(err=>this._OnOfflineRenderError(err));this._hasStartedOfflineRender=true}else this._audioContext["resume"]();await suspendPromise}catch(err){this._OnOfflineRenderError(err)}}_OnOfflineRenderFinish(){this._audioContext["resume"]()}_OnOfflineRenderCompleted(buffer){const channelArrayBuffers=
[];for(let i=0,len=buffer["numberOfChannels"];i<len;++i){const f32arr=buffer["getChannelData"](i);channelArrayBuffers.push(f32arr.buffer)}this._iRuntime.PostToRuntimeComponent("runtime","offline-audio-render-completed",{"duration":buffer["duration"],"length":buffer["length"],"numberOfChannels":buffer["numberOfChannels"],"sampleRate":buffer["sampleRate"],"channelData":channelArrayBuffers},null,channelArrayBuffers)}_OnOfflineRenderError(err){console.error(`[Audio] Offline rendering error: `,err)}static EqualsNoCase(a,
b){return a===b||a.normalize().toLowerCase()===b.normalize().toLowerCase()}static ToDegrees(x){return x*R_TO_D}static DbToLinearNoCap(x){return Math.pow(10,x/20)}static DbToLinear(x){return Math.max(Math.min(self.AudioDOMHandler.DbToLinearNoCap(x),1),0)}static LinearToDbNoCap(x){return Math.log(x)/Math.log(10)*20}static LinearToDb(x){return self.AudioDOMHandler.LinearToDbNoCap(Math.max(Math.min(x,1),0))}static e4(x,k){return 1-Math.exp(-k*x)}};self.RuntimeInterface.AddDOMHandlerClass(self.AudioDOMHandler)};
'use strict';{self.C3AudioBuffer=class C3AudioBuffer{constructor(audioDomHandler,originalUrl,url,type,isMusic){this._audioDomHandler=audioDomHandler;this._originalUrl=originalUrl;this._url=url;this._type=type;this._isMusic=isMusic;this._api="";this._loadState="not-loaded";this._loadPromise=null}Release(){this._loadState="not-loaded";this._audioDomHandler=null;this._loadPromise=null}static Create(audioDomHandler,originalUrl,url,type,isMusic){const needsSoftwareDecode=type==="audio/webm; codecs=opus"&&
!audioDomHandler.SupportsWebMOpus();if(isMusic&&needsSoftwareDecode)audioDomHandler._SetHasAnySoftwareDecodedMusic();if(!isMusic||audioDomHandler.IsPlayMusicAsSound()||needsSoftwareDecode)return new self.C3WebAudioBuffer(audioDomHandler,originalUrl,url,type,isMusic,needsSoftwareDecode);else return new self.C3Html5AudioBuffer(audioDomHandler,originalUrl,url,type,isMusic)}CreateInstance(tags){if(this._api==="html5")return new self.C3Html5AudioInstance(this._audioDomHandler,this,tags);else return new self.C3WebAudioInstance(this._audioDomHandler,
this,tags)}_Load(){}Load(){if(!this._loadPromise)this._loadPromise=this._Load();return this._loadPromise}IsLoaded(){}IsLoadedAndDecoded(){}HasFailedToLoad(){return this._loadState==="failed"}GetAudioContext(){return this._audioDomHandler.GetAudioContext()}GetApi(){return this._api}GetOriginalUrl(){return this._originalUrl}GetUrl(){return this._url}GetContentType(){return this._type}IsMusic(){return this._isMusic}GetDuration(){}}};
'use strict';{self.C3Html5AudioBuffer=class C3Html5AudioBuffer extends self.C3AudioBuffer{constructor(audioDomHandler,originalUrl,url,type,isMusic){super(audioDomHandler,originalUrl,url,type,isMusic);this._api="html5";this._audioElem=new Audio;this._audioElem.crossOrigin="anonymous";this._audioElem.autoplay=false;this._audioElem.preload="auto";this._loadResolve=null;this._loadReject=null;this._reachedCanPlayThrough=false;this._audioElem.addEventListener("canplaythrough",()=>this._reachedCanPlayThrough=
true);this._outNode=this.GetAudioContext()["createGain"]();this._mediaSourceNode=null;this._audioElem.addEventListener("canplay",()=>{if(this._loadResolve){this._loadState="loaded";this._loadResolve();this._loadResolve=null;this._loadReject=null}if(this._mediaSourceNode||!this._audioElem)return;this._mediaSourceNode=this.GetAudioContext()["createMediaElementSource"](this._audioElem);this._mediaSourceNode["connect"](this._outNode)});this.onended=null;this._audioElem.addEventListener("ended",()=>{if(this.onended)this.onended()});
this._audioElem.addEventListener("error",e=>this._OnError(e))}Release(){this._audioDomHandler.ReleaseInstancesForBuffer(this);this._outNode["disconnect"]();this._outNode=null;this._mediaSourceNode["disconnect"]();this._mediaSourceNode=null;if(this._audioElem&&!this._audioElem.paused)this._audioElem.pause();this.onended=null;this._audioElem=null;super.Release()}_Load(){this._loadState="loading";return new Promise((resolve,reject)=>{this._loadResolve=resolve;this._loadReject=reject;this._audioElem.src=
this._url})}_OnError(e){console.error(`[Construct] Audio '${this._url}' error: `,e);if(this._loadReject){this._loadState="failed";this._loadReject(e);this._loadResolve=null;this._loadReject=null}}IsLoaded(){const ret=this._audioElem["readyState"]>=4;if(ret)this._reachedCanPlayThrough=true;return ret||this._reachedCanPlayThrough}IsLoadedAndDecoded(){return this.IsLoaded()}GetAudioElement(){return this._audioElem}GetOutputNode(){return this._outNode}GetDuration(){return this._audioElem["duration"]}}};
'use strict';{self.C3WebAudioBuffer=class C3WebAudioBuffer extends self.C3AudioBuffer{constructor(audioDomHandler,originalUrl,url,type,isMusic,needsSoftwareDecode){super(audioDomHandler,originalUrl,url,type,isMusic);this._api="webaudio";this._audioData=null;this._audioBuffer=null;this._needsSoftwareDecode=!!needsSoftwareDecode}Release(){this._audioDomHandler.ReleaseInstancesForBuffer(this);this._audioData=null;this._audioBuffer=null;super.Release()}async _Fetch(){if(this._audioData)return this._audioData;
const iRuntime=this._audioDomHandler.GetRuntimeInterface();if(iRuntime.GetExportType()==="cordova"&&iRuntime.IsRelativeURL(this._url)&&iRuntime.IsFileProtocol())this._audioData=await iRuntime.CordovaFetchLocalFileAsArrayBuffer(this._url);else{const response=await fetch(this._url);if(!response.ok)throw new Error(`error fetching audio data: ${response.status} ${response.statusText}`);this._audioData=await response.arrayBuffer()}}async _Decode(){if(this._audioBuffer)return this._audioBuffer;this._audioBuffer=
await this._audioDomHandler.DecodeAudioData(this._audioData,this._needsSoftwareDecode);this._audioData=null}async _Load(){try{this._loadState="loading";await this._Fetch();await this._Decode();this._loadState="loaded"}catch(err){this._loadState="failed";console.error(`[Construct] Failed to load audio '${this._url}': `,err)}}IsLoaded(){return!!(this._audioData||this._audioBuffer)}IsLoadedAndDecoded(){return!!this._audioBuffer}GetAudioBuffer(){return this._audioBuffer}GetDuration(){return this._audioBuffer?
this._audioBuffer["duration"]:0}}};
'use strict';{let nextAiId=0;self.C3AudioInstance=class C3AudioInstance{constructor(audioDomHandler,buffer,tags){this._audioDomHandler=audioDomHandler;this._buffer=buffer;this._tags=tags;this._aiId=nextAiId++;this._gainNode=this.GetAudioContext()["createGain"]();this._gainNode["connect"](this.GetDestinationNode());this._pannerNode=null;this._isPannerEnabled=false;this._pannerPosition=[0,0,0];this._pannerOrientation=[0,0,0];this._pannerConeParams=[0,0,0];this._stereoPannerNode=null;this._isStereoPannerEnabled=
false;this._stereoPan=0;this._isStopped=true;this._isPaused=false;this._resumeMe=false;this._isLooping=false;this._volume=1;this._isMuted=false;this._playbackRate=1;const timeScaleMode=this._audioDomHandler.GetTimeScaleMode();this._isTimescaled=timeScaleMode===1&&!this.IsMusic()||timeScaleMode===2;this._instUid=-1;this._fadeEndTime=-1;this._stopOnFadeEnd=false}Release(){this._audioDomHandler=null;this._buffer=null;if(this._pannerNode){this._pannerNode["disconnect"]();this._pannerNode=null}if(this._stereoPannerNode){this._stereoPannerNode["disconnect"]();
this._stereoPannerNode=null}this._gainNode["disconnect"]();this._gainNode=null}GetAudioContext(){return this._audioDomHandler.GetAudioContext()}SetTags(tags){this._tags=tags}GetTags(){return this._tags}GetEffectTag(){return this._tags.length>0?this._tags[0]:""}GetDestinationNode(){return this._audioDomHandler.GetDestinationForTag(this.GetEffectTag())}GetCurrentTime(){if(this._isTimescaled)return this._audioDomHandler.GetGameTime();else return performance.now()/1E3}GetOriginalUrl(){return this._buffer.GetOriginalUrl()}GetUrl(){return this._buffer.GetUrl()}GetContentType(){return this._buffer.GetContentType()}GetBuffer(){return this._buffer}IsMusic(){return this._buffer.IsMusic()}GetAiId(){return this._aiId}HasEnded(){}CanBeRecycled(){}IsPlaying(){return!this._isStopped&&
!this._isPaused&&!this.HasEnded()}IsActive(){return!this._isStopped&&!this.HasEnded()}GetPlaybackTime(){}GetDuration(applyPlaybackRate){let ret=this._buffer.GetDuration();if(applyPlaybackRate)ret/=this._playbackRate||.001;return ret}Play(isLooping,vol,seekPos,scheduledTime){}Stop(){}Pause(){}IsPaused(){return this._isPaused}Resume(){}SetVolume(v){this._volume=v;this._gainNode["gain"]["cancelScheduledValues"](0);this._fadeEndTime=-1;this._gainNode["gain"]["value"]=this.GetOutputVolume()}FadeVolume(vol,
duration,stopOnEnd){if(this.IsMuted())return;const gainParam=this._gainNode["gain"];gainParam["cancelScheduledValues"](0);const currentTime=this._audioDomHandler.GetAudioCurrentTime();const endTime=currentTime+duration;gainParam["setValueAtTime"](gainParam["value"],currentTime);gainParam["linearRampToValueAtTime"](vol,endTime);this._volume=vol;this._fadeEndTime=endTime;this._stopOnFadeEnd=stopOnEnd}_UpdateVolume(){this.SetVolume(this._volume)}Tick(currentTime){if(this._fadeEndTime!==-1&&currentTime>=
this._fadeEndTime){this._fadeEndTime=-1;if(this._stopOnFadeEnd)this.Stop();this._audioDomHandler.PostTrigger("fade-ended",this._tags,this._aiId)}}GetOutputVolume(){const ret=this._volume;return isFinite(ret)?ret:0}SetMuted(m){m=!!m;if(this._isMuted===m)return;this._isMuted=m;this._UpdateMuted()}IsMuted(){return this._isMuted}IsSilent(){return this._audioDomHandler.IsSilent()}_UpdateMuted(){}SetLooping(l){}IsLooping(){return this._isLooping}SetPlaybackRate(r){if(this._playbackRate===r)return;this._playbackRate=
r;this._UpdatePlaybackRate()}_UpdatePlaybackRate(){}GetPlaybackRate(){return this._playbackRate}Seek(pos){}SetSuspended(s){}SetPannerEnabled(e){e=!!e;if(this._isPannerEnabled===e)return;this._isPannerEnabled=e;if(this._isPannerEnabled){this.SetStereoPannerEnabled(false);if(!this._pannerNode){this._pannerNode=this.GetAudioContext()["createPanner"]();this._pannerNode["panningModel"]=this._audioDomHandler.GetPanningModel();this._pannerNode["distanceModel"]=this._audioDomHandler.GetDistanceModel();this._pannerNode["refDistance"]=
this._audioDomHandler.GetReferenceDistance();this._pannerNode["maxDistance"]=this._audioDomHandler.GetMaxDistance();this._pannerNode["rolloffFactor"]=this._audioDomHandler.GetRolloffFactor()}this._gainNode["disconnect"]();this._gainNode["connect"](this._pannerNode);this._pannerNode["connect"](this.GetDestinationNode())}else{this._pannerNode["disconnect"]();this._gainNode["disconnect"]();this._gainNode["connect"](this.GetDestinationNode())}}SetPan(x,y,z,angle,innerAngle,outerAngle,outerGain){if(!this._isPannerEnabled)return;
this.SetPanXYZA(x,y,z,angle);const toDegrees=self.AudioDOMHandler.ToDegrees;if(this._pannerConeParams[0]!==toDegrees(innerAngle)){this._pannerConeParams[0]=toDegrees(innerAngle);this._pannerNode["coneInnerAngle"]=toDegrees(innerAngle)}if(this._pannerConeParams[1]!==toDegrees(outerAngle)){this._pannerConeParams[1]=toDegrees(outerAngle);this._pannerNode["coneOuterAngle"]=toDegrees(outerAngle)}if(this._pannerConeParams[2]!==outerGain){this._pannerConeParams[2]=outerGain;this._pannerNode["coneOuterGain"]=
outerGain}}SetPanXYZA(x,y,z,angle){if(!this._isPannerEnabled)return;const pos=this._pannerPosition;const orient=this._pannerOrientation;const cosa=Math.cos(angle);const sina=Math.sin(angle);if(pos[0]!==x||pos[1]!==y||pos[2]!==z){pos[0]=x;pos[1]=y;pos[2]=z;this._pannerNode["setPosition"](...pos)}if(orient[0]!==cosa||orient[1]!==sina||orient[2]!==0){orient[0]=cosa;orient[1]=sina;orient[2]=0;this._pannerNode["setOrientation"](...orient)}}SetStereoPannerEnabled(e){e=!!e;if(this._isStereoPannerEnabled===
e)return;this._isStereoPannerEnabled=e;if(this._isStereoPannerEnabled){this.SetPannerEnabled(false);this._stereoPannerNode=this.GetAudioContext()["createStereoPanner"]();this._gainNode["disconnect"]();this._gainNode["connect"](this._stereoPannerNode);this._stereoPannerNode["connect"](this.GetDestinationNode())}else{this._stereoPannerNode["disconnect"]();this._stereoPannerNode=null;this._gainNode["disconnect"]();this._gainNode["connect"](this.GetDestinationNode())}}SetStereoPan(p){if(!this._isStereoPannerEnabled)return;
if(this._stereoPan===p)return;this._stereoPannerNode["pan"]["value"]=p;this._stereoPan=p}SetUID(uid){this._instUid=uid}GetUID(){return this._instUid}GetResumePosition(){}Reconnect(toNode){const outNode=this._stereoPannerNode||this._pannerNode||this._gainNode;outNode["disconnect"]();outNode["connect"](toNode)}GetState(){return{"aiid":this.GetAiId(),"tags":this._tags,"duration":this.GetDuration(),"volume":this._fadeEndTime===-1?this._volume:this._gainNode["gain"]["value"],"isPlaying":this.IsPlaying(),
"playbackTime":this.GetPlaybackTime(),"playbackRate":this.GetPlaybackRate(),"uid":this._instUid,"bufferOriginalUrl":this.GetOriginalUrl(),"bufferUrl":"","bufferType":this.GetContentType(),"isMusic":this.IsMusic(),"isLooping":this.IsLooping(),"isMuted":this.IsMuted(),"resumePosition":this.GetResumePosition(),"pan":this.GetPanState(),"stereoPan":this.GetStereoPanState()}}_LoadAdditionalState(d){this.SetPlaybackRate(d["playbackRate"]);this.SetMuted(d["isMuted"])}GetPanState(){if(!this._pannerNode)return null;
const pn=this._pannerNode;return{"pos":this._pannerPosition,"orient":this._pannerOrientation,"cia":pn["coneInnerAngle"],"coa":pn["coneOuterAngle"],"cog":pn["coneOuterGain"],"uid":this._instUid}}LoadPanState(d){if(!d){this.SetPannerEnabled(false);return}this.SetPannerEnabled(true);const pn=this._pannerNode;const panPos=d["pos"];this._pannerPosition[0]=panPos[0];this._pannerPosition[1]=panPos[1];this._pannerPosition[2]=panPos[2];const panOrient=d["orient"];this._pannerOrientation[0]=panOrient[0];this._pannerOrientation[1]=
panOrient[1];this._pannerOrientation[2]=panOrient[2];pn["setPosition"](...this._pannerPosition);pn["setOrientation"](...this._pannerOrientation);this._pannerConeParams[0]=d["cia"];this._pannerConeParams[1]=d["coa"];this._pannerConeParams[2]=d["cog"];pn["coneInnerAngle"]=d["cia"];pn["coneOuterAngle"]=d["coa"];pn["coneOuterGain"]=d["cog"];this._instUid=d["uid"]}GetStereoPanState(){if(this._stereoPannerNode)return this._stereoPan;else return null}LoadStereoPanState(p){if(typeof p!=="number"){this.SetStereoPannerEnabled(false);
return}this.SetStereoPannerEnabled(true);this.SetStereoPan(p)}}};
'use strict';{self.C3Html5AudioInstance=class C3Html5AudioInstance extends self.C3AudioInstance{constructor(audioDomHandler,buffer,tags){super(audioDomHandler,buffer,tags);this._buffer.GetOutputNode()["connect"](this._gainNode);this._buffer.onended=()=>this._OnEnded()}Release(){this.Stop();this._buffer.GetOutputNode()["disconnect"]();super.Release()}GetAudioElement(){return this._buffer.GetAudioElement()}_OnEnded(){this._isStopped=true;this._instUid=-1;this._audioDomHandler.PostTrigger("ended",this._tags,
this._aiId)}HasEnded(){return this.GetAudioElement()["ended"]}CanBeRecycled(){if(this._isStopped)return true;return this.HasEnded()}GetPlaybackTime(){let ret=this.GetAudioElement()["currentTime"];if(!this._isLooping)ret=Math.min(ret,this.GetDuration());return ret}Play(isLooping,vol,seekPos,scheduledTime){const audioElem=this.GetAudioElement();if(audioElem.playbackRate!==1)audioElem.playbackRate=1;if(audioElem.loop!==isLooping)audioElem.loop=isLooping;this.SetVolume(vol);this._isMuted=false;if(audioElem.muted)audioElem.muted=
false;if(audioElem.currentTime!==seekPos)try{audioElem.currentTime=seekPos}catch(err){console.warn(`[Construct] Exception seeking audio '${this._buffer.GetUrl()}' to position '${seekPos}': `,err)}this._audioDomHandler.TryPlayMedia(audioElem);this._isStopped=false;this._isPaused=false;this._isLooping=isLooping;this._playbackRate=1}Stop(){const audioElem=this.GetAudioElement();if(!audioElem.paused)audioElem.pause();this._audioDomHandler.RemovePendingPlay(audioElem);this._isStopped=true;this._isPaused=
false;this._instUid=-1}Pause(){if(this._isPaused||this._isStopped||this.HasEnded())return;const audioElem=this.GetAudioElement();if(!audioElem.paused)audioElem.pause();this._audioDomHandler.RemovePendingPlay(audioElem);this._isPaused=true}Resume(){if(!this._isPaused||this._isStopped||this.HasEnded())return;this._audioDomHandler.TryPlayMedia(this.GetAudioElement());this._isPaused=false}_UpdateMuted(){this.GetAudioElement().muted=this._isMuted||this.IsSilent()}SetLooping(l){l=!!l;if(this._isLooping===
l)return;this._isLooping=l;this.GetAudioElement().loop=l}_UpdatePlaybackRate(){let r=this._playbackRate;if(this._isTimescaled)r*=this._audioDomHandler.GetTimeScale();try{this.GetAudioElement()["playbackRate"]=r}catch(err){console.warn(`[Construct] Unable to set playback rate '${r}':`,err)}}Seek(pos){if(this._isStopped||this.HasEnded())return;try{this.GetAudioElement()["currentTime"]=pos}catch(err){console.warn(`[Construct] Error seeking audio to '${pos}': `,err)}}GetResumePosition(){return this.GetPlaybackTime()}SetSuspended(s){if(s)if(this.IsPlaying()){this.GetAudioElement()["pause"]();
this._resumeMe=true}else this._resumeMe=false;else if(this._resumeMe){this._audioDomHandler.TryPlayMedia(this.GetAudioElement());this._resumeMe=false}}}};
'use strict';{self.C3WebAudioInstance=class C3WebAudioInstance extends self.C3AudioInstance{constructor(audioDomHandler,buffer,tags){super(audioDomHandler,buffer,tags);this._bufferSource=null;this._onended_handler=e=>this._OnEnded(e);this._hasPlaybackEnded=true;this._activeSource=null;this._playStartTime=0;this._playFromSeekPos=0;this._resumePosition=0;this._muteVol=1}Release(){this.Stop();this._ReleaseBufferSource();this._onended_handler=null;super.Release()}_ReleaseBufferSource(){if(this._bufferSource){this._bufferSource["onended"]=
null;this._bufferSource["disconnect"]();this._bufferSource["buffer"]=null}this._bufferSource=null;this._activeSource=null}_OnEnded(e){if(this._isPaused||this._resumeMe)return;if(e.target!==this._activeSource)return;this._hasPlaybackEnded=true;this._isStopped=true;this._instUid=-1;this._ReleaseBufferSource();this._audioDomHandler.PostTrigger("ended",this._tags,this._aiId)}HasEnded(){if(!this._isStopped&&this._bufferSource&&this._bufferSource["loop"])return false;if(this._isPaused)return false;return this._hasPlaybackEnded}CanBeRecycled(){if(!this._bufferSource||
this._isStopped)return true;return this.HasEnded()}GetPlaybackTime(){let ret=0;if(this._isPaused)ret=this._resumePosition;else ret=this._playFromSeekPos+(this.GetCurrentTime()-this._playStartTime)*this._playbackRate;if(!this._isLooping)ret=Math.min(ret,this.GetDuration());return ret}Play(isLooping,vol,seekPos,scheduledTime){this._isMuted=false;this._muteVol=1;this.SetVolume(vol);this._ReleaseBufferSource();this._bufferSource=this.GetAudioContext()["createBufferSource"]();this._bufferSource["buffer"]=
this._buffer.GetAudioBuffer();this._bufferSource["connect"](this._gainNode);this._activeSource=this._bufferSource;this._bufferSource["onended"]=this._onended_handler;this._bufferSource["loop"]=isLooping;this._bufferSource["start"](scheduledTime,seekPos);this._hasPlaybackEnded=false;this._isStopped=false;this._isPaused=false;this._isLooping=isLooping;this._playbackRate=1;this._playStartTime=this.GetCurrentTime();this._playFromSeekPos=seekPos}Stop(){if(this._bufferSource)try{this._bufferSource["stop"](0)}catch(err){}this._isStopped=
true;this._isPaused=false;this._instUid=-1}Pause(){if(this._isPaused||this._isStopped||this.HasEnded())return;this._resumePosition=this.GetPlaybackTime();if(this._isLooping)this._resumePosition%=this.GetDuration();this._isPaused=true;this._bufferSource["stop"](0)}Resume(){if(!this._isPaused||this._isStopped||this.HasEnded())return;this._ReleaseBufferSource();this._bufferSource=this.GetAudioContext()["createBufferSource"]();this._bufferSource["buffer"]=this._buffer.GetAudioBuffer();this._bufferSource["connect"](this._gainNode);
this._activeSource=this._bufferSource;this._bufferSource["onended"]=this._onended_handler;this._bufferSource["loop"]=this._isLooping;this._UpdateVolume();this._UpdatePlaybackRate();this._bufferSource["start"](0,this._resumePosition);this._playStartTime=this.GetCurrentTime();this._playFromSeekPos=this._resumePosition;this._isPaused=false}GetOutputVolume(){return super.GetOutputVolume()*this._muteVol}_UpdateMuted(){this._muteVol=this._isMuted||this.IsSilent()?0:1;this._UpdateVolume()}SetLooping(l){l=
!!l;if(this._isLooping===l)return;this._isLooping=l;if(this._bufferSource)this._bufferSource["loop"]=l}_UpdatePlaybackRate(){let r=this._playbackRate;if(this._isTimescaled)r*=this._audioDomHandler.GetTimeScale();if(this._bufferSource)this._bufferSource["playbackRate"]["value"]=r}Seek(pos){if(this._isStopped||this.HasEnded())return;if(this._isPaused)this._resumePosition=pos;else{this.Pause();this._resumePosition=pos;this.Resume()}}GetResumePosition(){return this._resumePosition}SetSuspended(s){if(s)if(this.IsPlaying()){this._resumeMe=
true;this._resumePosition=this.GetPlaybackTime();if(this._isLooping)this._resumePosition%=this.GetDuration();this._bufferSource["stop"](0)}else this._resumeMe=false;else if(this._resumeMe){this._ReleaseBufferSource();this._bufferSource=this.GetAudioContext()["createBufferSource"]();this._bufferSource["buffer"]=this._buffer.GetAudioBuffer();this._bufferSource["connect"](this._gainNode);this._activeSource=this._bufferSource;this._bufferSource["onended"]=this._onended_handler;this._bufferSource["loop"]=
this._isLooping;this._UpdateVolume();this._UpdatePlaybackRate();this._bufferSource["start"](0,this._resumePosition);this._playStartTime=this.GetCurrentTime();this._playFromSeekPos=this._resumePosition;this._resumeMe=false}}_LoadAdditionalState(d){super._LoadAdditionalState(d);this._resumePosition=d["resumePosition"]}}};
'use strict';{class AudioFXBase{constructor(audioDomHandler){this._audioDomHandler=audioDomHandler;this._audioContext=audioDomHandler.GetAudioContext();this._index=-1;this._tag="";this._type="";this._params=null}Release(){this._audioContext=null}_SetIndex(i){this._index=i}GetIndex(){return this._index}_SetTag(t){this._tag=t}GetTag(){return this._tag}CreateGain(){return this._audioContext["createGain"]()}GetInputNode(){}ConnectTo(node){}SetAudioParam(ap,value,ramp,time){ap["cancelScheduledValues"](0);
if(time===0){ap["value"]=value;return}const curTime=this._audioContext["currentTime"];time+=curTime;switch(ramp){case 0:ap["setValueAtTime"](value,time);break;case 1:ap["setValueAtTime"](ap["value"],curTime);ap["linearRampToValueAtTime"](value,time);break;case 2:ap["setValueAtTime"](ap["value"],curTime);ap["exponentialRampToValueAtTime"](value,time);break}}GetState(){return{"type":this._type,"tag":this._tag,"params":this._params}}}self.C3AudioFilterFX=class C3AudioFilterFX extends AudioFXBase{constructor(audioDomHandler,
type,freq,detune,q,gain,mix){super(audioDomHandler);this._type="filter";this._params=[type,freq,detune,q,gain,mix];this._inputNode=this.CreateGain();this._wetNode=this.CreateGain();this._wetNode["gain"]["value"]=mix;this._dryNode=this.CreateGain();this._dryNode["gain"]["value"]=1-mix;this._filterNode=this._audioContext["createBiquadFilter"]();this._filterNode["type"]=type;this._filterNode["frequency"]["value"]=freq;this._filterNode["detune"]["value"]=detune;this._filterNode["Q"]["value"]=q;this._filterNode["gain"]["vlaue"]=
gain;this._inputNode["connect"](this._filterNode);this._inputNode["connect"](this._dryNode);this._filterNode["connect"](this._wetNode)}Release(){this._inputNode["disconnect"]();this._filterNode["disconnect"]();this._wetNode["disconnect"]();this._dryNode["disconnect"]();super.Release()}ConnectTo(node){this._wetNode["disconnect"]();this._wetNode["connect"](node);this._dryNode["disconnect"]();this._dryNode["connect"](node)}GetInputNode(){return this._inputNode}SetParam(param,value,ramp,time){switch(param){case 0:value=
Math.max(Math.min(value/100,1),0);this._params[5]=value;this.SetAudioParam(this._wetNode["gain"],value,ramp,time);this.SetAudioParam(this._dryNode["gain"],1-value,ramp,time);break;case 1:this._params[1]=value;this.SetAudioParam(this._filterNode["frequency"],value,ramp,time);break;case 2:this._params[2]=value;this.SetAudioParam(this._filterNode["detune"],value,ramp,time);break;case 3:this._params[3]=value;this.SetAudioParam(this._filterNode["Q"],value,ramp,time);break;case 4:this._params[4]=value;
this.SetAudioParam(this._filterNode["gain"],value,ramp,time);break}}};self.C3AudioDelayFX=class C3AudioDelayFX extends AudioFXBase{constructor(audioDomHandler,delayTime,delayGain,mix){super(audioDomHandler);this._type="delay";this._params=[delayTime,delayGain,mix];this._inputNode=this.CreateGain();this._wetNode=this.CreateGain();this._wetNode["gain"]["value"]=mix;this._dryNode=this.CreateGain();this._dryNode["gain"]["value"]=1-mix;this._mainNode=this.CreateGain();this._delayNode=this._audioContext["createDelay"](delayTime);
this._delayNode["delayTime"]["value"]=delayTime;this._delayGainNode=this.CreateGain();this._delayGainNode["gain"]["value"]=delayGain;this._inputNode["connect"](this._mainNode);this._inputNode["connect"](this._dryNode);this._mainNode["connect"](this._wetNode);this._mainNode["connect"](this._delayNode);this._delayNode["connect"](this._delayGainNode);this._delayGainNode["connect"](this._mainNode)}Release(){this._inputNode["disconnect"]();this._wetNode["disconnect"]();this._dryNode["disconnect"]();this._mainNode["disconnect"]();
this._delayNode["disconnect"]();this._delayGainNode["disconnect"]();super.Release()}ConnectTo(node){this._wetNode["disconnect"]();this._wetNode["connect"](node);this._dryNode["disconnect"]();this._dryNode["connect"](node)}GetInputNode(){return this._inputNode}SetParam(param,value,ramp,time){const DbToLinear=self.AudioDOMHandler.DbToLinear;switch(param){case 0:value=Math.max(Math.min(value/100,1),0);this._params[2]=value;this.SetAudioParam(this._wetNode["gain"],value,ramp,time);this.SetAudioParam(this._dryNode["gain"],
1-value,ramp,time);break;case 4:this._params[1]=DbToLinear(value);this.SetAudioParam(this._delayGainNode["gain"],DbToLinear(value),ramp,time);break;case 5:this._params[0]=value;this.SetAudioParam(this._delayNode["delayTime"],value,ramp,time);break}}};self.C3AudioConvolveFX=class C3AudioConvolveFX extends AudioFXBase{constructor(audioDomHandler,buffer,normalize,mix){super(audioDomHandler);this._type="convolution";this._params=[normalize,mix];this._bufferOriginalUrl="";this._bufferUrl="";this._bufferType=
"";this._inputNode=this.CreateGain();this._wetNode=this.CreateGain();this._wetNode["gain"]["value"]=mix;this._dryNode=this.CreateGain();this._dryNode["gain"]["value"]=1-mix;this._convolveNode=this._audioContext["createConvolver"]();this._convolveNode["normalize"]=normalize;this._convolveNode["buffer"]=buffer;this._inputNode["connect"](this._convolveNode);this._inputNode["connect"](this._dryNode);this._convolveNode["connect"](this._wetNode)}Release(){this._inputNode["disconnect"]();this._convolveNode["disconnect"]();
this._wetNode["disconnect"]();this._dryNode["disconnect"]();super.Release()}ConnectTo(node){this._wetNode["disconnect"]();this._wetNode["connect"](node);this._dryNode["disconnect"]();this._dryNode["connect"](node)}GetInputNode(){return this._inputNode}SetParam(param,value,ramp,time){switch(param){case 0:value=Math.max(Math.min(value/100,1),0);this._params[1]=value;this.SetAudioParam(this._wetNode["gain"],value,ramp,time);this.SetAudioParam(this._dryNode["gain"],1-value,ramp,time);break}}_SetBufferInfo(bufferOriginalUrl,
bufferUrl,bufferType){this._bufferOriginalUrl=bufferOriginalUrl;this._bufferUrl=bufferUrl;this._bufferType=bufferType}GetState(){const ret=super.GetState();ret["bufferOriginalUrl"]=this._bufferOriginalUrl;ret["bufferUrl"]="";ret["bufferType"]=this._bufferType;return ret}};self.C3AudioFlangerFX=class C3AudioFlangerFX extends AudioFXBase{constructor(audioDomHandler,delay,modulation,freq,feedback,mix){super(audioDomHandler);this._type="flanger";this._params=[delay,modulation,freq,feedback,mix];this._inputNode=
this.CreateGain();this._dryNode=this.CreateGain();this._dryNode["gain"]["value"]=1-mix/2;this._wetNode=this.CreateGain();this._wetNode["gain"]["value"]=mix/2;this._feedbackNode=this.CreateGain();this._feedbackNode["gain"]["value"]=feedback;this._delayNode=this._audioContext["createDelay"](delay+modulation);this._delayNode["delayTime"]["value"]=delay;this._oscNode=this._audioContext["createOscillator"]();this._oscNode["frequency"]["value"]=freq;this._oscGainNode=this.CreateGain();this._oscGainNode["gain"]["value"]=
modulation;this._inputNode["connect"](this._delayNode);this._inputNode["connect"](this._dryNode);this._delayNode["connect"](this._wetNode);this._delayNode["connect"](this._feedbackNode);this._feedbackNode["connect"](this._delayNode);this._oscNode["connect"](this._oscGainNode);this._oscGainNode["connect"](this._delayNode["delayTime"]);this._oscNode["start"](0)}Release(){this._oscNode["stop"](0);this._inputNode["disconnect"]();this._delayNode["disconnect"]();this._oscNode["disconnect"]();this._oscGainNode["disconnect"]();
this._dryNode["disconnect"]();this._wetNode["disconnect"]();this._feedbackNode["disconnect"]();super.Release()}ConnectTo(node){this._wetNode["disconnect"]();this._wetNode["connect"](node);this._dryNode["disconnect"]();this._dryNode["connect"](node)}GetInputNode(){return this._inputNode}SetParam(param,value,ramp,time){switch(param){case 0:value=Math.max(Math.min(value/100,1),0);this._params[4]=value;this.SetAudioParam(this._wetNode["gain"],value/2,ramp,time);this.SetAudioParam(this._dryNode["gain"],
1-value/2,ramp,time);break;case 6:this._params[1]=value/1E3;this.SetAudioParam(this._oscGainNode["gain"],value/1E3,ramp,time);break;case 7:this._params[2]=value;this.SetAudioParam(this._oscNode["frequency"],value,ramp,time);break;case 8:this._params[3]=value/100;this.SetAudioParam(this._feedbackNode["gain"],value/100,ramp,time);break}}};self.C3AudioPhaserFX=class C3AudioPhaserFX extends AudioFXBase{constructor(audioDomHandler,freq,detune,q,modulation,modfreq,mix){super(audioDomHandler);this._type=
"phaser";this._params=[freq,detune,q,modulation,modfreq,mix];this._inputNode=this.CreateGain();this._dryNode=this.CreateGain();this._dryNode["gain"]["value"]=1-mix/2;this._wetNode=this.CreateGain();this._wetNode["gain"]["value"]=mix/2;this._filterNode=this._audioContext["createBiquadFilter"]();this._filterNode["type"]="allpass";this._filterNode["frequency"]["value"]=freq;this._filterNode["detune"]["value"]=detune;this._filterNode["Q"]["value"]=q;this._oscNode=this._audioContext["createOscillator"]();
this._oscNode["frequency"]["value"]=modfreq;this._oscGainNode=this.CreateGain();this._oscGainNode["gain"]["value"]=modulation;this._inputNode["connect"](this._filterNode);this._inputNode["connect"](this._dryNode);this._filterNode["connect"](this._wetNode);this._oscNode["connect"](this._oscGainNode);this._oscGainNode["connect"](this._filterNode["frequency"]);this._oscNode["start"](0)}Release(){this._oscNode["stop"](0);this._inputNode["disconnect"]();this._filterNode["disconnect"]();this._oscNode["disconnect"]();
this._oscGainNode["disconnect"]();this._dryNode["disconnect"]();this._wetNode["disconnect"]();super.Release()}ConnectTo(node){this._wetNode["disconnect"]();this._wetNode["connect"](node);this._dryNode["disconnect"]();this._dryNode["connect"](node)}GetInputNode(){return this._inputNode}SetParam(param,value,ramp,time){switch(param){case 0:value=Math.max(Math.min(value/100,1),0);this._params[5]=value;this.SetAudioParam(this._wetNode["gain"],value/2,ramp,time);this.SetAudioParam(this._dryNode["gain"],
1-value/2,ramp,time);break;case 1:this._params[0]=value;this.SetAudioParam(this._filterNode["frequency"],value,ramp,time);break;case 2:this._params[1]=value;this.SetAudioParam(this._filterNode["detune"],value,ramp,time);break;case 3:this._params[2]=value;this.SetAudioParam(this._filterNode["Q"],value,ramp,time);break;case 6:this._params[3]=value;this.SetAudioParam(this._oscGainNode["gain"],value,ramp,time);break;case 7:this._params[4]=value;this.SetAudioParam(this._oscNode["frequency"],value,ramp,
time);break}}};self.C3AudioGainFX=class C3AudioGainFX extends AudioFXBase{constructor(audioDomHandler,g){super(audioDomHandler);this._type="gain";this._params=[g];this._node=this.CreateGain();this._node["gain"]["value"]=g}Release(){this._node["disconnect"]();super.Release()}ConnectTo(node){this._node["disconnect"]();this._node["connect"](node)}GetInputNode(){return this._node}SetParam(param,value,ramp,time){const DbToLinear=self.AudioDOMHandler.DbToLinear;switch(param){case 4:this._params[0]=DbToLinear(value);
this.SetAudioParam(this._node["gain"],DbToLinear(value),ramp,time);break}}};self.C3AudioStereoPanFX=class C3AudioStereoPanFX extends AudioFXBase{constructor(audioDomHandler,p){super(audioDomHandler);this._type="stereopan";this._params=[p];this._node=this._audioContext["createStereoPanner"]();this._node["pan"]["value"]=p}Release(){this._node["disconnect"]();super.Release()}ConnectTo(node){this._node["disconnect"]();this._node["connect"](node)}GetInputNode(){return this._node}SetParam(param,value,ramp,
time){value=Math.min(Math.max(value/100,-1),1);switch(param){case 9:this._params[0]=value;this.SetAudioParam(this._node["pan"],value,ramp,time);break}}};self.C3AudioTremoloFX=class C3AudioTremoloFX extends AudioFXBase{constructor(audioDomHandler,freq,mix){super(audioDomHandler);this._type="tremolo";this._params=[freq,mix];this._node=this.CreateGain();this._node["gain"]["value"]=1-mix/2;this._oscNode=this._audioContext["createOscillator"]();this._oscNode["frequency"]["value"]=freq;this._oscGainNode=
this.CreateGain();this._oscGainNode["gain"]["value"]=mix/2;this._oscNode["connect"](this._oscGainNode);this._oscGainNode["connect"](this._node["gain"]);this._oscNode["start"](0)}Release(){this._oscNode["stop"](0);this._oscNode["disconnect"]();this._oscGainNode["disconnect"]();this._node["disconnect"]();super.Release()}ConnectTo(node){this._node["disconnect"]();this._node["connect"](node)}GetInputNode(){return this._node}SetParam(param,value,ramp,time){switch(param){case 0:value=Math.max(Math.min(value/
100,1),0);this._params[1]=value;this.SetAudioParam(this._node["gain"],1-value/2,ramp,time);this.SetAudioParam(this._oscGainNode["gain"],value/2,ramp,time);break;case 7:this._params[0]=value;this.SetAudioParam(this._oscNode["frequency"],value,ramp,time);break}}};self.C3AudioRingModFX=class C3AudioRingModFX extends AudioFXBase{constructor(audioDomHandler,freq,mix){super(audioDomHandler);this._type="ringmod";this._params=[freq,mix];this._inputNode=this.CreateGain();this._wetNode=this.CreateGain();this._wetNode["gain"]["value"]=
mix;this._dryNode=this.CreateGain();this._dryNode["gain"]["value"]=1-mix;this._ringNode=this.CreateGain();this._ringNode["gain"]["value"]=0;this._oscNode=this._audioContext["createOscillator"]();this._oscNode["frequency"]["value"]=freq;this._oscNode["connect"](this._ringNode["gain"]);this._oscNode["start"](0);this._inputNode["connect"](this._ringNode);this._inputNode["connect"](this._dryNode);this._ringNode["connect"](this._wetNode)}Release(){this._oscNode["stop"](0);this._oscNode["disconnect"]();
this._ringNode["disconnect"]();this._inputNode["disconnect"]();this._wetNode["disconnect"]();this._dryNode["disconnect"]();super.Release()}ConnectTo(node){this._wetNode["disconnect"]();this._wetNode["connect"](node);this._dryNode["disconnect"]();this._dryNode["connect"](node)}GetInputNode(){return this._inputNode}SetParam(param,value,ramp,time){switch(param){case 0:value=Math.max(Math.min(value/100,1),0);this._params[1]=value;this.SetAudioParam(this._wetNode["gain"],value,ramp,time);this.SetAudioParam(this._dryNode["gain"],
1-value,ramp,time);break;case 7:this._params[0]=value;this.SetAudioParam(this._oscNode["frequency"],value,ramp,time);break}}};self.C3AudioDistortionFX=class C3AudioDistortionFX extends AudioFXBase{constructor(audioDomHandler,threshold,headroom,drive,makeupgain,mix){super(audioDomHandler);this._type="distortion";this._params=[threshold,headroom,drive,makeupgain,mix];this._inputNode=this.CreateGain();this._preGain=this.CreateGain();this._postGain=this.CreateGain();this._SetDrive(drive,makeupgain);this._wetNode=
this.CreateGain();this._wetNode["gain"]["value"]=mix;this._dryNode=this.CreateGain();this._dryNode["gain"]["value"]=1-mix;this._waveShaper=this._audioContext["createWaveShaper"]();this._curve=new Float32Array(65536);this._GenerateColortouchCurve(threshold,headroom);this._waveShaper.curve=this._curve;this._inputNode["connect"](this._preGain);this._inputNode["connect"](this._dryNode);this._preGain["connect"](this._waveShaper);this._waveShaper["connect"](this._postGain);this._postGain["connect"](this._wetNode)}Release(){this._inputNode["disconnect"]();
this._preGain["disconnect"]();this._waveShaper["disconnect"]();this._postGain["disconnect"]();this._wetNode["disconnect"]();this._dryNode["disconnect"]();super.Release()}_SetDrive(drive,makeupgain){if(drive<.01)drive=.01;this._preGain["gain"]["value"]=drive;this._postGain["gain"]["value"]=Math.pow(1/drive,.6)*makeupgain}_GenerateColortouchCurve(threshold,headroom){const n=65536;const n2=n/2;for(let i=0;i<n2;++i){let x=i/n2;x=this._Shape(x,threshold,headroom);this._curve[n2+i]=x;this._curve[n2-i-1]=
-x}}_Shape(x,threshold,headroom){const maximum=1.05*headroom*threshold;const kk=maximum-threshold;const sign=x<0?-1:+1;const absx=x<0?-x:x;let shapedInput=absx<threshold?absx:threshold+kk*self.AudioDOMHandler.e4(absx-threshold,1/kk);shapedInput*=sign;return shapedInput}ConnectTo(node){this._wetNode["disconnect"]();this._wetNode["connect"](node);this._dryNode["disconnect"]();this._dryNode["connect"](node)}GetInputNode(){return this._inputNode}SetParam(param,value,ramp,time){switch(param){case 0:value=
Math.max(Math.min(value/100,1),0);this._params[4]=value;this.SetAudioParam(this._wetNode["gain"],value,ramp,time);this.SetAudioParam(this._dryNode["gain"],1-value,ramp,time);break}}};self.C3AudioCompressorFX=class C3AudioCompressorFX extends AudioFXBase{constructor(audioDomHandler,threshold,knee,ratio,attack,release){super(audioDomHandler);this._type="compressor";this._params=[threshold,knee,ratio,attack,release];this._node=this._audioContext["createDynamicsCompressor"]();this._node["threshold"]["value"]=
threshold;this._node["knee"]["value"]=knee;this._node["ratio"]["value"]=ratio;this._node["attack"]["value"]=attack;this._node["release"]["value"]=release}Release(){this._node["disconnect"]();super.Release()}ConnectTo(node){this._node["disconnect"]();this._node["connect"](node)}GetInputNode(){return this._node}SetParam(param,value,ramp,time){}};self.C3AudioAnalyserFX=class C3AudioAnalyserFX extends AudioFXBase{constructor(audioDomHandler,fftSize,smoothing){super(audioDomHandler);this._type="analyser";
this._params=[fftSize,smoothing];this._node=this._audioContext["createAnalyser"]();this._node["fftSize"]=fftSize;this._node["smoothingTimeConstant"]=smoothing;this._freqBins=new Float32Array(this._node["frequencyBinCount"]);this._signal=new Uint8Array(fftSize);this._peak=0;this._rms=0;this._audioDomHandler._AddAnalyser(this)}Release(){this._audioDomHandler._RemoveAnalyser(this);this._node["disconnect"]();super.Release()}Tick(){this._node["getFloatFrequencyData"](this._freqBins);this._node["getByteTimeDomainData"](this._signal);
const fftSize=this._node["fftSize"];this._peak=0;let rmsSquaredSum=0;for(let i=0;i<fftSize;++i){let s=(this._signal[i]-128)/128;if(s<0)s=-s;if(this._peak<s)this._peak=s;rmsSquaredSum+=s*s}const LinearToDb=self.AudioDOMHandler.LinearToDb;this._peak=LinearToDb(this._peak);this._rms=LinearToDb(Math.sqrt(rmsSquaredSum/fftSize))}ConnectTo(node){this._node["disconnect"]();this._node["connect"](node)}GetInputNode(){return this._node}SetParam(param,value,ramp,time){}GetData(){return{"tag":this.GetTag(),"index":this.GetIndex(),
"peak":this._peak,"rms":this._rms,"binCount":this._node["frequencyBinCount"],"freqBins":this._freqBins}}}};
'use strict';{const DOM_COMPONENT_ID="text-input";function StopPropagation(e){e.stopPropagation()}function StopKeyPropagation(e){if(e.which!==13&&e.which!==27)e.stopPropagation()}const HANDLER_CLASS=class TextInputDOMHandler extends self.DOMElementHandler{constructor(iRuntime){super(iRuntime,DOM_COMPONENT_ID);this.AddDOMElementMessageHandler("scroll-to-bottom",elem=>this._OnScrollToBottom(elem))}CreateElement(elementId,e){let elem;const type=e["type"];if(type==="textarea"){elem=document.createElement("textarea");
elem.style.resize="none"}else{elem=document.createElement("input");elem.type=type}elem.style.position="absolute";elem.autocomplete="off";elem.addEventListener("pointerdown",StopPropagation);elem.addEventListener("pointermove",StopPropagation);elem.addEventListener("pointerrawupdate",StopPropagation);elem.addEventListener("pointerup",StopPropagation);elem.addEventListener("mousedown",StopPropagation);elem.addEventListener("mouseup",StopPropagation);elem.addEventListener("keydown",StopKeyPropagation);
elem.addEventListener("keyup",StopKeyPropagation);elem.addEventListener("click",e=>{e.stopPropagation();this._PostToRuntimeElementMaybeSync("click",elementId)});elem.addEventListener("dblclick",e=>{e.stopPropagation();this._PostToRuntimeElementMaybeSync("dblclick",elementId)});elem.addEventListener("input",()=>this.PostToRuntimeElement("change",elementId,{"text":elem.value}));if(e["id"])elem.id=e["id"];if(e["className"])elem.className=e["className"];this.UpdateState(elem,e);return elem}UpdateState(elem,
e){elem.value=e["text"];elem.placeholder=e["placeholder"];elem.title=e["title"];elem.disabled=!e["isEnabled"];elem.readOnly=e["isReadOnly"];elem.spellcheck=e["spellCheck"];const maxLength=e["maxLength"];if(maxLength<0)elem.removeAttribute("maxlength");else elem.setAttribute("maxlength",maxLength)}_OnScrollToBottom(elem){elem.scrollTop=elem.scrollHeight}};self.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS)};
"use strict";
{
    const DOM_COMPONENT_ID = "sparsha_firebase_auth";
    function StopPropagation(e) {
        e.stopPropagation();
    }
    const HANDLER_CLASS = class MyDOMHandler extends self.DOMHandler {
        constructor(iRuntime) {
            super(iRuntime, DOM_COMPONENT_ID);
            var self = this;

            async function DoAsync(e) {
                var RESULT = {
                    success: 0,
                };

                var firebase = globalThis.sparshaFirebase;
                var auth = firebase.myAuth[e.sdkName];

                if (e.action === "Signupemail" || e.action === "Signinemail" || e.action === "Signupname" || e.action === "Signinname") {
                    var signFunc = "", theEmail = "";
                    if (e.action === "Signupemail" || e.action === "Signupname") signFunc = "createUserWithEmailAndPassword";
                    else signFunc = "signInWithEmailAndPassword";
                    if (e.action === "Signupname" || e.action === "Signinname") theEmail = e.username.replace(/ /g, '') + "@" + e.domain;
                    else theEmail = e.email;

                    firebase._LoginByEvent[e.sdkName] = 1;

                    await firebase.auth[signFunc](auth, theEmail, e.password).then((userCredential) => {
                        var cred = new firebase.auth.EmailAuthCredential(theEmail, e.password, "password");

                        var authMapRes = firebase._GetAuthMapData(userCredential.user, e.sdkName);
                        RESULT.userBasic = authMapRes.authExpBasic;
                        RESULT.userPro = authMapRes.authExpPro;

                        RESULT.cred = JSON.stringify(cred);
                        RESULT.success = 1;
                    }).catch((error) => {
                        firebase._LoginByEvent[e.sdkName] = 0;

                        RESULT.success = 0;
                        RESULT.errorCode = error.code;
                        RESULT.errorMessage = error.message;
                    })
                    if (e.action === "Signupname" && RESULT.success) {
                        await firebase.auth.updateProfile(firebase._res[e.sdkName].user, { displayName: e.username }).then(() => {
                            RESULT.nameChange = 1;
                        }).catch((error) => {
                            RESULT.nameChange = 0;
                            RESULT.errorCode = error.code;
                            RESULT.errorMessage = error.message;
                        });
                    }
                }
                else if (e.action === "VerifyEmail") {
                    await firebase.auth.sendEmailVerification(firebase._res[e.sdkName].user).then(() => {
                        RESULT.success = 1;
                    }).catch((error) => {
                        RESULT.success = 0;
                        RESULT.errorCode = error.code;
                        RESULT.errorMessage = error.message;
                    })
                }
                else if (e.action === "UpdateEmail") {
                    await firebase.auth.updateEmail(firebase._res[e.sdkName].user, e.newEmail).then(() => {
                        RESULT.success = 1;
                    }).catch((error) => {
                        RESULT.success = 0;
                        RESULT.errorCode = error.code;
                        RESULT.errorMessage = error.message;
                    });
                }
                else if (e.action === "ResetPassword") {
                    await firebase.auth.sendPasswordResetEmail(auth, e.email).then(() => {
                        RESULT.success = 1;
                    }).catch((error) => {
                        RESULT.success = 0;
                        RESULT.errorCode = error.code;
                        RESULT.errorMessage = error.message;
                    });
                }
                else if (e.action === "UpdatePassword") {
                    await firebase.auth.updatePassword(firebase._res[e.sdkName].user, e.password).then(() => {
                        RESULT.success = 1;
                    }).catch((error) => {
                        RESULT.success = 0;
                        RESULT.errorCode = error.code;
                        RESULT.errorMessage = error.message;
                    });
                }
                else if (e.action === "RenderRecaptcha") {

                    var reCaptchaObj = document.getElementById("SparshaFirebaseCaptcha");
                    if (reCaptchaObj === null) {
                        reCaptchaObj = document.createElement("BUTTON");
                        reCaptchaObj.display = "none";
                        reCaptchaObj.id = "SparshaFirebaseCaptcha";
                        document.body.appendChild(reCaptchaObj);
                    }
                    firebase._CaptchaVerifier = new firebase.auth.RecaptchaVerifier('SparshaFirebaseCaptcha', {
                        'size': 'invisible',
                        'theme': e.theme
                    }, auth);
                    await firebase._CaptchaVerifier.render().then((widgetId) => {
                        firebase._RecaptchaWidgetId = widgetId; //only for reCAPTCHA API Calls
                        RESULT.success = 1;
                    }).catch((error) => {
                        RESULT.success = 0;
                        RESULT.errorCode = error.code;
                        RESULT.errorMessage = error.message;
                    });

                }
                else if (e.action === "SendPhoneNumber") {
                    await firebase.auth.signInWithPhoneNumber(auth, e.phoneNumber, firebase._CaptchaVerifier).then((confirmationResult) => {
                        firebase._ConfirmationResult = confirmationResult;
                        RESULT.success = 1;
                    }).catch((error) => {
                        RESULT.success = 0;
                        RESULT.errorCode = error.code;
                        RESULT.errorMessage = error.message;
                    });
                }
                else if (e.action === "SubmitOtp") {
                    firebase._LoginByEvent[e.sdkName] = 1;
                    await firebase._ConfirmationResult.confirm(e.otp).then((result) => {
                        RESULT.isNewUser = firebase.auth.getAdditionalUserInfo(result).isNewUser;
                        RESULT.cred = firebase.auth.PhoneAuthProvider.credential(firebase._ConfirmationResult.verificationId, e.otp);
                        var authMapRes = firebase._GetAuthMapData(result.user, e.sdkName);
                        RESULT.userBasic = authMapRes.authExpBasic;
                        RESULT.userPro = authMapRes.authExpPro;
                        RESULT.cred = JSON.stringify(RESULT.cred);
                        RESULT.success = 1;
                    }).catch((error) => {
                        firebase._LoginByEvent[e.sdkName] = 0;
                        RESULT.success = 0;
                        RESULT.errorCode = error.code;
                        RESULT.errorMessage = error.message;
                    });
                }
                else if (e.action === "SignOut") {
                    await firebase.auth.signOut(auth).then(() => {
                        RESULT.success = 1;
                    }).catch((error) => {
                        RESULT.success = 0;
                        RESULT.errorCode = error.code;
                        RESULT.errorMessage = error.message;
                    });
                    if (typeof window.cordova !== "undefined") {
                        if (typeof window.cordova.plugins !== "undefined") {
                            if (typeof window.cordova.plugins.firebase !== "undefined") await window.cordova.plugins.firebase.auth.signOut();
                        }
                    }
                    if (typeof window.plugins !== "undefined") {
                        if (typeof window.plugins.googleplus !== "undefined") await window.plugins.googleplus.logout();
                    }
                    if (typeof window.facebookConnectPlugin !== "undefined") await window.facebookConnectPlugin.logout();
                }
                else if (e.action === "UpdateUsername") {
                    await firebase.auth.updateProfile(firebase._res[e.sdkName].user, e.updateProfOb).then(() => {
                        RESULT.success = 1;
                    }).catch((error) => {
                        RESULT.success = 0;
                        RESULT.errorCode = error.code;
                        RESULT.errorMessage = error.message;
                    });
                }
                else if (e.action === "DeleteUser") {
                    await firebase.auth.deleteUser(firebase._res[e.sdkName].user).then(() => {
                        RESULT.success = 1;
                    }).catch((error) => {
                        RESULT.success = 0;
                        RESULT.errorCode = error.code;
                        RESULT.errorMessage = error.message;
                    });
                }
                else if (e.action === "PopupOauth") {
                    firebase._LoginByEvent[e.sdkName] = 1;
                    var provider;
                    if (e.providerNo === 0) {
                        provider = new firebase.auth.GoogleAuthProvider();
                        if(e.googlePromptSelect){
                        	provider["setCustomParameters"]({
  								"prompt": "select_account",
							});
                        }
                    }
                    else if (e.providerNo === 1) provider = new firebase.auth.FacebookAuthProvider();
                    else if (e.providerNo === 2) provider = new firebase.auth.OAuthProvider('apple.com');
                    else if (e.providerNo === 3) provider = new firebase.auth.TwitterAuthProvider();
                    else if (e.providerNo === 4) provider = new firebase.auth.GithubAuthProvider();
                    else if (e.providerNo === 5) provider = new firebase.auth.OAuthProvider('microsoft.com');
                    else if (e.providerNo === 6) provider = new firebase.auth.OAuthProvider('yahoo.com');

                    var authResult;
                    await firebase.auth.signInWithPopup(auth, provider).then((result) => {
                        RESULT.isNewUser = firebase.auth.getAdditionalUserInfo(result).isNewUser;
                        authResult = result;
                        var authMapRes = firebase._GetAuthMapData(result.user, e.sdkName);
                        RESULT.userBasic = authMapRes.authExpBasic;
                        RESULT.userPro = authMapRes.authExpPro;

                        if (e.providerNo === 0) RESULT.cred = firebase.auth.GoogleAuthProvider.credentialFromResult(result);
                        else if (e.providerNo === 2) RESULT.cred = firebase.auth.OAuthProvider.credentialFromResult(result);
                        else if (e.providerNo === 3) RESULT.cred = firebase.auth.TwitterAuthProvider.credentialFromResult(result);
                        else if (e.providerNo === 4) RESULT.cred = firebase.auth.GithubAuthProvider.credentialFromResult(result);
                        else if (e.providerNo >= 5) RESULT.cred = firebase.auth.OAuthProvider.credentialFromResult(result);
                        RESULT.cred = JSON.stringify(RESULT.cred);
                        RESULT.success = 1;
                    }).catch((error) => {
                        firebase._LoginByEvent[e.sdkName] = 0;
                        RESULT.success = 0;
                        RESULT.errorCode = error.code;
                        RESULT.errorMessage = error.message;
                        //const email = error.email;
                        //const credential = FacebookAuthProvider.credentialFromError(error);
                    });
                    if (e.providerNo === 1 && RESULT.success === 1) {
                        RESULT.cred = firebase.auth.FacebookAuthProvider.credentialFromResult(authResult);

                        var user = authResult.user;
                        var newPic = user.photoURL.split('?')[0] + "?access_token=" + RESULT.cred.accessToken;
                        RESULT.cred = JSON.stringify(RESULT.cred);

                        await firebase.auth.updateProfile(firebase._res[e.sdkName].user, { photoURL: newPic }).then(() => {
                            RESULT.picChange = 1;
                            RESULT.newPicUrl = newPic;
                        }).catch((error) => {
                            RESULT.picChange = 0;
                            RESULT.errorCode = error.code;
                            RESULT.errorMessage = error.message;
                        });
                    }

                }

                return RESULT;
            }

            function DoSync(e) {
                if (e.action === "RemoveRecaptcha") {
                    var style = document.createElement('style');
                    style.innerHTML = ".grecaptcha-badge{visibility: hidden;}"
                    document.head.appendChild(style);
                }
                else if (e.action === "PopupOauthSafe") {
                    var RESULT = e;
                    RESULT.success=0;
                    var firebase = globalThis.sparshaFirebase;
                    var auth = firebase.myAuth[e.sdkName];

                    window.document.getElementById(e.buttonId).onclick = function() {PopupOauthSafe_Func()};

                    function PopupOauthSafe_Func() {
                        var provider;
                        if (e.providerNo === 0) {
                        	provider = new firebase.auth.GoogleAuthProvider();
                        	if(e.googlePromptSelect){
                        		provider["setCustomParameters"]({
  									"prompt": "select_account",
								});
                        	}
                        }
                        else if (e.providerNo === 1) provider = new firebase.auth.FacebookAuthProvider();
                        else if (e.providerNo === 2) provider = new firebase.auth.OAuthProvider('apple.com');
                        else if (e.providerNo === 3) provider = new firebase.auth.TwitterAuthProvider();
                        else if (e.providerNo === 4) provider = new firebase.auth.GithubAuthProvider();
                        else if (e.providerNo === 5) provider = new firebase.auth.OAuthProvider('microsoft.com');
                        else if (e.providerNo === 6) provider = new firebase.auth.OAuthProvider('yahoo.com');

                        var authResult;
                        firebase.auth.signInWithPopup(auth, provider).then((result) => {
                            RESULT.isNewUser = firebase.auth.getAdditionalUserInfo(result).isNewUser;
                            authResult = result;
                            var authMapRes = firebase._GetAuthMapData(result.user, e.sdkName);
                            RESULT.userBasic = authMapRes.authExpBasic;
                            RESULT.userPro = authMapRes.authExpPro;
                            RESULT.success = 1;
                            if (e.providerNo === 0) RESULT.cred = firebase.auth.GoogleAuthProvider.credentialFromResult(result);
                            else if (e.providerNo === 1) {
                                RESULT.cred = firebase.auth.FacebookAuthProvider.credentialFromResult(authResult);

                                var user = authResult.user;
                                var newPic = user.photoURL.split('?')[0] + "?access_token=" + RESULT.cred.accessToken;
                                RESULT.cred = JSON.stringify(RESULT.cred);

                                firebase.auth.updateProfile(firebase._res[e.sdkName].user, { photoURL: newPic }).then(() => {
                                    RESULT.picChange = 1;
                                    RESULT.newPicUrl = newPic;
                                    self.PostToRuntime("run_sparsha_fAuthBasic" + e.plugin_uid, RESULT);
                                }).catch((error) => {
                                    RESULT.picChange = 0;
                                    RESULT.errorCode = error.code;
                                    RESULT.errorMessage = error.message;
                                    self.PostToRuntime("run_sparsha_fAuthBasic" + e.plugin_uid, RESULT);
                                });
                            }
                            else if (e.providerNo === 2) RESULT.cred = firebase.auth.OAuthProvider.credentialFromResult(result);
                            else if (e.providerNo === 3) RESULT.cred = firebase.auth.TwitterAuthProvider.credentialFromResult(result);
                            else if (e.providerNo === 4) RESULT.cred = firebase.auth.GithubAuthProvider.credentialFromResult(result);
                            else if (e.providerNo >= 5) RESULT.cred = firebase.auth.OAuthProvider.credentialFromResult(result);
                            RESULT.cred = JSON.stringify(RESULT.cred);
                            self.PostToRuntime("run_sparsha_fAuthBasic" + e.plugin_uid, RESULT);
                        }).catch((error) => {
                            RESULT.success = 0;
                            RESULT.errorCode = error.code;
                            RESULT.errorMessage = error.message;
                            self.PostToRuntime("run_sparsha_fAuthBasic" + e.plugin_uid, RESULT);
                            //const email = error.email;
                            //const credential = FacebookAuthProvider.credentialFromError(error);
                        });
                    }

                }
            }

            this.AddRuntimeMessageHandler("domSync_sparsha_fAuth", DoSync);
            this.AddRuntimeMessageHandler("domAsync_sparsha_fAuth", DoAsync);
        }
    };
    self.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS);
}"use strict";
{
    const DOM_COMPONENT_ID = "sparsha_firebase_database";
    function StopPropagation(e) {
        e.stopPropagation();
    }
    const HANDLER_CLASS = class MyDOMHandler extends self.DOMHandler {
        constructor(iRuntime) {
            super(iRuntime, DOM_COMPONENT_ID);
            var self = this;

            async function DoAsync(e) {
                var Result = {
                    success: 0,
                };

                var firebase = globalThis.sparshaFirebase;
                var db = firebase.myDatabase[e.sdkName];

                if (e.action === "AdvancedWriteData") {
                    await firebase.database.set(firebase.database.ref(db, e.locationLink + '/'), e.data).then(function () {
                        Result.success = 1;
                    }).catch(function (error) {
                        Result.success = 0;
                        Result.errorCode = error.code;
                        Result.errorMessage = error.message;
                    });
                }

                else if (e.action === "AdvancedReadData" || e.action === "SimpleReadData") {
                    var paraType = "";
                    var DataNew = {
                        valueOLD: "",
                        Val: "",
                        JSON: "{}",
                        PROUI: "{}",
                        ARRAY: "{}",
                    };

                    var dataRef = firebase.database.query(firebase.database.ref(db, e.locationLink));

                    await FirebaseGetRead();

                    function FirebaseGetRead() {
                        return new Promise((resolve) => {
                            if (e.sync) {
                                firebase.database.onValue(dataRef, (snapshot) => {
                                    UpdateReadData(snapshot);

                                    Result.action = e.action;
                                    Result.id = e.id;
                                    Result.locationLink = e.locationLink;
                                    self.PostToRuntime("on_complete" + e.uid, Result);

                                    resolve()
                                })
                            }
                            else {
                                firebase.database.onValue(dataRef, (snapshot) => {
                                    UpdateReadData(snapshot);
                                    resolve()
                                }, {
                                    onlyOnce: true
                                })
                            }
                        });
                    }

                    function UpdateReadData(snap) {
                        if (snap["exists"]()) {
                            if (typeof snap["val"]() === 'object') {
                                DataNew.Val = "[object Object]";
                                if (e.readJSON) {
                                    DataNew.valueOLD = JSON.stringify(snap.toJSON());
                                    DataNew.JSON = DataNew.valueOLD;
                                }
                                if (e.readArray) {
                                    DataNew.ARRAY = JSON.stringify(snap["val"]());
                                }
                                if (e.readProui) {
                                    var arr = [];
                                    var snapOb = snap.toJSON();
                                    Object["keys"](snapOb).forEach(function (k) {
                                        snapOb[k]["~parentNode"] = k;
                                        arr.push(snapOb[k]);
                                    });
                                    DataNew.valueOLD = JSON.stringify(arr)
                                    DataNew.PROUI = DataNew.valueOLD;
                                }
                            }
                            else {
                                DataNew.valueOLD = snap["val"]();
                                DataNew.Val = DataNew.valueOLD;
                            }
                            paraType = "read";
                        }
                        else paraType = "noExist";

                        Result.success = 1;
                        Result.DataNew = DataNew;
                        Result.paraType = paraType;
                    }
                }

                else if (e.action === "AdvancedReadLeaderboard" || e.action === "SimpleReadLeaderboard") {
                    Result.Read_C = {};
                    Result.myReadJSON = "{}";
                    Result.myReadPROUI = "{}";
                    Result.myReadARRAY = "{}";
                    Result.Rank_C = 0;

                    var paraType = "";
                    var iLoop = 0;
                    var rankCount = 0;

                    var dataRef = firebase.database.query(firebase.database.ref(db, e.locationLink), firebase.database.orderByChild(e.orderChild), firebase.database.limitToLast(e.size));

                    await FirebaseGetRead();

                    function FirebaseGetRead() {
                        return new Promise((resolve) => {
                            if (e.sync) {
                                firebase.database.onValue(dataRef, (snapshot) => {
                                    if (snapshot["exists"]()) UpdateReadData(snapshot);
                                    else {
                                        Result.success = 1;
                                        Result.dataLog = "";
                                        Result.paraType = "noExist";
                                    }
                                    Result.action = e.action;
                                    Result.id = e.id;
                                    Result.locationLink = e.locationLink;
                                    self.PostToRuntime("on_complete" + e.uid, Result);
                                    resolve()
                                })
                            }
                            else {
                                firebase.database.onValue(dataRef, (snapshot) => {
                                    if (snapshot["exists"]()) UpdateReadData(snapshot);
                                    else {
                                        Result.success = 1;
                                        Result.dataLog = "";
                                        Result.paraType = "noExist";
                                    }
                                    resolve()
                                }, {
                                    onlyOnce: true
                                })
                            }
                        });
                    }

                    function UpdateReadData(snapshot) {
                        if (e.readJSON) Result.myReadJSON = JSON.stringify(snapshot.toJSON());

                        var arrgrid = [];
                        var allowRankChange = true;
                        iLoop = Object.keys(snapshot["val"]()).length - 1;
                        rankCount = iLoop + 1;

                        snapshot["forEach"](function (childSnapshot) {
                            if (e.readProui) {
                                var partOb = childSnapshot["val"]();
                                partOb["~parentNode"] = childSnapshot["key"];
                                arrgrid.push(partOb);
                            }
                            Object.keys(childSnapshot["val"]()).forEach(function (k) {
                                var childData = childSnapshot["child"](k)["val"]();
                                if (childData != null) Result.Read_C[k + iLoop] = childData;
                                else Result.Read_C[k + iLoop] = "";
                            });
                            if (e.action === "AdvancedReadLeaderboard" && childSnapshot["child"](e.rankKey)["val"]() == e.rankData) {
                                Result.Rank_C = rankCount;
                                allowRankChange = false;
                            }
                            else if(e.action === "SimpleReadLeaderboard" && childSnapshot["key"] == e.rankData){
                            	Result.Rank_C = rankCount;
                                allowRankChange = false;
                            }
                            else if (allowRankChange) Result.Rank_C = 0;
                            --rankCount;
                            --iLoop;
                        });
                        if (e.readProui) Result.myReadPROUI = JSON.stringify(arrgrid.reverse());

                        Result.success = 1;
                        Result.dataLog = "[Object object]";
                        Result.paraType = "lb";
                        Result.snapshotVal = snapshot.val();
                    }
                }

                else if (e.action === "AdvancedWriteLeaderboard") {
                    await firebase.database.update(firebase.database.ref(db, e.locationLink + '/'), e.dataObj).then(function () {
                        Result.success = 1;
                    }).catch(function (error) {
                        Result.success = 0;
                        Result.errorCode = error.code;
                        Result.errorMessage = error.message;
                    });
                }

                else if (e.action === "RemoveData") {
                    await firebase.database.remove(firebase.database.ref(db, e.locationLink + '/')).then(function () {
                        Result.success = 1;
                    }).catch(function (error) {
                        Result.success = 0;
                        Result.errorCode = error.code;
                        Result.errorMessage = error.message;
                    });
                }

                else if (e.action === "AdvancedIncrement") {
                    await firebase.database.set(firebase.database.ref(db, e.locationLink + '/'), firebase.database.increment(e.data)).then(function () {
                        Result.success = 1;
                    }).catch(function (error) {
                        Result.success = 0;
                        Result.errorCode = error.code;
                        Result.errorMessage = error.message;
                    });
                }

                else if (e.action === "SimpleWriteData") {
                    await firebase.database.update(firebase.database.ref(db, e.locUserData + "/" + e.myUID + '/'), e.dataObj).then(function () {
                        Result.success = 1;
                    }).catch(function (error) {
                        Result.success = 0;
                        Result.errorCode = error.code;
                        Result.errorMessage = error.message;
                    });
                }

                else if (e.action === "SimpleWriteLeaderboard") {
                    await firebase.database.update(firebase.database.ref(db, e.locUserLB + "/" + e.myUID + '/'), e.dataObj).then(function () {
                        Result.success = 1;
                    }).catch(function (error) {
                        Result.success = 0;
                        Result.errorCode = error.code;
                        Result.errorMessage = error.message;
                    });
                }

                else if (e.action === "SimpleIncrement") {
                    await firebase.database.set(firebase.database.ref(db, e.locationLink), firebase.database.increment(e.data)).then(function () {
                        Result.success = 1;
                    }).catch(function (error) {
                        Result.success = 0;
                        Result.errorCode = error.code;
                        Result.errorMessage = error.message;
                    });
                }

                else if (e.action === "SimpleRemove") {
                    await firebase.database.remove(firebase.database.ref(db, e.locationLink)).then(function () {
                        Result.success = 1;
                    }).catch(function (error) {
                        Result.success = 0;
                        Result.errorCode = error.code;
                        Result.errorMessage = error.message;
                    });
                }

                return Result;
            }

            function DoSync(e) {
                //self.PostToRuntime("on_complete"+e.uid)
                var firebase = globalThis.sparshaFirebase;
                var db = firebase.myDatabase[e.sdkName];

                if (e.action === "GoOffline") {
                    firebase.database.goOffline(db);
                }
                else if (e.action === "GoOnline") {
                    firebase.database.goOnline(db);
                }
            }

            this.AddRuntimeMessageHandler("domSync_sparsha_fRD", DoSync);
            this.AddRuntimeMessageHandler("domAsync_sparsha_fRD", DoAsync);
        }
    };
    self.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS);
}"use strict";
{
    const DOM_COMPONENT_ID = "sparsha_firebase_sdk";
    function StopPropagation(e) {
        e.stopPropagation();
    }
    const HANDLER_CLASS = class MyDOMHandler extends self.DOMHandler {
        constructor(iRuntime) {
            super(iRuntime, DOM_COMPONENT_ID);
            var self = this;

            async function DoAsync(e) {

            }

            function DoSync(e) {
                //action,sdkName,plugin_uid,recaptchatoken
                //remove_app,remove_auth,remove_database,remove_storage
                //enable_auth,enable_database,enable_storage,enable_appcheck
                //apiKey,projectId,databaseURL,messagingSenderId,appId,version
                //debug,autoLoad,tseconds
                var Result = {
                    action: e.action,
                    status: "none",
                    userBasic: {},
                    userPro: {},
                };
                var firebase = globalThis.sparshaFirebase;

                function returnData() {
                    self.PostToRuntime("run_sparsha_fSDK" + e.plugin_uid, Result)
                }

                if (e.action === "init" || e.action === "reconnect") {
                    function setAuthListener() {
                        var authExpBasic = {};
                        var authExpPro = {};
                        var myAuth = firebase.myAuth[e.sdkName];
                        if (firebase._loadedApp[e.sdkName] !== 1 || e.action === "reconnect") {
                            firebase.auth.onAuthStateChanged(myAuth, (user) => {
                                var authMapRes = firebase._GetAuthMapData(user, e.sdkName);
                                authExpBasic = authMapRes.authExpBasic;
                                authExpPro = authMapRes.authExpPro;
                                if (user) {
                                    if (e.debug) {
                                        console.log("LOGGED IN" + "\nsdkObject: " + e.sdkName + "\nuserID: " + authExpBasic["myUID"] + "\nprovider: " + authExpBasic["providerID"] + "\nemail: " + authExpBasic["myEmail"] + "\nisEmailVerified: " + authExpBasic["isEmailVerified"] + "\nusername: " + authExpBasic["username"] + "\nphone: " + authExpBasic["phoneNo"] + "\nphotoURL: " + authExpBasic["photoURL"] + "\n ");
                                    }
                                }
                                else {
                                    if (e.debug) console.log("LOGGED OUT" + "\nsdkObject: " + e.sdkName + "\n ");
                                }
                                Result.status = "success";
                                Result.userBasic = authExpBasic;
                                Result.userPro = authExpPro;
                                returnData();
                                authExpPro.TrigNotEvent=0;
                                firebase._loadedApp[e.sdkName] = 1;

                            });
                        }
                    }
                    function startInitApp(firebaseConfig) {
                        if (e.sdkName === firebase.mainSdkName) firebase.myApp[e.sdkName] = firebase.app.initializeApp(firebaseConfig);
                        else firebase.myApp[e.sdkName] = firebase.app.initializeApp(firebaseConfig, e.sdkName);

                        if (typeof firebase._res[e.sdkName] === "undefined") firebase._res[e.sdkName] = {};

                        if (e.enable_database) {
                            firebase.myDatabase[e.sdkName] = firebase.database.getDatabase(firebase.myApp[e.sdkName]);
                            if (firebase._dbDetailLog) firebase.database.enableLogging(true);
                        }
                        if (e.enable_firestore) firebase.myFirestore[e.sdkName] = firebase.firestore.getFirestore(firebase.myApp[e.sdkName]);
                        if (e.enable_storage) firebase.myStorage[e.sdkName] = firebase.storage.getStorage(firebase.myApp[e.sdkName]);
                        if (e.enable_analytics) firebase.myAnalytics[e.sdkName] = firebase.analytics.getAnalytics(firebase.myApp[e.sdkName]);
                        if (e.enable_remoteconfig) {
                            firebase.myRemoteConfig[e.sdkName] = firebase.remoteconfig.getRemoteConfig(firebase.myApp[e.sdkName]);
                            var remoteConfig = firebase.myRemoteConfig[e.sdkName];
                            remoteConfig.settings.minimumFetchIntervalMillis = e.remoteConfigTime * 1000;
                            remoteConfig.defaultConfig = e.remoteConfigDefault;
                        }
                        if (e.enable_performance) firebase.myPerformance[e.sdkName] = firebase.performance.getPerformance(firebase.myApp[e.sdkName]);
                        if (e.enable_appcheck) {
                        	var providerName="";
                        	if(e.captchaType===0) providerName="ReCaptchaEnterpriseProvider";
                        	else providerName= "ReCaptchaV3Provider";
                            firebase.myAppCheck[e.sdkName] = firebase.appcheck.initializeAppCheck(firebase.myApp[e.sdkName], {
                                provider: new firebase.appcheck[providerName](e.recaptchatoken),
                                isTokenAutoRefreshEnabled: e.autoRefCapToken
                            });
                        }
                        if (e.enable_auth) {
                            firebase.myAuth[e.sdkName] = firebase.auth.getAuth(firebase.myApp[e.sdkName]);
                            setAuthListener();
                        }
                        else {
                            firebase._loadedApp[e.sdkName] = 1;
                            Result.status = "success";
                            returnData();
                        }
                    }

                    if (e.action === "init") {
                        if (typeof firebase.mainSdkName === "undefined") firebase.mainSdkName = e.sdkName;

                        if (e.sdkName === firebase.mainSdkName) {
                            var iApp = ["deleteApp", "getApp", "initializeApp"];
                            var iAppCheck = ["initializeAppCheck", "ReCaptchaV3Provider", "ReCaptchaEnterpriseProvider", "getToken", "getLimitedUseToken"];
                            var iAuth = [
                                "createUserWithEmailAndPassword",
                                "deleteUser",
                                "getAdditionalUserInfo",
                                "getAuth",
                                "linkWithCredential",
                                "linkWithPhoneNumber",
                                "linkWithPopup",
                                "linkWithRedirect",
                                "onAuthStateChanged",
                                "sendEmailVerification",
                                "sendPasswordResetEmail",
                                "setPersistence",
                                "signInAnonymously",
                                "signInWithCredential",
                                "signInWithEmailAndPassword",
                                "signInWithPhoneNumber",
                                "signInWithPopup",
                                "signInWithRedirect",
                                "signInWithCustomToken",
                                "signOut",
                                "unlink",
                                "updateEmail",
                                "updatePassword",
                                "updatePhoneNumber",
                                "updateProfile",
                                "useDeviceLanguage",
                                "AuthCredential",
                                "EmailAuthCredential",
                                "EmailAuthProvider",
                                "FacebookAuthProvider",
                                "GithubAuthProvider",
                                "GoogleAuthProvider",
                                "OAuthProvider",
                                "OAuthCredential",
                                "PhoneAuthCredential",
                                "PhoneAuthProvider",
                                "RecaptchaVerifier",
                                "TwitterAuthProvider",
                            ];
                            var iRD = [
                                "enableLogging",
                                "endAt",
                                "endBefore",
                                "equalTo",
                                "get",
                                "getDatabase",
                                "goOffline",
                                "goOnline",
                                "increment",
                                "limitToFirst",
                                "limitToLast",
                                "off",
                                "onChildAdded",
                                "onChildChanged",
                                "onChildMoved",
                                "onChildRemoved",
                                "onDisconnect",
                                "onValue",
                                "orderByChild",
                                "orderByKey",
                                "orderByValue",
                                "push",
                                "query",
                                "ref",
                                "set",
                                "remove",
                                "runTransaction",
                                "serverTimestamp",
                                "startAfter",
                                "startAt",
                                "update",
                            ];
                            var iFirestore = [
                                "addDoc",
                                "arrayRemove",
                                "arrayUnion",
                                "clearIndexedDbPersistence",
                                "collection",
                                "collectionGroup",
                                "deleteDoc",
                                "deleteField",
                                "disableNetwork",
                                "doc",
                                "documentId",
                                "enableIndexedDbPersistence",
                                "enableMultiTabIndexedDbPersistence",
                                "enableNetwork",
                                "endAt",
                                "endBefore",
                                "getDoc",
                                "getDocFromCache",
                                "getDocFromServer",
                                "getDocs",
                                "getFirestore",
                                "increment",
                                "initializeFirestore",
                                "limit",
                                "limitToLast",
                                "loadBundle",
                                "namedQuery",
                                "onSnapshot",
                                "onSnapshotsInSync",
                                "orderBy",
                                "query",
                                "refEqual",
                                "runTransaction",
                                "serverTimestamp",
                                "setDoc",
                                "setLogLevel",
                                "snapshotEqual",
                                "startAfter",
                                "startAt",
                                "terminate",
                                "updateDoc",
                                "waitForPendingWrites",
                                "where",
                                "writeBatch",
                            ];
                            var iStorage = [
                                "deleteObject",
                                "getDownloadURL",
                                "getMetadata",
                                "getStorage",
                                "list",
                                "listAll",
                                "ref",
                                "updateMetadata",
                                "uploadBytes",
                                "uploadBytesResumable",
                                "uploadString",
                            ];
                            var iAnalytics = ["getAnalytics", "initializeAnalytics", "logEvent", "setAnalyticsCollectionEnabled", "setUserId", "setUserProperties"];
                            var iRemoteConfig = ["fetchAndActivate", "getAll", "getRemoteConfig"];
                            var iPerformance = ["getPerformance", "trace"];
                            e.remove_remoteconfig = "";
                            //e.remove_analytics = "";
                            e.remove_performance = "";

                            const srcFirebase = "https://www.gstatic.com/firebasejs/" + e.version + "/firebase-";
                            var importString = "";
                            var varString = "";

                            function setScriptString(arr, rem, serviceNm) {
                                importString += "import {";
                                varString += "globalThis.sparshaFirebase." + serviceNm + "={";
                                rem = JSON.parse("[\"" + rem.replaceAll("\n", "\",\"") + "\"]");
                                rem.forEach(function (item) {
                                    const index = arr.indexOf(item);
                                    if (index > -1) {
                                        arr.splice(index, 1);
                                    }
                                });

                                arr.forEach(function (item) {
                                    if (serviceNm === "database" && (item === "ref" || item === "endAt" || item === "endBefore" || item === "increment" || item === "limitToLast" || item === "query" || item === "runTransaction" || item === "serverTimestamp" || item === "startAfter" || item === "startAt")) {
                                        var newName = item + serviceNm;
                                        importString += item + " as " + newName + ", ";
                                        varString += item + ":" + newName + ",";
                                    }
                                    else {
                                        importString += item + ", ";
                                        varString += item + ":" + item + ",";
                                    }
                                });
                                if (serviceNm === "appcheck") serviceNm = "app-check";
                                if (serviceNm === "remoteconfig") serviceNm = "remote-config";
                                importString += "  } from \"" + srcFirebase + serviceNm + ".js\";";
                                varString += "};"
                            }

                            if (typeof window.cordova !== "undefined") e.enable_analytics = false;
                            

                            setScriptString(iApp, e.remove_app, "app");
                            if (e.enable_appcheck) setScriptString(iAppCheck, e.remove_appcheck, "appcheck");

                            if (e.enable_auth) setScriptString(iAuth, e.remove_auth, "auth");

                            if (e.enable_database) setScriptString(iRD, e.remove_database, "database");

                            if (e.enable_firestore) setScriptString(iFirestore, e.remove_firestore, "firestore");

                            if (e.enable_storage) setScriptString(iStorage, e.remove_storage, "storage");

                            if (e.enable_analytics) setScriptString(iAnalytics, e.remove_analytics, "analytics");

                            if (e.enable_remoteconfig) setScriptString(iRemoteConfig, e.remove_remoteconfig, "remoteconfig");
                            
                            if (e.enable_performance) setScriptString(iPerformance, e.remove_performance, "performance");

                            firebase._callInitApp = function () {
                                startInitApp(e.firebaseConfig)
                            }

                            firebase._isLoaded = 0;
                            function LoadScripts() {
                                var script = document.createElement("script");
                                script.type = "module";
                                script.innerHTML = importString + varString + "globalThis.sparshaFirebase._isLoaded=1;globalThis.sparshaFirebase._callInitApp();";
                                document.getElementsByTagName("head")[0].appendChild(script);
                            }
                            LoadScripts();
                            var myTimeout = setTimeout(function () {
                                if (firebase._isLoaded === 0) {
                                    if (e.debug) console.error("TIMEOUT" + "\nsdkObject: " + e.sdkName);
                                    if (e.autoLoad) LoadScripts();
                                    Result.status = "timeout";
                                    returnData();
                                }
                                else {
                                    clearTimeout(myTimeout);
                                }
                            }, e.tseconds * 1000);

                        }
                        else {
                            startInitApp(e.firebaseConfig)
                        }
                    }
                    else {
                        startInitApp(e.firebaseConfig)
                    }
                }
                else if (e.action === "disconnect") {
                    firebase.app.deleteApp(firebase.myApp[e.sdkName]);
                }
            }

            this.AddRuntimeMessageHandler("domSync_sparsha_fSDK", DoSync);
            //this.AddRuntimeMessageHandler("domAsync_sparsha_fSDK", DoAsync);
        }
    };
    self.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS);
}'use strict';{let deferredInstallPromptEvent=null;let browserDomHandler=null;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPromptEvent=e;if(browserDomHandler)browserDomHandler._OnBeforeInstallPrompt();return false});function elemsForSelector(selector,isAll){if(!selector)return[document.documentElement];else if(isAll)return Array.from(document.querySelectorAll(selector));else{const e=document.querySelector(selector);return e?[e]:[]}}function noop(){}const DOM_COMPONENT_ID=
"browser";const HANDLER_CLASS=class BrowserDOMHandler extends self.DOMHandler{constructor(iRuntime){super(iRuntime,DOM_COMPONENT_ID);this._exportType="";this.AddRuntimeMessageHandlers([["get-initial-state",e=>this._OnGetInitialState(e)],["ready-for-sw-messages",()=>this._OnReadyForSWMessages()],["alert",e=>this._OnAlert(e)],["close",()=>this._OnClose()],["set-focus",e=>this._OnSetFocus(e)],["vibrate",e=>this._OnVibrate(e)],["lock-orientation",e=>this._OnLockOrientation(e)],["unlock-orientation",()=>
this._OnUnlockOrientation()],["navigate",e=>this._OnNavigate(e)],["request-fullscreen",e=>this._OnRequestFullscreen(e)],["exit-fullscreen",()=>this._OnExitFullscreen()],["set-hash",e=>this._OnSetHash(e)],["set-document-css-style",e=>this._OnSetDocumentCSSStyle(e)],["get-document-css-style",e=>this._OnGetDocumentCSSStyle(e)],["set-window-size",e=>this._OnSetWindowSize(e)],["set-window-position",e=>this._OnSetWindowPosition(e)],["request-install",()=>this._OnRequestInstall()],["set-warn-on-close",e=>
this._OnSetWarnOnClose(e)]]);window.addEventListener("online",()=>this._OnOnlineStateChanged(true));window.addEventListener("offline",()=>this._OnOnlineStateChanged(false));window.addEventListener("hashchange",()=>this._OnHashChange());this._beforeunload_handler=e=>e.preventDefault();document.addEventListener("backbutton",()=>this._OnCordovaBackButton())}Attach(){if(deferredInstallPromptEvent)this._OnBeforeInstallPrompt();else browserDomHandler=this;window.addEventListener("appinstalled",()=>this._OnAppInstalled())}_OnGetInitialState(e){this._exportType=
e["exportType"];return{"location":location.toString(),"isOnline":!!navigator.onLine,"referrer":document.referrer,"title":document.title,"isCookieEnabled":!!navigator.cookieEnabled,"screenWidth":screen.width,"screenHeight":screen.height,"windowOuterWidth":window.outerWidth,"windowOuterHeight":window.outerHeight,"isConstructArcade":typeof window["is_scirra_arcade"]!=="undefined"}}_OnReadyForSWMessages(){if(!window["C3_RegisterSW"]||!window["OfflineClientInfo"])return;window["OfflineClientInfo"]["SetMessageCallback"](e=>
this.PostToRuntime("sw-message",e["data"]))}_OnBeforeInstallPrompt(){this.PostToRuntime("install-available")}async _OnRequestInstall(){if(!deferredInstallPromptEvent)return{"result":"unavailable"};try{deferredInstallPromptEvent["prompt"]();const result=await deferredInstallPromptEvent["userChoice"];return{"result":result["outcome"]}}catch(err){console.error("[Construct] Requesting install failed: ",err);return{"result":"failed"}}}_OnAppInstalled(){this.PostToRuntime("app-installed")}_OnOnlineStateChanged(isOnline){this.PostToRuntime("online-state",
{"isOnline":isOnline})}_OnCordovaBackButton(){this.PostToRuntime("backbutton")}GetNWjsWindow(){if(this._exportType==="nwjs")return nw["Window"]["get"]();else return null}_OnAlert(e){alert(e["message"])}_OnClose(){if(navigator["app"]&&navigator["app"]["exitApp"])navigator["app"]["exitApp"]();else if(navigator["device"]&&navigator["device"]["exitApp"])navigator["device"]["exitApp"]();else window.close()}_OnSetFocus(e){const isFocus=e["isFocus"];if(this._exportType==="nwjs"){const win=this.GetNWjsWindow();
if(isFocus)win["focus"]();else win["blur"]()}else if(isFocus)window.focus();else window.blur()}_OnVibrate(e){if(navigator["vibrate"])navigator["vibrate"](e["pattern"])}_OnLockOrientation(e){const orientation=e["orientation"];if(screen["orientation"]&&screen["orientation"]["lock"])screen["orientation"]["lock"](orientation).catch(err=>console.warn("[Construct] Failed to lock orientation: ",err));else try{let result=false;if(screen["lockOrientation"])result=screen["lockOrientation"](orientation);else if(screen["webkitLockOrientation"])result=
screen["webkitLockOrientation"](orientation);else if(screen["mozLockOrientation"])result=screen["mozLockOrientation"](orientation);else if(screen["msLockOrientation"])result=screen["msLockOrientation"](orientation);if(!result)console.warn("[Construct] Failed to lock orientation")}catch(err){console.warn("[Construct] Failed to lock orientation: ",err)}}_OnUnlockOrientation(){try{if(screen["orientation"]&&screen["orientation"]["unlock"])screen["orientation"]["unlock"]();else if(screen["unlockOrientation"])screen["unlockOrientation"]();
else if(screen["webkitUnlockOrientation"])screen["webkitUnlockOrientation"]();else if(screen["mozUnlockOrientation"])screen["mozUnlockOrientation"]();else if(screen["msUnlockOrientation"])screen["msUnlockOrientation"]()}catch(err){}}_OnNavigate(e){const type=e["type"];if(type==="back")if(navigator["app"]&&navigator["app"]["backHistory"])navigator["app"]["backHistory"]();else window.history.back();else if(type==="forward")window.history.forward();else if(type==="reload")location.reload();else if(type===
"url"){const url=e["url"];const target=e["target"];const exportType=e["exportType"];if(self["cordova"]&&self["cordova"]["InAppBrowser"])self["cordova"]["InAppBrowser"]["open"](url,"_system");else if(exportType==="preview"||this._iRuntime.IsAnyWebView2Wrapper())window.open(url,"_blank");else if(!this._isConstructArcade)if(target===2)window.top.location=url;else if(target===1)window.parent.location=url;else window.location=url}else if(type==="new-window"){const url=e["url"];const tag=e["tag"];if(self["cordova"]&&
self["cordova"]["InAppBrowser"])self["cordova"]["InAppBrowser"]["open"](url,"_system");else window.open(url,tag)}}_OnRequestFullscreen(e){if(this._iRuntime.IsAnyWebView2Wrapper()||this._exportType==="macos-wkwebview"){self.RuntimeInterface._SetWrapperIsFullscreenFlag(true);this._iRuntime._SendWrapperMessage({"type":"set-fullscreen","fullscreen":true})}else{const opts={"navigationUI":"auto"};const navUI=e["navUI"];if(navUI===1)opts["navigationUI"]="hide";else if(navUI===2)opts["navigationUI"]="show";
const elem=document.documentElement;let ret;if(elem["requestFullscreen"])ret=elem["requestFullscreen"](opts);else if(elem["mozRequestFullScreen"])ret=elem["mozRequestFullScreen"](opts);else if(elem["msRequestFullscreen"])ret=elem["msRequestFullscreen"](opts);else if(elem["webkitRequestFullScreen"])if(typeof Element["ALLOW_KEYBOARD_INPUT"]!=="undefined")ret=elem["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]);else ret=elem["webkitRequestFullScreen"]();if(ret instanceof Promise)ret.catch(noop)}}_OnExitFullscreen(){if(this._iRuntime.IsAnyWebView2Wrapper()||
this._exportType==="macos-wkwebview"){self.RuntimeInterface._SetWrapperIsFullscreenFlag(false);this._iRuntime._SendWrapperMessage({"type":"set-fullscreen","fullscreen":false})}else{let ret;if(document["exitFullscreen"])ret=document["exitFullscreen"]();else if(document["mozCancelFullScreen"])ret=document["mozCancelFullScreen"]();else if(document["msExitFullscreen"])ret=document["msExitFullscreen"]();else if(document["webkitCancelFullScreen"])ret=document["webkitCancelFullScreen"]();if(ret instanceof
Promise)ret.catch(noop)}}_OnSetHash(e){location.hash=e["hash"]}_OnHashChange(){this.PostToRuntime("hashchange",{"location":location.toString()})}_OnSetDocumentCSSStyle(e){const prop=e["prop"];const value=e["value"];const selector=e["selector"];const isAll=e["is-all"];try{const arr=elemsForSelector(selector,isAll);for(const e of arr)if(prop.startsWith("--"))e.style.setProperty(prop,value);else e.style[prop]=value}catch(err){console.warn("[Browser] Failed to set style: ",err)}}_OnGetDocumentCSSStyle(e){const prop=
e["prop"];const selector=e["selector"];try{const elem=document.querySelector(selector);if(elem){const computedStyle=window.getComputedStyle(elem);return{"isOk":true,"result":computedStyle.getPropertyValue(prop)}}else return{"isOk":false}}catch(err){console.warn("[Browser] Failed to get style: ",err);return{"isOk":false}}}_OnSetWindowSize(e){window.resizeTo(e["windowWidth"],e["windowHeight"])}_OnSetWindowPosition(e){window.moveTo(e["windowX"],e["windowY"])}_OnSetWarnOnClose(e){const enabled=e["enabled"];
if(enabled)window.addEventListener("beforeunload",this._beforeunload_handler);else window.removeEventListener("beforeunload",this._beforeunload_handler)}};self.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS)};
'use strict';{const DOM_COMPONENT_ID="localstorage";const HANDLER_CLASS=class LocalStorageDOMHandler extends self.DOMHandler{constructor(iRuntime){super(iRuntime,DOM_COMPONENT_ID);this.AddRuntimeMessageHandlers([["init",()=>this._Init()],["request-persistent",()=>this._OnRequestPersistent()]])}async _Init(){let isPersistent=false;try{isPersistent=await navigator["storage"]["persisted"]()}catch(err){isPersistent=false;console.warn("[Construct] Error checking storage persisted state: ",err)}return{"isPersistent":isPersistent}}async _OnRequestPersistent(){try{const isPersistent=
await navigator["storage"]["persist"]();return{"isOk":true,"isPersistent":isPersistent}}catch(err){console.error("[Construct] Error requesting persistent storage: ",err);return{"isOk":false}}}};self.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS)};
