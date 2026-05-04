"use strict";(()=>{var r="for-htmlembed",m="HTML-/JS-Einbettung",u=`
.${r} {
    position: relative;
    display: block;
    margin: 1em 0;
    padding: 2.2em 1em 1em 1em;
    border: 2px dashed #b5bcc7;
    border-radius: 8px;
    background: repeating-linear-gradient(
        45deg,
        rgba(47, 128, 237, 0.03),
        rgba(47, 128, 237, 0.03) 10px,
        rgba(47, 128, 237, 0.06) 10px,
        rgba(47, 128, 237, 0.06) 20px
    );
    color: #555;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.85em;
    line-height: 1.4;
    cursor: pointer;
    overflow: hidden;
    min-height: 3em;
}
.${r}::before {
    content: "\u27E8/\u27E9  " attr(data-for-embed-label);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 0.3em 0.75em;
    background: #2f80ed;
    color: #fff;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    pointer-events: none;
}
.${r}:hover {
    border-color: #2f80ed;
}
.${r}.mce-content-body[data-mce-selected] {
    outline: 2px solid #2f80ed !important;
    outline-offset: 2px;
}
/* Inhalt selbst im Editor nicht interaktiv \u2013 nur als Preview */
.${r} * {
    pointer-events: none !important;
}
/* Script/style-Tags im Editor sichtbar machen (werden sonst unsichtbar) */
.${r} script,
.${r} style {
    display: block !important;
    white-space: pre-wrap;
    color: #666;
}
.${r} script::before {
    content: "<script>\\A";
    white-space: pre;
    color: #2f80ed;
}
.${r} style::before {
    content: "<style>\\A";
    white-space: pre;
    color: #2f80ed;
}
`;function c(e){let n=e.trim();if(!n)return m;let t=n.match(/^<\s*([a-zA-Z][a-zA-Z0-9-]*)\b/),o=t?t[1].toLowerCase():"html",a=n.length;return`${o} \xB7 ${a} Zeichen`}function s(e,n,t){e.windowManager.open({title:m,size:"large",body:{type:"panel",items:[{type:"textarea",name:"code",label:"HTML, JavaScript oder CSS",maximized:!0}]},initialData:{code:n},buttons:[{type:"cancel",text:"Abbrechen"},{type:"submit",text:"\xDCbernehmen",primary:!0}],onSubmit:o=>{let a=o.getData();t((a.code||"").toString()),o.close()}}),setTimeout(()=>{try{let o=document.querySelector(".tox-dialog-wrap:last-of-type"),a=o==null?void 0:o.querySelector("textarea");a&&(a.classList.add("rex-js-code-editor"),a.setAttribute("data-mode","htmlmixed"),a.style.fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",a.style.fontSize="13px",a.style.lineHeight="1.5",a.spellcheck=!1)}catch(o){}},30)}function i(e,n){let t=n||e.selection.getNode();return e.dom.getParent(t,`div.${r}`)}function f(e,n){let t=n.trim();if(!t)return;let o=c(t),a=`<div class="${r}" contenteditable="false" data-for-embed-label="${e.dom.encode(o)}">`+t+"</div><p>&nbsp;</p>";e.undoManager.transact(()=>{e.insertContent(a)}),e.nodeChanged()}function l(e,n,t){let o=t.trim();if(!o){e.undoManager.transact(()=>{var a;(a=n.parentNode)==null||a.removeChild(n)}),e.nodeChanged();return}e.undoManager.transact(()=>{n.innerHTML=o,n.setAttribute("data-for-embed-label",c(o)),n.setAttribute("contenteditable","false")}),e.nodeChanged()}function d(e){return e.innerHTML.trim()}var p=()=>{tinymce.PluginManager.add("for_htmlembed",e=>{try{e.options.set("xss_sanitization",!1),e.options.set("allow_script_urls",!0)}catch(n){}return e.on("PreInit",()=>{let n=e.schema,t=n.getElementRule("div");t&&(t.attributes.class={},t.attributes.contenteditable={},t.attributes["data-for-embed-label"]={},t.attributesOrder=t.attributesOrder||[],["class","contenteditable","data-for-embed-label"].forEach(o=>{t.attributesOrder.indexOf(o)===-1&&t.attributesOrder.push(o)}));try{n.addValidElements("script[type|src|async|defer|*]"),n.addValidElements("iframe[src|width|height|frameborder|allow|allowfullscreen|sandbox|loading|referrerpolicy|*]"),n.addValidElements("style[type|media]"),n.addValidElements("noscript"),n.addValidChildren("+div[script|iframe|style|noscript]")}catch(o){}}),e.on("init",()=>{try{e.dom.addStyle(u)}catch(n){}}),e.on("SetContent",()=>{e.getBody().querySelectorAll(`div.${r}`).forEach(t=>{t.getAttribute("contenteditable")!=="false"&&t.setAttribute("contenteditable","false"),t.hasAttribute("data-for-embed-label")||t.setAttribute("data-for-embed-label",c(t.innerHTML))})}),e.on("dblclick",n=>{let t=n.target,o=i(e,t);o&&(n.preventDefault(),n.stopPropagation(),s(e,d(o),a=>l(e,o,a)))}),e.addCommand("forHtmlEmbedInsert",()=>{let n=i(e);n?s(e,d(n),t=>l(e,n,t)):s(e,"",t=>f(e,t))}),e.addCommand("forHtmlEmbedEdit",()=>{let n=i(e);n&&s(e,d(n),t=>l(e,n,t))}),e.ui.registry.addIcon("for-htmlembed",'<svg width="24" height="24" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9.5 10l-2.5 2 2.5 2M14.5 10l2.5 2-2.5 2M13 9l-2 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'),e.ui.registry.addToggleButton("for_htmlembed",{icon:"for-htmlembed",tooltip:"HTML-/JS-Einbettung",onAction:()=>e.execCommand("forHtmlEmbedInsert"),onSetup:n=>{let t=()=>n.setActive(!!i(e));return e.on("NodeChange",t),()=>e.off("NodeChange",t)}}),e.ui.registry.addMenuItem("for_htmlembed",{icon:"for-htmlembed",text:"HTML-/JS-Einbettung einf\xFCgen",onAction:()=>e.execCommand("forHtmlEmbedInsert")}),e.ui.registry.addContextToolbar("for_htmlembed_context",{predicate:n=>{let t=n;return!!(t&&t.nodeType===1&&t.classList&&t.classList.contains(r))},items:"for_htmlembed_edit for_htmlembed_remove",position:"node",scope:"node"}),e.ui.registry.addButton("for_htmlembed_edit",{icon:"edit-block",tooltip:"Code bearbeiten",onAction:()=>e.execCommand("forHtmlEmbedEdit")}),e.ui.registry.addButton("for_htmlembed_remove",{icon:"remove",tooltip:"Einbettung entfernen",onAction:()=>{let n=i(e);n&&(e.undoManager.transact(()=>{var t;(t=n.parentNode)==null||t.removeChild(n)}),e.nodeChanged())}}),{getMetadata:()=>({name:"FriendsOfREDAXO HTML Embed",url:"https://github.com/FriendsOfREDAXO/tinymce"})}})},b=p;b();})();
