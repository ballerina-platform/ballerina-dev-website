"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2659],{91411:function(e,t,n){n.d(t,{Z:function(){return m}});var r=n(85893),o=n(67294),a=n(68999),i=n(33205),c=n(39323),l=n(88569),s=n(74855),u=n(89583);function d(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function h(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function f(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){h(e,t,n[t])}))}return e}function p(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}function g(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,a=[],i=!0,c=!1;try{for(n=n.call(e);!(i=(r=n.next()).done)&&(a.push(r.value),!t||a.length!==t);i=!0);}catch(l){c=!0,o=l}finally{try{i||null==n.return||n.return()}finally{if(c)throw o}}return a}}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return d(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return d(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e){var t=e.content,n=e.codes?new Map(JSON.parse(e.codes)):new Map,d=g(o.useState(!1),2),h=d[0],m=d[1],v=g(o.useState(!1),2),y=v[0],x=v[1],w=function(e){m(!0),x(e),setTimeout((function(){m(!1)}),3e3)},b=function(e){return"string"===typeof e?e:e.props.children},j=function(e){var t=e.map(b).join("").replace(/[&\/\\#,+()!$~%.'\u2019":*?<>{}]/g,"").toLowerCase();return t=t.replace(/ /g,"-")},C=function(e,t){"path"===e.tagName.toLowerCase()&&(e=e.parentElement);var n=document.querySelectorAll("#".concat(t)),r=Array.prototype.slice.call(n).indexOf(e.parentElement);location.hash=0===r?"#".concat(t):"#".concat(t,"-").concat(r),navigator.clipboard.writeText(window.location.href),e.parentElement.scrollIntoView()},L=function(t){e.handleToc(t)};return(0,r.jsx)(a.D,{components:{h2:function(e){e.node,e.inline,e.className;var t=e.children,n=(p(e,["node","inline","className","children"]),"");return L(!0),n=1===t.length?t[0].toString().toLowerCase().replace(/[&\/\\#,+()!$~%.'\u2019":*?<>{}]/g,"").replace(/ /g,"-"):j(t),(0,r.jsxs)("h2",{id:n,"data-section":n,className:"section",children:[(0,r.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"30",height:"30",fill:"currentColor",className:"bi bi-link-45deg mdButton pe-2",viewBox:"0 0 16 16",onClick:function(e){return C(e.target,n)},children:[(0,r.jsx)("path",{d:"M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"}),(0,r.jsx)("path",{d:"M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"})]}),t]})},h3:function(e){e.node,e.inline,e.className;var t=e.children,n=(p(e,["node","inline","className","children"]),"");return L(!0),n=1===t.length?t[0].toString().toLowerCase().replace(/[&\/\\#,+()!$~%.'\u2019":*?<>{}]/g,"").replace(/ /g,"-"):j(t),(0,r.jsxs)("h3",{id:n,"data-section":n,className:"section",children:[(0,r.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"30",height:"30",fill:"currentColor",className:"bi bi-link-45deg mdButton pe-2",viewBox:"0 0 16 16",onClick:function(e){return C(e.target,n)},children:[(0,r.jsx)("path",{d:"M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"}),(0,r.jsx)("path",{d:"M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"})]}),t]})},h4:function(e){e.node,e.inline,e.className;var t=e.children,n=(p(e,["node","inline","className","children"]),"");return L(!0),n=1===t.length?t[0].toString().toLowerCase().replace(/[&\/\\#,+()!$~%.'\u2019":*?<>{}]/g,"").replace(/ /g,"-"):j(t),(0,r.jsxs)("h4",{id:n,"data-section":n,className:"section",children:[(0,r.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"30",height:"30",fill:"currentColor",className:"bi bi-link-45deg mdButton pe-2",viewBox:"0 0 16 16",onClick:function(e){return C(e.target,n)},children:[(0,r.jsx)("path",{d:"M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"}),(0,r.jsx)("path",{d:"M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"})]}),t]})},h5:function(e){e.node,e.inline,e.className;var t=e.children,n=(p(e,["node","inline","className","children"]),"");return L(!0),n=1===t.length?t[0].toString().toLowerCase().replace(/[&\/\\#,+()!$~%.'\u2019":*?<>{}]/g,"").replace(/ /g,"-"):j(t),(0,r.jsxs)("h5",{id:n,"data-section":n,className:"section",children:[(0,r.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"30",height:"30",fill:"currentColor",className:"bi bi-link-45deg mdButton pe-2",viewBox:"0 0 16 16",onClick:function(e){return C(e.target,n)},children:[(0,r.jsx)("path",{d:"M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"}),(0,r.jsx)("path",{d:"M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"})]}),t]})},h6:function(e){e.node,e.inline,e.className;var t=e.children,n=(p(e,["node","inline","className","children"]),"");return L(!0),n=1===t.length?t[0].toString().toLowerCase().replace(/[&\/\\#,+()!$~%.'\u2019":*?<>{}]/g,"").replace(/ /g,"-"):j(t),(0,r.jsxs)("h6",{id:n,"data-section":n,className:"section",children:[(0,r.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"30",height:"30",fill:"currentColor",className:"bi bi-link-45deg mdButton pe-2",viewBox:"0 0 16 16",onClick:function(e){return C(e.target,n)},children:[(0,r.jsx)("path",{d:"M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"}),(0,r.jsx)("path",{d:"M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"})]}),t]})},code:function(e){e.node;var t=e.inline,a=e.className,i=e.children,c=p(e,["node","inline","className","children"]);if("string"===typeof i[0]){var l=i[0].trim().split(/\r?\n/).map((function(e){return e.trim()})).join("\n"),d=n.get(l.hashCode());if(d)return(0,r.jsxs)("div",{style:{background:"#eeeeee",padding:"10px 10px 0px 0px",borderRadius:"5px",marginTop:"10px",backgroundColor:"#eeeeee !important"},children:[(0,r.jsx)("div",{style:{display:"flex",justifyContent:"end"},children:(0,r.jsx)(s.CopyToClipboard,{text:i[0],onCopy:function(){return w(l)},style:{float:"right"},children:h&&y==l?(0,r.jsx)(u.l_A,{style:{color:"20b6b0"},title:"Copied"}):(0,r.jsx)(u.Dup,{title:"Copy"})})}),(0,r.jsx)("div",{dangerouslySetInnerHTML:{__html:d}})]})}var g,m=/language-(\w+)/.exec(a||"");return m||(g=function(e){var t="",n=e.split(/\r?\n/),r=!1;return o.Children.toArray(n).filter((function(e,n){e.toLowerCase().startsWith("$")?(r=!0,t+=e.replace("$ ","")+"\n"):e.startsWith("  ")&&r?(t=t.slice(0,-1),t+=" "+e.trim()+"\n"):r=!1})),t}(i[0])),t?(0,r.jsx)("code",f({className:a},c,{children:i})):m?(0,r.jsx)("div",{dangerouslySetInnerHTML:{__html:String(i).replace(/\n$/,"")}}):(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)("div",{style:{background:"#eeeeee",padding:"10px 10px 0px 0px",borderRadius:"5px",marginTop:"10px",backgroundColor:"#eeeeee !important"},children:[(0,r.jsx)("div",{style:{display:"flex",justifyContent:"end"},children:g&&(0,r.jsx)(s.CopyToClipboard,{text:g,onCopy:function(){return w(g)},style:{float:"right"},children:h&&y==g?(0,r.jsx)(u.l_A,{style:{color:"20b6b0"},title:"Copied"}):(0,r.jsx)(u.Dup,{title:"Copy"})})}),(0,r.jsx)("div",{children:(0,r.jsx)("pre",{className:"shiki github-light",style:{backgroundColor:"#ffffff",tabIndex:"0"},children:(0,r.jsx)("code",f({className:a},c,{children:i}))})})]})})},table:function(e){e.node,e.className;var t=e.children,n=p(e,["node","className","children"]);return(0,r.jsx)("div",{className:"mdTable",children:(0,r.jsx)("table",f({},n,{children:t}))})}},remarkPlugins:[i.Z,l.Z],rehypePlugins:[c.Z],children:t})}String.prototype.hashCode=function(){var e,t=0;if(0===this.length)return t;for(e=0;e<this.length;e++)t=(t<<5)-t+this.charCodeAt(e),t|=0;return t}},51717:function(e,t,n){n.d(t,{Z:function(){return f}});var r=n(34051),o=n.n(r),a=n(85893),i=n(67294),c=n(69380),l=n(14193),s=n(9684);function u(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function d(e,t,n,r,o,a,i){try{var c=e[a](i),l=c.value}catch(s){return void n(s)}c.done?t(l):Promise.resolve(l).then(r,o)}function h(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,a=[],i=!0,c=!1;try{for(n=n.call(e);!(i=(r=n.next()).done)&&(a.push(r.value),!t||a.length!==t);i=!0);}catch(l){c=!0,o=l}finally{try{i||null==n.return||n.return()}finally{if(c)throw o}}return a}}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return u(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return u(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(e){var t=e.source,n=[],r=!1;i.useEffect((function(){var e=function(){var e=window.location.hash.substring(1),n=u(e),r=n.id,o=n.sectionNumber,a=(f(r,o),document.querySelector('[data-section="'.concat(e,'"]')));t(a,e,!1,!0)};window.addEventListener("hashchange",(function(){r=!0,setTimeout((function(){return r=!1}),1e3),e()})),window.location.hash&&setTimeout((function(){e()}),300);var t=function(e,t,n){var r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];e&&"code"===e.tagName.toLowerCase()&&(e=e.parentElement);var o=u(t,n),a=o.id,i=o.sectionNumber;f(a,i);if(!r){var c=document.querySelectorAll(".title-anchor");c.forEach((function(e){e.classList.remove("active")})),e&&e.classList.add("active"),location.hash="#"+t}setTimeout((function(){var e=f(a,i);p(e)}),100)};window.addEventListener("scroll",(function(){r||function(){var e=document.getElementById("markdown-navigation"),t=document.querySelectorAll(".section"),n=null;if([].forEach.call(t,(function(e){var t=e.getBoundingClientRect();t.top>=0&&t.top<100&&(n=e)})),n){var r=n.dataset.section,o=Array.prototype.slice.call(document.querySelectorAll('.mdContent [data-section="'+r+'"]')).indexOf(n),a=e.querySelector('[data-section="'.concat(r).concat(o>0?"-".concat(o):"",'"]'));a.classList.contains("active")||(e.querySelector("div.active").classList.remove("active"),a.classList.add("active"))}}()}))}),[]);var u=function(e,t){var n,r;if(t)n=e;else{var o=e.match(/(?<id>(?:\w|-)+)-(?<count>\d+)$/);o?(n=o.groups.id,r=o.groups.count):(n=e,r=void 0)}return{id:n,sectionNumber:r}},f=function(e,t){var n=document.querySelectorAll("#".concat(e));return 0===n.length?null:void 0===t?n[0]:n[t]},p=function(e){e&&e.scrollIntoView({behavior:"smooth",block:"start"})},g=function(e,t){return e.filter((function(e){return e===t})).length},m=function(e,t){var r,a=h(i.useState({}),2),u=a[0],f=a[1],p=i.useCallback((r=o().mark((function r(){var a,i,u,d,h,p,m,v;return o().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,(0,c.l)().use(l.Z).use(s.Z).process(t);case 2:a=r.sent,i="",u="",d="",h=!0,(p=String(a).match(/h(\d)/)).length>1&&(m=p[1])>0&&m<7&&(i="title-level".concat(m),u=String(a).match(/<h\d>(.*?)<\/h\d>/g).map((function(e){return e.replace(/<\/?h\d>/g,"")}))),d=String(u).replace(/<code>/g,"").replace(/<\/code>/g,"").replace(/[&\/\\#,+()!$~%.'\u2019":*?<>{}]/g,"").replace(/x26;/g,"").toLowerCase().replace(/ /g,"-").replace(/x3c;/g,""),v=g(n,d),n.push(d),0!==v&&(h=!1,d=d+"-"+v),f({level:i,text:u,sectionId:d,active:1===e,unique:h});case 12:case"end":return r.stop()}}),r)})),function(){var e=this,t=arguments;return new Promise((function(n,o){var a=r.apply(e,t);function i(e){d(a,n,o,i,c,"next",e)}function c(e){d(a,n,o,i,c,"throw",e)}i(void 0)}))}),[e,t]);return i.useEffect((function(){p().catch(console.error)}),[p]),u};return(0,a.jsx)(a.Fragment,{children:(0,a.jsx)("div",{id:"markdown-navigation",className:"markdown-navigation",children:function(e){var t=e.split("\n"),n=0,r=!1,o=t.map((function(e){if(e.match(/^\s*```/)&&(r=!r),e.match(/^#/)&&!r)return n++,m(n,e)}));return o=o.filter((function(e){return void 0!==e}))}(t).map((function(e){return(0,a.jsx)("div",{"data-section":e.sectionId,className:"title-anchor ".concat(e.level).concat(e.active?" active":""),onClick:function(t){return function(e,t,n){var r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];e&&"code"===e.tagName.toLowerCase()&&(e=e.parentElement);var o=u(t,n),a=o.id,i=o.sectionNumber,c=f(a,i);if(!r){document.querySelectorAll(".title-anchor").forEach((function(e){e.classList.remove("active")})),e&&e.classList.add("active"),location.hash="#"+t}p(c)}(t.target,e.sectionId,e.unique)},dangerouslySetInnerHTML:{__html:e.text}},e.sectionId)}))})})}},25640:function(e,t,n){n.d(t,{O:function(){return r}});var r=""}}]);