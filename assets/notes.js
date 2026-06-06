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
      "\\tr": "\\operatorname{tr}",
      "\\sign": "\\operatorname{sign}",
      "\\Lin": "\\mathcal{L}",
      "\\herm": "^{\\mathsf{H}}",
      "\\T": "^{\\mathsf{T}}"
    }
  });
});
