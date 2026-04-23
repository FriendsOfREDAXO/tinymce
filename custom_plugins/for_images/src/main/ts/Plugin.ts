import { Editor, TinyMCE } from 'tinymce';

declare const tinymce: TinyMCE;

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

interface Preset {
  label: string;
  class: string;
}

interface PluginConfig {
  widthPresets: Preset[];
  alignPresets: Preset[];
  effectPresets: Preset[];
}

/* ================================================================== */
/*  Default Presets (used if none configured)                          */
/* ================================================================== */

const defaultWidthPresets: Preset[] = [
  { label: 'Original', class: '' },
  { label: 'Klein (150px)', class: 'img-width-small' },
  { label: 'Mittel (300px)', class: 'img-width-medium' },
  { label: 'Groß (600px)', class: 'img-width-large' },
  { label: '100%', class: 'img-width-full' },
];

const defaultAlignPresets: Preset[] = [
  { label: 'Keine', class: '' },
  { label: 'Links', class: 'img-align-left' },
  { label: 'Rechts', class: 'img-align-right' },
  { label: 'Zentriert', class: 'img-align-center' },
];

const defaultEffectPresets: Preset[] = [
  { label: 'Kein Effekt', class: '' },
];

/* ================================================================== */
/*  Figure Helpers                                                     */
/* ================================================================== */

function getFigureWrap(el: HTMLElement): HTMLElement | null {
  if (el.nodeName === 'FIGURE') return el;
  const parent = el.parentElement;
  if (parent && parent.nodeName === 'FIGURE') return parent;
  return null;
}

function ensureFigureWrap(editor: Editor, img: HTMLElement): HTMLElement {
  const existing = getFigureWrap(img);
  if (existing) {
    return existing;
  }

  const doc = editor.getDoc();
  const figure = doc.createElement('figure');
  
  const parent = img.parentElement;

  if (parent && parent.nodeName === 'P') {
    const hasOtherContent = Array.from(parent.childNodes).some(
      n => n !== img && (n.nodeType !== Node.TEXT_NODE || (n.textContent || '').trim() !== '')
    );
    if (!hasOtherContent) {
      parent.parentNode!.insertBefore(figure, parent);
      figure.appendChild(img);
      parent.remove();
    } else {
      parent.parentNode!.insertBefore(figure, parent);
      figure.appendChild(img);
    }
  } else if (parent) {
    parent.insertBefore(figure, img);
    figure.appendChild(img);
  }

  return figure;
}

function getSelectedImg(editor: Editor): HTMLElement | null {
  const node = editor.selection.getNode() as HTMLElement;
  if (node.nodeName === 'IMG') return node;
  if (node.nodeName === 'FIGURE') return node.querySelector('img') as HTMLElement | null;
  if (node.nodeName === 'FIGCAPTION') {
    const figure = node.parentElement;
    if (figure?.nodeName === 'FIGURE') return figure.querySelector('img') as HTMLElement | null;
  }
  return null;
}

/* ================================================================== */
/*  Class Management                                                   */
/* ================================================================== */

function getAllClasses(presets: Preset[]): string[] {
  const all: string[] = [];
  presets.forEach(p => {
    if (p.class) {
      p.class.split(/\s+/).forEach(c => {
        if (c && !all.includes(c)) all.push(c);
      });
    }
  });
  return all;
}

function stripPresetClasses(el: HTMLElement, presets: Preset[]): void {
  const classes = getAllClasses(presets);
  classes.forEach(cls => el.classList.remove(cls));
}

/**
 * Detect the correct full-width class for <img> based on configured presets.
 * - UIkit: uk-width-1-1
 * - Bootstrap: w-100
 * - Fallback: inline style width: 100%
 */
function detectImgFullWidthClass(presets: Preset[]): string {
  const allClasses = getAllClasses(presets).join(' ');
  if (allClasses.includes('uk-width')) return 'uk-width-1-1';
  if (/\bw-\d/.test(allClasses)) return 'w-100';
  return '';
}

function applyImgFullWidth(img: HTMLElement, fullWidthClass: string): void {
  // Remove old framework classes
  img.classList.remove('uk-width-1-1', 'w-100');
  img.style.removeProperty('width');
  
  if (fullWidthClass) {
    img.classList.add(fullWidthClass);
  } else {
    img.style.width = '100%';
  }
}

