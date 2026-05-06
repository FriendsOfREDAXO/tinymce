declare const tinymce: any;
// tinyCleanPasteConfig is a global const injected by the generated profiles.js
// It works both in the backend and frontend. Falls back to empty object if not present.
declare const tinyCleanPasteConfig: Partial<CleanPasteConfig> | undefined;

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

interface CleanPasteConfig {
    strip_ms_office: boolean;
    strip_google_docs: boolean;
    remove_styles: boolean;
    preserve_styles: string[];        // css property names or "regex:..." patterns
    remove_classes: boolean;
    preserve_classes: string[];       // exact class names or "regex:..." patterns
    remove_ids: boolean;
    remove_data_attrs: boolean;
    max_br: number;                   // 0 = no limit
    max_empty_paragraphs: number;     // 0 = no limit
    allowed_tags: string[];           // empty array = allow all tags
}

/* ================================================================== */
/*  Default configuration (fallback if window.tinyCleanPasteConfig    */
/*  is not set)                                                        */
/* ================================================================== */

const defaultConfig: CleanPasteConfig = {
    strip_ms_office: true,
    strip_google_docs: true,
    remove_styles: true,
    preserve_styles: [],
    remove_classes: true,
    preserve_classes: [],
    remove_ids: true,
    remove_data_attrs: true,
    max_br: 2,
    max_empty_paragraphs: 2,
    allowed_tags: [],
};

/* ================================================================== */
/*  Helper: pattern matching (exact or regex:...)                     */
/* ================================================================== */

function matchesPattern(value: string, patterns: string[]): boolean {
    for (const pattern of patterns) {
        if (pattern.trim() === '') {
            continue;
        }
        if (pattern.startsWith('regex:')) {
            try {
                const re = new RegExp(pattern.slice(6), 'i');
                if (re.test(value)) {
                    return true;
                }
            } catch {
                // invalid regex – skip silently
            }
        } else {
            if (value.trim() === pattern.trim()) {
                return true;
            }
        }
    }
    return false;
}

/* ================================================================== */
/*  Hard-coded protections for FOR-plugin markup                       */
/* ------------------------------------------------------------------- */
/*  The FOR-plugins (for_oembed, for_video, for_images, for_checklist, */
/*  for_toc, for_footnotes, …) transform pasted content inside their   */
/*  own PastePreProcess handlers – they emit <figure class="for-…">    */
/*  with data-for-…="…" attributes. cleanpaste must NEVER strip those, */
/*  otherwise the preview inside the editor breaks immediately.        */
/*                                                                     */
/*  We also protect the CKE5-style <figure class="media"> wrapper and  */
/*  <oembed url> which for_oembed uses as save-format.                 */
/* ================================================================== */

/** Class name is produced by a FOR-plugin (always preserve). */
function isProtectedClass(cls: string): boolean {
    return /^for-/.test(cls) || cls === 'media';
}

/** Attribute belongs to a FOR-plugin's internal state (always preserve). */
function isProtectedDataAttr(name: string): boolean {
    return /^data-for-/.test(name) || name === 'data-mce-selected';
}

/** CSS property controls text alignment or writing direction (always preserve). */
function isProtectedStyleProp(prop: string): boolean {
    return prop === 'text-align' || prop === 'direction';
}

/* ================================================================== */
/*  MS Office string-level cleanup                                     */
/* ================================================================== */

function stripMsOfficeMarkup(html: string): string {
    // Remove conditional comments: <!--[if ...]>...</[endif]-->
    html = html.replace(/<!--\[if[^\]]*\]>[\s\S]*?<!\[endif\]-->/gi, '');
    // Remove Office XML namespace tags (<o:p>, <w:sdtPr>, etc.)
    html = html.replace(/<\/?[a-z]:[^>]*>/gi, '');
    // Remove XML blocks
    html = html.replace(/<xml>[\s\S]*?<\/xml>/gi, '');
    // Remove CDATA sections
    html = html.replace(/<!\[CDATA\[[\s\S]*?\]\]>/gi, '');
    // Remove leftover Office comments
    html = html.replace(/<!--.*?-->/gs, '');
    return html;
}

/* ================================================================== */
/*  Google Docs string-level cleanup                                   */
/* ================================================================== */

function stripGoogleDocsMarkup(html: string): string {
    html = html.replace(/<!--StartFragment-->/gi, '');
    html = html.replace(/<!--EndFragment-->/gi, '');
    // Remove the Google Docs wrapper span with b-* ids
    html = html.replace(/\s+id="docs-internal-guid-[^"]*"/gi, '');
    return html;
}

