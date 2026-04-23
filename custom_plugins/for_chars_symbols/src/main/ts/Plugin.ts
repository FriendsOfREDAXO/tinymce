/* eslint-disable */
declare const tinymce: any;

/**
 * for_chars_symbols – TinyMCE plugin (FriendsOfREDAXO)
 *
 * Runtime lives in assets/scripts/tinymce/plugins/for_chars_symbols/plugin.js
 * (plain IIFE). This TS wrapper is kept as a build entry point for parity
 * with other custom_plugins (for_video, for_oembed, ...). To rebuild from
 * this TS pipeline, port the IIFE body into this function.
 */
export default function Plugin(): void {
    if (typeof tinymce === 'undefined') { return; }
}
