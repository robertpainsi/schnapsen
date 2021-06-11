export default class Trick {
    #card1;
    #card2;

    constructor(card1, card2) {
        this.#card1 = card1;
        this.#card2 = card2;
    }

    get cards() {
        return [this.#card1, this.#card2];
    }

    get value() {
        return this.#card1.value + this.#card2.value;
    }
}
