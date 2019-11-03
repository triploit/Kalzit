function getVoiceObject(voiceName){
	for(var i = 0; i < speechSynthesis.getVoices().length; i++){
		if(speechSynthesis.getVoices()[i].name === voiceName){
			return speechSynthesis.getVoices()[i];
		}
	}
}

this.speechSay = function(text, voice){
	var ssu = new SpeechSynthesisUtterance(text);
	ssu.voice = getVoiceObject(voice) || ssu.voice;
	speechSynthesis.speak(ssu);
	return text;
}

this.speechGetVoicesByLanguage = function(language){
	var list = [];
	for(var i = 0; i < speechSynthesis.getVoices().length; i++){
		if(speechSynthesis.getVoices()[i].lang.startsWith(language)){
			list.push(speechSynthesis.getVoices()[i].name);
		}
	}
	return list;
}

this.speechGetVoices = function(){
	var list = [];
	for(var i = 0; i < speechSynthesis.getVoices().length; i++){
		list.push(speechSynthesis.getVoices()[i].name);
	}
	return list;
}