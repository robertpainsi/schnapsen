import React from "react";
import Card from './card';
import Marriage from '../models/marriage';
import {canSwapTrump, getPlayableCards, hasMarriage, sortHand} from '../utils/schnapsen-utils';
import ViewWithHoveringButton from './view-with-hovering-button';

class Hand extends React.Component {
    constructor(props) {
        super(props);

        const {player} = this.props;
        player.addEventListener('swap-card', () => this.forceUpdate());
    }

    render() {
        const {player, talon, opponentMove} = this.props;
        const {trump} = talon;
        const isFirstPlayer = !opponentMove;

        const hand = sortHand(player.hand, trump.suit);
        const playableCards = getPlayableCards(hand, talon, opponentMove?.card);
        return (
            <div className="schnapsen-height">
                {hand.map((card) => {
                    const playableCard = playableCards.includes(card);
                    const cardView = <Card key={card.symbol} className={`mx-1 ${playableCard ? '' : 'grey-out'}`}
                                           card={card} onClick={() => {
                        if (playableCard) {
                            player.playCard(card)
                        }
                    }}/>;
                    if (isFirstPlayer) {
                        if (canSwapTrump(card, talon)) {
                            return (
                                <ViewWithHoveringButton key={card.symbol} disabled={!playableCard} onClick={(e) => {
                                    e.preventDefault();
                                    const swappedTrump = talon.swapTrump(card);
                                    player.swapCard(card, swappedTrump);
                                }} buttonContent={<span>swap</span>}>
                                    {cardView}
                                </ViewWithHoveringButton>
                            );
                        } else if (hasMarriage(card, hand)) {
                            return (
                                <ViewWithHoveringButton key={card.symbol} disabled={!playableCard} onClick={(e) => {
                                    e.preventDefault();
                                    player.addMarriage(new Marriage(card.suit, card.suit === trump.suit ? 40 : 20));
                                    player.playCard(card);
                                    this.forceUpdate();
                                }} buttonContent={<span>marriage</span>}>
                                    {cardView}
                                </ViewWithHoveringButton>
                            );
                        }
                    }
                    return cardView;

                })}
            </div>
        );
    }
}

export default Hand;
