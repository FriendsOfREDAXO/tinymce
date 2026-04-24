/**
 * FriendsOfREDAXO - TinyMCE Plugin: for_abbr
 *
 * Fügt einen Toolbar-Button + Menüeintrag hinzu, mit dem sich Textstellen als
 * <abbr title="…"> auszeichnen lassen (Abkürzungen, Fremdwörter). Wichtig für
 * Screenreader und SEO — beim Hovern erscheint zusätzlich ein Tooltip.
 *
 * Features:
 *   - Button "for_abbr" + MenuItem "for_abbr" + ContextToolbar auf <abbr>
 *   - Dialog mit Langform (title) + Anzeigetext + optionalem xml:lang
 *   - Bestehende <abbr>-Elemente werden beim Öffnen automatisch erkannt und
 *     können bearbeitet oder entfernt werden (Remove-Button im Dialog)
 *   - Optionales Glossar via Editor-Option `for_abbr_glossary`:
 *        [{ term: 'HTML', title: 'Hypertext Markup Language', lang: 'en' }, …]
 *     Der Dialog schlägt einen passenden Titel vor, sobald der Anzeigetext
 *     einer Glossar-Term entspricht (case-insensitive).
 */
declare const tinymce: any;

const PLUGIN = "for_abbr";

interface GlossaryEntry {
  term?: string;
  title?: string;
  lang?: string;
}

const icon = (): string =>
  '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
  '<text x="12" y="15" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="600" fill="currentColor">abc.</text>' +
  '<line x1="5" y1="18" x2="19" y2="18" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 1.5" />' +
  "</svg>";

const findAbbr = (editor: any): HTMLElement | null => {
  const node = editor.selection.getNode();
  if (!node) {
    return null;
  }
  if (node.nodeName === "ABBR") {
    return node as HTMLElement;
  }
  return editor.dom.getParent(node, "abbr") as HTMLElement | null;
};

const findGlossaryMatch = (
  editor: any,
  text: string,
): GlossaryEntry | null => {
  if (!text) {
    return null;
  }
  const list = editor.getParam("for_abbr_glossary");
  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }
  const needle = String(text).trim().toLowerCase();
  if (!needle) {
    return null;
  }
  for (let i = 0; i < list.length; i++) {
    const entry = list[i] as GlossaryEntry;
    if (!entry || typeof entry !== "object") continue;
    const term = String(entry.term || "")
      .trim()
      .toLowerCase();
    if (term && term === needle) {
      return entry;
    }
  }
  return null;
};

const i18n = (editor: any, key: string, fallback: string): string => {
  try {
    const msg = editor.translate("for_abbr." + key);
    if (msg && msg !== "for_abbr." + key) return msg;
  } catch (e) {
    /* noop */
  }
  return fallback;
};

