(()=>{var G=[{label:"Original",class:""},{label:"Klein (150px)",class:"img-width-small"},{label:"Mittel (300px)",class:"img-width-medium"},{label:"Gro\xDF (600px)",class:"img-width-large"},{label:"100%",class:"img-width-full"}],j=[{label:"Keine",class:""},{label:"Links",class:"img-align-left"},{label:"Rechts",class:"img-align-right"},{label:"Zentriert",class:"img-align-center"}],q=[{label:"Kein Effekt",class:""}],I=class{constructor(n){this.cache=null;this.editor=n}get(){if(this.cache)return this.cache;let n=g=>{var r,f,p;let c=this.editor.options.get(g);return(!c||Array.isArray(c)&&c.length===0)&&(c=(r=this.editor.settings)==null?void 0:r[g]),(!c||Array.isArray(c)&&c.length===0)&&(c=(p=(f=this.editor).getParam)==null?void 0:p.call(f,g,null)),c},l=(g,c)=>Array.isArray(g)&&g.length>0?g:c;return this.cache={widthPresets:l(n("imagewidth_presets"),G),alignPresets:l(n("imagealign_presets"),j),effectPresets:l(n("imageeffect_presets"),q)},this.cache}invalidate(){this.cache=null}getAllClasses(n){let l=[];return n.forEach(g=>{g.class&&g.class.split(/\s+/).forEach(c=>{c&&!l.includes(c)&&l.push(c)})}),l}};function b(e){if(e.nodeName==="FIGURE")return e;let n=e.parentElement;return n&&n.nodeName==="FIGURE"?n:null}function _(e,n){let l=b(n);if(l)return l;let c=e.getDoc().createElement("figure"),r=n.parentElement;return r&&r.nodeName==="P"?Array.from(r.childNodes).some(p=>p!==n&&(p.nodeType!==Node.TEXT_NODE||(p.textContent||"").trim()!==""))?(r.parentNode.insertBefore(c,r),c.appendChild(n)):(r.parentNode.insertBefore(c,r),c.appendChild(n),r.remove()):r&&(r.insertBefore(c,n),c.appendChild(n)),c}function h(e){let n=e.selection.getNode();if(n.nodeName==="IMG")return n;if(n.nodeName==="FIGURE")return n.querySelector("img");if(n.nodeName==="FIGCAPTION"){let l=n.parentElement;if((l==null?void 0:l.nodeName)==="FIGURE")return l.querySelector("img")}return null}function D(e,n){let l=n!=null?n:e.getBody();if(!l)return;Array.from(l.querySelectorAll("img")).filter(r=>{let f=r.parentElement;return!(f&&f.nodeName==="FIGURE")}).forEach(r=>{_(e,r)}),Array.from(l.querySelectorAll("figure")).forEach(r=>{if(!r.querySelector("img")){let f=r.children.length>0,p=(r.textContent||"").trim()!=="";if(f||p)return;r.remove()}})}function H(e,n,l){if(n.forEach(g=>e.classList.remove(g)),l){let g=[];e.classList.forEach(r=>{(r==="image"||r==="image_resized"||r.startsWith("image-style-")||r.startsWith("img-width-")||r.startsWith("img-height-"))&&g.push(r)}),g.forEach(r=>e.classList.remove(r));let c=e.style.width;c&&c.includes("%")&&(e.style.removeProperty("width"),e.getAttribute("style")===""&&e.removeAttribute("style"))}}function L(e,n){A(n).forEach(g=>e.classList.remove(g))}function A(e){let n=[];return e.forEach(l=>{l.class&&l.class.split(/\s+/).forEach(g=>{g&&!n.includes(g)&&n.push(g)})}),n}function z(e){let n=A(e).join(" ");return n.includes("uk-width")?"uk-width-1-1":/\bw-\d/.test(n)?"w-100":""}function R(e,n){e.classList.remove("uk-width-1-1","w-100"),e.style.removeProperty("width"),n?e.classList.add(n):e.style.width="100%"}function U(e,n,l,g,c=!1){let r=l.class?_(e,n):b(n),f=z(g),p=A(g);r&&(H(r,p,c),l.class?(l.class.split(/\s+/).forEach(d=>{d&&r.classList.add(d)}),R(n,f)):f&&(f.split(/\s+/).forEach(d=>{d&&n.classList.remove(d)}),n.classList.length===0&&n.removeAttribute("class")),r.classList.length===0&&r.removeAttribute("class")),n.style.removeProperty("width"),n.style.removeProperty("height"),n.getAttribute("style")===""&&n.removeAttribute("style"),e.nodeChanged(),e.undoManager.add()}function W(e,n,l,g,c=!1){if(l.class){let r=_(e,n),f=l.class.split(/\s+/).filter(d=>d);f.every(d=>r.classList.contains(d))?f.forEach(d=>r.classList.remove(d)):f.forEach(d=>r.classList.add(d)),c&&H(r,A(g),!0),r.classList.length===0&&r.removeAttribute("class")}else{let r=b(n);r&&(H(r,A(g),c),r.classList.length===0&&r.removeAttribute("class"))}e.nodeChanged(),e.undoManager.add()}function x(e,n,l,g){U(e,n,l,g,!!e.options.get("image_compat_warn"))}function K(e,n,l,g){W(e,n,l,g,!!e.options.get("image_compat_warn"))}function w(e,n){let g=b(e)||e;for(let c of n){if(!c.class)continue;let r=c.class.split(/\s+/).filter(f=>f);if(r.length>0&&r.every(f=>g.classList.contains(f)))return c}return null}function B(e,n){let g=b(e)||e,c=[];for(let r of n){if(!r.class)continue;let f=r.class.split(/\s+/).filter(p=>p);f.length>0&&f.every(p=>g.classList.contains(p))&&c.push(r)}return c}var X=`
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
`,V=(e,n)=>{e.options.register("imagewidth_presets",{processor:"object[]",default:[]}),e.options.register("imagealign_presets",{processor:"object[]",default:[]}),e.options.register("imageeffect_presets",{processor:"object[]",default:[]}),e.options.register("image_compat_warn",{processor:"boolean",default:!1}),e.options.register("image_caption",{processor:"boolean",default:!1});let l=new I(e),g=!!e.options.get("image_compat_warn"),c=!1,r=t=>t?!!(t.querySelector("figure.image, figure.image_resized")||t.querySelector('[class*="image-style-"]')):!1,f=()=>{if(c||!g)return;let t=e.getBody();if(r(t)){c=!0;try{e.notificationManager.open({type:"warning",text:"Hinweis: Dieser Inhalt enth\xE4lt Bildmarkup aus dem alten CKEditor 5 (z. B. figure.image, image-style-\u2026). Bitte die betroffenen Bilder mit der neuen Bildformatierungs-Toolbar (Breite, Ausrichtung, Effekte) erneut formatieren und den Beitrag speichern, damit das Markup einheitlich wird.",closeButton:!0,timeout:12e3})}catch(i){}}};e.ui.registry.addIcon("for_imagedialog",'<svg width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="12" rx="1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/><path d="M3 13l4-4 3 3 4-5 7 6"/><path d="M3 19h6M15 19h6"/><circle cx="12" cy="19" r="1.8" fill="currentColor" stroke="none"/></g></svg>'),e.ui.registry.addIcon("for_imagealignleft_icon",'<svg width="24" height="24" viewBox="0 0 20 20"><path fill="currentColor" opacity=".55" d="M2 3h16v1.5H2zM2 15h16v1.5H2z"/><rect x="2" y="7" width="10" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/><path fill="currentColor" d="M14 8h4v1.4h-4zM14 10.6h3.2V12H14zM14 13.2h3.8v1.3H14z"/></svg>'),e.ui.registry.addIcon("for_imagealigncenter_icon",'<svg width="24" height="24" viewBox="0 0 20 20"><path fill="currentColor" opacity=".55" d="M2 3h16v1.5H2zM2 15h16v1.5H2z"/><rect x="5" y="7" width="10" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'),e.ui.registry.addIcon("for_imagealignright_icon",'<svg width="24" height="24" viewBox="0 0 20 20"><path fill="currentColor" opacity=".55" d="M2 3h16v1.5H2zM2 15h16v1.5H2z"/><path fill="currentColor" d="M2 8h4v1.4H2zM2 10.6h3.2V12H2zM2 13.2h3.8v1.3H2z"/><rect x="8" y="7" width="10" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'),e.ui.registry.addIcon("for_imagealignnone_icon",'<svg width="24" height="24" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="12" rx="1.5" fill="#6b7280"/><circle cx="8.5" cy="9" r="0.9" fill="#ffffff"/><path d="M7.2 14l1.6-2 1.2 1.4 1.3-1.8 1.8 2.4" fill="none" stroke="#ffffff" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.8 18.2l12.4-12.4" stroke="#6b7280" stroke-width="1.8" stroke-linecap="round"/></svg>'),e.ui.registry.addIcon("for_imageswappool_icon",'<svg width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8H6m0 0l4-4m-4 4l4 4"/><path d="M8 16h10m0 0l-4-4m4 4l-4 4"/></g></svg>'),e.on("init",()=>{let t=e.getDoc();if(t){let a=t.createElement("style");a.setAttribute("data-for-images-plugin","1"),a.textContent=X,t.head.appendChild(a)}let i=l.get(),s=z(i.widthPresets);e.getBody().querySelectorAll("figure").forEach(a=>{let m=a,v=m.querySelector("img");v&&m.classList.length>0&&R(v,s)}),f()}),e.on("SetContent",()=>{D(e),f()}),e.on("PastePostProcess",t=>{t!=null&&t.node&&D(e,t.node)}),e.on("ObjectResizeStart",t=>{var i;((i=t.target)==null?void 0:i.nodeName)==="IMG"&&t.preventDefault()}),e.options.set("object_resizing",!1);let p=e.options.isRegistered;typeof p=="function"&&p.call(e.options,"quickbars_image_toolbar")&&e.options.set("quickbars_image_toolbar",!1),e.options.set("image_caption",!1);let d=()=>{let t=h(e);if(!t)return null;let i=b(t);return i&&i.nodeName==="FIGURE"?i:null},S=()=>{let t=d();return t?(e.selection.select(t,!0),e.nodeChanged(),!0):!1};e.on("copy",t=>{let i=d();!i||!t.clipboardData||(t.clipboardData.setData("text/html",i.outerHTML),t.clipboardData.setData("text/plain",i.textContent||""),t.preventDefault())}),e.on("cut",t=>{let i=d();!i||!t.clipboardData||(t.clipboardData.setData("text/html",i.outerHTML),t.clipboardData.setData("text/plain",i.textContent||""),t.preventDefault(),e.undoManager.transact(()=>{e.dom.remove(i)}),e.nodeChanged())}),e.on("keydown",t=>{let i=String(t.key||"").toLowerCase();if(i==="delete"||i==="backspace"){let s=d();if(s){t.preventDefault(),e.undoManager.transact(()=>{e.dom.remove(s)}),e.nodeChanged();return}}(t.ctrlKey||t.metaKey)&&(i==="c"||i==="x")&&S()}),e.on("BeforeExecCommand",t=>{let i=String(t.command||"").toLowerCase();if(i==="copy"||i==="cut"){S();return}if(i==="delete"||i==="forwarddelete"||i==="mceDelete"){let s=d();if(!s)return;t.preventDefault(),e.undoManager.transact(()=>{e.dom.remove(s)}),e.nodeChanged();return}}),e.ui.registry.addMenuButton("imagewidth",{icon:"resize",tooltip:"Bildbreite",fetch:t=>{let i=h(e);if(!i){t([]);return}let s=l.get(),o=w(i,s.widthPresets);t(s.widthPresets.map(a=>({type:"menuitem",text:a.label,icon:o&&o.class===a.class?"checkmark":void 0,onAction:()=>x(e,i,a,s.widthPresets)})))}}),e.ui.registry.addToggleButton("for_imagealignleft",{icon:"for_imagealignleft_icon",tooltip:"Bild links",onAction:()=>{let t=h(e);if(!t)return;let i=l.get(),s=i.alignPresets.find(a=>a.class.includes("float-left")||a.class.includes("float-start")||a.class.includes("align-left")||a.class.includes("uk-float-left")),o=w(t,i.alignPresets);o&&s&&o.class===s.class?x(e,t,{label:"",class:""},i.alignPresets):s&&x(e,t,s,i.alignPresets)},onSetup:t=>{let i=()=>{let s=h(e);if(!s){t.setActive(!1);return}let o=l.get(),a=w(s,o.alignPresets);t.setActive(!!a&&(a.class.includes("float-left")||a.class.includes("float-start")||a.class.includes("align-left")||a.class.includes("uk-float-left")))};return e.on("NodeChange",i),()=>e.off("NodeChange",i)}}),e.ui.registry.addToggleButton("for_imagealigncenter",{icon:"for_imagealigncenter_icon",tooltip:"Bild zentrieren",onAction:()=>{let t=h(e);if(!t)return;let i=l.get(),s=i.alignPresets.find(a=>a.class.includes("margin-auto")||a.class.includes("mx-auto")||a.class.includes("align-center")),o=w(t,i.alignPresets);o&&s&&o.class===s.class?x(e,t,{label:"",class:""},i.alignPresets):s&&x(e,t,s,i.alignPresets)},onSetup:t=>{let i=()=>{let s=h(e);if(!s){t.setActive(!1);return}let o=l.get(),a=w(s,o.alignPresets);t.setActive(!!a&&(a.class.includes("margin-auto")||a.class.includes("mx-auto")||a.class.includes("align-center")))};return e.on("NodeChange",i),()=>e.off("NodeChange",i)}}),e.ui.registry.addToggleButton("for_imagealignright",{icon:"for_imagealignright_icon",tooltip:"Bild rechts",onAction:()=>{let t=h(e);if(!t)return;let i=l.get(),s=i.alignPresets.find(a=>a.class.includes("float-right")||a.class.includes("float-end")||a.class.includes("align-right")||a.class.includes("uk-float-right")),o=w(t,i.alignPresets);o&&s&&o.class===s.class?x(e,t,{label:"",class:""},i.alignPresets):s&&x(e,t,s,i.alignPresets)},onSetup:t=>{let i=()=>{let s=h(e);if(!s){t.setActive(!1);return}let o=l.get(),a=w(s,o.alignPresets);t.setActive(!!a&&(a.class.includes("float-right")||a.class.includes("float-end")||a.class.includes("align-right")||a.class.includes("uk-float-right")))};return e.on("NodeChange",i),()=>e.off("NodeChange",i)}}),e.ui.registry.addButton("for_imagealignnone",{icon:"for_imagealignnone_icon",tooltip:"Ausrichtung entfernen",onAction:()=>{let t=h(e);if(!t)return;let i=l.get();x(e,t,{label:"",class:""},i.alignPresets)}}),e.ui.registry.addMenuButton("imageeffect",{icon:"color-picker",tooltip:"Bild-Effekte",fetch:t=>{let i=h(e);if(!i){t([]);return}let s=l.get(),o=B(i,s.effectPresets);t(s.effectPresets.map(a=>({type:"togglemenuitem",text:a.label,active:a.class===""?o.length===0:o.some(m=>m.class===a.class),onAction:()=>K(e,i,a,s.effectPresets)})))}}),e.ui.registry.addButton("imagewidthdialog",{icon:"for_imagedialog",tooltip:"Bildformatierung",onAction:()=>{let t=h(e);if(!t){e.notificationManager.open({text:"Bitte zuerst ein Bild ausw\xE4hlen.",type:"warning",timeout:3e3});return}let i=l.get(),s=w(t,i.widthPresets),o=w(t,i.alignPresets),a=B(t,i.effectPresets),m=i.widthPresets.map(u=>({text:u.label,value:u.class})),v=i.alignPresets.map(u=>({text:u.label,value:u.class})),E=i.effectPresets.filter(u=>u.class).map(u=>({type:"checkbox",name:"effect_"+u.class.replace(/\s+/g,"_"),label:u.label})),y={widthClass:(s==null?void 0:s.class)||"",alignClass:(o==null?void 0:o.class)||""};i.effectPresets.filter(u=>u.class).forEach(u=>{y["effect_"+u.class.replace(/\s+/g,"_")]=a.some(P=>P.class===u.class)});let C=[{type:"selectbox",name:"widthClass",label:"Breite",items:m},{type:"selectbox",name:"alignClass",label:"Ausrichtung",items:v}];E.length>0&&C.push({type:"bar",items:E}),e.windowManager.open({title:"Bildformatierung",size:"normal",body:{type:"panel",items:C},buttons:[{type:"cancel",name:"cancel",text:"Abbrechen"},{type:"submit",name:"save",text:"\xDCbernehmen",primary:!0}],initialData:y,onSubmit:u=>{let P=u.getData(),M=i.widthPresets.find(k=>k.class===P.widthClass)||{label:"",class:""};x(e,t,M,i.widthPresets);let O=i.alignPresets.find(k=>k.class===P.alignClass)||{label:"",class:""};x(e,t,O,i.alignPresets);let T=b(t);T&&(L(T,i.effectPresets),i.effectPresets.filter(k=>k.class).forEach(k=>{P["effect_"+k.class.replace(/\s+/g,"_")]&&k.class.split(/\s+/).forEach(N=>{N&&T.classList.add(N)})})),e.nodeChanged(),e.undoManager.add(),u.close()}})}}),e.ui.registry.addContextToolbar("for_imagestoolbar",{predicate:t=>t.nodeName==="IMG"||t.nodeName==="FIGURE"&&t.querySelector("img"),items:"imagewidth for_imagealignleft for_imagealigncenter for_imagealignright imageeffect for_imagealignnone | imagealt imagecaption imageshowpool imageswappool",position:"node",scope:"node"}),e.ui.registry.addToggleButton("imagealt",{icon:"accessibility-check",tooltip:"Alt-Text bearbeiten",onAction:()=>{let t=h(e);if(!t)return;let i=t.getAttribute("alt")||"";e.windowManager.open({title:"Alt-Text (Bildbeschreibung)",body:{type:"panel",items:[{type:"input",name:"alttext",label:"Beschreibung f\xFCr Screenreader",placeholder:'z.B. "Rotes Auto vor blauem Himmel"'},{type:"htmlpanel",html:'<p style="color:#666;font-size:12px;margin-top:8px;">Beschreiben Sie den Bildinhalt kurz und pr\xE4gnant f\xFCr Menschen die das Bild nicht sehen k\xF6nnen.</p>'}]},initialData:{alttext:i},buttons:[{type:"cancel",text:"Abbrechen"},{type:"submit",text:"Speichern",primary:!0}],onSubmit:s=>{let o=s.getData();t.setAttribute("alt",o.alttext),e.nodeChanged(),e.undoManager.add(),s.close()}})},onSetup:t=>{let i=()=>{let s=h(e);if(!s){t.setActive(!1);return}let o=s.getAttribute("alt");t.setActive(!!o&&o.trim()!=="")};return e.on("NodeChange",i),i(),()=>e.off("NodeChange",i)}}),e.ui.registry.addToggleButton("imagecaption",{icon:"comment",tooltip:"Bildunterschrift",onAction:()=>{var s;let t=h(e);if(!t)return;let i=b(t);if(i){let o=i.querySelector("figcaption");if(o)(s=o.textContent)!=null&&s.trim()?e.selection.setCursorLocation(o,0):o.remove();else{let m=e.getDoc().createElement("figcaption");m.innerHTML="&nbsp;",i.appendChild(m),e.selection.setCursorLocation(m,0)}}else{let o=_(e,t),m=e.getDoc().createElement("figcaption");m.innerHTML="&nbsp;",o.appendChild(m),e.selection.setCursorLocation(m,0)}e.nodeChanged(),e.undoManager.add()},onSetup:t=>{let i=()=>{let s=h(e);if(!s){t.setActive(!1);return}let o=b(s),a=(o==null?void 0:o.querySelector("figcaption"))!==null;t.setActive(a)};return e.on("NodeChange",i),i(),()=>e.off("NodeChange",i)}}),e.ui.registry.addButton("imageshowpool",{icon:"gallery",tooltip:"Zeige Medium im Medienpool",onAction:()=>{var o;let t=h(e);if(!t){e.notificationManager.open({text:"Bitte zuerst ein Bild ausw\xE4hlen.",type:"warning",timeout:3e3});return}let i=t.getAttribute("src");if(!i){e.notificationManager.open({text:"Bildquelle nicht gefunden.",type:"warning",timeout:3e3});return}let s=((o=i.split("/").pop())==null?void 0:o.split("?")[0])||"";if(s)try{let a="index.php?page=mediapool/media&file_name="+encodeURIComponent(s);window.open(a,"mediapool","width=1000,height=700,resizable=yes,scrollbars=yes"),e.notificationManager.open({text:`Medienpool \xF6ffnet sich f\xFCr: ${s}`,type:"info",timeout:3e3})}catch(a){e.notificationManager.open({text:"Medienpool konnte nicht ge\xF6ffnet werden.",type:"error",timeout:3e3})}}}),e.ui.registry.addButton("imageswappool",{icon:"for_imageswappool_icon",tooltip:"Austauschen aus Medienpool",onAction:()=>{let t=h(e);if(!t){e.notificationManager.open({text:"Bitte zuerst ein Bild ausw\xE4hlen.",type:"warning",timeout:3e3});return}if(typeof openREXMedia!="function"){e.notificationManager.open({text:"Medienpool ist nicht verf\xFCgbar.",type:"error",timeout:3e3});return}try{let i=openREXMedia("tinymce_medialink","&args[types]=jpg%2Cjpeg%2Cpng%2Cgif%2Cbmp%2Ctiff%2Csvg%2Cwebp");typeof $!="undefined"&&$&&typeof $.fn.on=="function"?$(i).on("rex:selectMedia",function(s,o){var P;s.preventDefault(),i.close();let a=((P=o.split(".").pop())==null?void 0:P.toLowerCase())||"",v=["jpg","jpeg","png","gif","webp"].indexOf(a)!==-1?"/media/tiny/"+o:"/media/"+o,E=l.get(),y=b(t);y&&(L(y,E.widthPresets),L(y,E.alignPresets),L(y,E.effectPresets),stripCke5LegacyClasses(y),y.classList.length===0&&y.removeAttribute("class")),t.removeAttribute("width"),t.removeAttribute("height"),t.style.removeProperty("width"),t.style.removeProperty("height"),t.getAttribute("style")===""&&t.removeAttribute("style"),t.setAttribute("src",v);let C=()=>{t.removeEventListener("load",C),t.removeEventListener("error",u),e.nodeChanged(),e.undoManager.add()},u=()=>{t.removeEventListener("load",C),t.removeEventListener("error",u),e.nodeChanged(),e.undoManager.add()};t.addEventListener("load",C),t.addEventListener("error",u),typeof $!="undefined"&&$.getJSON&&$.getJSON("index.php?rex-api-call=tinymce_media_meta&file="+encodeURIComponent(o)).done(function(M){M&&M.alt&&t.setAttribute("alt",M.alt)}).fail(function(){}),e.notificationManager.open({text:`Bild erfolgreich aktualisiert: ${o}`,type:"success",timeout:3e3})}):e.notificationManager.open({text:"jQuery ist nicht verf\xFCgbar. Bitte verwenden Sie den Standard-Medienpool.",type:"warning",timeout:5e3})}catch(i){e.notificationManager.open({text:"Medienpool konnte nicht ge\xF6ffnet werden.",type:"error",timeout:3e3})}}}),e.on("NodeChange",()=>{let t=h(e);if(!t)return;let i=l.get(),s=w(t,i.widthPresets),o=w(t,i.alignPresets),a=B(t,i.effectPresets),m=[];s&&s.class&&m.push(s.label),o&&o.class&&m.push(o.label),a.length>0&&m.push(a.map(E=>E.label).join(", "));let v=b(t)||t;m.length>0?v.setAttribute("title",m.join(" \xB7 ")):v.removeAttribute("title")})},F=()=>{tinymce.PluginManager.add("for_images",V)};F();})();
