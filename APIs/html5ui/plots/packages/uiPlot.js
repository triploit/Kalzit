function makeCanvas(){
	var canvas = document.createElement("canvas");
	
	//Use playground width
	canvas.width = document.getElementById('playground').offsetWidth || 500;
	canvas.height = 500;
	
	return canvas;
}

//Plotting Functions
function drawGraph(toPlot, canvas, color) {
	var axes={}, ctx=canvas.getContext("2d");
	axes.xTranslation = .5 + .5*canvas.width;  // x0 pixels from left to x=0
	axes.yTranslation = .5 + .5*canvas.height; // y0 pixels from top to y=0
	axes.scale = 40;                 // 40 pixels from x=0 to x=1
	
	showAxes(ctx,axes);
	funGraph(ctx,axes,toPlot,color,2); 
}

function drawPoint(toPlot, canvas, color) {
	var axes={}, ctx=canvas.getContext("2d");
	axes.xTranslation = .5 + .5*canvas.width;  // x0 pixels from left to x=0
	axes.yTranslation = .5 + .5*canvas.height; // y0 pixels from top to y=0
	axes.scale = 40;                 // 40 pixels from x=0 to x=1
	
	showAxes(ctx,axes);
	funPoint(ctx,axes,toPlot,color); 
}

function funGraph (ctx,axes,func,color,thick) {
	var xx, yy, dx=4, xTranslation=axes.xTranslation, yTranslation=axes.yTranslation, scale=axes.scale;
	var iMax = Math.round((ctx.canvas.width-xTranslation)/dx);
	var iMin = Math.round(-xTranslation/dx);
	ctx.beginPath();
	ctx.lineWidth = thick;
	ctx.strokeStyle = color;
	
	for (var i=iMin;i<=iMax;i++) {
	xx = dx*i; yy = scale*func(xx/scale);
	if (i==iMin) ctx.moveTo(xTranslation+xx,yTranslation-yy);
	else         ctx.lineTo(xTranslation+xx,yTranslation-yy);
	}
	ctx.stroke();
}

function funPoint (ctx,axes,func,color) {
	var xx, yy, dx=4, xTranslation=axes.xTranslation, yTranslation=axes.yTranslation, scale=axes.scale;
	var iMax = Math.round((ctx.canvas.width-xTranslation)/dx);
	var iMin = Math.round(-xTranslation/dx);
	ctx.fillStyle = color;
	
	var point = func(xx/scale);
	var pointX = point[0]*scale;
	var pointY = point[1]*scale;
	
	ctx.beginPath();
	ctx.arc(xTranslation+pointX, yTranslation-pointY, 5, 0, 2 * Math.PI);
	ctx.fill();
}

function showAxes(ctx,axes) {
	var x0=axes.xTranslation, w=ctx.canvas.width;
	var y0=axes.yTranslation, h=ctx.canvas.height;
	var xmin = 0;
	ctx.beginPath();
	ctx.strokeStyle = "rgb(128,128,128)"; 
	ctx.moveTo(xmin,y0); ctx.lineTo(w,y0);  // X axis
	ctx.moveTo(x0,0);    ctx.lineTo(x0,h);  // Y axis
	ctx.stroke();
}

GLang.defaultRuntimeEnvironment.setInnerVariable("ui_plot_graph", {value:function(env, args){
	var canvas = makeCanvas();
	
	if(args.length === 1){
		//Default color
		args.push({value:[GLang.stringValue("orange")]});
	}
	
	if(!(args[0].value instanceof Array)){
		args[0] = {value:[args[0]]};
	}
	if(!(args[1].value instanceof Array)){
		args[1] = {value:[args[1]]};
	}
	console.log(args);
	
	var functions = args[0].value;
	var colors = args[1].value;
	
	var len = functions.length > colors.length ? functions.length : colors.length;
	function updatePlot(){
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		for(var i = 0; i < len; i++){
			drawGraph(function(x){
				return GLang.callObject(functions[i % functions.length], env, [{value:x}]).value
			}, canvas, colors[i % colors.length].value);
		}
	}
	
	GLang.registerGeneralListener(updatePlot);
	updatePlot();
	
	return {value:canvas, display:DISPLAY_DOM};
}});

GLang.defaultRuntimeEnvironment.setInnerVariable("ui_plot_point", {value:function(env, args){
	var canvas = makeCanvas();
	
	if(args.length === 1){
		//Default color
		args.push(GLang.stringValue("orange"));
	}
	
	if(!(args[0].value instanceof Array)){
		args[0] = {value:[args[0]]};
	}
	if(!(args[1].value instanceof Array)){
		args[1] = {value:[args[1]]};
	}
	var functions = args[0].value;
	var colors = args[1].value;
	
	var len = functions.length > colors.length ? functions.length : colors.length;
	function updatePlot(){
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		for(var i = 0; i < len; i++){
			drawPoint(function(){
				var point = GLang.callObject(functions[i % functions.length], env, []).value;
				return [point[0].value, point[1].value];
			}, canvas, colors[i % colors.length].value);
		}
	}
	
	GLang.registerGeneralListener(updatePlot);
	updatePlot();
	
	return {value:canvas, display:DISPLAY_DOM};
}})
