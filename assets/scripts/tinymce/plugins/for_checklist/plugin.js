"use strict";(()=>{var k="for-checklist",g="for-checklist__item",h="data-checked";function _(e){e.querySelectorAll("ul.todo-list").forEach(t=>{t.classList.remove("todo-list"),t.classList.add(k),t.querySelectorAll(":scope > li").forEach(o=>{let c=o.querySelector(":scope > label.todo-list__label"),l=!1,u="";if(c){let i=c.querySelector('input[type="checkbox"]');l=!!(i&&(i.hasAttribute("checked")||i.checked));let d=c.querySelector(".todo-list__label__description");u=d?d.innerHTML:c.textContent||""}else{let i=o.cloneNode(!0);i.querySelectorAll('input[type="checkbox"]').forEach(d=>d.remove()),u=i.innerHTML}o.className=g,o.setAttribute(h,l?"true":"false"),o.innerHTML=u})})}var f={todo:"",feature:"for-checklist--feature"};function T(e){return e.classList.contains(f.feature)?"feature":"todo"}function x(e,s="todo"){var p,b;let t=e.dom,n=e.selection,o=n.getNode(),c=t.getParent(o,`li.${g}`);if(c){let r=c.parentElement;if(r&&r.classList.contains(k)){if(T(r)===s){let C=e.getDoc(),L=C.createDocumentFragment();Array.from(r.children).forEach(M=>{let y=C.createElement("p");y.innerHTML=M.innerHTML,L.appendChild(y)}),(p=r.parentNode)==null||p.replaceChild(L,r)}else r.classList.remove(f.feature),f[s]&&r.classList.add(f[s]);e.nodeChanged();return}}let l=n.getSelectedBlocks();if(!l||l.length===0)return;let u=e.getDoc(),i=u.createElement("ul");i.className=k+(f[s]?" "+f[s]:"");let d=s==="feature"?"true":"false";l.forEach(r=>{let a=u.createElement("li");a.className=g,a.setAttribute(h,d),a.innerHTML=r.innerHTML||"&nbsp;",i.appendChild(a)});let m=l[0];(b=m.parentNode)==null||b.insertBefore(i,m),l.forEach(r=>{var a;return(a=r.parentNode)==null?void 0:a.removeChild(r)}),e.selection.select(i.firstElementChild,!0),e.selection.collapse(!1),e.nodeChanged()}function A(e,s){var c,l;let t=e.getBoundingClientRect(),n=(l=(c=e.ownerDocument)==null?void 0:c.defaultView)==null?void 0:l.getComputedStyle(e),o=n&&parseFloat(n.paddingLeft)||0;return s-t.left<=o+4}var v=`
ul.for-checklist {
    list-style: none;
    padding-left: 1.75em;
    margin: 0.5em 0;
}
ul.for-checklist li.for-checklist__item {
    position: relative;
    margin: 0.25em 0;
    padding-left: calc(1.15em + 0.35em);
    color: inherit;
}
ul.for-checklist li.for-checklist__item::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.15em;
    width: 1.15em;
    height: 1.15em;
    box-sizing: border-box;
    border: 1.5px solid #b5bcc7;
    border-radius: 6px;
    background-color: transparent;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 72% 72%;
    transition: background-color .15s ease, border-color .15s ease;
    cursor: pointer;
}
ul.for-checklist li.for-checklist__item:hover::before {
    border-color: #7a8595;
}
ul.for-checklist li.for-checklist__item[data-checked="true"]::before {
    background-color: #2f80ed;
    border-color: #2f80ed;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' d='M3.5 8.5l3 3 6-6.5'/></svg>");
}
ul.for-checklist li.for-checklist__item[data-checked="true"] {
    color: #8a8f99;
    text-decoration: line-through;
}
/* Feature-Liste: keine Durchstreichung, volle Farbe, gr\xFCner Check */
ul.for-checklist.for-checklist--feature li.for-checklist__item[data-checked="true"] {
    color: inherit;
    text-decoration: none;
}
ul.for-checklist.for-checklist--feature li.for-checklist__item[data-checked="true"]::before {
    background-color: #22c55e;
    border-color: #22c55e;
}
/* Unchecked-Default = gestrichelt (greift auch ohne data-checked) */
ul.for-checklist.for-checklist--feature li.for-checklist__item:not([data-checked="true"])::before {
    border-style: dashed;
}
`,H=()=>{tinymce.PluginManager.add("for_checklist",e=>{e.on("init",()=>{try{e.dom.addStyle(v)}catch(t){}}),e.on("PreInit",()=>{let t=e.schema,n=t.getElementRule("ul");n&&(n.attributes.class={},n.attributesOrder=n.attributesOrder||[],n.attributesOrder.indexOf("class")===-1&&n.attributesOrder.push("class"));let o=t.getElementRule("li");o&&(o.attributes.class={},o.attributes[h]={},o.attributesOrder=o.attributesOrder||[],["class",h].forEach(c=>{o.attributesOrder.indexOf(c)===-1&&o.attributesOrder.push(c)}))}),e.on("SetContent",()=>{try{_(e.getBody())}catch(t){}}),e.on("PastePostProcess",t=>{if(t&&t.node)try{_(t.node)}catch(n){}}),e.on("BeforeSetContent",t=>{t&&typeof t.content=="string"&&t.content.indexOf("todo-list")!==-1&&(t.content=t.content.replace(/class="todo-list"/g,`class="${k}"`))}),e.on("click",t=>{let n=t.target;if(!n)return;let o=n.closest(`li.${g}`);if(!o||!A(o,t.clientX))return;t.preventDefault(),t.stopPropagation();let c=o.getAttribute(h)==="true";e.undoManager.transact(()=>{o.setAttribute(h,c?"false":"true")}),e.nodeChanged()}),e.addCommand("forChecklistToggle",(t,n)=>{x(e,n==="feature"?"feature":"todo")}),e.ui.registry.addIcon("for-checklist",'<svg width="24" height="24" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="4" ry="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'),e.ui.registry.addIcon("for-checklist-feature",'<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 12.3l2.7 2.7L16.2 9.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');let s=t=>()=>{let n=e.selection.getNode(),o=e.dom.getParent(n,`ul.${k}`);return!!o&&T(o)===t};return e.ui.registry.addToggleButton("for_checklist",{icon:"for-checklist",tooltip:"Checkliste (To-Do)",onAction:()=>e.execCommand("forChecklistToggle",!1,"todo"),onSetup:t=>{let n=s("todo"),o=()=>t.setActive(n());return e.on("NodeChange",o),()=>e.off("NodeChange",o)}}),e.ui.registry.addMenuItem("for_checklist",{icon:"for-checklist",text:"Checkliste (To-Do)",onAction:()=>e.execCommand("forChecklistToggle",!1,"todo")}),e.ui.registry.addToggleButton("for_checklist_feature",{icon:"for-checklist-feature",tooltip:"Feature-Liste",onAction:()=>e.execCommand("forChecklistToggle",!1,"feature"),onSetup:t=>{let n=s("feature"),o=()=>t.setActive(n());return e.on("NodeChange",o),()=>e.off("NodeChange",o)}}),e.ui.registry.addMenuItem("for_checklist_feature",{icon:"for-checklist-feature",text:"Feature-Liste",onAction:()=>e.execCommand("forChecklistToggle",!1,"feature")}),{getMetadata:()=>({name:"FriendsOfREDAXO Checklist",url:"https://github.com/FriendsOfREDAXO/tinymce"})}})},E=H;E();})();
