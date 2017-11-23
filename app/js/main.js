import {Player, PLAYER_TYPE_0, PLAYER_TYPE_X} from './Player'
import {Game} from './Game'
import {View} from './View'

let game = new Game(new View('#game'));

let myPlayer = new Player(PLAYER_TYPE_X);
let opponentPlayer = new Player(PLAYER_TYPE_0);

myPlayer.myHit((g) => {
    setTimeout(() => {
        console.log('myPlayer.myHit');

        // g.onCellClick((position) => {
        let position = g.getRandomEmptyPosition();
        console.log('onCellClick > . нажато %s', position);
        g.makeHit(position)
        // });
    }, 500);
});

opponentPlayer.myHit((g) => {
    setTimeout(() => {
        console.log('opponentPlayer.myHit');
        g.makeHit(g.getRandomEmptyPosition());
    }, 500);
});

game.addPlayer(myPlayer);
game.addPlayer(opponentPlayer);

game.start();

function bar() {
    console.log('bar');
}

async function foo() {
    await bar();
}

foo();

let x = 5;

let a = do {
    if (x > 10) {
        'big';
    } else {
        'small';
    }
};

console.log(a);