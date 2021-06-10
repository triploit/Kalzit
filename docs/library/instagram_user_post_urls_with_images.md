# instagram_user_post_urls_with_images
## argumentList
userName
## comment

Returns pairs of "normal" Instagram links (https://www.instagram.com/p/...) and direct links to the image files.
The first parameter needs to be an instagram user name.

Example usage:
$pair = first: instagramUserPostUrlsWithImages: "anyUserName".
$normalLink = first of pair.
$rawImageUrl = second of pair.
