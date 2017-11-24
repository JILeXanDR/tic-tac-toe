export const PLAYER_TYPE_X = 'X';
export const PLAYER_TYPE_0 = '0';

export class Player {

    value = undefined;
    onMyHitFn = undefined;
    onCellClickFn = undefined;

    constructor(value) {
        this.value = value;
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

    // cellClicked(cbOrData) {
    //     if (typeof cbOrData === "function") {
    //         this.onCellClickFn = cbOrData;
    //     } else if (typeof cbOrData === "object" && typeof this.onCellClickFn === "function") {
    //         this.onCellClickFn.apply(this, [cbOrData]);
    //     }
    // }
}
