import {removeItem, sumByProperty} from "../utils/utils.js";
import EventListener from '../utils/event-listener';
import {swapCard} from '../utils/schnapsen-utils';

export default class Player extends EventListener {
    static types = {
        human: 'hum',
        computer: 'com',
    }

    #id;
    #type;
    #hand = [];
    #marriages = [];
    #tricks = [];

    #points = 0;
    #bummerl = [];

    constructor(type) {
        super();
        this.#type = type;
        this.#id = type;
        this.initNewGame();
    }

    initNewGame() {
        this.#hand = [];
        this.#marriages = [];
        this.#tricks = [];
    }

    get type() {
        return this.#type;
    }

    get id() {
        return this.#id;
    }

    playCard(card) {
        removeItem(this.#hand, card, true);
        this.trigger('play-card', {card, player: this});
    }

    drawCard(card) {
        this.#hand.push(card);
        this.trigger('draw-card', {card, player: this});
    }

    swapCard(removeCard, addCard) {
        swapCard(this.#hand, removeCard, addCard, true);
        this.trigger('swap-card', {removeCard, addCard, player: this});
    }

    get hand() {
        return [...this.#hand];
    }

    get hasCards() {
        return this.#hand.length > 0;
    }

    addTrick(trick) {
        this.#tricks.push(trick);
        this.trigger('add-trick', {trick, player: this});
    }

    get tricks() {
        return [...this.#tricks];
    }

    addMarriage(marriage) {
        this.#marriages.push(marriage);
        this.trigger('add-marriage', {marriage, player: this});
    }

    get marriages() {
        return [...this.#marriages];
    }

    get tricksValue() {
        if (this.#tricks.length) {
            return sumByProperty(this.#tricks, 'value')
                + sumByProperty(this.#marriages, 'value');
        } else {
            return 0;
        }
    }

    addPoints(points) {
        this.#points += points;
        this.trigger('add-points', {points, player: this});
    }

    get points() {
        return this.#points;
    }

    addBummerl(bummerl) {
        this.#bummerl.push(bummerl);
        this.trigger('add-bummerl', {bummerl, player: this});
    }

    get bummerl() {
        return [...this.#bummerl];
    }

    get bummerlValue() {
        return sumByProperty(this.#bummerl, 'value');
    }
}
