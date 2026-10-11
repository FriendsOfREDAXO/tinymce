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

interface PresetType {
  key: 'width' | 'align' | 'effect';
  presets: Preset[];
}

type ImageKeyDownHandler = (e: KeyboardEvent) => void;
type ImageEventHandler = (e: ClipboardEvent) => void;

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
/*  Config Cache (Performance Optimization)                           */
/* ================================================================== */

class ConfigCache {
  private cache: PluginConfig | null = null;
  private editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  get(): PluginConfig {
    if (this.cache) return this.cache;
    
    const getOption = (key: string): any => {
      let val = this.editor.options.get(key);
      if (!val || (Array.isArray(val) && val.length === 0)) val = (this.editor as any).settings?.[key];
      if (!val || (Array.isArray(val) && val.length === 0)) val = (this.editor as any).getParam?.(key, null);
      return val;
    };

    const pick = <T>(val: any, fallback: T[]): T[] =>
      Array.isArray(val) && val.length > 0 ? val : fallback;

    this.cache = {
      widthPresets: pick(getOption('imagewidth_presets'), defaultWidthPresets),
      alignPresets: pick(getOption('imagealign_presets'), defaultAlignPresets),
      effectPresets: pick(getOption('imageeffect_presets'), defaultEffectPresets),
    };
    return this.cache;
  }

  invalidate(): void {
    this.cache = null;
  }