const openDialog = (editor: any): void => {
  const existing = findAbbr(editor);
  const selected = editor.selection.getContent({ format: "text" });
  const initialText = existing ? existing.textContent || "" : selected;
  let initialTitle = existing ? existing.getAttribute("title") || "" : "";
  let initialLang = existing
    ? existing.getAttribute("lang") || existing.getAttribute("xml:lang") || ""
    : "";

  // Wenn kein title vorhanden ist, aber der Text im Glossar steht → vorbefüllen
  if (!initialTitle) {
    const match = findGlossaryMatch(editor, initialText);
    if (match) {
      initialTitle = match.title || "";
      if (!initialLang && match.lang) {
        initialLang = match.lang;
      }
    }
  }

  const buttons: any[] = [
    { type: "cancel", name: "cancel", text: i18n(editor, "cancel", "Abbrechen") },
    {
      type: "submit",
      name: "save",
      text: i18n(editor, "save", "Speichern"),
      primary: true,
    },
  ];
  if (existing) {
    buttons.splice(1, 0, {
      type: "custom",
      name: "remove",
      text: i18n(editor, "remove", "Entfernen"),
    });
  }

  editor.windowManager.open({
    title: existing
      ? i18n(editor, "title_edit", "Abkürzung bearbeiten")
      : i18n(editor, "title_new", "Abkürzung einfügen"),
    size: "normal",
    body: {
      type: "panel",
      items: [
        {
          type: "input",
          name: "text",
          label: i18n(editor, "label_text", 'Anzeigetext (z. B. "HTML")'),
        },
        {
          type: "input",
          name: "titleAttr",
          label: i18n(
            editor,
            "label_title",
            "Langform / Erklärung (wird als title-Attribut gesetzt)",
          ),
        },
        {
          type: "input",
          name: "lang",
          label: i18n(
            editor,
            "label_lang",
            'Sprache (optional, z. B. "en" für Fremdwörter)',
          ),
        },
        {
          type: "htmlpanel",
          html:
            '<p class="tox-dialog__body-content" style="font-size:12px;color:#6a7280;margin:0;">' +
            i18n(
              editor,
              "help",
              "Das &lt;abbr&gt;-Element markiert Abkürzungen und Fremdwörter. " +
                "Screenreader können den title-Inhalt vorlesen, Browser zeigen ihn beim Hovern an. " +
                "Für Fremdwörter zusätzlich die Sprache setzen.",
            ) +
            "</p>",
        },
      ],
    },
    buttons: buttons,
    initialData: {
      text: initialText || "",
      titleAttr: initialTitle,
      lang: initialLang,
    },
    onAction: (dialog: any, details: { name: string }) => {
      if (details.name === "remove" && existing) {
        editor.undoManager.transact(() => {
          const parent = existing.parentNode;
          if (!parent) return;
          while (existing.firstChild) {
            parent.insertBefore(existing.firstChild, existing);
          }
          parent.removeChild(existing);
        });
        editor.nodeChanged();
        dialog.close();
      }
    },
    onSubmit: (dialog: any) => {
      const data = dialog.getData();
      const text = String(data.text || "").trim();
      const titleAttr = String(data.titleAttr || "").trim();
      const lang = String(data.lang || "").trim();

      if (!text || !titleAttr) {
        editor.windowManager.alert(
          i18n(
            editor,
            "err_required",
            "Anzeigetext und Langform sind Pflichtfelder.",
          ),
        );
        return;
      }

      editor.undoManager.transact(() => {
        const dom = editor.dom;
        if (existing) {
          dom.setAttrib(existing, "title", titleAttr);
          dom.setAttrib(existing, "lang", lang || null);
          if (
            existing.childNodes.length === 1 &&
            existing.firstChild &&
            existing.firstChild.nodeType === 3
          ) {
            (existing.firstChild as Text).nodeValue = text;
          } else if (text !== existing.textContent) {
            existing.innerHTML = dom.encode(text);
          }
          editor.selection.select(existing);
        } else {
          const attrs: Record<string, string> = { title: titleAttr };
          if (lang) attrs.lang = lang;
          const html = dom.createHTML("abbr", attrs, dom.encode(text));
          editor.insertContent(html);
        }
      });
      editor.nodeChanged();
      dialog.close();
    },
  });
};

const register = (editor: any): void => {
  editor.ui.registry.addIcon(PLUGIN, icon());

  editor.ui.registry.addToggleButton(PLUGIN, {
    icon: PLUGIN,
    tooltip: i18n(editor, "tooltip", "Abkürzung (abbr)"),
    onAction: () => openDialog(editor),
    onSetup: (api: any) => {
      const nodeChange = () => {
        api.setActive(!!findAbbr(editor));
      };
      editor.on("NodeChange", nodeChange);
      nodeChange();
      return () => editor.off("NodeChange", nodeChange);
    },
  });

  editor.ui.registry.addMenuItem(PLUGIN, {
    icon: PLUGIN,
    text: i18n(editor, "menu_text", "Abkürzung…"),
    onAction: () => openDialog(editor),
  });

  // Context-Toolbar: beim Fokus auf einem bestehenden <abbr> erscheint
  // ein Quick-Edit direkt am Element.
  editor.ui.registry.addContextToolbar(PLUGIN, {
    predicate: (node: Node) => node.nodeName === "ABBR",
    items: PLUGIN,
    position: "node",
    scope: "node",
  });

  // Tastaturkürzel: Ctrl/Cmd + Alt + A
  editor.addShortcut(
    "meta+alt+a",
    i18n(editor, "tooltip", "Abkürzung (abbr)"),
    () => openDialog(editor),
  );
};

const Plugin = (): void => {
  if (typeof tinymce !== "undefined" && tinymce && tinymce.PluginManager) {
    tinymce.PluginManager.add(PLUGIN, register);
  }
};

export default Plugin;
