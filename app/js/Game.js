import {Position} from './Position'
import {PLAYER_TYPE_X, PLAYER_TYPE_0} from "./Player";

export const GAME_STATUS_NOT_STARTED = 'not_started';
export const GAME_STATUS_ACTIVE = 'active';
export const GAME_STATUS_FINISHED = 'finished';

export class Game {

    _status = null;
    _currentPlayer = null;
    _opponentPlayer = null;
    _players = [];
    _onCellClickCb = null;
    _view = null;
    _matrix = null;

    _winnableLines = [
        [[1, 1], [2, 1], [3, 1]], // horizontal line 1
        [[1, 2], [2, 2], [3, 2]], // horizontal line 2
        [[1, 3], [2, 3], [3, 3]], // horizontal line 3
        [[1, 1], [1, 2], [1, 3]], // vertical line 1
        [[2, 1], [2, 2], [2, 3]], // vertical line 2
        [[3, 1], [3, 2], [3, 3]], // vertical line 3
        [[1, 1], [2, 2], [3, 3]], // diagonal 1
        [[3, 1], [2, 2], [1, 3]], // diagonal 2
    ];

    _emptyMatrix() {
        return [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
    }

    /**
     *
     * @param {View} view
     */
    constructor(view) {
        this._view = view;
    }

    start() {

        this._matrix = this._emptyMatrix();
        this._status = GAME_STATUS_NOT_STARTED;

        this._view.draw();

        console.info('start game');

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

    _getFromMatrix(position) {
        return this._matrix[position.y - 1][position.x - 1];
    }

    _setToMatrix(position, player) {
        this._matrix[position.y - 1][position.x - 1] = player;
    }

    /**
     *
     * @param {Position} position
     */
    makeHit(position) {

        if (this._status === GAME_STATUS_NOT_STARTED) {
            throw new Error('игра не начата');
        }

        if (this._status === GAME_STATUS_FINISHED) {
            throw new Error('игра окончена');
        }

        console.log('position', position);

        if (this._getFromMatrix(position)) {
            throw new Error('клетка занята');
        }

        this._view.setCellPlayerByPosition(position, this._currentPlayer);
        this._setPlayerInMatrix(this._currentPlayer, position);
        this._calculateResult();

        if (this._status !== GAME_STATUS_FINISHED) {
            this._nextPlayer();
        } else {
            console.log('игра окончена');
        }
    }

    _setPlayerInMatrix(player, position) {
        this._setToMatrix(position, player);
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

        let positions = this.getEmptyPositions();

        if (!positions.length) {
            throw new Error('уже нет свободных полей');
        }

        return Position.createFromString(positions);
    }

    /**
     *
     * @returns {Array}
     */
    getEmptyPositions() {

        let positions = [];

        for (let y in this._matrix) {
            for (let x in this._matrix[y]) {
                let value = this._matrix[y][x];
                if (!value) {
                    positions.push(`${parseInt(x) + 1},${parseInt(y) + 1}`);
                }
            }
        }

        return positions;
    }

    /**
     *
     * @returns {Player}|null
     * @private
     */
    _checkWinner() {

        for (let lineId = 0; lineId < this._winnableLines.length; lineId++) {

            let linePositions = this._winnableLines[lineId],
                filledPositions = [];

            for (let i = 0; i < linePositions.length; i++) {
                let position = linePositions[i];
                let cell = this._getFromMatrix(new Position(position[0], position[1]));
                if (cell) {
                    filledPositions.push(this._getFromMatrix(new Position(position[0], position[1])));
                }
            }

            if (filledPositions.length === 3) {
                filledPositions = filledPositions.filter((v) => {
                    return filledPositions[0].type === v.type;
                });
                if (filledPositions.length === 3) {
                    return {
                        lineId,
                        winner: filledPositions[0],
                    };
                }
            }
        }

        return null;
    }

    _calculateResult() {

        try {

            let res = this._checkWinner();

            if (res && res.winner) {
                this._view.drawLine(this._winnableLines[res.lineId]);
                this._status = GAME_STATUS_FINISHED;
            } else {
                this.getRandomEmptyPosition();
            }

        } catch (e) {
            this._status = GAME_STATUS_FINISHED;
        }
    }

    _passHitToCurrentPlayer() {
        if (typeof this._currentPlayer.onMyHitFn === "function") {
            this._currentPlayer.onMyHitFn.call(null, this);
        }
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
