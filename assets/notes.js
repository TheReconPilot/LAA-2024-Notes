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
  initCollapsibles();
});

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
