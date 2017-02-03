class FSM {
    constructor(config) {
        if (config) {
            this.config = config;
            this.length = 0;
            this.nameList = [this.config.initial];
            this.prev = [null];
        } else {
            throw new Error("config is unobtainable!")
        }
    	
    }

    getState() {
    	return this.nameList[this.length];
    }

    changeState(state) {
    	for (let key in this.config.states) {
    		if (key === state) {
                 while (this.length < (this.nameList.length-1)){
                    this.prev.pop();
                    this.nameList.pop();
                }
                this.prev.push(this.nameList[this.length]);
                this.nameList.push(state);
                this.length++;
    			return;
    		}
 		}
 		throw new Error('improper name of the state!')    	
    }

    trigger(event) {
    	for (let key in this.config.states[this.getState()].transitions) {
    		if (key === event) {
                let nextState = this.config.states[this.getState()].transitions[key];
                this.changeState(nextState);
    			return;
    		}
    	}
    	throw new Error('improper name of the event!');
    }

    reset() {
    	this.length = 0;
    	this.nameList = [this.config.initial];
    	this.prev = [null];
    }

    getStates(event) {
        let box = [];
    	if (event === undefined) {
            for (let key in this.config.states) {
                box.push(key);
            }
        } else {
            for (let keyStates in this.config.states) {
                for (let keyEvents in this.config.states[keyStates].transitions) {
                    if (keyEvents === event) {
                        box.push(keyStates);
                    }
                }
            }
        }
        return box;
    }

    undo() {
    	if (this.length === 0) return false;
    	this.length--;
    	return true;


    }

    redo() {
        if (this.nameList.length === 1 || this.length === (this.nameList.length-1)) {
            return false;
        } 
        this.length++;
        return true;
    }

    clearHistory() {
        this.nameList.splice(0, this.length);
        this.prev.splice(0, this.length);
        this.length = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
