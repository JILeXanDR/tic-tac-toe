import {getPositionByCell, getCellByPosition} from './helpers'
import {Position} from './Position'
import {PLAYER_TYPE_X, PLAYER_TYPE_0} from "./Player";

export const GAME_STATUS_NOT_STARTED = 'not_started';
export const GAME_STATUS_ACTIVE = 'active';
export const GAME_STATUS_FINISHED = 'finished';

export class Game {

    _hits = {};
    _status = GAME_STATUS_NOT_STARTED;
    _currentPlayer = null;
    _opponentPlayer = null;
    _players = [];
    _onCellClickCb = null;
    _view = null;

    _matrix = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];

    /**
     *
     * @param {View} view
     */
    constructor(view) {
        this._view = view;
    }

    start() {

        console.info('start game');

        this._matrix.forEach((xValue, xIndex) => {
            this._matrix.forEach((yValue, yIndex) => {
                let [x, y] = [xIndex + 1, yIndex + 1];
                this._hits[new Position(x, y)] = 0;
            });
        });

        this._view.onCellClick((position) => {
            if (typeof this._currentPlayer.onCellClickFn === "function") {
                this._currentPlayer.onCellClickFn.call(null, {
                    g: this,
                    position: position,
                });
            }
        });

        this._status = GAME_STATUS_ACTIVE;
        console.log('игра начата');

        this._nextPlayer();
    }

    /**
     *
     * @param {Position} position
     */
    makeHit(position) {

        if (this._status === GAME_STATUS_NOT_STARTED) {
            alert('игра не начата');
            return;
        }

        if (this._status === GAME_STATUS_FINISHED) {
            alert('игра окончена');
            return;
        }

        if (this._hits[position]) {
            alert('клетка занята');
            return;
        }

        this._view.setCellPlayerByPosition(position, this._currentPlayer);
        this._setPlayerInMatrix(this._currentPlayer, position);
        this._calculateResult();

        if (this._status !== GAME_STATUS_FINISHED) {
            this._nextPlayer();
        }
    }

    _setPlayerInMatrix(player, position) {
        this._matrix[position.y - 1][position.x - 1] = player;
        this._hits[position] = player;
    }

    /**
     *
     * @param {Player} player
     */
    addPlayer(player) {
        if (player.type === PLAYER_TYPE_X) {
            this._players[0] = player;
        } else if (player.type === PLAYER_TYPE_0) {
            this._players[1] = player;
        }
    }

    onCellClick(cb) {
        if (typeof cb === "function") {
            this._onCellClickCb = cb;
        } else if (typeof cb === "object" && typeof this._onCellClickCb === "function") {
            this._onCellClickCb.call(null, cb);
        }
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

        let [x, y] = positions[Math.floor(Math.random() * positions.length)].split(',');

        return new Position(x, y);
    }

    /**
     *
     * @returns {{}}
     */
    getEmptyPositions() {

        let empty = {};

        for (let positionStr in this._hits) {
            let value = this._hits[positionStr];
            if (!value) {
                empty[positionStr] = value;
            }
        }

        return empty;
    }

    _calculateResult() {
        try {
            console.table(this._matrix);
            this.getRandomEmptyPosition();
        } catch (e) {
            this._status = GAME_STATUS_FINISHED;
            console.log('игра окончена');
        }
    }

    _passHitToCurrentPlayer() {
        console.log('текущий игрок %s', this._currentPlayer.type);
        this._currentPlayer.myHit(this);
    }

    _nextPlayer() {

        if (!this._currentPlayer && !this._opponentPlayer) {
            this._currentPlayer = this._players[0];
            this._opponentPlayer = this._players[1];
        } else {
            [this._currentPlayer, this._opponentPlayer] = [this._opponentPlayer, this._currentPlayer];
        }

        this._passHitToCurrentPlayer();
    }
}
