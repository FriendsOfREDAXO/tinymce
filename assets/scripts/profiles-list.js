/* profiles-list.js
 * Handles the preview modal and PHP code modal on the TinyMCE profiles list page.
 * This file should be loaded via rex_view::addJsFile from the addon boot/assets provider.
 */
(function () {
  'use strict';

  function findLoadingText() {
    var el = document.getElementById('tinymcePreviewJson');
    return (el && el.textContent) ? el.textContent : 'loading...';
  }

  function escapeScriptClose(s) {
    // prevent `</script>` from breaking injected HTML
    if (typeof s !== 'string') return s;
    // avoid regex literal to prevent parsing issues in edge cases — use split/join instead
    return s.split('</script>').join('<\\/script>').split('</SCRIPT>').join('<\\/SCRIPT>');
  }

  function escapeHtml(s) {
    return (s || '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  // ── PHP-Code modal ────────────────────────────────────────────────────────

  document.addEventListener('click', function (ev) {
    var target = ev.target;
    if (!target) return;
    while (target && !(target.classList && target.classList.contains && target.classList.contains('tinymce-phpcode'))) {
      target = target.parentNode;
    }
    if (!target || !target.classList || !target.classList.contains('tinymce-phpcode')) return;

    ev.preventDefault();

    var url = target.dataset.url || null;
    if (!url) return;

    var bodyEl = document.getElementById('tinymcePHPCodeBody');
    if (bodyEl) bodyEl.textContent = findLoadingText();

    var modal = document.getElementById('tinymcePHPCodeModal');
    if (modal && window.jQuery && window.jQuery(modal).modal) {
      window.jQuery(modal).modal('show');
    }

    fetch(url, { credentials: 'include' })
      .then(function (resp) {
        if (!resp.ok) throw new Error('Profile not found');
        return resp.json();
      })
      .then(function (data) {
        if (!bodyEl) return;
        while (bodyEl.firstChild) bodyEl.removeChild(bodyEl.firstChild);

        var nameEl = document.createElement('h4');
        nameEl.style.marginTop = '0';
        nameEl.textContent = data.name || '';
        bodyEl.appendChild(nameEl);

        var pre = document.createElement('pre');
        pre.id = 'tinymcePHPCodePre';
        pre.className = 'tinymce-phpcode-pre';
        pre.textContent = data.code || '';
        bodyEl.appendChild(pre);
      })
      .catch(function (err) {
        if (bodyEl) bodyEl.textContent = err.message || 'Error';
      });
  }, false);

  // Copy button inside PHP-Code modal
  document.addEventListener('click', function (ev) {
    var btn = ev.target;
    if (!btn || btn.id !== 'tinymcePHPCodeCopy') return;
    var pre = document.getElementById('tinymcePHPCodePre');
    if (!pre) return;
    var code = pre.textContent || pre.innerText || '';
    if (!navigator.clipboard) {
      // Fallback for older browsers
      try {
        var ta = document.createElement('textarea');
        ta.value = code;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = btn.dataset.copiedLabel || 'Copied!';
        setTimeout(function () { btn.textContent = btn.dataset.copyLabel || 'Copy code'; }, 2000);
      } catch (e) {}
      return;
    }
    navigator.clipboard.writeText(code).then(function () {
      btn.textContent = btn.dataset.copiedLabel || 'Copied!';
      setTimeout(function () { btn.textContent = btn.dataset.copyLabel || 'Copy code'; }, 2000);
    });
  }, false);

  // ── Preview modal ─────────────────────────────────────────────────────────

  document.addEventListener('click', function (ev) {
    var target = ev.target;
    if (!target) return;
    // walk up to find .tinymce-preview anchor
    // climb DOM until we find the anchor having class 'tinymce-preview'
    while (target && !(target.classList && target.classList.contains && target.classList.contains('tinymce-preview'))) {
      target = target.parentNode;
    }
    if (!target || !target.classList || !target.classList.contains('tinymce-preview')) return;

    ev.preventDefault();

    var url = target.dataset.url || null;
    var id = target.dataset.id || null;
    if (!url && id) url = 'index.php?page=tinymce/profiles&func=preview&id=' + encodeURIComponent(id);
    if (!url) return;

    var nameEl = document.getElementById('tinymcePreviewName');
    var jsonEl = document.getElementById('tinymcePreviewJson');

    var loadingText = findLoadingText();

    if (nameEl) nameEl.textContent = '';
    if (jsonEl) jsonEl.textContent = loadingText;

    // show modal (bootstrap)
    var modal = document.getElementById('tinymcePreviewModal');
    if (modal && window.jQuery && window.jQuery(modal).modal) {
      window.jQuery(modal).modal('show');
    }
    // fetch JSON profile and initialize editor inside modal
    fetch(url, { credentials: 'include' })
      .then(function (resp) {
        if (!resp.ok) throw new Error('Profile not found');
        return resp.json();
      })
      .then(function (data) {
        var profileName = data.name || 'full';
        var raw = data.extra || '';

        var modalBody = document.querySelector('#tinymcePreviewModal .modal-body');
        if (modalBody) {
          // create editor element using existing init system via data-profile
          modalBody.innerHTML = '<h4 style="margin-top:0">' + escapeHtml(profileName) + '</h4>'
            + '<textarea id="tinymcePreviewEditor" class="tiny-editor" data-profile="' + escapeHtml(profileName) + '">The quick brown fox jumps over the lazy dog.</textarea>';
        }

        // remove previous instance
        try { if (window.tinymce && window.tinymce.get('tinymcePreviewEditor')) { window.tinymce.remove(window.tinymce.get('tinymcePreviewEditor')); } } catch (e) {}

        // try json parse, fallback to JS-eval (admin tool - best-effort)
        var conf = {};
        try { conf = raw ? JSON.parse(raw) : {}; } catch (e) {
          try { conf = raw ? (new Function('return ' + raw))() : {}; } catch (e2) { conf = {}; }
        }

        // If we already have a generated profile under this name, prefer that initialization path
        var profileKey = profileName;
        if (window.tinyprofiles && Object.prototype.hasOwnProperty.call(window.tinyprofiles, profileKey)) {
          // profile exists in generated list -> initialize via tiny_init on the modal container
          try {
            if (window.jQuery && typeof tiny_init === 'function') {
              tiny_init(window.jQuery(modal));
            } else if (typeof tiny_init === 'function') {
              // tiny_init expects a jQuery container, best-effort: call on document
              tiny_init(window.document);
            } else if (window.tinymce && typeof window.tinymce.init === 'function') {
              // fallback: ensure selector targets our textarea
              var c = Object.assign({}, window.tinyprofiles[profileKey]);
              c.selector = '#tinymcePreviewEditor';
              c.height = c.height || 300;
              window.tinymce.init(c);
            }
          } catch (e) {
            // ignore and fallback to direct init below
          }
        } else {
          // no generated profile available — register parsed conf under profileName so tiny_init can use it
          if (!window.tinyprofiles || typeof window.tinyprofiles !== 'object') window.tinyprofiles = {};
          window.tinyprofiles[profileKey] = conf;
          try {
            if (window.jQuery && typeof tiny_init === 'function') {
              tiny_init(window.jQuery(modal));
            } else if (window.tinymce && typeof window.tinymce.init === 'function') {
              // final fallback: call tinymce.init with parsed conf
              conf.selector = '#tinymcePreviewEditor';
              conf.height = conf.height || 300;
              window.tinymce.init(conf);
            } else if (modalBody) {
              modalBody.innerHTML += '<div class="text-danger">TinyMCE not available — please run the build or check vendor/tinymce is present.</div>';
            }
          } catch (e) {
            if (modalBody) modalBody.innerHTML += '<div class="text-danger">Error initializing preview: ' + (e && e.message ? escapeHtml(e.message) : 'unknown') + '</div>';
          }
        }

        // ensure we remove editor when modal is closed
        if (modal) {
          if (window.jQuery && window.jQuery(modal)) {
            window.jQuery(modal).off('hidden.bs.modal.tinymcePreview').on('hidden.bs.modal.tinymcePreview', function () {
              try { if (window.tinymce && window.tinymce.get('tinymcePreviewEditor')) { window.tinymce.remove(window.tinymce.get('tinymcePreviewEditor')); } } catch (e) {}
            });
          } else {
            modal.addEventListener('hidden', function () {
              try { if (window.tinymce && window.tinymce.get('tinymcePreviewEditor')) { window.tinymce.remove(window.tinymce.get('tinymcePreviewEditor')); } } catch (e) {}
            });
          }
        }
      })
      .catch(function (err) {
        if (jsonEl) jsonEl.textContent = err.message || 'Profile not found';
        if (nameEl) nameEl.textContent = '';
      });
  }, false);

})();
