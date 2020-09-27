//Timeout.js variant for Kalzit
const Timeout = {
    timeoutAfter: 30, //30 Minutes
    warnWhenTimeLeft: 5, //Warn 5 minutes before timeout
    
    //These three methods can be freely changed by the user
    onTimeout(){
		//Store a timestamp to know when the timeout is over
		GLang.eval(
		    "'kalzit.timeoutSince' storageSaveString String: !getCurrentDate." +
		    "'kalzit.timeoutMinutes' storageSaveString '0'");
		
		//Reload the page to trigger the effect
		setTimeout(() => {
		    history.go();
		    GLang.eval("!relaunchApp");
		}, 30 * 1000)
    },
    onBeforeTimeout(minutes){
    	alert("You have used the Kalzit apps for about " + minutes + " minutes now. You will automatically get a 20 minute timeout in about 5 minutes");
    },
    onTick(minutes){
    	GLang.eval("'kalzit.timeoutMinutes' storageSaveString String: " + minutes);
    },
    paused: false,
    
    runEveryMinute(callback){
        var stopped = false;
        
        function getsRepeated(preventTick){
            if(stopped) return;
            if(!preventTick) callback();
            
            setTimeout(getsRepeated, 1000 * 60);
        }
        
        getsRepeated(true);
        
        return {
            stop(){stopped = false;}
        };
    },
    startTimer(goneMinutes){
        goneMinutes = goneMinutes || 0;
        this.activeTimer = this.runEveryMinute(() => {
            if(this.paused) return;
            
            goneMinutes++;
            this.onTick(goneMinutes);

            if((this.timeoutAfter - goneMinutes) === this.warnWhenTimeLeft) this.onBeforeTimeout(goneMinutes);
            if(goneMinutes >= this.timeoutAfter) {
                this.onTimeout();
                this.stopTimer();
            }
        })
    },
    stopTimer(){
        if(this.activeTimer) this.activeTimer.stop();
    },
    pauseTimer(){
        this.paused = true;   
    },
    continueTimer(){
        this.paused = false;
    }
    
};