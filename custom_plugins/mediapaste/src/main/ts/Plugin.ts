declare const tinymce: any;
// tinyMediaUploadConfig is injected by profiles.js – works in backend & frontend
declare const tinyMediaUploadConfig: Partial<MediaUploadConfig> | undefined;
declare const tinyMediaUploadCapabilities: { allow_image_paste?: boolean } | undefined;
declare const rex: { tinyMediaUploadCapabilities?: { allow_image_paste?: boolean } } | undefined;

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

interface MediaCategory {
    id: number;
    name: string;
}

interface MediaUploadConfig {
    enabled: boolean;
    allow_image_paste: boolean;
    /** -1 = always show dialog, >=0 = upload directly to this category */
    default_category: number;
    upload_url: string;
    categories_url: string;
}

/* ================================================================== */
/*  Defaults (used when profiles.js config is absent)                 */
/* ================================================================== */

const defaultConfig: MediaUploadConfig = {
    enabled: true,
    allow_image_paste: false,
    default_category: -1,
    upload_url: 'index.php?rex-api-call=tinymce_media_upload',
    categories_url: 'index.php?rex-api-call=tinymce_media_categories',
};

/* ================================================================== */
/*  Category fetch (with cache)                                       */
/* ================================================================== */

let categoriesCache: MediaCategory[] | null = null;

async function fetchCategories(url: string): Promise<MediaCategory[]> {
    if (categoriesCache !== null) return categoriesCache;

    try {
        const resp = await fetch(url, { credentials: 'same-origin' });
        if (!resp.ok) return [];
        categoriesCache = (await resp.json()) as MediaCategory[];
        return categoriesCache;
    } catch {
        return [];
    }
}

/* ================================================================== */
/*  Helpers                                                           */
/* ================================================================== */

function getExtensionForMime(mimeType: string): string {
    const map: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/jpg':  'jpg',
        'image/png':  'png',
        'image/gif':  'gif',
        'image/webp': 'webp',
        'image/avif': 'avif',
        'image/svg+xml': 'svg',
    };
    return map[mimeType] ?? 'png';
}

function ensureFilenameMatchesMime(filename: string, mimeType: string): string {
    const expectedExt = getExtensionForMime(mimeType).toLowerCase();
    const trimmed = filename.trim();

    if (trimmed === '') {
        return '';
    }

    const dotPos = trimmed.lastIndexOf('.');
    if (dotPos <= 0 || dotPos === trimmed.length - 1) {
        return trimmed + '.' + expectedExt;
    }

    const base = trimmed.slice(0, dotPos);
    const ext = trimmed.slice(dotPos + 1).toLowerCase();

    if (ext === expectedExt) {
        return trimmed;
    }

    // Treat jpg/jpeg as equivalent.
    if ((ext === 'jpg' || ext === 'jpeg') && (expectedExt === 'jpg' || expectedExt === 'jpeg')) {
        return trimmed;
    }

    return base + '.' + expectedExt;
}

function extensionFromFilename(filename: string): string {
    const trimmed = filename.trim();
    const dotPos = trimmed.lastIndexOf('.');
    if (dotPos <= 0 || dotPos === trimmed.length - 1) {
        return '';
    }
    return trimmed.slice(dotPos + 1).toLowerCase();
}

function mimeFromExtension(extension: string): string | null {
    const map: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
    };

    return map[extension] ?? null;
}

async function convertImageBlob(blob: Blob, targetMime: string): Promise<Blob | null> {
    try {
        const image = await createImageBitmap(blob);
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext('2d');
        if (!context) {
            image.close();
            return null;
        }

        // JPEG has no alpha channel, so enforce white background.
        if (targetMime === 'image/jpeg') {
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        context.drawImage(image, 0, 0);
        image.close();

        return await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(
                (resultBlob) => resolve(resultBlob),
                targetMime,
                targetMime === 'image/jpeg' ? 0.92 : undefined
            );
        });
    } catch {
        return null;
    }
}

