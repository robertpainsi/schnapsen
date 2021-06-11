export default class Marriage {
    #suit;
    #value;

    constructor(suit, value) {
        this.#suit = suit;
        this.#value = value;
    }

    get suit() {
        return this.#suit;
    }

    get value() {
        return this.#value;
    }

    stringify() {
        return `${this.#suit}${this.#value}}`;

    }
}
