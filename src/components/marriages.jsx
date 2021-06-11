import React from "react";
import Suit from './suit';

class Marriages extends React.Component {
    render() {
        const {player} = this.props;
        const {marriages} = player;
        return (
            <div>
                {marriages.map(({suit}) => <Suit key={suit} suit={suit}/>)}
            </div>
        );
    }
}

export default Marriages;
