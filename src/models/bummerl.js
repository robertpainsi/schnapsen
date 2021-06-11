export class Bummerl {
    static types = {
        bummerl: 'bummerl',
        schneider: 'schneider',
    }

    static points = {
        bummerl: 1,
        schneider: 2,
    }

    #type;

    constructor(type) {
        this.#type = type;
    }

    get value() {
        return Bummerl.points[this.#type];
    }
}
