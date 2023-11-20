/* PrismJS 1.20.0
https://prismjs.com/download.html#themes=prism&languages=markup+css+clike+javascript+java&plugins=line-highlight */
var _self =
    "undefined" != typeof window
      ? window
      : "undefined" != typeof WorkerGlobalScope &&
        self instanceof WorkerGlobalScope
      ? self
      : {},
  Prism = (function (u) {
    var c = /\blang(?:uage)?-([\w-]+)\b/i,
      n = 0,
      C = {
        manual: u.Prism && u.Prism.manual,
        disableWorkerMessageHandler:
          u.Prism && u.Prism.disableWorkerMessageHandler,
        util: {
          encode: function e(n) {
            return n instanceof _
              ? new _(n.type, e(n.content), n.alias)
              : Array.isArray(n)
              ? n.map(e)
              : n
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/\u00a0/g, " ");
          },
          type: function (e) {
            return Object.prototype.toString.call(e).slice(8, -1);
          },
          objId: function (e) {
            return (
              e.__id || Object.defineProperty(e, "__id", { value: ++n }), e.__id
            );
          },
          clone: function t(e, r) {
            var a,
              n,
              l = C.util.type(e);
            switch (((r = r || {}), l)) {
              case "Object":
                if (((n = C.util.objId(e)), r[n])) return r[n];
                for (var i in ((a = {}), (r[n] = a), e))
                  e.hasOwnProperty(i) && (a[i] = t(e[i], r));
                return a;
              case "Array":
                return (
                  (n = C.util.objId(e)),
                  r[n]
                    ? r[n]
                    : ((a = []),
                      (r[n] = a),
                      e.forEach(function (e, n) {
                        a[n] = t(e, r);
                      }),
                      a)
                );
              default:
                return e;
            }
          },
          getLanguage: function (e) {
            for (; e && !c.test(e.className); ) e = e.parentElement;
            return e
              ? (e.className.match(c) || [, "none"])[1].toLowerCase()
              : "none";
          },
          currentScript: function () {
            if ("undefined" == typeof document) return null;
            if ("currentScript" in document) return document.currentScript;
            try {
              throw new Error();
            } catch (e) {
              var n = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(e.stack) || [])[1];
              if (n) {
                var t = document.getElementsByTagName("script");
                for (var r in t) if (t[r].src == n) return t[r];
              }
              return null;
            }
          },
        },
        languages: {
          extend: function (e, n) {
            var t = C.util.clone(C.languages[e]);
            for (var r in n) t[r] = n[r];
            return t;
          },
          insertBefore: function (t, e, n, r) {
            var a = (r = r || C.languages)[t],
              l = {};
            for (var i in a)
              if (a.hasOwnProperty(i)) {
                if (i == e)
                  for (var o in n) n.hasOwnProperty(o) && (l[o] = n[o]);
                n.hasOwnProperty(i) || (l[i] = a[i]);
              }
            var s = r[t];
            return (
              (r[t] = l),
              C.languages.DFS(C.languages, function (e, n) {
                n === s && e != t && (this[e] = l);
              }),
              l
            );
          },
          DFS: function e(n, t, r, a) {
            a = a || {};
            var l = C.util.objId;
            for (var i in n)
              if (n.hasOwnProperty(i)) {
                t.call(n, i, n[i], r || i);
                var o = n[i],
                  s = C.util.type(o);
                "Object" !== s || a[l(o)]
                  ? "Array" !== s || a[l(o)] || ((a[l(o)] = !0), e(o, t, i, a))
                  : ((a[l(o)] = !0), e(o, t, null, a));
              }
          },
        },
        plugins: {},
        highlightAll: function (e, n) {
          C.highlightAllUnder(document, e, n);
        },
        highlightAllUnder: function (e, n, t) {
          var r = {
            callback: t,
            container: e,
            selector:
              'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
          };
          C.hooks.run("before-highlightall", r),
            (r.elements = Array.prototype.slice.apply(
              r.container.querySelectorAll(r.selector)
            )),
            C.hooks.run("before-all-elements-highlight", r);
          for (var a, l = 0; (a = r.elements[l++]); )
            C.highlightElement(a, !0 === n, r.callback);
        },
        highlightElement: function (e, n, t) {
          var r = C.util.getLanguage(e),
            a = C.languages[r];
          e.className =
            e.className.replace(c, "").replace(/\s+/g, " ") + " language-" + r;
          var l = e.parentNode;
          l &&
            "pre" === l.nodeName.toLowerCase() &&
            (l.className =
              l.className.replace(c, "").replace(/\s+/g, " ") +
              " language-" +
              r);
          var i = { element: e, language: r, grammar: a, code: e.textContent };
          function o(e) {
            (i.highlightedCode = e),
              C.hooks.run("before-insert", i),
              (i.element.innerHTML = i.highlightedCode),
              C.hooks.run("after-highlight", i),
              C.hooks.run("complete", i),
              t && t.call(i.element);
          }
          if ((C.hooks.run("before-sanity-check", i), !i.code))
            return C.hooks.run("complete", i), void (t && t.call(i.element));
          if ((C.hooks.run("before-highlight", i), i.grammar))
            if (n && u.Worker) {
              var s = new Worker(C.filename);
              (s.onmessage = function (e) {
                o(e.data);
              }),
                s.postMessage(
                  JSON.stringify({
                    language: i.language,
                    code: i.code,
                    immediateClose: !0,
                  })
                );
            } else o(C.highlight(i.code, i.grammar, i.language));
          else o(C.util.encode(i.code));
        },
        highlight: function (e, n, t) {
          var r = { code: e, grammar: n, language: t };
          return (
            C.hooks.run("before-tokenize", r),
            (r.tokens = C.tokenize(r.code, r.grammar)),
            C.hooks.run("after-tokenize", r),
            _.stringify(C.util.encode(r.tokens), r.language)
          );
        },
        tokenize: function (e, n) {
          var t = n.rest;
          if (t) {
            for (var r in t) n[r] = t[r];
            delete n.rest;
          }
          var a = new l();
          return (
            M(a, a.head, e),
            (function e(n, t, r, a, l, i, o) {
              for (var s in r)
                if (r.hasOwnProperty(s) && r[s]) {
                  var u = r[s];
                  u = Array.isArray(u) ? u : [u];
                  for (var c = 0; c < u.length; ++c) {
                    if (o && o == s + "," + c) return;
                    var g = u[c],
                      f = g.inside,
                      h = !!g.lookbehind,
                      d = !!g.greedy,
                      v = 0,
                      p = g.alias;
                    if (d && !g.pattern.global) {
                      var m = g.pattern.toString().match(/[imsuy]*$/)[0];
                      g.pattern = RegExp(g.pattern.source, m + "g");
                    }
                    g = g.pattern || g;
                    for (
                      var y = a.next, k = l;
                      y !== t.tail;
                      k += y.value.length, y = y.next
                    ) {
                      var b = y.value;
                      if (t.length > n.length) return;
                      if (!(b instanceof _)) {
                        var x = 1;
                        if (d && y != t.tail.prev) {
                          g.lastIndex = k;
                          var w = g.exec(n);
                          if (!w) break;
                          var A = w.index + (h && w[1] ? w[1].length : 0),
                            P = w.index + w[0].length,
                            S = k;
                          for (S += y.value.length; S <= A; )
                            (y = y.next), (S += y.value.length);
                          if (
                            ((S -= y.value.length),
                            (k = S),
                            y.value instanceof _)
                          )
                            continue;
                          for (
                            var O = y;
                            O !== t.tail &&
                            (S < P ||
                              ("string" == typeof O.value &&
                                !O.prev.value.greedy));
                            O = O.next
                          )
                            x++, (S += O.value.length);
                          x--, (b = n.slice(k, S)), (w.index -= k);
                        } else {
                          g.lastIndex = 0;
                          var w = g.exec(b);
                        }
                        if (w) {
                          h && (v = w[1] ? w[1].length : 0);
                          var A = w.index + v,
                            w = w[0].slice(v),
                            P = A + w.length,
                            E = b.slice(0, A),
                            N = b.slice(P),
                            j = y.prev;
                          E && ((j = M(t, j, E)), (k += E.length)), W(t, j, x);
                          var L = new _(s, f ? C.tokenize(w, f) : w, p, w, d);
                          if (
                            ((y = M(t, j, L)),
                            N && M(t, y, N),
                            1 < x && e(n, t, r, y.prev, k, !0, s + "," + c),
                            i)
                          )
                            break;
                        } else if (i) break;
                      }
                    }
                  }
                }
            })(e, a, n, a.head, 0),
            (function (e) {
              var n = [],
                t = e.head.next;
              for (; t !== e.tail; ) n.push(t.value), (t = t.next);
              return n;
            })(a)
          );
        },
        hooks: {
          all: {},
          add: function (e, n) {
            var t = C.hooks.all;
            (t[e] = t[e] || []), t[e].push(n);
          },
          run: function (e, n) {
            var t = C.hooks.all[e];
            if (t && t.length) for (var r, a = 0; (r = t[a++]); ) r(n);
          },
        },
        Token: _,
      };
    function _(e, n, t, r, a) {
      (this.type = e),
        (this.content = n),
        (this.alias = t),
        (this.length = 0 | (r || "").length),
        (this.greedy = !!a);
    }
    function l() {
      var e = { value: null, prev: null, next: null },
        n = { value: null, prev: e, next: null };
      (e.next = n), (this.head = e), (this.tail = n), (this.length = 0);
    }
    function M(e, n, t) {
      var r = n.next,
        a = { value: t, prev: n, next: r };
      return (n.next = a), (r.prev = a), e.length++, a;
    }
    function W(e, n, t) {
      for (var r = n.next, a = 0; a < t && r !== e.tail; a++) r = r.next;
      ((n.next = r).prev = n), (e.length -= a);
    }
    if (
      ((u.Prism = C),
      (_.stringify = function n(e, t) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) {
          var r = "";
          return (
            e.forEach(function (e) {
              r += n(e, t);
            }),
            r
          );
        }
        var a = {
            type: e.type,
            content: n(e.content, t),
            tag: "span",
            classes: ["token", e.type],
            attributes: {},
            language: t,
          },
          l = e.alias;
        l &&
          (Array.isArray(l)
            ? Array.prototype.push.apply(a.classes, l)
            : a.classes.push(l)),
          C.hooks.run("wrap", a);
        var i = "";
        for (var o in a.attributes)
          i +=
            " " +
            o +
            '="' +
            (a.attributes[o] || "").replace(/"/g, "&quot;") +
            '"';
        return (
          "<" +
          a.tag +
          ' class="' +
          a.classes.join(" ") +
          '"' +
          i +
          ">" +
          a.content +
          "</" +
          a.tag +
          ">"
        );
      }),
      !u.document)
    )
      return (
        u.addEventListener &&
          (C.disableWorkerMessageHandler ||
            u.addEventListener(
              "message",
              function (e) {
                var n = JSON.parse(e.data),
                  t = n.language,
                  r = n.code,
                  a = n.immediateClose;
                u.postMessage(C.highlight(r, C.languages[t], t)),
                  a && u.close();
              },
              !1
            )),
        C
      );
    var e = C.util.currentScript();
    function t() {
      C.manual || C.highlightAll();
    }
    if (
      (e &&
        ((C.filename = e.src),
        e.hasAttribute("data-manual") && (C.manual = !0)),
      !C.manual)
    ) {
      var r = document.readyState;
      "loading" === r || ("interactive" === r && e && e.defer)
        ? document.addEventListener("DOMContentLoaded", t)
        : window.requestAnimationFrame
        ? window.requestAnimationFrame(t)
        : window.setTimeout(t, 16);
    }
    return C;
  })(_self);
