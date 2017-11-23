class Player {

    constructor(value) {
        this.value = value;
        this.processHitCb = undefined;
    }

    processHit(cb) {
        if (typeof cb === "function") {
            console.log('set processHit cb');
            this.processHitCb = cb;
        } else if (typeof cb === "object" && typeof this.processHitCb === "function") {
            console.log('run processHit cb');
            this.processHitCb.call(this, cb);
        }
    }
}

Player.TYPE_X = 'X';
Player.TYPE_0 = '0';

class Game {

    constructor() {
        this.hits = {};
        this.status = Game.STATUS_NOT_STARTED;
        this.currentPlayer = null;
        this.players = [];

        /**
         * {position}
         * @type {null}
         */
        this.onCellClickCb = null;
    }

    addPlayer(player) {
        this.players.push(player);
        return player;
    }

    getCellByPosition({x, y}) {
        return document.querySelector(`[data-position="[${x},${y}]"]`);
    }

    getPositionByCell(cellEl) {

        let position = JSON.parse(cellEl.getAttribute('data-position'));
        let [x, y] = position;

        return {x, y};
    }

    getRandomEmptyPosition() {

        for (let positionStr in this.hits) {
            let value = this.hits[positionStr];
            if (!value) {
                let pos = positionStr.split(',');
                let [x, y] = pos;

                return {x, y};
            }
        }

        throw new Error('уже нет свободных полей');
    }

    calculateResult() {
        try {
            this.getRandomEmptyPosition();
        } catch (e) {
            console.log(e);
            this.status = Game.STATUS_FINISHED;
        }
    }

    makeHit({player, opponent, position}) {

        if (this.status === Game.STATUS_NOT_STARTED) {
            alert('игра не начата');
            return;
        }

        if (this.status === Game.STATUS_FINISHED) {
            alert('игра окончена');
            return;
        }

        if (this.currentPlayer !== player) {
            alert('сейчас ход другого противника');
            return;
        }

        let cellEl = this.getCellByPosition(position);
        let value = this.hits[this.posToStr(position)];

        if (value) {
            alert('клетка занята');
            return;
        }

        cellEl.setAttribute('data-player', player.value);
        cellEl.textContent = player.value;

        this.hits[this.posToStr(position)] = player.value;

        this.calculateResult();

        // change player
        this.nextPlayer(opponent);

        // if (this.status === Game.STATUS_ACTIVE && this.currentPlayer === opponentPlayer) {
        //     this.hitByOpponent();
        // }
    }

    posToStr({x, y}) {
        return `${x},${y}`;
    }

    nextPlayer(player) {
        this.currentPlayer = player;
    }

    onCellClick(cb) {
        if (typeof cb === "function") {
            this.onCellClickCb = cb;
            console.log('this.onCellClickCb = cb', cb);
        } else if (typeof cb === "object" && typeof this.onCellClickCb === "function") {
            console.log('this.onCellClickCb.call(null, cb)');
            this.onCellClickCb.call(null, cb);
        }
    }

    start() {

        console.log('start game');

        document.querySelectorAll('.js-cell').forEach((el) => {

            this.hits[this.posToStr(this.getPositionByCell(el))] = null;

            el.addEventListener('click', (e) => {

                console.log('click');

                this.currentPlayer.onCellClick({
                    position: this.getPositionByCell(e.currentTarget)
                });

                this.currentPlayer.processHit({
                    g: this,
                    player: myPlayer,
                    opponent: opponentPlayer,
                });

                // this.onCellClick({
                //     player: myPlayer,
                //     opponent: opponentPlayer,
                //     position: this.getPositionByCell(e.currentTarget),
                // });
            });
        });

        this.currentPlayer = this.players[0];
        this.status = Game.STATUS_ACTIVE;
    }
}

Game.STATUS_NOT_STARTED = 'not_started';
Game.STATUS_ACTIVE = 'active';
Game.STATUS_FINISHED = 'finished';

let game = new Game();

let myPlayer = game.addPlayer(new Player(Player.TYPE_X));
myPlayer.processHit(({g, player, opponent}) => {
    console.log('myPlayer.processHit');
    g.onCellClick(({position}) => {
        console.log(position);
        g.makeHit({
            player: player,
            opponent: opponent,
            position: position
        })
    })
});

let opponentPlayer = game.addPlayer(new Player(Player.TYPE_0));
opponentPlayer.processHit(({g, player, opponent}) => g.makeHit({
    player: player,
    opponent: opponent,
    position: g.getRandomEmptyPosition()
}));

game.start();
