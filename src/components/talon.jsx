import React from "react";
import Card from "./card";
import Suit from './suit';

class Talon extends React.Component {

    constructor(props) {
        super(props);

        const {talon} = this.props;
        talon.addEventListener('close', () => this.forceUpdate());
        talon.addEventListener('swap-trump', () => this.forceUpdate());
    }

    render() {
        const {talon} = this.props;
        const {trump, isClosed, isEmpty} = talon;

        let cards = talon.cards;
        if (!isClosed) {
            cards = cards.filter((card) => !(card.suit === trump.suit && card.value === trump.value));
        }
        return (
            <div className="schnapsen-talon schnapsen-height my-3">
                {!isEmpty && <>
                    {cards.map((card, i) => <Card key={card.symbol} card={card} onClick={() => {
                        if (talon.canClose) {
                            talon.close()
                        }
                    }}/>)}
                    {!isClosed && <Card card={trump} className="schnapsen-trump" onClick={() => {
                        if (talon.canClose) {
                            talon.close()
                        }
                    }}/>}
                </>}
                <Suit suit={trump.suit}/>
            </div>
        );
    }
}

export default Talon;
