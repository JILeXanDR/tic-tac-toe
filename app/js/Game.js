import {getPositionByCell, getCellByPosition} from './helpers'
import {Position} from './Position'

export const GAME_STATUS_NOT_STARTED = 'not_started';
export const GAME_STATUS_ACTIVE = 'active';
export const GAME_STATUS_FINISHED = 'finished';

export class Game {

    instanceProperty = "bork";

    boundFunction = () => {
        return this.instanceProperty;
    };

    /**
     *
     * @param {View} view
     */
    constructor(view) {
        this.hits = {};
        this.status = GAME_STATUS_NOT_STARTED;
        this.currentPlayer = null;
        this.opponentPlayer = null;
        this.players = [];
        this.view = view;

        /**
         * {position}
         * @type {null}
         */
        this.onCellClickCb = null;
    }

    /**
     *
     * @param {Player} player
     */
    addPlayer(player) {
        this.players.push(player);
    }

    /**
     *
     * @returns {Position}
     */
    getRandomEmptyPosition() {

        let positions = Object.keys(this.getEmptyPositions());

        if (!positions.length) {
            throw new Error('уже нет свободных полей');
        }

        return positions[Math.floor(Math.random() * positions.length)];
    }

    /**
     *
     * @returns {{}}
     */
    getEmptyPositions() {

        let empty = {};

        for (let positionStr in this.hits) {
            let value = this.hits[positionStr];
            if (!value) {
                empty[positionStr] = value;
            }
        }

        return empty;
    }

    calculateResult() {
        try {
            this.getRandomEmptyPosition();
        } catch (e) {
            this.status = GAME_STATUS_FINISHED;
            console.log('игра окончена');
        }
    }

    /**
     *
     * @param {Position} position
     */
    makeHit(position) {

        console.log('makeHit => ', position);

        if (this.status === GAME_STATUS_NOT_STARTED) {
            alert('игра не начата');
            return;
        }

        if (this.status === GAME_STATUS_FINISHED) {
            alert('игра окончена');
            return;
        }

        let cellEl = getCellByPosition(position),
            value = this.hits[position];

        if (value) {
            alert('клетка занята');
            return;
        }

        cellEl.textContent = this.currentPlayer.value;

        this.hits[position] = this.currentPlayer.value;

        this.calculateResult();

        if (this.status !== GAME_STATUS_FINISHED) {
            this.nextPlayer();
        }
    }

    passHitToCurrentPlayer() {
        console.log('текущий игрок %s', this.currentPlayer.value);
        this.currentPlayer.myHit(this);
    }

    nextPlayer() {

        if (!this.currentPlayer && !this.opponentPlayer) {
            this.currentPlayer = this.players[0];
            this.opponentPlayer = this.players[1];
        } else {
            [this.currentPlayer, this.opponentPlayer] = [this.opponentPlayer, this.currentPlayer];
        }

        this.passHitToCurrentPlayer();
    }

    onCellClick(cb) {
        if (typeof cb === "function") {
            this.onCellClickCb = cb;
        } else if (typeof cb === "object" && typeof this.onCellClickCb === "function") {
            this.onCellClickCb.call(null, cb);
        }
    }

    start() {

        console.info('start game');

        this.view.draw();

        this.view.cells((el) => {
            this.hits[getPositionByCell(el)] = null;
        });

        this.view.onCellClick(({cellEl, position}) => {
            if (typeof this.currentPlayer.onCellClickFn === "function") {
                this.currentPlayer.onCellClickFn.call(null, {
                    g: this,
                    position: position,
                });
            }
        });

        this.status = GAME_STATUS_ACTIVE;
        console.log('игра начата');

        this.nextPlayer();
    }
}
