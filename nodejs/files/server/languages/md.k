print: "Trying to run Markdown app (on server): " + fname.
($startServing of _request): "text/html".

resultRef = {
	<html>
		<head>
			<link rel="stylesheet" href="/assets/stylesheets/html5/default/style.css">
			<link rel="stylesheet" href="/assets/stylesheets/html5/article.css">
		</head>
		<body>
} + (runCommand: 'markdown "' + fname + '"') + {
		</body>
	</html>
}.