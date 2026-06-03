// Called by REDAXO mediapool (replaces selectMedia); alt is part of the
// mediapool API signature and kept for compatibility.
var selectLink = function(filename, alt) {
    var linkurl = '/media/' + filename;
    opener.jQuery(window).trigger('rex:selectLink', [linkurl, filename]);
    self.close();
};
