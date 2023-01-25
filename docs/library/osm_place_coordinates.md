# osm_place_coordinates
## argumentList
_place
## comment

Returns the location (a 2-item list with two numbers, describing the latitude and longitude) of an OpenStreetMap place.
A place can be obtained from "osmSearchPlaces".

Usage example:
$coordinates = osmPlaceCoordinates: first: osmSearchPlaces: "search term"
