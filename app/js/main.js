import {Player, PLAYER_TYPE_0, PLAYER_TYPE_X} from './Player'
import {Game} from './Game'
import {View} from './View'

let game = new Game(new View('#game')),
    myPlayer = new Player(PLAYER_TYPE_X),
    opponentPlayer = new Player(PLAYER_TYPE_0);

myPlayer.myHit((g) => g.makeHit(g.getRandomEmptyPosition()));
opponentPlayer.onCellClick(({g, position}) => g.makeHit(position));

game.addPlayer(myPlayer);
game.addPlayer(opponentPlayer);

game.start();