/** Element is / sits inside a FOR-plugin figure – leave it completely alone. */
function isInsideProtectedFigure(el: Element): boolean {
    let cur: Element | null = el;
    while (cur && cur.nodeType === 1) {
        if (cur.tagName && cur.tagName.toLowerCase() === 'figure') {
            const cls = cur.getAttribute('class') || '';
            if (/\bfor-[\w-]+\b/.test(cls) || /\bmedia\b/.test(cls)) {
                return true;
            }
        }
        // oembed tag itself (save-format)
        if (cur.tagName && cur.tagName.toLowerCase() === 'oembed') {
            return true;
        }
        cur = cur.parentElement;
    }
    return false;
}

/* ================================================================== */
/*  DOM-level element cleanup (recursive)                             */
/* ================================================================== */

function cleanElement(el: Element, config: CleanPasteConfig, doc: Document): void {
    // Never touch elements inside a FOR-plugin figure (oEmbed, video, images,
    // checklist, toc, …). Those carry data-for-* / class="for-…" markup that
    // the plugin needs intact for its live preview.
    if (isInsideProtectedFigure(el)) {
        return;
    }

    // Process children first so we can safely replace the element itself
    const children = Array.from(el.children);
    for (const child of children) {
        cleanElement(child, config, doc);
    }

    const tagName = el.tagName.toLowerCase();

    // ---- Allowed-tags filter (unwrap disallowed tags) ----
    if (config.allowed_tags.length > 0) {
        const isAllowed = config.allowed_tags.some((t) => t.toLowerCase() === tagName);
        if (!isAllowed) {
            const fragment = doc.createDocumentFragment();
            while (el.firstChild) {
                fragment.appendChild(el.firstChild);
            }
            el.parentNode?.replaceChild(fragment, el);
            return; // element is gone
        }
    }

    // ---- id attribute ----
    if (config.remove_ids) {
        el.removeAttribute('id');
    }

    // ---- data-* attributes ----
    if (config.remove_data_attrs) {
        const dataAttrs = Array.from(el.attributes)
            .map((a) => a.name)
            .filter((n) => n.startsWith('data-') && !isProtectedDataAttr(n));
        for (const attr of dataAttrs) {
            el.removeAttribute(attr);
        }
    }

    // ---- style attribute ----
    if (el.hasAttribute('style')) {
        const styleStr = el.getAttribute('style') ?? '';
        let kept: string[] = [];

        if (config.remove_styles) {
            // Keep only explicitly preserved properties AND always-protected ones
            // (text-align / direction must never be stripped: they store alignment
            //  applied via the TinyMCE toolbar and are fundamental content semantics)
            kept = styleStr
                .split(';')
                .map((s) => s.trim())
                .filter(Boolean)
                .filter((part) => {
                    const colonIdx = part.indexOf(':');
                    const prop = colonIdx >= 0 ? part.slice(0, colonIdx).trim() : part;
                    return isProtectedStyleProp(prop.toLowerCase()) || matchesPattern(prop, config.preserve_styles);
                });
        } else {
            // Remove at least mso-* properties when strip_ms_office is active
            kept = styleStr
                .split(';')
                .map((s) => s.trim())
                .filter(Boolean);
        }

        // Always strip mso-* and tab-count style properties when stripping Office
        if (config.strip_ms_office) {
            kept = kept.filter((part) => {
                const colonIdx = part.indexOf(':');
                const prop = colonIdx >= 0 ? part.slice(0, colonIdx).trim().toLowerCase() : part.toLowerCase();
                return !prop.startsWith('mso-') && prop !== 'tab-stop-num' && prop !== '-webkit-tap-highlight-color';
            });
        }

        if (kept.length > 0) {
            el.setAttribute('style', kept.join('; '));
        } else {
            el.removeAttribute('style');
        }
    }

    // ---- class attribute ----
    if (config.remove_classes && el.hasAttribute('class')) {
        const classStr = el.getAttribute('class') ?? '';
        const classes = classStr.split(/\s+/).filter(Boolean);
        const kept = classes.filter((cls) => isProtectedClass(cls) || matchesPattern(cls, config.preserve_classes));
        if (kept.length > 0) {
            el.setAttribute('class', kept.join(' '));
        } else {
            el.removeAttribute('class');
        }
    }

    // ---- Strip lang/xml:lang added by Office (not on <html>) ----
    if (config.strip_ms_office && tagName !== 'html') {
        el.removeAttribute('lang');
        el.removeAttribute('xml:lang');
    }
}

/* ================================================================== */
/*  BR / empty-paragraph reduction (string-level, post-DOM)           */
/* ================================================================== */

