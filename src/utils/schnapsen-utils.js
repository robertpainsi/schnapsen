import {Bummerl} from "../models/bummerl.js";
import CardModel from '../models/card.js';
import {removeItem} from './utils.js';

export function swapCard(cards, removeCard, addCard, inPlace = false) {
    if (!inPlace) {
        cards = [...cards];
    }
    removeItem(cards, removeCard, true);
    cards.push(addCard);
    return cards;
}

export function oppositePlayer(player, allPlayers) {
    return (allPlayers[0] === player) ? allPlayers [1] : allPlayers[0];
}

export function getTricker(firstPlayerMove, secondPlayerMove, trumpSuit) {
    const firstPlayerCard = firstPlayerMove.card;
    const secondPlayerCard = secondPlayerMove.card;
    if (firstPlayerCard.suit === trumpSuit && secondPlayerCard.suit !== trumpSuit) {
        return firstPlayerMove.player;
    } else if (firstPlayerCard.suit !== trumpSuit && secondPlayerCard.suit === trumpSuit) {
        return secondPlayerMove.player;
    } else if (firstPlayerCard.suit !== secondPlayerCard.suit) {
        return firstPlayerMove.player;
    } else if (firstPlayerCard.value > secondPlayerCard.value) {
        return firstPlayerMove.player;
    } else {
        return secondPlayerMove.player;
    }
}

export function getPoints(opponentTricksValue) {
    if (opponentTricksValue >= 33) {
        return 1;
    } else if (opponentTricksValue > 0) {
        return 2;
    } else {
        return 3;
    }
}

export function getBummerl(opponentPoints) {
    return (opponentPoints === 0) ? new Bummerl(Bummerl.types.schneider) : new Bummerl(Bummerl.types.bummerl);
}

export function getPlayableCards(hand, talon, opponentCard) {
    if (opponentCard) {
        if (talon.isClosed || talon.isEmpty) {
            let sameSuitBetterCards = hand.filter((card) => card.value > opponentCard.value && card.suit === opponentCard.suit);
            if (sameSuitBetterCards.length) {
                return sameSuitBetterCards;
            }
            let sameSuitCards = hand.filter((card) => card.suit === opponentCard.suit);
            if (sameSuitCards.length) {
                return sameSuitCards;
            }
            let trumpCards = hand.filter((card) => card.suit === talon.trump.suit);
            if (trumpCards.length) {
                return trumpCards;
            }
        }
    }
    return [...hand];
}

export function cardToImgSrc(card) {
    if (card) {
        return `res/cards/${getCardSuitName(card.suit)}-${getCardValueName(card.value)}.png`;
    } else {
        return 'res/cards/back-side.png';
    }
}

export function suitToImgSrc(suit) {
    return `res/suits/${getCardSuitName(suit)}.png`;
}

export function getCardSuitName(suit) {
    switch (suit) {
        case CardModel.suits.club:
            return 'club';
        case CardModel.suits.diamond:
            return 'diamond';
        case CardModel.suits.heart:
            return 'heart';
        case CardModel.suits.spade:
            return 'spade';
    }
    console.log(`Unknown card suit ${suit}`);
}

export function getCardValueName(value) {
    switch (value) {
        case CardModel.values.jack:
            return 'jack';
        case CardModel.values.queen:
            return 'queen';
        case CardModel.values.king:
            return 'king';
        case CardModel.values.ten:
            return 'ten';
        case CardModel.values.ace:
            return 'ace';
    }
    console.log(`Unknown card value ${value}`);
}

export function canSwapTrump(card, talon) {
    return talon.canSwap && card.suit === talon.trump.suit && card.value === CardModel.values.jack;
}

export function hasMarriage(card, hand) {
    return [CardModel.values.queen, CardModel.values.king].includes(card.value)
        && getMarriageSuits(hand).includes(card.suit);
}

export function getMarriageSuits(hand) {
    const suits = [];
    for (const suit of Object.values(CardModel.suits)) {
        if (hand.some((c) => suit === c.suit && c.value === CardModel.values.queen)
            && hand.some((c) => suit === c.suit && c.value === CardModel.values.king)) {
            suits.push(suit);
        }
    }
    return suits;
}

export function sortHand(hand, trumpSuit) {
    return [...hand].sort((c1, c2) => {
        if (c1.suit !== c2.suit) {
            if (c1.suit === trumpSuit && c2.suit !== trumpSuit) {
                return 1;
            } else if (c1.suit !== trumpSuit && c2.suit === trumpSuit) {
                return -1;
            } else {
                const suits = Object.values(CardModel.suits);
                return suits.indexOf(c1.suit) - suits.indexOf(c2.suit);
            }

        } else {
            return c1.value - c2.value;
        }
    });
}
