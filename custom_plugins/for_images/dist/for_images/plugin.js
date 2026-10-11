(()=>{var J=[{label:"Original",class:""},{label:"Klein (150px)",class:"img-width-small"},{label:"Mittel (300px)",class:"img-width-medium"},{label:"Gro\xDF (600px)",class:"img-width-large"},{label:"100%",class:"img-width-full"}],Q=[{label:"Keine",class:""},{label:"Links",class:"img-align-left"},{label:"Rechts",class:"img-align-right"},{label:"Zentriert",class:"img-align-center"}],Y=[{label:"Kein Effekt",class:""}],D=class{constructor(n){this.cache=null;this.editor=n}get(){if(this.cache)return this.cache;let n=l=>{var r,u,g;let o=this.editor.options.get(l);return(!o||Array.isArray(o)&&o.length===0)&&(o=(r=this.editor.settings)==null?void 0:r[l]),(!o||Array.isArray(o)&&o.length===0)&&(o=(g=(u=this.editor).getParam)==null?void 0:g.call(u,l,null)),o},s=(l,o)=>Array.isArray(l)&&l.length>0?l:o;return this.cache={widthPresets:s(n("imagewidth_presets"),J),alignPresets:s(n("imagealign_presets"),Q),effectPresets:s(n("imageeffect_presets"),Y)},this.cache}invalidate(){this.cache=null}getAllClasses(n){let s=[];return n.forEach(l=>{l.class&&l.class.split(/\s+/).forEach(o=>{o&&!s.includes(o)&&s.push(o)})}),s}};function ee(e){let n=e.parentElement;return!n||n.nodeName!=="A"?null:Array.from(n.childNodes).every(l=>l===e||l.nodeType===Node.TEXT_NODE&&(l.textContent||"").trim()==="")?n:null}function y(e){var s;if(e.nodeName==="FIGURE")return e;let n=e.parentElement;return n&&n.nodeName==="FIGURE"?n:n&&n.nodeName==="A"&&((s=n.parentElement)==null?void 0:s.nodeName)==="FIGURE"?n.parentElement:null}function te(e){return(e.textContent||"").trim()===""&&!e.querySelector("img, picture, video, audio, iframe, object, embed, svg, input, figure, table")}function L(e,n){let s=y(n);if(s)return s;let o=e.getDoc().createElement("figure"),r=ee(n)||n,u=r.parentElement,g=u?u.closest("p"):null;return g&&g.parentNode&&!g.contains(e.getBody())?(g.parentNode.insertBefore(o,g),o.appendChild(r),te(g)&&g.remove()):u&&(u.insertBefore(o,r),o.appendChild(r)),o}function h(e){let n=e.selection.getNode();if(n.nodeName==="IMG")return n;if(n.nodeName==="FIGURE")return n.querySelector("img");if(n.nodeName==="FIGCAPTION"){let s=n.parentElement;if((s==null?void 0:s.nodeName)==="FIGURE")return s.querySelector("img")}return null}function q(e,n){let s=n!=null?n:e.getBody();s&&Array.from(s.querySelectorAll("img, figure")).forEach(l=>{if(l.nodeName==="IMG"){let g=l.parentElement;g&&g.nodeName==="FIGURE"||L(e,l);return}let o=l;if(o.querySelector("img"))return;let r=o.children.length>0,u=(o.textContent||"").trim()!=="";!r&&!u&&o.remove()})}function H(e,n,s){if(n.forEach(l=>e.classList.remove(l)),s){let l=[];e.classList.forEach(r=>{(r==="image"||r==="image_resized"||r.startsWith("image-style-")||r.startsWith("img-width-")||r.startsWith("img-height-"))&&l.push(r)}),l.forEach(r=>e.classList.remove(r));let o=e.style.width;o&&o.includes("%")&&(e.style.removeProperty("width"),e.getAttribute("style")===""&&e.removeAttribute("style"))}}function M(e){let n=[];return e.forEach(s=>{s.class&&s.class.split(/\s+/).forEach(l=>{l&&!n.includes(l)&&n.push(l)})}),n}function z(e){let n=M(e).join(" ");return n.includes("uk-width")?"uk-width-1-1":/\bw-\d/.test(n)?"w-100":""}function R(e,n){e.removeAttribute("data-mce-style"),e.classList.remove("uk-width-1-1","w-100"),e.style.removeProperty("width"),n?e.classList.add(n):e.style.width="100%"}function ie(e,n,s,l,o=!1){let r=s.class?L(e,n):y(n),u=z(l),g=M(l);r&&(H(r,g,o),s.class?(s.class.split(/\s+/).forEach(m=>{m&&r.classList.add(m)}),R(n,u)):u&&(u.split(/\s+/).forEach(m=>{m&&n.classList.remove(m)}),n.classList.length===0&&n.removeAttribute("class")),r.classList.length===0&&r.removeAttribute("class")),n.style.removeProperty("width"),n.style.removeProperty("height"),n.getAttribute("style")===""&&n.removeAttribute("style"),e.nodeChanged(),e.undoManager.add()}function ne(e,n,s,l,o=!1){if(s.class){let r=L(e,n),u=s.class.split(/\s+/).filter(m=>m);u.every(m=>r.classList.contains(m))?u.forEach(m=>r.classList.remove(m)):u.forEach(m=>r.classList.add(m)),o&&H(r,M(l),!0),r.classList.length===0&&r.removeAttribute("class")}else{let r=y(n);r&&(H(r,M(l),o),r.classList.length===0&&r.removeAttribute("class"))}e.nodeChanged(),e.undoManager.add()}function x(e,n,s,l){ie(e,n,s,l,!!e.options.get("image_compat_warn"))}function U(e,n,s,l){let o=y(n);o&&F(o),x(e,n,s,l)}function se(e,n,s,l){ne(e,n,s,l,!!e.options.get("image_compat_warn"))}function P(e,n){let l=y(e)||e;for(let o of n){if(!o.class)continue;let r=o.class.split(/\s+/).filter(u=>u);if(r.length>0&&r.every(u=>l.classList.contains(u)))return o}return null}function S(e,n){let l=y(e)||e,o=[];for(let r of n){if(!r.class)continue;let u=r.class.split(/\s+/).filter(g=>g);u.length>0&&u.every(g=>l.classList.contains(g))&&o.push(r)}return o}var re={left:["float-left","float-start","align-left","uk-float-left"],right:["float-right","float-end","align-right","uk-float-right"],center:["margin-auto","mx-auto","align-center"]};function _(e,n){return!!e&&!!e.class&&re[n].some(s=>e.class.includes(s))}function B(e,n){return e.find(s=>_(s,n))}var ae='figure.image, .image_resized, [class*="image-style-"]';function V(e){return!!e&&!!e.querySelector(ae)}var oe={"image-style-align-left":"left","image-style-block-align-left":"left","image-style-align-right":"right","image-style-block-align-right":"right","image-style-side":"right","image-style-align-center":"center","image-style-align-block-center":"center","image-style-inline":"","image-style-full":""};function le(e){if(!e.class)return null;let n=e.label||"",s=n.match(/(\d+(?:[.,]\d+)?)\s*%/);if(s)return{value:parseFloat(s[1].replace(",",".")),unit:"%"};let l=n.match(/(\d+(?:[.,]\d+)?)\s*px/i);if(l)return{value:parseFloat(l[1].replace(",",".")),unit:"px"};let o=" "+e.class+" ",r=o.match(/\suk-width-(\d+)-(\d+)(?:@\w+)?\s/);return r&&+r[2]>0?{value:+r[1]/+r[2]*100,unit:"%"}:(r=o.match(/\s(?:img-width-|w-)(\d+)\s/),r?{value:+r[1],unit:"%"}:/\s(?:img-width-full|w-100)\s/.test(o)?{value:100,unit:"%"}:(r=o.match(/\scol(?:-\w+)?-(\d+)\s/),r?{value:+r[1]/12*100,unit:"%"}:null))}function ce(e,n,s){return e.find(l=>{let o=le(l);return!!o&&o.unit===s&&Math.abs(o.value-n)<.5})}function ge(e,n){if(Object.prototype.hasOwnProperty.call(n.map,e))return n.map[e]||"";let s=oe[e];if(s===void 0)return null;if(s==="")return"";let l=n.alignPresets.find(r=>r.class.split(/\s+/).includes(e));if(l)return l.class;let o=B(n.alignPresets,s);return o?o.class:e}function K(e,n){n.split(/\s+/).forEach(s=>{s&&e.classList.add(s)})}function F(e){e.removeAttribute("data-mce-style"),e.style.removeProperty("width"),(e.getAttribute("style")===""||e.getAttribute("style")===null)&&e.removeAttribute("style")}function ue(e,n,s){if(!V(n))return 0;let l=new Set;n.querySelectorAll("img").forEach(r=>{let u=r,g=y(u),m=v=>!!v&&(v.classList.contains("image_resized")||v.nodeName==="FIGURE"&&v.classList.contains("image")||Array.from(v.classList).some(E=>E.startsWith("image-style-")));(m(u)||m(g))&&l.add(u)});let o=0;return l.forEach(r=>{let u=!!y(r),g=L(e,r);if(!g.contains(r))return;let m=[],v=w=>{Array.from(w.classList).forEach(b=>{(b==="image_resized"||b.startsWith("image-style-"))&&(m.push(b),w.classList.remove(b))})};v(r),v(g);let E=g.style.width||r.style.width||"";if(F(r),F(g),m.forEach(w=>{if(w==="image_resized")return;let b=ge(w,s);K(g,b===null?w:b)}),E){let w=E.trim().match(/^(\d+(?:\.\d+)?)(%|px)$/),b=w?ce(s.widthPresets,parseFloat(w[1]),w[2]):void 0;b?K(g,b.class):g.style.width=E}(g.classList.length>0||g.style.width)&&R(r,s.fullWidthClass),r.classList.length===0&&r.removeAttribute("class"),g.classList.length===0&&g.removeAttribute("class"),(!u||m.length>0||E)&&o++}),o}var fe=`
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
`,me=(e,n)=>{e.options.register("imagewidth_presets",{processor:"object[]",default:[]}),e.options.register("imagealign_presets",{processor:"object[]",default:[]}),e.options.register("imageeffect_presets",{processor:"object[]",default:[]}),e.options.register("image_compat_warn",{processor:"boolean",default:!1}),e.options.register("image_cke5_import",{processor:"boolean",default:!0}),e.options.register("image_cke5_map",{processor:"object",default:{}}),e.options.register("image_caption",{processor:"boolean",default:!1});let s=new D(e),l=!!e.options.get("image_compat_warn"),o=e.options.get("image_cke5_import")!==!1,r=()=>{let t=s.get(),i=e.options.get("image_cke5_map"),a={};return i&&typeof i=="object"&&!Array.isArray(i)&&Object.keys(i).forEach(c=>{typeof i[c]=="string"&&(a[c]=i[c])}),{widthPresets:t.widthPresets,alignPresets:t.alignPresets,map:a,fullWidthClass:z(t.widthPresets)}},u=t=>!t||!V(t)?!1:(o&&ue(e,t,r()),!0),g=!1,m=!1,v=()=>{if(!(g||!l)){g=!0;try{e.notificationManager.open({type:"warning",text:o?"Hinweis: Dieser Inhalt enthielt Bildmarkup aus dem alten CKEditor 5. Ausrichtung und Breite wurden automatisch \xFCbernommen. Bitte die Bilder kurz pr\xFCfen und den Beitrag speichern, damit das Markup einheitlich wird.":"Hinweis: Dieser Inhalt enth\xE4lt Bildmarkup aus dem alten CKEditor 5 (z. B. figure.image, image-style-\u2026). Bitte die betroffenen Bilder mit der neuen Bildformatierungs-Toolbar (Breite, Ausrichtung, Effekte) erneut formatieren und den Beitrag speichern, damit das Markup einheitlich wird.",closeButton:!0,timeout:12e3})}catch(t){}}};e.ui.registry.addIcon("for_imagedialog",'<svg width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="12" rx="1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/><path d="M3 13l4-4 3 3 4-5 7 6"/><path d="M3 19h6M15 19h6"/><circle cx="12" cy="19" r="1.8" fill="currentColor" stroke="none"/></g></svg>'),e.ui.registry.addIcon("for_imagealignleft_icon",'<svg width="24" height="24" viewBox="0 0 20 20"><path fill="currentColor" opacity=".55" d="M2 3h16v1.5H2zM2 15h16v1.5H2z"/><rect x="2" y="7" width="10" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/><path fill="currentColor" d="M14 8h4v1.4h-4zM14 10.6h3.2V12H14zM14 13.2h3.8v1.3H14z"/></svg>'),e.ui.registry.addIcon("for_imagealigncenter_icon",'<svg width="24" height="24" viewBox="0 0 20 20"><path fill="currentColor" opacity=".55" d="M2 3h16v1.5H2zM2 15h16v1.5H2z"/><rect x="5" y="7" width="10" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'),e.ui.registry.addIcon("for_imagealignright_icon",'<svg width="24" height="24" viewBox="0 0 20 20"><path fill="currentColor" opacity=".55" d="M2 3h16v1.5H2zM2 15h16v1.5H2z"/><path fill="currentColor" d="M2 8h4v1.4H2zM2 10.6h3.2V12H2zM2 13.2h3.8v1.3H2z"/><rect x="8" y="7" width="10" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'),e.ui.registry.addIcon("for_imagealignnone_icon",'<svg width="24" height="24" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="12" rx="1.5" fill="#6b7280"/><circle cx="8.5" cy="9" r="0.9" fill="#ffffff"/><path d="M7.2 14l1.6-2 1.2 1.4 1.3-1.8 1.8 2.4" fill="none" stroke="#ffffff" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.8 18.2l12.4-12.4" stroke="#6b7280" stroke-width="1.8" stroke-linecap="round"/></svg>'),e.ui.registry.addIcon("for_imageswappool_icon",'<svg width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8H6m0 0l4-4m-4 4l4 4"/><path d="M8 16h10m0 0l-4-4m4 4l-4 4"/></g></svg>'),e.on("init",()=>{let t=e.getDoc();if(t){let f=t.createElement("style");f.setAttribute("data-for-images-plugin","1"),f.textContent=fe,t.head.appendChild(f)}let i=s.get(),a=z(i.widthPresets);e.getBody().querySelectorAll("figure").forEach(f=>{let d=f,C=d.querySelector("img");C&&d.classList.length>0&&R(C,a)}),m&&v()}),e.on("SetContent",()=>{u(e.getBody())&&(m=!0),q(e),m&&e.initialized&&v()}),e.on("PastePreProcess",t=>{if(!o||typeof(t==null?void 0:t.content)!="string"||t.content.indexOf("image")===-1)return;let i=e.getDoc().createElement("div");i.innerHTML=t.content,u(i)&&(t.content=i.innerHTML)}),e.on("PastePostProcess",t=>{t!=null&&t.node&&q(e,t.node)}),e.on("ObjectResizeStart",t=>{var i;((i=t.target)==null?void 0:i.nodeName)==="IMG"&&t.preventDefault()}),e.options.set("object_resizing",!1);let E=e.options.isRegistered;typeof E=="function"&&E.call(e.options,"quickbars_image_toolbar")&&e.options.set("quickbars_image_toolbar",!1),e.options.set("image_caption",!1);let w=()=>{let t=h(e);if(!t)return null;let i=y(t);return i&&i.nodeName==="FIGURE"?i:null},b=()=>{let t=w();return t?(e.selection.select(t,!0),e.nodeChanged(),!0):!1},O=(t,i)=>{i.setData("text/html",t.outerHTML),i.setData("text/plain",t.textContent||"")},I=t=>{e.undoManager.transact(()=>{e.dom.remove(t)}),e.nodeChanged()};e.on("copy",t=>{let i=w();!i||!t.clipboardData||(O(i,t.clipboardData),t.preventDefault())}),e.on("cut",t=>{let i=w();!i||!t.clipboardData||(O(i,t.clipboardData),t.preventDefault(),I(i))}),e.on("keydown",t=>{let i=String(t.key||"").toLowerCase();if(i==="delete"||i==="backspace"){let a=w();if(a){t.preventDefault(),I(a);return}}(t.ctrlKey||t.metaKey)&&(i==="c"||i==="x")&&b()}),e.on("BeforeExecCommand",t=>{let i=String(t.command||"").toLowerCase();if(i==="copy"||i==="cut"){b();return}if(i==="delete"||i==="forwarddelete"||i==="mcedelete"){let a=w();if(!a)return;t.preventDefault(),I(a)}}),e.ui.registry.addMenuButton("imagewidth",{icon:"resize",tooltip:"Bildbreite",fetch:t=>{let i=h(e);if(!i){t([]);return}let a=s.get(),c=P(i,a.widthPresets);t(a.widthPresets.map(f=>({type:"menuitem",text:f.label,icon:c&&c.class===f.class?"checkmark":void 0,onAction:()=>U(e,i,f,a.widthPresets)})))}}),e.ui.registry.addToggleButton("for_imagealignleft",{icon:"for_imagealignleft_icon",tooltip:"Bild links",onAction:()=>{let t=h(e);if(!t)return;let i=s.get(),a=B(i.alignPresets,"left"),c=P(t,i.alignPresets);c&&a&&c.class===a.class?x(e,t,{label:"",class:""},i.alignPresets):a&&x(e,t,a,i.alignPresets)},onSetup:t=>{let i=()=>{let a=h(e);if(!a){t.setActive(!1);return}let c=s.get(),f=P(a,c.alignPresets);t.setActive(_(f,"left"))};return e.on("NodeChange",i),()=>e.off("NodeChange",i)}}),e.ui.registry.addToggleButton("for_imagealigncenter",{icon:"for_imagealigncenter_icon",tooltip:"Bild zentrieren",onAction:()=>{let t=h(e);if(!t)return;let i=s.get(),a=B(i.alignPresets,"center"),c=P(t,i.alignPresets);c&&a&&c.class===a.class?x(e,t,{label:"",class:""},i.alignPresets):a&&x(e,t,a,i.alignPresets)},onSetup:t=>{let i=()=>{let a=h(e);if(!a){t.setActive(!1);return}let c=s.get(),f=P(a,c.alignPresets);t.setActive(_(f,"center"))};return e.on("NodeChange",i),()=>e.off("NodeChange",i)}}),e.ui.registry.addToggleButton("for_imagealignright",{icon:"for_imagealignright_icon",tooltip:"Bild rechts",onAction:()=>{let t=h(e);if(!t)return;let i=s.get(),a=B(i.alignPresets,"right"),c=P(t,i.alignPresets);c&&a&&c.class===a.class?x(e,t,{label:"",class:""},i.alignPresets):a&&x(e,t,a,i.alignPresets)},onSetup:t=>{let i=()=>{let a=h(e);if(!a){t.setActive(!1);return}let c=s.get(),f=P(a,c.alignPresets);t.setActive(_(f,"right"))};return e.on("NodeChange",i),()=>e.off("NodeChange",i)}}),e.ui.registry.addButton("for_imagealignnone",{icon:"for_imagealignnone_icon",tooltip:"Ausrichtung entfernen",onAction:()=>{let t=h(e);if(!t)return;let i=s.get();x(e,t,{label:"",class:""},i.alignPresets)}}),e.ui.registry.addMenuButton("imageeffect",{icon:"color-picker",tooltip:"Bild-Effekte",fetch:t=>{let i=h(e);if(!i){t([]);return}let a=s.get(),c=S(i,a.effectPresets);t(a.effectPresets.map(f=>({type:"togglemenuitem",text:f.label,active:f.class===""?c.length===0:c.some(d=>d.class===f.class),onAction:()=>se(e,i,f,a.effectPresets)})))}}),e.ui.registry.addButton("imagewidthdialog",{icon:"for_imagedialog",tooltip:"Bildformatierung",onAction:()=>{let t=h(e);if(!t){e.notificationManager.open({text:"Bitte zuerst ein Bild ausw\xE4hlen.",type:"warning",timeout:3e3});return}let i=s.get(),a=P(t,i.widthPresets),c=P(t,i.alignPresets),f=S(t,i.effectPresets),d=i.widthPresets.map(p=>({text:p.label,value:p.class})),C=i.alignPresets.map(p=>({text:p.label,value:p.class})),T=i.effectPresets.filter(p=>p.class).map(p=>({type:"checkbox",name:"effect_"+p.class.replace(/\s+/g,"_"),label:p.label})),W={widthClass:(a==null?void 0:a.class)||"",alignClass:(c==null?void 0:c.class)||""};i.effectPresets.filter(p=>p.class).forEach(p=>{W["effect_"+p.class.replace(/\s+/g,"_")]=f.some(A=>A.class===p.class)});let G=[{type:"selectbox",name:"widthClass",label:"Breite",items:d},{type:"selectbox",name:"alignClass",label:"Ausrichtung",items:C}];T.length>0&&G.push({type:"bar",items:T}),e.windowManager.open({title:"Bildformatierung",size:"normal",body:{type:"panel",items:G},buttons:[{type:"cancel",name:"cancel",text:"Abbrechen"},{type:"submit",name:"save",text:"\xDCbernehmen",primary:!0}],initialData:W,onSubmit:p=>{let A=p.getData(),Z=i.widthPresets.find(k=>k.class===A.widthClass)||{label:"",class:""};U(e,t,Z,i.widthPresets);let $=i.alignPresets.find(k=>k.class===A.alignClass)||{label:"",class:""};x(e,t,$,i.alignPresets);let N=y(t);N&&(H(N,M(i.effectPresets),!1),i.effectPresets.filter(k=>k.class).forEach(k=>{A["effect_"+k.class.replace(/\s+/g,"_")]&&k.class.split(/\s+/).forEach(j=>{j&&N.classList.add(j)})})),e.nodeChanged(),e.undoManager.add(),p.close()}})}}),e.ui.registry.addContextToolbar("for_imagestoolbar",{predicate:t=>t.nodeName==="IMG"||t.nodeName==="FIGURE"&&t.querySelector("img"),items:"imagewidth for_imagealignleft for_imagealigncenter for_imagealignright imageeffect for_imagealignnone | imagealt imagecaption imageshowpool imageswappool",position:"node",scope:"node"}),e.ui.registry.addToggleButton("imagealt",{icon:"accessibility-check",tooltip:"Alt-Text bearbeiten",onAction:()=>{let t=h(e);if(!t)return;let i=t.getAttribute("alt")||"";e.windowManager.open({title:"Alt-Text (Bildbeschreibung)",body:{type:"panel",items:[{type:"input",name:"alttext",label:"Beschreibung f\xFCr Screenreader",placeholder:'z.B. "Rotes Auto vor blauem Himmel"'},{type:"htmlpanel",html:'<p style="color:#666;font-size:12px;margin-top:8px;">Beschreiben Sie den Bildinhalt kurz und pr\xE4gnant f\xFCr Menschen die das Bild nicht sehen k\xF6nnen.</p>'}]},initialData:{alttext:i},buttons:[{type:"cancel",text:"Abbrechen"},{type:"submit",text:"Speichern",primary:!0}],onSubmit:a=>{let c=a.getData();t.setAttribute("alt",c.alttext),e.nodeChanged(),e.undoManager.add(),a.close()}})},onSetup:t=>{let i=()=>{let a=h(e);if(!a){t.setActive(!1);return}let c=a.getAttribute("alt");t.setActive(!!c&&c.trim()!=="")};return e.on("NodeChange",i),i(),()=>e.off("NodeChange",i)}}),e.ui.registry.addToggleButton("imagecaption",{icon:"comment",tooltip:"Bildunterschrift",onAction:()=>{var a;let t=h(e);if(!t)return;let i=y(t);if(i){let c=i.querySelector("figcaption");if(c)(a=c.textContent)!=null&&a.trim()?e.selection.setCursorLocation(c,0):c.remove();else{let d=e.getDoc().createElement("figcaption");d.innerHTML="&nbsp;",i.appendChild(d),e.selection.setCursorLocation(d,0)}}else{let c=L(e,t),d=e.getDoc().createElement("figcaption");d.innerHTML="&nbsp;",c.appendChild(d),e.selection.setCursorLocation(d,0)}e.nodeChanged(),e.undoManager.add()},onSetup:t=>{let i=()=>{let a=h(e);if(!a){t.setActive(!1);return}let c=y(a),f=(c==null?void 0:c.querySelector("figcaption"))!==null;t.setActive(f)};return e.on("NodeChange",i),i(),()=>e.off("NodeChange",i)}}),e.ui.registry.addButton("imageshowpool",{icon:"gallery",tooltip:"Zeige Medium im Medienpool",onAction:()=>{var f,d;let t=h(e),i=((d=(f=t==null?void 0:t.getAttribute("src"))==null?void 0:f.split("/").pop())==null?void 0:d.split("?")[0])||"";if(!i){e.notificationManager.open({text:"Bitte zuerst ein Bild ausw\xE4hlen.",type:"warning",timeout:3e3});return}let a=window.rex5MediaplaceBridge;if(a&&a.isActive()){a.show(i);return}let c="index.php?page=mediapool/media&file_name="+encodeURIComponent(i);window.open(c,"mediapool","width=1000,height=700,resizable=yes,scrollbars=yes")}}),e.ui.registry.addButton("imageswappool",{icon:"for_imageswappool_icon",tooltip:"Austauschen aus Medienpool",onAction:()=>{let t=h(e);if(!t){e.notificationManager.open({text:"Bitte zuerst ein Bild ausw\xE4hlen.",type:"warning",timeout:3e3});return}try{e.selection.select(t)}catch(a){}if(!(e.plugins&&e.plugins.image||typeof e.queryCommandSupported=="function"&&e.queryCommandSupported("mceImage"))){e.notificationManager.open({text:'Bild-Dialog nicht verf\xFCgbar \u2013 bitte das Plugin "image" im Profil aktivieren.',type:"warning",timeout:5e3});return}e.execCommand("mceImage")}}),e.on("NodeChange",()=>{let t=h(e);if(!t)return;let i=s.get(),a=P(t,i.widthPresets),c=P(t,i.alignPresets),f=S(t,i.effectPresets),d=[];a&&a.class&&d.push(a.label),c&&c.class&&d.push(c.label),f.length>0&&d.push(f.map(T=>T.label).join(", "));let C=y(t)||t;d.length>0?C.setAttribute("title",d.join(" \xB7 ")):C.removeAttribute("title")})},X=()=>{tinymce.PluginManager.add("for_images",(e,n)=>(me(e,n),{getMetadata:()=>({name:"FriendsOfREDAXO Images",url:"https://github.com/FriendsOfREDAXO/tinymce"})}))};X();})();
