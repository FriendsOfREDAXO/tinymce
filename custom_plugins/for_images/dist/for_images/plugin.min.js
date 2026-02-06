(()=>{var B=[{label:"Original",class:""},{label:"Klein (150px)",class:"img-width-small"},{label:"Mittel (300px)",class:"img-width-medium"},{label:"Gro\xDF (600px)",class:"img-width-large"},{label:"100%",class:"img-width-full"}],I=[{label:"Keine",class:""},{label:"Links",class:"img-align-left"},{label:"Rechts",class:"img-align-right"},{label:"Zentriert",class:"img-align-center"}],S=[{label:"Kein Effekt",class:""}];function m(t){if(t.nodeName==="FIGURE")return t;let r=t.parentElement;return r&&r.nodeName==="FIGURE"?r:null}function x(t,r){let l=m(r);if(l)return l;let e=t.getDoc().createElement("figure"),s=r.parentElement;return s&&s.nodeName==="P"?Array.from(s.childNodes).some(n=>n!==r&&(n.nodeType!==Node.TEXT_NODE||(n.textContent||"").trim()!==""))?(s.parentNode.insertBefore(e,s),e.appendChild(r)):(s.parentNode.insertBefore(e,s),e.appendChild(r),s.remove()):s&&(s.insertBefore(e,r),e.appendChild(r)),e}function g(t){let r=t.selection.getNode();if(r.nodeName==="IMG")return r;if(r.nodeName==="FIGURE")return r.querySelector("img");if(r.nodeName==="FIGCAPTION"){let l=r.parentElement;if((l==null?void 0:l.nodeName)==="FIGURE")return l.querySelector("img")}return null}function A(t){let r=[];return t.forEach(l=>{l.class&&l.class.split(/\s+/).forEach(i=>{i&&!r.includes(i)&&r.push(i)})}),r}function P(t,r){A(r).forEach(i=>t.classList.remove(i))}function v(t){let r=A(t).join(" ");return r.includes("uk-width")?"uk-width-1-1":/\bw-\d/.test(r)?"w-100":""}function T(t,r){t.classList.remove("uk-width-1-1","w-100"),t.style.removeProperty("width"),r?t.classList.add(r):t.style.width="100%"}function f(t,r,l,i){let e=l.class?x(t,r):m(r),s=v(i);e&&(P(e,i),l.class&&(l.class.split(/\s+/).forEach(a=>{a&&e.classList.add(a)}),T(r,s)),e.classList.length===0&&e.removeAttribute("class")),r.style.removeProperty("width"),r.style.removeProperty("height"),r.getAttribute("style")===""&&r.removeAttribute("style"),t.nodeChanged(),t.undoManager.add()}function H(t,r,l,i){if(l.class){let e=x(t,r),s=l.class.split(/\s+/).filter(n=>n);s.every(n=>e.classList.contains(n))?s.forEach(n=>e.classList.remove(n)):s.forEach(n=>e.classList.add(n)),e.classList.length===0&&e.removeAttribute("class")}else{let e=m(r);e&&(P(e,i),e.classList.length===0&&e.removeAttribute("class"))}t.nodeChanged(),t.undoManager.add()}function u(t,r){let i=m(t)||t;for(let e of r){if(!e.class)continue;let s=e.class.split(/\s+/).filter(a=>a);if(s.length>0&&s.every(a=>i.classList.contains(a)))return e}return null}function y(t,r){let i=m(t)||t,e=[];for(let s of r){if(!s.class)continue;let a=s.class.split(/\s+/).filter(n=>n);a.length>0&&a.every(n=>i.classList.contains(n))&&e.push(s)}return e}var _=`
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
`,F=(t,r)=>{t.options.register("imagewidth_presets",{processor:"object[]",default:null}),t.options.register("imagealign_presets",{processor:"object[]",default:null}),t.options.register("imageeffect_presets",{processor:"object[]",default:null});let l=()=>{let i=e=>{var a,n;let s=t.options.get(e);return s||(s=(a=t.settings)==null?void 0:a[e]),s||(s=(n=t.getParam)==null?void 0:n.call(t,e,null)),s};return{widthPresets:i("imagewidth_presets")||B,alignPresets:i("imagealign_presets")||I,effectPresets:i("imageeffect_presets")||S}};t.on("init",()=>{let i=t.getDoc();if(i){let n=i.createElement("style");n.setAttribute("data-for-images-plugin","1"),n.textContent=_,i.head.appendChild(n)}let e=t.getBody(),s=l(),a=v(s.widthPresets);e.querySelectorAll("figure").forEach(n=>{let o=n,p=o.querySelector("img");p&&o.classList.length>0&&T(p,a)})}),t.on("ObjectResizeStart",i=>{i.target&&i.target.nodeName==="IMG"&&i.preventDefault()}),t.options.set("object_resizing",!1),t.options.set("quickbars_image_toolbar",!1),t.options.set("image_caption",!1),t.ui.registry.addMenuButton("imagewidth",{icon:"resize",tooltip:"Bildbreite",fetch:i=>{let e=g(t);if(!e){i([]);return}let s=l(),a=u(e,s.widthPresets);i(s.widthPresets.map(n=>({type:"menuitem",text:n.label,icon:a&&a.class===n.class?"checkmark":void 0,onAction:()=>f(t,e,n,s.widthPresets)})))}}),t.ui.registry.addToggleButton("imagealignleft",{icon:"align-left",tooltip:"Bild links",onAction:()=>{let i=g(t);if(!i)return;let e=l(),s=e.alignPresets.find(n=>n.class.includes("float-left")||n.class.includes("float-start")||n.class.includes("align-left")||n.class.includes("uk-float-left")),a=u(i,e.alignPresets);a&&s&&a.class===s.class?f(t,i,{label:"",class:""},e.alignPresets):s&&f(t,i,s,e.alignPresets)},onSetup:i=>{let e=()=>{let s=g(t);if(!s){i.setActive(!1);return}let a=l(),n=u(s,a.alignPresets);i.setActive(!!n&&(n.class.includes("float-left")||n.class.includes("float-start")||n.class.includes("align-left")||n.class.includes("uk-float-left")))};return t.on("NodeChange",e),()=>t.off("NodeChange",e)}}),t.ui.registry.addToggleButton("imagealigncenter",{icon:"align-center",tooltip:"Bild zentrieren",onAction:()=>{let i=g(t);if(!i)return;let e=l(),s=e.alignPresets.find(n=>n.class.includes("margin-auto")||n.class.includes("mx-auto")||n.class.includes("align-center")),a=u(i,e.alignPresets);a&&s&&a.class===s.class?f(t,i,{label:"",class:""},e.alignPresets):s&&f(t,i,s,e.alignPresets)},onSetup:i=>{let e=()=>{let s=g(t);if(!s){i.setActive(!1);return}let a=l(),n=u(s,a.alignPresets);i.setActive(!!n&&(n.class.includes("margin-auto")||n.class.includes("mx-auto")||n.class.includes("align-center")))};return t.on("NodeChange",e),()=>t.off("NodeChange",e)}}),t.ui.registry.addToggleButton("imagealignright",{icon:"align-right",tooltip:"Bild rechts",onAction:()=>{let i=g(t);if(!i)return;let e=l(),s=e.alignPresets.find(n=>n.class.includes("float-right")||n.class.includes("float-end")||n.class.includes("align-right")||n.class.includes("uk-float-right")),a=u(i,e.alignPresets);a&&s&&a.class===s.class?f(t,i,{label:"",class:""},e.alignPresets):s&&f(t,i,s,e.alignPresets)},onSetup:i=>{let e=()=>{let s=g(t);if(!s){i.setActive(!1);return}let a=l(),n=u(s,a.alignPresets);i.setActive(!!n&&(n.class.includes("float-right")||n.class.includes("float-end")||n.class.includes("align-right")||n.class.includes("uk-float-right")))};return t.on("NodeChange",e),()=>t.off("NodeChange",e)}}),t.ui.registry.addButton("imagealignnone",{icon:"remove-formatting",tooltip:"Ausrichtung entfernen",onAction:()=>{let i=g(t);if(!i)return;let e=l();f(t,i,{label:"",class:""},e.alignPresets)}}),t.ui.registry.addMenuButton("imageeffect",{icon:"color-picker",tooltip:"Bild-Effekte",fetch:i=>{let e=g(t);if(!e){i([]);return}let s=l(),a=y(e,s.effectPresets);i(s.effectPresets.map(n=>({type:"togglemenuitem",text:n.label,active:n.class===""?a.length===0:a.some(o=>o.class===n.class),onAction:()=>H(t,e,n,s.effectPresets)})))}}),t.ui.registry.addButton("imagewidthdialog",{icon:"image",tooltip:"Bildformatierung",onAction:()=>{let i=g(t);if(!i){t.notificationManager.open({text:"Bitte zuerst ein Bild ausw\xE4hlen.",type:"warning",timeout:3e3});return}let e=l(),s=u(i,e.widthPresets),a=u(i,e.alignPresets),n=y(i,e.effectPresets),o=e.widthPresets.map(c=>({text:c.label,value:c.class})),p=e.alignPresets.map(c=>({text:c.label,value:c.class})),b=e.effectPresets.filter(c=>c.class).map(c=>({type:"checkbox",name:"effect_"+c.class.replace(/\s+/g,"_"),label:c.label})),E={widthClass:(s==null?void 0:s.class)||"",alignClass:(a==null?void 0:a.class)||""};e.effectPresets.filter(c=>c.class).forEach(c=>{E["effect_"+c.class.replace(/\s+/g,"_")]=n.some(h=>h.class===c.class)});let k=[{type:"selectbox",name:"widthClass",label:"Breite",items:o},{type:"selectbox",name:"alignClass",label:"Ausrichtung",items:p}];b.length>0&&k.push({type:"bar",items:b}),t.windowManager.open({title:"Bildformatierung",size:"normal",body:{type:"panel",items:k},buttons:[{type:"cancel",name:"cancel",text:"Abbrechen"},{type:"submit",name:"save",text:"\xDCbernehmen",primary:!0}],initialData:E,onSubmit:c=>{let h=c.getData(),M=e.widthPresets.find(d=>d.class===h.widthClass)||{label:"",class:""};f(t,i,M,e.widthPresets);let N=e.alignPresets.find(d=>d.class===h.alignClass)||{label:"",class:""};f(t,i,N,e.alignPresets);let w=m(i);w&&(P(w,e.effectPresets),e.effectPresets.filter(d=>d.class).forEach(d=>{h["effect_"+d.class.replace(/\s+/g,"_")]&&d.class.split(/\s+/).forEach(C=>{C&&w.classList.add(C)})})),t.nodeChanged(),t.undoManager.add(),c.close()}})}}),t.ui.registry.addContextToolbar("for_imagestoolbar",{predicate:i=>i.nodeName==="IMG"||i.nodeName==="FIGURE"&&i.querySelector("img"),items:"imagewidth imagealignleft imagealigncenter imagealignright imageeffect imagealignnone | imagealt imagecaption",position:"node",scope:"node"}),t.ui.registry.addToggleButton("imagealt",{icon:"accessibility-check",tooltip:"Alt-Text bearbeiten",onAction:()=>{let i=g(t);if(!i)return;let e=i.getAttribute("alt")||"";t.windowManager.open({title:"Alt-Text (Bildbeschreibung)",body:{type:"panel",items:[{type:"input",name:"alttext",label:"Beschreibung f\xFCr Screenreader",placeholder:'z.B. "Rotes Auto vor blauem Himmel"'},{type:"htmlpanel",html:'<p style="color:#666;font-size:12px;margin-top:8px;">Beschreiben Sie den Bildinhalt kurz und pr\xE4gnant f\xFCr Menschen die das Bild nicht sehen k\xF6nnen.</p>'}]},initialData:{alttext:e},buttons:[{type:"cancel",text:"Abbrechen"},{type:"submit",text:"Speichern",primary:!0}],onSubmit:s=>{let a=s.getData();i.setAttribute("alt",a.alttext),t.nodeChanged(),t.undoManager.add(),s.close()}})},onSetup:i=>{let e=()=>{let s=g(t);if(!s){i.setActive(!1);return}let a=s.getAttribute("alt");i.setActive(!!a&&a.trim()!=="")};return t.on("NodeChange",e),e(),()=>t.off("NodeChange",e)}}),t.ui.registry.addToggleButton("imagecaption",{icon:"comment",tooltip:"Bildunterschrift",onAction:()=>{var s;let i=g(t);if(!i)return;let e=m(i);if(e){let a=e.querySelector("figcaption");if(a)(s=a.textContent)!=null&&s.trim()?t.selection.setCursorLocation(a,0):a.remove();else{let o=t.getDoc().createElement("figcaption");o.innerHTML="&nbsp;",e.appendChild(o),t.selection.setCursorLocation(o,0)}}else{let a=x(t,i),o=t.getDoc().createElement("figcaption");o.innerHTML="&nbsp;",a.appendChild(o),t.selection.setCursorLocation(o,0)}t.nodeChanged(),t.undoManager.add()},onSetup:i=>{let e=()=>{let s=g(t);if(!s){i.setActive(!1);return}let a=m(s),n=(a==null?void 0:a.querySelector("figcaption"))!==null;i.setActive(n)};return t.on("NodeChange",e),e(),()=>t.off("NodeChange",e)}}),t.on("NodeChange",()=>{let i=g(t);if(!i)return;let e=l(),s=u(i,e.widthPresets),a=u(i,e.alignPresets),n=y(i,e.effectPresets),o=[];s&&s.class&&o.push(s.label),a&&a.class&&o.push(a.label),n.length>0&&o.push(n.map(b=>b.label).join(", "));let p=m(i)||i;o.length>0?p.setAttribute("title",o.join(" \xB7 ")):p.removeAttribute("title")})},L=()=>{tinymce.PluginManager.add("for_images",F)};L();})();
