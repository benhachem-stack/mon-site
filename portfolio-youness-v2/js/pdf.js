/* ═══════════════════════════════════════════════════════════
   pdf.js — Export PDF du CV via html2pdf.js
   Déclenché par les boutons : #heroPdfBtn, #navPdfBtn, #ctaPdfBtn
═══════════════════════════════════════════════════════════ */

(function initPdfExport() {

  const PDF_OPTIONS = {
    margin:      [8, 8, 8, 8],
    filename:    'CV_Youness_AIT_BENHACHEM_2026.pdf',
    image:       { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale:           2,
      useCORS:         true,
      logging:         false,
      letterRendering: true,
      backgroundColor: '#ffffff',
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'], before: '.page-break' },
  };

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

    /* ── Overlay plein écran (cache le flash) ──────────────── */
    const overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;inset:0;background:rgba(13,20,32,0.92);z-index:99999;' +
      'display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem';
    overlay.innerHTML =
      '<div style="width:44px;height:44px;border:3px solid #B8941F;' +
      'border-top-color:transparent;border-radius:50%;animation:sp .8s linear infinite"></div>' +
      '<p style="color:#fff;font-family:Inter,sans-serif;font-size:.95rem;margin:0">Génération du PDF…</p>' +
      '<style>@keyframes sp{to{transform:rotate(360deg)}}</style>';
    document.body.appendChild(overlay);

    /* ── Rendre l'élément visible dans le vrai DOM ─────────────
       html2canvas mesure offsetWidth/offsetHeight sur l'élément
       réel — il doit être display:block avec un layout calculé  */
    el.style.display    = 'block';
    el.style.width      = '210mm';
    el.style.background = '#ffffff';
    el.style.color      = '#0D1420';

    try {
      /* Attendre 2 frames + 400 ms pour que le layout soit calculé */
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      await new Promise(r => setTimeout(r, 400));

      await html2pdf().set(PDF_OPTIONS).from(el).save();

    } catch (err) {
      console.error('[PDF Export] Erreur :', err);
      alert('Erreur lors de la génération du PDF. Vérifiez la console.');
    } finally {
      /* Remettre caché + supprimer overlay */
      el.style.display    = 'none';
      el.style.width      = '';
      el.style.background = '';
      el.style.color      = '';
      document.body.removeChild(overlay);
      if (btn) {
        btn.disabled  = false;
        btn.innerHTML = originalHTML;
      }
    }
  }

  /* ── Attacher les boutons ─────────────────────────────── */
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
