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

/* ================================================================== */
/*  DOM-level element cleanup (recursive)                             */
/* ================================================================== */

function cleanElement(el: Element, config: CleanPasteConfig, doc: Document): void {
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
            .filter((n) => n.startsWith('data-'));
        for (const attr of dataAttrs) {
            el.removeAttribute(attr);
        }
    }

    // ---- style attribute ----
    if (el.hasAttribute('style')) {
        const styleStr = el.getAttribute('style') ?? '';
        let kept: string[] = [];

        if (config.remove_styles) {
            // Keep only explicitly preserved properties
            kept = styleStr
                .split(';')
                .map((s) => s.trim())
                .filter(Boolean)
                .filter((part) => {
                    const colonIdx = part.indexOf(':');
                    const prop = colonIdx >= 0 ? part.slice(0, colonIdx).trim() : part;
                    return matchesPattern(prop, config.preserve_styles);
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
        const kept = classes.filter((cls) => matchesPattern(cls, config.preserve_classes));
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

        editor.on('PastePreProcess', (e: { content: string }) => {
            if (e.content) {
                e.content = cleanPastedHtml(e.content, config);
            }
        });
    });
};

export default Plugin;
