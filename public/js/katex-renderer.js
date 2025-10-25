// KaTeX Renderer - Renders LaTeX strings to HTML
function renderLatex(latexString, element, displayMode = true) {
    try {
        if (typeof katex !== 'undefined') {
            katex.render(latexString, element, {
                throwOnError: false,
                displayMode: displayMode,
                output: 'html'
            });
        } else {
            element.textContent = latexString;
        }
    } catch (error) {
        console.error('KaTeX rendering error:', error);
        element.textContent = latexString;
    }
}

function renderAllLatex() {
    document.querySelectorAll('.latex').forEach(el => {
        const latex = el.getAttribute('data-latex');
        if (latex) {
            renderLatex(latex, el, el.classList.contains('display'));
        }
    });
}

// Auto-render when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAllLatex);
} else {
    renderAllLatex();
}
