export default class EventListener {
    #callbacks = new Map();
    static uniqueId = 0;

    addEventListener(type, callback) {
        if (!this.#callbacks.has(type)) {
            this.#callbacks.set(type, []);
        }

        const id = Symbol(`EventListenerId#${EventListener.uniqueId++}`);
        this.#callbacks.get(type).push({id, callback});
        return id;
    }

    removeEventListener(eventListenerId) {
        for (const [type, callbacks] of this.#callbacks.entries()) {
            this.#callbacks.set(type, callbacks.filter(({id}) => eventListenerId !== id));
        }
    }

    trigger(type, data) {
        if (this.#callbacks.has(type)) {
            this.#callbacks.get(type).forEach(({callback}) => callback(data));
        }
    }
}
