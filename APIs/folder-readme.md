# ./APIs
## Purpose of this folder
This folder contains all the APIs which you can use to write code in the Kalzit programming language.
Basically, everything that is not a core language feature (should be parts of the syntax or core operators) can be found in here.
The APIs folder is made up of many different APIs, each of which have a very similar structure.

If we take a look at the `sort` folder, for example, we can see that it contains a `platform-packages.json` file and a `packages` folder. These two are the main components of all APIs.
* The `packages` folder contains all of the code files (can be written in Kalzit or JavaScript) of this API. Here you can define your variables, which will be usable from anywhere later.
* The `platform-packages.json` file contains a bit of information about the API. This includes a short description and, most importantly, a list of all the code files. This list connects the code files to the variables they define, so that we can then figure out which code file to include whenever a certain variable is needed.

In order to get an idea on how the `platform-packages.json` file is structures, you should probably simply look at one - it is really not that difficult.