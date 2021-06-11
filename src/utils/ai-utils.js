import fs from "fs";
import NeuralNetwork from "../ai/neural-network.js";
import Matrix from "../ai/matrix.js";

export function loadNeuralNetwork(file) {
    const trainingNetwork = JSON.parse(fs.readFileSync(file, 'utf8'));
    return new NeuralNetwork(trainingNetwork.neuralNetwork.layers.map(({rows, cols, m}) => new Matrix(rows, cols, m)));
}