function reduceWhitespace(html: string, config: CleanPasteConfig): string {
    // Reduce consecutive <br> tags
    if (config.max_br > 0) {
        const brGroup = `(?:<br\\s*/?>\\s*){${config.max_br + 1},}`;
        const brReplacement = '<br>'.repeat(config.max_br);
        html = html.replace(new RegExp(brGroup, 'gi'), brReplacement);
    }

    // Reduce consecutive empty <p> / <p>&nbsp;</p> blocks
    if (config.max_empty_paragraphs > 0) {
        const emptyP = `(?:<p[^>]*>\\s*(?:<br\\s*/?>|&nbsp;)*\\s*<\\/p>\\s*){${config.max_empty_paragraphs + 1},}`;
        const emptyPReplacement = ('<p>&nbsp;</p>\n').repeat(config.max_empty_paragraphs);
        html = html.replace(new RegExp(emptyP, 'gi'), emptyPReplacement);
    }

    // Collapse multiple consecutive whitespace-only text nodes / newlines in markup
    html = html.replace(/(\r\n|\r|\n){3,}/g, '\n\n');

    return html;
}

/* ================================================================== */
/*  Main cleaning function                                             */
/* ================================================================== */

function cleanPastedHtml(html: string, config: CleanPasteConfig): string {
    // 1. String-level Office / Google cleanup
    if (config.strip_ms_office) {
        html = stripMsOfficeMarkup(html);
    }
    if (config.strip_google_docs) {
        html = stripGoogleDocsMarkup(html);
    }

    // 2. DOM-level cleanup
    const parser = new DOMParser();
    const doc = parser.parseFromString('<body>' + html + '</body>', 'text/html');
    const body = doc.body;

    cleanElement(body, config, doc);

    html = body.innerHTML;

    // 3. Post-DOM whitespace reduction
    html = reduceWhitespace(html, config);

    return html;
}

/* ================================================================== */
/*  Style-Set / style_formats class auto-collection                    */
/* ------------------------------------------------------------------- */
/*  Reads the active TinyMCE style_formats (provided by                */
/*  `Provider\Assets::provideBaseAssets()` as `window.rex             */
/*  .tinyGlobalOptions.style_formats`) and returns a flat list of      */
/*  every class name referenced by any format. These classes are       */
/*  added to `preserve_classes` so editors can paste content that      */
/*  uses the project's own style-set classes without losing them.      */
/* ================================================================== */

interface StyleFormat {
    classes?: string | string[];
    items?: StyleFormat[];
    [k: string]: unknown;
}

function collectStyleSetClasses(): string[] {
    const collected = new Set<string>();
    const w = window as unknown as { rex?: { tinyGlobalOptions?: { style_formats?: unknown } } };
    const raw = w.rex?.tinyGlobalOptions?.style_formats;
    if (!Array.isArray(raw)) return [];

    const visit = (node: unknown): void => {
        if (!node || typeof node !== 'object') return;
        const fmt = (node as { format?: StyleFormat }).format ?? (node as StyleFormat);
        if (!fmt) return;

        const classes = fmt.classes;
        if (typeof classes === 'string') {
            classes.split(/\s+/).filter(Boolean).forEach((c) => collected.add(c));
        } else if (Array.isArray(classes)) {
            classes.forEach((c) => {
                if (typeof c === 'string') collected.add(c);
            });
        }

        const items = fmt.items;
        if (Array.isArray(items)) {
            items.forEach(visit);
        }
        // Some entries embed nested formats under .format.items
        const nestedItems = (node as { items?: unknown }).items;
        if (Array.isArray(nestedItems)) {
            nestedItems.forEach(visit);
        }
    };

    raw.forEach(visit);
    return Array.from(collected);
}

/* ================================================================== */
/*  Plugin registration                                                */
/* ================================================================== */

const Plugin = (): void => {
    tinymce.PluginManager.add('cleanpaste', (editor: any): void => {
        // tinyCleanPasteConfig is injected by profiles.js (works backend + frontend)
        // window.tinyCleanPasteConfig is kept as a secondary fallback for custom integrations
        const runtimeConfig: Partial<CleanPasteConfig> =
            (typeof tinyCleanPasteConfig !== 'undefined' ? tinyCleanPasteConfig : null)
            ?? ((window as any).tinyCleanPasteConfig ?? {});

        const config: CleanPasteConfig = {
            ...defaultConfig,
            ...runtimeConfig,
        };

        // Auto-preserve classes coming from active Style-Sets (style_formats)
        // so editors can paste their own styled content without losing classes.
        const styleSetClasses = collectStyleSetClasses();
        if (styleSetClasses.length > 0) {
            const merged = new Set<string>([...config.preserve_classes, ...styleSetClasses]);
            config.preserve_classes = Array.from(merged);
        }

        editor.on('PastePreProcess', (e: { content: string; internal?: boolean }) => {
            // Skip cleanup for internal pastes (cut/copy/paste inside the same editor).
            // Otherwise styles applied via Style-Sets or content inserted via the
            // snippets plugin would lose their classes/styles when the user copies
            // and re-pastes them inside the editor.
            if (e.internal) {
                return;
            }
            if (e.content) {
                e.content = cleanPastedHtml(e.content, config);
            }
        });
    });
};

export default Plugin;
