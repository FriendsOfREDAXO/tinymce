/* mblock-integration-test.js (source copy)
 * Developer helper to test integration with mblock.
 * Load on a backend page or paste into the console.
 */
(function () {
  'use strict';

  function log(msg) { console.info('[tinymce:integration-test] ' + msg); }

  var wrapper = document.createElement('div');
  wrapper.className = 'mblock_wrapper';
  wrapper.style.border = '1px dashed #ccc';
  wrapper.style.padding = '8px';
  wrapper.style.margin = '8px';

  var ta = document.createElement('textarea');
  ta.id = 'mblockIntegrationTestEditor';
  ta.className = 'tiny-editor';
  ta.setAttribute('data-profile', 'full');
  ta.textContent = 'MBlock integration test — initialize editor and check for tinymce instance.';

  wrapper.appendChild(ta);
  document.body.appendChild(wrapper);

  try {
    if (window.jQuery && typeof tiny_init === 'function') {
      tiny_init(window.jQuery(wrapper));
      log('called tiny_init on mblock wrapper — waiting for tinymce instance...');
    } else if (window.tinymce && typeof window.tinymce.init === 'function') {
      window.tinymce.init({ selector: '#mblockIntegrationTestEditor' });
      log('called tinymce.init fallback — waiting for tinymce instance...');
    } else {
      log('tinymce not found on page — ensure vendor build is loaded');
      return;
    }
  } catch (e) {
    log('error while starting init: ' + (e && e.message ? e.message : e));
    return;
  }

  var attempts = 0;
  var max = 40;
  var interval = setInterval(function () {
    attempts++;
    var inst = window.tinymce && window.tinymce.get('mblockIntegrationTestEditor');
    if (inst) {
      clearInterval(interval);
      log('tinymce initialized successfully for #mblockIntegrationTestEditor (editor id ' + inst.id + ')');
    } else if (attempts >= max) {
      clearInterval(interval);
      log('timed out waiting for tinymce instance (attempts=' + attempts + ')');
    }
  }, 250);
})();
