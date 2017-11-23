import {Player, PLAYER_TYPE_0, PLAYER_TYPE_X} from './Player'
import {Game} from './Game'
import {View} from './View'

let game = new Game(new View());

let myPlayer = new Player(PLAYER_TYPE_X);
let opponentPlayer = new Player(PLAYER_TYPE_0);

myPlayer.myHit((g) => {

    console.log('myPlayer.myHit');

    // g.onCellClick((position) => {
    let position = g.getRandomEmptyPosition();
    console.log('onCellClick > . нажато %s', position);
    g.makeHit(position)
    // });
});

opponentPlayer.myHit((g) => {
    console.log('opponentPlayer.myHit');
    g.makeHit(g.getRandomEmptyPosition());
});

game.addPlayer(myPlayer);
game.addPlayer(opponentPlayer);

game.start();