function applyPresetClass(editor: Editor, img: HTMLElement, preset: Preset, allPresets: Preset[]): void {
  const figure = preset.class ? ensureFigureWrap(editor, img) : getFigureWrap(img);
  const fullWidthClass = detectImgFullWidthClass(allPresets);
  
  if (figure) {
    stripPresetClasses(figure, allPresets);
    if (preset.class) {
      preset.class.split(/\s+/).forEach(c => {
        if (c) figure.classList.add(c);
      });
      // Apply full width to img so it fills the figure
      applyImgFullWidth(img, fullWidthClass);
    } else {
      // "Original" selected - remove full width classes from img
      if (fullWidthClass) {
        fullWidthClass.split(/\s+/).forEach(c => {
          if (c) img.classList.remove(c);
        });
        if (img.classList.length === 0) img.removeAttribute('class');
      }
    }
    if (figure.classList.length === 0) figure.removeAttribute('class');
  }

  // Only remove inline styles, keep width/height attributes for aspect ratio
  img.style.removeProperty('width');
  img.style.removeProperty('height');
  if (img.getAttribute('style') === '') img.removeAttribute('style');

  editor.nodeChanged();
  editor.undoManager.add();
}

function toggleEffectClass(editor: Editor, img: HTMLElement, preset: Preset, allPresets: Preset[]): void {
  if (!preset.class) {
    const figure = getFigureWrap(img);
    if (figure) {
      stripPresetClasses(figure, allPresets);
      if (figure.classList.length === 0) figure.removeAttribute('class');
    }
  } else {
    const figure = ensureFigureWrap(editor, img);
    const classes = preset.class.split(/\s+/).filter(c => c);
    const hasAll = classes.every(c => figure.classList.contains(c));
    
    if (hasAll) {
      classes.forEach(c => figure.classList.remove(c));
    } else {
      classes.forEach(c => figure.classList.add(c));
    }
    if (figure.classList.length === 0) figure.removeAttribute('class');
  }

  editor.nodeChanged();
  editor.undoManager.add();
}

function getActivePreset(el: HTMLElement, presets: Preset[]): Preset | null {
  const figure = getFigureWrap(el);
  const target = figure || el;
  
  for (const preset of presets) {
    if (!preset.class) continue;
    const classes = preset.class.split(/\s+/).filter(c => c);
    if (classes.length > 0 && classes.every(c => target.classList.contains(c))) {
      return preset;
    }
  }
  return null;
}

function getActiveEffects(el: HTMLElement, presets: Preset[]): Preset[] {
  const figure = getFigureWrap(el);
  const target = figure || el;
  const active: Preset[] = [];
  
  for (const preset of presets) {
    if (!preset.class) continue;
    const classes = preset.class.split(/\s+/).filter(c => c);
    if (classes.length > 0 && classes.every(c => target.classList.contains(c))) {
      active.push(preset);
    }
  }
  return active;
}

/* ================================================================== */
/*  Content Styles                                                     */
/* ================================================================== */

