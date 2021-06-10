# generate_mobile_toolbar_overlay
## argumentList

## comment

Generates a toolbar overlay with a standardized layout for mobile devices (usually smartphones).
This bar is only visible when the app window is soo small for desktop controls, otherwise it is hidden.

This toolbar is empty by default, except for two buttons on the right ("user" and "apps") and one on the left ("menu").

To add custom tools for an app, use "registerMobileTool".
That will not actually add a tool to the bar itself, but it will add an option that appears when the user taps the menu button.
For more information about adding desktop tools, see the documentation of "registerDesktopTool".

Please note that if you are making an app for mobile and desktop, you sould use "uiGlobalToolbar" instead of this function.
It takes care of adding all necessary UI elements to make the toolbar look nice.
