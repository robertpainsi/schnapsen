import {sigmoid} from "../utils/utils.js";

export default class Matrix {
    #rows;
    #cols;
    #m;

    constructor(rows, cols, m = null) {
        this.#rows = rows;
        this.#cols = cols;
        if (m === null) {
            this.#m = [];
            for (let i = 0; i < this.#rows; i++) {
                const a = [];
                for (let k = 0; k < this.#cols; k++) {
                    a.push(0);
                }
                this.#m.push(a);
            }
        } else {
            this.#m = m;
        }
    }

    static singleColumnMatrixFromArray(array) {
        const result = new Matrix(array.length, 1);
        for (let i = 0; i < array.length; i++) {
            result.#m[i][0] = array[i];
        }
        return result;
    }

    dot(n) {
        if (this.#cols !== n.#rows) {
            throw new Error(this.#cols + " != " + n.#rows);
        }

        const result = new Matrix(this.#rows, n.#cols);
        for (let i = 0; i < this.#rows; i++) {
            for (let j = 0; j < n.#cols; j++) {
                let sum = 0;
                for (let k = 0; k < this.#cols; k++) {
                    sum += this.#m[i][k] * n.#m[k][j];
                }
                result.#m[i][j] = sum;
            }
        }
        return result;
    }

    addBias() {
        const n = new Matrix(this.#rows + 1, 1);
        for (let i = 0; i < this.#rows; i++) {
            n.#m[i][0] = this.#m[i][0];
        }
        n.#m[this.#rows][0] = 1;
        return n;
    }

    activate() {
        const n = new Matrix(this.#rows, this.#cols);
        for (let i = 0; i < this.#rows; i++) {
            for (let j = 0; j < this.#cols; j++) {
                n.#m[i][j] = sigmoid(this.#m[i][j]);
            }
        }
        return n;
    }

    toArray() {
        const result = [];
        for (let i = 0; i < this.#rows; i++) {
            result.push(...this.#m[i]);
        }
        return result;
    }
}
