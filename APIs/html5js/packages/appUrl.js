/* @kalzit.for app_url
* A variable that contains the URL of the currently open website.
* However, you should use "(!dynamicAppUrl)" instead, because the current URL can change
*/
this.app_url = window.location.href;
/* @kalzit_for dynamic_app_url
* A function that returns the URL of the currently open website / app.
*/
this.dynamic_app_url = function(){return window.location.href};
