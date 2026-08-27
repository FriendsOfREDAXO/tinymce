"use strict";(()=>{var N=Object.defineProperty;var S=Object.getOwnPropertySymbols;var j=Object.prototype.hasOwnProperty,q=Object.prototype.propertyIsEnumerable;var H=(e,r,o)=>r in e?N(e,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[r]=o,D=(e,r)=>{for(var o in r||(r={}))j.call(r,o)&&H(e,o,r[o]);if(S)for(var o of S(r))q.call(r,o)&&H(e,o,r[o]);return e};var $=["for-video"],R=[{label:"16:9 (Querformat)",value:""},{label:"4:3",value:"for-video--ratio-4-3"},{label:"1:1 (Quadrat)",value:"for-video--ratio-1-1"},{label:"9:16 (Hochkant)",value:"for-video--ratio-9-16"},{label:"21:9 (Cinemascope)",value:"for-video--ratio-21-9"}],O=[{label:"Original",value:""},{label:"Klein",value:"for-video--w-sm"},{label:"Mittel",value:"for-video--w-md"},{label:"Gro\xDF",value:"for-video--w-lg"},{label:"Volle Breite",value:"for-video--w-full"}],G=[{label:"Keine",value:""},{label:"Links (Umlauf)",value:"for-video--align-left"},{label:"Zentriert",value:"for-video--align-center"},{label:"Rechts (Umlauf)",value:"for-video--align-right"}];function L(e,r,o){try{let s=e.getParam(r);if(Array.isArray(s)&&s.length)return s.map(a=>{var l,c,d,t,i,f;return{label:String((t=(d=(c=(l=a.label)!=null?l:a.title)!=null?c:a.value)!=null?d:a.class)!=null?t:""),value:String((f=(i=a.value)!=null?i:a.class)!=null?f:"").trim()}}).filter(a=>a.label)}catch(s){}return o}function v(e){return String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function I(e){let r=(e||"").split(/[?#]/)[0],o=r.split("/");return o[o.length-1]||r}function m(e){return e?/^(https?:)?\/\//i.test(e)||e.startsWith("/")?e:"/media/"+e.replace(/^media\//,""):""}function E(e){return e?(e.getAttribute("class")||"").split(/\s+/).filter(Boolean).filter(o=>o!=="media"&&!$.includes(o)):[]}function M(e,r){let o=window.rex5MediaplaceBridge;if(o&&o.isActive()){o.pick(e,r?{filter:r}:{});return}let s="for_video_picker_"+Date.now()+"_"+Math.floor(Math.random()*1e3),a=document.createElement("input");a.type="hidden",a.id=s,document.body.appendChild(a);let l=window,c=typeof l.openMediaPool=="function"?l.openMediaPool:null;if(!c){a.remove(),l.alert("Mediapool-Funktion nicht verf\xFCgbar (openMediaPool).");return}let d=null;try{d=c(s)}catch(i){}let t=()=>{let i=a.value;a.remove(),i&&e(i)};if(d&&typeof d.closed!="undefined"){let i=setInterval(()=>{d.closed&&(clearInterval(i),t())},300)}else{let i=()=>{window.removeEventListener("focus",i),setTimeout(t,50)};window.addEventListener("focus",i)}}function w(e,r=[]){let o=["media","for-video",...r].filter(Boolean).join(" "),s=m(e.poster),a=s?`<img class="for-video__poster" src="${v(s)}" alt="" loading="lazy" draggable="false">`:"",l=e.decorative?' aria-hidden="true" role="presentation"':"",c=[`data-for-video-src="${v(e.src)}"`,`data-for-video-poster="${v(e.poster)}"`,`data-for-video-track-src="${v(e.trackSrc)}"`,`data-for-video-track-lang="${v(e.trackLang)}"`,`data-for-video-track-label="${v(e.trackLabel)}"`,`data-for-video-controls="${e.controls?"1":"0"}"`,`data-for-video-autoplay="${e.autoplay?"1":"0"}"`,`data-for-video-loop="${e.loop?"1":"0"}"`,`data-for-video-muted="${e.muted?"1":"0"}"`,`data-for-video-playsinline="${e.playsinline?"1":"0"}"`,`data-for-video-decorative="${e.decorative?"1":"0"}"`].join(" "),d=I(e.src)||"Video";return`<figure class="${v(o)}" contenteditable="false" ${l} ${c}><div class="for-video__toolbar" data-for-video-toolbar><span class="for-video__badge">Video</span><span class="for-video__url" title="${v(e.src)}">${v(d)}</span><button type="button" class="for-video__btn for-video__btn--stop" data-for-video-stop title="Stoppen" aria-label="Stoppen"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="3" width="10" height="10" rx="1.5" ry="1.5" fill="currentColor"/></svg></button><button type="button" class="for-video__btn for-video__btn--handle" data-for-video-select title="Video ausw\xE4hlen" aria-label="Video ausw\xE4hlen"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 4h12v2H2zM2 10h12v2H2z" fill="currentColor"/></svg></button></div><div class="for-video__ratio">`+a+'<div class="for-video__play" aria-hidden="true"><svg viewBox="0 0 68 48" width="68" height="48" focusable="false"><path d="M66.5 7.7c-.8-2.9-3.1-5.2-6-6C55.3.2 34 .2 34 .2S12.7.2 7.5 1.7C4.6 2.5 2.3 4.8 1.5 7.7 0 13 0 24 0 24s0 11 1.5 16.3c.8 2.9 3.1 5.2 6 6C12.7 47.8 34 47.8 34 47.8s21.3 0 26.5-1.5c2.9-.8 5.2-3.1 6-6C68 35 68 24 68 24s0-11-1.5-16.3z" fill="#212121" fill-opacity=".85"/><path d="M45 24 27 14v20z" fill="#fff"/></svg></div></div></figure>'}function z(e,r=[]){let o=["media","for-video",...r].filter(Boolean).join(" "),s=m(e.src),a=e.poster?m(e.poster):"",l=[];l.push(`src="${v(s)}"`),a&&l.push(`poster="${v(a)}"`),e.controls&&l.push("controls"),e.autoplay&&l.push("autoplay"),e.loop&&l.push("loop"),(e.muted||e.autoplay)&&l.push("muted"),e.playsinline&&l.push("playsinline"),l.push('preload="metadata"');let c=e.trackSrc?m(e.trackSrc):"",d=(e.trackLang||"").trim()||"de",t=(e.trackLabel||"").trim()||"Untertitel",i=c?`<track kind="captions" src="${v(c)}" srclang="${v(d)}" label="${v(t)}">`:"",f=I(e.src)||"Video",n=e.decorative?' aria-hidden="true" role="presentation"':"";return`<figure class="${v(o)}"${n}><video ${l.join(" ")}>`+i+`<a href="${v(s)}">${v(f)}</a></video></figure>`}function h(e){let r=e.querySelector("video");if(r){let o=r.querySelector('track[kind="captions"], track[kind="subtitles"], track');return{src:r.getAttribute("src")||"",poster:r.getAttribute("poster")||"",trackSrc:(o==null?void 0:o.getAttribute("src"))||"",trackLang:(o==null?void 0:o.getAttribute("srclang"))||"de",trackLabel:(o==null?void 0:o.getAttribute("label"))||"Untertitel",controls:r.hasAttribute("controls"),autoplay:r.hasAttribute("autoplay"),loop:r.hasAttribute("loop"),muted:r.hasAttribute("muted"),playsinline:r.hasAttribute("playsinline"),decorative:e.getAttribute("data-for-video-decorative")==="1"||e.getAttribute("aria-hidden")==="true"}}return e.hasAttribute("data-for-video-src")?{src:e.getAttribute("data-for-video-src")||"",poster:e.getAttribute("data-for-video-poster")||"",trackSrc:e.getAttribute("data-for-video-track-src")||"",trackLang:e.getAttribute("data-for-video-track-lang")||"de",trackLabel:e.getAttribute("data-for-video-track-label")||"Untertitel",controls:e.getAttribute("data-for-video-controls")==="1",autoplay:e.getAttribute("data-for-video-autoplay")==="1",loop:e.getAttribute("data-for-video-loop")==="1",muted:e.getAttribute("data-for-video-muted")==="1",playsinline:e.getAttribute("data-for-video-playsinline")==="1",decorative:e.getAttribute("data-for-video-decorative")==="1"||e.getAttribute("aria-hidden")==="true"}:null}function P(e){Array.from(e.querySelectorAll("figure.for-video, figure.media")).forEach(o=>{var t;if(!o.querySelector("video")||o.hasAttribute("data-for-video-src")&&o.querySelector(".for-video__ratio"))return;let a=h(o);if(!a||!a.src)return;let l=E(o),c=document.createElement("div");c.innerHTML=w(a,l);let d=c.firstElementChild;d&&((t=o.parentNode)==null||t.replaceChild(d,o))})}function W(e){if(!e)return e;let r=document.createElement("div");return r.innerHTML=e,Array.from(r.querySelectorAll("figure.for-video, figure[data-for-video-src]")).forEach(s=>{var t;let a=h(s);if(!a||!a.src)return;let l=E(s),c=document.createElement("div");c.innerHTML=z(a,l);let d=c.firstElementChild;d&&((t=s.parentNode)==null||t.replaceChild(d,s))}),r.innerHTML}function K(e,r){let o=h(r);if(!o||!o.src)return;let s=r.querySelector(".for-video__ratio");if(!s)return;s.innerHTML="";let a=document.createElement("video");if(a.src=m(o.src),o.poster&&(a.poster=m(o.poster)),a.controls=o.controls||!0,o.loop&&(a.loop=!0),o.muted&&(a.muted=!0),o.playsinline&&a.setAttribute("playsinline",""),o.trackSrc){let l=document.createElement("track");l.kind="captions",l.src=m(o.trackSrc),l.srclang=(o.trackLang||"").trim()||"de",l.label=(o.trackLabel||"").trim()||"Untertitel",a.appendChild(l)}a.setAttribute("preload","metadata"),a.style.width="100%",a.style.height="100%",a.style.position="absolute",a.style.top="0",a.style.left="0",a.style.display="block",s.appendChild(a);try{a.play()}catch(l){}r.setAttribute("data-for-video-active","1"),e.nodeChanged()}function Q(e,r){var c;let o=h(r);if(!o)return;let s=E(r),a=document.createElement("div");a.innerHTML=w(o,s);let l=a.firstElementChild;l&&((c=r.parentNode)==null||c.replaceChild(l,r),e.nodeChanged())}function A(e,r,o,s){e.undoManager.transact(()=>{o.forEach(a=>{a&&r.classList.remove(a)}),s&&r.classList.add(s)}),e.nodeChanged()}function V(e,r){if(!e)return"";for(let o of r)if(o.value&&e.classList.contains(o.value))return o.value;return""}function C(e,r,o){let s=r?D({},r):{src:"",poster:"",trackSrc:"",trackLang:"de",trackLabel:"Untertitel",controls:!0,autoplay:!1,loop:!1,muted:!1,playsinline:!0,decorative:!1},a={type:"panel",items:[{type:"input",name:"src",label:"Video-Datei (Mediapool)",placeholder:"z.B. movie.mp4"},{type:"button",name:"pickSrc",text:"Aus Mediapool w\xE4hlen\u2026",icon:"browse"},{type:"input",name:"poster",label:"Poster-Bild (optional)",placeholder:"z.B. poster.jpg"},{type:"button",name:"pickPoster",text:"Poster aus Mediapool w\xE4hlen\u2026",icon:"browse"},{type:"input",name:"trackSrc",label:"Untertitel-Datei (VTT, optional)",placeholder:"z.B. movie.de.vtt"},{type:"button",name:"pickTrack",text:"VTT aus Mediapool w\xE4hlen\u2026",icon:"browse"},{type:"input",name:"trackLang",label:"Untertitel-Sprache (srclang)",placeholder:"z.B. de"},{type:"input",name:"trackLabel",label:"Untertitel-Label",placeholder:"z.B. Deutsch"},{type:"checkbox",name:"controls",label:"Controls anzeigen"},{type:"checkbox",name:"autoplay",label:"Autoplay (setzt muted)"},{type:"checkbox",name:"loop",label:"Loop (Endlosschleife)"},{type:"checkbox",name:"muted",label:"Stumm (muted)"},{type:"checkbox",name:"playsinline",label:"Inline abspielen (iOS, playsinline)"},{type:"checkbox",name:"decorative",label:"Dekorativ / Inhalt ist an anderer Stelle beschrieben"}]},l=e.windowManager.open({title:r?"Video bearbeiten":"Video einf\xFCgen",size:"normal",body:a,buttons:[{type:"cancel",text:"Abbrechen"},{type:"submit",text:r?"\xDCbernehmen":"Einf\xFCgen",primary:!0}],initialData:s,onAction:(c,d)=>{d.name==="pickSrc"?M(t=>{c.setData({src:t})},"videos"):d.name==="pickPoster"?M(t=>{c.setData({poster:t})},"images"):d.name==="pickTrack"&&M(t=>{c.setData({trackSrc:t})})},onSubmit:c=>{let d=c.getData();if(!d.src){e.windowManager.alert("Bitte eine Video-Datei ausw\xE4hlen.");return}c.close(),o(d)}})}function Z(e,r){e.undoManager.transact(()=>{e.insertContent(w(r))}),e.nodeChanged()}function B(e,r,o){let s=E(r),a=document.createElement("div");a.innerHTML=w(o,s);let l=a.firstElementChild;l&&(e.undoManager.transact(()=>{var c;(c=r.parentNode)==null||c.replaceChild(l,r)}),e.nodeChanged())}var J=`
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
`,X=()=>{tinymce.PluginManager.add("for_video",e=>{try{e.options.set("xss_sanitization",!1)}catch(t){}e.on("PreInit",()=>{let t=e.schema;t.addValidElements("figure[class|contenteditable|data-for-video-src|data-for-video-poster|data-for-video-track-src|data-for-video-track-lang|data-for-video-track-label|data-for-video-controls|data-for-video-autoplay|data-for-video-loop|data-for-video-muted|data-for-video-playsinline|data-for-video-decorative|data-for-video-active|aria-hidden|role]"),t.addValidElements("video[src|poster|controls|autoplay|loop|muted|playsinline|preload|width|height|crossorigin]"),t.addValidElements("source[src|type]"),t.addValidElements("track[kind|src|srclang|label|default]"),t.addValidElements("div[class|style|data-for-video-toolbar]"),t.addValidElements("span[class|style|title|id|lang|dir|data-mce-*]"),t.addValidElements("button[type|class|title|aria-label|data-for-video-stop|data-for-video-select]"),t.addValidElements("img[class|src|alt|loading|referrerpolicy|draggable]"),t.addValidElements("svg[viewBox|width|height|xmlns|focusable|aria-hidden]"),t.addValidElements("path[d|fill|fill-opacity|stroke|stroke-width]"),t.addValidElements("rect[x|y|width|height|rx|ry|fill|stroke|stroke-width]"),t.addValidChildren("+figure[video|div|a]"),t.addValidChildren("+video[source|a|track]"),t.addValidChildren("+div[video|div|svg|img|span|button]"),t.addValidChildren("+button[svg]"),t.addValidChildren("+svg[path|rect|g]")}),e.on("init",()=>{e.dom.addStyle(J);let t=e.getBody();t&&P(t)}),e.on("SetContent",()=>{let t=e.getBody();t&&P(t)}),e.on("GetContent",t=>{t.content=W(t.content)}),e.on("PreProcess",t=>{let i=t&&t.node;if(!i||typeof i.getAll!="function")return;i.getAll("figure").forEach(n=>{let p=n.attr("class")||"",y=!!n.attr("data-for-video-src");if(p.indexOf("for-video")===-1&&!y)return;let b={src:n.attr("data-for-video-src")||"",poster:n.attr("data-for-video-poster")||"",trackSrc:n.attr("data-for-video-track-src")||"",trackLang:n.attr("data-for-video-track-lang")||"de",trackLabel:n.attr("data-for-video-track-label")||"Untertitel",controls:n.attr("data-for-video-controls")==="1",autoplay:n.attr("data-for-video-autoplay")==="1",loop:n.attr("data-for-video-loop")==="1",muted:n.attr("data-for-video-muted")==="1",playsinline:n.attr("data-for-video-playsinline")==="1",decorative:n.attr("data-for-video-decorative")==="1"||n.attr("aria-hidden")==="true"};if(!b.src){n.remove();return}let u=p.split(/\s+/).filter(g=>g&&g!=="media"&&$.indexOf(g)===-1),F=z(b,u),x=tinymce.html.DomParser?new tinymce.html.DomParser({validate:!1}).parse(F):null;if(!x||!x.firstChild)return;let _=n.firstChild;for(;_;){let g=_.next;n.remove(_),_=g}(n.attributes?n.attributes.slice():[]).forEach(g=>n.attr(g.name,null));let T=x.firstChild;(T.attributes||[]).forEach(g=>n.attr(g.name,g.value));let k=T.firstChild;for(;k;){let g=k.next;n.append(k),k=g}})}),e.on("click",t=>{let i=t.target;if(!i)return;let f=i.closest("[data-for-video-stop]");if(f){let u=f.closest("figure.for-video");u&&(t.preventDefault(),Q(e,u));return}let n=i.closest("[data-for-video-select]");if(n){let u=n.closest("figure.for-video");u&&(t.preventDefault(),e.selection.select(u),e.nodeChanged());return}let p=i.closest(".for-video__url");if(p){let u=p.closest("figure.for-video");u&&(e.selection.select(u),e.nodeChanged());return}let y=i.closest(".for-video__toolbar");if(y){let u=y.closest("figure.for-video");u&&(e.selection.select(u),e.nodeChanged());return}let b=i.closest(".for-video__ratio, .for-video__play");if(b){let u=b.closest("figure.for-video");u&&u.getAttribute("data-for-video-active")!=="1"&&(t.preventDefault(),K(e,u))}}),e.on("dblclick",t=>{let i=t.target.closest("figure.for-video");if(!i||i.getAttribute("data-for-video-active")==="1")return;let f=h(i);f&&(t.preventDefault(),C(e,f,n=>B(e,i,n)))}),e.addCommand("forVideoInsert",()=>{C(e,null,t=>Z(e,t))}),e.addCommand("forVideoEdit",()=>{let i=e.selection.getNode().closest("figure.for-video");if(!i)return;let f=h(i);f&&C(e,f,n=>B(e,i,n))}),e.ui.registry.addIcon("for-video-icon",'<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/></svg>'),e.ui.registry.addButton("for_video",{icon:"for-video-icon",tooltip:"Lokales Video einf\xFCgen",onAction:()=>e.execCommand("forVideoInsert")}),e.ui.registry.addMenuItem("for_video",{icon:"for-video-icon",text:"Lokales Video\u2026",onAction:()=>e.execCommand("forVideoInsert")});let r=L(e,"videowidth_presets",O),o=L(e,"videoalign_presets",G),s=L(e,"videoratio_presets",R),a=r.map(t=>t.value).filter(Boolean),l=o.map(t=>t.value).filter(Boolean),c=s.map(t=>t.value).filter(Boolean),d=()=>{let t=e.selection.getNode();return t==null?void 0:t.closest("figure.for-video")};e.ui.registry.addMenuButton("for_video_width",{icon:"resize",tooltip:"Breite",fetch:t=>{let i=d(),f=V(i,r);t(r.map(n=>({type:"menuitem",text:(n.value===f?"\u2713 ":"   ")+n.label,onAction:()=>{let p=d();p&&A(e,p,a,n.value)}})))}}),e.ui.registry.addMenuButton("for_video_align",{icon:"align-left",tooltip:"Ausrichtung",fetch:t=>{let i=d(),f=V(i,o);t(o.map(n=>({type:"menuitem",text:(n.value===f?"\u2713 ":"   ")+n.label,onAction:()=>{let p=d();p&&A(e,p,l,n.value)}})))}}),e.ui.registry.addMenuButton("for_video_ratio",{icon:"crop",tooltip:"Seitenverh\xE4ltnis",fetch:t=>{let i=d(),f=V(i,s);t(s.map(n=>({type:"menuitem",text:(n.value===f?"\u2713 ":"   ")+n.label,onAction:()=>{let p=d();p&&A(e,p,c,n.value)}})))}}),e.ui.registry.addButton("for_video_edit",{icon:"edit-block",tooltip:"Video bearbeiten",onAction:()=>e.execCommand("forVideoEdit")}),e.ui.registry.addButton("for_video_remove",{icon:"remove",tooltip:"Video entfernen",onAction:()=>{let t=d();t&&(e.undoManager.transact(()=>{var i;return(i=t.parentNode)==null?void 0:i.removeChild(t)}),e.nodeChanged())}}),e.ui.registry.addContextToolbar("for_video",{predicate:t=>{let i=t;return!!(i&&i.closest&&i.closest("figure.for-video"))},items:"for_video_width for_video_align for_video_ratio | for_video_edit for_video_remove",position:"node"})})},U=X;U();})();
