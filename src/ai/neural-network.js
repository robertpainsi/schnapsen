import Matrix from "./matrix.js";

export default class NeuralNetwork {
    #layers;

    constructor(layers) {
        this.#layers = layers;
    }

    output(input) {
        let matrix = Matrix.singleColumnMatrixFromArray(input);
        matrix = matrix.addBias();
        for (let i = 0; i < this.#layers.length; i++) {
            const layer = this.#layers[i];

            matrix = layer.dot(matrix);
            matrix = matrix.activate();
            if (i < this.#layers.length - 1) {
                matrix = matrix.addBias();
            }
        }
        return matrix.toArray();
    }
}
