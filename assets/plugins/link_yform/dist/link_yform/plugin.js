!function(){"use strict";var t,r=function(e,n,t){return!!t(e,n.prototype)||(null==(t=e.constructor)?void 0:t.name)===n.name},l=(t="object",function(e){return n=typeof(e=e),(null===e?"null":"object"==n&&Array.isArray(e)?"array":"object"==n&&r(e,String,function(e,n){return Object.prototype.isPrototypeOf.call(n,e)})?"string":n)===t;var n}),u=function(e){return null==e};tinymce.PluginManager.add("link_yform",function(a){a.options.register("link_yform_tables",{processor:"array",default:[]});for(var r=a.options.get("link_yform_tables"),o=[],e=0,n=r.length;e<n;++e)!function(e){var n=r[e],t=[];if(l(n)||t.push("Entry is not an object."),u(n.table)&&t.push('Key "table" with table name as value is missing.'),u(n.field)&&t.push('Key "field" with field name as value is missing.'),0<t.length)return console.warn("TinyMCE Plugin link-yform reports for entry "+(e+1)+": \n- "+t.join("\n- "));e=u(n.menu)?n.table:n.menu;o.push({type:"menuitem",text:e,onAction:function(){return i(n)}})}(e);var i=function(r){try{var o=a.dom,i=newPoolWindow("index.php?page=yform/manager/data_edit&table_name="+r.table+"&rex_yform_manager_opener[id]=1&rex_yform_manager_opener[field]="+r.field+"&rex_yform_manager_opener[multiple]=0");$(i).on("rex:YForm_selectData",function(e,n,t){e.preventDefault(),i.close(),console.log(typeof i),t=a.selection.getContent()?a.selection.getContent():t.replace(new RegExp("(.*?)\\s\\[.*?\\]","gi"),"$1");e={href:r.table.split("_").join("-")+"://"+n,title:t};a.insertContent(o.createHTML("a",e,o.encode(t)))})}catch(e){console.log(e)}};a.ui.registry.addMenuButton("link_yform",{text:"YForm",fetch:function(e){e(o)}})})}();