import React from "react";

class State extends React.Component {
    render() {
        const {player} = this.props;
        return (
            <small>{player.tricksValue} | {player.points} | {player.bummerlValue}</small>
        );
    }
}

export default State;
