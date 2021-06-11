export default class Move {
    player;
    swapTrump = null;
    closeTalon = false;
    marriage = null;
    card = null;

    constructor(player) {
        this.player = player;
    }

    stringify() {
        return {
            player: this.player.type,
            swapTrump: this.swapTrump,
            closeTalon: this.closeTalon,
            marriage: this.marriage,
            card: this.card,
        }
    }
}

Move.SwapTrump = class {
    oldTrump;
    newTrump;

    constructor(oldTrump, newTrump) {
        this.oldTrump = oldTrump;
        this.newTrump = newTrump;
    }
}
