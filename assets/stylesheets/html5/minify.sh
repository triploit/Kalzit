echo "Minifying HTML stylesheets"

cat ./light/*.css > ./_darklight.css
echo "@media (prefers-color-scheme: dark) {" >> ./_darklight.css
cat ./dark/*.css >> ./_darklight.css
echo "}" >> ./_darklight.css

uglifycss ./_darklight.css ./default/*.css ./klasses/*.css --output _min.css

rm ./_darklight.css