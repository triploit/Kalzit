# Update your Kalzit installation
Currently, Kalzit updates are not automated.
There are many different starting points for updating, and maybe you only want do update certain parts of your installation.
This document exists to guide you through updating all the different parts of a Kalzit installation (dependencies, the Kalzit project itself, and apps or libraries).
By the way, when this document mentions "your computer" or something like that, this refers to the coputer with the Kalzit installation that we are updating.

Please read this guide before you actually follow it! It is important that you know what you need to do and why.

# Preparation
## Find your current installation
To update your Kalzit installation, you need to know where it is. Just type `kalzit get rootFolder` into a terminal and press enter. This should show you the path to your Kalzit installation.
Open this path in your file viewer of choice.

## Make a backup
You never know if you mess something up, so having a backup is a good idea.
Connect your computer to an external storage device (a USB stick or a network storage device, for example), and simply copy your entire Kalzit install to your external storage device.

Disconnect your external storage device before continuing! You do not want to accidentally mess with your backup, trust me.

# The actual update
## Download the update
Next, you need to obtain a new version of the Kalzit project. It does not matter if you download it as a ZIP file from GitHub, clone it with the `git` command or copy it from a USB drive you saved it to.

## Update the command-line interface
We can now apply the update. We begin by updating the command-line interface (or cli; the thing you use to do anything with Kalzit).
Navigate to the newly downloaded Kalzit folder and run this command from the terminal: `bash ./utilities/installer/parts/cli.sh`.
After that, the command-line interface is prepared and ready to be installed system-wide: `bash ./utilities/installer/parts/globalCli.sh`.

## Update and install dependencies
To install new dependencies of the Kalzit project, you can go to your terminal again (go either to the downloaded Kalzit folder or to `~/.kalzit/testRoot` - they should contain basically the same files now).
Then, run the following command: `bash ./utilities/installer/parts/dependencies.sh`.
To update existing dependencies, run this: `./cli dependencyUpdate`

## See if everything worked so far
To check if the base update worked, you can type `kalzit run blockingServer` and then open this URL in your web browser: http://localhost:5000/ .
You can also open the changelog file of the Kalzit version you updated to, like http://localhost:5000/docs/changelog/0.13.0.md or something. If you see that file, the update has probably worked.
If it did not work, try to redo the steps above or open an issue on GitHub to get help.

# Data restore
## Copy your user data
You can now open the following path in your file explorer: `~/.kalzit/testRoot`. This folder contains your new Kalzit installation.
In here, you will find a `nogit` folder. Replace that with your backed-up `nogit` folder from the "Make a backup"-step. So yes, you should now re-connect your external storage device.
If your file explorer asks you if you want to overwrite files, allow that.

## Copy your apps
If you do not see an app you had installed before on the home screen, you can search for it. This is also true for custom APIs.
The easiest way to search for a missing app or library is to use this command: `kalzit run automaticLinker ~`. The tilde sign `~` means that we want to search your user folder for apps and libraries - you can specify anything else instead.

# TL;DR
Download a Kalzit version, navigate your terminal to that folder.
Run `kalzit get rootFolder`, open that path and copy the contents to an external drive. Then eject the drive.

```
bash ./utilities/installer/parts/cli.sh
bash ./utilities/installer/parts/globalCli.sh
bash ./utilities/installer/parts/dependencies.sh
./cli dependencyUpdate
```

Copy the `nogit` folder from your backup into `~/.kalzit/testRoot`. If an app or library is missing, try `kalzit run automaticLinker ~`