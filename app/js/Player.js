export const PLAYER_TYPE_X = 'X';
export const PLAYER_TYPE_0 = '0';

// function hello(value = 'noValue') {
//     console.log('hello => %s', value);
// }

// @hello(1)
export class Player {

    constructor(value) {
        this.value = value;
        this.processHitCb = undefined;
    }

    myHit(cbOrData) {
        if (typeof cbOrData === "function") {
            console.log('set myHit cb');
            this.processHitCb = cbOrData;
        } else if (typeof cbOrData === "object" && typeof this.processHitCb === "function") {
            console.log('run myHit cb');
            this.processHitCb.apply(this, [cbOrData]);
        }
    }
}
