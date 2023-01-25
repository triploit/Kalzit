echo "Minifying HTML stylesheets"
pwd

produceHtml () {
	echo '<style id="k-style_default">'
	bash ../../../utilities/cli/command/uglifycss.sh ./themes/default/*.css ./themes/light/*.css ./k-classes/*.css ./animations/*.css
	echo '</style><style id="k-style_dark" media="(prefers-color-scheme: dark)">'
	bash ../../../utilities/cli/command/uglifycss.sh ./themes/dark/*.css
	echo '</style><style id="k-style_highcontrast" media="(prefers-contrast: more)">'
	bash ../../../utilities/cli/command/uglifycss.sh ./themes/highcontrast/superhighcontrast/*.css
	echo '</style><style id="k-style_highcontrast_dark" media="(prefers-contrast: more) and (prefers-color-scheme: dark)">'
	bash ../../../utilities/cli/command/uglifycss.sh ./themes/highcontrast/superhighdark/*.css
	echo '</style>'
}

produceHtml > ./_min.html