"undefined" != typeof module && module.exports && (module.exports = Prism),
  "undefined" != typeof global && (global.Prism = Prism);
(Prism.languages.markup = {
  comment: /<!--[\s\S]*?-->/,
  prolog: /<\?[\s\S]+?\?>/,
  doctype: {
    pattern:
      /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    greedy: !0,
    inside: {
      "internal-subset": {
        pattern: /(\[)[\s\S]+(?=\]>$)/,
        lookbehind: !0,
        greedy: !0,
        inside: null,
      },
      string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
      punctuation: /^<!|>$|[[\]]/,
      "doctype-tag": /^DOCTYPE/,
      name: /[^\s<>'"]+/,
    },
  },
  cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
  tag: {
    pattern:
      /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: !0,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/,
        inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
      },
      "attr-value": {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          punctuation: [{ pattern: /^=/, alias: "attr-equals" }, /"|'/],
        },
      },
      punctuation: /\/?>/,
      "attr-name": {
        pattern: /[^\s>\/]+/,
        inside: { namespace: /^[^\s>\/:]+:/ },
      },
    },
  },
  entity: [
    { pattern: /&[\da-z]{1,8};/i, alias: "named-entity" },
    /&#x?[\da-f]{1,8};/i,
  ],
}),
  (Prism.languages.markup.tag.inside["attr-value"].inside.entity =
    Prism.languages.markup.entity),
  (Prism.languages.markup.doctype.inside["internal-subset"].inside =
    Prism.languages.markup),
  Prism.hooks.add("wrap", function (a) {
    "entity" === a.type &&
      (a.attributes.title = a.content.replace(/&amp;/, "&"));
  }),
  Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
    value: function (a, e) {
      var s = {};
      (s["language-" + e] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: !0,
        inside: Prism.languages[e],
      }),
        (s.cdata = /^<!\[CDATA\[|\]\]>$/i);
      var n = {
        "included-cdata": { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: s },
      };
      n["language-" + e] = { pattern: /[\s\S]+/, inside: Prism.languages[e] };
      var t = {};
      (t[a] = {
        pattern: RegExp(
          "(<__[^]*?>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)".replace(
            /__/g,
            function () {
              return a;
            }
          ),
          "i"
        ),
        lookbehind: !0,
        greedy: !0,
        inside: n,
      }),
        Prism.languages.insertBefore("markup", "cdata", t);
    },
  }),
  (Prism.languages.html = Prism.languages.markup),
  (Prism.languages.mathml = Prism.languages.markup),
  (Prism.languages.svg = Prism.languages.markup),
  (Prism.languages.xml = Prism.languages.extend("markup", {})),
  (Prism.languages.ssml = Prism.languages.xml),
  (Prism.languages.atom = Prism.languages.xml),
  (Prism.languages.rss = Prism.languages.xml);
