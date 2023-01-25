$docsView = !_ui_docs.
$playgroundView = _ui_playground: appParameter: $code.
$playgroundViewRef = reference: $playgroundView.
$fullTextEditorView = !_ui_full_text_editor.

$viewManager = viewBasedAppManager:
    [[$viewDefinitions];[
        ["Playground: REPL-Like"; uiShowVariable: playgroundViewRef];
        ["Playground: Multiple lines"; fullTextEditorView];
        ["Library documentation"; docsView]
    ]].
    
`Switch to REPL-like view if there is a code parameter`
!ifNot (void eq appParameter: $code) {
	($setCurrentViewIndex propOf viewManager): 0.
}.
    
$playgroundToolbarLayoutManager = !toolLayoutManager.
($setToolsAtLeft propOf playgroundToolbarLayoutManager):
	[do: $getTool propOf viewManager];
	[!separatorTool];
	[[$title; @italic uiContainer: "Playground / REPL tools:"];[$desktop; @(pxWidth 0) uiContainer: void]];
	[!buttonTool "Clear" -> {
		playgroundViewRef = !_ui_playground
	}].

$fullTextEditorToolbarLayoutManager = !toolLayoutManager.
($setToolsAtLeft propOf fullTextEditorToolbarLayoutManager):
	[do: $getTool propOf viewManager];
	[!separatorTool];
	[[$title; @italic uiContainer: "Multi-line editor tools:"];[$desktop; @(pxWidth 0) uiContainer: void]];
	["Preview as expression" popupTool {
		eval: uiGetText: fullTextEditorView
	}];
	[!buttonTool "Save" -> {
		!downloadText (uiGetText: fullTextEditorView) "playground.txt"
	}].

`Add a tool for changing views`
toolAtLeft: do: $getTool propOf viewManager.

`Show the UI`
!if (not: isIframe) {
	print: !uiGlobalToolbar.
	
	$standardDesktopToolbar = globalDesktopToolbar.
	$standardMobileToolbar = globalMobileToolbar.
	$standardMobileTools = getArray: registeredMobileTools.
	$setCorrectToolbar = !fun ($viewIndex) {
		globalDesktopToolbarRef = do: first: viewIndex switchEq
			[0; $getDesktopToolbarOverlay propOf playgroundToolbarLayoutManager];
			[1; $getDesktopToolbarOverlay propOf fullTextEditorToolbarLayoutManager];
			[2; {standardDesktopToolbar}].
			
		do: first: viewIndex switchEq
			[0; $applyMobileTools propOf playgroundToolbarLayoutManager];
			[1; $applyMobileTools propOf fullTextEditorToolbarLayoutManager];
			[2; {applyMobileTools: standardMobileTools}]
	}.
	
	`Experiment with different toolbars for different app perspectives`
	setCorrectToolbar: do: $getCurrentViewIndex propOf viewManager.
	($currentViewIndexRef propOf viewManager) listenVariable {
		setCorrectToolbar: x
	}.
}.
print: $mainView propOf viewManager.