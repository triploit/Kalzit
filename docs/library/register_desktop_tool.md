# register_desktop_tool
## comment

This function is used to register a tool that will later be added to a desktop toolbar.
A tool is basically just a function that returns a UI element. This element is added to the toolbar.

It is not guaranteed when exactly the toolFactory function is called.
It might be before the toolbar is set up, during the setup process, or even after it is already visible.

A tool implementation might look like this:
registerDesktopTool: {@left {} uiButton "Button"}.

To get all registered desktop tools, use "registeredDesktopTools".
To get a toolbar overlay only for the desktop, use "generateDesktopOverlay".
To get a toolbar for both mobile and desktop, where the desktop one uses the registered tools, use "uiGlobalToolbar".