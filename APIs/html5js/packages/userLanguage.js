/*
* A function that returns the current language of the user.
* The language has the format "BCP 47"
* Usage: (!getUserLanguage).
*/
this.getUserLanguage = function(){return navigator.language || navigator.userLanguage};