/* Render all LaTeX on the page with KaTeX's auto-render extension.
   Loaded with `defer` after katex.min.js and auto-render.min.js, so
   renderMathInElement is guaranteed to be available by DOMContentLoaded. */
document.addEventListener("DOMContentLoaded", function () {
  if (typeof renderMathInElement !== "function") return;
  renderMathInElement(document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false },
      { left: "$",  right: "$",  display: false }
    ],
    // keep going if a single expression is malformed rather than blanking it
    throwOnError: false,
    // course-wide macros so the notes read the way they were written
    macros: {
      "\\F": "\\mathbb{F}",
      "\\R": "\\mathbb{R}",
      "\\C": "\\mathbb{C}",
      "\\Z": "\\mathbb{Z}",
      "\\Q": "\\mathbb{Q}",
      "\\tr": "\\operatorname{tr}",
      "\\sign": "\\operatorname{sign}",
      "\\Lin": "\\mathcal{L}",
      "\\herm": "^{\\mathsf{H}}",
      "\\T": "^{\\mathsf{T}}",
      "\\rank": "\\operatorname{rank}",
      "\\nullity": "\\operatorname{nullity}",
      "\\diag": "\\operatorname{diag}",
      "\\Null": "\\mathcal{N}",
      "\\Range": "\\mathcal{R}"
    }
  });
  initToc();
  initCrossRefs();
  initCollapsibles();
});

function initToc() {
  var headings = Array.from(document.querySelectorAll('h2.sec'));
  if (headings.length === 0) return;

  // auto-assign IDs from slugified heading text
  headings.forEach(function(h) {
    if (!h.id) {
      h.id = 'sec-' + h.textContent.trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  });

  // build the sidebar nav
  var nav = document.createElement('nav');
  nav.id = 'toc-sidebar';
  nav.className = 'toc-sidebar';
  nav.setAttribute('aria-label', 'Page contents');

  var title = document.createElement('p');
  title.className = 'toc-title';
  title.textContent = 'Contents';
  nav.appendChild(title);

  var ol = document.createElement('ol');
  ol.className = 'toc-list';
  headings.forEach(function(h) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent.trim();
    li.appendChild(a);
    ol.appendChild(li);
  });
  nav.appendChild(ol);

  document.body.insertBefore(nav, document.body.firstChild);

  // scroll spy — highlight the last heading that has scrolled past the threshold
  var links = Array.from(ol.querySelectorAll('a'));
  var ticking = false;

  function updateActive() {
    var threshold = 120;
    var active = null;
    headings.forEach(function(h) {
      if (h.getBoundingClientRect().top <= threshold) active = h;
    });
    links.forEach(function(a) {
      a.parentElement.classList.toggle('toc-active',
        active !== null && a.hash === '#' + active.id);
    });
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) { requestAnimationFrame(updateActive); ticking = true; }
  }, { passive: true });

  updateActive();
}

