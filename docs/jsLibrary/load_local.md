## comment

A function that is used to load data from the same server your app is hosted on. The preferred way to do this is by using relative URLs

Usage example (Kalzit):
`$resolvedContent = loadLocal: "/local/resource".`

If you want to use absolute URLs, consider using "loadGlobal".