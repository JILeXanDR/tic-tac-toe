export class Position {

    constructor(x, y) {
        if (parseInt(x) !== x || parseInt(y) !== y) {
            throw new TypeError('not integer');
        }
        this.x = x;
        this.y = y;
    }

    toString() {
        return `${this.x},${this.y}`;
    }

    /**
     *
     * @param {Array} positions
     */
    static createFromString(positions) {

        let [x, y] = positions[Math.floor(Math.random() * positions.length)].split(',');

        return new Position(parseInt(x), parseInt(y));
    }
}
