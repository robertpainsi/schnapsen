import Player from "./player.js";
import Card from "./card.js";
import {removeItem} from '../utils/utils';
import {
    canSwapTrump,
    getMarriageSuits,
    getPlayableCards,
    getTricker,
    hasMarriage,
    oppositePlayer,
    sortHand
} from '../utils/schnapsen-utils';
import Move from "./move";

import Marriage from "./marriage";
import Trick from "./trick";
import PlayerDummy from "./player-dummy";

class Pair {
    #winner;
    #loser;
    trickerId;

    constructor(winner, loser) {
        this.#winner = winner;
        this.#loser = loser;
    }

    get winner() {
        return this.#winner;
    }

    get loser() {
        return this.#loser;
    }


}

export default class Computer extends Player {
    #neuralNetwork;
    #opponentCards = [];
    #playedCards = [];

    constructor(neuralNetwork) {
        super(Player.types.computer);
        this.#neuralNetwork = neuralNetwork;
    }

    async getFirstMove(game) {
        return new Promise((resolve) => {
            let swapTrump = null;
            if (game.talon.canSwap) {
                for (const card of this.hand) {
                    if (canSwapTrump(card, game.talon)) {
                        const oldTrump = game.talon.swapTrump(card);
                        this.swapCard(card, oldTrump);
                        swapTrump = new Move.SwapTrump(oldTrump, card);
                        break;
                    }
                }
            }
            const move = this.#getBestMove(game);
            move.swapTrump = swapTrump;
            if (move.closeTalon) {
                // TODO: move.closeTalon currently always false
                game.talon.close();
            }
            if (hasMarriage(move.card, this.hand)) {
                // TODO: Emphasize in neural network
                const marriage = new Marriage(move.card.suit, game.talon.trump.suit === move.card.suit ? 40 : 20);
                move.marriage = marriage;
                this.addMarriage(marriage);
            }

            this.playCard(move.card);
            resolve(move);
        });
    }

    async getSecondMove(game, opponentMove) {
        return new Promise((resolve) => {
            const move = this.#getBestMove(game, opponentMove);
            this.playCard(move.card);
            resolve(move);
        });
    }

    #getBestMove(game, opponentMove = null) {
        // TODO: If single played card ends game (marriage, trump, closed stack)
        if (game.talon.isEmpty) {
            return this.#getBestMoveWithClosedTalon(game, opponentMove);
        }
        const input = [];

        // number-of-talon-cards [1]
        input.push(game.talon.cards.length);
        // number-of-remaining-trump-cards [1]
        input.push(this.#numberOfRemainingTrumpCards(game.talon));
        // trump-suit [4]
        for (const suit of Object.values(Card.suits)) {
            input.push(game.talon.trump.suit === suit ? 1 : 0);
        }
// talon-closed [1]
        input.push(game.talon.closed ? 1 : 0);

        const opponent = oppositePlayer(this, game.players);
// opponent-cards [20][probability owning cards]
        const unknownCards = game.talon.cards.length === 0
            ? opponent.hand.length
            : opponent.hand.length + game.talon.cards.length - 1;
        for (const card of Card.cards) {
            if (this.#playedCards.includes(card) || this.hand.includes(card)) {
                input.push(0);
            } else if (this.#opponentCards.includes(card)) {
                input.push(1);
            } else {
                input.push(1 / unknownCards);
            }
        }
// opponent-points [1]
        input.push(opponent.tricksValue);

// player-is-first [1]
        input.push(opponentMove === null ? 1 : 0);
// player-cards [20][owning cards]
        for (const card of Card.cards) {
            input.push(this.hand.includes(card) ? 1 : 0);
        }
// player-cards [20][playable cards]
        const playableCards = getPlayableCards(this.hand, game.talon, opponentMove !== null ? opponentMove.card : null);
        for (const card of Card.cards) {
            input.push(playableCards.includes(card) ? 1 : 0);
        }
// player-points [1]
        input.push(this.tricksValue);
// player-trump-marriages [1]
        const marriageSuits = getMarriageSuits(this.hand);
        const hasTrumpMarriage = marriageSuits.includes(game.talon.trump.suit);
        input.push(hasTrumpMarriage ? 1 : 0);

// player-marriages [1]
        input.push(marriageSuits.length - (hasTrumpMarriage ? 1 : 0));

        const output = this.#neuralNetwork.output(input);

        let bestCard = null;
        let bestCardProbability = 0;
        for (let i = 0; i < output.length; i++) {
            const card = Card.cards[i];
            if ((bestCard === null || output[i] > bestCardProbability)
                && playableCards.includes(card)) {
                bestCard = card;
                bestCardProbability = output[i];
            }
        }
        const move = new Move(this);
        move.card = bestCard;
        return move;
    }