const contentStyles = `
  figure {
    margin: 0;
    padding: 0;
    display: table;
    max-width: 100%;
    box-sizing: border-box;
  }
  figure {
    cursor: default;
  }
  figure > figcaption {
    display: table-caption;
    caption-side: bottom;
    padding: 0.5em;
    background: rgba(0,0,0,0.03);
    font-size: 0.9em;
    color: #666;
    text-align: center;
    min-height: 1.5em;
    outline: none;
    cursor: text;
  }
  figure > figcaption:empty::before {
    content: 'Bildunterschrift eingeben...';
    color: #999;
    font-style: italic;
  }
  figure > figcaption:focus {
    background: rgba(0,120,215,0.05);
    outline: 1px dashed rgba(0,120,215,0.3);
  }
  figure > img {
    width: 100% !important;
    height: auto !important;
    display: block;
  }
  
  /* IMG full width classes for frameworks */
  img.uk-width-1-1 { width: 100% !important; height: auto !important; }
  img.w-100 { width: 100% !important; height: auto !important; }

  /* GENERAL WIDTH */
  figure.img-width-small  { width: 150px !important; }
  figure.img-width-medium { width: 300px !important; }
  figure.img-width-large  { width: 600px !important; }
  figure.img-width-xlarge { width: 900px !important; }
  figure.img-width-25     { width: 25% !important; }
  figure.img-width-33     { width: 33.333% !important; }
  figure.img-width-50     { width: 50% !important; }
  figure.img-width-66     { width: 66.666% !important; }
  figure.img-width-75     { width: 75% !important; }
  figure.img-width-full   { width: 100% !important; display: block !important; }

  /* GENERAL ALIGN */
  figure.img-align-left   { float: left !important; margin: 0 1.5em 1em 0 !important; }
  figure.img-align-right  { float: right !important; margin: 0 0 1em 1.5em !important; }
  figure.img-align-center { display: table !important; margin-left: auto !important; margin-right: auto !important; float: none !important; }
  figure.img-align-none   { float: none !important; margin: 0 0 1em 0 !important; }

  /* GENERAL EFFECTS */
  figure.img-shadow-small  { box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important; }
  figure.img-shadow-medium { box-shadow: 0 5px 15px rgba(0,0,0,0.12) !important; }
  figure.img-shadow-large  { box-shadow: 0 14px 25px rgba(0,0,0,0.16) !important; }
  figure.img-rounded > img { border-radius: 5px !important; }
  figure.img-rounded-large > img { border-radius: 10px !important; }
  figure.img-circle > img  { border-radius: 50% !important; }
  figure.img-border > img  { border: 1px solid #e5e5e5 !important; }
  figure.img-border-dark > img { border: 1px solid #333 !important; }

  /* UIKIT WIDTH */
  figure[class*="uk-width-1-1"]   { width: 100% !important; display: block !important; }
  figure[class*="uk-width-4-5"]   { width: 80% !important; }
  figure[class*="uk-width-3-4"]   { width: 75% !important; }
  figure[class*="uk-width-2-3"]   { width: 66.6% !important; }
  figure[class*="uk-width-3-5"]   { width: 60% !important; }
  figure[class*="uk-width-1-2"]   { width: 50% !important; }
  figure[class*="uk-width-2-5"]   { width: 40% !important; }
  figure[class*="uk-width-1-3"]   { width: 33.3% !important; }
  figure[class*="uk-width-1-4"]   { width: 25% !important; }
  figure[class*="uk-width-1-5"]   { width: 20% !important; }
  figure[class*="uk-width-1-6"]   { width: 16.6% !important; }
  figure[class*="uk-width-auto"]  { width: auto !important; }
  figure[class*="uk-width-small"] { width: 150px !important; }
  figure[class*="uk-width-medium"]{ width: 300px !important; }
  figure[class*="uk-width-large"] { width: 450px !important; }
  figure[class*="uk-width-xlarge"]{ width: 600px !important; }
  figure[class*="uk-width-2xlarge"]{ width: 750px !important; }

  /* UIKIT ALIGN */
  figure.uk-float-left    { float: left !important; }
  figure.uk-float-right   { float: right !important; }
  figure.uk-display-block { display: block !important; }
  figure.uk-margin-auto   { margin-left: auto !important; margin-right: auto !important; }
  figure.uk-margin-right, figure.uk-margin-small-right  { margin-right: 1em !important; }
  figure.uk-margin-left, figure.uk-margin-small-left    { margin-left: 1em !important; }
  figure.uk-margin-bottom, figure.uk-margin-small-bottom { margin-bottom: 1em !important; }

  /* UIKIT EFFECTS */
  figure.uk-box-shadow-small  { box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important; }
  figure.uk-box-shadow-medium { box-shadow: 0 5px 15px rgba(0,0,0,0.08) !important; }
  figure.uk-box-shadow-large  { box-shadow: 0 14px 25px rgba(0,0,0,0.16) !important; }
  figure.uk-box-shadow-xlarge { box-shadow: 0 28px 50px rgba(0,0,0,0.16) !important; }
  figure.uk-border-rounded > img { border-radius: 5px !important; }
  figure.uk-border-circle > img  { border-radius: 50% !important; }
  figure.uk-border > img         { border: 1px solid #e5e5e5 !important; }

  /* BOOTSTRAP COL */
  figure[class*="col-1"]  { width: 8.33% !important; }
  figure[class*="col-2"]  { width: 16.66% !important; }
  figure[class*="col-3"]  { width: 25% !important; }
  figure[class*="col-4"]  { width: 33.33% !important; }
  figure[class*="col-5"]  { width: 41.66% !important; }
  figure[class*="col-6"]  { width: 50% !important; }
  figure[class*="col-7"]  { width: 58.33% !important; }
  figure[class*="col-8"]  { width: 66.66% !important; }
  figure[class*="col-9"]  { width: 75% !important; }
  figure[class*="col-10"] { width: 83.33% !important; }
  figure[class*="col-11"] { width: 91.66% !important; }
  figure[class*="col-12"] { width: 100% !important; display: block !important; }

  /* BOOTSTRAP ALIGN */
  figure.float-start { float: left !important; }
  figure.float-end   { float: right !important; }
  figure.d-block     { display: block !important; }
  figure.mx-auto     { margin-left: auto !important; margin-right: auto !important; }
  figure.me-3        { margin-right: 1rem !important; }
  figure.ms-3        { margin-left: 1rem !important; }
  figure.mb-3        { margin-bottom: 1rem !important; }

  /* BOOTSTRAP EFFECTS */
  figure.shadow-sm { box-shadow: 0 .125rem .25rem rgba(0,0,0,.075) !important; }
  figure.shadow    { box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important; }
  figure.shadow-lg { box-shadow: 0 1rem 3rem rgba(0,0,0,.175) !important; }
  figure.rounded > img   { border-radius: .375rem !important; }
  figure.rounded-circle > img { border-radius: 50% !important; }
  figure.border > img    { border: 1px solid #dee2e6 !important; }

  /* VISUAL INDICATOR */
  figure[class] {
    outline: 2px dashed rgba(0,120,215,0.35);
    outline-offset: 2px;
  }
  figure[class]:hover {
    outline-color: rgba(0,120,215,0.8);
  }
`;

