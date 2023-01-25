This folder contains the most important dependencies of Kalzit.
These include NodeJS, Terser and UglifyCSS.

The dependencies can exist in two versions:
1. As symbolic links to system files. This is the "system_version" folder
2. As vendored dependencies, meaning the entire dependency is in the folder. This is (or will be) used for distributing a standalone package. Those dependencies are in the "package_version" folder

In this main folder, there are symlinks into one of these folders. These symlinks will be used by Kalzit. With this architecture, dependencies can easily be switched without changing other code.