  getAllClasses(presets: Preset[]): string[] {
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
}

/* ================================================================== */
/*  Figure Helpers                                                     */
/* ================================================================== */

/**
 * Ein Link, der ausschließlich das Bild umschließt (`<a><img></a>`), gehört
 * zum Bild und wandert beim Einpacken mit in die <figure>.
 */
function getLinkWrap(img: HTMLElement): HTMLElement | null {
  const parent = img.parentElement;
  if (!parent || parent.nodeName !== 'A') return null;
  const onlyImg = Array.from(parent.childNodes).every(
    n => n === img || (n.nodeType === Node.TEXT_NODE && (n.textContent || '').trim() === '')
  );
  return onlyImg ? parent : null;
}

function getFigureWrap(el: HTMLElement): HTMLElement | null {
  if (el.nodeName === 'FIGURE') return el;
  const parent = el.parentElement;
  if (parent && parent.nodeName === 'FIGURE') return parent;
  // <figure><a><img></a></figure> (verlinktes Bild)
  if (parent && parent.nodeName === 'A' && parent.parentElement?.nodeName === 'FIGURE') {
    return parent.parentElement;
  }
  return null;
}

/** Absatz ist nach dem Herausnehmen des Bildes leer (nur Whitespace/&nbsp;/<br>/leere Inline-Tags). */
function isEmptyParagraph(p: HTMLElement): boolean {
  return (p.textContent || '').trim() === '' &&
    !p.querySelector('img, picture, video, audio, iframe, object, embed, svg, input, figure, table');
}

function ensureFigureWrap(editor: Editor, img: HTMLElement): HTMLElement {
  const existing = getFigureWrap(img);
  if (existing) {
    return existing;
  }

  const doc = editor.getDoc();
  const figure = doc.createElement('figure');

  // Verlinkte Bilder: der Link wandert mit in die figure (<figure><a><img></a></figure>)
  const unit = getLinkWrap(img) || img;
  const parent = unit.parentElement;
  // Bild steckt in einem Absatz (ggf. in Inline-Formatierung wie <strong>):
  // figure vor den Absatz setzen, der Text bleibt unverändert erhalten.
  const paragraph = parent ? (parent.closest('p') as HTMLElement | null) : null;

  // Nie über den Editor-Body hinaus (Inline-Modus) – Paste-Fragmente sind erlaubt.
  if (paragraph && paragraph.parentNode && !paragraph.contains(editor.getBody())) {
    paragraph.parentNode.insertBefore(figure, paragraph);
    figure.appendChild(unit);
    if (isEmptyParagraph(paragraph)) {
      paragraph.remove();
    }
  } else if (parent) {
    parent.insertBefore(figure, unit);
    figure.appendChild(unit);
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

function normalizeFigures(editor: Editor, scope?: ParentNode): void {
  const root = scope ?? editor.getBody();
  if (!root) {
    return;
  }

  // Single-pass traversal: re-wrap standalone <img> AND remove empty <figure>
  // in one DOM walk instead of two separate querySelectorAll passes.
  Array.from(root.querySelectorAll('img, figure')).forEach((el) => {
    if (el.nodeName === 'IMG') {
      const parent = el.parentElement;
      if (!(parent && parent.nodeName === 'FIGURE')) {
        ensureFigureWrap(editor, el as HTMLElement);
      }
      return;
    }
    // FIGURE
    const figure = el as HTMLElement;
    if (figure.querySelector('img')) {
      return;
    }
    const hasElementChildren = figure.children.length > 0;
    const hasTextContent = (figure.textContent || '').trim() !== '';
    if (!hasElementChildren && !hasTextContent) {
      figure.remove();
    }
  });
}

/* ================================================================== */
/*  Class Management & Cleanup                                         */
/* ================================================================== */

/**
 * Deduplicated cleanup function: strips preset classes and legacy CKE5 markup.
 * Combines the functionality of stripPresetClasses and stripCke5LegacyClasses.
 */
function cleanupFigureClasses(
  figure: HTMLElement,
  allPresetClasses: string[],
  compatMode: boolean
): void {
  // Strip all preset classes
  allPresetClasses.forEach(cls => figure.classList.remove(cls));

  // If compat mode: strip legacy CKE5 classes
  if (compatMode) {
    const toRemove: string[] = [];
    figure.classList.forEach(cls => {
      if (
        cls === 'image' ||
        cls === 'image_resized' ||
        cls.startsWith('image-style-') ||
        cls.startsWith('img-width-') ||
        cls.startsWith('img-height-')
      ) {
        toRemove.push(cls);
      }
    });
    toRemove.forEach(cls => figure.classList.remove(cls));
    
    // CKE5 inline width="NN%" on figure
    const inlineWidth = figure.style.width;
    if (inlineWidth && inlineWidth.includes('%')) {
      figure.style.removeProperty('width');
      if (figure.getAttribute('style') === '') figure.removeAttribute('style');
    }
  }
}

/**
 * Get all classes from a list of presets (extracted from ConfigCache for reusability).
 */
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
  // TinyMCE serialisiert `data-mce-style` statt `style` – nach Änderungen verwerfen
  img.removeAttribute('data-mce-style');
  img.classList.remove('uk-width-1-1', 'w-100');
  img.style.removeProperty('width');
  if (fullWidthClass) {
    img.classList.add(fullWidthClass);
  } else {
    img.style.width = '100%';
  }
}

/**
 * Generic preset application function (unified for width/align/effects).
 * Handles class management, figure wrapping, and undo tracking.
 */
function applyPreset(
  editor: Editor,
  img: HTMLElement,
  preset: Preset,
  allPresets: Preset[],
  compatMode: boolean = false
): void {
  const figure = preset.class ? ensureFigureWrap(editor, img) : getFigureWrap(img);
  const fullWidthClass = detectImgFullWidthClass(allPresets);
  const allClasses = getAllClasses(allPresets);

  if (figure) {
    cleanupFigureClasses(figure, allClasses, compatMode);
    
    if (preset.class) {
      preset.class.split(/\s+/).forEach(c => {
        if (c) figure.classList.add(c);
      });
      applyImgFullWidth(img, fullWidthClass);
    } else if (fullWidthClass) {
      fullWidthClass.split(/\s+/).forEach(c => {
        if (c) img.classList.remove(c);
      });
      if (img.classList.length === 0) img.removeAttribute('class');
    }
    
    if (figure.classList.length === 0) figure.removeAttribute('class');
  }

  img.style.removeProperty('width');
  img.style.removeProperty('height');
  if (img.getAttribute('style') === '') img.removeAttribute('style');

  editor.nodeChanged();
  editor.undoManager.add();
}

/**
 * Toggle effect class on figure (add if not present, remove if present).
 */
function toggleEffectPreset(
  editor: Editor,
  img: HTMLElement,
  preset: Preset,
  allPresets: Preset[],
  compatMode: boolean = false
): void {
  if (!preset.class) {
    const figure = getFigureWrap(img);
    if (figure) {
      cleanupFigureClasses(figure, getAllClasses(allPresets), compatMode);
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
    if (compatMode) cleanupFigureClasses(figure, getAllClasses(allPresets), true);
    if (figure.classList.length === 0) figure.removeAttribute('class');
  }

  editor.nodeChanged();
  editor.undoManager.add();
}

function applyPresetClass(editor: Editor, img: HTMLElement, preset: Preset, allPresets: Preset[]): void {
  applyPreset(editor, img, preset, allPresets, !!editor.options.get('image_compat_warn'));
}

/**
 * Breiten-Preset anwenden. Eine aus CKE5 übernommene freie Breite
 * (`style="width:16.49%"` an der figure) wird dabei ersetzt.
 */
function applyWidthPreset(editor: Editor, img: HTMLElement, preset: Preset, allPresets: Preset[]): void {
  const figure = getFigureWrap(img);
  if (figure) removeStyleWidth(figure);
  applyPresetClass(editor, img, preset, allPresets);
}

function toggleEffectClass(editor: Editor, img: HTMLElement, preset: Preset, allPresets: Preset[]): void {
  toggleEffectPreset(editor, img, preset, allPresets, !!editor.options.get('image_compat_warn'));
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
/*  Align-Preset-Erkennung (Toolbar-Buttons + CKE5-Import)             */
/* ================================================================== */

type AlignDirection = 'left' | 'right' | 'center';

const alignPatterns: Record<AlignDirection, string[]> = {
  left: ['float-left', 'float-start', 'align-left', 'uk-float-left'],
  right: ['float-right', 'float-end', 'align-right', 'uk-float-right'],
  center: ['margin-auto', 'mx-auto', 'align-center'],
};

function isAlignPreset(preset: Preset | null, dir: AlignDirection): boolean {
  return !!preset && !!preset.class && alignPatterns[dir].some(p => preset.class.includes(p));
}

function findAlignPreset(presets: Preset[], dir: AlignDirection): Preset | undefined {
  return presets.find(p => isAlignPreset(p, dir));
}

/* ================================================================== */
/*  CKEditor-5-Import                                                  */
/* ================================================================== */

/**
 * CKE5-Bildmarkup erkennen (dieselbe Erkennung wie für `image_compat_warn`):
 * `figure.image`, `.image_resized` und Klassen `image-style-*`.
 */
const CKE5_SELECTOR = 'figure.image, .image_resized, [class*="image-style-"]';

function hasCke5Markup(root: ParentNode | null): boolean {
  return !!root && !!root.querySelector(CKE5_SELECTOR);
}

/** CKE5-Stilklasse → Ausrichtung. Nicht aufgeführte image-style-* bleiben unverändert erhalten. */
const cke5AlignClasses: Record<string, AlignDirection | ''> = {
  'image-style-align-left': 'left',
  'image-style-block-align-left': 'left',
  'image-style-align-right': 'right',
  'image-style-block-align-right': 'right',
  'image-style-side': 'right',
  'image-style-align-center': 'center',
  'image-style-align-block-center': 'center',
  'image-style-inline': '',
  'image-style-full': '',
};

interface Cke5ImportConfig {
  widthPresets: Preset[];
  alignPresets: Preset[];
  map: Record<string, string>;
  fullWidthClass: string;
}

/**
 * Breite eines Presets in % bzw. px ermitteln: zuerst aus dem Label
 * („25 %", „Klein (150px)"), sonst aus bekannten Framework-Klassen.
 */
function presetWidth(preset: Preset): { value: number; unit: '%' | 'px' } | null {
  if (!preset.class) return null;
  const label = preset.label || '';
  const pct = label.match(/(\d+(?:[.,]\d+)?)\s*%/);
  if (pct) return { value: parseFloat(pct[1].replace(',', '.')), unit: '%' };
  const px = label.match(/(\d+(?:[.,]\d+)?)\s*px/i);
  if (px) return { value: parseFloat(px[1].replace(',', '.')), unit: 'px' };

  const cls = ' ' + preset.class + ' ';
  let m = cls.match(/\suk-width-(\d+)-(\d+)(?:@\w+)?\s/);
  if (m && +m[2] > 0) return { value: (+m[1] / +m[2]) * 100, unit: '%' };
  m = cls.match(/\s(?:img-width-|w-)(\d+)\s/);
  if (m) return { value: +m[1], unit: '%' };
  if (/\s(?:img-width-full|w-100)\s/.test(cls)) return { value: 100, unit: '%' };
  m = cls.match(/\scol(?:-\w+)?-(\d+)\s/);
  if (m) return { value: (+m[1] / 12) * 100, unit: '%' };
  return null;
}

function findWidthPreset(presets: Preset[], value: number, unit: string): Preset | undefined {
  return presets.find(p => {
    const w = presetWidth(p);
    return !!w && w.unit === unit && Math.abs(w.value - value) < 0.5;
  });
}

function resolveAlignClass(cke5Class: string, cfg: Cke5ImportConfig): string | null {
  // 1. Explizite Zuordnung aus `image_cke5_map`
  if (Object.prototype.hasOwnProperty.call(cfg.map, cke5Class)) {
    return cfg.map[cke5Class] || '';
  }
  const dir = cke5AlignClasses[cke5Class];
  if (dir === undefined) return null; // unbekannte image-style-* → nicht anfassen
  if (dir === '') return '';
  // 2. Preset, das die CKE5-Klasse selbst verwendet
  const same = cfg.alignPresets.find(p => p.class.split(/\s+/).includes(cke5Class));
  if (same) return same.class;
  // 3. Preset mit passender Ausrichtung (gleiche Erkennung wie die Toolbar-Buttons)
  const preset = findAlignPreset(cfg.alignPresets, dir);
  if (preset) return preset.class;
  // 4. Kein Preset → CKE5-Klasse behalten, damit die Ausrichtung nicht verloren geht
  return cke5Class;
}

function addClasses(el: HTMLElement, classes: string): void {
  classes.split(/\s+/).forEach(c => { if (c) el.classList.add(c); });
}

function removeStyleWidth(el: HTMLElement): void {
  // TinyMCE serialisiert `data-mce-style` statt `style` – nach Änderungen verwerfen
  el.removeAttribute('data-mce-style');
  el.style.removeProperty('width');
  if (el.getAttribute('style') === '' || el.getAttribute('style') === null) el.removeAttribute('style');
}

/**
 * Übersetzt CKE5-Bildmarkup in das for_images-Format:
 *  - Inline-Bilder (`<p><img class="image-style-align-right image_resized" style="width:25%">Text</p>`)
 *    werden in eine <figure> vor den Absatz gesetzt; Ausrichtung und Breite wandern
 *    vom <img> auf die <figure>.
 *  - Block-Bilder (`<figure class="image image-style-align-left image_resized" style="width:50%">`)
 *    behalten ihre <figure>; Ausrichtung/Breite werden auf Presets abgebildet.
 *  - Breite: passendes `imagewidth_presets`-Preset (±0,5), sonst bleibt `style="width:…"` an der figure.
 *  - `image_resized` entfällt, `src`, `alt`, Links und `figcaption` bleiben unverändert.
 */
function importCke5Images(editor: Editor, root: ParentNode, cfg: Cke5ImportConfig): number {
  if (!hasCke5Markup(root)) return 0;

  const candidates = new Set<HTMLElement>();
  root.querySelectorAll('img').forEach(img => {
    const el = img as HTMLElement;
    const fig = getFigureWrap(el);
    const isCke5 = (n: HTMLElement | null): boolean => !!n && (
      n.classList.contains('image_resized') ||
      (n.nodeName === 'FIGURE' && n.classList.contains('image')) ||
      Array.from(n.classList).some(c => c.startsWith('image-style-'))
    );
    if (isCke5(el) || isCke5(fig)) candidates.add(el);
  });

  let count = 0;
  candidates.forEach(img => {
    const hadFigure = !!getFigureWrap(img);
    const figure = ensureFigureWrap(editor, img);
    if (!figure.contains(img)) return;

    // Klassen sammeln: img (Inline-Bild) + figure (Block-Bild)
    const styleClasses: string[] = [];
    const collect = (el: HTMLElement): void => {
      Array.from(el.classList).forEach(c => {
        if (c === 'image_resized' || c.startsWith('image-style-')) {
          styleClasses.push(c);
          el.classList.remove(c);
        }
      });
    };
    collect(img);
    collect(figure);

    // Breite: figure (Block) vor img (Inline)
    const width = figure.style.width || img.style.width || '';
    removeStyleWidth(img);
    removeStyleWidth(figure);

    // Ausrichtung
    styleClasses.forEach(c => {
      if (c === 'image_resized') return;
      const mapped = resolveAlignClass(c, cfg);
      addClasses(figure, mapped === null ? c : mapped);
    });

    // Breite
    if (width) {
      const m = width.trim().match(/^(\d+(?:\.\d+)?)(%|px)$/);
      const preset = m ? findWidthPreset(cfg.widthPresets, parseFloat(m[1]), m[2]) : undefined;
      if (preset) {
        addClasses(figure, preset.class);
      } else {
        figure.style.width = width;
      }
    }

    if (figure.classList.length > 0 || figure.style.width) {
      applyImgFullWidth(img, cfg.fullWidthClass);
    }
    if (img.classList.length === 0) img.removeAttribute('class');
    if (figure.classList.length === 0) figure.removeAttribute('class');
    if (!hadFigure || styleClasses.length > 0 || width) count++;
  });

  return count;
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
  editor.options.register('image_compat_warn', { processor: 'boolean', default: false });
  // CKE5-Import: Ausrichtung/Breite aus CKEditor-5-Bildmarkup auf Presets übertragen
  editor.options.register('image_cke5_import', { processor: 'boolean', default: true });
  // Optionale explizite Zuordnung CKE5-Klasse → Preset-Klasse(n), z. B.
  // { 'image-style-align-left': 'uk-float-left uk-margin-right' }
  editor.options.register('image_cke5_map', { processor: 'object', default: {} });
  // Fix: image_caption muss registriert werden, bevor sie gesetzt wird
  editor.options.register('image_caption', { processor: 'boolean', default: false });

  // Initialize config cache once
  const configCache = new ConfigCache(editor);
  const compatMode = !!editor.options.get('image_compat_warn');
  const cke5Import = editor.options.get('image_cke5_import') !== false;

  const getCke5ImportConfig = (): Cke5ImportConfig => {
    const config = configCache.get();
    const rawMap = editor.options.get('image_cke5_map');
    const map: Record<string, string> = {};
    if (rawMap && typeof rawMap === 'object' && !Array.isArray(rawMap)) {
      Object.keys(rawMap).forEach(k => {
        if (typeof rawMap[k] === 'string') map[k] = rawMap[k];
      });
    }
    return {
      widthPresets: config.widthPresets,
      alignPresets: config.alignPresets,
      map,
      fullWidthClass: detectImgFullWidthClass(config.widthPresets),
    };
  };

  /** CKE5-Markup im Bereich übernehmen; liefert true, wenn CKE5-Markup gefunden wurde. */
  const runCke5Import = (root: ParentNode | null): boolean => {
    if (!root || !hasCke5Markup(root)) return false;
    if (cke5Import) importCke5Images(editor, root, getCke5ImportConfig());
    return true;
  };

  /* ------------------------------------------------------------------
   *  CKE5-Legacy-Hinweis (image_compat_warn)
   * ------------------------------------------------------------------ */
  let cke5WarningShown = false;
  let cke5Detected = false;

  const showCke5Warning = (): void => {
    if (cke5WarningShown || !compatMode) return;
    cke5WarningShown = true;
    try {
      editor.notificationManager.open({
        type: 'warning',
        text: cke5Import
          ? 'Hinweis: Dieser Inhalt enthielt Bildmarkup aus dem alten CKEditor 5. ' +
            'Ausrichtung und Breite wurden automatisch übernommen. Bitte die Bilder ' +
            'kurz prüfen und den Beitrag speichern, damit das Markup einheitlich wird.'
          : 'Hinweis: Dieser Inhalt enthält Bildmarkup aus dem alten CKEditor 5 (z. B. ' +
            'figure.image, image-style-…). Bitte die betroffenen Bilder mit der neuen ' +
            'Bildformatierungs-Toolbar (Breite, Ausrichtung, Effekte) erneut formatieren ' +
            'und den Beitrag speichern, damit das Markup einheitlich wird.',
        closeButton: true,
        timeout: 12000,
      });
    } catch (_e) { /* notificationManager nicht verfügbar */ }
  };

  /* Eigenes Icon für den Bildformatierungs-Dialog – grenzt sich klar
     vom Standard-„image"-Icon (Bild einfügen) ab: Bildrahmen mit
     Schiebereglern darunter, signalisiert „bestehendes Bild bearbeiten". */
  editor.ui.registry.addIcon('for_imagedialog',
    '<svg width="24" height="24" viewBox="0 0 24 24">' +
    '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="3" y="3" width="18" height="12" rx="1.5"/>' +
    '<circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/>' +
    '<path d="M3 13l4-4 3 3 4-5 7 6"/>' +
    '<path d="M3 19h6M15 19h6"/>' +
    '<circle cx="12" cy="19" r="1.8" fill="currentColor" stroke="none"/>' +
    '</g></svg>'
  );

  editor.ui.registry.addIcon('for_imagealignleft_icon',
    '<svg width="24" height="24" viewBox="0 0 20 20">' +
    '<path fill="currentColor" opacity=".55" d="M2 3h16v1.5H2zM2 15h16v1.5H2z"/>' +
    '<rect x="2" y="7" width="10" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
    '<path fill="currentColor" d="M14 8h4v1.4h-4zM14 10.6h3.2V12H14zM14 13.2h3.8v1.3H14z"/>' +
    '</svg>'
  );

  editor.ui.registry.addIcon('for_imagealigncenter_icon',
    '<svg width="24" height="24" viewBox="0 0 20 20">' +
    '<path fill="currentColor" opacity=".55" d="M2 3h16v1.5H2zM2 15h16v1.5H2z"/>' +
    '<rect x="5" y="7" width="10" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
    '</svg>'
  );

  editor.ui.registry.addIcon('for_imagealignright_icon',
    '<svg width="24" height="24" viewBox="0 0 20 20">' +
    '<path fill="currentColor" opacity=".55" d="M2 3h16v1.5H2zM2 15h16v1.5H2z"/>' +
    '<path fill="currentColor" d="M2 8h4v1.4H2zM2 10.6h3.2V12H2zM2 13.2h3.8v1.3H2z"/>' +
    '<rect x="8" y="7" width="10" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
    '</svg>'
  );

  editor.ui.registry.addIcon('for_imagealignnone_icon',
    '<svg width="24" height="24" viewBox="0 0 24 24">' +
    '<rect x="5" y="5" width="14" height="12" rx="1.5" fill="#6b7280"/>' +
    '<circle cx="8.5" cy="9" r="0.9" fill="#ffffff"/>' +
    '<path d="M7.2 14l1.6-2 1.2 1.4 1.3-1.8 1.8 2.4" fill="none" stroke="#ffffff" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M5.8 18.2l12.4-12.4" stroke="#6b7280" stroke-width="1.8" stroke-linecap="round"/>' +
    '</svg>'
  );

  editor.ui.registry.addIcon('for_imageswappool_icon',
    '<svg width="24" height="24" viewBox="0 0 24 24">' +
    '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M16 8H6m0 0l4-4m-4 4l4 4"/>' +
    '<path d="M8 16h10m0 0l-4-4m4 4l-4 4"/>' +
    '</g></svg>'
  );

  editor.on('init', () => {
    const doc = editor.getDoc();
    if (doc) {
      const style = doc.createElement('style');
      style.setAttribute('data-for-images-plugin', '1');
      style.textContent = contentStyles;
      doc.head.appendChild(style);
    }
    
    // Use cached config for performance
    const config = configCache.get();
    const fullWidthClass = detectImgFullWidthClass(config.widthPresets);
    const body = editor.getBody();
    
    body.querySelectorAll('figure').forEach((figure: Element) => {
      const fig = figure as HTMLElement;
      const img = fig.querySelector('img');
      if (img && fig.classList.length > 0) {
        applyImgFullWidth(img as HTMLElement, fullWidthClass);
      }
    });

    if (cke5Detected) showCke5Warning();
  });

  // Wird beim Laden (initialer Inhalt) und bei jedem setContent ausgelöst.
  // Der CKE5-Import läuft VOR normalizeFigures, damit Ausrichtung/Breite
  // beim Einpacken in <figure> nicht am <img> hängen bleiben.
  editor.on('SetContent', () => {
    if (runCke5Import(editor.getBody())) cke5Detected = true;
    normalizeFigures(editor);
    if (cke5Detected && editor.initialized) showCke5Warning();
  });

  // Beim Einfügen schon auf dem HTML-String übernehmen: der Paste-Filter
  // entfernt danach Inline-Styles (u. a. die CKE5-Breite am <img>).
  editor.on('PastePreProcess', (e: any) => {
    if (!cke5Import || typeof e?.content !== 'string' || e.content.indexOf('image') === -1) return;
    const container = editor.getDoc().createElement('div');
    container.innerHTML = e.content;
    if (runCke5Import(container)) {
      e.content = container.innerHTML;
    }
  });

  editor.on('PastePostProcess', (e: any) => {
    if (e?.node) {
      normalizeFigures(editor, e.node as ParentNode);
    }
  });

  editor.on('ObjectResizeStart', (e: any) => {
    if (e.target?.nodeName === 'IMG') {
      e.preventDefault();
    }
  });

  editor.options.set('object_resizing', false);
  const hasOption = (editor.options as any).isRegistered;
  if (typeof hasOption === 'function' && hasOption.call(editor.options, 'quickbars_image_toolbar')) {
    editor.options.set('quickbars_image_toolbar', false);
  }
  editor.options.set('image_caption', false);

  /* GROUPED FIGURE HANDLERS (DELETE/CUT/COPY)
   * Treat image + figure + figcaption as one logical block.
   * All clipboard/delete operations on a selected image inside a <figure>
   * are routed through these two small helpers to avoid repetition.
   */
  const getSelectedFigure = (): HTMLElement | null => {
    const img = getSelectedImg(editor);
    if (!img) return null;
    const figure = getFigureWrap(img);
    return figure && figure.nodeName === 'FIGURE' ? figure : null;
  };

  const selectFigureForClipboard = (): boolean => {
    const figure = getSelectedFigure();
    if (!figure) return false;
    editor.selection.select(figure, true);
    editor.nodeChanged();
    return true;
  };

  const writeFigureToClipboard = (figure: HTMLElement, data: DataTransfer): void => {
    data.setData('text/html', figure.outerHTML);
    data.setData('text/plain', figure.textContent || '');
  };

  const removeFigureBlock = (figure: HTMLElement): void => {
    editor.undoManager.transact(() => {
      editor.dom.remove(figure);
    });
    editor.nodeChanged();
  };

  editor.on('copy', (e: ClipboardEvent) => {
    const figure = getSelectedFigure();
    if (!figure || !e.clipboardData) return;
    writeFigureToClipboard(figure, e.clipboardData);
    e.preventDefault();
  });

  editor.on('cut', (e: ClipboardEvent) => {
    const figure = getSelectedFigure();
    if (!figure || !e.clipboardData) return;
    writeFigureToClipboard(figure, e.clipboardData);
    e.preventDefault();
    removeFigureBlock(figure);
  });

  editor.on('keydown', (e: any) => {
    const key = String(e.key || '').toLowerCase();

    if (key === 'delete' || key === 'backspace') {
      const figure = getSelectedFigure();
      if (figure) {
        e.preventDefault();
        removeFigureBlock(figure);
        return;
      }
    }

    if ((e.ctrlKey || e.metaKey) && (key === 'c' || key === 'x')) {
      selectFigureForClipboard();
    }
  });

  editor.on('BeforeExecCommand', (e: any) => {
    const command = String(e.command || '').toLowerCase();

    if (command === 'copy' || command === 'cut') {
      selectFigureForClipboard();
      return;
    }

    if (command === 'delete' || command === 'forwarddelete' || command === 'mcedelete') {
      const figure = getSelectedFigure();
      if (!figure) return;
      e.preventDefault();
      removeFigureBlock(figure);
    }
  });

  /* WIDTH MENU */
  editor.ui.registry.addMenuButton('imagewidth', {
    icon: 'resize',
    tooltip: 'Bildbreite',
    fetch: (callback: (items: any[]) => void) => {
      const img = getSelectedImg(editor);
      if (!img) { callback([]); return; }
      const config = configCache.get();
      const active = getActivePreset(img, config.widthPresets);
      callback(config.widthPresets.map(preset => ({
        type: 'menuitem' as const,
        text: preset.label,
        icon: active && active.class === preset.class ? 'checkmark' : undefined,
        onAction: () => applyWidthPreset(editor, img, preset, config.widthPresets)
      })));
    }
  });

  /* ALIGNMENT TOGGLE BUTTONS */
  editor.ui.registry.addToggleButton('for_imagealignleft', {
    icon: 'for_imagealignleft_icon',
    tooltip: 'Bild links',
    onAction: () => {
      const img = getSelectedImg(editor);
      if (!img) return;
      const config = configCache.get();
      const leftPreset = findAlignPreset(config.alignPresets, 'left');
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
        const config = configCache.get();
        const active = getActivePreset(img, config.alignPresets);
        api.setActive(isAlignPreset(active, 'left'));
      };
      editor.on('NodeChange', handler);
      return () => editor.off('NodeChange', handler);
    }
  });

  editor.ui.registry.addToggleButton('for_imagealigncenter', {
    icon: 'for_imagealigncenter_icon',
    tooltip: 'Bild zentrieren',
    onAction: () => {
      const img = getSelectedImg(editor);
      if (!img) return;
      const config = configCache.get();
      const centerPreset = findAlignPreset(config.alignPresets, 'center');
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
        const config = configCache.get();
        const active = getActivePreset(img, config.alignPresets);
        api.setActive(isAlignPreset(active, 'center'));
      };
      editor.on('NodeChange', handler);
      return () => editor.off('NodeChange', handler);
    }
  });

  editor.ui.registry.addToggleButton('for_imagealignright', {
    icon: 'for_imagealignright_icon',
    tooltip: 'Bild rechts',
    onAction: () => {
      const img = getSelectedImg(editor);
      if (!img) return;
      const config = configCache.get();
      const rightPreset = findAlignPreset(config.alignPresets, 'right');
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
        const config = configCache.get();
        const active = getActivePreset(img, config.alignPresets);
        api.setActive(isAlignPreset(active, 'right'));
      };
      editor.on('NodeChange', handler);
      return () => editor.off('NodeChange', handler);
    }
  });

  editor.ui.registry.addButton('for_imagealignnone', {
    icon: 'for_imagealignnone_icon',
    tooltip: 'Ausrichtung entfernen',
    onAction: () => {
      const img = getSelectedImg(editor);
      if (!img) return;
      const config = configCache.get();
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
      const config = configCache.get();
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
    icon: 'for_imagedialog',
    tooltip: 'Bildformatierung',
    onAction: () => {
      const img = getSelectedImg(editor);
      if (!img) {
        editor.notificationManager.open({ text: 'Bitte zuerst ein Bild auswählen.', type: 'warning', timeout: 3000 });
        return;
      }

      const config = configCache.get();
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
          applyWidthPreset(editor, img, widthPreset, config.widthPresets);
          const alignPreset = config.alignPresets.find(p => p.class === data.alignClass) || { label: '', class: '' };
          applyPresetClass(editor, img, alignPreset, config.alignPresets);
          const figure = getFigureWrap(img);
          if (figure) {
            cleanupFigureClasses(figure, getAllClasses(config.effectPresets), false);
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
    items: 'imagewidth for_imagealignleft for_imagealigncenter for_imagealignright imageeffect for_imagealignnone | imagealt imagecaption imageshowpool imageswappool',
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

  /* SHOW IN MEDIAPOOL BUTTON
   *
   * Opens the REDAXO mediapool in a popup, pre-filtered on the file name
   * of the currently selected image. No notifications / try-catch noise:
   * window.open() is synchronous and either returns a window ref or null.
   *
   * Weiche klassischer Medienpool <-> MediaPlace, rein feature-detected
   * ueber die gemeinsame Bruecke in assets/scripts/base.js
   * (window.rex5MediaplaceBridge, auch von rex5_picker_function und
   * custom_plugins/for_video genutzt): ist MediaPlace installiert und aktiv,
   * oeffnet die Datei direkt im Detail-Panel des Overlays (Browse-only,
   * aendert nichts an der Auswahl im Editor) statt des klassischen Popups.
   */
  editor.ui.registry.addButton('imageshowpool', {
    icon: 'gallery',
    tooltip: 'Zeige Medium im Medienpool',
    onAction: () => {
      const img = getSelectedImg(editor);
      const filename = img?.getAttribute('src')?.split('/').pop()?.split('?')[0] || '';
      if (!filename) {
        editor.notificationManager.open({ text: 'Bitte zuerst ein Bild auswählen.', type: 'warning', timeout: 3000 });
        return;
      }
      const bridge = (window as any).rex5MediaplaceBridge;
      if (bridge && bridge.isActive()) {
        bridge.show(filename);
        return;
      }
      const poolUrl = 'index.php?page=mediapool/media&file_name=' + encodeURIComponent(filename);
      window.open(poolUrl, 'mediapool', 'width=1000,height=700,resizable=yes,scrollbars=yes');
    }
  });

  /* SWAP FROM MEDIAPOOL BUTTON
   *
   * Delegates to TinyMCE's built-in image dialog (`mceImage`) which uses
   * the editor's `file_picker_callback` to open the REDAXO mediapool.
   * The standard dialog updates src/alt on the currently selected image,
   * which is exactly what we want here. Avoids reinventing the swap flow
   * (and the URL-converter / DomPurify edge cases that come with it).
   */
  editor.ui.registry.addButton('imageswappool', {
    icon: 'for_imageswappool_icon',
    tooltip: 'Austauschen aus Medienpool',
    onAction: () => {
      const img = getSelectedImg(editor);
      if (!img) {
        editor.notificationManager.open({ text: 'Bitte zuerst ein Bild auswählen.', type: 'warning', timeout: 3000 });
        return;
      }

      // Ensure the selection is on the IMG (not the wrapping FIGURE/FIGCAPTION)
      // so the standard image dialog picks it up as "edit existing image".
      try {
        editor.selection.select(img);
      } catch (e) { /* ignore */ }

      // `mceImage` is only registered when the built-in `image` plugin is
      // active in the profile. Profiles can toggle plugins independently,
      // so guard explicitly and tell the user how to fix it instead of
      // silently doing nothing.
      const imageAvailable =
        (editor.plugins && (editor.plugins as Record<string, unknown>).image) ||
        (typeof editor.queryCommandSupported === 'function' && editor.queryCommandSupported('mceImage'));

      if (!imageAvailable) {
        editor.notificationManager.open({
          text: 'Bild-Dialog nicht verfügbar – bitte das Plugin "image" im Profil aktivieren.',
          type: 'warning',
          timeout: 5000
        });
        return;
      }

      editor.execCommand('mceImage');
    }
  });

  /* TOOLTIP */
  editor.on('NodeChange', () => {
    const img = getSelectedImg(editor);
    if (!img) return;
    const config = configCache.get();
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
  tinymce.PluginManager.add('for_images', (editor: any, url: string) => {
      setup(editor, url);
      return {
          getMetadata: () => ({
              name: 'FriendsOfREDAXO Images',
              url: 'https://github.com/FriendsOfREDAXO/tinymce'
          })
      };
  });
};
