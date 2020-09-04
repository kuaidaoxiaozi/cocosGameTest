// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ActorBehavior from "./ActorBehavior";
import QuadTreeManage from "../KU/QuadTreeManage";
import AABBCollision from "../KU/AABBCollision";
import PlayerInfoData from "../PlayerInfoData";


/** 检测对象四周的碰撞情况 */
export default class CollisionBehavior extends ActorBehavior {

    public playerInfo: PlayerInfoData

    private sss() {
        let bound = this.playerInfo.playerCollision.GetCollBoxBound();

        this.playerInfo.collision_Left =
            this.playerInfo.collision_Right =
            this.playerInfo.collision_Top =
            this.playerInfo.collision_Botton = false;


        let l = bound.copy();
        let l1 = bound.copy();
        l.x -= 1;
        let qt = QuadTreeManage.Inst().Retrieve("", l);
        for (let q of qt) {
            if (AABBCollision.HitboxToHitbox(q, l) == true && AABBCollision.HitboxToHitbox(q, l1) == false) {
                this.playerInfo.collision_Left = true;
                break;
            }
        }

        let r = bound.copy();
        let r1 = bound.copy();
        r.x += 1;
        qt = QuadTreeManage.Inst().Retrieve("", r);
        for (let q of qt) {
            if (AABBCollision.HitboxToHitbox(q, r) == true && AABBCollision.HitboxToHitbox(q, r1) == true) {
                this.playerInfo.collision_Right = true;
                break;
            }
        }

        let t = bound.copy();
        let t1 = bound.copy();
        t.y += 1;
        qt = QuadTreeManage.Inst().Retrieve("", t);
        for (let q of qt) {
            if (AABBCollision.HitboxToHitbox(q, t1) == false && AABBCollision.HitboxToHitbox(q, t) == true) {
                this.playerInfo.collision_Top = true;
                break;
            }
        }


        let b = bound.copy();
        let b1 = bound.copy();
        b.y -= 1;
        qt = QuadTreeManage.Inst().Retrieve("", b);
        for (let q of qt) {

            let h = AABBCollision.HitboxToHitbox(b, q)
            let h1 = AABBCollision.HitboxToHitbox(b1, q)

            if ((h == true && h1 == false)) {
                this.playerInfo.collision_Botton = true;
                break;
            }
        }
    }


    public update() {

        this.sss();

    }


}
