export const PLAYER_TYPE_X = 'X';
export const PLAYER_TYPE_0 = '0';

export class Player {

    type = undefined;
    onMyHitFn = undefined;
    onCellClickFn = undefined;

    constructor(type) {
        this.type = type;
    }

    myHit(cbOrData) {
        if (typeof cbOrData === "function") {
            this.onMyHitFn = cbOrData;
        } else if (typeof cbOrData === "object" && typeof this.onMyHitFn === "function") {
            this.onMyHitFn.apply(this, [cbOrData]);
        }
    }

    onCellClick(fn) {
        this.onCellClickFn = fn;
    }
}