async function alignBlobToFilenameFormat(blob: Blob, filename: string): Promise<Blob> {
    // BMP is not a web-friendly upload target in most setups. Convert to PNG when possible.
    if (blob.type === 'image/bmp') {
        const convertedBmp = await convertImageBlob(blob, 'image/png');
        if (convertedBmp !== null) {
            return convertedBmp;
        }
    }

    const ext = extensionFromFilename(filename);
    const targetMime = mimeFromExtension(ext);

    if (targetMime === null) {
        return blob;
    }

    if (blob.type === targetMime) {
        return blob;
    }

    // Clipboard image copies often provide PNG blobs even when original source was JPG/WebP.
    // Convert PNG clipboard blobs back to the intended target mime inferred from filename.
    if (blob.type === 'image/png' && (targetMime === 'image/jpeg' || targetMime === 'image/webp')) {
        const converted = await convertImageBlob(blob, targetMime);
        if (converted !== null) {
            return converted;
        }
    }

    return blob;
}

/**
 * Try to extract the original filename from a pasted <img src="…">.
 * Strips query strings / fragments and decodes URI encoding.
 * Returns '' when nothing usable is found.
 */
function filenameFromHtml(html: string): string {
    const m = html.match(/src="([^"]+)"/);
    if (!m) return '';
    const clean = m[1].split('?')[0].split('#')[0];
    const last = clean.split('/').pop() ?? '';
    if (/\.[a-z]{2,5}$/i.test(last)) {
        try { return decodeURIComponent(last); } catch { return last; }
    }
    return '';
}

function getErrorMessage(err: unknown): string {
    if (typeof err === 'string' && err !== '') {
        return err;
    }

    if (typeof err === 'object' && err !== null) {
        const withMessage = err as { message?: unknown };
        if (typeof withMessage.message === 'string' && withMessage.message !== '') {
            return withMessage.message;
        }
    }

    return 'Upload fehlgeschlagen';
}

/* ================================================================== */
/*  TinyMCE category-picker dialog                                    */
/* ================================================================== */

function showCategoryDialog(editor: any, categories: MediaCategory[]): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        const items = categories.map((cat) => ({
            value: String(cat.id),
            text: cat.name,
        }));
        const defaultValue = items.length > 0 ? items[0].value : '0';

        editor.windowManager.open({
            title: 'Bild in Medienpool hochladen',
            size: 'normal',
            body: {
                type: 'panel',
                items: [
                    {
                        type: 'alertbanner',
                        level: 'info',
                        icon: 'image',
                        text: 'Bitte wähle die Medienkategorie für das hochzuladende Bild.',
                    },
                    {
                        type: 'selectbox',
                        name: 'category',
                        label: 'Medienkategorie',
                        items,
                    },
                ],
            },
            buttons: [
                { type: 'cancel', name: 'cancel', text: 'Abbrechen' },
                { type: 'submit', name: 'upload', text: 'Hochladen', primary: true },
            ],
            initialData: {
                category: defaultValue,
            },
            onSubmit: (api: any) => {
                const data = api.getData() as { category?: string };
                // Fallback to default when TinyMCE returns empty/undefined (happens on first
                // submit without touching the selectbox)
                const raw = (data.category !== undefined && data.category !== '')
                    ? data.category
                    : defaultValue;
                const parsed = parseInt(raw, 10);
                const categoryId = Number.isNaN(parsed) ? 0 : parsed;
                api.close();
                resolve(categoryId);
            },
            onCancel: () => {
                reject({ cancelled: true });
            },
        });
    });
}

/* ================================================================== */
/*  Low-level XHR upload (works with any Blob/File)                  */
/* ================================================================== */

function uploadFileToMediapool(
    file: Blob,
    filename: string,
    categoryId: number,
    uploadUrl: string,
    progress: (percent: number) => void
): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file, filename);
        formData.append('category_id', String(categoryId));

        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadUrl);
        xhr.withCredentials = true;

        xhr.upload.addEventListener('progress', (ev) => {
            if (ev.lengthComputable) {
                progress(Math.round((ev.loaded / ev.total) * 100));
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status < 200 || xhr.status >= 300) {
                reject('HTTP ' + xhr.status + ': Upload failed');
                return;
            }
            try {
                const json = JSON.parse(xhr.responseText) as { location?: string; error?: string };
                if (json.error) {
                    reject(json.error);
                } else if (json.location) {
                    resolve(json.location);
                } else {
                    reject('Invalid server response');
                }
            } catch {
                reject('Server response could not be parsed');
            }
        });

        xhr.addEventListener('error', () => reject('Network error during upload'));
        xhr.send(formData);
    });
}

