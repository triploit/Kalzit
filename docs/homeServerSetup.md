# How to set up a Kalzit home server
Please do not copy the code snippets that follow right away - that could be dangerous. They are pretty straight-forward and somewhat short, so you should probably type them out yourself to be safe.
It is always good if you understand the commands you use, so make sure you do - many will be explained as we go.
You will notice that I put the text `<serverUser>` in many scripts. In these cases, please replace `<serverUser>` by the name of the user which you want to run the server.

## Install Kalzit
(Script in README.md)

## Optional: Migrate from a server that ran as root
If you had a previous server and ran it as root, make sure that your server user can access all the files in the Kalzit directory:
* Run `chown -R <serverUser> "$(kalzit get rootFolder)"` without root access to see all files that your server user can not access - that command tries to **ch**ange the **own**er of all files in the Kalzit folder and outputs those it could not change, which are usually files created by the root user.
* Run the same thing as root (with `sudo` in front of it) to give the user access to those files

## Make the Kalzit server run on startup
Modify the following scripts to make `<serverUser>` the Unix user you want to run the server (same as above). This should *not* be the root user!

* Open `/etc/rc.local` in your editor - that file contains commands that run when the system starts up.
* Add this server start command to said file: `sudo -u <serverUser> kalzit run server`.
	* Keep `exit 0` at the bottom of the file you edit (if that line exists there). Put the command directly above it.
	* Please only have one server start command in here, not multiple.

If you restart your system now, the server should automatically run! In case you want to stop it manually, log in as the `<serverUser>` and run `kalzit stop server`.