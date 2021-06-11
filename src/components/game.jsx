import React from "react";
import Player from './player';
import Talon from './talon';
import Card from './card';

class Game extends React.Component {

    #game;
    #gameLogic;
    #player;
    #opponent;

    constructor(props) {
        super(props);

        const {data} = props;
        this.#game = data.game;
        this.#gameLogic = data.gameLogic;
        this.#player = data.player;
        this.#opponent = data.opponent;

        this.#gameLogic.initNewGame();
        this.#gameLogic.addEventListener('init-new-game', () => {
            this.#gameLogic.initNewGame();
            this.forceUpdate();
        });
        this.#gameLogic.addEventListener('init-new-round', () => {
            this.setState({
                playerMove: null,
                opponentMove: null,
            })
        });
        this.#gameLogic.addEventListener('end-game', () => {
            this.setState({
                playerMove: null,
                opponentMove: null,
            })
        });
        this.#gameLogic.addEventListener('player-move', ({move, player: p}) => {
            if (p === this.#player) {
                this.setState({playerMove: move});
            } else {
                this.setState({opponentMove: move});
            }
        });

        this.state = {
            playerMove: null,
            opponentMove: null,
        };
    }

    componentDidMount() {
        this.#gameLogic.run().catch(console.error);
    }

    render() {
        const {playerMove, opponentMove} = this.state;
        const {talon} = this.#game;

        return (
            <div>
                <Player player={this.#opponent} talon={talon}/>

                <div className="d-flex">
                    <Talon talon={talon}/>
                    <div className="d-flex">
                        {opponentMove && <Card card={opponentMove.card} className="align-self-start m-1"/>}
                        {playerMove && <Card card={playerMove.card} className="align-self-end m-1"/>}
                    </div>
                </div>

                <Player player={this.#player} talon={talon} reverse={true} opponentMove={opponentMove}/>
            </div>
        );
    }
}

export default Game;
