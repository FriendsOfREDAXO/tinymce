(()=>{var H=[{label:"Original",class:""},{label:"Klein (150px)",class:"img-width-small"},{label:"Mittel (300px)",class:"img-width-medium"},{label:"Gro\xDF (600px)",class:"img-width-large"},{label:"100%",class:"img-width-full"}],O=[{label:"Keine",class:""},{label:"Links",class:"img-align-left"},{label:"Rechts",class:"img-align-right"},{label:"Zentriert",class:"img-align-center"}],F=[{label:"Kein Effekt",class:""}];function h(t){if(t.nodeName==="FIGURE")return t;let r=t.parentElement;return r&&r.nodeName==="FIGURE"?r:null}function A(t,r){let c=h(r);if(c)return c;let l=t.getDoc().createElement("figure"),o=r.parentElement;return o&&o.nodeName==="P"?Array.from(o.childNodes).some(i=>i!==r&&(i.nodeType!==Node.TEXT_NODE||(i.textContent||"").trim()!==""))?(o.parentNode.insertBefore(l,o),l.appendChild(r)):(o.parentNode.insertBefore(l,o),l.appendChild(r),o.remove()):o&&(o.insertBefore(l,r),l.appendChild(r)),l}function m(t){let r=t.selection.getNode();if(r.nodeName==="IMG")return r;if(r.nodeName==="FIGURE")return r.querySelector("img");if(r.nodeName==="FIGCAPTION"){let c=r.parentElement;if((c==null?void 0:c.nodeName)==="FIGURE")return c.querySelector("img")}return null}function M(t){let r=[];return t.forEach(c=>{c.class&&c.class.split(/\s+/).forEach(g=>{g&&!r.includes(g)&&r.push(g)})}),r}function C(t,r){M(r).forEach(g=>t.classList.remove(g))}function E(t){let r=[];t.classList.forEach(g=>{(g==="image"||g==="image_resized"||g.indexOf("image-style-")===0||g.indexOf("img-width-")===0||g.indexOf("img-height-")===0)&&r.push(g)}),r.forEach(g=>t.classList.remove(g));let c=t.style.width;c&&c.indexOf("%")!==-1&&(t.style.removeProperty("width"),t.getAttribute("style")===""&&t.removeAttribute("style"))}function B(t){let r=M(t).join(" ");return r.includes("uk-width")?"uk-width-1-1":/\bw-\d/.test(r)?"w-100":""}function N(t,r){t.classList.remove("uk-width-1-1","w-100"),t.style.removeProperty("width"),r?t.classList.add(r):t.style.width="100%"}function p(t,r,c,g){let l=c.class?A(t,r):h(r),o=B(g),e=!!t.options.get("image_compat_warn");l&&(C(l,g),e&&E(l),c.class?(c.class.split(/\s+/).forEach(i=>{i&&l.classList.add(i)}),N(r,o)):o&&(o.split(/\s+/).forEach(i=>{i&&r.classList.remove(i)}),r.classList.length===0&&r.removeAttribute("class")),l.classList.length===0&&l.removeAttribute("class")),r.style.removeProperty("width"),r.style.removeProperty("height"),r.getAttribute("style")===""&&r.removeAttribute("style"),t.nodeChanged(),t.undoManager.add()}function G(t,r,c,g){let l=!!t.options.get("image_compat_warn");if(c.class){let o=A(t,r),e=c.class.split(/\s+/).filter(s=>s);e.every(s=>o.classList.contains(s))?e.forEach(s=>o.classList.remove(s)):e.forEach(s=>o.classList.add(s)),l&&E(o),o.classList.length===0&&o.removeAttribute("class")}else{let o=h(r);o&&(C(o,g),l&&E(o),o.classList.length===0&&o.removeAttribute("class"))}t.nodeChanged(),t.undoManager.add()}function d(t,r){let g=h(t)||t;for(let l of r){if(!l.class)continue;let o=l.class.split(/\s+/).filter(e=>e);if(o.length>0&&o.every(e=>g.classList.contains(e)))return l}return null}function k(t,r){let g=h(t)||t,l=[];for(let o of r){if(!o.class)continue;let e=o.class.split(/\s+/).filter(i=>i);e.length>0&&e.every(i=>g.classList.contains(i))&&l.push(o)}return l}var R=`
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
`,z=(t,r)=>{t.options.register("imagewidth_presets",{processor:"object[]",default:[]}),t.options.register("imagealign_presets",{processor:"object[]",default:[]}),t.options.register("imageeffect_presets",{processor:"object[]",default:[]}),t.options.register("image_compat_warn",{processor:"boolean",default:!1});let c=!1,g=e=>e?!!(e.querySelector("figure.image, figure.image_resized")||e.querySelector('[class*="image-style-"]')):!1,l=()=>{if(c||!t.options.get("image_compat_warn"))return;let e=t.getBody();if(g(e)){c=!0;try{t.notificationManager.open({type:"warning",text:"Hinweis: Dieser Inhalt enth\xE4lt Bildmarkup aus dem alten CKEditor 5 (z. B. figure.image, image-style-\u2026). Bitte die betroffenen Bilder mit der neuen Bildformatierungs-Toolbar (Breite, Ausrichtung, Effekte) erneut formatieren und den Beitrag speichern, damit das Markup einheitlich wird.",closeButton:!0,timeout:12e3})}catch(i){}}};t.ui.registry.addIcon("for_imagedialog",'<svg width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="12" rx="1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/><path d="M3 13l4-4 3 3 4-5 7 6"/><path d="M3 19h6M15 19h6"/><circle cx="12" cy="19" r="1.8" fill="currentColor" stroke="none"/></g></svg>');let o=()=>{let e=s=>{var a,f;let n=t.options.get(s);return(!n||Array.isArray(n)&&n.length===0)&&(n=(a=t.settings)==null?void 0:a[s]),(!n||Array.isArray(n)&&n.length===0)&&(n=(f=t.getParam)==null?void 0:f.call(t,s,null)),n},i=(s,n)=>Array.isArray(s)&&s.length>0?s:n;return{widthPresets:i(e("imagewidth_presets"),H),alignPresets:i(e("imagealign_presets"),O),effectPresets:i(e("imageeffect_presets"),F)}};t.on("init",()=>{let e=t.getDoc();if(e){let a=e.createElement("style");a.setAttribute("data-for-images-plugin","1"),a.textContent=R,e.head.appendChild(a)}let i=t.getBody(),s=o(),n=B(s.widthPresets);i.querySelectorAll("figure").forEach(a=>{let f=a,w=f.querySelector("img");w&&f.classList.length>0&&N(w,n)}),l()}),t.on("SetContent",()=>{l()}),t.on("ObjectResizeStart",e=>{e.target&&e.target.nodeName==="IMG"&&e.preventDefault()}),t.options.set("object_resizing",!1),t.options.set("quickbars_image_toolbar",!1),t.options.set("image_caption",!1),t.ui.registry.addMenuButton("imagewidth",{icon:"resize",tooltip:"Bildbreite",fetch:e=>{let i=m(t);if(!i){e([]);return}let s=o(),n=d(i,s.widthPresets);e(s.widthPresets.map(a=>({type:"menuitem",text:a.label,icon:n&&n.class===a.class?"checkmark":void 0,onAction:()=>p(t,i,a,s.widthPresets)})))}}),t.ui.registry.addToggleButton("imagealignleft",{icon:"align-left",tooltip:"Bild links",onAction:()=>{let e=m(t);if(!e)return;let i=o(),s=i.alignPresets.find(a=>a.class.includes("float-left")||a.class.includes("float-start")||a.class.includes("align-left")||a.class.includes("uk-float-left")),n=d(e,i.alignPresets);n&&s&&n.class===s.class?p(t,e,{label:"",class:""},i.alignPresets):s&&p(t,e,s,i.alignPresets)},onSetup:e=>{let i=()=>{let s=m(t);if(!s){e.setActive(!1);return}let n=o(),a=d(s,n.alignPresets);e.setActive(!!a&&(a.class.includes("float-left")||a.class.includes("float-start")||a.class.includes("align-left")||a.class.includes("uk-float-left")))};return t.on("NodeChange",i),()=>t.off("NodeChange",i)}}),t.ui.registry.addToggleButton("imagealigncenter",{icon:"align-center",tooltip:"Bild zentrieren",onAction:()=>{let e=m(t);if(!e)return;let i=o(),s=i.alignPresets.find(a=>a.class.includes("margin-auto")||a.class.includes("mx-auto")||a.class.includes("align-center")),n=d(e,i.alignPresets);n&&s&&n.class===s.class?p(t,e,{label:"",class:""},i.alignPresets):s&&p(t,e,s,i.alignPresets)},onSetup:e=>{let i=()=>{let s=m(t);if(!s){e.setActive(!1);return}let n=o(),a=d(s,n.alignPresets);e.setActive(!!a&&(a.class.includes("margin-auto")||a.class.includes("mx-auto")||a.class.includes("align-center")))};return t.on("NodeChange",i),()=>t.off("NodeChange",i)}}),t.ui.registry.addToggleButton("imagealignright",{icon:"align-right",tooltip:"Bild rechts",onAction:()=>{let e=m(t);if(!e)return;let i=o(),s=i.alignPresets.find(a=>a.class.includes("float-right")||a.class.includes("float-end")||a.class.includes("align-right")||a.class.includes("uk-float-right")),n=d(e,i.alignPresets);n&&s&&n.class===s.class?p(t,e,{label:"",class:""},i.alignPresets):s&&p(t,e,s,i.alignPresets)},onSetup:e=>{let i=()=>{let s=m(t);if(!s){e.setActive(!1);return}let n=o(),a=d(s,n.alignPresets);e.setActive(!!a&&(a.class.includes("float-right")||a.class.includes("float-end")||a.class.includes("align-right")||a.class.includes("uk-float-right")))};return t.on("NodeChange",i),()=>t.off("NodeChange",i)}}),t.ui.registry.addButton("imagealignnone",{icon:"remove-formatting",tooltip:"Ausrichtung entfernen",onAction:()=>{let e=m(t);if(!e)return;let i=o();p(t,e,{label:"",class:""},i.alignPresets)}}),t.ui.registry.addMenuButton("imageeffect",{icon:"color-picker",tooltip:"Bild-Effekte",fetch:e=>{let i=m(t);if(!i){e([]);return}let s=o(),n=k(i,s.effectPresets);e(s.effectPresets.map(a=>({type:"togglemenuitem",text:a.label,active:a.class===""?n.length===0:n.some(f=>f.class===a.class),onAction:()=>G(t,i,a,s.effectPresets)})))}}),t.ui.registry.addButton("imagewidthdialog",{icon:"for_imagedialog",tooltip:"Bildformatierung",onAction:()=>{let e=m(t);if(!e){t.notificationManager.open({text:"Bitte zuerst ein Bild ausw\xE4hlen.",type:"warning",timeout:3e3});return}let i=o(),s=d(e,i.widthPresets),n=d(e,i.alignPresets),a=k(e,i.effectPresets),f=i.widthPresets.map(u=>({text:u.label,value:u.class})),w=i.alignPresets.map(u=>({text:u.label,value:u.class})),x=i.effectPresets.filter(u=>u.class).map(u=>({type:"checkbox",name:"effect_"+u.class.replace(/\s+/g,"_"),label:u.label})),v={widthClass:(s==null?void 0:s.class)||"",alignClass:(n==null?void 0:n.class)||""};i.effectPresets.filter(u=>u.class).forEach(u=>{v["effect_"+u.class.replace(/\s+/g,"_")]=a.some(y=>y.class===u.class)});let T=[{type:"selectbox",name:"widthClass",label:"Breite",items:f},{type:"selectbox",name:"alignClass",label:"Ausrichtung",items:w}];x.length>0&&T.push({type:"bar",items:x}),t.windowManager.open({title:"Bildformatierung",size:"normal",body:{type:"panel",items:T},buttons:[{type:"cancel",name:"cancel",text:"Abbrechen"},{type:"submit",name:"save",text:"\xDCbernehmen",primary:!0}],initialData:v,onSubmit:u=>{let y=u.getData(),_=i.widthPresets.find(b=>b.class===y.widthClass)||{label:"",class:""};p(t,e,_,i.widthPresets);let I=i.alignPresets.find(b=>b.class===y.alignClass)||{label:"",class:""};p(t,e,I,i.alignPresets);let P=h(e);P&&(C(P,i.effectPresets),i.effectPresets.filter(b=>b.class).forEach(b=>{y["effect_"+b.class.replace(/\s+/g,"_")]&&b.class.split(/\s+/).forEach(L=>{L&&P.classList.add(L)})})),t.nodeChanged(),t.undoManager.add(),u.close()}})}}),t.ui.registry.addContextToolbar("for_imagestoolbar",{predicate:e=>e.nodeName==="IMG"||e.nodeName==="FIGURE"&&e.querySelector("img"),items:"imagewidth imagealignleft imagealigncenter imagealignright imageeffect imagealignnone | imagealt imagecaption",position:"node",scope:"node"}),t.ui.registry.addToggleButton("imagealt",{icon:"accessibility-check",tooltip:"Alt-Text bearbeiten",onAction:()=>{let e=m(t);if(!e)return;let i=e.getAttribute("alt")||"";t.windowManager.open({title:"Alt-Text (Bildbeschreibung)",body:{type:"panel",items:[{type:"input",name:"alttext",label:"Beschreibung f\xFCr Screenreader",placeholder:'z.B. "Rotes Auto vor blauem Himmel"'},{type:"htmlpanel",html:'<p style="color:#666;font-size:12px;margin-top:8px;">Beschreiben Sie den Bildinhalt kurz und pr\xE4gnant f\xFCr Menschen die das Bild nicht sehen k\xF6nnen.</p>'}]},initialData:{alttext:i},buttons:[{type:"cancel",text:"Abbrechen"},{type:"submit",text:"Speichern",primary:!0}],onSubmit:s=>{let n=s.getData();e.setAttribute("alt",n.alttext),t.nodeChanged(),t.undoManager.add(),s.close()}})},onSetup:e=>{let i=()=>{let s=m(t);if(!s){e.setActive(!1);return}let n=s.getAttribute("alt");e.setActive(!!n&&n.trim()!=="")};return t.on("NodeChange",i),i(),()=>t.off("NodeChange",i)}}),t.ui.registry.addToggleButton("imagecaption",{icon:"comment",tooltip:"Bildunterschrift",onAction:()=>{var s;let e=m(t);if(!e)return;let i=h(e);if(i){let n=i.querySelector("figcaption");if(n)(s=n.textContent)!=null&&s.trim()?t.selection.setCursorLocation(n,0):n.remove();else{let f=t.getDoc().createElement("figcaption");f.innerHTML="&nbsp;",i.appendChild(f),t.selection.setCursorLocation(f,0)}}else{let n=A(t,e),f=t.getDoc().createElement("figcaption");f.innerHTML="&nbsp;",n.appendChild(f),t.selection.setCursorLocation(f,0)}t.nodeChanged(),t.undoManager.add()},onSetup:e=>{let i=()=>{let s=m(t);if(!s){e.setActive(!1);return}let n=h(s),a=(n==null?void 0:n.querySelector("figcaption"))!==null;e.setActive(a)};return t.on("NodeChange",i),i(),()=>t.off("NodeChange",i)}}),t.on("NodeChange",()=>{let e=m(t);if(!e)return;let i=o(),s=d(e,i.widthPresets),n=d(e,i.alignPresets),a=k(e,i.effectPresets),f=[];s&&s.class&&f.push(s.label),n&&n.class&&f.push(n.label),a.length>0&&f.push(a.map(x=>x.label).join(", "));let w=h(e)||e;f.length>0?w.setAttribute("title",f.join(" \xB7 ")):w.removeAttribute("title")})},S=()=>{tinymce.PluginManager.add("for_images",z)};S();})();
