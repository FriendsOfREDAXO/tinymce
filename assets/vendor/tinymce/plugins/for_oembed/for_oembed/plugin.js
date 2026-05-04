"use strict";(()=>{var S=["for-oembed","for-oembed--youtube","for-oembed--vimeo"],B=[{label:"16:9 (Querformat)",value:""},{label:"4:3",value:"for-oembed--ratio-4-3"},{label:"1:1 (Quadrat)",value:"for-oembed--ratio-1-1"},{label:"9:16 (Hochkant)",value:"for-oembed--ratio-9-16"},{label:"21:9 (Cinemascope)",value:"for-oembed--ratio-21-9"}],P={"16:9":"","4:3":"for-oembed--ratio-4-3","1:1":"for-oembed--ratio-1-1","9:16":"for-oembed--ratio-9-16","21:9":"for-oembed--ratio-21-9"},R=[{label:"Original",value:""},{label:"Klein",value:"for-oembed--w-sm"},{label:"Mittel",value:"for-oembed--w-md"},{label:"Gro\xDF",value:"for-oembed--w-lg"},{label:"Volle Breite",value:"for-oembed--w-full"}],D=[{label:"Keine",value:""},{label:"Links (Umlauf)",value:"for-oembed--align-left"},{label:"Zentriert",value:"for-oembed--align-center"},{label:"Rechts (Umlauf)",value:"for-oembed--align-right"}];function E(e,r,i){try{let n=e.getParam(r);if(Array.isArray(n)&&n.length)return n.map(s=>{var a,c,t,o,d,l;return{label:String((o=(t=(c=(a=s.label)!=null?a:s.title)!=null?c:s.value)!=null?t:s.class)!=null?o:""),value:String((l=(d=s.value)!=null?d:s.class)!=null?l:"").trim()}}).filter(s=>s.label)}catch(n){}return i}function b(e){let r=(e||"").trim();if(!r)return null;let i=[{re:/(?:youtube\.com\/watch\?(?:[^#]*&)*v=([a-zA-Z0-9_-]{6,}))/},{re:/(?:youtu\.be\/([a-zA-Z0-9_-]{6,}))/},{re:/(?:youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,}))/,shorts:!0},{re:/(?:youtube\.com\/embed\/([a-zA-Z0-9_-]{6,}))/},{re:/(?:youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{6,}))/}];for(let s of i){let a=r.match(s.re);if(a)return{provider:"youtube",id:a[1],embedSrc:`https://www.youtube.com/embed/${a[1]}?mute=1&rel=0`,canonicalUrl:s.shorts?`https://www.youtube.com/shorts/${a[1]}`:`https://www.youtube.com/watch?v=${a[1]}`,allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",poster:`https://img.youtube.com/vi/${a[1]}/hqdefault.jpg`,suggestedRatio:s.shorts?"9:16":"16:9"}}let n=[/(?:vimeo\.com\/(?:video\/)?(\d{5,}))/,/(?:player\.vimeo\.com\/video\/(\d{5,}))/];for(let s of n){let a=r.match(s);if(a)return{provider:"vimeo",id:a[1],embedSrc:`https://player.vimeo.com/video/${a[1]}?muted=1`,canonicalUrl:`https://vimeo.com/${a[1]}`,allow:"autoplay; fullscreen; picture-in-picture; clipboard-write"}}return null}function w(e){return e?(e.getAttribute("class")||"").split(/\s+/).filter(Boolean).filter(i=>i!=="media"&&!S.includes(i)):[]}function v(e,r=[]){let i=`for-oembed--${e.provider}`,n=e.provider==="youtube"?"YouTube":"Vimeo",s=["media","for-oembed",i,...r].filter(Boolean).join(" "),a=e.poster?`<img class="for-oembed__poster" src="${u(e.poster)}" alt="" loading="lazy" referrerpolicy="no-referrer" draggable="false">`:"",c=e.poster?` data-for-oembed-poster="${u(e.poster)}"`:"";return`<figure class="${u(s)}" contenteditable="false" data-for-oembed-url="${u(e.canonicalUrl)}" data-for-oembed-provider="${u(e.provider)}" data-for-oembed-id="${u(e.id)}"${c}><div class="for-oembed__toolbar" data-for-oembed-toolbar><span class="for-oembed__badge for-oembed__badge--${u(e.provider)}">${n}</span><span class="for-oembed__url" title="${u(e.canonicalUrl)}">${u(e.canonicalUrl)}</span><button type="button" class="for-oembed__btn for-oembed__btn--stop" data-for-oembed-stop title="Stoppen" aria-label="Stoppen"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="3" width="10" height="10" rx="1.5" ry="1.5" fill="currentColor"/></svg></button><button type="button" class="for-oembed__btn for-oembed__btn--handle" data-for-oembed-select title="Video ausw\xE4hlen" aria-label="Video ausw\xE4hlen"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 4h12v2H2zM2 10h12v2H2z" fill="currentColor"/></svg></button></div><div class="for-oembed__ratio">`+a+'<div class="for-oembed__play" aria-hidden="true"><svg viewBox="0 0 68 48" width="68" height="48" focusable="false"><path d="M66.5 7.7c-.8-2.9-3.1-5.2-6-6C55.3.2 34 .2 34 .2S12.7.2 7.5 1.7C4.6 2.5 2.3 4.8 1.5 7.7 0 13 0 24 0 24s0 11 1.5 16.3c.8 2.9 3.1 5.2 6 6C12.7 47.8 34 47.8 34 47.8s21.3 0 26.5-1.5c2.9-.8 5.2-3.1 6-6C68 35 68 24 68 24s0-11-1.5-16.3z" fill="#212121" fill-opacity=".85"/><path d="M45 24 27 14v20z" fill="#fff"/></svg></div></div></figure>'}function k(e,r=[]){let i=["media",...r].filter(Boolean).join(" ");return`<figure class="${u(i)}"><oembed url="${u(e)}"></oembed></figure>`}function u(e){return String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function L(e){Array.from(e.querySelectorAll("figure.media")).forEach(n=>{let s=n.querySelector("oembed[url]");if(!s)return;let a=s.getAttribute("url")||"",c=b(a);if(!c)return;let t=w(n),o=document.createElement("div");o.innerHTML=v(c,t);let d=o.firstElementChild;d&&n.parentNode&&n.parentNode.replaceChild(d,n)}),Array.from(e.querySelectorAll("oembed[url]")).forEach(n=>{var o;if((o=n.parentElement)!=null&&o.classList.contains("for-oembed"))return;let s=n.getAttribute("url")||"",a=b(s);if(!a)return;let c=document.createElement("div");c.innerHTML=v(a);let t=c.firstElementChild;t&&n.parentNode&&n.parentNode.replaceChild(t,n)})}function O(e){if(!e||e.indexOf("for-oembed")===-1)return e;let r=document.createElement("div");return r.innerHTML=e,r.querySelectorAll("figure.for-oembed").forEach(i=>{let n=i.getAttribute("data-for-oembed-url")||"";if(!n)return;let s=w(i),a=document.createElement("div");a.innerHTML=k(n,s);let c=a.firstElementChild;c&&i.parentNode&&i.parentNode.replaceChild(c,i)}),r.innerHTML}var I=`
figure.for-oembed {
    position: relative;
    display: block;
    width: 100%;
    max-width: 720px;
    margin: 1em 0 2em;
    padding: 0;
    border: 2px solid transparent;
    border-radius: 6px;
    background: #000;
    transition: border-color .15s ease;
    box-sizing: border-box;
}
figure.for-oembed:hover,
figure.for-oembed[data-mce-selected] {
    border-color: #2f80ed !important;
    outline: none !important;
}
figure.for-oembed .for-oembed__ratio {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    /* Fallback f\xFCr Browser ohne aspect-ratio */
    min-height: 240px;
    overflow: hidden;
    border-radius: 4px;
    background-color: #0d0d0d;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    cursor: pointer;
}
figure.for-oembed[data-for-oembed-active="1"] .for-oembed__ratio {
    cursor: default;
}
@supports (aspect-ratio: 16 / 9) {
    figure.for-oembed .for-oembed__ratio {
        min-height: 0;
    }
}
figure.for-oembed .for-oembed__ratio iframe {
    position: absolute;
    inset: 0;
    width: 100% !important;
    height: 100% !important;
    border: 0;
    display: block;
    z-index: 1;
}
figure.for-oembed .for-oembed__poster {
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
figure.for-oembed .for-oembed__play {
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
figure.for-oembed:hover .for-oembed__play {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.05);
}
figure.for-oembed[data-for-oembed-active="1"] .for-oembed__play {
    display: none;
}

/* --- Toolbar-Header \xFCber dem Video (immer anklickbar, bleibt sichtbar wenn iframe aktiv) --- */
figure.for-oembed .for-oembed__toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 6px;
    background: #2a2a2a;
    color: #eee;
    border-radius: 4px 4px 0 0;
    font: 11px/1.3 system-ui, -apple-system, sans-serif;
    user-select: none;
    position: relative;
    z-index: 5;
}
figure.for-oembed .for-oembed__badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 3px;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: #fff;
    flex: none;
}
figure.for-oembed .for-oembed__badge--youtube { background: rgba(255, 0, 0, 0.85); }
figure.for-oembed .for-oembed__badge--vimeo   { background: rgba(26, 183, 234, 0.9); }
figure.for-oembed .for-oembed__url {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #ccc;
    cursor: pointer;
}
figure.for-oembed .for-oembed__url:hover {
    color: #fff;
    text-decoration: underline;
}
figure.for-oembed .for-oembed__btn {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    border-radius: 3px;
    background: rgba(255,255,255,0.12);
    color: #fff;
    cursor: pointer;
    transition: background .15s ease;
}
figure.for-oembed .for-oembed__btn:hover {
    background: rgba(255,255,255,0.25);
}
figure.for-oembed .for-oembed__btn--stop { display: none; }
figure.for-oembed[data-for-oembed-active="1"] .for-oembed__btn--stop { display: inline-flex; }

/* Radius-Anpassung, wenn Toolbar-Header da ist */
figure.for-oembed .for-oembed__toolbar + .for-oembed__ratio {
    border-radius: 0 0 4px 4px;
}

/* Alte ::before/::after Pseudos sind durch den echten Header ersetzt. */

/* --- Default-Presets (werden \xFCberschrieben, falls eigene Klassen per Profil gesetzt) --- */
figure.for-oembed.for-oembed--w-sm    { max-width: 320px; }
figure.for-oembed.for-oembed--w-md    { max-width: 480px; }
figure.for-oembed.for-oembed--w-lg    { max-width: 720px; }
figure.for-oembed.for-oembed--w-full  { max-width: 100%; }

figure.for-oembed.for-oembed--align-left {
    float: left;
    margin: 0 1.25em 1em 0;
    clear: left;
}
figure.for-oembed.for-oembed--align-right {
    float: right;
    margin: 0 0 1em 1.25em;
    clear: right;
}
figure.for-oembed.for-oembed--align-center {
    margin-left: auto;
    margin-right: auto;
    float: none;
}

/* --- Ratio-Varianten (Default = 16:9, siehe .for-oembed__ratio oben) --- */
figure.for-oembed.for-oembed--ratio-4-3    .for-oembed__ratio { aspect-ratio: 4 / 3;  min-height: 320px; }
figure.for-oembed.for-oembed--ratio-1-1    .for-oembed__ratio { aspect-ratio: 1 / 1;  min-height: 320px; }
figure.for-oembed.for-oembed--ratio-9-16   .for-oembed__ratio { aspect-ratio: 9 / 16; min-height: 480px; }
figure.for-oembed.for-oembed--ratio-21-9   .for-oembed__ratio { aspect-ratio: 21 / 9; min-height: 200px; }

/* Hochkant-Videos: engere Max-Breite, damit die Figure nicht riesig wird */
figure.for-oembed.for-oembed--ratio-9-16 {
    max-width: 360px;
}
figure.for-oembed.for-oembed--ratio-1-1 {
    max-width: 480px;
}

@supports (aspect-ratio: 1 / 1) {
    figure.for-oembed.for-oembed--ratio-4-3   .for-oembed__ratio,
    figure.for-oembed.for-oembed--ratio-1-1   .for-oembed__ratio,
    figure.for-oembed.for-oembed--ratio-9-16  .for-oembed__ratio,
    figure.for-oembed.for-oembed--ratio-21-9  .for-oembed__ratio {
        min-height: 0;
    }
}
`;function y(e,r,i){e.windowManager.open({title:"Video einbetten (YouTube / Vimeo)",body:{type:"panel",items:[{type:"input",name:"url",label:"URL",placeholder:"https://www.youtube.com/watch?v=\u2026  oder  https://vimeo.com/\u2026"},{type:"htmlpanel",html:'<p style="color:#888;font-size:12px;margin:4px 0 0;">Unterst\xFCtzt: YouTube, YouTube Shorts, youtu.be, Vimeo. Das Video wird im CKE5-kompatiblen <code>&lt;oembed&gt;</code>-Format gespeichert.</p>'}]},initialData:{url:r},buttons:[{type:"cancel",text:"Abbrechen"},{type:"submit",text:"\xDCbernehmen",primary:!0}],onSubmit:n=>{let a=(n.getData().url||"").toString().trim();if(!b(a)){e.windowManager.alert("Die URL wird nicht unterst\xFCtzt. Es werden YouTube- und Vimeo-URLs erkannt.");return}i(a),n.close()}})}function m(e,r){let i=r||e.selection.getNode();return e.dom.getParent(i,"figure.for-oembed")}function $(e,r){let i=b(r);if(!i)return;let n=[];i.suggestedRatio&&P[i.suggestedRatio]&&n.push(P[i.suggestedRatio]),e.undoManager.transact(()=>{e.insertContent(v(i,n)+"<p>&nbsp;</p>")}),e.nodeChanged()}function C(e,r,i){let n=b(i);if(!n)return;let s=w(r),a=document.createElement("div");a.innerHTML=v(n,s);let c=a.firstElementChild;c&&(e.undoManager.transact(()=>{var t;(t=r.parentNode)==null||t.replaceChild(c,r)}),e.nodeChanged())}function U(e,r){let i=r.getAttribute("data-for-oembed-url")||"",n=b(i);if(!n)return;let s=r.querySelector(".for-oembed__ratio");if(!s)return;s.removeAttribute("style"),s.innerHTML="";let a=document.createElement("iframe");a.src=n.embedSrc+(n.embedSrc.indexOf("?")>=0?"&":"?")+"autoplay=1",a.setAttribute("allow",n.allow),a.setAttribute("allowfullscreen",""),a.setAttribute("frameborder","0"),a.setAttribute("referrerpolicy","strict-origin-when-cross-origin"),s.appendChild(a),r.setAttribute("data-for-oembed-active","1"),e.nodeChanged()}function N(e,r){var t;let i=r.getAttribute("data-for-oembed-url")||"",n=b(i);if(!n)return;let s=w(r),a=document.createElement("div");a.innerHTML=v(n,s);let c=a.firstElementChild;c&&((t=r.parentNode)==null||t.replaceChild(c,r),e.nodeChanged())}function A(e,r,i,n){e.undoManager.transact(()=>{i.forEach(s=>{s&&r.classList.remove(s)}),n&&r.classList.add(n)}),e.nodeChanged()}function T(e,r){if(!e)return"";for(let i of r)if(i.value&&e.classList.contains(i.value))return i.value;return""}function F(e){let r=(e||"").trim();return!r||/\s/.test(r)&&r.split(/\s+/).length>1||!/^https?:\/\//i.test(r)?null:b(r)?r:null}var q=()=>{tinymce.PluginManager.add("for_oembed",e=>{try{e.options.set("sandbox_iframes",!1),e.options.set("convert_unsafe_embeds",!1),e.options.set("xss_sanitization",!1)}catch(t){}e.on("PreInit",()=>{let t=e.schema;try{t.addValidElements("figure[class|contenteditable|data-for-oembed-url|data-for-oembed-provider|data-for-oembed-id|data-for-oembed-poster|data-for-oembed-active]"),t.addValidElements("oembed[url]"),t.addValidElements("iframe[src|width|height|frameborder|allow|allowfullscreen|loading|referrerpolicy]"),t.addValidElements("div[class|style|data-for-oembed-overlay|data-for-oembed-toolbar]"),t.addValidElements("span[class|title]"),t.addValidElements("button[type|class|title|aria-label|data-for-oembed-stop|data-for-oembed-select]"),t.addValidElements("img[class|src|alt|loading|referrerpolicy|draggable]"),t.addValidElements("svg[viewBox|width|height|xmlns|focusable|aria-hidden]"),t.addValidElements("path[d|fill|fill-opacity|stroke|stroke-width]"),t.addValidElements("rect[x|y|width|height|rx|ry|fill|stroke|stroke-width]"),t.addValidChildren("+figure[oembed|div|iframe]"),t.addValidChildren("+div[iframe|div|svg|img|span|button]"),t.addValidChildren("+button[svg]"),t.addValidChildren("+svg[path|rect|g]")}catch(o){}}),e.on("init",()=>{try{e.dom.addStyle(I)}catch(t){}try{L(e.getBody())}catch(t){}}),e.on("SetContent",()=>{try{L(e.getBody())}catch(t){}}),e.on("GetContent",t=>{t&&typeof t.content=="string"&&(t.content=O(t.content))}),e.on("PreProcess",t=>{let o=t&&t.node;if(!o||typeof o.getAll!="function")return;o.getAll("figure").forEach(l=>{let f=l.attr("class")||"";if(f.indexOf("for-oembed")===-1)return;let h=l.attr("data-for-oembed-url")||"";if(!h){l.remove();return}let V=f.split(/\s+/).filter(p=>p&&p!=="media"&&S.indexOf(p)===-1),z=k(h,V),x=tinymce.html.DomParser?new tinymce.html.DomParser({validate:!1}).parse(z):null;if(x&&x.firstChild){let p=l.firstChild;for(;p;){let g=p.next;l.remove(p),p=g}let M=x.firstChild;(l.attributes?l.attributes.slice():[]).forEach(g=>l.attr(g.name,null)),(M.attributes||[]).forEach(g=>l.attr(g.name,g.value));let _=M.firstChild;for(;_;){let g=_.next;l.append(_),_=g}}})}),e.on("PastePreProcess",t=>{if(!t||typeof t.content!="string")return;let o=t.content.replace(/<[^>]*>/g,"").trim(),d=F(o);if(!d)return;let l=b(d);l&&(t.content=v(l))}),e.on("click",t=>{let o=t.target;if(!o||!o.closest)return;let d=m(e,o);if(d){if(o.closest("[data-for-oembed-stop]")){t.preventDefault(),t.stopPropagation(),N(e,d);let l=m(e);l&&e.selection.select(l);return}if(o.closest("[data-for-oembed-select]")||o.closest(".for-oembed__url")){t.preventDefault(),t.stopPropagation(),e.selection.select(d),e.nodeChanged();return}if(o.closest(".for-oembed__toolbar")){t.preventDefault(),t.stopPropagation(),e.selection.select(d),e.nodeChanged();return}if(o.closest(".for-oembed__play")||o.closest(".for-oembed__ratio")){if(d.getAttribute("data-for-oembed-active")==="1")return;t.preventDefault(),t.stopPropagation(),U(e,d)}}}),e.on("dblclick",t=>{let o=t.target,d=m(e,o);if(!d||d.getAttribute("data-for-oembed-active")==="1")return;t.preventDefault(),t.stopPropagation();let l=d.getAttribute("data-for-oembed-url")||"";y(e,l,f=>C(e,d,f))}),e.addCommand("forOembedInsert",()=>{let t=m(e);if(t){let o=t.getAttribute("data-for-oembed-url")||"";y(e,o,d=>C(e,t,d))}else y(e,"",o=>$(e,o))}),e.addCommand("forOembedEdit",()=>{let t=m(e);if(!t)return;let o=t.getAttribute("data-for-oembed-url")||"";y(e,o,d=>C(e,t,d))}),e.ui.registry.addIcon("for-oembed",'<svg width="24" height="24" viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2.5" ry="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/></svg>'),e.ui.registry.addToggleButton("for_oembed",{icon:"for-oembed",tooltip:"Video einbetten (YouTube / Vimeo)",onAction:()=>e.execCommand("forOembedInsert"),onSetup:t=>{let o=()=>t.setActive(!!m(e));return e.on("NodeChange",o),()=>e.off("NodeChange",o)}}),e.ui.registry.addMenuItem("for_oembed",{icon:"for-oembed",text:"Video einbetten (YouTube / Vimeo)",onAction:()=>e.execCommand("forOembedInsert")}),e.ui.registry.addContextToolbar("for_oembed_context",{predicate:t=>{let o=t;return!!(o&&o.nodeType===1&&o.classList&&o.classList.contains("for-oembed"))},items:"for_oembed_width for_oembed_align for_oembed_ratio | for_oembed_preview for_oembed_edit for_oembed_remove",position:"node",scope:"node"});let r=E(e,"oembedwidth_presets",R),i=r.map(t=>t.value).filter(Boolean);e.ui.registry.addMenuButton("for_oembed_width",{icon:"resize",tooltip:"Breite",fetch:t=>{let o=m(e),d=T(o,r);t(r.map(l=>({type:"menuitem",text:l.label+(l.value===d?"  \u2713":""),onAction:()=>{let f=m(e);f&&A(e,f,i,l.value)}})))}});let n=E(e,"oembedalign_presets",D),s=n.map(t=>t.value).filter(Boolean);e.ui.registry.addMenuButton("for_oembed_align",{icon:"align-left",tooltip:"Ausrichtung / Textumlauf",fetch:t=>{let o=m(e),d=T(o,n);t(n.map(l=>({type:"menuitem",text:l.label+(l.value===d?"  \u2713":""),onAction:()=>{let f=m(e);f&&A(e,f,s,l.value)}})))}});let a=E(e,"oembedratio_presets",B),c=a.map(t=>t.value).filter(Boolean);return e.ui.registry.addMenuButton("for_oembed_ratio",{icon:"crop",tooltip:"Seitenverh\xE4ltnis",fetch:t=>{let o=m(e),d=T(o,a);t(a.map(l=>({type:"menuitem",text:l.label+(l.value===d?"  \u2713":""),onAction:()=>{let f=m(e);if(f&&(A(e,f,c,l.value),f.getAttribute("data-for-oembed-active")==="1")){let h=f.querySelector(".for-oembed__ratio iframe");h&&(h.src=h.src)}}})))}}),e.ui.registry.addButton("for_oembed_edit",{icon:"edit-block",tooltip:"URL bearbeiten",onAction:()=>e.execCommand("forOembedEdit")}),e.ui.registry.addButton("for_oembed_preview",{icon:"preview",tooltip:"Video in neuem Tab \xF6ffnen",onAction:()=>{let t=m(e),o=t==null?void 0:t.getAttribute("data-for-oembed-url");o&&window.open(o,"_blank","noopener,noreferrer")}}),e.ui.registry.addButton("for_oembed_remove",{icon:"remove",tooltip:"Video entfernen",onAction:()=>{let t=m(e);t&&(e.undoManager.transact(()=>{var o;(o=t.parentNode)==null||o.removeChild(t)}),e.nodeChanged())}}),{getMetadata:()=>({name:"FriendsOfREDAXO oEmbed",url:"https://github.com/FriendsOfREDAXO/tinymce"})}})},H=q;H();})();