/* ================================================================== */
/*  High-level: choose category (if needed), then upload              */
/* ================================================================== */

async function pickCategoryAndUpload(
    editor: any,
    file: Blob,
    filename: string,
    config: MediaUploadConfig,
    progress: (percent: number) => void
): Promise<string> {
    let categoryId = config.default_category;

    if (categoryId < 0) {
        const categories = await fetchCategories(config.categories_url);
        if (categories.length === 0) {
            categoryId = 0;
        } else if (categories.length === 1) {
            categoryId = categories[0].id;
        } else {
            categoryId = await showCategoryDialog(editor, categories);
        }
    }

    return uploadFileToMediapool(file, filename, categoryId, config.upload_url, progress);
}

/* ================================================================== */
/*  images_upload_handler – called by TinyMCE for drag-dropped files */
/* ================================================================== */

async function handleBlobUpload(
    editor: any,
    blobInfo: any,
    config: MediaUploadConfig,
    progress: (percent: number) => void
): Promise<string> {
    const blob = blobInfo.blob() as Blob;
    const ext = getExtensionForMime(blob.type);

    // Prefer the original File name (drag & drop passes a File object with .name)
    const fileName: string = (blob as File).name ?? '';
    const blobInfoName: string =
        typeof blobInfo.filename === 'function' ? (blobInfo.filename() as string) : '';

    const isTinyInternal = (name: string): boolean =>
        name === '' || /^(mceclip|blobid|imagetools)\d*(\.[a-z]{2,5})?$/i.test(name);

    let filename = '';
    if (!isTinyInternal(fileName) && /\.[a-z]{2,5}$/i.test(fileName)) {
        filename = fileName;
    } else if (!isTinyInternal(blobInfoName) && /\.[a-z]{2,5}$/i.test(blobInfoName)) {
        filename = blobInfoName;
    } else {
        filename = 'image-' + Date.now() + '.' + ext;
    }

    filename = ensureFilenameMatchesMime(filename, blob.type);

    return pickCategoryAndUpload(editor, blob, filename, config, progress);
}

/* ================================================================== */
/*  Plugin registration                                               */
/* ================================================================== */

