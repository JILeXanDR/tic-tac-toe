import {Player, PLAYER_TYPE_0, PLAYER_TYPE_X} from './Player'
import {Game} from './Game'
import {View} from './View'
import './network'

let game = new Game(new View('#game')),
    opponentPlayer = new Player(PLAYER_TYPE_X),
    myPlayer = new Player(PLAYER_TYPE_0);

try {
    // myPlayer.onCellClick(({g, position}) => g.makeHit(position));
    // opponentPlayer.onMyHitFn = (g) => g.makeHit(g.getRandomEmptyPosition());
    myPlayer.onMyHitFn = (g) => setTimeout(() => g.makeHit(g.getRandomEmptyPosition()), 100);
    opponentPlayer.onMyHitFn = (g) => setTimeout(() => g.makeHit(g.getRandomEmptyPosition()), 100);
} catch (e) {
    console.error(e.message);
}

game.addPlayer(myPlayer);
game.addPlayer(opponentPlayer);

game.start();

document.querySelector('#newGame').addEventListener('click', (e) => {
    game.start();
});
