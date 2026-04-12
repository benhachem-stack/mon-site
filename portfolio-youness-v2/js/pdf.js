/* ═══════════════════════════════════════════════════════════
   pdf.js — Téléchargement direct du CV PDF
   Déclenché par les boutons : #heroPdfBtn, #navPdfBtn, #ctaPdfBtn
═══════════════════════════════════════════════════════════ */

(function initPdfDownload() {

  const PDF_PATH     = 'assets/CV_Youness_AIT_BENHACHEM_2026.pdf';
  const PDF_FILENAME = 'CV_Youness_AIT_BENHACHEM_2026.pdf';

  function downloadPdf() {
    const a = document.createElement('a');
    a.href     = PDF_PATH;
    a.download = PDF_FILENAME;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function attachButtons() {
    ['heroPdfBtn', 'navPdfBtn', 'ctaPdfBtn'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', downloadPdf);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachButtons);
  } else {
    attachButtons();
  }

})();
