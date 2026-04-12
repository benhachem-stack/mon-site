/* ═══════════════════════════════════════════════════════════
   pdf.js — Export PDF du CV via html2pdf.js
   Déclenché par les boutons : #heroPdfBtn, #navPdfBtn, #ctaPdfBtn
═══════════════════════════════════════════════════════════ */

(function initPdfExport() {

  const PDF_OPTIONS = {
    margin:      [8, 8, 8, 8],
    filename:    'CV_Youness_AIT_BENHACHEM_2026.pdf',
    image:       { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false, letterRendering: true, scrollX: 0, scrollY: 0 },
    jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:   { mode: ['css', 'legacy'], before: '.page-break' },
  };

  /* ─ Rendre l'élément off-screen mais rendu par le navigateur ─
     position:absolute (pas fixed) + left hors viewport
     html2canvas peut ainsi calculer toutes les dimensions        */
  function showOffscreen(el) {
    el.style.display       = 'block';
    el.style.position      = 'absolute';
    el.style.top           = '0px';
    el.style.left          = '-9999px';
    el.style.width         = '210mm';
    el.style.minHeight     = '297mm';
    el.style.zIndex        = '9999';
    el.style.background    = '#ffffff';
    el.style.color         = '#0D1420';
    el.style.pointerEvents = 'none';
    el.style.opacity       = '1';
  }

  function hideElement(el) {
    el.style.display       = 'none';
    el.style.position      = '';
    el.style.top           = '';
    el.style.left          = '';
    el.style.width         = '';
    el.style.minHeight     = '';
    el.style.zIndex        = '';
    el.style.pointerEvents = '';
    el.style.opacity       = '';
  }

  /* ─ Fonction principale ──────────────────────────────── */
  async function generatePdf(btn) {
    if (typeof html2pdf === 'undefined') {
      alert('Le générateur PDF est encore en cours de chargement. Réessayez dans 2 secondes.');
      return;
    }

    const originalHTML = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled  = true;
      btn.innerHTML = '⏳ Génération en cours…';
    }

    const el = document.getElementById('cv-export');
    if (!el) {
      alert('Section CV introuvable dans la page.');
      if (btn) { btn.disabled = false; btn.innerHTML = originalHTML; }
      return;
    }

    try {
      /* 1. Placer hors écran mais rendu */
      showOffscreen(el);

      /* 2. Laisser le navigateur calculer le layout (2 frames + délai) */
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      await new Promise(r => setTimeout(r, 400));

      /* 3. Capturer et télécharger */
      await html2pdf().set(PDF_OPTIONS).from(el).save();

    } catch (err) {
      console.error('[PDF Export] Erreur :', err);
      alert('Erreur lors de la génération du PDF. Vérifiez la console.');
    } finally {
      /* 4. Remettre caché */
      hideElement(el);
      if (btn) {
        btn.disabled  = false;
        btn.innerHTML = originalHTML;
      }
    }
  }

  /* ─ Attacher les boutons ─────────────────────────────── */
  function attachButtons() {
    ['heroPdfBtn', 'navPdfBtn', 'ctaPdfBtn'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => generatePdf(btn));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachButtons);
  } else {
    attachButtons();
  }

})();
