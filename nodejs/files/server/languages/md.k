print: "Trying to run Markdown app (on server): " + fname.
asyncRef = true.

!runCommandAsync ('markdown "' + fname + '"') -> {
	$markdownPart = x.
	
	($startServing propOf _request): "text/html".
	($write propOf _request): {
		<html>
			<head>
				<title>
					} + (fileName: fname) + " - Kalzit Docs" + {
				</title>
				<style>} + (fileContent: "assets/stylesheets/html5/_min.css") + {</style>
				<style>} + (fileContent: "assets/stylesheets/html5/article.css") + {</style>
			</head>
			<body class="calcitExtremeBackground">
	} + markdownPart + (!ifElse ("lang-kalzit" strContains markdownPart) {
			`Include the button insertion script`
			'<script src="/assets/scripts/goToPlaygroundButtonInsert.js"></script>'
		};{
			`Do not include the script`
			""
		}) + {
			</body>
		</html>
	}.
	do: ($endServing propOf _request)
}.