function initCrossRefs() {
  // prefix lookup for both full words and abbreviations
  var TYPE_MAP = {
    'definition': 'def',  'def':  'def',
    'theorem':    'thm',  'thm':  'thm',
    'lemma':      'lem',
    'proposition':'prop', 'prop': 'prop',
    'corollary':  'cor',  'cor':  'cor',
    'example':    'example',
    'exercise':   'ex',   'ex':   'ex',
    'remark':     'rem',
  };

  // Complete map of every numbered item id -> its chapter file.
  // Allows cross-chapter links when the target is not on the current page.
  var XREF_CHAPTER = (function() {
    var map = {};
    function range(prefix, lo, hi, ch) {
      for (var i = lo; i <= hi; i++) map[prefix + i] = ch;
    }
    range('def-',      1,  9,  'ch2.html');
    range('def-',     10, 17,  'ch3.html');
    range('def-',     18, 26,  'ch4.html');
    range('def-',     27, 30,  'ch5.html');
    range('def-',     31, 33,  'ch6.html');
    range('def-',     34, 38,  'ch7.html');
    range('def-',     39, 44,  'ch8.html');
    range('def-',     45, 46,  'ch9.html');
    map['thm-1']  = 'ch2.html';
    range('thm-',   2,  3,  'ch3.html');
    range('thm-',   4,  7,  'ch4.html');
    range('thm-',   8,  9,  'ch5.html');
    map['thm-10'] = 'ch6.html';
    range('thm-',  11, 14,  'ch8.html');
    range('thm-',  15, 17,  'ch9.html');
    map['thm-18'] = 'ch10.html';
    range('prop-',  1,  5,  'ch2.html');
    map['prop-6'] = 'ch8.html';
    map['prop-7'] = 'ch9.html';
    map['lem-1']  = 'ch2.html';
    map['lem-2']  = 'ch8.html';
    map['lem-3']  = 'ch9.html';
    map['cor-1']  = 'ch2.html';
    range('cor-',   2,  3,  'ch3.html');
    map['cor-4']  = 'ch4.html';
    map['example-5']  = 'ch2.html';
    range('example-',  6,  7, 'ch3.html');
    range('example-',  8,  9, 'ch4.html');
    range('example-', 10, 12, 'ch7.html');
    map['example-14'] = 'ch9.html';
    map['rem-6']  = 'ch3.html';
    map['rem-10'] = 'ch4.html';
    range('ex-',   1, 25, 'ch2.html');
    range('ex-',  26, 38, 'ch3.html');
    range('ex-',  39, 54, 'ch4.html');
    range('ex-',  55, 66, 'ch5.html');
    range('ex-',  67, 72, 'ch6.html');
    range('ex-',  73, 80, 'ch7.html');
    range('ex-',  81, 89, 'ch8.html');
    map['ex-91'] = 'ch8.html';   // ex-90 does not exist in the notes
    range('ex-',  92, 95,  'ch9.html');
    range('ex-',  96, 101, 'ch10.html');
    return map;
  })();

  // Return the best href for an id: in-page anchor if present, else cross-chapter.
  function getHref(id) {
    if (document.getElementById(id)) return '#' + id;
    var ch = XREF_CHAPTER[id];
    return ch ? ch + '#' + id : null;
  }

  // 1. Assign IDs to numbered boxes from their .box-head text.
  //    Two patterns: anchored (normal) and unanchored fallback for
  //    heads like "Definition / Theorem 8" where the number follows
  //    a secondary keyword.
  var HEAD_ANCHORED = /^(Definition|Theorem|Lemma|Proposition|Corollary|Example|Exercise|Ex|Remark)\.?\s+(\d+(?:\.\d+)?)/i;
  var HEAD_ANYWHERE = /(Theorem|Lemma|Proposition|Corollary|Example|Exercise|Ex|Remark)\.?\s+(\d+(?:\.\d+)?)/i;

  document.querySelectorAll('.box').forEach(function(box) {
    if (box.id) return;
    var head = box.querySelector(':scope > .box-head');
    if (!head) return;
    var raw = '';
    for (var i = 0; i < head.childNodes.length; i++) {
      if (head.childNodes[i].nodeType === Node.TEXT_NODE) {
        raw = head.childNodes[i].nodeValue.trim();
        break;
      }
    }
    var m = HEAD_ANCHORED.exec(raw) || HEAD_ANYWHERE.exec(raw);
    if (!m) return;
    var prefix = TYPE_MAP[m[1].toLowerCase().replace(/\.$/, '')];
    if (prefix) box.id = prefix + '-' + m[2];
  });

  // 2. Auto-link prose references. In-page refs become #id anchors;
  //    cross-chapter refs become chapter.html#id links.
  var REF_PAT = /\b(Definition|Def\.?|Theorem|Thm\.?|Lemma|Proposition|Prop\.?|Corollary|Cor\.?|Example|Exercise|Ex\.?|Remark)[\s ]+(\d+(?:\.\d+)?)\b/g;

  function refId(type, num) {
    var prefix = TYPE_MAP[type.toLowerCase().replace(/\.$/, '')];
    return prefix ? prefix + '-' + num : null;
  }

  var walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        var el = node.parentElement;
        while (el && el !== document.body) {
          var tag = el.tagName.toLowerCase();
          if (tag === 'a' || tag === 'script' || tag === 'style') {
            return NodeFilter.FILTER_REJECT;
          }
          var cls = el.classList;
          if (cls.contains('katex') || cls.contains('box-head') ||
              cls.contains('toc-sidebar')) {
            return NodeFilter.FILTER_REJECT;
          }
          el = el.parentElement;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  var nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(function(node) {
    var text = node.nodeValue;
    var parts = [];
    var last = 0;
    REF_PAT.lastIndex = 0;
    var m;
    while ((m = REF_PAT.exec(text)) !== null) {
      var id = refId(m[1], m[2]);
      var href = id ? getHref(id) : null;
      if (!href) continue;
      if (m.index > last) parts.push(document.createTextNode(text.slice(last, m.index)));
      var a = document.createElement('a');
      a.href = href;
      a.className = 'xref';
      a.textContent = m[0];
      parts.push(a);
      last = m.index + m[0].length;
    }
    if (!parts.length) return;
    if (last < text.length) parts.push(document.createTextNode(text.slice(last)));
    var parent = node.parentNode;
    parts.forEach(function(p) { parent.insertBefore(p, node); });
    parent.removeChild(node);
  });
}

function initCollapsibles() {
  var configs = [
    { sel: '.box.pf',  defaultOpen: true  },
    { sel: '.box.sol', defaultOpen: false },
    { sel: '.box.add', defaultOpen: false },
  ];
  configs.forEach(function(cfg) {
    document.querySelectorAll(cfg.sel).forEach(function(box) {
      var head = box.querySelector(':scope > .box-head');
      if (!head) return;
      var details = document.createElement('details');
      if (cfg.defaultOpen) details.open = true;
      var summary = document.createElement('summary');
      summary.innerHTML = head.innerHTML;
      summary.className = 'box-head';
      var body = document.createElement('div');
      body.className = 'box-body';
      Array.from(box.children)
        .filter(function(el) { return el !== head; })
        .forEach(function(el) { body.appendChild(el); });
      details.appendChild(summary);
      details.appendChild(body);
      head.replaceWith(details);
    });
  });
}
