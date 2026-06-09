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
