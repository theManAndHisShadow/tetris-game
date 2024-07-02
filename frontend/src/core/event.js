class GameEventTarget {
    constructor (){
        this.events = {};
    }

    addEventListener(eventType, callback) {
        if (!this.events[eventType]) {
            this.events[eventType] = [];
        }

        this.target = this;
        this.events[eventType].push(callback);
    }

    dispatchEvent(eventType, data) {
        if (this.events[eventType]) {
            this.events[eventType].forEach(callback => callback(data));
        }
    }
}

class GameEventsSupervisor {
    constructor(){

        this.lastEventTriggered = null;
    }
}

export { GameEventTarget, GameEventsSupervisor}