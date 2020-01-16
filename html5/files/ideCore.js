try{
	GLang.useLazyFlags = false;
	var codeField;
	
	if(window.location.search.substr(1).split("package").length >= 2){
		//Before using GLang, initialize the package manager - with a custom package parameter if provided
		var specificPackage = new URL(location.href).searchParams.get("package");
		if(specificPackage){
			GLang.packageManager.initialize(specificPackage.split(";"));
		}
	}
	
	GLang.packageManager.loadPackageSync("/html5/files/idePackageHints.txt");
	var packageOverview = GLang.displayValue(GLang.eval("$_ide_marked_package='pm'. _ide_package_hint_ui: $_ide_marked_package"));
	GLang.defaultRuntimeEnvironment.setInnerVariable("_ide_insert", {value:function(env, args){
		var startPos = codeField.selectionStart, endPos = codeField.selectionEnd;
		var replacement = args[0].value;
		var varValue = GLang.defaultRuntimeEnvironment.resolveName(replacement).value;
		if(typeof(varValue) === "object"){
			if(varValue.argumentList){
				switch(varValue.argumentList.length){
					case 0: replacement = confirm("Make function call?") ? "(do:" + replacement + ")" : replacement; break;
					case 1: replacement = confirm("Make function call?") ? replacement + ":" : replacement; break;
				}
			}
		}
		codeField.value = codeField.value.substring(0, startPos) + " " + replacement + " " + codeField.value.substring(endPos, codeField.value.length);
		codeField.selectionStart = startPos + replacement.length + 2;
		return {value:0, display:"none"}
	}, display:"function"})
	document.getElementById("helperArea").appendChild(packageOverview);

	var inputHistory = [];

	function useHistory(historyIndex, inputElement){
    	inputElement.value = inputHistory[historyIndex];
		var tree = GLang.getTree(inputElement.value);
		if(tree.length === 1 && tree[0].category === "valueCall"){
			inputElement.value = "(" + inputElement.value + ")";
		}
		inputElement.selectionStart = 0;
		inputElement.selectionEnd = 0;
	}

	function makeInputField(){
		try{
			var historyIndex = inputHistory.length;
			var divElement = document.createElement("div");
			var inputClickCatcher = document.createElement("div");
			divElement.style.width="100%";
			var inputElement = document.createElement("input");
			codeField = inputElement;
			inputElement.type = "text";
			inputElement.style.width="100%";
			inputClickCatcher.style.width="90%";
			inputElement.addEventListener("keyup", function(event) {
	    		if (event.key === "Enter") {
	        		runZ(inputElement.value);
	    		} else if(event.key == "ArrowUp"){
	    			if(historyIndex >= 0){
	    				if(historyIndex > 0){
		    				historyIndex--;
		    			}
		    			if(inputHistory.length !== 0){
							useHistory(historyIndex, inputElement);
		    			}
	    			}
	    		} else if(event.key == "ArrowDown"){
	    			if(historyIndex < inputHistory.length){
	    				if(historyIndex < inputHistory.length - 1){
		    				historyIndex++;
		    			}
	    				useHistory(historyIndex, inputElement);
	    			}
	    		}
			});
			var runButton = document.createElement("a");
			runButton.classList.toggle("noselect");
			runButton.classList.toggle("runButton");
			runButton.onclick = function(){runZ(inputElement.value);};
			runButton.innerHTML = "=";
			runButton.style.width = "8%";
			
			function runZ(code){
				var playgroundDiv = document.createElement("div");
				playgroundDiv.setAttribute("id", "playground");
				divElement.appendChild(playgroundDiv);
				
				inputHistory.push(code);
				var result;
				try{
					result = GLang.eval(code);
					try{
						playgroundDiv.appendChild(GLang.displayValue(
							result || {value: 0, display:"none"}
						));
					}catch(e){
						GLang.error(e);
					}
				}catch(e){
					result = e;
					GLang.error(e);
					GLang.print("(Error report finished)");
				}
				
				inputElement.disabled=true;
				playgroundDiv.setAttribute("class", "closable");
				playgroundDiv.classList.toggle("closed");
				runButton.onclick=function(){
					playgroundDiv.classList.toggle("closed");
					if (playgroundDiv.style.maxHeight){
						playgroundDiv.style.maxHeight = null;
						runButton.innerHTML="+";
					} else {
						playgroundDiv.style.maxHeight = playgroundDiv.scrollHeight + "px";
						runButton.innerHTML="-"
					}
				};
				runButton.onclick();
				runButton.innerHTML="-";
				runButton.style.width="3%";
				runButton.classList.toggle("toggle");
				inputClickCatcher.style.width = "95%";
				
				inputClickCatcher.onclick = function(){
					codeField.value = inputElement.value;
				}
				
				playgroundDiv.removeAttribute("id");
				
				makeInputField();
			}
			
			inputClickCatcher.appendChild(inputElement);
			inputClickCatcher.style.border = 0;
			inputClickCatcher.id = "inputClickCatcher";
			divElement.appendChild(inputClickCatcher);
			divElement.appendChild(runButton);
			
			document.getElementById("uiArea").appendChild(divElement);
			
			inputElement.focus();
		}catch(err){
			GLang.error(err);
		}
	}
	makeInputField();
	
	function markerListener(){
		if (codeField.selectionStart !== undefined) {
			var startPos = codeField.selectionStart;
			var endPos = codeField.selectionEnd;
			if(startPos !== endPos){
				GLang.defaultRuntimeEnvironment.setInnerVariable("_ide_marked_package", GLang.stringValue(codeField.value.substring(startPos, endPos)), true);
			}
		}
		setTimeout(markerListener, 750);
	};
	
	markerListener();
}catch(err){
	GLang.error(err);
}