!(function (s) {
  var e = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
  (s.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: {
      pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
      inside: {
        rule: /^@[\w-]+/,
        "selector-function-argument": {
          pattern:
            /(\bselector\s*\((?!\s*\))\s*)(?:[^()]|\((?:[^()]|\([^()]*\))*\))+?(?=\s*\))/,
          lookbehind: !0,
          alias: "selector",
        },
      },
    },
    url: {
      pattern: RegExp("url\\((?:" + e.source + "|[^\n\r()]*)\\)", "i"),
      greedy: !0,
      inside: { function: /^url/i, punctuation: /^\(|\)$/ },
    },
    selector: RegExp("[^{}\\s](?:[^{};\"']|" + e.source + ")*?(?=\\s*\\{)"),
    string: { pattern: e, greedy: !0 },
    property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
    important: /!important\b/i,
    function: /[-a-z0-9]+(?=\()/i,
    punctuation: /[(){};:,]/,
  }),
    (s.languages.css.atrule.inside.rest = s.languages.css);
  var t = s.languages.markup;
  t &&
    (t.tag.addInlined("style", "css"),
    s.languages.insertBefore(
      "inside",
      "attr-value",
      {
        "style-attr": {
          pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
          inside: {
            "attr-name": { pattern: /^\s*style/i, inside: t.tag.inside },
            punctuation: /^\s*=\s*['"]|['"]\s*$/,
            "attr-value": { pattern: /.+/i, inside: s.languages.css },
          },
          alias: "language-css",
        },
      },
      t.tag
    ));
})(Prism);
Prism.languages.clike = {
  comment: [
    { pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0 },
    { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
  ],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: !0,
  },
  "class-name": {
    pattern:
      /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
    lookbehind: !0,
    inside: { punctuation: /[.\\]/ },
  },
  keyword:
    /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  boolean: /\b(?:true|false)\b/,
  function: /\w+(?=\()/,
  number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  punctuation: /[{}[\];(),.:]/,
};
(Prism.languages.javascript = Prism.languages.extend("clike", {
  "class-name": [
    Prism.languages.clike["class-name"],
    {
      pattern:
        /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
      lookbehind: !0,
    },
  ],
  keyword: [
    { pattern: /((?:^|})\s*)(?:catch|finally)\b/, lookbehind: !0 },
    {
      pattern:
        /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|(?:get|set)(?=\s*[\[$\w\xA0-\uFFFF])|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: !0,
    },
  ],
  number:
    /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
  function:
    /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  operator:
    /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
})),
  (Prism.languages.javascript["class-name"][0].pattern =
    /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/),
  Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
      pattern:
        /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
      lookbehind: !0,
      greedy: !0,
    },
    "function-variable": {
      pattern:
        /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
      alias: "function",
    },
    parameter: [
      {
        pattern:
          /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
        inside: Prism.languages.javascript,
      },
      {
        pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern:
          /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
  }),
  Prism.languages.insertBefore("javascript", "string", {
    "template-string": {
      pattern:
        /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
      greedy: !0,
      inside: {
        "template-punctuation": { pattern: /^`|`$/, alias: "string" },
        interpolation: {
          pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
          lookbehind: !0,
          inside: {
            "interpolation-punctuation": {
              pattern: /^\${|}$/,
              alias: "punctuation",
            },
            rest: Prism.languages.javascript,
          },
        },
        string: /[\s\S]+/,
      },
    },
  }),
  Prism.languages.markup &&
    Prism.languages.markup.tag.addInlined("script", "javascript"),
  (Prism.languages.js = Prism.languages.javascript);
