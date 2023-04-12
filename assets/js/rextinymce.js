var selectLink = function(filename,alt) {    
    var event = opener.jQuery.Event("rex:selectLink");
    window.opener.document.getElementsByClassName("tox-textfield")[0].value = '/media/'+filename;
    self.close();
}
