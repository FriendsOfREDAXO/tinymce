(()=>{var Q=[{label:"Original",class:""},{label:"Klein (150px)",class:"img-width-small"},{label:"Mittel (300px)",class:"img-width-medium"},{label:"Gro\xDF (600px)",class:"img-width-large"},{label:"100%",class:"img-width-full"}],ee=[{label:"Keine",class:""},{label:"Links",class:"img-align-left"},{label:"Rechts",class:"img-align-right"},{label:"Zentriert",class:"img-align-center"}],te=[{label:"Kein Effekt",class:""}],z=class{constructor(n){this.cache=null;this.editor=n}get(){if(this.cache)return this.cache;let n=c=>{var a,m,f;let l=this.editor.options.get(c);return(!l||Array.isArray(l)&&l.length===0)&&(l=(a=this.editor.settings)==null?void 0:a[c]),(!l||Array.isArray(l)&&l.length===0)&&(l=(f=(m=this.editor).getParam)==null?void 0:f.call(m,c,null)),l},s=(c,l)=>Array.isArray(c)&&c.length>0?c:l;return this.cache={widthPresets:s(n("imagewidth_presets"),Q),alignPresets:s(n("imagealign_presets"),ee),effectPresets:s(n("imageeffect_presets"),te)},this.cache}invalidate(){this.cache=null}getAllClasses(n){let s=[];return n.forEach(c=>{c.class&&c.class.split(/\s+/).forEach(l=>{l&&!s.includes(l)&&s.push(l)})}),s}};function ie(e){let n=e.parentElement;return!n||n.nodeName!=="A"?null:Array.from(n.childNodes).every(c=>c===e||c.nodeType===Node.TEXT_NODE&&(c.textContent||"").trim()==="")?n:null}function y(e){var s;if(e.nodeName==="FIGURE")return e;let n=e.parentElement;return n&&n.nodeName==="FIGURE"?n:n&&n.nodeName==="A"&&((s=n.parentElement)==null?void 0:s.nodeName)==="FIGURE"?n.parentElement:null}function ne(e){return(e.textContent||"").trim()===""&&!e.querySelector("img, picture, video, audio, iframe, object, embed, svg, input, figure, table")}function L(e,n){let s=y(n);if(s)return s;let l=e.getDoc().createElement("figure"),a=ie(n)||n,m=a.parentElement,f=m?m.closest("p"):null;return f&&f.parentNode&&!f.contains(e.getBody())?(f.parentNode.insertBefore(l,f),l.appendChild(a),ne(f)&&f.remove()):m&&(m.insertBefore(l,a),l.appendChild(a)),l}function h(e){let n=e.selection.getNode();if(n.nodeName==="IMG")return n;if(n.nodeName==="FIGURE")return n.querySelector("img");if(n.nodeName==="FIGCAPTION"){let s=n.parentElement;if((s==null?void 0:s.nodeName)==="FIGURE")return s.querySelector("img")}return null}function K(e,n){let s=n!=null?n:e.getBody();s&&Array.from(s.querySelectorAll("img, figure")).forEach(c=>{if(c.nodeName==="IMG"){let f=c.parentElement;f&&f.nodeName==="FIGURE"||L(e,c);return}let l=c;if(l.querySelector("img"))return;let a=l.children.length>0,m=(l.textContent||"").trim()!=="";!a&&!m&&l.remove()})}function H(e,n,s){if(n.forEach(c=>e.classList.remove(c)),s){let c=[];e.classList.forEach(a=>{(a==="image"||a==="image_resized"||a.startsWith("image-style-")||a.startsWith("img-width-")||a.startsWith("img-height-"))&&c.push(a)}),c.forEach(a=>e.classList.remove(a));let l=e.style.width;l&&l.includes("%")&&(e.style.removeProperty("width"),e.getAttribute("style")===""&&e.removeAttribute("style"))}}function T(e){let n=[];return e.forEach(s=>{s.class&&s.class.split(/\s+/).forEach(c=>{c&&!n.includes(c)&&n.push(c)})}),n}function R(e){let n=T(e).join(" ");return n.includes("uk-width")?"uk-width-1-1":/\bw-\d/.test(n)?"w-100":""}function O(e,n){e.removeAttribute("data-mce-style"),e.classList.remove("uk-width-1-1","w-100"),e.style.removeProperty("width"),n?e.classList.add(n):e.style.width="100%"}function re(e,n,s,c,l=!1){let a=s.class?L(e,n):y(n),m=R(c),f=T(c);a&&(H(a,f,l),s.class?(s.class.split(/\s+/).forEach(d=>{d&&a.classList.add(d)}),O(n,m)):m&&(m.split(/\s+/).forEach(d=>{d&&n.classList.remove(d)}),n.classList.length===0&&n.removeAttribute("class")),a.classList.length===0&&a.removeAttribute("class")),n.style.removeProperty("width"),n.style.removeProperty("height"),n.getAttribute("style")===""&&n.removeAttribute("style"),e.nodeChanged(),e.undoManager.add()}function se(e,n,s,c,l=!1){if(s.class){let a=L(e,n),m=s.class.split(/\s+/).filter(d=>d);m.every(d=>a.classList.contains(d))?m.forEach(d=>a.classList.remove(d)):m.forEach(d=>a.classList.add(d)),l&&H(a,T(c),!0),a.classList.length===0&&a.removeAttribute("class")}else{let a=y(n);a&&(H(a,T(c),l),a.classList.length===0&&a.removeAttribute("class"))}e.nodeChanged(),e.undoManager.add()}function C(e,n,s,c){re(e,n,s,c,!!e.options.get("image_compat_warn"))}function X(e,n,s,c){let l=y(n);l&&G(l),C(e,n,s,c)}function ae(e,n,s,c){se(e,n,s,c,!!e.options.get("image_compat_warn"))}function P(e,n){let c=y(e)||e;for(let l of n){if(!l.class)continue;let a=l.class.split(/\s+/).filter(m=>m);if(a.length>0&&a.every(m=>c.classList.contains(m)))return l}return null}function F(e,n){let c=y(e)||e,l=[];for(let a of n){if(!a.class)continue;let m=a.class.split(/\s+/).filter(f=>f);m.length>0&&m.every(f=>c.classList.contains(f))&&l.push(a)}return l}var oe={left:["float-left","float-start","align-left","uk-float-left"],right:["float-right","float-end","align-right","uk-float-right"],center:["margin-auto","mx-auto","align-center"]};function B(e,n){return!!e&&!!e.class&&oe[n].some(s=>e.class.includes(s))}function I(e,n){return e.find(s=>B(s,n))}var le='figure.image, .image_resized, [class*="image-style-"]';function V(e){return!!e&&!!e.querySelector(le)}var ce={"image-style-align-left":"left","image-style-block-align-left":"left","image-style-align-right":"right","image-style-block-align-right":"right","image-style-side":"right","image-style-align-center":"center","image-style-align-block-center":"center","image-style-inline":"","image-style-full":""};function ge(e){if(!e.class)return null;let n=e.label||"",s=n.match(/(\d+(?:[.,]\d+)?)\s*%/);if(s)return{value:parseFloat(s[1].replace(",",".")),unit:"%"};let c=n.match(/(\d+(?:[.,]\d+)?)\s*px/i);if(c)return{value:parseFloat(c[1].replace(",",".")),unit:"px"};let l=" "+e.class+" ",a=l.match(/\suk-width-(\d+)-(\d+)(?:@\w+)?\s/);return a&&+a[2]>0?{value:+a[1]/+a[2]*100,unit:"%"}:(a=l.match(/\s(?:img-width-|w-)(\d+)\s/),a?{value:+a[1],unit:"%"}:/\s(?:img-width-full|w-100)\s/.test(l)?{value:100,unit:"%"}:(a=l.match(/\scol(?:-\w+)?-(\d+)\s/),a?{value:+a[1]/12*100,unit:"%"}:null))}function ue(e,n,s){return e.find(c=>{let l=ge(c);return!!l&&l.unit===s&&Math.abs(l.value-n)<.5})}function fe(e,n){if(Object.prototype.hasOwnProperty.call(n.map,e))return n.map[e]||"";let s=ce[e];if(s===void 0)return null;if(s==="")return"";let c=n.alignPresets.find(a=>a.class.split(/\s+/).includes(e));if(c)return c.class;let l=I(n.alignPresets,s);return l?l.class:e}function Y(e,n){n.split(/\s+/).forEach(s=>{s&&e.classList.add(s)})}function G(e){e.removeAttribute("data-mce-style"),e.style.removeProperty("width"),(e.getAttribute("style")===""||e.getAttribute("style")===null)&&e.removeAttribute("style")}function me(e,n,s){if(!V(n))return 0;let c=new Set;n.querySelectorAll("img").forEach(a=>{let m=a,f=y(m),d=E=>!!E&&(E.classList.contains("image_resized")||E.nodeName==="FIGURE"&&E.classList.contains("image")||Array.from(E.classList).some(k=>k.startsWith("image-style-")));(d(m)||d(f))&&c.add(m)});let l=0;return c.forEach(a=>{let m=!!y(a),f=L(e,a);if(!f.contains(a))return;let d=[],E=w=>{Array.from(w.classList).forEach(b=>{(b==="image_resized"||b.startsWith("image-style-"))&&(d.push(b),w.classList.remove(b))})};E(a),E(f);let k=f.style.width||a.style.width||"";if(G(a),G(f),d.forEach(w=>{if(w==="image_resized")return;let b=fe(w,s);Y(f,b===null?w:b)}),k){let w=k.trim().match(/^(\d+(?:\.\d+)?)(%|px)$/),b=w?ue(s.widthPresets,parseFloat(w[1]),w[2]):void 0;b?Y(f,b.class):f.style.width=k}(f.classList.length>0||f.style.width)&&O(a,s.fullWidthClass),a.classList.length===0&&a.removeAttribute("class"),f.classList.length===0&&f.removeAttribute("class"),(!m||d.length>0||k)&&l++}),l}var de=`
  figure {
    margin: 0;
    padding: 0;
    display: table;
    max-width: 100%;
    box-sizing: border-box;
  }
  figure {
    cursor: default;
  }
  figure > figcaption {
    display: table-caption;
    caption-side: bottom;
    padding: 0.5em;
    background: rgba(0,0,0,0.03);
    font-size: 0.9em;
    color: #666;
    text-align: center;
    min-height: 1.5em;
    outline: none;
    cursor: text;
  }
  figure > figcaption:empty::before {
    content: 'Bildunterschrift eingeben...';
    color: #999;
    font-style: italic;
  }
  figure > figcaption:focus {
    background: rgba(0,120,215,0.05);
    outline: 1px dashed rgba(0,120,215,0.3);
  }
  figure > img {
    width: 100% !important;
    height: auto !important;
    display: block;
  }
  
  /* IMG full width classes for frameworks */
  img.uk-width-1-1 { width: 100% !important; height: auto !important; }
  img.w-100 { width: 100% !important; height: auto !important; }

  /* GENERAL WIDTH */
  figure.img-width-small  { width: 150px !important; }
  figure.img-width-medium { width: 300px !important; }
  figure.img-width-large  { width: 600px !important; }
  figure.img-width-xlarge { width: 900px !important; }
  figure.img-width-25     { width: 25% !important; }
  figure.img-width-33     { width: 33.333% !important; }
  figure.img-width-50     { width: 50% !important; }
  figure.img-width-66     { width: 66.666% !important; }
  figure.img-width-75     { width: 75% !important; }
  figure.img-width-full   { width: 100% !important; display: block !important; }

  /* GENERAL ALIGN */
  figure.img-align-left   { float: left !important; margin: 0 1.5em 1em 0 !important; }
  figure.img-align-right  { float: right !important; margin: 0 0 1em 1.5em !important; }
  figure.img-align-center { display: table !important; margin-left: auto !important; margin-right: auto !important; float: none !important; }
  figure.img-align-none   { float: none !important; margin: 0 0 1em 0 !important; }

  /* GENERAL EFFECTS */
  figure.img-shadow-small  { box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important; }
  figure.img-shadow-medium { box-shadow: 0 5px 15px rgba(0,0,0,0.12) !important; }
  figure.img-shadow-large  { box-shadow: 0 14px 25px rgba(0,0,0,0.16) !important; }
  figure.img-rounded > img { border-radius: 5px !important; }
  figure.img-rounded-large > img { border-radius: 10px !important; }
  figure.img-circle > img  { border-radius: 50% !important; }
  figure.img-border > img  { border: 1px solid #e5e5e5 !important; }
  figure.img-border-dark > img { border: 1px solid #333 !important; }

  /* UIKIT WIDTH */
  figure[class*="uk-width-1-1"]   { width: 100% !important; display: block !important; }
  figure[class*="uk-width-4-5"]   { width: 80% !important; }
  figure[class*="uk-width-3-4"]   { width: 75% !important; }
  figure[class*="uk-width-2-3"]   { width: 66.6% !important; }
  figure[class*="uk-width-3-5"]   { width: 60% !important; }
  figure[class*="uk-width-1-2"]   { width: 50% !important; }
  figure[class*="uk-width-2-5"]   { width: 40% !important; }
  figure[class*="uk-width-1-3"]   { width: 33.3% !important; }
  figure[class*="uk-width-1-4"]   { width: 25% !important; }
  figure[class*="uk-width-1-5"]   { width: 20% !important; }
  figure[class*="uk-width-1-6"]   { width: 16.6% !important; }
  figure[class*="uk-width-auto"]  { width: auto !important; }
  figure[class*="uk-width-small"] { width: 150px !important; }
  figure[class*="uk-width-medium"]{ width: 300px !important; }
  figure[class*="uk-width-large"] { width: 450px !important; }
  figure[class*="uk-width-xlarge"]{ width: 600px !important; }
  figure[class*="uk-width-2xlarge"]{ width: 750px !important; }

  /* UIKIT ALIGN */
  figure.uk-float-left    { float: left !important; }
  figure.uk-float-right   { float: right !important; }
  figure.uk-display-block { display: block !important; }
  figure.uk-margin-auto   { margin-left: auto !important; margin-right: auto !important; }
  figure.uk-margin-right, figure.uk-margin-small-right  { margin-right: 1em !important; }
  figure.uk-margin-left, figure.uk-margin-small-left    { margin-left: 1em !important; }
  figure.uk-margin-bottom, figure.uk-margin-small-bottom { margin-bottom: 1em !important; }

  /* UIKIT EFFECTS */
  figure.uk-box-shadow-small  { box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important; }
  figure.uk-box-shadow-medium { box-shadow: 0 5px 15px rgba(0,0,0,0.08) !important; }
  figure.uk-box-shadow-large  { box-shadow: 0 14px 25px rgba(0,0,0,0.16) !important; }
  figure.uk-box-shadow-xlarge { box-shadow: 0 28px 50px rgba(0,0,0,0.16) !important; }
  figure.uk-border-rounded > img { border-radius: 5px !important; }
  figure.uk-border-circle > img  { border-radius: 50% !important; }
  figure.uk-border > img         { border: 1px solid #e5e5e5 !important; }

  /* BOOTSTRAP COL */
  figure[class*="col-1"]  { width: 8.33% !important; }
  figure[class*="col-2"]  { width: 16.66% !important; }
  figure[class*="col-3"]  { width: 25% !important; }
  figure[class*="col-4"]  { width: 33.33% !important; }
  figure[class*="col-5"]  { width: 41.66% !important; }
  figure[class*="col-6"]  { width: 50% !important; }
  figure[class*="col-7"]  { width: 58.33% !important; }
  figure[class*="col-8"]  { width: 66.66% !important; }
  figure[class*="col-9"]  { width: 75% !important; }
  figure[class*="col-10"] { width: 83.33% !important; }
  figure[class*="col-11"] { width: 91.66% !important; }
  figure[class*="col-12"] { width: 100% !important; display: block !important; }

  /* BOOTSTRAP ALIGN */
  figure.float-start { float: left !important; }
  figure.float-end   { float: right !important; }
  figure.d-block     { display: block !important; }
  figure.mx-auto     { margin-left: auto !important; margin-right: auto !important; }
  figure.me-3        { margin-right: 1rem !important; }
  figure.ms-3        { margin-left: 1rem !important; }
  figure.mb-3        { margin-bottom: 1rem !important; }

  /* BOOTSTRAP EFFECTS */
  figure.shadow-sm { box-shadow: 0 .125rem .25rem rgba(0,0,0,.075) !important; }
  figure.shadow    { box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important; }
  figure.shadow-lg { box-shadow: 0 1rem 3rem rgba(0,0,0,.175) !important; }
  figure.rounded > img   { border-radius: .375rem !important; }
  figure.rounded-circle > img { border-radius: 50% !important; }
  figure.border > img    { border: 1px solid #dee2e6 !important; }

  /* VISUAL INDICATOR */
  figure[class] {
    outline: 2px dashed rgba(0,120,215,0.35);
    outline-offset: 2px;
  }
  figure[class]:hover {
    outline-color: rgba(0,120,215,0.8);
  }
`,pe=(e,n)=>{e.options.register("imagewidth_presets",{processor:"object[]",default:[]}),e.options.register("imagealign_presets",{processor:"object[]",default:[]}),e.options.register("imageeffect_presets",{processor:"object[]",default:[]}),e.options.register("image_compat_warn",{processor:"boolean",default:!1}),e.options.register("image_cke5_import",{processor:"boolean",default:!0}),e.options.register("image_cke5_map",{processor:"object",default:{}}),e.options.register("image_caption",{processor:"boolean",default:!1});let s=new z(e),c=!!e.options.get("image_compat_warn"),l=e.options.get("image_cke5_import")!==!1,a=()=>{let t=s.get(),i=e.options.get("image_cke5_map"),r={};return i&&typeof i=="object"&&!Array.isArray(i)&&Object.keys(i).forEach(o=>{typeof i[o]=="string"&&(r[o]=i[o])}),{widthPresets:t.widthPresets,alignPresets:t.alignPresets,map:r,fullWidthClass:R(t.widthPresets)}},m=t=>!t||!V(t)?!1:(l&&me(e,t,a()),!0),f=!1,d=!1,E=()=>{if(!(f||!c)){f=!0;try{e.notificationManager.open({type:"warning",text:l?"Hinweis: Dieser Inhalt enthielt Bildmarkup aus dem alten CKEditor 5. Ausrichtung und Breite wurden automatisch \xFCbernommen. Bitte die Bilder kurz pr\xFCfen und den Beitrag speichern, damit das Markup einheitlich wird.":"Hinweis: Dieser Inhalt enth\xE4lt Bildmarkup aus dem alten CKEditor 5 (z. B. figure.image, image-style-\u2026). Bitte die betroffenen Bilder mit der neuen Bildformatierungs-Toolbar (Breite, Ausrichtung, Effekte) erneut formatieren und den Beitrag speichern, damit das Markup einheitlich wird.",closeButton:!0,timeout:12e3})}catch(t){}}};e.ui.registry.addIcon("for_imagedialog",'<svg width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="12" rx="1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/><path d="M3 13l4-4 3 3 4-5 7 6"/><path d="M3 19h6M15 19h6"/><circle cx="12" cy="19" r="1.8" fill="currentColor" stroke="none"/></g></svg>'),e.ui.registry.addIcon("for_imagealignleft_icon",'<svg width="24" height="24" viewBox="0 0 20 20"><path fill="currentColor" opacity=".55" d="M2 3h16v1.5H2zM2 15h16v1.5H2z"/><rect x="2" y="7" width="10" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/><path fill="currentColor" d="M14 8h4v1.4h-4zM14 10.6h3.2V12H14zM14 13.2h3.8v1.3H14z"/></svg>'),e.ui.registry.addIcon("for_imagealigncenter_icon",'<svg width="24" height="24" viewBox="0 0 20 20"><path fill="currentColor" opacity=".55" d="M2 3h16v1.5H2zM2 15h16v1.5H2z"/><rect x="5" y="7" width="10" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'),e.ui.registry.addIcon("for_imagealignright_icon",'<svg width="24" height="24" viewBox="0 0 20 20"><path fill="currentColor" opacity=".55" d="M2 3h16v1.5H2zM2 15h16v1.5H2z"/><path fill="currentColor" d="M2 8h4v1.4H2zM2 10.6h3.2V12H2zM2 13.2h3.8v1.3H2z"/><rect x="8" y="7" width="10" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'),e.ui.registry.addIcon("for_imagealignnone_icon",'<svg width="24" height="24" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="12" rx="1.5" fill="#6b7280"/><circle cx="8.5" cy="9" r="0.9" fill="#ffffff"/><path d="M7.2 14l1.6-2 1.2 1.4 1.3-1.8 1.8 2.4" fill="none" stroke="#ffffff" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.8 18.2l12.4-12.4" stroke="#6b7280" stroke-width="1.8" stroke-linecap="round"/></svg>'),e.ui.registry.addIcon("for_imageswappool_icon",'<svg width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8H6m0 0l4-4m-4 4l4 4"/><path d="M8 16h10m0 0l-4-4m4 4l-4 4"/></g></svg>'),e.on("init",()=>{let t=e.getDoc();if(t){let g=t.createElement("style");g.setAttribute("data-for-images-plugin","1"),g.textContent=de,t.head.appendChild(g)}let i=s.get(),r=R(i.widthPresets);e.getBody().querySelectorAll("figure").forEach(g=>{let u=g,v=u.querySelector("img");v&&u.classList.length>0&&O(v,r)}),d&&E()}),e.on("SetContent",()=>{m(e.getBody())&&(d=!0),K(e),d&&e.initialized&&E()}),e.on("PastePreProcess",t=>{if(!l||typeof(t==null?void 0:t.content)!="string"||t.content.indexOf("image")===-1)return;let i=e.getDoc().createElement("div");i.innerHTML=t.content,m(i)&&(t.content=i.innerHTML)}),e.on("PastePostProcess",t=>{t!=null&&t.node&&K(e,t.node)}),e.on("ObjectResizeStart",t=>{var i;((i=t.target)==null?void 0:i.nodeName)==="IMG"&&t.preventDefault()}),e.options.set("object_resizing",!1);let k=e.options.isRegistered;typeof k=="function"&&k.call(e.options,"quickbars_image_toolbar")&&e.options.set("quickbars_image_toolbar",!1),e.options.set("image_caption",!1);let w=()=>{let t=h(e);if(!t)return null;let i=y(t);return i&&i.nodeName==="FIGURE"?i:null},b=()=>{let t=w();return t?(e.selection.select(t,!0),e.nodeChanged(),!0):!1},N=(t,i)=>{let r="";try{r=e.serializer.serialize(t,{getInner:!1})}catch(o){r=""}if(!r){let o=t.cloneNode(!0);Array.from(o.querySelectorAll("img")).forEach(g=>{let u=g.getAttribute("data-mce-src");u&&g.setAttribute("src",u)}),r=o.outerHTML.replace(/\sdata-mce-[a-z-]+="[^"]*"/g,"")}i.setData("text/html",r),i.setData("text/plain",t.textContent||"")},S=t=>{e.undoManager.transact(()=>{e.dom.remove(t)}),e.nodeChanged()};e.on("copy",t=>{let i=w();!i||!t.clipboardData||(N(i,t.clipboardData),t.preventDefault())}),e.on("cut",t=>{let i=w();!i||!t.clipboardData||(N(i,t.clipboardData),t.preventDefault(),S(i))});let W="application/x-for-images-move",_=null;e.on("dragstart",t=>{let i=t.target;if(!i||!t.dataTransfer)return;let r=i.nodeName==="IMG"?i:i.nodeName==="FIGURE"?i.querySelector("img"):null,o=r?y(r):null;!o||o.nodeName!=="FIGURE"||(_=o,N(o,t.dataTransfer),t.dataTransfer.setData(W,"1"),t.dataTransfer.effectAllowed="move")}),e.on("dragend",()=>{_=null}),e.on("drop",t=>{var v;let i=_;if(!i||!t.dataTransfer||!Array.from(t.dataTransfer.types||[]).includes(W))return;t.preventDefault(),(v=t.stopImmediatePropagation)==null||v.call(t),_=null;let r=e.getDoc(),o=null;if(typeof r.caretRangeFromPoint=="function"){let x=r.caretRangeFromPoint(t.clientX,t.clientY);o=x?x.startContainer:null}else if(typeof r.caretPositionFromPoint=="function"){let x=r.caretPositionFromPoint(t.clientX,t.clientY);o=x?x.offsetNode:null}o||(o=r.elementFromPoint(t.clientX,t.clientY));let g=e.getBody(),u=o&&o.nodeType===1?o:o?o.parentElement:null;for(;u&&u.parentElement&&u.parentElement!==g;)u=u.parentElement;!u||u===g||u===i||i.contains(u)||(e.undoManager.transact(()=>{u.parentNode.insertBefore(i,u)}),e.selection.select(i.querySelector("img")||i),e.nodeChanged())},!0),e.on("keydown",t=>{let i=String(t.key||"").toLowerCase();if(i==="delete"||i==="backspace"){let r=w();if(r){t.preventDefault(),S(r);return}}(t.ctrlKey||t.metaKey)&&(i==="c"||i==="x")&&b()}),e.on("BeforeExecCommand",t=>{let i=String(t.command||"").toLowerCase();if(i==="copy"||i==="cut"){b();return}if(i==="delete"||i==="forwarddelete"||i==="mcedelete"){let r=w();if(!r)return;t.preventDefault(),S(r)}}),e.ui.registry.addMenuButton("imagewidth",{icon:"resize",tooltip:"Bildbreite",fetch:t=>{let i=h(e);if(!i){t([]);return}let r=s.get(),o=P(i,r.widthPresets);t(r.widthPresets.map(g=>({type:"menuitem",text:g.label,icon:o&&o.class===g.class?"checkmark":void 0,onAction:()=>X(e,i,g,r.widthPresets)})))}}),e.ui.registry.addToggleButton("for_imagealignleft",{icon:"for_imagealignleft_icon",tooltip:"Bild links",onAction:()=>{let t=h(e);if(!t)return;let i=s.get(),r=I(i.alignPresets,"left"),o=P(t,i.alignPresets);o&&r&&o.class===r.class?C(e,t,{label:"",class:""},i.alignPresets):r&&C(e,t,r,i.alignPresets)},onSetup:t=>{let i=()=>{let r=h(e);if(!r){t.setActive(!1);return}let o=s.get(),g=P(r,o.alignPresets);t.setActive(B(g,"left"))};return e.on("NodeChange",i),()=>e.off("NodeChange",i)}}),e.ui.registry.addToggleButton("for_imagealigncenter",{icon:"for_imagealigncenter_icon",tooltip:"Bild zentrieren",onAction:()=>{let t=h(e);if(!t)return;let i=s.get(),r=I(i.alignPresets,"center"),o=P(t,i.alignPresets);o&&r&&o.class===r.class?C(e,t,{label:"",class:""},i.alignPresets):r&&C(e,t,r,i.alignPresets)},onSetup:t=>{let i=()=>{let r=h(e);if(!r){t.setActive(!1);return}let o=s.get(),g=P(r,o.alignPresets);t.setActive(B(g,"center"))};return e.on("NodeChange",i),()=>e.off("NodeChange",i)}}),e.ui.registry.addToggleButton("for_imagealignright",{icon:"for_imagealignright_icon",tooltip:"Bild rechts",onAction:()=>{let t=h(e);if(!t)return;let i=s.get(),r=I(i.alignPresets,"right"),o=P(t,i.alignPresets);o&&r&&o.class===r.class?C(e,t,{label:"",class:""},i.alignPresets):r&&C(e,t,r,i.alignPresets)},onSetup:t=>{let i=()=>{let r=h(e);if(!r){t.setActive(!1);return}let o=s.get(),g=P(r,o.alignPresets);t.setActive(B(g,"right"))};return e.on("NodeChange",i),()=>e.off("NodeChange",i)}}),e.ui.registry.addButton("for_imagealignnone",{icon:"for_imagealignnone_icon",tooltip:"Ausrichtung entfernen",onAction:()=>{let t=h(e);if(!t)return;let i=s.get();C(e,t,{label:"",class:""},i.alignPresets)}}),e.ui.registry.addMenuButton("imageeffect",{icon:"color-picker",tooltip:"Bild-Effekte",fetch:t=>{let i=h(e);if(!i){t([]);return}let r=s.get(),o=F(i,r.effectPresets);t(r.effectPresets.map(g=>({type:"togglemenuitem",text:g.label,active:g.class===""?o.length===0:o.some(u=>u.class===g.class),onAction:()=>ae(e,i,g,r.effectPresets)})))}}),e.ui.registry.addButton("imagewidthdialog",{icon:"for_imagedialog",tooltip:"Bildformatierung",onAction:()=>{let t=h(e);if(!t){e.notificationManager.open({text:"Bitte zuerst ein Bild ausw\xE4hlen.",type:"warning",timeout:3e3});return}let i=s.get(),r=P(t,i.widthPresets),o=P(t,i.alignPresets),g=F(t,i.effectPresets),u=i.widthPresets.map(p=>({text:p.label,value:p.class})),v=i.alignPresets.map(p=>({text:p.label,value:p.class})),x=i.effectPresets.filter(p=>p.class).map(p=>({type:"checkbox",name:"effect_"+p.class.replace(/\s+/g,"_"),label:p.label})),q={widthClass:(r==null?void 0:r.class)||"",alignClass:(o==null?void 0:o.class)||""};i.effectPresets.filter(p=>p.class).forEach(p=>{q["effect_"+p.class.replace(/\s+/g,"_")]=g.some(M=>M.class===p.class)});let U=[{type:"selectbox",name:"widthClass",label:"Breite",items:u},{type:"selectbox",name:"alignClass",label:"Ausrichtung",items:v}];x.length>0&&U.push({type:"bar",items:x}),e.windowManager.open({title:"Bildformatierung",size:"normal",body:{type:"panel",items:U},buttons:[{type:"cancel",name:"cancel",text:"Abbrechen"},{type:"submit",name:"save",text:"\xDCbernehmen",primary:!0}],initialData:q,onSubmit:p=>{let M=p.getData(),$=i.widthPresets.find(A=>A.class===M.widthClass)||{label:"",class:""};X(e,t,$,i.widthPresets);let J=i.alignPresets.find(A=>A.class===M.alignClass)||{label:"",class:""};C(e,t,J,i.alignPresets);let D=y(t);D&&(H(D,T(i.effectPresets),!1),i.effectPresets.filter(A=>A.class).forEach(A=>{M["effect_"+A.class.replace(/\s+/g,"_")]&&A.class.split(/\s+/).forEach(j=>{j&&D.classList.add(j)})})),e.nodeChanged(),e.undoManager.add(),p.close()}})}}),e.ui.registry.addContextToolbar("for_imagestoolbar",{predicate:t=>t.nodeName==="IMG"||t.nodeName==="FIGURE"&&t.querySelector("img"),items:"imagewidth for_imagealignleft for_imagealigncenter for_imagealignright imageeffect for_imagealignnone | imagealt imagecaption imageshowpool imageswappool",position:"node",scope:"node"}),e.ui.registry.addToggleButton("imagealt",{icon:"accessibility-check",tooltip:"Alt-Text bearbeiten",onAction:()=>{let t=h(e);if(!t)return;let i=t.getAttribute("alt")||"";e.windowManager.open({title:"Alt-Text (Bildbeschreibung)",body:{type:"panel",items:[{type:"input",name:"alttext",label:"Beschreibung f\xFCr Screenreader",placeholder:'z.B. "Rotes Auto vor blauem Himmel"'},{type:"htmlpanel",html:'<p style="color:#666;font-size:12px;margin-top:8px;">Beschreiben Sie den Bildinhalt kurz und pr\xE4gnant f\xFCr Menschen die das Bild nicht sehen k\xF6nnen.</p>'}]},initialData:{alttext:i},buttons:[{type:"cancel",text:"Abbrechen"},{type:"submit",text:"Speichern",primary:!0}],onSubmit:r=>{let o=r.getData();t.setAttribute("alt",o.alttext),e.nodeChanged(),e.undoManager.add(),r.close()}})},onSetup:t=>{let i=()=>{let r=h(e);if(!r){t.setActive(!1);return}let o=r.getAttribute("alt");t.setActive(!!o&&o.trim()!=="")};return e.on("NodeChange",i),i(),()=>e.off("NodeChange",i)}}),e.ui.registry.addToggleButton("imagecaption",{icon:"comment",tooltip:"Bildunterschrift",onAction:()=>{var r;let t=h(e);if(!t)return;let i=y(t);if(i){let o=i.querySelector("figcaption");if(o)(r=o.textContent)!=null&&r.trim()?e.selection.setCursorLocation(o,0):o.remove();else{let u=e.getDoc().createElement("figcaption");u.innerHTML="&nbsp;",i.appendChild(u),e.selection.setCursorLocation(u,0)}}else{let o=L(e,t),u=e.getDoc().createElement("figcaption");u.innerHTML="&nbsp;",o.appendChild(u),e.selection.setCursorLocation(u,0)}e.nodeChanged(),e.undoManager.add()},onSetup:t=>{let i=()=>{let r=h(e);if(!r){t.setActive(!1);return}let o=y(r),g=(o==null?void 0:o.querySelector("figcaption"))!==null;t.setActive(g)};return e.on("NodeChange",i),i(),()=>e.off("NodeChange",i)}}),e.ui.registry.addButton("imageshowpool",{icon:"gallery",tooltip:"Zeige Medium im Medienpool",onAction:()=>{var g,u;let t=h(e),i=((u=(g=t==null?void 0:t.getAttribute("src"))==null?void 0:g.split("/").pop())==null?void 0:u.split("?")[0])||"";if(!i){e.notificationManager.open({text:"Bitte zuerst ein Bild ausw\xE4hlen.",type:"warning",timeout:3e3});return}let r=window.rex5MediaplaceBridge;if(r&&r.isActive()){r.show(i);return}let o="index.php?page=mediapool/media&file_name="+encodeURIComponent(i);window.open(o,"mediapool","width=1000,height=700,resizable=yes,scrollbars=yes")}}),e.ui.registry.addButton("imageswappool",{icon:"for_imageswappool_icon",tooltip:"Austauschen aus Medienpool",onAction:()=>{let t=h(e);if(!t){e.notificationManager.open({text:"Bitte zuerst ein Bild ausw\xE4hlen.",type:"warning",timeout:3e3});return}try{e.selection.select(t)}catch(r){}if(!(e.plugins&&e.plugins.image||typeof e.queryCommandSupported=="function"&&e.queryCommandSupported("mceImage"))){e.notificationManager.open({text:'Bild-Dialog nicht verf\xFCgbar \u2013 bitte das Plugin "image" im Profil aktivieren.',type:"warning",timeout:5e3});return}e.execCommand("mceImage")}}),e.on("NodeChange",()=>{let t=h(e);if(!t)return;let i=s.get(),r=P(t,i.widthPresets),o=P(t,i.alignPresets),g=F(t,i.effectPresets),u=[];r&&r.class&&u.push(r.label),o&&o.class&&u.push(o.label),g.length>0&&u.push(g.map(x=>x.label).join(", "));let v=y(t)||t;u.length>0?v.setAttribute("title",u.join(" \xB7 ")):v.removeAttribute("title")})},Z=()=>{tinymce.PluginManager.add("for_images",(e,n)=>(pe(e,n),{getMetadata:()=>({name:"FriendsOfREDAXO Images",url:"https://github.com/FriendsOfREDAXO/tinymce"})}))};Z();})();