!(function (e) {
  var t =
      /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|null|open|opens|package|private|protected|provides|public|record|requires|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,
    a = /\b[A-Z](?:\w*[a-z]\w*)?\b/;
  (e.languages.java = e.languages.extend("clike", {
    "class-name": [a, /\b[A-Z]\w*(?=\s+\w+\s*[;,=())])/],
    keyword: t,
    function: [
      e.languages.clike.function,
      { pattern: /(\:\:)[a-z_]\w*/, lookbehind: !0 },
    ],
    number:
      /\b0b[01][01_]*L?\b|\b0x[\da-f_]*\.?[\da-f_p+-]+\b|(?:\b\d[\d_]*\.?[\d_]*|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
    operator: {
      pattern:
        /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
      lookbehind: !0,
    },
  })),
    e.languages.insertBefore("java", "string", {
      "triple-quoted-string": {
        pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
        greedy: !0,
        alias: "string",
      },
    }),
    e.languages.insertBefore("java", "class-name", {
      annotation: {
        alias: "punctuation",
        pattern: /(^|[^.])@\w+/,
        lookbehind: !0,
      },
      namespace: {
        pattern: RegExp(
          "(\\b(?:exports|import(?:\\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\\s+)(?!<keyword>)[a-z]\\w*(?:\\.[a-z]\\w*)*\\.?".replace(
            /<keyword>/g,
            function () {
              return t.source;
            }
          )
        ),
        lookbehind: !0,
        inside: { punctuation: /\./ },
      },
      generics: {
        pattern:
          /<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<[\w\s,.&?]*>)*>)*>)*>/,
        inside: {
          "class-name": a,
          keyword: t,
          punctuation: /[<>(),.:]/,
          operator: /[?&|]/,
        },
      },
    });
})(Prism);
!(function () {
  if (
    "undefined" != typeof self &&
    self.Prism &&
    self.document &&
    document.querySelector
  ) {
    var t,
      s = function () {
        if (void 0 === t) {
          var e = document.createElement("div");
          (e.style.fontSize = "13px"),
            (e.style.lineHeight = "1.5"),
            (e.style.padding = "0"),
            (e.style.border = "0"),
            (e.innerHTML = "&nbsp;<br />&nbsp;"),
            document.body.appendChild(e),
            (t = 38 === e.offsetHeight),
            document.body.removeChild(e);
        }
        return t;
      },
      l = !0,
      a = 0;
    Prism.hooks.add("before-sanity-check", function (e) {
      var t = e.element.parentNode,
        n = t && t.getAttribute("data-line");
      if (t && n && /pre/i.test(t.nodeName)) {
        var i = 0;
        g(".line-highlight", t).forEach(function (e) {
          (i += e.textContent.length), e.parentNode.removeChild(e);
        }),
          i &&
            /^( \n)+$/.test(e.code.slice(-i)) &&
            (e.code = e.code.slice(0, -i));
      }
    }),
      Prism.hooks.add("complete", function e(t) {
        var n = t.element.parentNode,
          i = n && n.getAttribute("data-line");
        if (n && i && /pre/i.test(n.nodeName)) {
          clearTimeout(a);
          var r = Prism.plugins.lineNumbers,
            o = t.plugins && t.plugins.lineNumbers;
          if (b(n, "line-numbers") && r && !o)
            Prism.hooks.add("line-numbers", e);
          else u(n, i)(), (a = setTimeout(c, 1));
        }
      }),
      window.addEventListener("hashchange", c),
      window.addEventListener("resize", function () {
        g("pre[data-line]")
          .map(function (e) {
            return u(e);
          })
          .forEach(v);
      });
  }
  function g(e, t) {
    return Array.prototype.slice.call((t || document).querySelectorAll(e));
  }
  function b(e, t) {
    return (
      (t = " " + t + " "),
      -1 < (" " + e.className + " ").replace(/[\n\t]/g, " ").indexOf(t)
    );
  }
  function v(e) {
    e();
  }
  function u(u, e, c) {
    var t = (e = "string" == typeof e ? e : u.getAttribute("data-line"))
        .replace(/\s+/g, "")
        .split(",")
        .filter(Boolean),
      d = +u.getAttribute("data-line-offset") || 0,
      f = (s() ? parseInt : parseFloat)(getComputedStyle(u).lineHeight),
      m = b(u, "line-numbers"),
      p = m ? u : u.querySelector("code") || u,
      h = [];
    t.forEach(function (e) {
      var t = e.split("-"),
        n = +t[0],
        i = +t[1] || n,
        r =
          u.querySelector('.line-highlight[data-range="' + e + '"]') ||
          document.createElement("div");
      if (
        (h.push(function () {
          r.setAttribute("aria-hidden", "true"),
            r.setAttribute("data-range", e),
            (r.className = (c || "") + " line-highlight");
        }),
        m && Prism.plugins.lineNumbers)
      ) {
        var o = Prism.plugins.lineNumbers.getLine(u, n),
          a = Prism.plugins.lineNumbers.getLine(u, i);
        if (o) {
          var s = o.offsetTop + "px";
          h.push(function () {
            r.style.top = s;
          });
        }
        if (a) {
          var l = a.offsetTop - o.offsetTop + a.offsetHeight + "px";
          h.push(function () {
            r.style.height = l;
          });
        }
      } else
        h.push(function () {
          r.setAttribute("data-start", n),
            n < i && r.setAttribute("data-end", i),
            (r.style.top = (n - d - 1) * f + "px"),
            (r.textContent = new Array(i - n + 2).join(" \n"));
        });
      h.push(function () {
        p.appendChild(r);
      });
    });
    var i = u.id;
    if (m && i) {
      for (var n = "linkable-line-numbers", r = !1, o = u; o; ) {
        if (b(o, n)) {
          r = !0;
          break;
        }
        o = o.parentElement;
      }
      if (r) {
        b(u, n) ||
          h.push(function () {
            u.className = (u.className + " " + n).trim();
          });
        var a = parseInt(u.getAttribute("data-start") || "1");
        g(".line-numbers-rows > span", u).forEach(function (e, t) {
          var n = t + a;
          e.onclick = function () {
            var e = i + "." + n;
            (l = !1),
              (location.hash = e),
              setTimeout(function () {
                l = !0;
              }, 1);
          };
        });
      }
    }
    return function () {
      h.forEach(v);
    };
  }
  function c() {
    var e = location.hash.slice(1);
    g(".temporary.line-highlight").forEach(function (e) {
      e.parentNode.removeChild(e);
    });
    var t = (e.match(/\.([\d,-]+)$/) || [, ""])[1];
    if (t && !document.getElementById(e)) {
      var n = e.slice(0, e.lastIndexOf(".")),
        i = document.getElementById(n);
      if (i)
        i.hasAttribute("data-line") || i.setAttribute("data-line", ""),
          u(i, t, "temporary ")(),
          l &&
            document
              .querySelector(".temporary.line-highlight")
              .scrollIntoView();
    }
  }
})();