    #numberOfRemainingTrumpCards(talon) {
        let remaining = 5;
        for (const card of this.#playedCards) {
            if (card.suit === talon.trump.suit) {
                remaining--;
            }
        }
        for (const card of this.hand) {
            if (card.suit === talon.trump.suit) {
                remaining--;
            }
        }
        return remaining;
    }

    selfMove(selfMove) {
        this.#playedCards.push(selfMove.card);
    }

    opponentMove(opponentMove) {
        if (opponentMove.marriage !== null) {
            if (opponentMove.card.value === Card.values.king) {
                this.#opponentCards.push(Card.getCard(opponentMove.card.suit, Card.values.queen));
            } else {
                this.#opponentCards.push(Card.getCard(opponentMove.card.suit, Card.values.king));
            }
        }
        if (opponentMove.swapTrump != null) {
            this.#opponentCards.push(opponentMove.swapTrump.oldTrump);
            removeItem(this.#opponentCards, opponentMove.swapTrump.newTrump, true);
        }
        this.#playedCards.push(opponentMove.card);
        removeItem(this.#opponentCards, opponentMove.card, true);
    }

    #getBestMoveWithClosedTalon(game, opponentMove) {
        console.log('                           ### BEST MOVE CLOSED TALON');
        const thisDummy = new PlayerDummy(this);
        const opponentDummy = new PlayerDummy(oppositePlayer(this, game.players));

        const firstPlayer = opponentMove ? opponentDummy : thisDummy;
        const secondPlayer = oppositePlayer(firstPlayer, [thisDummy, opponentDummy]);
        const bestCard = this.#getMoveProbabilityWithClosedTalon(game, firstPlayer, secondPlayer, opponentMove);
        const move = new Move(this);
        move.card = bestCard;
        console.log(`Best card`, move.card.toString());
        return move;
    }

    /*
     * TODO: Use probabilities to play best card
     */
    #getMoveProbabilityWithClosedTalon(game, firstPlayer, secondPlayer, firstPlayerMove, level = 0) {
        if (!firstPlayerMove && (firstPlayer.hand.length === 0 || firstPlayer.tricksValue >= 66)) {
            return new Pair(new PlayerDummy(firstPlayer), new PlayerDummy(secondPlayer));
        }

        const results = [];
        let bestCard = null;
        let bestResult = null;
        const firstPlayerHand = firstPlayer.hand;
        if (firstPlayerMove) {
            firstPlayerHand.push(firstPlayerMove.card);
        }
        for (const firstPlayerCard of sortHand(firstPlayerHand, game.talon.trump.suit)) {
            if (firstPlayerMove && firstPlayerMove.card !== firstPlayerCard) {
                continue;
            }

            const firstPlayerCardHasMarriage = (firstPlayerMove && firstPlayerMove.marriage) || (!firstPlayerMove && hasMarriage(firstPlayerCard, firstPlayer.hand));
            let firstPlayerWinsBestResult = null;
            let firstPlayerLosesBestResult = null;
            let bestSecondPlayerCard = null;
            for (const secondPlayerCard of sortHand(getPlayableCards(secondPlayer.hand, game.talon, firstPlayerCard), game.talon.trump.suit)) {
                const fp = new PlayerDummy(firstPlayer);
                const fpMove = new Move(fp);
                fpMove.card = firstPlayerCard;
                if (firstPlayerCardHasMarriage) {
                    const marriage = new Marriage(fpMove.card.suit, game.talon.trump.suit === fpMove.card.suit ? 40 : 20);
                    fpMove.marriage = marriage;
                    fp.addMarriage(marriage);
                }
                fp.playCard(fpMove.card);
                if (fp.tricksValue >= 66) {
                    // First player wins
                    const result = new Pair(new PlayerDummy(fp), new PlayerDummy(secondPlayer));
                    result.trickerId = firstPlayer.id;
                    if (firstPlayerWinsBestResult == null
                        || (result.loser.tricksValue > firstPlayerWinsBestResult.loser.tricksValue) // Maximize second player tricks
                        || (result.loser.tricksValue === firstPlayerWinsBestResult.loser.tricksValue && fp.tricksValue < firstPlayerWinsBestResult.winner.tricksValue)  // Minimize first player tricks
                    ) {
                        firstPlayerWinsBestResult = result;
                    }
                    continue;
                }

                const sp = new PlayerDummy(secondPlayer);
                const spMove = new Move(sp);
                spMove.card = secondPlayerCard;
                sp.playCard(spMove.card);

                const tricker = getTricker(fpMove, spMove, game.talon.trump.suit);
                tricker.addTrick(new Trick(fpMove.card, spMove.card));

                const result = this.#getMoveProbabilityWithClosedTalon(game, tricker, oppositePlayer(tricker, [fp, sp]), null, level + 1);
                result.trickerId = tricker.id;
                if (result.winner.id === fp.id) {
                    // First player wins
                    if (firstPlayerWinsBestResult == null
                        || (result.loser.tricksValue > firstPlayerWinsBestResult.loser.tricksValue) // Maximize second player tricks
                        || (result.loser.tricksValue === firstPlayerWinsBestResult.loser.tricksValue && result.winner.tricksValue < firstPlayerWinsBestResult.winner.tricksValue) // Minimize first player tricks
                    ) {
                        firstPlayerWinsBestResult = result;
                        if (firstPlayerLosesBestResult == null) {
                            bestSecondPlayerCard = secondPlayerCard;
                        }
                    }
                } else {
                    // First player loses
                    if (firstPlayerLosesBestResult == null
                        || result.loser.tricksValue < firstPlayerLosesBestResult.loser.tricksValue // Minimize first players tricks
                        || (result.loser.tricksValue === firstPlayerLosesBestResult.loser.tricksValue && result.winner.tricksValue > firstPlayerLosesBestResult.winner.tricksValue) // Maximize second player tricks
                    ) {
                        firstPlayerLosesBestResult = result;
                        bestSecondPlayerCard = secondPlayerCard;
                    }
                }
            }
            const result = firstPlayerLosesBestResult != null ? firstPlayerLosesBestResult : firstPlayerWinsBestResult;
            results.push(result);
            const currentCard = (firstPlayerMove == null) ? firstPlayerCard : bestSecondPlayerCard;
            const bar = (firstPlayerMove == null) ? firstPlayer : secondPlayer;

            if (level === 0) {
                // console.log(currentCard.toString());
                const comCard = firstPlayer.id === this.id ? firstPlayerCard : bestSecondPlayerCard;
                const humCard = firstPlayer.id !== this.id ? firstPlayerCard : bestSecondPlayerCard;
                this.#logResult({comCard, humCard, result});
            }
            if (bestResult == null) {
                bestResult = result;
                bestCard = currentCard;
            } else if (bestResult.winner.id === bar.id) {
                if (result.winner.id === bar.id) {
                    // First player wins
                    if (result.loser.tricksValue < bestResult.loser.tricksValue
                        || result.loser.tricksValue === bestResult.loser.tricksValue && result.winner.tricksValue > bestResult.winner.tricksValue) {
                        // Minimize losers tricks
                        bestResult = result;
                        bestCard = currentCard;
                    } else if (result.loser.tricksValue === bestResult.loser.tricksValue && result.winner.tricksValue == bestResult.winner.tricksValue) {
                        // Maximize winners tricks
                        if (result.trickerId === bar.id && currentCard.value.value > bestCard.value.value) {
                            // Winner ticker, play higher card
                            bestResult = result;
                            bestCard = currentCard;
                        } else if (result.trickerId === secondPlayer.id && currentCard.value.value < bestCard.value.value) {
                            // Winner not ticker, play lower card
                            bestResult = result;
                            bestCard = currentCard;
                        }
                    }
                }
            } else if (bestResult.loser.id === bar.id) {
                if (result.loser.id === bar.id) {
                    // First player loses
                    if (result.loser.tricksValue > bestResult.loser.tricksValue
                        || result.loser.tricksValue == bestResult.loser.tricksValue && result.winner.tricksValue < bestResult.winner.tricksValue) {
                        // Maximize  losers tricks
                        bestResult = result;
                        bestCard = currentCard;
                    } else if (result.loser.tricksValue == bestResult.loser.tricksValue && result.winner.tricksValue == bestResult.winner.tricksValue) {
                        // Minimize winners tricks
                        if (result.trickerId === bar.id && currentCard.value.value > bestCard.value.value) {
                            // Winner ticker, play higher card
                            bestResult = result;
                            bestCard = currentCard;
                        } else if (result.trickerId === secondPlayer.id && currentCard.value.value < bestCard.value.value) {
                            // Winner not ticker, play lower card
                            bestResult = result;
                            bestCard = currentCard;
                        }
                    }
                } else {
                    // First player wins
                    bestResult = result;
                    bestCard = currentCard;
                }
            }
        }
        if (level === 0) {
            console.log(`Best result`, bestResult);
            return bestCard;
        } else {
            return bestResult;
        }
    }

    #logResult({comCard, humCard, result}) {
        const com = this.id === result.winner.id ? result.winner : result.loser;
        const hum = this.id !== result.winner.id ? result.winner : result.loser;

        const winnerColor = `color: darkgreen`;
        const loserColor = `color: darkred`;
        const comColor = this.id === result.winner.id ? winnerColor : loserColor;
        const humColor = this.id !== result.winner.id ? winnerColor : loserColor;

        console.log(`${result.winner.id} wins`);
        console.log(`%c   com: ${(comCard || ' ').toString()} ${com.tricksValue}`, comColor);
        console.log(`%c   hum: ${(humCard || ' ').toString()} ${hum.tricksValue}`, humColor);
    }
}
