import React from "react";
import Card from './card';

class Tricks extends React.Component {
    render() {
        const {player} = this.props;
        const {tricks} = player;
        return (
            <div className="schnapsen-tricks schnapsen-height my-2">
                {tricks.map(({cards}) => {
                    const [card1, card2] = cards;
                    return (
                        <div key={card1.symbol + card2.symbol} className="schnapsen-trick">
                            <Card card={card1}/>
                            <Card card={card2}/>
                        </div>
                    );
                })}
            </div>
        )
    }
}

export default Tricks;
