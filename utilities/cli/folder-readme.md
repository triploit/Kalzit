# ./utilities/cli
## Purpose of this folder
This folder contains every feature of the command-line interface (`./cli` or `kalzit` globally).
The `./cli` command directly depends on the structure of this folder:
* When it is called with one argument (`<arg1>`), it looks for a `<arg1>.sh` file inside of this folder and runs it.
* When it is called with more than one arguments, it looks for a `<arg1>/<arg2>.sh` files and runs that - all additional arguments are passed on to that script.

This means that, if you want to add a new utility, you can simply add a shell script to this folder. It also means that the structure of this folder should never be changed without changing the `./cli` command as well.