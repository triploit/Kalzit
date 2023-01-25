function downloadUrl(url, title) { 
    // Trigger a download by creating an invisible "a" element and clicking it
    var linkElement = document.createElement("a");
    
    // Set link destination and title - and, most importantly, mark the link as a download link
    linkElement.setAttribute("href", url);
    linkElement.setAttribute("download", title || "download");
    
    //Just click the link - the browser does the rest
    linkElement.click();
} 

function strToDataUrl(text) {
    return 'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
}

function downloadText(text, title) {
    downloadUrl(strToDataUrl(text), title);
}

this.downloadUrl = downloadUrl;
this.downloadText = downloadText;
this.strToDataUrl = strToDataUrl;