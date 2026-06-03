// Wird vom REDAXO-Mediapool aufgerufen (Pendant zu selectMedia); `alt`
// gehoert zur Mediapool-API-Signatur und bleibt aus Kompatibilitaetsgruenden
// erhalten. Das eigentliche Setzen der URL passiert ueber den
// `rex:selectLink`-Event-Listener in base.js (tinyMce-link-Callback).
var selectLink = function(filename, alt) {
    var linkurl = '/media/' + filename;
    opener.jQuery(window).trigger('rex:selectLink', [linkurl, filename]);
    self.close();
};
