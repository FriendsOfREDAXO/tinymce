declare const tinymce: any;

const PLUGIN_NAME = "for_rootstrip";

const sanitizeTag = (value: unknown): string => {
  if (typeof value !== "string") {
    return "";
  }
  const trimmed = value.trim().toLowerCase();
  return /^[a-z][a-z0-9-]*$/.test(trimmed) ? trimmed : "";
};

const hasOnlyWhitespaceTextNodes = (nodes: NodeList): boolean => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (
      node.nodeType === 3 &&
      node.textContent &&
      node.textContent.trim() !== ""
    ) {
      return false;
    }
  }
  return true;
};

const parseBooleanOption = (
  value: unknown,
  fallbackValue: boolean,
): boolean => {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (
      normalized === "true" ||
      normalized === "1" ||
      normalized === "yes" ||
      normalized === "on"
    ) {
      return true;
    }
    if (
      normalized === "false" ||
      normalized === "0" ||
      normalized === "no" ||
      normalized === "off"
    ) {
      return false;
    }
  }
  return fallbackValue;
};

const unwrapSingleRoot = (html: string, tagName: string): string => {
  if (typeof html !== "string") {
    return html;
  }
  const trimmed = html.trim();
  if (trimmed === "") {
    return html;
  }
  const container = document.createElement("div");
  container.innerHTML = trimmed;
  if (
    container.childElementCount !== 1 ||
    !hasOnlyWhitespaceTextNodes(container.childNodes)
  ) {
    return html;
  }
  const root = container.firstElementChild;
  if (!root || root.tagName.toLowerCase() !== tagName) {
    return html;
  }
  return root.innerHTML;
};

const wrapWithRoot = (html: string, tagName: string): string => {
  if (typeof html !== "string") {
    return html;
  }
  const trimmed = html.trim();
  if (trimmed === "") {
    return html;
  }
  const container = document.createElement("div");
  container.innerHTML = trimmed;
  if (
    container.childElementCount === 1 &&
    hasOnlyWhitespaceTextNodes(container.childNodes) &&
    container.firstElementChild &&
    container.firstElementChild.tagName.toLowerCase() === tagName
  ) {
    return html;
  }
  return `<${tagName}>${html}</${tagName}>`;
};

const Plugin = (): void => {
  tinymce.PluginManager.add(PLUGIN_NAME, (editor: any) => {
    // Nur aktiv, wenn das Plugin explizit in der Profil-Plugins-Liste
    // eingetragen ist. TinyMCE lädt externe Plugins zwar global, aber die
    // Aktivierung darf nur pro Profil erfolgen.
    const pluginsRaw = editor.options.get("plugins");
    const pluginsList =
      typeof pluginsRaw === "string"
        ? pluginsRaw
        : Array.isArray(pluginsRaw)
          ? pluginsRaw.join(" ")
          : "";
    if (!new RegExp(`(^|[\\s,])${PLUGIN_NAME}([\\s,]|$)`).test(pluginsList)) {
      return;
    }

    const enabledOption = editor.options.get("for_rootstrip");
    const legacyEnabledOption = editor.getParam("for_rootstrip", null);
    const enabled = parseBooleanOption(
      enabledOption !== undefined ? enabledOption : legacyEnabledOption,
      true,
    );
    if (!enabled) {
      return;
    }

    const configuredRootTag = sanitizeTag(
      editor.options.get("forced_root_block") ||
        editor.getParam("forced_root_block", ""),
    );
    const rootTag = configuredRootTag || "div";

    editor.on("BeforeSetContent", (event: any) => {
      if (!event || typeof event.content !== "string") {
        return;
      }
      // Nur den initialen Editor-Inhalt wrappen. Paste-/insertContent-/
      // Selection-Inserts NICHT wrappen, sonst entsteht ungültiges
      // `<p><p>…</p><p>…</p></p>`, was der Browser in zusätzliche leere
      // `<p></p>` aufspaltet.
      if (event.selection || event.paste || event.set === false) {
        return;
      }
      event.content = wrapWithRoot(event.content, rootTag);
    });

    const stripWrapper = (event: any): void => {
      if (!event || typeof event.content !== "string") {
        return;
      }
      event.content = unwrapSingleRoot(event.content, rootTag);
    };

    editor.on("GetContent", stripWrapper);
    editor.on("SaveContent", stripWrapper);
  });
};

export default Plugin;
