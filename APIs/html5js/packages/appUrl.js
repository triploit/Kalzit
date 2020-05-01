/*
* A variable that contains the URL of the currently open website.
* However, you should use "(!dynamicAppUrl)" instead, because the current URL can change
*/
this.appUrl = window.location.href;
/*
* A function that returns the URL of the currently open website / app.
*/
this.dynamicAppUrl = function(){return window.location.href};