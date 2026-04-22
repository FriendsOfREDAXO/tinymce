"use strict";(()=>{var q=Object.defineProperty;var H=Object.getOwnPropertySymbols;var W=Object.prototype.hasOwnProperty,V=Object.prototype.propertyIsEnumerable;var B=(e,t,r)=>t in e?q(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,L=(e,t)=>{for(var r in t||(t={}))W.call(t,r)&&B(e,r,t[r]);if(H)for(var r of H(t))V.call(t,r)&&B(e,r,t[r]);return e};var U=["hier","klick hier","klicken","klicke hier","klicken sie hier","mehr","mehr erfahren","mehr lesen","weiter","weiterlesen","weiter lesen","link","dieser link","mehr infos","infos","read more","click here","more","here","learn more","details"],I={"img-missing-alt":!0,"img-alt-in-text-link":!0,"img-empty-alt-nondeco":!0,"link-generic-text":!0,"link-no-accname":!0,"link-new-window":!0,"heading-empty":!0,"heading-skip":!0,"table-no-th":!0,"table-no-caption":!0,"table-th-no-scope":!0,"iframe-no-title":!0},E={error:0,warn:1,info:2},G={error:"Fehler",warn:"Warnung",info:"Hinweis"},Y={error:"\u26D4",warn:"\u26A0\uFE0F",info:"\u2139\uFE0F"};function K(e){try{let t=e.getParam("a11y_rules");if(t&&typeof t=="object")return L(L({},I),t)}catch(t){}return I}function X(e){try{let t=e.getParam("a11y_generic_link_texts");if(Array.isArray(t)&&t.length)return t.map(r=>String(r).toLowerCase().trim()).filter(Boolean)}catch(t){}return U}function Z(e){try{let t=e.getParam("a11y_new_window_warning");if(typeof t=="boolean")return t}catch(t){}return!0}function x(e,t=80){let r=e.replace(/\s+/g," ").trim();return r.length>t?r.slice(0,t-1)+"\u2026":r}function f(e){let t=e.tagName.toLowerCase(),r=x(e.textContent||"",60);if(t==="img"){let i=e.getAttribute("src")||"",c=e.getAttribute("alt");return`<img src="${x(i,40)}"${c===null?"":` alt="${x(c,20)}"`}>`}if(t==="a"){let i=e.getAttribute("href")||"";return`<a href="${x(i,40)}">${r||"(leer)"}</a>`}if(t==="iframe"){let i=e.getAttribute("src")||"";return`<iframe src="${x(i,40)}">`}return`<${t}>${r||"(leer)"}</${t}>`}function j(e){let t=e.cloneNode(!0);return Array.from(t.querySelectorAll("img")).forEach(r=>r.remove()),(t.textContent||"").trim().length>0}function J(e){let t=(e.getAttribute("aria-label")||"").trim();if(t)return t;let r=(e.getAttribute("title")||"").trim(),i=(e.textContent||"").trim();if(i)return i;if(r)return r;let c=e.querySelector("img");if(c){let o=(c.getAttribute("alt")||"").trim();if(o)return o}return""}function Q(e){let t=e.closest("a");return t?j(t):!1}function S(e,t){let r=K(t),i=X(t),c=Z(t),o=[];Array.from(e.querySelectorAll("img")).forEach(a=>{let n=a.hasAttribute("alt"),l=a.getAttribute("alt")||"",s=(a.getAttribute("role")||"").trim().toLowerCase(),d=s==="presentation"||s==="none",p=Q(a);if(r["img-missing-alt"]&&!n){p?o.push({id:"img-missing-alt",severity:"warn",title:"Bild in Textlink ohne alt-Attribut",message:'Das Bild ist in einem Link mit sichtbarem Text. Setze alt="" (leeres alt), damit Screenreader den Link-Text nicht doppelt ausgeben.',element:a,preview:f(a)}):o.push({id:"img-missing-alt",severity:"error",title:"Bild ohne alt-Attribut",message:'Jedes Bild braucht ein alt-Attribut. F\xFCr rein dekorative Bilder: alt="" oder role="presentation".',element:a,preview:f(a)});return}if(n&&l.trim().length>0&&p&&r["img-alt-in-text-link"]){o.push({id:"img-alt-in-text-link",severity:"warn",title:"Bild in Textlink mit gef\xFClltem alt",message:'Das Bild steht in einem Link mit sichtbarem Text. Ein leeres alt="" ist hier meist besser, damit der Link-Text nicht verdoppelt wird.',element:a,preview:f(a)});return}n&&l.trim().length===0&&!p&&!d&&r["img-empty-alt-nondeco"]&&o.push({id:"img-empty-alt-nondeco",severity:"warn",title:"Leeres alt-Attribut",message:"Leeres alt ist nur f\xFCr rein dekorative Bilder gedacht. Ist das Bild informativ, erg\xE4nze einen beschreibenden alt-Text.",element:a,preview:f(a)})}),Array.from(e.querySelectorAll("a[href]")).forEach(a=>{let n=J(a),l=(a.textContent||"").trim(),s=l.toLowerCase();if(r["link-no-accname"]&&!n){o.push({id:"link-no-accname",severity:"error",title:"Link ohne Beschriftung",message:"Der Link hat keinen sichtbaren Text, kein aria-label und kein Bild mit alt. Screenreader k\xF6nnen das Ziel nicht benennen.",element:a,preview:f(a)});return}if(r["link-generic-text"]&&l&&i.indexOf(s)!==-1&&o.push({id:"link-generic-text",severity:"warn",title:`Generischer Linktext: \u201E${x(l,30)}"`,message:"Linktexte sollten das Ziel beschreiben, damit sie auch aus dem Kontext gerissen verst\xE4ndlich sind (Screenreader-Linkliste).",element:a,preview:f(a)}),r["link-new-window"]&&c&&(a.getAttribute("target")||"").toLowerCase()==="_blank"){let p=(a.getAttribute("aria-label")||"").toLowerCase(),u=(a.getAttribute("title")||"").toLowerCase(),g=/neue[rm]?\s*(fenster|tab)|new\s*(window|tab)|öffnet in|opens in/;g.test(s)||g.test(p)||g.test(u)||o.push({id:"link-new-window",severity:"info",title:"Link \xF6ffnet in neuem Fenster",message:'Der Link \xF6ffnet mit target="_blank". Gib Nutzer:innen einen Hinweis im Linktext, aria-label oder title (z.B. \u201E(\xF6ffnet in neuem Fenster)").',element:a,preview:f(a)})}});let k=Array.from(e.querySelectorAll("h1, h2, h3, h4, h5, h6")),m=0;return k.forEach(a=>{let n=parseInt(a.tagName.substring(1),10);r["heading-empty"]&&!(a.textContent||"").trim()&&o.push({id:"heading-empty",severity:"warn",title:`Leere ${a.tagName}-\xDCberschrift`,message:"\xDCberschriften sollten nicht leer sein.",element:a,preview:f(a)}),r["heading-skip"]&&m>0&&n>m+1&&o.push({id:"heading-skip",severity:"warn",title:`Hierarchie-Sprung: ${a.tagName} nach h${m}`,message:`\xDCberschriften sollten nicht mehr als eine Ebene \xFCberspringen (von h${m} direkt zu ${a.tagName}).`,element:a,preview:f(a)}),m=n}),Array.from(e.querySelectorAll("table")).forEach(a=>{let n=a.querySelectorAll("th"),l=a.querySelector("caption");if(r["table-no-th"]&&n.length===0&&o.push({id:"table-no-th",severity:"warn",title:"Tabelle ohne <th>",message:"Datentabellen brauchen mindestens eine Kopfzelle (<th>), damit Screenreader Zeilen/Spalten ordnen k\xF6nnen.",element:a,preview:f(a)}),r["table-no-caption"]&&!l&&o.push({id:"table-no-caption",severity:"info",title:"Tabelle ohne <caption>",message:"Eine <caption> beschreibt den Inhalt der Tabelle und hilft bei der Orientierung.",element:a,preview:f(a)}),r["table-th-no-scope"]&&n.length>0){let s=!1,d=!1,p=Array.from(a.querySelectorAll("tr"));p.forEach(y=>{let w=Array.from(y.children);w.length>0&&w[0].tagName.toLowerCase()==="th"&&(s=!0)});let u=p.length?Array.from(p[0].children):[];d=u.every(y=>y.tagName.toLowerCase()==="th")&&u.length>0;let g=s&&d,h=Array.from(n).filter(y=>!y.getAttribute("scope"));g&&h.length>0&&o.push({id:"table-th-no-scope",severity:"info",title:"<th> ohne scope in komplexer Tabelle",message:'Bei Tabellen mit Zeilen- und Spaltenk\xF6pfen sollten alle <th> ein scope="row" oder scope="col" haben.',element:h[0],preview:f(h[0])})}}),r["iframe-no-title"]&&Array.from(e.querySelectorAll("iframe")).forEach(n=>{(n.getAttribute("title")||"").trim()||o.push({id:"iframe-no-title",severity:"warn",title:"iframe ohne title",message:"iframes brauchen ein title-Attribut, das den Inhalt f\xFCr Screenreader beschreibt.",element:n,preview:f(n)})}),o.sort((a,n)=>{let l=E[a.severity]-E[n.severity];if(l!==0)return l;let s=a.element.compareDocumentPosition(n.element);return s&Node.DOCUMENT_POSITION_FOLLOWING?-1:s&Node.DOCUMENT_POSITION_PRECEDING?1:0}),o}function v(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var ee=`
.for-a11y-panel {
    position: fixed;
    z-index: 1300;
    width: 420px; max-width: calc(100vw - 20px);
    background: #fff; color: #222;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,.2), 0 2px 6px rgba(0,0,0,.1);
    font: 13px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    display: flex; flex-direction: column;
    user-select: none;
}
.for-a11y-panel__drag {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 12px;
    background: linear-gradient(135deg, #e91e63, #9c27b0);
    color: #fff;
    border-top-left-radius: 8px; border-top-right-radius: 8px;
    cursor: move;
    font-weight: 600; font-size: 12px;
    letter-spacing: .3px;
}
.for-a11y-panel__drag-grip { opacity: .7; font-size: 14px; line-height: 1; }
.for-a11y-panel__drag-title { flex: 1 1 auto; }
.for-a11y-panel__close { background: transparent; border: 0; color: #fff; cursor: pointer; font-size: 16px; padding: 0 4px; line-height: 1; opacity: .85; }
.for-a11y-panel__close:hover { opacity: 1; }
.for-a11y-panel__body {
    padding: 14px 16px;
    user-select: text;
    max-height: 50vh; overflow: auto;
}
.for-a11y-panel__foot {
    padding: 8px 12px;
    border-top: 1px solid #eee;
    display: flex; gap: 6px; flex-wrap: wrap; align-items: center;
    background: #fafafa;
    border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;
}
.for-a11y-panel__foot .for-a11y-btn { font: inherit; padding: 6px 12px; border: 1px solid #d0d0d0; background: #fff; color: #222; border-radius: 4px; cursor: pointer; font-size: 13px; line-height: 1.2; }
.for-a11y-panel__foot .for-a11y-btn:hover:not(:disabled) { background: #f0f0f0; }
.for-a11y-panel__foot .for-a11y-btn:disabled { opacity: .4; cursor: not-allowed; }
.for-a11y-panel__foot .for-a11y-btn--nav { min-width: 36px; padding: 6px 10px; }
.for-a11y-panel__foot .for-a11y-btn--primary { background: #1976d2; color: #fff; border-color: #1976d2; }
.for-a11y-panel__foot .for-a11y-btn--primary:hover:not(:disabled) { background: #1565c0; border-color: #1565c0; }
.for-a11y-panel__foot .for-a11y-spacer { flex: 1 1 auto; }

.for-a11y-dlg { color: inherit; }
.for-a11y-dlg__progress { font-size: 11px; text-transform: uppercase; letter-spacing: .5px; opacity: .6; margin-bottom: 10px; }
.for-a11y-dlg__head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
.for-a11y-dlg__badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
    padding: 4px 10px; border-radius: 999px;
}
.for-a11y-dlg__badge--error { background: rgba(229, 57, 53, .12); color: #c62828; }
.for-a11y-dlg__badge--warn  { background: rgba(251, 140, 0, .14); color: #ef6c00; }
.for-a11y-dlg__badge--info  { background: rgba(30, 136, 229, .12); color: #1565c0; }
.for-a11y-dlg__title { margin: 0; font-size: 15px; font-weight: 600; flex: 1 1 auto; min-width: 0; }
.for-a11y-dlg__rule { font-size: 10px; opacity: .5; font-family: Menlo, Consolas, monospace; }

.for-a11y-dlg__msg { margin: 0 0 12px; font-size: 13px; line-height: 1.55; }
.for-a11y-dlg__preview-label { font-size: 11px; text-transform: uppercase; letter-spacing: .5px; opacity: .6; margin-bottom: 4px; }
.for-a11y-dlg__preview { margin: 0; font-family: Menlo, Consolas, monospace; font-size: 11px; background: #f6f6f6; padding: 8px 10px; border-radius: 4px; white-space: pre-wrap; word-break: break-all; border-left: 3px solid #bbb; }
.for-a11y-dlg__preview--error { border-left-color: #e53935; }
.for-a11y-dlg__preview--warn  { border-left-color: #fb8c00; }
.for-a11y-dlg__preview--info  { border-left-color: #1e88e5; }

.for-a11y-dlg--ok { text-align: center; padding: 20px 0; }
.for-a11y-dlg--ok .for-a11y-dlg__icon { font-size: 40px; color: #4caf50; margin-bottom: 8px; }
.for-a11y-dlg--ok h3 { margin: 0 0 4px; font-size: 16px; font-weight: 600; }
.for-a11y-dlg--ok p { margin: 0; opacity: .7; font-size: 12px; }

/* dark mode */
body.rex-theme-dark .for-a11y-panel,
body.tox-dialog__body-iframe-dark .for-a11y-panel { background: #2d2d2d; color: #eee; }
body.rex-theme-dark .for-a11y-panel__foot { background: #222; border-top-color: #3a3a3a; }
body.rex-theme-dark .for-a11y-panel__foot .for-a11y-btn { background: #3a3a3a; color: #eee; border-color: #4a4a4a; }
body.rex-theme-dark .for-a11y-panel__foot .for-a11y-btn:hover:not(:disabled) { background: #4a4a4a; }
body.rex-theme-dark .for-a11y-dlg__preview { background: #222; }
@media (prefers-color-scheme: dark) {
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-panel { background: #2d2d2d; color: #eee; }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-panel__foot { background: #222; border-top-color: #3a3a3a; }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-panel__foot .for-a11y-btn { background: #3a3a3a; color: #eee; border-color: #4a4a4a; }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-panel__foot .for-a11y-btn:hover:not(:disabled) { background: #4a4a4a; }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-dlg__preview { background: #222; }
}
`,te=`
[data-a11y-mark] {
    outline-offset: 2px !important;
    transition: outline-color .15s ease, box-shadow .15s ease !important;
}
[data-a11y-mark="error"] {
    outline: 2px solid #e53935 !important;
    box-shadow: 0 0 0 4px rgba(229, 57, 53, .15) !important;
}
[data-a11y-mark="warn"] {
    outline: 2px solid #fb8c00 !important;
    box-shadow: 0 0 0 4px rgba(251, 140, 0, .15) !important;
}
[data-a11y-mark="info"] {
    outline: 2px dashed #1e88e5 !important;
    box-shadow: 0 0 0 4px rgba(30, 136, 229, .10) !important;
}
[data-a11y-mark-active="1"] {
    outline-width: 3px !important;
    box-shadow: 0 0 0 6px rgba(255, 152, 0, .25) !important;
    animation: for-a11y-pulse 1s ease-in-out 0s 2;
}
@keyframes for-a11y-pulse {
    0%, 100% { outline-color: #ff9800; }
    50% { outline-color: #ffc107; }
}
`,R=!1,z=[];function re(e){if(!R)try{e.dom.addStyle(te),R=!0}catch(t){}}function T(e,t){re(e),A(e),z=t.slice();let r=new Map;t.forEach(i=>{if(!i.element||!i.element.isConnected)return;let c=r.get(i.element);(!c||E[i.severity]<E[c])&&r.set(i.element,i.severity)}),r.forEach((i,c)=>{c.setAttribute("data-a11y-mark",i)})}function A(e){try{let t=e.getBody();if(!t)return;t.querySelectorAll("[data-a11y-mark], [data-a11y-mark-active]").forEach(i=>{i.removeAttribute("data-a11y-mark"),i.removeAttribute("data-a11y-mark-active")})}catch(t){}z=[]}function D(e){let t=e.ownerDocument;t&&t.querySelectorAll("[data-a11y-mark-active]").forEach(r=>r.removeAttribute("data-a11y-mark-active")),e.setAttribute("data-a11y-mark-active","1"),setTimeout(()=>{e.getAttribute("data-a11y-mark-active")==="1"&&e.removeAttribute("data-a11y-mark-active")},2e3)}function ne(e,t){try{t.scrollIntoView({behavior:"smooth",block:"center"})}catch(r){}try{e.selection.select(t),e.nodeChanged(),e.focus()}catch(r){}D(t)}var $=!1;function ae(){if($)return;let e=document.createElement("style");e.id="for-a11y-panel-style",e.textContent=ee,document.head.appendChild(e),$=!0}var b=null;function oe(e,t){if(b){try{b.remove()}catch(n){}b=null}ae();let r=t.slice(),i=0,c=(n,l)=>{try{e.fire(n,l||{})}catch(s){}},o=document.createElement("div");o.className="for-a11y-panel",o.setAttribute("role","dialog"),o.setAttribute("aria-label","Barrierefreiheits-Check"),o.style.right="24px",o.style.bottom="24px";let _=()=>{try{o.remove()}catch(n){}b===o&&(b=null),A(e),c("A11ycheckStop")},C=()=>{if(r.length===0)return'<div class="for-a11y-dlg for-a11y-dlg--ok"><div class="for-a11y-dlg__icon">\u2713</div><h3>Keine Probleme gefunden</h3><p>Der Inhalt ist nach den aktivierten Regeln barrierefrei.</p></div>';let n=r[i];return`<div class="for-a11y-dlg"><div class="for-a11y-dlg__progress">Befund ${i+1} von ${r.length}</div><div class="for-a11y-dlg__head"><span class="for-a11y-dlg__badge for-a11y-dlg__badge--${n.severity}">${Y[n.severity]} ${v(G[n.severity])}</span><h3 class="for-a11y-dlg__title">${v(n.title)}</h3><span class="for-a11y-dlg__rule">${v(n.id)}</span></div><p class="for-a11y-dlg__msg">${v(n.message)}</p><div class="for-a11y-dlg__preview-label">Betroffenes Element</div><pre class="for-a11y-dlg__preview for-a11y-dlg__preview--${n.severity}">${v(n.preview)}</pre></div>`},k=()=>{let n=r.length>0;o.innerHTML=`<div class="for-a11y-panel__drag" data-role="drag"><span class="for-a11y-panel__drag-grip" aria-hidden="true">\u283F</span><span class="for-a11y-panel__drag-title">Barrierefreiheits-Check</span><button type="button" class="for-a11y-panel__close" data-act="close" aria-label="Schlie\xDFen" title="Schlie\xDFen">\u2715</button></div><div class="for-a11y-panel__body">${C()}</div><div class="for-a11y-panel__foot">`+(n?`<button type="button" class="for-a11y-btn for-a11y-btn--nav" data-act="prev" ${i<=0?"disabled":""} title="Vorheriger Befund">\u25C0</button><button type="button" class="for-a11y-btn for-a11y-btn--nav" data-act="next" ${i>=r.length-1?"disabled":""} title="N\xE4chster Befund">\u25B6</button><button type="button" class="for-a11y-btn" data-act="ignore">Ignorieren</button><button type="button" class="for-a11y-btn for-a11y-btn--primary" data-act="edit">Element bearbeiten</button>`:"")+'<span class="for-a11y-spacer"></span><button type="button" class="for-a11y-btn" data-act="recheck">Neu pr\xFCfen</button></div>'},m=()=>{let n=r[i];if(n&&n.element&&n.element.isConnected){try{n.element.scrollIntoView({behavior:"smooth",block:"center"})}catch(l){}D(n.element)}};o.addEventListener("click",n=>{let l=n.target.closest("[data-act]");if(!l)return;let s=l.getAttribute("data-act"),d=r[i];switch(s){case"close":_();return;case"prev":i>0&&i--;break;case"next":i<r.length-1&&i++;break;case"ignore":d&&(c("A11ycheckIgnore",{issue:d}),r.splice(i,1),i>=r.length&&(i=Math.max(0,r.length-1)),T(e,r));break;case"edit":if(d&&d.element&&d.element.isConnected){ne(e,d.element),_();return}break;case"recheck":r=S(e.getBody(),e),i=0,T(e,r);break}k(),m()});let M=n=>{if(!n.target.closest('[data-role="drag"]')||n.target.closest('[data-act="close"]'))return;n.preventDefault();let s=o.getBoundingClientRect(),d=n.clientX-s.left,p=n.clientY-s.top;o.style.right="auto",o.style.bottom="auto",o.style.left=s.left+"px",o.style.top=s.top+"px";let u=h=>{let y=window.innerWidth-o.offsetWidth-4,w=window.innerHeight-o.offsetHeight-4,P=Math.max(4,Math.min(y,h.clientX-d)),O=Math.max(4,Math.min(w,h.clientY-p));o.style.left=P+"px",o.style.top=O+"px"},g=()=>{document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",g)};document.addEventListener("mousemove",u),document.addEventListener("mouseup",g)};o.addEventListener("mousedown",M);let a=()=>{if(!o.isConnected)return;let n=o.getBoundingClientRect();n.right>window.innerWidth&&(o.style.left=Math.max(4,window.innerWidth-o.offsetWidth-4)+"px"),n.bottom>window.innerHeight&&(o.style.top=Math.max(4,window.innerHeight-o.offsetHeight-4)+"px")};window.addEventListener("resize",a),e.once("remove",_),k(),document.body.appendChild(o),b=o,T(e,r),c("A11ycheckStart",{total:r.length}),setTimeout(m,80)}function N(e){let t=e.getBody();if(!t)return;let r=S(t,e);oe(e,r)}var ie=()=>{tinymce.PluginManager.add("for_a11y",e=>(e.addCommand("forA11yCheck",()=>N(e)),e.on("SetContent Undo Redo",()=>{A(e)}),e.on("remove",()=>{A(e)}),e.ui.registry.addIcon("for-a11y-icon",'<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>'),e.ui.registry.addButton("for_a11y",{icon:"for-a11y-icon",tooltip:"Barrierefreiheit pr\xFCfen",onAction:()=>e.execCommand("forA11yCheck")}),e.ui.registry.addMenuItem("for_a11y",{icon:"for-a11y-icon",text:"Barrierefreiheit pr\xFCfen\u2026",onAction:()=>e.execCommand("forA11yCheck")}),{toggleaudit:()=>{N(e)},getReport:()=>{let t=e.getBody();return t?S(t,e):[]}}))},F=ie;F();})();
