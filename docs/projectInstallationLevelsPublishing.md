# Kalzit publishing and project levels
This document explains the idea behind the "kalzit publish ..." commands.

First of all, it is important to know that the currently available publish commands ("kalzit publish test" and "kalzit publish system") only affect your local system.
They do *not* actually make anything available to, say, people on the internet. Instead, they are meant to allow users to tinker with the Kalzit sources without having to fear that something could be messed up.
Also, they are meant to increase the security of your Kalzit installation by always requiring a password if someone wants to change core project files that affect everyone on your system.

# Kalzit project levels
Starting with this release, Kalzit project files can be put into different folders on your system. As an example, you can now have a "system" installation, which works for anyone using your computer; but you can have a "user" installation as well, if you need to add or tweak some files just for you and not for everyone.
To make this easier, the idea of "levels" was introduced to the project.

## The system level
The system level is used for global installations of Kalzit. It is meant to always contain a working and stable version of the Kalzit project.
By being put into a system folder (`/usr/local/lib/kalzit`), which is only writeable with root privileges, this folder can not easily be messed with. Anyone who tries will have to put in an administrator password at some point to get root access.

The system level folder is located at `/usr/local/lib/kalzit/systemRoot`

## The test / user level
For people who want to tinker with project files, there is the "user" level. As the name suggests, this is meant to be in user space - every user can have a distinct copy of the Kalzit files there, and they can do with them whatever they want. Changes in this level do not affect anything the other users are doing.

The system level folder is located at `~/.kalzit/testRoot`. If that folder does not exist, use `kalzit publish test` (without a folder name) to create it.

## The patch level
There is another level which can be useful when you are just trying to add something to Kalzit, rather than change something that exists already. This might be the case when you create an app or a library that you want to try.
Additional files like these can be put into any folder on the system, and they can be added to your "user level" folder with the Kalzit publish commands.

By the way, these levels exist to make tinkering possible without having to sacrifice stability. If you do not want to tinker, you usually do not need to worry about them in any case.
But if you want to contribute to Kalzit, try something, or (like me) are maintaining the project, these levels might help with that.

# Kalzit publishing
Now that we know what installation levels are for, we can attempt to modify them. The logic is usually like this:
* You put new files into a "patch" folder (can be anywhere)
* You add these patch files to your user level folder to make them work for your system account
* Once you have tested the changes and want to make them public, you can copy your user level folder to the system level

As you can see, there are two transitions here: patch to user level, and user level to system level.

## kalzit publish test
The `kalzit publish test` command is used test out a patch, which means adding a patched version of Kalzit to your user folder.
By running `kalzit publish test <folderName>`, you can merge a patch folder (`<folderName>`) with your system level folder, and the result will be put into your user level folder. Notice that you can not override system-level files this way - a system level file will always trump your patch file with the same name.

As an example for patching: If you have created an app, you could have a patch folder with the file `app/myApp/index.html` or something inside it. By publishing this to your user level folder (`kalzit publish test <parentFolderOfThat>`), you can make sure that the server finds that app at the mentioned path. You can also add libraries or any sort of file in a similar way.

## Modifying the user level
If you want to tinker without the patch thing, feel free to do that! It is by no means required to use the patching, you can do whatever you want with your user level installation.
To get to the user level folder, just type `kalzit get userRootFolder` into your terminal and follow the given path. If it is empty, use `kalzit publish test` (without a folder name), which will fill it with a copy of the Kalzit project.

## kalzit publish system
Okay, so we have established that you can basically have your user-specific version of Kalzit if you want to. But what if you figure that you need your changes on the system level?
Well, you can just publish your local user-level folder to the system level! You can use `sudo kalzit publish system` for that. Notice that this requires root privileges. So be careful if you really want to do that - all of your additions and changes could then affect all other users!

# Voluntary system-to-user adoption
What if something changed on the system level that you do not want as a user? Do you have to panic? Not really, because your user level installation is still in place. System changes to not change that one bit. So as long as you do not decide to adopt them (again, using `kalzit publish test`), you do not have to worry.

# TL;DR
* `./cli publish test` (without prior install) or `kalzit publish test` to create a user-specific Kalzit installation
* `kalzit publish test <patchFolder>` to apply a patch to it
* `sudo kalzit publish system` to make the user configuration available to everyone on the system