"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3952],{76852:function(e,r,n){n.d(r,{Z:function(){return a}});var t=n(67294);function a(e){const r=function(e){const r=(0,t.useRef)(e);return r.current=e,r}(e);(0,t.useEffect)((()=>()=>r.current()),[])}},57190:function(e,r,n){function t(e,r){(null==r||r>e.length)&&(r=e.length);for(var n=0,t=new Array(r);n<r;n++)t[n]=e[n];return t}function a(e,r){return function(e){if(Array.isArray(e))return e}(e)||function(e,r){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var t,a,o=[],s=!0,c=!1;try{for(n=n.call(e);!(s=(t=n.next()).done)&&(o.push(t.value),!r||o.length!==r);s=!0);}catch(u){c=!0,a=u}finally{try{s||null==n.return||n.return()}finally{if(c)throw a}}return o}}(e,r)||function(e,r){if(!e)return;if("string"===typeof e)return t(e,r);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return t(e,r)}(e,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}Object.defineProperty(r,"__esModule",{value:!0}),r.useIntersection=function(e){var r=e.rootRef,n=e.rootMargin,t=e.disabled||!c,i=o.useRef(),d=a(o.useState(!1),2),f=d[0],v=d[1],m=a(o.useState(r?r.current:null),2),p=m[0],h=m[1],b=o.useCallback((function(e){i.current&&(i.current(),i.current=void 0),t||f||e&&e.tagName&&(i.current=function(e,r,n){var t=function(e){var r,n={root:e.root||null,margin:e.rootMargin||""},t=l.find((function(e){return e.root===n.root&&e.margin===n.margin}));t?r=u.get(t):(r=u.get(n),l.push(n));if(r)return r;var a=new Map,o=new IntersectionObserver((function(e){e.forEach((function(e){var r=a.get(e.target),n=e.isIntersecting||e.intersectionRatio>0;r&&n&&r(n)}))}),e);return u.set(n,r={id:n,observer:o,elements:a}),r}(n),a=t.id,o=t.observer,s=t.elements;return s.set(e,r),o.observe(e),function(){if(s.delete(e),o.unobserve(e),0===s.size){o.disconnect(),u.delete(a);var r=l.findIndex((function(e){return e.root===a.root&&e.margin===a.margin}));r>-1&&l.splice(r,1)}}}(e,(function(e){return e&&v(e)}),{root:p,rootMargin:n}))}),[t,p,n,f]);return o.useEffect((function(){if(!c&&!f){var e=s.requestIdleCallback((function(){return v(!0)}));return function(){return s.cancelIdleCallback(e)}}}),[f]),o.useEffect((function(){r&&h(r.current)}),[r]),[b,f]};var o=n(67294),s=n(9311),c="undefined"!==typeof IntersectionObserver;var u=new Map,l=[]},78182:function(e,r,n){n.d(r,{Z:function(){return w}});var t=n(94184),a=n.n(t),o=n(67294),s=n(76792),c=n(66611),u=n(39602),l=n(85893);const i=o.forwardRef((({bsPrefix:e,className:r,variant:n,as:t="img",...o},c)=>{const u=(0,s.vE)(e,"card-img");return(0,l.jsx)(t,{ref:c,className:a()(n?`${u}-${n}`:u,r),...o})}));i.displayName="CardImg";var d=i,f=n(49059);const v=o.forwardRef((({bsPrefix:e,className:r,as:n="div",...t},c)=>{const u=(0,s.vE)(e,"card-header"),i=(0,o.useMemo)((()=>({cardHeaderBsPrefix:u})),[u]);return(0,l.jsx)(f.Z.Provider,{value:i,children:(0,l.jsx)(n,{ref:c,...t,className:a()(r,u)})})}));v.displayName="CardHeader";var m=v;const p=(0,u.Z)("h5"),h=(0,u.Z)("h6"),b=(0,c.Z)("card-body"),x=(0,c.Z)("card-title",{Component:p}),y=(0,c.Z)("card-subtitle",{Component:h}),g=(0,c.Z)("card-link",{Component:"a"}),N=(0,c.Z)("card-text",{Component:"p"}),C=(0,c.Z)("card-footer"),I=(0,c.Z)("card-img-overlay"),j=o.forwardRef((({bsPrefix:e,className:r,bg:n,text:t,border:o,body:c=!1,children:u,as:i="div",...d},f)=>{const v=(0,s.vE)(e,"card");return(0,l.jsx)(i,{ref:f,...d,className:a()(r,v,n&&`bg-${n}`,t&&`text-${t}`,o&&`border-${o}`),children:c?(0,l.jsx)(b,{children:u}):u})}));j.displayName="Card";var w=Object.assign(j,{Img:d,Title:x,Subtitle:y,Body:b,Link:g,Text:N,Header:m,Footer:C,ImgOverlay:I})},70130:function(e,r,n){n.d(r,{Z:function(){return Z}});var t=n(78146),a=n(67294);var o=function(e,r){const n=(0,a.useRef)(!0);(0,a.useEffect)((()=>{if(!n.current)return e();n.current=!1}),r)},s=n(92029),c=n(6454),u=n(76852);const l=2**31-1;function i(e,r,n){const t=n-Date.now();e.current=t<=l?setTimeout(r,t):setTimeout((()=>i(e,r,n)),l)}function d(){const e=(0,c.Z)(),r=(0,a.useRef)();return(0,u.Z)((()=>clearTimeout(r.current))),(0,a.useMemo)((()=>{const n=()=>clearTimeout(r.current);return{set:function(t,a=0){e()&&(n(),a<=l?r.current=setTimeout(t,a):i(r,t,Date.now()+a))},clear:n}}),[])}var f=n(13551),v=n(94184),m=n.n(v),p=n(15446),h=(0,n(66611).Z)("carousel-caption"),b=n(76792),x=n(85893);const y=a.forwardRef((({as:e="div",bsPrefix:r,className:n,...t},a)=>{const o=m()(n,(0,b.vE)(r,"carousel-item"));return(0,x.jsx)(e,{ref:a,...t,className:o})}));y.displayName="CarouselItem";var g=y,N=n(53439),C=n(93825),I=n(34509),j=n(32785);const w=a.forwardRef((({defaultActiveIndex:e=0,...r},n)=>{const{as:c="div",bsPrefix:u,slide:l=!0,fade:i=!1,controls:v=!0,indicators:h=!0,indicatorLabels:y=[],activeIndex:g,onSelect:w,onSlide:Z,onSlid:E,interval:k=5e3,keyboard:S=!0,onKeyDown:R,pause:$="hover",onMouseOver:M,onMouseOut:T,wrap:O=!0,touch:A=!0,onTouchStart:P,onTouchMove:D,onTouchEnd:L,prevIcon:_=(0,x.jsx)("span",{"aria-hidden":"true",className:"carousel-control-prev-icon"}),prevLabel:H="Previous",nextIcon:U=(0,x.jsx)("span",{"aria-hidden":"true",className:"carousel-control-next-icon"}),nextLabel:B="Next",variant:F,className:K,children:X,...q}=(0,p.Ch)({defaultActiveIndex:e,...r},{activeIndex:"onSelect"}),z=(0,b.vE)(u,"carousel"),G=(0,b.SC)(),J=(0,a.useRef)(null),[Q,V]=(0,a.useState)("next"),[W,Y]=(0,a.useState)(!1),[ee,re]=(0,a.useState)(!1),[ne,te]=(0,a.useState)(g||0);(0,a.useEffect)((()=>{ee||g===ne||(J.current?V(J.current):V((g||0)>ne?"next":"prev"),l&&re(!0),te(g||0))}),[g,ee,ne,l]),(0,a.useEffect)((()=>{J.current&&(J.current=null)}));let ae,oe=0;(0,N.Ed)(X,((e,r)=>{++oe,r===g&&(ae=e.props.interval)}));const se=(0,s.Z)(ae),ce=(0,a.useCallback)((e=>{if(ee)return;let r=ne-1;if(r<0){if(!O)return;r=oe-1}J.current="prev",null==w||w(r,e)}),[ee,ne,w,O,oe]),ue=(0,t.Z)((e=>{if(ee)return;let r=ne+1;if(r>=oe){if(!O)return;r=0}J.current="next",null==w||w(r,e)})),le=(0,a.useRef)();(0,a.useImperativeHandle)(n,(()=>({element:le.current,prev:ce,next:ue})));const ie=(0,t.Z)((()=>{!document.hidden&&function(e){if(!e||!e.style||!e.parentNode||!e.parentNode.style)return!1;const r=getComputedStyle(e);return"none"!==r.display&&"hidden"!==r.visibility&&"none"!==getComputedStyle(e.parentNode).display}(le.current)&&(G?ce():ue())})),de="next"===Q?"start":"end";o((()=>{l||(null==Z||Z(ne,de),null==E||E(ne,de))}),[ne]);const fe=`${z}-item-${Q}`,ve=`${z}-item-${de}`,me=(0,a.useCallback)((e=>{(0,I.Z)(e),null==Z||Z(ne,de)}),[Z,ne,de]),pe=(0,a.useCallback)((()=>{re(!1),null==E||E(ne,de)}),[E,ne,de]),he=(0,a.useCallback)((e=>{if(S&&!/input|textarea/i.test(e.target.tagName))switch(e.key){case"ArrowLeft":return e.preventDefault(),void(G?ue(e):ce(e));case"ArrowRight":return e.preventDefault(),void(G?ce(e):ue(e))}null==R||R(e)}),[S,R,ce,ue,G]),be=(0,a.useCallback)((e=>{"hover"===$&&Y(!0),null==M||M(e)}),[$,M]),xe=(0,a.useCallback)((e=>{Y(!1),null==T||T(e)}),[T]),ye=(0,a.useRef)(0),ge=(0,a.useRef)(0),Ne=d(),Ce=(0,a.useCallback)((e=>{ye.current=e.touches[0].clientX,ge.current=0,"hover"===$&&Y(!0),null==P||P(e)}),[$,P]),Ie=(0,a.useCallback)((e=>{e.touches&&e.touches.length>1?ge.current=0:ge.current=e.touches[0].clientX-ye.current,null==D||D(e)}),[D]),je=(0,a.useCallback)((e=>{if(A){const r=ge.current;Math.abs(r)>40&&(r>0?ce(e):ue(e))}"hover"===$&&Ne.set((()=>{Y(!1)}),k||void 0),null==L||L(e)}),[A,$,ce,ue,Ne,k,L]),we=null!=k&&!W&&!ee,Ze=(0,a.useRef)();(0,a.useEffect)((()=>{var e,r;if(!we)return;const n=G?ce:ue;return Ze.current=window.setInterval(document.visibilityState?ie:n,null!=(e=null!=(r=se.current)?r:k)?e:void 0),()=>{null!==Ze.current&&clearInterval(Ze.current)}}),[we,ce,ue,se,k,ie,G]);const Ee=(0,a.useMemo)((()=>h&&Array.from({length:oe},((e,r)=>e=>{null==w||w(r,e)}))),[h,oe,w]);return(0,x.jsxs)(c,{ref:le,...q,onKeyDown:he,onMouseOver:be,onMouseOut:xe,onTouchStart:Ce,onTouchMove:Ie,onTouchEnd:je,className:m()(K,z,l&&"slide",i&&`${z}-fade`,F&&`${z}-${F}`),children:[h&&(0,x.jsx)("div",{className:`${z}-indicators`,children:(0,N.UI)(X,((e,r)=>(0,x.jsx)("button",{type:"button","data-bs-target":"","aria-label":null!=y&&y.length?y[r]:`Slide ${r+1}`,className:r===ne?"active":void 0,onClick:Ee?Ee[r]:void 0,"aria-current":r===ne},r)))}),(0,x.jsx)("div",{className:`${z}-inner`,children:(0,N.UI)(X,((e,r)=>{const n=r===ne;return l?(0,x.jsx)(j.Z,{in:n,onEnter:n?me:void 0,onEntered:n?pe:void 0,addEndListener:C.Z,children:(r,t)=>a.cloneElement(e,{...t,className:m()(e.props.className,n&&"entered"!==r&&fe,("entered"===r||"exiting"===r)&&"active",("entering"===r||"exiting"===r)&&ve)})}):a.cloneElement(e,{className:m()(e.props.className,n&&"active")})}))}),v&&(0,x.jsxs)(x.Fragment,{children:[(O||0!==g)&&(0,x.jsxs)(f.Z,{className:`${z}-control-prev`,onClick:ce,children:[_,H&&(0,x.jsx)("span",{className:"visually-hidden",children:H})]}),(O||g!==oe-1)&&(0,x.jsxs)(f.Z,{className:`${z}-control-next`,onClick:ue,children:[U,B&&(0,x.jsx)("span",{className:"visually-hidden",children:B})]})]})]})}));w.displayName="Carousel";var Z=Object.assign(w,{Caption:h,Item:g})},39602:function(e,r,n){var t=n(67294),a=n(94184),o=n.n(a),s=n(85893);r.Z=e=>t.forwardRef(((r,n)=>(0,s.jsx)("div",{...r,ref:n,className:o()(r.className,e)})))}}]);