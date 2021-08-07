//Idea from https://stackoverflow.com/questions/4594492/check-if-parent-window-is-iframe-or-not
this.isIframe = true == (window.frameElement && window.frameElement.nodeName == "IFRAME");