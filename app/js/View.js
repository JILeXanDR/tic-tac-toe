import {getPositionByCell, getCellByPosition} from './helpers'
import {Position} from './Position'

export class View {

    _canvasEl = null;
    _onCellClickFn = null;
    _cellSize = 100;

    constructor(appendTo) {
        this._canvasEl = document.querySelector(appendTo);
        this.draw();
    }

    onCellClick(fn) {
        this._onCellClickFn = fn;
    }

    setCellPlayerByPosition(position, player) {
        let cellEl = getCellByPosition(position);
        cellEl.textContent = player.type;
    }

    draw() {

        let ctx = this._canvasEl.getContext('2d');

        this._canvasEl.addEventListener('click', (e) => {
            let {offsetX: x, offsetY: y} = e;
            let position = new Position(Math.ceil(x / this._cellSize), Math.ceil(y / this._cellSize));
            this._onCellClickFn.call(null, position);
        });

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                ctx.fillStyle = 'rgb(' + Math.floor(255 - 42.5 * i) + ', ' + Math.floor(255 - 42.5 * j) + ', 0)';
                let [x, y] = [j * this._cellSize, i * this._cellSize];
                ctx.fillRect(x, y, this._cellSize, this._cellSize);
            }
        }
    }
}
