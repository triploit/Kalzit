# Kalzit app UI / UX design guidelines

## General app structure
* Your app should show the default toolbar at the top (`uiGlobalToolbar`). Below that should be your main content
* Your main content area should never be completely empty. If it is empty, the user could think that the app has not loaded properly and act accordingly, making the experience worse.

## Blocking elements
* Your main content area should not usually be covered by anything (like a popup or banner). Elements which cover the main content are called blocking elements.
* Blocking elements which do not have a clear way of closing should never appear anywhere. Clear ways of closing include the back button, but only if the blocking element is a popup window that the user has triggered by consciously taking action to do so.
* For every blocking element there has to be a single, easy to access way to close it *without triggering any other action*. No more than one click or tap should be needed to do that. The only exception to this rule are features which are supposed to help reduce screen time. In that case, there has to be an obvious way to get rid of this behavior. For example, if an app tells you at the start that you have to log in to use it, it is acceptable if it closes or reloads when the user closes the login panel. In that case, the obvious way to get rid of the behavior would be to log in.
* One specific thing covered by the rule above are cookie banners which do not have an obvious way to close them without accepting any cookies.
* When the app starts, there should at most be two blocking elements that are visible right away: at most one popup and at most one banner. If you can avoid it in any way, do not show blocking elements without having the user trigger them.

## Page scrolling