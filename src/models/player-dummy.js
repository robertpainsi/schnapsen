import {removeItem} from "../utils/utils";

export default class PlayerDummy {
    #id;
    #hand;
    #tricks;
    #marriages;
    #tricksValue;

    constructor(player) {
        this.#id = player.id;
        this.#hand = [...player.hand];
        this.#tricks = [...player.tricks];
        this.#marriages = [...player.marriages];
        this.#tricksValue = player.tricksValue;
    }

    playCard(card) {
        removeItem(this.#hand, card, true);
    }

    addTrick(trick) {
        this.#tricks.push(trick);
        this.#tricksValue += trick.value;
    }

    addMarriage(marriage) {
        this.#marriages.push(marriage);
        this.#tricksValue += marriage.value;
    }

    get hand() {
        return this.#hand;
    }

    get id() {
        return this.#id;
    }

    get tricks() {
        return this.#tricks;
    }

    get marriages() {
        return this.#marriages;
    }

    get tricksValue() {
        return this.#tricks.length === 0 ? 0 : this.#tricksValue;
    }

    toString() {
        return `[${this.id} ${this.tricksValue}]`;
    }
}
