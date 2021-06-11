import Player from "./player.js";
import Move from "./move.js";

export default class Human extends Player {
    constructor() {
        super(Player.types.human);
    }

    async getFirstMove(game) {
        const {talon} = game;
        const move = new Move(this);

        const closeTalonId = talon.addEventListener('close', () => move.closeTalon = true);
        const swapTrumpId = talon.addEventListener('swap-trump', ({trump, swappedTrump}) => {
            move.swapTrump = new Move.SwapTrump(swappedTrump, trump);
        });
        const addMarriageId = this.addEventListener('add-marriage', ({marriage}) => move.marriage = marriage);
        const playCardId = this.addEventListener('play-card', ({card}) => {
            move.card = card;
            resolvePromise(move);
        });

        // if (!talon.isEmpty) {
        //     setTimeout(() => {
        //         this.playCard(randomItem(this.hand));
        //     }, 1);
        // }

        let resolvePromise;
        return new Promise((resolve) => {
            resolvePromise = resolve;
        }).finally(() => {
            talon.removeEventListener(closeTalonId);
            talon.removeEventListener(swapTrumpId);
            this.removeEventListener(addMarriageId);
            this.removeEventListener(playCardId);
        });
    }

    async getSecondMove(game, firstMove) {
        const {talon} = game;
        const move = new Move(this);
        const playCardId = this.addEventListener('play-card', ({card}) => {
            move.card = card;
            resolvePromise(move);
        });

        // if (!talon.isEmpty) {
        //     setTimeout(() => {
        //         this.playCard(randomItem(this.hand));
        //     }, 1);
        // }

        let resolvePromise;
        return new Promise((resolve) => {
            resolvePromise = resolve;
        }).finally(() => {
            this.removeEventListener(playCardId);
        });
    }
}
