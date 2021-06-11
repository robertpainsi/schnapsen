import Talon from "./talon.js";

export default class Game {
    #players;
    #talon = new Talon();

    constructor(players) {
        this.#players = players;
    }

    initNewGame() {
        this.#talon.initNewGame();
        for (const player of this.#players) {
            player.initNewGame();
            for (const card of this.talon.drawCards(5)) {
                player.drawCard(card);
            }
        }
    }

    get players() {
        return this.#players;
    }

    get talon() {
        return this.#talon;
    }
}
