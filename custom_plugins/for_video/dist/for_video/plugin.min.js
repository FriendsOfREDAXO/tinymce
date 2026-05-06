"use strict";(()=>{var j=Object.defineProperty;var H=Object.getOwnPropertySymbols;var U=Object.prototype.hasOwnProperty,R=Object.prototype.propertyIsEnumerable;var P=(e,t,o)=>t in e?j(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,k=(e,t)=>{for(var o in t||(t={}))U.call(t,o)&&P(e,o,t[o]);if(H)for(var o of H(t))R.call(t,o)&&P(e,o,t[o]);return e};var I=["for-video"],q=[{label:"16:9 (Querformat)",value:""},{label:"4:3",value:"for-video--ratio-4-3"},{label:"1:1 (Quadrat)",value:"for-video--ratio-1-1"},{label:"9:16 (Hochkant)",value:"for-video--ratio-9-16"},{label:"21:9 (Cinemascope)",value:"for-video--ratio-21-9"}],O=[{label:"Original",value:""},{label:"Klein",value:"for-video--w-sm"},{label:"Mittel",value:"for-video--w-md"},{label:"Gro\xDF",value:"for-video--w-lg"},{label:"Volle Breite",value:"for-video--w-full"}],G=[{label:"Keine",value:""},{label:"Links (Umlauf)",value:"for-video--align-left"},{label:"Zentriert",value:"for-video--align-center"},{label:"Rechts (Umlauf)",value:"for-video--align-right"}];function C(e,t,o){try{let n=e.getParam(t);if(Array.isArray(n)&&n.length)return n.map(r=>{var s,c,d,i,l,f;return{label:String((i=(d=(c=(s=r.label)!=null?s:r.title)!=null?c:r.value)!=null?d:r.class)!=null?i:""),value:String((f=(l=r.value)!=null?l:r.class)!=null?f:"").trim()}}).filter(r=>r.label)}catch(n){}return o}function g(e){return String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function $(e){let t=(e||"").split(/[?#]/)[0],o=t.split("/");return o[o.length-1]||t}function b(e){return e?/^(https?:)?\/\//i.test(e)||e.startsWith("/")?e:"/media/"+e.replace(/^media\//,""):""}function w(e){return e?(e.getAttribute("class")||"").split(/\s+/).filter(Boolean).filter(o=>o!=="media"&&!I.includes(o)):[]}function S(e){let t="for_video_picker_"+Date.now()+"_"+Math.floor(Math.random()*1e3),o=document.createElement("input");o.type="hidden",o.id=t,document.body.appendChild(o);let n=window,r=typeof n.openMediaPool=="function"?n.openMediaPool:null;if(!r){o.remove(),n.alert("Mediapool-Funktion nicht verf\xFCgbar (openMediaPool).");return}let s=null;try{s=r(t)}catch(d){}let c=()=>{let d=o.value;o.remove(),d&&e(d)};if(s&&typeof s.closed!="undefined"){let d=setInterval(()=>{s.closed&&(clearInterval(d),c())},300)}else{let d=()=>{window.removeEventListener("focus",d),setTimeout(c,50)};window.addEventListener("focus",d)}}function E(e,t=[]){let o=["media","for-video",...t].filter(Boolean).join(" "),n=b(e.poster),r=n?`<img class="for-video__poster" src="${g(n)}" alt="" loading="lazy" draggable="false">`:"",s=[`data-for-video-src="${g(e.src)}"`,`data-for-video-poster="${g(e.poster)}"`,`data-for-video-controls="${e.controls?"1":"0"}"`,`data-for-video-autoplay="${e.autoplay?"1":"0"}"`,`data-for-video-loop="${e.loop?"1":"0"}"`,`data-for-video-muted="${e.muted?"1":"0"}"`,`data-for-video-playsinline="${e.playsinline?"1":"0"}"`].join(" "),c=$(e.src)||"Video";return`<figure class="${g(o)}" contenteditable="false" ${s}><div class="for-video__toolbar" data-for-video-toolbar><span class="for-video__badge">Video</span><span class="for-video__url" title="${g(e.src)}">${g(c)}</span><button type="button" class="for-video__btn for-video__btn--stop" data-for-video-stop title="Stoppen" aria-label="Stoppen"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="3" width="10" height="10" rx="1.5" ry="1.5" fill="currentColor"/></svg></button><button type="button" class="for-video__btn for-video__btn--handle" data-for-video-select title="Video ausw\xE4hlen" aria-label="Video ausw\xE4hlen"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 4h12v2H2zM2 10h12v2H2z" fill="currentColor"/></svg></button></div><div class="for-video__ratio">`+r+'<div class="for-video__play" aria-hidden="true"><svg viewBox="0 0 68 48" width="68" height="48" focusable="false"><path d="M66.5 7.7c-.8-2.9-3.1-5.2-6-6C55.3.2 34 .2 34 .2S12.7.2 7.5 1.7C4.6 2.5 2.3 4.8 1.5 7.7 0 13 0 24 0 24s0 11 1.5 16.3c.8 2.9 3.1 5.2 6 6C12.7 47.8 34 47.8 34 47.8s21.3 0 26.5-1.5c2.9-.8 5.2-3.1 6-6C68 35 68 24 68 24s0-11-1.5-16.3z" fill="#212121" fill-opacity=".85"/><path d="M45 24 27 14v20z" fill="#fff"/></svg></div></div></figure>'}function z(e,t=[]){let o=["media","for-video",...t].filter(Boolean).join(" "),n=b(e.src),r=e.poster?b(e.poster):"",s=[];s.push(`src="${g(n)}"`),r&&s.push(`poster="${g(r)}"`),e.controls&&s.push("controls"),e.autoplay&&s.push("autoplay"),e.loop&&s.push("loop"),(e.muted||e.autoplay)&&s.push("muted"),e.playsinline&&s.push("playsinline"),s.push('preload="metadata"');let c=$(e.src)||"Video";return`<figure class="${g(o)}"><video ${s.join(" ")}><a href="${g(n)}">${g(c)}</a></video></figure>`}function m(e){let t=e.querySelector("video");return t?{src:t.getAttribute("src")||"",poster:t.getAttribute("poster")||"",controls:t.hasAttribute("controls"),autoplay:t.hasAttribute("autoplay"),loop:t.hasAttribute("loop"),muted:t.hasAttribute("muted"),playsinline:t.hasAttribute("playsinline")}:e.hasAttribute("data-for-video-src")?{src:e.getAttribute("data-for-video-src")||"",poster:e.getAttribute("data-for-video-poster")||"",controls:e.getAttribute("data-for-video-controls")==="1",autoplay:e.getAttribute("data-for-video-autoplay")==="1",loop:e.getAttribute("data-for-video-loop")==="1",muted:e.getAttribute("data-for-video-muted")==="1",playsinline:e.getAttribute("data-for-video-playsinline")==="1"}:null}function D(e){Array.from(e.querySelectorAll("figure.for-video, figure.media")).forEach(o=>{var i;if(!o.querySelector("video")||o.hasAttribute("data-for-video-src")&&o.querySelector(".for-video__ratio"))return;let r=m(o);if(!r||!r.src)return;let s=w(o),c=document.createElement("div");c.innerHTML=E(r,s);let d=c.firstElementChild;d&&((i=o.parentNode)==null||i.replaceChild(d,o))})}function W(e){if(!e)return e;let t=document.createElement("div");return t.innerHTML=e,Array.from(t.querySelectorAll("figure.for-video, figure[data-for-video-src]")).forEach(n=>{var i;let r=m(n);if(!r||!r.src)return;let s=w(n),c=document.createElement("div");c.innerHTML=z(r,s);let d=c.firstElementChild;d&&((i=n.parentNode)==null||i.replaceChild(d,n))}),t.innerHTML}function K(e,t){let o=m(t);if(!o||!o.src)return;let n=t.querySelector(".for-video__ratio");if(!n)return;n.innerHTML="";let r=document.createElement("video");r.src=b(o.src),o.poster&&(r.poster=b(o.poster)),r.controls=o.controls||!0,o.loop&&(r.loop=!0),o.muted&&(r.muted=!0),o.playsinline&&r.setAttribute("playsinline",""),r.setAttribute("preload","metadata"),r.style.width="100%",r.style.height="100%",r.style.position="absolute",r.style.top="0",r.style.left="0",r.style.display="block",n.appendChild(r);try{r.play()}catch(s){}t.setAttribute("data-for-video-active","1"),e.nodeChanged()}function Q(e,t){var c;let o=m(t);if(!o)return;let n=w(t),r=document.createElement("div");r.innerHTML=E(o,n);let s=r.firstElementChild;s&&((c=t.parentNode)==null||c.replaceChild(s,t),e.nodeChanged())}function A(e,t,o,n){e.undoManager.transact(()=>{o.forEach(r=>{r&&t.classList.remove(r)}),n&&t.classList.add(n)}),e.nodeChanged()}function L(e,t){if(!e)return"";for(let o of t)if(o.value&&e.classList.contains(o.value))return o.value;return""}function T(e,t,o){let n=t?k({},t):{src:"",poster:"",controls:!0,autoplay:!1,loop:!1,muted:!1,playsinline:!0},r={type:"panel",items:[{type:"input",name:"src",label:"Video-Datei (Mediapool)",placeholder:"z.B. movie.mp4"},{type:"button",name:"pickSrc",text:"Aus Mediapool w\xE4hlen\u2026",icon:"browse"},{type:"input",name:"poster",label:"Poster-Bild (optional)",placeholder:"z.B. poster.jpg"},{type:"button",name:"pickPoster",text:"Poster aus Mediapool w\xE4hlen\u2026",icon:"browse"},{type:"checkbox",name:"controls",label:"Controls anzeigen"},{type:"checkbox",name:"autoplay",label:"Autoplay (setzt muted)"},{type:"checkbox",name:"loop",label:"Loop (Endlosschleife)"},{type:"checkbox",name:"muted",label:"Stumm (muted)"},{type:"checkbox",name:"playsinline",label:"Inline abspielen (iOS, playsinline)"}]},s=e.windowManager.open({title:t?"Video bearbeiten":"Video einf\xFCgen",size:"normal",body:r,buttons:[{type:"cancel",text:"Abbrechen"},{type:"submit",text:t?"\xDCbernehmen":"Einf\xFCgen",primary:!0}],initialData:n,onAction:(c,d)=>{d.name==="pickSrc"?S(i=>{c.setData({src:i})}):d.name==="pickPoster"&&S(i=>{c.setData({poster:i})})},onSubmit:c=>{let d=c.getData();if(!d.src){e.windowManager.alert("Bitte eine Video-Datei ausw\xE4hlen.");return}c.close(),o(d)}})}function Z(e,t){e.undoManager.transact(()=>{e.insertContent(E(t))}),e.nodeChanged()}function B(e,t,o){let n=w(t),r=document.createElement("div");r.innerHTML=E(o,n);let s=r.firstElementChild;s&&(e.undoManager.transact(()=>{var c;(c=t.parentNode)==null||c.replaceChild(s,t)}),e.nodeChanged())}var J=`
figure.for-video {
    position: relative;
    display: block;
    margin: 1em 0;
    max-width: 100%;
    padding: 0;
    background: #0d0d0d;
    border-radius: 4px;
    overflow: hidden;
    line-height: 0;
    color: #fff;
}
figure.for-video.mce-object-selected {
    box-shadow: 0 0 0 2px #2f80ed;
    outline: none !important;
}
figure.for-video .for-video__toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 6px;
    background: #2a2a2a;
    font: 12px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #eee;
    user-select: none;
    cursor: pointer;
}
figure.for-video .for-video__badge {
    display: inline-block;
    padding: 1px 6px;
    border-radius: 3px;
    background: #2f80ed;
    color: #fff;
    font-weight: 600;
    font-size: 10px;
    letter-spacing: .5px;
    text-transform: uppercase;
}
figure.for-video .for-video__url {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: .8;
    cursor: pointer;
}
figure.for-video .for-video__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    border-radius: 3px;
    background: transparent;
    color: #eee;
    cursor: pointer;
    transition: background-color .15s ease;
}
figure.for-video .for-video__btn:hover { background: rgba(255,255,255,.15); }
figure.for-video[data-for-video-active="1"] .for-video__btn--stop { color: #ff6b6b; }
figure.for-video:not([data-for-video-active="1"]) .for-video__btn--stop { display: none; }
figure.for-video .for-video__ratio {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    min-height: 240px;
    overflow: hidden;
    background: #0d0d0d;
    cursor: pointer;
}
@supports (aspect-ratio: 16 / 9) {
    figure.for-video .for-video__ratio { min-height: 0; }
}
figure.for-video[data-for-video-active="1"] .for-video__ratio { cursor: default; }
figure.for-video .for-video__poster {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    display: block;
    border: 0;
    z-index: 0;
    pointer-events: none;
    user-select: none;
}
figure.for-video .for-video__ratio video {
    position: absolute;
    inset: 0;
    width: 100% !important;
    height: 100% !important;
    border: 0;
    display: block;
    z-index: 1;
}
figure.for-video .for-video__play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: .9;
    filter: drop-shadow(0 2px 8px rgba(0,0,0,.5));
    transition: opacity .15s ease, transform .15s ease;
    z-index: 2;
    pointer-events: none;
}
figure.for-video:hover .for-video__play {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.05);
}
figure.for-video[data-for-video-active="1"] .for-video__play { display: none; }

/* Ratio presets */
figure.for-video.for-video--ratio-4-3    .for-video__ratio { aspect-ratio: 4 / 3;  min-height: 320px; }
figure.for-video.for-video--ratio-1-1    .for-video__ratio { aspect-ratio: 1 / 1;  min-height: 320px; }
figure.for-video.for-video--ratio-9-16   .for-video__ratio { aspect-ratio: 9 / 16; min-height: 480px; }
figure.for-video.for-video--ratio-21-9   .for-video__ratio { aspect-ratio: 21 / 9; min-height: 200px; }
@supports (aspect-ratio: 1 / 1) {
    figure.for-video.for-video--ratio-4-3   .for-video__ratio,
    figure.for-video.for-video--ratio-1-1   .for-video__ratio,
    figure.for-video.for-video--ratio-9-16  .for-video__ratio,
    figure.for-video.for-video--ratio-21-9  .for-video__ratio { min-height: 0; }
}

/* Width presets (editor) */
figure.for-video.for-video--w-sm   { max-width: 240px; }
figure.for-video.for-video--w-md   { max-width: 480px; }
figure.for-video.for-video--w-lg   { max-width: 720px; }
figure.for-video.for-video--w-full { max-width: 100%; }

/* Align presets (editor) */
figure.for-video.for-video--align-left   { float: left;  margin-right: 1em; }
figure.for-video.for-video--align-right  { float: right; margin-left: 1em; }
figure.for-video.for-video--align-center { margin-left: auto; margin-right: auto; float: none; }
`,X=()=>{tinymce.PluginManager.add("for_video",e=>{try{e.options.set("xss_sanitization",!1)}catch(i){}e.on("PreInit",()=>{let i=e.schema;i.addValidChildren("+figure[video|div|a]"),i.addValidChildren("+video[source|a|track]"),i.addValidChildren("+div[video|div|svg|img|span|button]"),i.addValidChildren("+button[svg]"),i.addValidChildren("+svg[path|rect|g]")}),e.on("init",()=>{e.dom.addStyle(J);let i=e.getBody();i&&D(i)}),e.on("SetContent",()=>{let i=e.getBody();i&&D(i)}),e.on("GetContent",i=>{i.content=W(i.content)}),e.on("PreProcess",i=>{let l=i&&i.node;if(!l||typeof l.getAll!="function")return;l.getAll("figure").forEach(a=>{let v=a.attr("class")||"",y=!!a.attr("data-for-video-src");if(v.indexOf("for-video")===-1&&!y)return;let h={src:a.attr("data-for-video-src")||"",poster:a.attr("data-for-video-poster")||"",controls:a.attr("data-for-video-controls")==="1",autoplay:a.attr("data-for-video-autoplay")==="1",loop:a.attr("data-for-video-loop")==="1",muted:a.attr("data-for-video-muted")==="1",playsinline:a.attr("data-for-video-playsinline")==="1"};if(!h.src){a.remove();return}let u=v.split(/\s+/).filter(p=>p&&p!=="media"&&I.indexOf(p)===-1),N=z(h,u),M=tinymce.html.DomParser?new tinymce.html.DomParser({validate:!1}).parse(N):null;if(!M||!M.firstChild)return;let _=a.firstChild;for(;_;){let p=_.next;a.remove(_),_=p}(a.attributes?a.attributes.slice():[]).forEach(p=>a.attr(p.name,null));let V=M.firstChild;(V.attributes||[]).forEach(p=>a.attr(p.name,p.value));let x=V.firstChild;for(;x;){let p=x.next;a.append(x),x=p}})}),e.on("click",i=>{let l=i.target;if(!l)return;let f=l.closest("[data-for-video-stop]");if(f){let u=f.closest("figure.for-video");u&&(i.preventDefault(),Q(e,u));return}let a=l.closest("[data-for-video-select]");if(a){let u=a.closest("figure.for-video");u&&(i.preventDefault(),e.selection.select(u),e.nodeChanged());return}let v=l.closest(".for-video__url");if(v){let u=v.closest("figure.for-video");u&&(e.selection.select(u),e.nodeChanged());return}let y=l.closest(".for-video__toolbar");if(y){let u=y.closest("figure.for-video");u&&(e.selection.select(u),e.nodeChanged());return}let h=l.closest(".for-video__ratio, .for-video__play");if(h){let u=h.closest("figure.for-video");u&&u.getAttribute("data-for-video-active")!=="1"&&(i.preventDefault(),K(e,u))}}),e.on("dblclick",i=>{let l=i.target.closest("figure.for-video");if(!l||l.getAttribute("data-for-video-active")==="1")return;let f=m(l);f&&(i.preventDefault(),T(e,f,a=>B(e,l,a)))}),e.addCommand("forVideoInsert",()=>{T(e,null,i=>Z(e,i))}),e.addCommand("forVideoEdit",()=>{let l=e.selection.getNode().closest("figure.for-video");if(!l)return;let f=m(l);f&&T(e,f,a=>B(e,l,a))}),e.ui.registry.addIcon("for-video-icon",'<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/></svg>'),e.ui.registry.addButton("for_video",{icon:"for-video-icon",tooltip:"Lokales Video einf\xFCgen",onAction:()=>e.execCommand("forVideoInsert")}),e.ui.registry.addMenuItem("for_video",{icon:"for-video-icon",text:"Lokales Video\u2026",onAction:()=>e.execCommand("forVideoInsert")});let t=C(e,"videowidth_presets",O),o=C(e,"videoalign_presets",G),n=C(e,"videoratio_presets",q),r=t.map(i=>i.value).filter(Boolean),s=o.map(i=>i.value).filter(Boolean),c=n.map(i=>i.value).filter(Boolean),d=()=>{let i=e.selection.getNode();return i==null?void 0:i.closest("figure.for-video")};e.ui.registry.addMenuButton("for_video_width",{icon:"resize",tooltip:"Breite",fetch:i=>{let l=d(),f=L(l,t);i(t.map(a=>({type:"menuitem",text:(a.value===f?"\u2713 ":"   ")+a.label,onAction:()=>{let v=d();v&&A(e,v,r,a.value)}})))}}),e.ui.registry.addMenuButton("for_video_align",{icon:"align-left",tooltip:"Ausrichtung",fetch:i=>{let l=d(),f=L(l,o);i(o.map(a=>({type:"menuitem",text:(a.value===f?"\u2713 ":"   ")+a.label,onAction:()=>{let v=d();v&&A(e,v,s,a.value)}})))}}),e.ui.registry.addMenuButton("for_video_ratio",{icon:"crop",tooltip:"Seitenverh\xE4ltnis",fetch:i=>{let l=d(),f=L(l,n);i(n.map(a=>({type:"menuitem",text:(a.value===f?"\u2713 ":"   ")+a.label,onAction:()=>{let v=d();v&&A(e,v,c,a.value)}})))}}),e.ui.registry.addButton("for_video_edit",{icon:"edit-block",tooltip:"Video bearbeiten",onAction:()=>e.execCommand("forVideoEdit")}),e.ui.registry.addButton("for_video_remove",{icon:"remove",tooltip:"Video entfernen",onAction:()=>{let i=d();i&&(e.undoManager.transact(()=>{var l;return(l=i.parentNode)==null?void 0:l.removeChild(i)}),e.nodeChanged())}}),e.ui.registry.addContextToolbar("for_video",{predicate:i=>{let l=i;return!!(l&&l.closest&&l.closest("figure.for-video"))},items:"for_video_width for_video_align for_video_ratio | for_video_edit for_video_remove",position:"node"})})},F=X;F();})();
