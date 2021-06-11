export default class Card {
    static get cards() {
        return [...cards];
    }

    static getCard(suit, value) {
        for (const card of cards) {
            if (card.suit === suit && card.value === value) {
                return card;
            }
        }
        throw new Error(`Can't find card(${suit}, ${value})`);
    }

    static suits = {
        club: '♣',
        diamond: '♦',
        heart: '♥',
        spade: '♠',
    };
    static values = {
        jack: 2,
        queen: 3,
        king: 4,
        ten: 10,
        ace: 11,
    };

    #suit;
    #value;
    #symbol;

    constructor(suit, value, symbol) {
        this.#suit = suit;
        this.#value = value;
        this.#symbol = symbol;
    }

    get suit() {
        return this.#suit;
    }

    get value() {
        return this.#value;
    }

    get symbol() {
        return this.#symbol;
    }

    stringify() {
        let v;
        switch (this.#value) {
            case Card.values.ten:
                v = '10';
                break;
            case Card.values.jack:
                v = 'J';
                break;
            case Card.values.queen:
                v = 'Q';
                break;
            case Card.values.king:
                v = 'K';
                break;
            case Card.values.ace:
                v = 'A';
                break;
        }
        return `[${this.#suit}${v}]`;
    }

    toString() {
        return this.#symbol;
    }
}

const symbolMapping = {
    [Card.suits.club]: '3%9',
    [Card.suits.diamond]: '3%8',
    [Card.suits.heart]: '2%B',
    [Card.suits.spade]: '2%A',
    [Card.values.jack]: 'B',
    [Card.values.queen]: 'D',
    [Card.values.king]: 'E',
    [Card.values.ten]: 'A',
    [Card.values.ace]: '1',
}

export const cards = [];
for (const suit of Object.values(Card.suits)) {
    for (const value of Object.values(Card.values)) {
        cards.push(new Card(suit, value,
            decodeURIComponent(`%F0%9F%8${symbolMapping[suit]}${symbolMapping[value]}`)));
    }
}
