/* @kalzit.for is_ios_app
A boolean value that indicates if the app is running as a standalone iOS web app.
If it is, the value is true (1), otherwise it is false (0).
*/
this.is_ios_app = (window.navigator.standalone == true);

/* @kalzit.for is_android_app
A boolean value that indicates if the app is running as a standalone Android web app.
If it is, the value is true (1), otherwise it is false (0).
*/
this.is_android_app = (window.matchMedia('(display-mode: standalone)').matches);
