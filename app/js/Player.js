export const PLAYER_TYPE_X = 'X';
export const PLAYER_TYPE_0 = '0';

export class Player {

    type = undefined;
    onMyHitFn = () => {};
    onCellClickFn = () => {};
    onMotionFn = () => {};

    constructor(type) {
        this.type = type;
    }

    onCellClick(fn) {
        this.onCellClickFn = fn;
    }
}
