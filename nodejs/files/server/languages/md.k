print: "Trying to run Markdown app (on server): " + fname.
($startServing of _request): "text/html".

$markdownPart = runCommand: 'markdown "' + fname + '"'.

resultRef = {
	<html>
		<head>
			<title>
				} + (fileName: fname) + " - Kalzit Docs" + {
			</title>
			<link rel="stylesheet" href="/assets/stylesheets/html5/_min.css">
			<link rel="stylesheet" href="/assets/stylesheets/html5/article.css">
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