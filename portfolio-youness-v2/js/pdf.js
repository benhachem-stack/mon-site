/* ═══════════════════════════════════════════════════════════
   pdf.js — Export PDF du CV via html2pdf.js
   Déclenché par les boutons : #heroPdfBtn, #navPdfBtn, #ctaPdfBtn
═══════════════════════════════════════════════════════════ */

(function initPdfExport() {

  /* ─ Options html2pdf ─────────────────────────────────── */
  const PDF_OPTIONS = {
    margin:       [8, 0, 8, 0],          /* top, right, bottom, left (mm) */
    filename:     'CV_Youness_AIT_BENHACHEM_2026.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] },
  };

  /* ─ Injecter les styles PDF inline avant capture ─────── */
  function injectPdfStyles() {
    const style = document.createElement('style');
    style.id = 'pdf-extra-styles';
    style.textContent = `
      /* Force l'affichage de la section cachée */
      #cv-export { display: block !important; }

      /* Reset propre pour le rendu html2canvas */
      .cv-page * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

      /* Éviter les coupures dans les blocs */
      .cv-exp    { page-break-inside: avoid; }
      .cv-section{ page-break-inside: avoid; }
    `;
    document.head.appendChild(style);
  }

  function removePdfStyles() {
    const s = document.getElementById('pdf-extra-styles');
    if (s) s.remove();
  }

  /* ─ Fonction principale d'export ─────────────────────── */
  async function generatePdf(btn) {
    /* Sécurité : vérifier que html2pdf est chargé */
    if (typeof html2pdf === 'undefined') {
      alert('Le générateur PDF est encore en cours de chargement. Réessayez dans quelques secondes.');
      return;
    }

    /* UI feedback */
    const originalText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span style="opacity:.7">Génération en cours…</span>';
    }

    try {
      injectPdfStyles();

      /* Attendre un tick pour que les styles soient appliqués */
      await new Promise(r => setTimeout(r, 100));

      const element = document.getElementById('cv-export');
      await html2pdf().set(PDF_OPTIONS).from(element).save();

    } catch (err) {
      console.error('[PDF Export] Erreur :', err);
      alert('Une erreur est survenue lors de la génération du PDF. Réessayez.');
    } finally {
      removePdfStyles();
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    }
  }

  /* ─ Attacher les listeners sur tous les boutons PDF ──── */
  const btnIds = ['heroPdfBtn', 'navPdfBtn', 'ctaPdfBtn'];

  function attachButtons() {
    btnIds.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => generatePdf(btn));
    });
  }

  /* Attacher quand le DOM est prêt */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachButtons);
  } else {
    attachButtons();
  }

})();
