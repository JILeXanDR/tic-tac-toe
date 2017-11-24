import {getPositionByCell} from './helpers'

export class View {

    appendToEl = null;

    constructor(appendTo) {
        this.appendToEl = document.querySelector(appendTo);
    }

    cells(cb) {

        let elements = document.querySelectorAll('.js-cell');

        if (!cb) {
            return elements;
        }

        elements.forEach(cb);
    }

    onCellClick(fn) {
        this.cells((el) => {
            el.addEventListener('click', (e) => {
                fn({
                    cellEl: e.currentTarget,
                    position: getPositionByCell(e.currentTarget),
                });
            });
        });
    }

    content = '    <div class="area">\n' +
        '        <div class="cell-line">\n' +
        '            <div class="cell js-cell" data-position="[1,1]"></div>\n' +
        '            <div class="cell js-cell" data-position="[2,1]"></div>\n' +
        '            <div class="cell js-cell" data-position="[3,1]"></div>\n' +
        '        </div>\n' +
        '        <div class="cell-line">\n' +
        '            <div class="cell js-cell" data-position="[1,2]"></div>\n' +
        '            <div class="cell js-cell" data-position="[2,2]"></div>\n' +
        '            <div class="cell js-cell" data-position="[3,2]"></div>\n' +
        '        </div>\n' +
        '        <div class="cell-line">\n' +
        '            <div class="cell js-cell" data-position="[1,3]"></div>\n' +
        '            <div class="cell js-cell" data-position="[2,3]"></div>\n' +
        '            <div class="cell js-cell" data-position="[3,3]"></div>\n' +
        '        </div>\n' +
        '    </div>';

    draw() {

        let canvas = this.appendToEl;
        let ctx = canvas.getContext('2d');
        let size = 100;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                ctx.fillStyle = 'rgb(' + Math.floor(255 - 42.5 * i) + ', ' + Math.floor(255 - 42.5 * j) + ', 0)';
                ctx.fillRect(j * size, i * size, size, size);
            }
        }

        let area = document.createElement('div');
    }
}
