let events = {};

export class EventEmitter {
    static on(eventName, listener) {
        if (!events[eventName]) {
            events[eventName] = [];
        }
        events[eventName].push(listener);
    }

    static emit(eventName, data) {
        if (!events[eventName]){
            return;
        }
        events[eventName].forEach(listener => listener(data));
    }
}