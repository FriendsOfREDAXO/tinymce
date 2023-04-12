var selectLink = function(filename,alt) {
    var event = opener.jQuery.Event("rex:selectLink");
    console.log($(window.opener).find('.tox-textfield[type=url]'));
    window.opener.document.getElementsByClassName("tox-textfield")[0].value = '/media/'+filename;
    self.close();
}
