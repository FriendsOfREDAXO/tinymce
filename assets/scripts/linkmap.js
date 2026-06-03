var selectLink = function(filename, alt) {
    var linkurl = '/media/' + filename;
    opener.jQuery(window).trigger('rex:selectLink', [linkurl, filename]);
    self.close();
};
