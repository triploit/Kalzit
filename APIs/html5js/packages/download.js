//Idea from https://www.geeksforgeeks.org/how-to-trigger-a-file-download-when-clicking-an-html-button-or-javascript/
function downloadUrl(url, title) { 
  
    //creating an invisible element 
    var element = document.createElement('a'); 
    element.setAttribute('href',  url); 
    element.setAttribute('download', title || "download");
  
    // Above code is equivalent to 
    // <a href="path of file" download="file name"> 
  
    document.body.appendChild(element); 
  
    //onClick property 
    element.click(); 
  
    document.body.removeChild(element); 
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