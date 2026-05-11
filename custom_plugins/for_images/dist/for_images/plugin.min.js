(()=>{var z=[{label:"Original",class:""},{label:"Klein (150px)",class:"img-width-small"},{label:"Mittel (300px)",class:"img-width-medium"},{label:"Gro\xDF (600px)",class:"img-width-large"},{label:"100%",class:"img-width-full"}],O=[{label:"Keine",class:""},{label:"Links",class:"img-align-left"},{label:"Rechts",class:"img-align-right"},{label:"Zentriert",class:"img-align-center"}],R=[{label:"Kein Effekt",class:""}];function b(e){if(e.nodeName==="FIGURE")return e;let r=e.parentElement;return r&&r.nodeName==="FIGURE"?r:null}function A(e,r){let c=b(r);if(c)return c;let l=e.getDoc().createElement("figure"),o=r.parentElement;return o&&o.nodeName==="P"?Array.from(o.childNodes).some(t=>t!==r&&(t.nodeType!==Node.TEXT_NODE||(t.textContent||"").trim()!==""))?(o.parentNode.insertBefore(l,o),l.appendChild(r)):(o.parentNode.insertBefore(l,o),l.appendChild(r),o.remove()):o&&(o.insertBefore(l,r),l.appendChild(r)),l}function m(e){let r=e.selection.getNode();if(r.nodeName==="IMG")return r;if(r.nodeName==="FIGURE")return r.querySelector("img");if(r.nodeName==="FIGCAPTION"){let c=r.parentElement;if((c==null?void 0:c.nodeName)==="FIGURE")return c.querySelector("img")}return null}function B(e){let r=[];return e.forEach(c=>{c.class&&c.class.split(/\s+/).forEach(g=>{g&&!r.includes(g)&&r.push(g)})}),r}function _(e,r){B(r).forEach(g=>e.classList.remove(g))}function E(e){let r=[];e.classList.forEach(g=>{(g==="image"||g==="image_resized"||g.indexOf("image-style-")===0||g.indexOf("img-width-")===0||g.indexOf("img-height-")===0)&&r.push(g)}),r.forEach(g=>e.classList.remove(g));let c=e.style.width;c&&c.indexOf("%")!==-1&&(e.style.removeProperty("width"),e.getAttribute("style")===""&&e.removeAttribute("style"))}function T(e){let r=B(e).join(" ");return r.includes("uk-width")?"uk-width-1-1":/\bw-\d/.test(r)?"w-100":""}function S(e,r){e.classList.remove("uk-width-1-1","w-100"),e.style.removeProperty("width"),r?e.classList.add(r):e.style.width="100%"}function h(e,r,c,g){let l=c.class?A(e,r):b(r),o=T(g),d=!!e.options.get("image_compat_warn");l&&(_(l,g),d&&E(l),c.class?(c.class.split(/\s+/).forEach(t=>{t&&l.classList.add(t)}),S(r,o)):o&&(o.split(/\s+/).forEach(t=>{t&&r.classList.remove(t)}),r.classList.length===0&&r.removeAttribute("class")),l.classList.length===0&&l.removeAttribute("class")),r.style.removeProperty("width"),r.style.removeProperty("height"),r.getAttribute("style")===""&&r.removeAttribute("style"),e.nodeChanged(),e.undoManager.add()}function F(e,r,c,g){let l=!!e.options.get("image_compat_warn");if(c.class){let o=A(e,r),d=c.class.split(/\s+/).filter(i=>i);d.every(i=>o.classList.contains(i))?d.forEach(i=>o.classList.remove(i)):d.forEach(i=>o.classList.add(i)),l&&E(o),o.classList.length===0&&o.removeAttribute("class")}else{let o=b(r);o&&(_(o,g),l&&E(o),o.classList.length===0&&o.removeAttribute("class"))}e.nodeChanged(),e.undoManager.add()}function p(e,r){let g=b(e)||e;for(let l of r){if(!l.class)continue;let o=l.class.split(/\s+/).filter(d=>d);if(o.length>0&&o.every(d=>g.classList.contains(d)))return l}return null}function C(e,r){let g=b(e)||e,l=[];for(let o of r){if(!o.class)continue;let d=o.class.split(/\s+/).filter(t=>t);d.length>0&&d.every(t=>g.classList.contains(t))&&l.push(o)}return l}var G=`
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
`,j=(e,r)=>{e.options.register("imagewidth_presets",{processor:"object[]",default:[]}),e.options.register("imagealign_presets",{processor:"object[]",default:[]}),e.options.register("imageeffect_presets",{processor:"object[]",default:[]}),e.options.register("image_compat_warn",{processor:"boolean",default:!1});let c=!1,g=t=>t?!!(t.querySelector("figure.image, figure.image_resized")||t.querySelector('[class*="image-style-"]')):!1,l=()=>{if(c||!e.options.get("image_compat_warn"))return;let t=e.getBody();if(g(t)){c=!0;try{e.notificationManager.open({type:"warning",text:"Hinweis: Dieser Inhalt enth\xE4lt Bildmarkup aus dem alten CKEditor 5 (z. B. figure.image, image-style-\u2026). Bitte die betroffenen Bilder mit der neuen Bildformatierungs-Toolbar (Breite, Ausrichtung, Effekte) erneut formatieren und den Beitrag speichern, damit das Markup einheitlich wird.",closeButton:!0,timeout:12e3})}catch(i){}}};e.ui.registry.addIcon("for_imagedialog",'<svg width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="12" rx="1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/><path d="M3 13l4-4 3 3 4-5 7 6"/><path d="M3 19h6M15 19h6"/><circle cx="12" cy="19" r="1.8" fill="currentColor" stroke="none"/></g></svg>'),e.ui.registry.addIcon("for_imagealignleft_icon",'<svg width="24" height="24" viewBox="0 0 20 20"><path fill="currentColor" opacity=".55" d="M2 3h16v1.5H2zM2 15h16v1.5H2z"/><rect x="2" y="7" width="10" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/><path fill="currentColor" d="M14 8h4v1.4h-4zM14 10.6h3.2V12H14zM14 13.2h3.8v1.3H14z"/></svg>'),e.ui.registry.addIcon("for_imagealigncenter_icon",'<svg width="24" height="24" viewBox="0 0 20 20"><path fill="currentColor" opacity=".55" d="M2 3h16v1.5H2zM2 15h16v1.5H2z"/><rect x="5" y="7" width="10" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'),e.ui.registry.addIcon("for_imagealignright_icon",'<svg width="24" height="24" viewBox="0 0 20 20"><path fill="currentColor" opacity=".55" d="M2 3h16v1.5H2zM2 15h16v1.5H2z"/><path fill="currentColor" d="M2 8h4v1.4H2zM2 10.6h3.2V12H2zM2 13.2h3.8v1.3H2z"/><rect x="8" y="7" width="10" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'),e.ui.registry.addIcon("for_imagealignnone_icon",'<svg width="24" height="24" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="12" rx="1.5" fill="#6b7280"/><circle cx="8.5" cy="9" r="0.9" fill="#ffffff"/><path d="M7.2 14l1.6-2 1.2 1.4 1.3-1.8 1.8 2.4" fill="none" stroke="#ffffff" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.8 18.2l12.4-12.4" stroke="#6b7280" stroke-width="1.8" stroke-linecap="round"/></svg>');let o=()=>{let t=s=>{var a,u;let n=e.options.get(s);return(!n||Array.isArray(n)&&n.length===0)&&(n=(a=e.settings)==null?void 0:a[s]),(!n||Array.isArray(n)&&n.length===0)&&(n=(u=e.getParam)==null?void 0:u.call(e,s,null)),n},i=(s,n)=>Array.isArray(s)&&s.length>0?s:n;return{widthPresets:i(t("imagewidth_presets"),z),alignPresets:i(t("imagealign_presets"),O),effectPresets:i(t("imageeffect_presets"),R)}};e.on("init",()=>{let t=e.getDoc();if(t){let a=t.createElement("style");a.setAttribute("data-for-images-plugin","1"),a.textContent=G,t.head.appendChild(a)}let i=e.getBody(),s=o(),n=T(s.widthPresets);i.querySelectorAll("figure").forEach(a=>{let u=a,w=u.querySelector("img");w&&u.classList.length>0&&S(w,n)}),l()}),e.on("SetContent",()=>{l()}),e.on("ObjectResizeStart",t=>{t.target&&t.target.nodeName==="IMG"&&t.preventDefault()}),e.options.set("object_resizing",!1);let d=e.options.isRegistered;typeof d=="function"&&d.call(e.options,"quickbars_image_toolbar")&&e.options.set("quickbars_image_toolbar",!1),e.options.set("image_caption",!1),e.ui.registry.addMenuButton("imagewidth",{icon:"resize",tooltip:"Bildbreite",fetch:t=>{let i=m(e);if(!i){t([]);return}let s=o(),n=p(i,s.widthPresets);t(s.widthPresets.map(a=>({type:"menuitem",text:a.label,icon:n&&n.class===a.class?"checkmark":void 0,onAction:()=>h(e,i,a,s.widthPresets)})))}}),e.ui.registry.addToggleButton("for_imagealignleft",{icon:"for_imagealignleft_icon",tooltip:"Bild links",onAction:()=>{let t=m(e);if(!t)return;let i=o(),s=i.alignPresets.find(a=>a.class.includes("float-left")||a.class.includes("float-start")||a.class.includes("align-left")||a.class.includes("uk-float-left")),n=p(t,i.alignPresets);n&&s&&n.class===s.class?h(e,t,{label:"",class:""},i.alignPresets):s&&h(e,t,s,i.alignPresets)},onSetup:t=>{let i=()=>{let s=m(e);if(!s){t.setActive(!1);return}let n=o(),a=p(s,n.alignPresets);t.setActive(!!a&&(a.class.includes("float-left")||a.class.includes("float-start")||a.class.includes("align-left")||a.class.includes("uk-float-left")))};return e.on("NodeChange",i),()=>e.off("NodeChange",i)}}),e.ui.registry.addToggleButton("for_imagealigncenter",{icon:"for_imagealigncenter_icon",tooltip:"Bild zentrieren",onAction:()=>{let t=m(e);if(!t)return;let i=o(),s=i.alignPresets.find(a=>a.class.includes("margin-auto")||a.class.includes("mx-auto")||a.class.includes("align-center")),n=p(t,i.alignPresets);n&&s&&n.class===s.class?h(e,t,{label:"",class:""},i.alignPresets):s&&h(e,t,s,i.alignPresets)},onSetup:t=>{let i=()=>{let s=m(e);if(!s){t.setActive(!1);return}let n=o(),a=p(s,n.alignPresets);t.setActive(!!a&&(a.class.includes("margin-auto")||a.class.includes("mx-auto")||a.class.includes("align-center")))};return e.on("NodeChange",i),()=>e.off("NodeChange",i)}}),e.ui.registry.addToggleButton("for_imagealignright",{icon:"for_imagealignright_icon",tooltip:"Bild rechts",onAction:()=>{let t=m(e);if(!t)return;let i=o(),s=i.alignPresets.find(a=>a.class.includes("float-right")||a.class.includes("float-end")||a.class.includes("align-right")||a.class.includes("uk-float-right")),n=p(t,i.alignPresets);n&&s&&n.class===s.class?h(e,t,{label:"",class:""},i.alignPresets):s&&h(e,t,s,i.alignPresets)},onSetup:t=>{let i=()=>{let s=m(e);if(!s){t.setActive(!1);return}let n=o(),a=p(s,n.alignPresets);t.setActive(!!a&&(a.class.includes("float-right")||a.class.includes("float-end")||a.class.includes("align-right")||a.class.includes("uk-float-right")))};return e.on("NodeChange",i),()=>e.off("NodeChange",i)}}),e.ui.registry.addButton("for_imagealignnone",{icon:"for_imagealignnone_icon",tooltip:"Ausrichtung entfernen",onAction:()=>{let t=m(e);if(!t)return;let i=o();h(e,t,{label:"",class:""},i.alignPresets)}}),e.ui.registry.addMenuButton("imageeffect",{icon:"color-picker",tooltip:"Bild-Effekte",fetch:t=>{let i=m(e);if(!i){t([]);return}let s=o(),n=C(i,s.effectPresets);t(s.effectPresets.map(a=>({type:"togglemenuitem",text:a.label,active:a.class===""?n.length===0:n.some(u=>u.class===a.class),onAction:()=>F(e,i,a,s.effectPresets)})))}}),e.ui.registry.addButton("imagewidthdialog",{icon:"for_imagedialog",tooltip:"Bildformatierung",onAction:()=>{let t=m(e);if(!t){e.notificationManager.open({text:"Bitte zuerst ein Bild ausw\xE4hlen.",type:"warning",timeout:3e3});return}let i=o(),s=p(t,i.widthPresets),n=p(t,i.alignPresets),a=C(t,i.effectPresets),u=i.widthPresets.map(f=>({text:f.label,value:f.class})),w=i.alignPresets.map(f=>({text:f.label,value:f.class})),y=i.effectPresets.filter(f=>f.class).map(f=>({type:"checkbox",name:"effect_"+f.class.replace(/\s+/g,"_"),label:f.label})),k={widthClass:(s==null?void 0:s.class)||"",alignClass:(n==null?void 0:n.class)||""};i.effectPresets.filter(f=>f.class).forEach(f=>{k["effect_"+f.class.replace(/\s+/g,"_")]=a.some(x=>x.class===f.class)});let P=[{type:"selectbox",name:"widthClass",label:"Breite",items:u},{type:"selectbox",name:"alignClass",label:"Ausrichtung",items:w}];y.length>0&&P.push({type:"bar",items:y}),e.windowManager.open({title:"Bildformatierung",size:"normal",body:{type:"panel",items:P},buttons:[{type:"cancel",name:"cancel",text:"Abbrechen"},{type:"submit",name:"save",text:"\xDCbernehmen",primary:!0}],initialData:k,onSubmit:f=>{let x=f.getData(),H=i.widthPresets.find(v=>v.class===x.widthClass)||{label:"",class:""};h(e,t,H,i.widthPresets);let N=i.alignPresets.find(v=>v.class===x.alignClass)||{label:"",class:""};h(e,t,N,i.alignPresets);let M=b(t);M&&(_(M,i.effectPresets),i.effectPresets.filter(v=>v.class).forEach(v=>{x["effect_"+v.class.replace(/\s+/g,"_")]&&v.class.split(/\s+/).forEach(L=>{L&&M.classList.add(L)})})),e.nodeChanged(),e.undoManager.add(),f.close()}})}}),e.ui.registry.addContextToolbar("for_imagestoolbar",{predicate:t=>t.nodeName==="IMG"||t.nodeName==="FIGURE"&&t.querySelector("img"),items:"imagewidth for_imagealignleft for_imagealigncenter for_imagealignright imageeffect for_imagealignnone | imagealt imagecaption imageshowpool imageswappool",position:"node",scope:"node"}),e.ui.registry.addToggleButton("imagealt",{icon:"accessibility-check",tooltip:"Alt-Text bearbeiten",onAction:()=>{let t=m(e);if(!t)return;let i=t.getAttribute("alt")||"";e.windowManager.open({title:"Alt-Text (Bildbeschreibung)",body:{type:"panel",items:[{type:"input",name:"alttext",label:"Beschreibung f\xFCr Screenreader",placeholder:'z.B. "Rotes Auto vor blauem Himmel"'},{type:"htmlpanel",html:'<p style="color:#666;font-size:12px;margin-top:8px;">Beschreiben Sie den Bildinhalt kurz und pr\xE4gnant f\xFCr Menschen die das Bild nicht sehen k\xF6nnen.</p>'}]},initialData:{alttext:i},buttons:[{type:"cancel",text:"Abbrechen"},{type:"submit",text:"Speichern",primary:!0}],onSubmit:s=>{let n=s.getData();t.setAttribute("alt",n.alttext),e.nodeChanged(),e.undoManager.add(),s.close()}})},onSetup:t=>{let i=()=>{let s=m(e);if(!s){t.setActive(!1);return}let n=s.getAttribute("alt");t.setActive(!!n&&n.trim()!=="")};return e.on("NodeChange",i),i(),()=>e.off("NodeChange",i)}}),e.ui.registry.addToggleButton("imagecaption",{icon:"comment",tooltip:"Bildunterschrift",onAction:()=>{var s;let t=m(e);if(!t)return;let i=b(t);if(i){let n=i.querySelector("figcaption");if(n)(s=n.textContent)!=null&&s.trim()?e.selection.setCursorLocation(n,0):n.remove();else{let u=e.getDoc().createElement("figcaption");u.innerHTML="&nbsp;",i.appendChild(u),e.selection.setCursorLocation(u,0)}}else{let n=A(e,t),u=e.getDoc().createElement("figcaption");u.innerHTML="&nbsp;",n.appendChild(u),e.selection.setCursorLocation(u,0)}e.nodeChanged(),e.undoManager.add()},onSetup:t=>{let i=()=>{let s=m(e);if(!s){t.setActive(!1);return}let n=b(s),a=(n==null?void 0:n.querySelector("figcaption"))!==null;t.setActive(a)};return e.on("NodeChange",i),i(),()=>e.off("NodeChange",i)}}),e.ui.registry.addButton("imageshowpool",{icon:"gallery",tooltip:"Zeige Medium im Medienpool",onAction:()=>{var n;let t=m(e);if(!t){e.notificationManager.open({text:"Bitte zuerst ein Bild ausw\xE4hlen.",type:"warning",timeout:3e3});return}let i=t.getAttribute("src");if(!i){e.notificationManager.open({text:"Bildquelle nicht gefunden.",type:"warning",timeout:3e3});return}let s=((n=i.split("/").pop())==null?void 0:n.split("?")[0])||"";if(s)try{window.open("index.php?page=mediapool/media&addon=tiny","mediapool","width=1000,height=700,resizable=yes,scrollbars=yes"),e.notificationManager.open({text:`Medienpool \xF6ffnet sich. Suche nach: ${s}`,type:"info",timeout:3e3})}catch(a){e.notificationManager.open({text:"Medienpool konnte nicht ge\xF6ffnet werden.",type:"error",timeout:3e3})}}}),e.ui.registry.addButton("imageswappool",{icon:"sync",tooltip:"Austauschen aus Medienpool",onAction:()=>{let t=m(e);if(!t){e.notificationManager.open({text:"Bitte zuerst ein Bild ausw\xE4hlen.",type:"warning",timeout:3e3});return}if(typeof openREXMedia!="function"){e.notificationManager.open({text:"Medienpool ist nicht verf\xFCgbar.",type:"error",timeout:3e3});return}try{let i=openREXMedia("tinymce_medialink","&args[types]=jpg%2Cjpeg%2Cpng%2Cgif%2Cbmp%2Ctiff%2Csvg%2Cwebp");typeof $!="undefined"&&$&&typeof $.fn.on=="function"?$(i).on("rex:selectMedia",function(s,n){var P;s.preventDefault(),i.close();let a=((P=n.split(".").pop())==null?void 0:P.toLowerCase())||"",w=["jpg","jpeg","png","gif","webp"].indexOf(a)!==-1?"/media/tiny/"+n:"/media/"+n;t.setAttribute("src",w);let y=()=>{let f=t.naturalWidth,x=t.naturalHeight;f&&x?(t.setAttribute("width",String(f)),t.setAttribute("height",String(x))):(t.removeAttribute("width"),t.removeAttribute("height")),t.removeEventListener("load",y),t.removeEventListener("error",k),e.nodeChanged(),e.undoManager.add()},k=()=>{t.removeAttribute("width"),t.removeAttribute("height"),t.removeEventListener("load",y),t.removeEventListener("error",k),e.nodeChanged(),e.undoManager.add()};t.addEventListener("load",y),t.addEventListener("error",k),typeof $!="undefined"&&$.getJSON&&$.getJSON("index.php?rex-api-call=tinymce_media_meta&file="+encodeURIComponent(n)).done(function(f){f&&f.alt&&t.setAttribute("alt",f.alt)}).fail(function(){}),e.notificationManager.open({text:`Bild erfolgreich aktualisiert: ${n}`,type:"success",timeout:3e3})}):e.notificationManager.open({text:"jQuery ist nicht verf\xFCgbar. Bitte verwenden Sie den Standard-Medienpool.",type:"warning",timeout:5e3})}catch(i){e.notificationManager.open({text:"Medienpool konnte nicht ge\xF6ffnet werden.",type:"error",timeout:3e3})}}}),e.on("NodeChange",()=>{let t=m(e);if(!t)return;let i=o(),s=p(t,i.widthPresets),n=p(t,i.alignPresets),a=C(t,i.effectPresets),u=[];s&&s.class&&u.push(s.label),n&&n.class&&u.push(n.label),a.length>0&&u.push(a.map(y=>y.label).join(", "));let w=b(t)||t;u.length>0?w.setAttribute("title",u.join(" \xB7 ")):w.removeAttribute("title")})},I=()=>{tinymce.PluginManager.add("for_images",j)};I();})();
