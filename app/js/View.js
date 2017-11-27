import {Position} from './Position'
import {PLAYER_TYPE_X, PLAYER_TYPE_0} from "./Player";

export class View {

    _canvasEl = null;
    _onCellClickFn = null;
    _cellSize = 100;
    _context = null;
    _padding = 10;
    _eventAttached = false;

    constructor(appendTo) {
        this._canvasEl = document.querySelector(appendTo);
        this._context = this._canvasEl.getContext('2d');
    }

    onCellClick(fn) {
        this._onCellClickFn = fn;
    }

    /**
     *
     * @param {Position} position
     * @private
     */
    _getCellCoordinates(position) {

        let [endX, endY] = [position.x * this._cellSize, position.y * this._cellSize];
        let [startX, startY] = [endX - this._cellSize, endY - this._cellSize];

        return {
            from: new Position(startX, startY),
            to: new Position(endX, endY),
            center: new Position((startX + endX) / 2, (startY + endY) / 2),
        }
    }

    /**
     *
     * @param {Position} position
     * @private
     */
    _drawX(position) {

        let p = this._getCellCoordinates(position);

        this._context.strokeStyle = '#4973a7';

        this._context.beginPath();
        this._context.moveTo(p.from.x + this._padding, p.from.y + this._padding);
        this._context.lineTo(p.to.x - this._padding, p.to.y - this._padding);
        this._context.stroke();

        this._context.beginPath();
        this._context.moveTo(p.from.x + this._cellSize - this._padding, p.from.y + this._padding);
        this._context.lineTo(p.to.x - this._cellSize + this._padding, p.to.y - this._padding);
        this._context.stroke();
    }

    /**
     *
     * @param {Position} position
     * @private
     */
    _draw0(position) {

        let p = this._getCellCoordinates(position);

        this._context.strokeStyle = '#08de00';

        this._context.beginPath();
        this._context.arc(p.center.x, p.center.y, this._cellSize / 2 - this._padding, 0, 2 * Math.PI, false);
        this._context.stroke();
    }

    setCellPlayerByPosition(position, player) {

        this._context.lineWidth = 3;

        if (player.type === PLAYER_TYPE_X) {
            this._drawX(position);
        } else if (player.type === PLAYER_TYPE_0) {
            this._draw0(position);
        }
    }

    _coordinateToPosition(e) {
        let {offsetX: x, offsetY: y} = e;
        return new Position(Math.ceil(x / this._cellSize), Math.ceil(y / this._cellSize));
    }

    drawLine(linePositions) {

        let [cell1Coordinates, , cell2Coordinates] = linePositions;
        let c1 = this._getCellCoordinates(new Position(cell1Coordinates[0], cell1Coordinates[1]));
        let c2 = this._getCellCoordinates(new Position(cell2Coordinates[0], cell2Coordinates[1]));

        this._context.strokeStyle = '#ff0000';
        this._context.lineWidth = 5;
        this._context.beginPath();
        this._context.moveTo(c1.center.x, c1.center.y);
        this._context.lineTo(c2.center.x, c2.center.y);
        this._context.stroke();
    }

    draw() {

        this._context.clearRect(0, 0, this._canvasEl.width, this._canvasEl.height);

        if (!this._eventAttached) {
            this._eventAttached = true;
            this._canvasEl.addEventListener('click', (e) => this._onCellClickFn(this._coordinateToPosition(e)));
        }

        this._context.lineWidth = 1;
        this._context.strokeStyle = '#c1bfbf';

        for (let i = 1; i < 3; i++) {

            let [x, y] = [i * this._cellSize, 0];

            this._context.beginPath();
            this._context.moveTo(x, y);
            this._context.lineTo(x, 300);
            this._context.stroke();
        }

        for (let i = 1; i < 3; i++) {

            let [x, y] = [0, i * this._cellSize];

            this._context.beginPath();
            this._context.moveTo(x, y);
            this._context.lineTo(300, y);
            this._context.stroke();
        }
    }
}
