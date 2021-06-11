import Human from './human';
import Computer from './computer';
import GameLogic from '../logic/game-logic';
import Game from './game';
import NeuralNetwork from "../ai/neural-network";
import Matrix from "../ai/matrix";

export default function getGameData() {
    return new Promise(async (resolve, reject) => {
        const trainingNetwork = await (await fetch('data/ai/best.json')).json();
        console.log(`Training Network loaded`);

        const player = new Human();
        const opponent = new Computer(new NeuralNetwork(trainingNetwork.neuralNetwork.layers
            .map(({rows, cols, m}) => new Matrix(rows, cols, m))));
        const players = [player, opponent];
        const game = new Game(players);
        const gameLogic = new GameLogic(game);

        resolve({
            player,
            opponent,
            players,
            game,
            gameLogic,
        })
    })
}
