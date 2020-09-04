// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Bound } from "./KU/QuadTree";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Tile extends cc.Component {

    @property()
    climb: boolean = false;


    public GetBound(): Bound {
        let tile = this.node;
        let t: Bound = new Bound();
        let tp = tile.convertToWorldSpaceAR(new cc.Vec2(0, 0));
        t.x = tp.x;
        t.y = tp.y;
        t.width = tile.width;
        t.height = tile.height;
        t.climb = this.climb;
        return t
    }


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}
}
