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
        //Should show in any case, and the timer should not continue until after (!) the popup is closed
        GLang.eval('!showTimeoutMessage')
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
        
        //First thing: if there are five or less minutes left, warn the user
        var minutesLeft = this.timeoutAfter - goneMinutes;
        if(minutesLeft <= 5) {
            setTimeout(() => {
                GLang.eval("!showTimeoutMessage " + minutesLeft)
            }, 0);
        }
        
        //Start the timer
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