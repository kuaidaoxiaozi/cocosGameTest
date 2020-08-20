// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EntityBase from "./EntityBase";
import { Bound } from "../KU/QuadTree";
import { AABBCollision } from "../KU/AABBCollision";
import { QuadTreeManage } from "../KU/QuadTreeManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerBases extends EntityBase {

    @property(cc.Node)
    collBox: cc.Node = null;

    @property(cc.Node)
    attackBox: cc.Node = null;

    @property(cc.Animation)
    anim: cc.Animation = null;


    public face = 1;
    public faceVec = 0;

    public speed_X = 0;
    public speed_Y = 0;

    public anim_S: cc.AnimationState;


    /** 是否进行动画位移 */
    @property(Boolean)
    public IsAnimOffset: Boolean = false;
    /** 动画位移量 */
    @property(Number)
    public AnimOffset: number = 0;



    onLoad() {
        super.onLoad();
        if (this.anim == null)
            this.anim = this.node.getComponent(cc.Animation);

    }


    public GetCollBoxBound(): Bound {
        let cb = this.GetBound(this.collBox);
        return cb;
    }

    public IsCollideToMove(x: number, y: number): boolean {
        let cb = this.GetCollBoxBound();
        cb.x += x;
        cb.y += y;
        let qt = QuadTreeManage.Inst().Retrieve("", cb);

        for (let i = 0; i < qt.length; i++) {
            if (AABBCollision.HitboxToHitbox(cb, qt[i]))
                return true
        }

        return false;
    }


    public GetAttackBoxBound(): Bound {
        let cb = this.GetBound(this.attackBox);
        return cb;
    }

    // public Maxspeed(mX: number, mY: number) {
    //     if (Math.abs(this.speed_X) > mX)
    //         this.speed_X = this.Sign(this.speed_X) * mX;
    //     if (Math.abs(this.speed_Y) > mY)
    //         this.speed_Y = this.Sign(this.speed_Y) * mY;
    // }


    /** 标记 大于0 => 1，等于0 => 0，小于0 => -1 */
    public Sign(n: number): number {
        return (n > 0 ? 1 : (n < 0 ? -1 : 0))
    }



}
