import {getPoints, getTricker, oppositePlayer} from "../utils/schnapsen-utils.js";
import EventListener from '../utils/event-listener';
import Trick from '../models/trick';
import {stringifyJson, wait} from '../utils/utils';
import Player from "../models/player";

export default class GameLogic extends EventListener {
    #game;

    constructor(game) {
        super();
        this.#game = game;
    }

    initNewGame() {
        this.#game.initNewGame();
    }

    get game() {
        console.log(this.#game);
        return this.#game;
    }

    async run() {
        const game = this.#game;
        const {players, talon} = this.#game;
        let [firstPlayer, secondPlayer] = players;

        let winner = null;
        let closedTalonPlayer = null;
        this.trigger('init-new-game', {});

        console.log(`talon`, JSON.stringify(talon.cards, stringifyJson));
        console.log(`trump`, JSON.stringify(talon.trump, stringifyJson));
        console.log(firstPlayer.type, `hand`, JSON.stringify(firstPlayer.hand, stringifyJson));
        console.log(secondPlayer.type, `hand`, JSON.stringify(secondPlayer.hand, stringifyJson));
        while (true) {
            this.trigger('init-new-round', {});
            const firstMove = await firstPlayer.getFirstMove(game);
            if (firstMove.closeTalon) {
                closedTalonPlayer = firstPlayer;
            }
            console.log(`Move`, firstPlayer.type, JSON.stringify(firstMove, stringifyJson));
            this.trigger('player-move', {move: firstMove, player: firstPlayer});
            if (firstPlayer.tricksValue >= 66) {
                winner = firstPlayer;
                break;
            }
            const secondMove = await secondPlayer.getSecondMove(game, firstMove);
            console.log(`Move`, secondPlayer.type, JSON.stringify(secondMove, stringifyJson));
            this.trigger('player-move', {move: secondMove, player: secondPlayer});

            await wait(1200);
            const tricker = getTricker(firstMove, secondMove, talon.trump.suit,);
            console.log(tricker.type, `tricks`);
            tricker.addTrick(new Trick(firstMove.card, secondMove.card));
            if (tricker.tricksValue >= 66 || !tricker.hasCards) {
                winner = tricker;
                break;
            }
            [firstPlayer, secondPlayer] = [tricker, oppositePlayer(tricker, players)];

            if (!talon.isEmpty && !talon.isClosed) {
                const firstPlayerDrawnCard = talon.drawCard();
                console.log(firstPlayer.type, `draws card`, JSON.stringify(firstPlayerDrawnCard, stringifyJson));
                firstPlayer.drawCard(firstPlayerDrawnCard);

                const secondPlayerDrawnCard = talon.drawCard();
                console.log(secondPlayer.type, `draws card`, JSON.stringify(secondPlayerDrawnCard, stringifyJson));
                secondPlayer.drawCard(secondPlayerDrawnCard);
            }
        }
        let loser = oppositePlayer(winner, players);

        let points;
        if (closedTalonPlayer) {
            if (closedTalonPlayer === winner && winner.tricksValue >= 66) {
                points = getPoints(loser.tricksValue);
            } else {
                if (closedTalonPlayer === winner) {
                    [winner, loser] = [loser, winner];
                }
                points = Math.max(2, getPoints(loser.tricksValue));
            }
        } else {
            points = getPoints(loser.tricksValue);
        }
        console.log(`winner`, `${points} points`, winner.type);
        console.log(`loser`, loser.type);
        if (winner.type === Player.types.human) {
            document.body.style.backgroundColor = `rgb(220 255 207)`;
        } else {
            document.body.style.backgroundColor = `rgb(255 211 211)`;
        }
        winner.addPoints(points);
        await wait(1000);
        this.trigger('end-game', {winner, loser, points});
    }
}