/* ================================================================== */
/*  PLUGIN SETUP                                                       */
/* ================================================================== */

const setup = (editor: Editor, _url: string): void => {

  editor.options.register('imagewidth_presets', { processor: 'object[]', default: [] });
  editor.options.register('imagealign_presets', { processor: 'object[]', default: [] });
  editor.options.register('imageeffect_presets', { processor: 'object[]', default: [] });

  const getConfig = (): PluginConfig => {
    const getOption = (key: string): any => {
      let val = editor.options.get(key);
      if (!val || (Array.isArray(val) && val.length === 0)) val = (editor as any).settings?.[key];
      if (!val || (Array.isArray(val) && val.length === 0)) val = (editor as any).getParam?.(key, null);
      return val;
    };

    const pick = <T>(val: any, fallback: T[]): T[] =>
      Array.isArray(val) && val.length > 0 ? val : fallback;

    return {
      widthPresets: pick(getOption('imagewidth_presets'), defaultWidthPresets),
      alignPresets: pick(getOption('imagealign_presets'), defaultAlignPresets),
      effectPresets: pick(getOption('imageeffect_presets'), defaultEffectPresets),
    };
  };

  editor.on('init', () => {
    const doc = editor.getDoc();
    if (doc) {
      const style = doc.createElement('style');
      style.setAttribute('data-for-images-plugin', '1');
      style.textContent = contentStyles;
      doc.head.appendChild(style);
    }
    
    // Ensure all figures have img full width class applied
    const body = editor.getBody();
    const config = getConfig();
    const fullWidthClass = detectImgFullWidthClass(config.widthPresets);
    
    body.querySelectorAll('figure').forEach((figure: Element) => {
      const fig = figure as HTMLElement;
      
      // Ensure img inside figure has full width class
      const img = fig.querySelector('img');
      if (img && fig.classList.length > 0) {
        applyImgFullWidth(img as HTMLElement, fullWidthClass);
      }
    });
  });

  editor.on('ObjectResizeStart', (e: any) => {
    if (e.target && e.target.nodeName === 'IMG') {
      e.preventDefault();
    }
  });
  editor.options.set('object_resizing', false);
  editor.options.set('quickbars_image_toolbar', false);
  editor.options.set('image_caption', false);

  /* WIDTH MENU */
  editor.ui.registry.addMenuButton('imagewidth', {
    icon: 'resize',
    tooltip: 'Bildbreite',
    fetch: (callback: (items: any[]) => void) => {
      const img = getSelectedImg(editor);
      if (!img) { callback([]); return; }
      const config = getConfig();
      const active = getActivePreset(img, config.widthPresets);
      callback(config.widthPresets.map(preset => ({
        type: 'menuitem' as const,
        text: preset.label,
        icon: active && active.class === preset.class ? 'checkmark' : undefined,
        onAction: () => applyPresetClass(editor, img, preset, config.widthPresets)
      })));
    }
  });

  /* ALIGNMENT TOGGLE BUTTONS */
  editor.ui.registry.addToggleButton('imagealignleft', {
    icon: 'align-left',
    tooltip: 'Bild links',
    onAction: () => {
      const img = getSelectedImg(editor);
      if (!img) return;
      const config = getConfig();
      const leftPreset = config.alignPresets.find(p => 
        p.class.includes('float-left') || p.class.includes('float-start') || 
        p.class.includes('align-left') || p.class.includes('uk-float-left')
      );
      const active = getActivePreset(img, config.alignPresets);
      if (active && leftPreset && active.class === leftPreset.class) {
        applyPresetClass(editor, img, { label: '', class: '' }, config.alignPresets);
      } else if (leftPreset) {
        applyPresetClass(editor, img, leftPreset, config.alignPresets);
      }
    },
    onSetup: (api: any) => {
      const handler = () => {
        const img = getSelectedImg(editor);
        if (!img) { api.setActive(false); return; }
        const config = getConfig();
        const active = getActivePreset(img, config.alignPresets);
        api.setActive(!!active && (
          active.class.includes('float-left') || active.class.includes('float-start') ||
          active.class.includes('align-left') || active.class.includes('uk-float-left')
        ));
      };
      editor.on('NodeChange', handler);
      return () => editor.off('NodeChange', handler);
    }
  });

  editor.ui.registry.addToggleButton('imagealigncenter', {
    icon: 'align-center',
    tooltip: 'Bild zentrieren',
    onAction: () => {
      const img = getSelectedImg(editor);
      if (!img) return;
      const config = getConfig();
      const centerPreset = config.alignPresets.find(p => 
        p.class.includes('margin-auto') || p.class.includes('mx-auto') || 
        p.class.includes('align-center')
      );
      const active = getActivePreset(img, config.alignPresets);
      if (active && centerPreset && active.class === centerPreset.class) {
        applyPresetClass(editor, img, { label: '', class: '' }, config.alignPresets);
      } else if (centerPreset) {
        applyPresetClass(editor, img, centerPreset, config.alignPresets);
      }
    },
    onSetup: (api: any) => {
      const handler = () => {
        const img = getSelectedImg(editor);
        if (!img) { api.setActive(false); return; }
        const config = getConfig();
        const active = getActivePreset(img, config.alignPresets);
        api.setActive(!!active && (
          active.class.includes('margin-auto') || active.class.includes('mx-auto') ||
          active.class.includes('align-center')
        ));
      };
      editor.on('NodeChange', handler);
      return () => editor.off('NodeChange', handler);
    }
  });

  editor.ui.registry.addToggleButton('imagealignright', {
    icon: 'align-right',
    tooltip: 'Bild rechts',
    onAction: () => {
      const img = getSelectedImg(editor);
      if (!img) return;
      const config = getConfig();
      const rightPreset = config.alignPresets.find(p => 
        p.class.includes('float-right') || p.class.includes('float-end') || 
        p.class.includes('align-right') || p.class.includes('uk-float-right')
      );
      const active = getActivePreset(img, config.alignPresets);
      if (active && rightPreset && active.class === rightPreset.class) {
        applyPresetClass(editor, img, { label: '', class: '' }, config.alignPresets);
      } else if (rightPreset) {
        applyPresetClass(editor, img, rightPreset, config.alignPresets);
      }
    },
    onSetup: (api: any) => {
      const handler = () => {
        const img = getSelectedImg(editor);
        if (!img) { api.setActive(false); return; }
        const config = getConfig();
        const active = getActivePreset(img, config.alignPresets);
        api.setActive(!!active && (
          active.class.includes('float-right') || active.class.includes('float-end') ||
          active.class.includes('align-right') || active.class.includes('uk-float-right')
        ));
      };
      editor.on('NodeChange', handler);
      return () => editor.off('NodeChange', handler);
    }
  });

  editor.ui.registry.addButton('imagealignnone', {
    icon: 'remove-formatting',
    tooltip: 'Ausrichtung entfernen',
    onAction: () => {
      const img = getSelectedImg(editor);
      if (!img) return;
      const config = getConfig();
      applyPresetClass(editor, img, { label: '', class: '' }, config.alignPresets);
    }
  });

  /* EFFECTS MENU */
  editor.ui.registry.addMenuButton('imageeffect', {
    icon: 'color-picker',
    tooltip: 'Bild-Effekte',
    fetch: (callback: (items: any[]) => void) => {
      const img = getSelectedImg(editor);
      if (!img) { callback([]); return; }
      const config = getConfig();
      const activeEffects = getActiveEffects(img, config.effectPresets);
      callback(config.effectPresets.map(preset => ({
        type: 'togglemenuitem' as const,
        text: preset.label,
        active: preset.class === '' ? activeEffects.length === 0 : activeEffects.some(a => a.class === preset.class),
        onAction: () => toggleEffectClass(editor, img, preset, config.effectPresets)
      })));
    }
  });

  /* DIALOG BUTTON */
  editor.ui.registry.addButton('imagewidthdialog', {
    icon: 'image',
    tooltip: 'Bildformatierung',
    onAction: () => {
      const img = getSelectedImg(editor);
      if (!img) {
        editor.notificationManager.open({ text: 'Bitte zuerst ein Bild auswählen.', type: 'warning', timeout: 3000 });
        return;
      }

      const config = getConfig();
      const activeWidth = getActivePreset(img, config.widthPresets);
      const activeAlign = getActivePreset(img, config.alignPresets);
      const activeEffects = getActiveEffects(img, config.effectPresets);

      const widthOptions = config.widthPresets.map(p => ({ text: p.label, value: p.class }));
      const alignOptions = config.alignPresets.map(p => ({ text: p.label, value: p.class }));

      const effectCheckboxes = config.effectPresets
        .filter(p => p.class)
        .map(p => ({
          type: 'checkbox' as const,
          name: 'effect_' + p.class.replace(/\s+/g, '_'),
          label: p.label
        }));

      const initialData: Record<string, any> = {
        widthClass: activeWidth?.class || '',
        alignClass: activeAlign?.class || ''
      };
      config.effectPresets.filter(p => p.class).forEach(p => {
        initialData['effect_' + p.class.replace(/\s+/g, '_')] = activeEffects.some(a => a.class === p.class);
      });

      const bodyItems: any[] = [
        { type: 'selectbox', name: 'widthClass', label: 'Breite', items: widthOptions },
        { type: 'selectbox', name: 'alignClass', label: 'Ausrichtung', items: alignOptions }
      ];
      if (effectCheckboxes.length > 0) {
        bodyItems.push({ type: 'bar', items: effectCheckboxes });
      }

      editor.windowManager.open({
        title: 'Bildformatierung',
        size: 'normal',
        body: { type: 'panel', items: bodyItems },
        buttons: [
          { type: 'cancel', name: 'cancel', text: 'Abbrechen' },
          { type: 'submit', name: 'save', text: 'Übernehmen', primary: true }
        ],
        initialData,
        onSubmit: (api: any) => {
          const data = api.getData();
          const widthPreset = config.widthPresets.find(p => p.class === data.widthClass) || { label: '', class: '' };
          applyPresetClass(editor, img, widthPreset, config.widthPresets);
          const alignPreset = config.alignPresets.find(p => p.class === data.alignClass) || { label: '', class: '' };
          applyPresetClass(editor, img, alignPreset, config.alignPresets);
          const figure = getFigureWrap(img);
          if (figure) {
            stripPresetClasses(figure, config.effectPresets);
            config.effectPresets.filter(p => p.class).forEach(p => {
              if (data['effect_' + p.class.replace(/\s+/g, '_')]) {
                p.class.split(/\s+/).forEach(c => { if (c) figure.classList.add(c); });
              }
            });
          }
          editor.nodeChanged();
          editor.undoManager.add();
          api.close();
        }
      });
    }
  });

  /* CONTEXT TOOLBAR */
  editor.ui.registry.addContextToolbar('for_imagestoolbar', {
    predicate: (node: any) => node.nodeName === 'IMG' || (node.nodeName === 'FIGURE' && node.querySelector('img')),
    items: 'imagewidth imagealignleft imagealigncenter imagealignright imageeffect imagealignnone | imagealt imagecaption',
    position: 'node',
    scope: 'node'
  });

  /* ALT TEXT BUTTON */
  editor.ui.registry.addToggleButton('imagealt', {
    icon: 'accessibility-check',
    tooltip: 'Alt-Text bearbeiten',
    onAction: () => {
      const img = getSelectedImg(editor);
      if (!img) return;
      const currentAlt = img.getAttribute('alt') || '';
      
      editor.windowManager.open({
        title: 'Alt-Text (Bildbeschreibung)',
        body: {
          type: 'panel',
          items: [
            {
              type: 'input',
              name: 'alttext',
              label: 'Beschreibung für Screenreader',
              placeholder: 'z.B. "Rotes Auto vor blauem Himmel"'
            },
            {
              type: 'htmlpanel',
              html: '<p style="color:#666;font-size:12px;margin-top:8px;">Beschreiben Sie den Bildinhalt kurz und prägnant für Menschen die das Bild nicht sehen können.</p>'
            }
          ]
        },
        initialData: { alttext: currentAlt },
        buttons: [
          { type: 'cancel', text: 'Abbrechen' },
          { type: 'submit', text: 'Speichern', primary: true }
        ],
        onSubmit: (api: any) => {
          const data = api.getData();
          img.setAttribute('alt', data.alttext);
          editor.nodeChanged();
          editor.undoManager.add();
          api.close();
        }
      });
    },
    onSetup: (api: any) => {
      const updateState = () => {
        const img = getSelectedImg(editor);
        if (!img) { api.setActive(false); return; }
        const alt = img.getAttribute('alt');
        // Active (highlighted) = has alt text
        api.setActive(!!alt && alt.trim() !== '');
      };
      editor.on('NodeChange', updateState);
      updateState();
      return () => editor.off('NodeChange', updateState);
    }
  });

  /* CAPTION TOGGLE BUTTON */
  editor.ui.registry.addToggleButton('imagecaption', {
    icon: 'comment',
    tooltip: 'Bildunterschrift',
    onAction: () => {
      const img = getSelectedImg(editor);
      if (!img) return;
      const figure = getFigureWrap(img);
      if (!figure) {
        // Create figure with caption
        const newFigure = ensureFigureWrap(editor, img);
        const doc = editor.getDoc();
        const figcaption = doc.createElement('figcaption');
        figcaption.innerHTML = '&nbsp;';
        newFigure.appendChild(figcaption);
        editor.selection.setCursorLocation(figcaption, 0);
      } else {
        const existingCaption = figure.querySelector('figcaption');
        if (existingCaption) {
          // Remove caption if empty, otherwise focus it
          if (!existingCaption.textContent?.trim()) {
            existingCaption.remove();
          } else {
            editor.selection.setCursorLocation(existingCaption, 0);
          }
        } else {
          // Add caption
          const doc = editor.getDoc();
          const figcaption = doc.createElement('figcaption');
          figcaption.innerHTML = '&nbsp;';
          figure.appendChild(figcaption);
          editor.selection.setCursorLocation(figcaption, 0);
        }
      }
      editor.nodeChanged();
      editor.undoManager.add();
    },
    onSetup: (api: any) => {
      const updateState = () => {
        const img = getSelectedImg(editor);
        if (!img) { api.setActive(false); return; }
        const figure = getFigureWrap(img);
        const hasCaption = figure?.querySelector('figcaption') !== null;
        api.setActive(hasCaption);
      };
      editor.on('NodeChange', updateState);
      updateState();
      return () => editor.off('NodeChange', updateState);
    }
  });

  /* TOOLTIP */
  editor.on('NodeChange', () => {
    const img = getSelectedImg(editor);
    if (!img) return;
    const config = getConfig();
    const w = getActivePreset(img, config.widthPresets);
    const a = getActivePreset(img, config.alignPresets);
    const effects = getActiveEffects(img, config.effectPresets);
    const parts: string[] = [];
    if (w && w.class) parts.push(w.label);
    if (a && a.class) parts.push(a.label);
    if (effects.length > 0) parts.push(effects.map(e => e.label).join(', '));
    const target = getFigureWrap(img) || img;
    if (parts.length > 0) {
      target.setAttribute('title', parts.join(' · '));
    } else {
      target.removeAttribute('title');
    }
  });
};

export default (): void => {
  tinymce.PluginManager.add('for_images', setup);
};
