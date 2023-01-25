# safe_file_path
## argumentList
path
## comment

This function performs a few checks to try to prevent a file path from being misused.
Right now, the only thing it does is see if the path contains "../" - this can be used to go up a level in the folder hierarchy, possibly allowing someone to get to a place where they are not supposed to go.
Therefore, a path containing "../" is considered unsafe.

If a path is considered unsafe, void is returned (as there is no guaruanteed way to make it safe).
If a path is considered safe, the path itself is returned.

Plesae note that this function can never make entierely sure that a path is indeed safe.
Rather, it just detects cases that might be unsafe.
