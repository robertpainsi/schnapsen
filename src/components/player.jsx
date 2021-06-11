import React from "react";
import Tricks from './tricks';
import Hand from './hand';
import Marriages from './marriages';
import State from './state';

class Player extends React.Component {
    render() {
        const {player, reverse, talon, opponentMove} = this.props;

        let upper = <Tricks player={player}/>;
        let middle = (
            <div>
                <Marriages player={player}/>
                <State player={player}/>
            </div>
        );
        let lower = <Hand player={player} talon={talon} opponentMove={opponentMove}/>;

        if (reverse) {
            [upper, middle, lower] = [lower, middle, upper];
        }

        return (
            <div>
                {upper}
                {middle}
                {lower}
            </div>
        );
    }
}

export default Player;
