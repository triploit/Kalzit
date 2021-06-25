# API creation tips
Here are some things you should do to make your API as useful as possible:
* Update your `platform-packages.json` file when you add or remove features
* Place all the code files inside the `packages` folder

# About the platform-packages.json file
This file is supposed to list all the publicly available functions (or any other variable) your API provides.
Essentially, if you have a file inside `packages` which defines a variable, you should add that file and that variable to platform-packages.json.

Say you have this code inside of `packages/myFancyCode.txt`:
```
$aFunNumber = 8.
```

To make sure that any app can access the `aFunNumber` variable, you should add this line to your platform-packages.json file:
```
{"provides": ["a_fun_number"], "scriptUrl": "myFancyCode.txt"}
```

Place that inside of the `libraries` array - the end result might look something like this:
```
{
	"info":{
		"description":"A fancy new API for the Kalzit programming language"
	},
	"libraries":[
		{"provides": ["a_fun_number"], "scriptUrl": "myFancyCode.txt"}
	]
}
```

That should do the trick! Now you can run "./cli build core" to make sure that the API will be correctly used whenever you build an app - you should run that every time you update the API, so the changes actually have an effect.