const Plugin = (): void => {
    tinymce.PluginManager.add('mediapaste', (editor: any): void => {
        // Merge runtime config from profiles.js -> window fallback -> defaults
        const runtimeConfig: Partial<MediaUploadConfig> =
            (typeof tinyMediaUploadConfig !== 'undefined' ? tinyMediaUploadConfig : null)
            ?? ((window as any).tinyMediaUploadConfig ?? {});

        const runtimeCapabilities: { allow_image_paste?: boolean } =
            (typeof tinyMediaUploadCapabilities !== 'undefined' ? tinyMediaUploadCapabilities : null)
            ?? ((window as any).tinyMediaUploadCapabilities ?? (typeof rex !== 'undefined' ? (rex.tinyMediaUploadCapabilities ?? {}) : {}));

        const config: MediaUploadConfig = { ...defaultConfig, ...runtimeConfig };

        if (runtimeCapabilities.allow_image_paste === false) {
            config.allow_image_paste = false;
        }

        editor.options.register('mediapaste_default_category', {
            processor: 'number',
            default: 0,
        });

        editor.options.register('mediapaste_allow_image_paste', {
            processor: 'boolean',
            // Keep global runtime config as default unless a profile explicitly overrides it.
            default: config.allow_image_paste,
        });

        const profileCategoryOverride = Number(editor.options.get('mediapaste_default_category') ?? 0);
        if (!Number.isNaN(profileCategoryOverride) && profileCategoryOverride > 0) {
            config.default_category = profileCategoryOverride;
        }

        const profilePasteOverride = editor.options.get('mediapaste_allow_image_paste');
        if (typeof profilePasteOverride === 'boolean') {
            config.allow_image_paste = profilePasteOverride;
        }

        if (!config.allow_image_paste) {
            editor.options.set('paste_data_images', false);

            editor.on('paste', (e: any) => {
                const clipboardData: DataTransfer | null = e.clipboardData ?? null;
                if (!clipboardData) return;

                const items: DataTransferItem[] = Array.from(clipboardData.items ?? []);
                const hasImageItem = items.some(
                    (item) => item.kind === 'file' && item.type.startsWith('image/')
                );

                if (hasImageItem) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            });

            editor.on('PastePreProcess', (e: any) => {
                if (typeof e.content !== 'string') {
                    return;
                }

                e.content = e.content.replace(/<img\b[^>]*>/gi, '');
            });

            return;
        }

        if (!config.enabled) return;

        // Prefetch categories in the background so the dialog opens instantly
        void fetchCategories(config.categories_url);

        // Only install if the profile hasn't defined a custom upload handler
        const existingHandler = editor.options.get('images_upload_handler');
        if (existingHandler) return;

        // Allow pasting & dropping images into the editor
        editor.options.set('paste_data_images', true);
        editor.options.set('automatic_uploads', true);
        // Extend TinyMCE's default images_file_types with SVG, AVIF & modern formats
        // (default does not include svg, so drag-dropped SVGs would be silently rejected)
        editor.options.set(
            'images_file_types',
            'jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp,avif,svg'
        );

        // Handle drag-dropped image files via TinyMCE's standard blob flow
        editor.options.set(
            'images_upload_handler',
            (blobInfo: any, progress: (n: number) => void): Promise<string> => {
                return handleBlobUpload(editor, blobInfo, config, progress).catch((err: unknown) => {
                    const isCancelled =
                        typeof err === 'object' &&
                        err !== null &&
                        (err as { cancelled?: boolean }).cancelled;
                    if (isCancelled) throw { message: 'Upload cancelled', remove: true };
                    throw err;
                });
            }
        );

        // ---------------------------------------------------------------
        // Clipboard paste handler – "Copy Image" from websites
        //
        // CRITICAL: e.preventDefault() MUST be called SYNCHRONOUSLY.
        // Calling it inside an async getAsString() callback is too late –
        // TinyMCE has already processed the paste event by then.
        // ---------------------------------------------------------------
        editor.on('paste', (e: any) => {
            const clipboardData: DataTransfer | null = e.clipboardData ?? null;
            if (!clipboardData) return;

            const items: DataTransferItem[] = Array.from(clipboardData.items ?? []);

            // Only intercept when clipboard has binary image data
            const imageItem = items.find(
                (item) => item.kind === 'file' && item.type.startsWith('image/')
            );
            if (!imageItem) return;

            const file = imageItem.getAsFile();
            if (!file) return;

            // Block TinyMCE from inserting the external URL – MUST be synchronous
            e.preventDefault();
            e.stopImmediatePropagation();

            const ext = getExtensionForMime(file.type);

            const doUpload = (suggestedFilename: string): void => {
                const rawFilename = suggestedFilename !== ''
                    ? suggestedFilename
                    : 'image-' + Date.now() + '.' + ext;

                void (async () => {
                    const uploadBlob = await alignBlobToFilenameFormat(file, rawFilename);
                    const filename = ensureFilenameMatchesMime(rawFilename, uploadBlob.type || file.type);

                    return pickCategoryAndUpload(editor, uploadBlob, filename, config, () => {});
                })()
                    .then((url: string) => {
                        editor.focus();
                        editor.insertContent('<img src="' + url + '" alt="" />');
                    })
                    .catch((err: unknown) => {
                        const isCancelled =
                            typeof err === 'object' &&
                            err !== null &&
                            (err as { cancelled?: boolean }).cancelled;

                        if (isCancelled) {
                            editor.notificationManager.open({
                                text: 'Upload abgebrochen',
                                type: 'info',
                                timeout: 2000,
                            });
                            return;
                        }

                        const message = getErrorMessage(err);
                        editor.notificationManager.open({
                            text: 'Bild-Upload fehlgeschlagen: ' + message,
                            type: 'error',
                            timeout: 6000,
                        });

                        console.error('[mediapaste] Upload error:', err);
                    });
            };

            // Try to get the original filename from the <img src="…"> in pasted HTML
            const htmlItem = items.find(
                (item) => item.kind === 'string' && item.type === 'text/html'
            );

            if (htmlItem) {
                htmlItem.getAsString((html: string) => {
                    doUpload(filenameFromHtml(html));
                });
            } else {
                doUpload('');
            }
        });
    });
};

export default Plugin;
