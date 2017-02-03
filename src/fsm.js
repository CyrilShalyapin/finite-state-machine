const config = {
    initial: 'normal',
    states: {
        normal: {
            transitions: {
                study: 'busy',
            }
        },
        busy: {
            transitions: {
                get_tired: 'sleeping',
                get_hungry: 'hungry',
            }
        },
        hungry: {
            transitions: {
                eat: 'normal'
            },
        },
        sleeping: {
            transitions: {
                get_hungry: 'hungry',
                get_up: 'normal',
            },
        },
    }
};

class FSM {
    constructor(config) {
    	this.length = 0;
    	this.nameList = [config.initial];
    	this.next = config.states.normal;
    	this.prev = [null];
        this.nextLost = null;
    	
    }

    getState() {
    	return this.nameList[this.length];
    }

    changeState(state) {
    	for (let key in config.states) {
    		if (key === state) {
                while (this.length < (this.nameList.length-1)) {
                    this.prev.pop();
                    this.nameList.pop();
                }
    			this.prev.push(this.next);
    			this.length++;
    			switch (state) {
					case 'hungry':
						this.next = config.states.hungry;
						this.nameList.push(state);
						break;
					case 'normal':
						this.next = config.states.normal;
						this.nameList.push(state);
						break;
					case 'busy':
						this.next = config.states.busy;
						this.nameList.push(state);
						break;
					case 'sleeping':
						this.next = config.states.sleeping;
						this.nameList.push(state);
						break;
    			}
    			return;
    		}
 		}
 		throw new Error('improper nameList of state!')    	
    }

    trigger(event) {
    	for (let key in this.next.transitions) {
    		if (key === event) {
                while (this.length < (this.nameList.length-1)) {
                    this.prev.pop();
                    this.nameList.pop();
                }
    			this.prev.push(this.next);
    			this.length++;
    			switch (event) {
    				case 'study':
						this.next = config.states.busy;
						this.nameList.push('busy');
						break;
    				case 'get_tired':
						this.next = config.states.sleeping;
						this.nameList.push('sleeping');
						break;
    				case 'get_hungry':
						this.next = config.states.hungry;
						this.nameList.push('hungry');
						break;
    				case 'eat':
    				case 'get_up':
						this.next = config.states.normal;
						this.nameList.push('normal');
						break;
    			}
    			return;
    		}
    	}
    	throw new Error('improper nameList of event!');
    }

    reset() {
    	this.length = 0;
        this.nextLost = null;
    	this.nameList = [config.initial];
    	this.next = config.states.normal;
    	this.prev = [null];
    }

    getStates(event) {
    	switch (event) {
    		case undefined:
    			return ['normal', 'busy', 'hungry', 'sleeping'];
    		case 'study':
    			return ['normal'];
    		case 'get_hungry':
    			return ['busy', 'sleeping'];
    		case 'get_tired':
    			return ['busy'];
    		case 'get_up':
    			return ['sleeping'];
    		case 'eat':
    			return ['hungry'];
    		default:
    			return [];
    	}
    }

    undo() {
    	if (this.prev[this.length] === null) return false;
        this.nextLost = this.next;
    	this.next = this.prev[this.length];
    	this.length--;
    	return true;


    }

    redo() {
        if (this.prev.length === 1 || this.length === (this.nameList.length-1)) {
            return false;
        } 
        this.length++;
        if (this.length === (this.nameList.length-1)) {
            this.next = this.nextLost;
        } else {
            this.next = this.prev[this.length];
        }
        return true;
    }

    clearHistory() {
        this.nameList.splice(1, this.length);
        this.prev.splice(1, this.length);
        this.length = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
