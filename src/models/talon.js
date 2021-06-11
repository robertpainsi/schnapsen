import {removeItem, shuffle} from "../utils/utils.js";
import Card, {cards} from "./card.js";
import EventListener from '../utils/event-listener';

export default class Talon extends EventListener {
    #cards;
    #trump;
    #closed;

    constructor() {
        super();
    }

    initNewGame() {
        this.#cards = [...cards];
        shuffle(this.#cards);
        this.#trump = this.#cards[0];
        this.#closed = false;
    }

    drawCard() {
        return this.drawCards(1)[0];
    }

    drawCards(count) {
        const drawnCards = [];
        for (let i = 0; i < count; i++) {
            if (this.#cards.length === 0) {
                throw new Error(`Can't draw from empty talon.`)
            } else {
                drawnCards.push(this.#cards.pop());
            }
        }
        return drawnCards;
    }

    get trump() {
        return this.#trump;
    }

    swapTrump(jack) {
        if (jack.value !== Card.values.jack || jack.suit !== this.trump.suit) {
            throw new Error(`Can't swap trump card ${this.trump} with ${jack}`);
        }
        const currentTrump = this.trump;
        removeItem(this.#cards, currentTrump, true);
        this.#trump = jack;
        this.#cards.unshift(this.#trump);
        this.trigger('swap-trump', {
            trump: jack,
            swappedTrump: currentTrump,
            talon: this,
        });
        return currentTrump;
    }

    get cards() {
        return [...this.#cards];
    }

    get isEmpty() {
        return this.#cards.length === 0;
    }

    get canSwap() {
        return !this.isClosed && this.#cards.length > 2;
    }

    get canClose() {
        return !this.isClosed && this.#cards.length > 2;
    }

    close() {
        this.#closed = true;
        this.trigger('close', {closed: this.#closed, talon: this});
    }

    get isClosed() {
        return this.#closed;
    }
}
