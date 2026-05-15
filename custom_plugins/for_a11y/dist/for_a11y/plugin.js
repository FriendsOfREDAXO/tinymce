"use strict";(()=>{var Q=Object.defineProperty;var q=Object.getOwnPropertySymbols;var j=Object.prototype.hasOwnProperty,J=Object.prototype.propertyIsEnumerable;var I=(e,r,t)=>r in e?Q(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,N=(e,r)=>{for(var t in r||(r={}))j.call(r,t)&&I(e,t,r[t]);if(q)for(var t of q(r))J.call(r,t)&&I(e,t,r[t]);return e};var ee=["hier","klick hier","klicken","klicke hier","klicken sie hier","mehr","mehr erfahren","mehr lesen","weiter","weiterlesen","weiter lesen","link","dieser link","mehr infos","infos","read more","click here","more","here","learn more","details"],R={"img-missing-alt":!0,"img-alt-in-text-link":!0,"img-empty-alt-nondeco":!0,"img-alt-too-long":!0,"img-alt-filename":!0,"img-alt-redundant":!0,"link-generic-text":!0,"link-no-accname":!0,"link-new-window":!0,"link-raw-url":!0,"link-duplicate-text":!0,"link-file-no-format":!0,"heading-empty":!0,"heading-skip":!0,"heading-allcaps":!0,"text-bold-as-heading":!0,"text-bold-too-long":!0,"text-too-many-spaces":!0,"list-fake":!0,"list-single-item":!0,"blank-paragraphs":!0,"table-no-th":!0,"table-no-caption":!0,"table-th-no-scope":!0,"iframe-no-title":!0},M={error:0,warn:1,info:2},D={error:"Fehler",warn:"Warnung",info:"Hinweis"},P={error:"\u26D4",warn:"\u26A0\uFE0F",info:"\u2139\uFE0F"};function te(e){try{let r=e.getParam("a11y_rules");if(r&&typeof r=="object")return N(N({},R),r)}catch(r){}return R}function re(e){try{let r=e.getParam("a11y_generic_link_texts");if(Array.isArray(r)&&r.length)return r.map(t=>String(t).toLowerCase().trim()).filter(Boolean)}catch(r){}return ee}function ne(e){try{let r=e.getParam("a11y_new_window_warning");if(typeof r=="boolean")return r}catch(r){}return!0}function A(e,r=80){let t=e.replace(/\s+/g," ").trim();return t.length>r?t.slice(0,r-1)+"\u2026":t}function h(e){let r=e.tagName.toLowerCase(),t=A(e.textContent||"",60);if(r==="img"){let l=e.getAttribute("src")||"",o=e.getAttribute("alt");return`<img src="${A(l,40)}"${o===null?"":` alt="${A(o,20)}"`}>`}if(r==="a"){let l=e.getAttribute("href")||"";return`<a href="${A(l,40)}">${t||"(leer)"}</a>`}if(r==="iframe"){let l=e.getAttribute("src")||"";return`<iframe src="${A(l,40)}">`}return`<${r}>${t||"(leer)"}</${r}>`}function ie(e){let r=e.cloneNode(!0);return Array.from(r.querySelectorAll("img")).forEach(t=>t.remove()),(r.textContent||"").trim().length>0}function ae(e){let r=(e.getAttribute("aria-label")||"").trim();if(r)return r;let t=(e.getAttribute("title")||"").trim(),l=(e.textContent||"").trim();if(l)return l;if(t)return t;let o=e.querySelector("img");if(o){let i=(o.getAttribute("alt")||"").trim();if(i)return i}return""}function oe(e){let r=e.closest("a");return r?ie(r):!1}function C(e,r){let t=te(r),l=re(r),o=ne(r),i=[];Array.from(e.querySelectorAll("img")).forEach(n=>{let d=n.hasAttribute("alt"),f=n.getAttribute("alt")||"",s=(n.getAttribute("role")||"").trim().toLowerCase(),y=s==="presentation"||s==="none",a=oe(n);if(t["img-missing-alt"]&&!d){a?i.push({id:"img-missing-alt",severity:"warn",title:"Bild in Textlink ohne alt-Attribut",message:'Das Bild ist in einem Link mit sichtbarem Text. Setze alt="" (leeres alt), damit Screenreader den Link-Text nicht doppelt ausgeben.',element:n,preview:h(n)}):i.push({id:"img-missing-alt",severity:"error",title:"Bild ohne alt-Attribut",message:'Jedes Bild braucht ein alt-Attribut. F\xFCr rein dekorative Bilder: alt="" oder role="presentation".',element:n,preview:h(n)});return}if(d&&f.trim().length>0&&a&&t["img-alt-in-text-link"]){i.push({id:"img-alt-in-text-link",severity:"warn",title:"Bild in Textlink mit gef\xFClltem alt",message:'Das Bild steht in einem Link mit sichtbarem Text. Ein leeres alt="" ist hier meist besser, damit der Link-Text nicht verdoppelt wird.',element:n,preview:h(n)});return}d&&f.trim().length===0&&!a&&!y&&t["img-empty-alt-nondeco"]&&i.push({id:"img-empty-alt-nondeco",severity:"warn",title:"Leeres alt-Attribut",message:"Leeres alt ist nur f\xFCr rein dekorative Bilder gedacht. Ist das Bild informativ, erg\xE4nze einen beschreibenden alt-Text.",element:n,preview:h(n)});let c=f.trim();d&&c.length>0&&(t["img-alt-too-long"]&&c.length>150&&i.push({id:"img-alt-too-long",severity:"warn",title:`alt-Text zu lang (${c.length} Zeichen)`,message:"Halte alt-Texte pr\xE4gnant (Faustregel: < 150 Zeichen). Sehr lange Beschreibungen geh\xF6ren in den Flie\xDFtext oder in eine Bildunterschrift.",element:n,preview:h(n)}),t["img-alt-filename"]&&/^(img[_-]?\d+|dsc[_-]?\d+|dscn?\d+|p\d{6,}|screenshot[\s_-]|bild[_\s-]?\d+|foto[_\s-]?\d+|image[_\s-]?\d+|[a-z0-9_-]+\.(jpe?g|png|gif|webp|svg|avif))$/i.test(c)&&i.push({id:"img-alt-filename",severity:"warn",title:"alt-Text sieht wie ein Dateiname aus",message:`Der alt-Text \u201E${A(c,50)}" wirkt wie ein Dateiname. Beschreibe stattdessen, was auf dem Bild zu sehen ist.`,element:n,preview:h(n)}),t["img-alt-redundant"]&&/^(bild|foto|grafik|abbildung|image|picture|photo)\s+(von|mit|eines?|einer|der|des|the|of)\b/i.test(c)&&i.push({id:"img-alt-redundant",severity:"info",title:"Redundanter Pr\xE4fix im alt-Text",message:'Screenreader k\xFCndigen Bilder bereits als \u201EGrafik" an. Ein Pr\xE4fix wie \u201EBild von \u2026" ist doppelt. Entferne ihn im Bild-Dialog.',element:n,preview:h(n)}))});let _=Array.from(e.querySelectorAll("a[href]"));if(_.forEach(n=>{let d=ae(n),f=(n.textContent||"").trim(),s=f.toLowerCase();if(t["link-no-accname"]&&!d){i.push({id:"link-no-accname",severity:"error",title:"Link ohne Beschriftung",message:"Der Link hat keinen sichtbaren Text, kein aria-label und kein Bild mit alt. Screenreader k\xF6nnen das Ziel nicht benennen.",element:n,preview:h(n)});return}if(t["link-generic-text"]&&f&&l.indexOf(s)!==-1&&i.push({id:"link-generic-text",severity:"warn",title:`Generischer Linktext: \u201E${A(f,30)}"`,message:"Linktexte sollten das Ziel beschreiben, damit sie auch aus dem Kontext gerissen verst\xE4ndlich sind (Screenreader-Linkliste).",element:n,preview:h(n)}),t["link-new-window"]&&o&&(n.getAttribute("target")||"").toLowerCase()==="_blank"){let a=(n.getAttribute("aria-label")||"").toLowerCase(),c=(n.getAttribute("title")||"").toLowerCase(),m=/neue[rm]?\s*(fenster|tab)|new\s*(window|tab)|öffnet in|opens in/;m.test(s)||m.test(a)||m.test(c)||i.push({id:"link-new-window",severity:"info",title:"Link \xF6ffnet in neuem Fenster",message:'Der Link \xF6ffnet mit target="_blank". Gib Nutzer:innen einen Hinweis im Linktext, aria-label oder title (z.B. \u201E(\xF6ffnet in neuem Fenster)").',element:n,preview:h(n)})}if(t["link-raw-url"]&&f&&/^(https?:\/\/|www\.)\S+$/i.test(f)&&i.push({id:"link-raw-url",severity:"warn",title:"URL als Linktext",message:'Screenreader lesen URLs Zeichen f\xFCr Zeichen vor. Ersetze den Linktext durch eine kurze Beschreibung des Ziels (z. B. \u201EPressemitteilung vom 12.3.2024").',element:n,preview:h(n)}),t["link-file-no-format"]&&f){let a=(n.getAttribute("href")||"").toLowerCase().match(/\.(pdf|docx?|xlsx?|pptx?|odt|ods|odp|zip|rar|7z|epub|csv)(?:$|[?#])/);if(a){let c=a[1].toUpperCase().replace(/^DOCX?$/,"DOC").replace(/^XLSX?$/,"XLS").replace(/^PPTX?$/,"PPT"),m=(n.getAttribute("aria-label")||"")+" "+(n.getAttribute("title")||""),u=(f+" "+m).toLowerCase();u.indexOf(c.toLowerCase())===-1&&u.indexOf(a[1].toLowerCase())===-1&&i.push({id:"link-file-no-format",severity:"info",title:`Download-Link ohne Format-Hinweis (${c})`,message:`Der Link zeigt auf eine .${a[1]}-Datei. Erg\xE4nze das Format im Linktext (z. B. \u201EJahresbericht 2023 (${c})"), damit Nutzer:innen wissen, was sie herunterladen.`,element:n,preview:h(n)})}}}),t["link-duplicate-text"]){let n=new Map,d=new Map;_.forEach(f=>{let s=(f.textContent||"").trim().toLowerCase().replace(/\s+/g," "),y=(f.getAttribute("href")||"").trim();!s||!y||(n.has(s)||(n.set(s,new Set),d.set(s,f)),n.get(s).add(y))}),n.forEach((f,s)=>{if(f.size>1){let y=d.get(s);i.push({id:"link-duplicate-text",severity:"info",title:`Gleicher Linktext \u2013 ${f.size} verschiedene Ziele`,message:`Der Linktext \u201E${A(s,40)}" zeigt an ${f.size} Stellen auf unterschiedliche Seiten. Formuliere die Linktexte so, dass sie auch aus dem Kontext gerissen eindeutig sind.`,element:y,preview:h(y)})}})}let g=Array.from(e.querySelectorAll("h1, h2, h3, h4, h5, h6")),p=0;if(g.forEach(n=>{let d=parseInt(n.tagName.substring(1),10);if(t["heading-empty"]&&!(n.textContent||"").trim()&&i.push({id:"heading-empty",severity:"warn",title:`Leere ${n.tagName}-\xDCberschrift`,message:"\xDCberschriften sollten nicht leer sein.",element:n,preview:h(n)}),t["heading-skip"]&&p>0&&d>p+1&&i.push({id:"heading-skip",severity:"warn",title:`Hierarchie-Sprung: ${n.tagName} nach h${p}`,message:`\xDCberschriften sollten nicht mehr als eine Ebene \xFCberspringen (von h${p} direkt zu ${n.tagName}).`,element:n,preview:h(n)}),t["heading-allcaps"]){let s=(n.textContent||"").trim().replace(/[^\p{L}]/gu,"");s.length>=6&&s===s.toUpperCase()&&s!==s.toLowerCase()&&i.push({id:"heading-allcaps",severity:"warn",title:`${n.tagName} komplett in VERSALIEN`,message:"Schreibe die \xDCberschrift in normaler Gross-/Kleinschreibung. Gro\xDFbuchstaben werden von manchen Screenreadern Buchstabe f\xFCr Buchstabe vorgelesen. F\xFCr eine Versalien-Optik nutze besser CSS (`text-transform: uppercase`) im Frontend.",element:n,preview:h(n)})}p=d}),t["text-bold-as-heading"]||t["text-bold-too-long"]||t["text-too-many-spaces"]||t["list-fake"]||t["blank-paragraphs"]){let n=Array.from(e.querySelectorAll("p")),d=[],f=()=>{t["blank-paragraphs"]&&d.length>=2&&i.push({id:"blank-paragraphs",severity:"info",title:`${d.length} leere Abs\xE4tze hintereinander`,message:'Leere Abs\xE4tze werden von Screenreadern als \u201Eleer" angek\xFCndigt. Entferne sie und erzeuge Abst\xE4nde lieber \xFCber CSS (margin) statt <p>&nbsp;</p>.',element:d[0],preview:h(d[0])}),d=[]};n.forEach(s=>{let y=(s.textContent||"").replace(/\u00A0/g," ").trim();if(y.length===0){d.push(s);return}if(f(),t["text-too-many-spaces"]){let a=(s.textContent||"").replace(/\u00A0/g," ");/ {2,}/.test(a)&&i.push({id:"text-too-many-spaces",severity:"info",title:"Zu viele Leerzeichen im Absatz",message:"Mehrere aufeinanderfolgende Leerzeichen erschweren das Lesen und sind meist unbeabsichtigt. Reduziere sie auf ein Leerzeichen.",element:s,preview:h(s)})}t["text-bold-as-heading"]&&y.length<=120&&!Array.from(s.childNodes).some(c=>{if(c.nodeType===3)return(c.nodeValue||"").trim().length>0;if(c.nodeType!==1)return!1;let m=c,u=m.tagName.toLowerCase();return u==="strong"||u==="b"||u==="br"||u==="wbr"?!1:(m.textContent||"").trim().length>0})&&s.querySelector("strong, b")&&!/[.!?…]$/.test(y)&&i.push({id:"text-bold-as-heading",severity:"warn",title:"Fetter Absatz als Pseudo-\xDCberschrift",message:"Ein fett gesetzter Absatz ohne Satzzeichen wirkt wie eine \xDCberschrift, ist f\xFCr Screenreader aber Flie\xDFtext. Markiere den Absatz und wandle ihn \xFCber das Format-/Block-Dropdown in eine echte \xDCberschrift (h2/h3/\u2026) um.",element:s,preview:h(s)}),t["text-bold-too-long"]&&y.length>120&&!Array.from(s.childNodes).some(c=>{if(c.nodeType===3)return(c.nodeValue||"").trim().length>0;if(c.nodeType!==1)return!1;let m=c,u=m.tagName.toLowerCase();return u==="strong"||u==="b"||u==="br"||u==="wbr"?!1:(m.textContent||"").trim().length>0})&&s.querySelector("strong, b")&&i.push({id:"text-bold-too-long",severity:"warn",title:"Langer komplett fett formatierter Absatz",message:"Ein langer komplett fett formatierter Absatz ist schwer lesbar. Nutze Fettung nur f\xFCr kurze Hervorhebungen statt f\xFCr ganze Abs\xE4tze.",element:s,preview:h(s)}),t["list-fake"]&&/^\s*([-*•·●○►▶→]|\d{1,2}[.\)]|[a-z][.\)])\s+/i.test(y)&&(s.closest("ul, ol")||i.push({id:"list-fake",severity:"info",title:"Absatz beginnt wie ein Listeneintrag",message:'Der Absatz beginnt mit \u201E-", \u201E*", \u201E\u2022" oder einer Nummerierung. Markiere ihn und nutze den Listen-Button (Aufz\xE4hlung/Nummerierung), damit Screenreader die Liste als solche erkennen.',element:s,preview:h(s)}))}),f()}return t["list-single-item"]&&Array.from(e.querySelectorAll("ul, ol")).forEach(d=>{Array.from(d.children).filter(s=>s.tagName.toLowerCase()==="li").length===1&&i.push({id:"list-single-item",severity:"info",title:`${d.tagName.toLowerCase()}-Liste mit nur einem Eintrag`,message:"Eine Liste mit einem einzigen Eintrag ist semantisch unn\xF6tig. Wandle sie in einen normalen Absatz um oder erg\xE4nze weitere Punkte.",element:d,preview:h(d)})}),Array.from(e.querySelectorAll("table")).forEach(n=>{let d=n.querySelectorAll("th"),f=n.querySelector("caption");if(t["table-no-th"]&&d.length===0&&i.push({id:"table-no-th",severity:"warn",title:"Tabelle ohne <th>",message:"Datentabellen brauchen mindestens eine Kopfzelle (<th>), damit Screenreader Zeilen/Spalten ordnen k\xF6nnen.",element:n,preview:h(n)}),t["table-no-caption"]&&!f&&i.push({id:"table-no-caption",severity:"info",title:"Tabelle ohne <caption>",message:"Eine <caption> beschreibt den Inhalt der Tabelle und hilft bei der Orientierung.",element:n,preview:h(n)}),t["table-th-no-scope"]&&d.length>0){let s=!1,y=!1,a=Array.from(n.querySelectorAll("tr"));a.forEach(v=>{let L=Array.from(v.children);L.length>0&&L[0].tagName.toLowerCase()==="th"&&(s=!0)});let c=a.length?Array.from(a[0].children):[];y=c.every(v=>v.tagName.toLowerCase()==="th")&&c.length>0;let m=s&&y,u=Array.from(d).filter(v=>!v.getAttribute("scope"));m&&u.length>0&&i.push({id:"table-th-no-scope",severity:"info",title:"<th> ohne scope in komplexer Tabelle",message:'Bei Tabellen mit Zeilen- und Spaltenk\xF6pfen sollten alle <th> ein scope="row" oder scope="col" haben.',element:u[0],preview:h(u[0])})}}),t["iframe-no-title"]&&Array.from(e.querySelectorAll("iframe")).forEach(d=>{(d.getAttribute("title")||"").trim()||i.push({id:"iframe-no-title",severity:"warn",title:"iframe ohne title",message:"iframes brauchen ein title-Attribut, das den Inhalt f\xFCr Screenreader beschreibt.",element:d,preview:h(d)})}),i.sort((n,d)=>{let f=M[n.severity]-M[d.severity];if(f!==0)return f;let s=n.element.compareDocumentPosition(d.element);return s&Node.DOCUMENT_POSITION_FOLLOWING?-1:s&Node.DOCUMENT_POSITION_PRECEDING?1:0}),i}var k={};function z(e){if(!e||e.tagName.toLowerCase()!=="p")return null;let r=(e.textContent||"").trim(),t=r.match(/^([-*•·●○►▶→]|\d{1,2}[.\)]|[a-z][.\)])\s+(.*)$/i);if(!t)return null;let l=t[1]||"",o=(t[2]||r).trim();return{listType:/^(\d{1,2}[.\)]|[a-z][.\)])$/i.test(l)?"ol":"ul",itemText:o}}k["list-fake"]=(e,r)=>{let t=e.element;if(!t||t.tagName.toLowerCase()!=="p")return;let l=z(t);if(!l)return;let o=t,i=t.previousElementSibling;for(;i;){let p=z(i);if(!p||p.listType!==l.listType)break;o=i,i=i.previousElementSibling}let b=[],_=o;for(;_;){let p=z(_);if(!p||p.listType!==l.listType)break;b.push(_),_=_.nextElementSibling}if(!b.length)return;let g=r.dom.create(l.listType,{});b.forEach(p=>{let w=z(p);if(!w)return;let n=r.dom.create("li",{},w.itemText);g.appendChild(n)}),r.dom.replace(g,b[0]);for(let p=1;p<b.length;p++)r.dom.remove(b[p])};k["blank-paragraphs"]=(e,r)=>{let t=e.element;if(!t||t.tagName.toLowerCase()!=="p")return;let l=t;for(;l&&l.tagName.toLowerCase()==="p"&&(!l.textContent||l.textContent.trim()==="");){let o=l.nextElementSibling;r.dom.remove(l),l=o}};k["text-too-many-spaces"]=e=>{let r=e.element;if(!r)return;let t=l=>{if(l.nodeType===3){l.textContent=(l.textContent||"").replace(/ {2,}/g," ");return}l.childNodes.forEach(t)};t(r)};k["text-bold-as-heading"]=(e,r)=>{let t=e.element;if(!t)return;let l=t.tagName.toLowerCase();if(l.match(/^h[1-6]$/)||l!=="p")return;let o=null,i=t.previousElementSibling;for(;i;){if(i.tagName.match(/^h[1-6]$/i)){o=i;break}i=i.previousElementSibling}if(!o){let p=t.parentElement;for(;p&&p!==r.getBody();){for(i=p.previousElementSibling;i;){if(i.tagName.match(/^h[1-6]$/i)){o=i;break}let w=i.querySelector("h1, h2, h3, h4, h5, h6");if(w&&w.tagName.match(/^h[1-6]$/i)){o=w;break}i=i.previousElementSibling}if(o)break;p=p.parentElement}}let b=2;if(o){let p=parseInt(o.tagName[1],10);b=p<6?p+1:6}let _=t.textContent||"",g=r.dom.create(`h${b}`,{},_);r.dom.replace(g,t)};k["link-generic-text"]=(e,r)=>{let t=e.element;!t||t.tagName.toLowerCase()!=="a"||(r.selection.select(t),r.execCommand("mceLink"))};k["list-single-item"]=(e,r)=>{let t=e.element;if(!t)return;let l=t.tagName.toLowerCase();if(l!=="ul"&&l!=="ol")return;let o=t.querySelector("li");if(!o)return;let i=r.dom.create("p",{},o.innerHTML);r.dom.replace(i,t)};k["text-bold-too-long"]=e=>{let r=e.element;if(!r||r.tagName.toLowerCase()!=="p")return;Array.from(r.querySelectorAll("strong, b")).forEach(l=>{var o,i;for(;l.firstChild;)(o=l.parentNode)==null||o.insertBefore(l.firstChild,l);(i=l.parentNode)==null||i.removeChild(l)})};function E(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var le=`
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
.for-a11y-dlg__preview { margin: 0; font-family: Menlo, Consolas, monospace; font-size: 11px; background: #f6f6f6; color: #222; font-style: normal; padding: 8px 10px; border-radius: 4px; white-space: pre-wrap; word-break: break-all; border-left: 3px solid #bbb; }
.for-a11y-dlg__preview--error { border-left-color: #e53935; }
.for-a11y-dlg__preview--warn  { border-left-color: #fb8c00; }
.for-a11y-dlg__preview--info  { border-left-color: #1e88e5; }
.for-a11y-dlg__quickfix {
    margin-top: 10px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font: inherit;
    font-weight: 600;
    padding: 8px 12px;
    border: 1px solid #1976d2;
    background: #1976d2;
    color: #fff;
    border-radius: 6px;
    cursor: pointer;
}
.for-a11y-dlg__quickfix:hover {
    background: #1565c0;
    border-color: #1565c0;
}
.for-a11y-dlg__quickfix:focus-visible {
    outline: 2px solid #90caf9;
    outline-offset: 2px;
}

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
body.rex-theme-dark .for-a11y-dlg__preview { background: #222; color: #eee; }
body.rex-theme-dark .for-a11y-dlg__quickfix {
    background: #1e88e5;
    border-color: #1e88e5;
    color: #fff;
}
body.rex-theme-dark .for-a11y-dlg__quickfix:hover {
    background: #1976d2;
    border-color: #1976d2;
}
@media (prefers-color-scheme: dark) {
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-panel { background: #2d2d2d; color: #eee; }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-panel__foot { background: #222; border-top-color: #3a3a3a; }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-panel__foot .for-a11y-btn { background: #3a3a3a; color: #eee; border-color: #4a4a4a; }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-panel__foot .for-a11y-btn:hover:not(:disabled) { background: #4a4a4a; }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-dlg__preview { background: #222; color: #eee; }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-dlg__quickfix {
        background: #1e88e5;
        border-color: #1e88e5;
        color: #fff;
    }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-dlg__quickfix:hover {
        background: #1976d2;
        border-color: #1976d2;
    }
}

/* List-View Styles */
.for-a11y-list { }
.for-a11y-list__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
}
.for-a11y-list__th {
    text-align: left;
    padding: 8px 10px;
    background: #f5f5f5;
    border-bottom: 2px solid #ddd;
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .3px;
    color: #666;
}
.for-a11y-list__th--severity { width: 100px; }
.for-a11y-list__th--title { flex: 1; }
.for-a11y-list__th--actions { width: 130px; text-align: right; }
.for-a11y-list__row {
    border-bottom: 1px solid #eee;
    transition: background-color .15s ease;
}
.for-a11y-list__row:hover {
    background: #fafafa;
}
.for-a11y-list__cell {
    padding: 10px;
    vertical-align: top;
}
.for-a11y-list__cell--severity {
    text-align: center;
}
.for-a11y-list__cell--title {
    word-break: break-word;
}
.for-a11y-list__link {
    background: none;
    border: none;
    color: #1976d2;
    cursor: pointer;
    padding: 0;
    text-align: left;
    font: inherit;
    font-size: 13px;
    text-decoration: underline;
}
.for-a11y-list__link:hover {
    color: #1565c0;
}
.for-a11y-list__link:focus-visible {
    outline: 2px solid #90caf9;
    outline-offset: 2px;
    border-radius: 2px;
}
.for-a11y-list__rule {
    color: #999;
    font-family: Menlo, Consolas, monospace;
    font-size: 10px;
    opacity: .7;
}
.for-a11y-list__actions {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
}
.for-a11y-btn--sm {
    padding: 4px 8px !important;
    font-size: 12px !important;
    min-width: auto !important;
    line-height: 1 !important;
}
.for-a11y-btn--list {
    background: #fffacd !important;
    color: #666 !important;
    border-color: #f0e68c !important;
}
.for-a11y-btn--list:hover {
    background: #fff8dc !important;
    border-color: #ffe4b5 !important;
}
.for-a11y-panel__view-toggle {
    background: transparent;
    border: 0;
    color: #fff;
    cursor: pointer;
    font-size: 18px;
    padding: 0 4px;
    line-height: 1;
    opacity: .85;
    transition: opacity .15s ease;
}
.for-a11y-panel__view-toggle:hover {
    opacity: 1;
}

/* Dark mode f\xFCr List-View */
body.rex-theme-dark .for-a11y-list__th,
body.tox-dialog__body-iframe-dark .for-a11y-list__th {
    background: #3a3a3a;
    border-bottom-color: #555;
    color: #aaa;
}
body.rex-theme-dark .for-a11y-list__row:hover,
body.tox-dialog__body-iframe-dark .for-a11y-list__row:hover {
    background: #383838;
}
body.rex-theme-dark .for-a11y-list__row,
body.tox-dialog__body-iframe-dark .for-a11y-list__row {
    border-bottom-color: #444;
}
body.rex-theme-dark .for-a11y-list__link,
body.tox-dialog__body-iframe-dark .for-a11y-list__link {
    color: #64b5f6;
}
body.rex-theme-dark .for-a11y-list__link:hover,
body.tox-dialog__body-iframe-dark .for-a11y-list__link:hover {
    color: #90caf9;
}
body.rex-theme-dark .for-a11y-list__rule,
body.tox-dialog__body-iframe-dark .for-a11y-list__rule {
    color: #888;
}
@media (prefers-color-scheme: dark) {
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-list__th {
        background: #3a3a3a;
        border-bottom-color: #555;
        color: #aaa;
    }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-list__row:hover {
        background: #383838;
    }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-list__row {
        border-bottom-color: #444;
    }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-list__link {
        color: #64b5f6;
    }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-list__link:hover {
        color: #90caf9;
    }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-list__rule {
        color: #888;
    }
}
`,se=`
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
`,F=new Set,T=new Map;function Z(e){var r;return String((e==null?void 0:e.id)||((r=e==null?void 0:e.targetElm)==null?void 0:r.id)||"default")}function ce(e){let r=Z(e);if(!F.has(r))try{e.dom.addStyle(se),F.add(r)}catch(t){}}function S(e,r){ce(e),H(e);let t=new Map;r.forEach(l=>{if(!l.element||!l.element.isConnected)return;let o=t.get(l.element);(!o||M[l.severity]<M[o])&&t.set(l.element,l.severity)}),t.forEach((l,o)=>{o.setAttribute("data-a11y-mark",l)})}function H(e){try{let r=e.getBody();if(!r)return;r.querySelectorAll("[data-a11y-mark], [data-a11y-mark-active]").forEach(l=>{l.removeAttribute("data-a11y-mark"),l.removeAttribute("data-a11y-mark-active")})}catch(r){}}function B(e){let r=e.ownerDocument;r&&r.querySelectorAll("[data-a11y-mark-active]").forEach(t=>t.removeAttribute("data-a11y-mark-active")),e.setAttribute("data-a11y-mark-active","1"),setTimeout(()=>{e.getAttribute("data-a11y-mark-active")==="1"&&e.removeAttribute("data-a11y-mark-active")},2e3)}function O(e,r){try{r.scrollIntoView({behavior:"smooth",block:"center"})}catch(t){}try{e.selection.select(r),e.nodeChanged(),e.focus()}catch(t){}B(r)}var V=!1;function de(){if(V)return;let e=document.createElement("style");e.id="for-a11y-panel-style",e.textContent=le,document.head.appendChild(e),V=!0}function fe(e,r){let t=Z(e),l=T.get(t);if(l){try{l.remove()}catch(a){}T.delete(t)}de();let o=r.slice(),i=0,b="sequential",_=(a,c)=>{try{e.fire(a,c||{})}catch(m){}},g=document.createElement("div");g.className="for-a11y-panel",g.setAttribute("role","dialog"),g.setAttribute("aria-label","Barrierefreiheits-Check"),g.style.right="24px",g.style.bottom="24px";let p=()=>{if(!g.isConnected)return;let a=g.getBoundingClientRect();a.right>window.innerWidth&&(g.style.left=Math.max(4,window.innerWidth-g.offsetWidth-4)+"px"),a.bottom>window.innerHeight&&(g.style.top=Math.max(4,window.innerHeight-g.offsetHeight-4)+"px")},w=()=>{window.removeEventListener("resize",p);try{g.remove()}catch(a){}T.get(t)===g&&T.delete(t),H(e),_("A11ycheckStop")},n=()=>{if(o.length===0)return'<div class="for-a11y-dlg for-a11y-dlg--ok"><div class="for-a11y-dlg__icon">\u2713</div><h3>Keine Probleme gefunden</h3><p>Der Inhalt ist nach den aktivierten Regeln barrierefrei.</p></div>';let a=`<div class="for-a11y-list">
            <table class="for-a11y-list__table">
                <thead>
                    <tr>
                        <th class="for-a11y-list__th for-a11y-list__th--severity">Schwere</th>
                        <th class="for-a11y-list__th for-a11y-list__th--title">Problem</th>
                        <th class="for-a11y-list__th for-a11y-list__th--actions">Aktionen</th>
                    </tr>
                </thead>
                <tbody>`;return o.forEach((c,m)=>{let u=!!k[c.id];a+=`<tr class="for-a11y-list__row" data-finding-idx="${m}">
                <td class="for-a11y-list__cell for-a11y-list__cell--severity">
                    <span class="for-a11y-dlg__badge for-a11y-dlg__badge--${c.severity}" style="white-space: nowrap;">
                        ${P[c.severity]} ${E(D[c.severity])}
                    </span>
                </td>
                <td class="for-a11y-list__cell for-a11y-list__cell--title">
                    <button type="button" class="for-a11y-list__link" data-act="focus-finding" data-idx="${m}" title="${E(c.title)}">
                        <strong>${E(c.title)}</strong>
                    </button>
                    <br><small class="for-a11y-list__rule">${E(c.id)}</small>
                </td>
                <td class="for-a11y-list__cell for-a11y-list__cell--actions">
                    <div class="for-a11y-list__actions">
                        ${u?`<button type="button" class="for-a11y-btn for-a11y-btn--sm for-a11y-btn--list" data-act="quickfix" data-idx="${m}" title="Quickfix anwenden">\u26A1</button>`:""}
                        <button type="button" class="for-a11y-btn for-a11y-btn--sm" data-act="ignore-list" data-idx="${m}" title="Ignorieren">\u2715</button>
                        <button type="button" class="for-a11y-btn for-a11y-btn--sm" data-act="edit-list" data-idx="${m}" title="Element bearbeiten">\u270E</button>
                    </div>
                </td>
            </tr>`}),a+=`</tbody>
            </table>
        </div>`,a},d=()=>{if(o.length===0)return'<div class="for-a11y-dlg for-a11y-dlg--ok"><div class="for-a11y-dlg__icon">\u2713</div><h3>Keine Probleme gefunden</h3><p>Der Inhalt ist nach den aktivierten Regeln barrierefrei.</p></div>';let a=o[i],c=!!k[a.id],m="Quickfix anwenden";return a.id==="list-fake"&&(m="In Liste umwandeln"),a.id==="list-single-item"&&(m="In Absatz umwandeln"),a.id==="blank-paragraphs"&&(m="Leere Abs\xE4tze entfernen"),a.id==="text-bold-as-heading"&&(m="In \xDCberschrift umwandeln"),a.id==="text-bold-too-long"&&(m="Fettung entfernen"),a.id==="text-too-many-spaces"&&(m="Leerzeichen bereinigen"),a.id==="link-generic-text"&&(m="Linktext bearbeiten"),`<div class="for-a11y-dlg"><div class="for-a11y-dlg__progress">Befund ${i+1} von ${o.length}</div><div class="for-a11y-dlg__head"><span class="for-a11y-dlg__badge for-a11y-dlg__badge--${a.severity}">${P[a.severity]} ${E(D[a.severity])}</span><h3 class="for-a11y-dlg__title">${E(a.title)}</h3><span class="for-a11y-dlg__rule">${E(a.id)}</span></div><p class="for-a11y-dlg__msg">${E(a.message)}</p><div class="for-a11y-dlg__preview-label">Betroffenes Element</div><pre class="for-a11y-dlg__preview for-a11y-dlg__preview--${a.severity}">${E(a.preview)}</pre>`+(c?`<button type="button" class="for-a11y-btn for-a11y-dlg__quickfix" data-act="quickfix">${m}</button>`:"")+"</div>"},f=()=>{let a=o.length>0,c=b==="list"?n():d();g.innerHTML=`<div class="for-a11y-panel__drag" data-role="drag"><span class="for-a11y-panel__drag-grip" aria-hidden="true">\u283F</span><span class="for-a11y-panel__drag-title">Barrierefreiheits-Check</span><button type="button" class="for-a11y-panel__view-toggle" data-act="toggle-view" aria-label="Ansicht umschalten" title="${b==="sequential"?"Zur Liste wechseln":"Zur Sequenzansicht wechseln"}">${b==="sequential"?"\u2630":"\u2295"}</button><button type="button" class="for-a11y-panel__close" data-act="close" aria-label="Schlie\xDFen" title="Schlie\xDFen">\u2715</button></div><div class="for-a11y-panel__body">${c}</div><div class="for-a11y-panel__foot">`+(a&&b==="sequential"?`<button type="button" class="for-a11y-btn for-a11y-btn--nav" data-act="prev" ${i<=0?"disabled":""} title="Vorheriger Befund">\u25C0</button><button type="button" class="for-a11y-btn for-a11y-btn--nav" data-act="next" ${i>=o.length-1?"disabled":""} title="N\xE4chster Befund">\u25B6</button><button type="button" class="for-a11y-btn" data-act="ignore">Ignorieren</button><button type="button" class="for-a11y-btn for-a11y-btn--primary" data-act="edit">Element bearbeiten</button>`:"")+'<span class="for-a11y-spacer"></span><button type="button" class="for-a11y-btn" data-act="recheck">Neu pr\xFCfen</button></div>'},s=()=>{let a=o[i];if(a&&a.element&&a.element.isConnected){try{a.element.scrollIntoView({behavior:"smooth",block:"center"})}catch(c){}B(a.element)}};g.addEventListener("click",a=>{let c=a.target.closest("[data-act], .for-a11y-btn--primary");if(!c)return;let m=c.getAttribute("data-act")||(c.classList.contains("for-a11y-btn--primary")?"quickfix":null);if(b==="list"){let v=c.getAttribute("data-idx"),L=v?parseInt(v,10):-1;if(L>=0&&L<o.length){let x=o[L];switch(m){case"focus-finding":if(x&&x.element&&x.element.isConnected){try{x.element.scrollIntoView({behavior:"smooth",block:"center"})}catch($){}B(x.element)}return;case"quickfix":x&&x.id&&k[x.id]&&(k[x.id](x,e),o=C(e.getBody(),e),f());return;case"ignore-list":_("A11ycheckIgnore",{issue:x}),o.splice(L,1),S(e,o),f();return;case"edit-list":if(x&&x.element&&x.element.isConnected){O(e,x.element),w();return}return;case"toggle-view":b=b==="sequential"?"list":"sequential",f();return}}}let u=o[i];switch(m){case"close":w();return;case"toggle-view":b=b==="sequential"?"list":"sequential";break;case"prev":i>0&&i--;break;case"next":i<o.length-1&&i++;break;case"ignore":u&&(_("A11ycheckIgnore",{issue:u}),o.splice(i,1),i>=o.length&&(i=Math.max(0,o.length-1)),S(e,o));break;case"edit":if(u&&u.element&&u.element.isConnected){O(e,u.element),w();return}break;case"recheck":o=C(e.getBody(),e),i=0,S(e,o);break;case"quickfix":u&&u.id&&k[u.id]&&(k[u.id](u,e),o=C(e.getBody(),e),i=0,S(e,o),f(),s());break}f(),s()});let y=a=>{if(!a.target.closest('[data-role="drag"]')||a.target.closest('[data-act="close"]'))return;a.preventDefault();let m=g.getBoundingClientRect(),u=a.clientX-m.left,v=a.clientY-m.top;g.style.right="auto",g.style.bottom="auto",g.style.left=m.left+"px",g.style.top=m.top+"px";let L=$=>{let G=window.innerWidth-g.offsetWidth-4,K=window.innerHeight-g.offsetHeight-4,X=Math.max(4,Math.min(G,$.clientX-u)),Y=Math.max(4,Math.min(K,$.clientY-v));g.style.left=X+"px",g.style.top=Y+"px"},x=()=>{document.removeEventListener("mousemove",L),document.removeEventListener("mouseup",x)};document.addEventListener("mousemove",L),document.addEventListener("mouseup",x)};g.addEventListener("mousedown",y),window.addEventListener("resize",p),e.once("remove",w),f(),document.body.appendChild(g),T.set(t,g),S(e,o),_("A11ycheckStart",{total:o.length}),setTimeout(s,80)}function W(e){let r=e.getBody();if(!r)return;let t=C(r,e);fe(e,t)}var me=()=>{tinymce.PluginManager.add("for_a11y",e=>(e.addCommand("forA11yCheck",()=>W(e)),e.on("SetContent Undo Redo",()=>{H(e)}),e.on("remove",()=>{H(e)}),e.ui.registry.addIcon("for-a11y-icon",'<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>'),e.ui.registry.addButton("for_a11y",{icon:"for-a11y-icon",tooltip:"Barrierefreiheit pr\xFCfen",onAction:()=>e.execCommand("forA11yCheck")}),e.ui.registry.addMenuItem("for_a11y",{icon:"for-a11y-icon",text:"Barrierefreiheit pr\xFCfen\u2026",onAction:()=>e.execCommand("forA11yCheck")}),{toggleaudit:()=>{W(e)},getReport:()=>{let r=e.getBody();return r?C(r,e):[]}}))},U=me;U();})();