(function () {
  if (typeof self === "undefined" || !self.Prism || !self.document) {
    return;
  }

  /**
   * Class name for <pre> which is activating the plugin
   * @type {String}
   */
  var PLUGIN_CLASS = "line-numbers";

  /**
   * Resizes line numbers spans according to height of line of code
   * @param  {Element} element <pre> element
   */
  var _resizeElement = function (element) {
    var codeStyles = getStyles(element);
    var whiteSpace = codeStyles["white-space"];

    if (whiteSpace === "pre-wrap" || whiteSpace === "pre-line") {
      var codeElement = element.querySelector("code");
      var lineNumbersWrapper = element.querySelector(".line-numbers-rows");
      var lineNumberSizer = element.querySelector(".line-numbers-sizer");
      var codeLines = element.textContent.split("\n");

      if (!lineNumberSizer) {
        lineNumberSizer = document.createElement("span");
        lineNumberSizer.className = "line-numbers-sizer";

        codeElement.appendChild(lineNumberSizer);
      }

      lineNumberSizer.style.display = "block";

      codeLines.forEach(function (line, lineNumber) {
        lineNumberSizer.textContent = line || "\n";
        var lineSize = lineNumberSizer.getBoundingClientRect().height;
        lineNumbersWrapper.children[lineNumber].style.height = lineSize + "px";
      });

      lineNumberSizer.textContent = "";
      lineNumberSizer.style.display = "none";
    }
  };

  /**
   * Returns style declarations for the element
   * @param {Element} element
   */
  var getStyles = function (element) {
    if (!element) {
      return null;
    }

    return window.getComputedStyle
      ? getComputedStyle(element)
      : element.currentStyle || null;
  };

  window.addEventListener("resize", function () {
    Array.prototype.forEach.call(
      document.querySelectorAll("pre." + PLUGIN_CLASS),
      _resizeElement
    );
  });

  Prism.hooks.add("complete", function (env) {
    if (!env.code) {
      return;
    }

    // works only for <code> wrapped inside <pre> (not inline)
    var pre = env.element.parentNode;
    // Original regex check for class, leaving it here
    // for its redundancy check
    var clsReg = /\s*\bline-numbers\b\s*/;
    // New regex check for opt-out class
    var clsRegB = /\s*\bno-line-numbers\b\s*/;

    if (env.element.querySelector(".line-numbers-rows")) {
      // Abort if line numbers already exists
      return;
    }

    // Added to facilitate opting out
    if (clsRegB.test(pre.className)) {
      // Respect the opt-out
      return;
    }

    if (clsReg.test(env.element.className)) {
      // Remove the class "line-numbers" from the <code>
      env.element.className = env.element.className.replace(clsReg, " ");
    }
    if (!clsReg.test(pre.className)) {
      // Add the class "line-numbers" to the <pre>
      pre.className += " line-numbers";
    }

    var match = env.code.match(/\n(?!$)/g);
    var linesNum = match ? match.length + 1 : 1;
    var lineNumbersWrapper;

    var lines = new Array(linesNum + 1);
    lines = lines.join("<span></span>");

    lineNumbersWrapper = document.createElement("span");
    lineNumbersWrapper.setAttribute("aria-hidden", "true");
    lineNumbersWrapper.className = "line-numbers-rows";
    lineNumbersWrapper.innerHTML = lines;

    if (pre.hasAttribute("data-start")) {
      pre.style.counterReset =
        "linenumber " + (parseInt(pre.getAttribute("data-start"), 10) - 1);
    }

    env.element.appendChild(lineNumbersWrapper);

    _resizeElement(pre);
  });
})();
