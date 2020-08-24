// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ActorBehavior from "./ActorBehavior";
import { PlayerInfoData } from "../SkillInfo_Base";
import { QuadTreeManage } from "../KU/QuadTreeManage";
import { AABBCollision } from "../KU/AABBCollision";


/** 检测对象四周的碰撞情况 */
export default class CollisionBehavior extends ActorBehavior {

    public playerInfo: PlayerInfoData

    private sss() {
        let boubd = this.playerInfo.playerCollision.GetCollBoxBound();

        this.playerInfo.collision_Left =
            this.playerInfo.collision_Right =
            this.playerInfo.collision_Top =
            this.playerInfo.collision_Botton = false;


        let l = boubd.copy();
        l.x -= 1;
        let qt = QuadTreeManage.Inst().Retrieve("", l);
        for (let q of qt) {
            if (AABBCollision.HitboxToHitbox(q, l)) {
                this.playerInfo.collision_Left = true;
                break;
            }
        }

        let r = boubd.copy();
        r.x += 1;
        qt = QuadTreeManage.Inst().Retrieve("", r);
        for (let q of qt) {
            if (AABBCollision.HitboxToHitbox(q, r)) {
                this.playerInfo.collision_Right = true;
                break;
            }
        }

        let t = boubd.copy();
        t.y += 1;
        qt = QuadTreeManage.Inst().Retrieve("", t);
        for (let q of qt) {
            if (AABBCollision.HitboxToHitbox(q, t)) {
                this.playerInfo.collision_Top = true;
                break;
            }
        }

        let b = boubd.copy();
        b.y -= 1;
        qt = QuadTreeManage.Inst().Retrieve("", b);
        for (let q of qt) {
            if (AABBCollision.HitboxToHitbox(q, b)) {
                this.playerInfo.collision_Botton = true;
                break;
            }
        }
    }


    public update() {

        this.sss();

    }


}
