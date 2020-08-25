// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { KeyCode } from "./KeyCode";
import Input, { $input as $Input, $input } from "./KU/Input";
import { Bound } from "./KU/QuadTree";
import QuadTreeManage from "./KU/QuadTreeManage";
import AABBCollision from "./KU/AABBCollision";
import PlayerBases from "./Base/PlayerBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class K extends PlayerBases {





    onLoad() {
        super.onLoad();

        this.anim_S = this.anim.play("K_stand");

    }

    start() {

        this.AnimUpdateMap = {};

        let K_stand = () => {
            // if ($Input.GetKeyDoubleClick(KeyCode.LeftArrow) || $Input.GetKeyDoubleClick(KeyCode.RightArrow)) {
            //     this.node.scaleX = this.face;
            //     this.anim_S = this.anim.play("K_runing");
            // }
            let lr = $Input.GetKey(KeyCode.LeftArrow) || $Input.GetKey(KeyCode.RightArrow);
            if (lr && $Input.GetKeyDownToLong(KeyCode.SPACE)) {
                this.node.scaleX = this.face;
                this.anim_S = this.anim.play("K_runing");
            }
            else if (Math.abs(this.faceVec) > 0.6) {
                this.node.scaleX = this.face;
                this.anim_S = this.anim.play("K_walk");
            } else if ($Input.GetKeyDown(KeyCode.SPACE)) {
                this.anim_S = this.anim.play("K_run_end");
            }
        }
        this.AnimUpdateMap["K_stand"] = K_stand.bind(this);


        let K_walk = () => {
            let lr = $Input.GetKey(KeyCode.LeftArrow) || $Input.GetKey(KeyCode.RightArrow);
            if (this.faceVec == 0) {
                this.anim_S = this.anim.play("K_stand");
            } else if (lr && $Input.GetKeyDownToLong(KeyCode.SPACE)) {
                this.node.scaleX = this.face;
                this.anim_S = this.anim.play("K_runing");
            }
            // if ($Input.GetKeyDoubleClick(KeyCode.LeftArrow) || $Input.GetKeyDoubleClick(KeyCode.LeftArrow)) {
            //     this.node.scaleX = this.face;
            //     this.anim_S = this.anim.play("K_runing");
            // }
        }
        this.AnimUpdateMap["K_walk"] = K_walk.bind(this);


        let K_runing = () => {
            if (this.faceVec == 0) {
                this.anim_S = this.anim.play("K_stand");
            } else if (!$Input.GetKeyDownToLong(KeyCode.SPACE)) {
                this.anim_S = this.anim.play("K_walk");
            }
        }
        this.AnimUpdateMap["K_runing"] = K_runing.bind(this);


        let K_run_end = () => {
            if (this.anim_S.time == this.anim_S.duration) {
                this.anim_S = this.anim.play("K_stand");
            }
        }
        this.AnimUpdateMap["K_run_end"] = K_run_end.bind(this);

    }





    /**  */
    private rub: number = 10 / 60;

    /** 重力 */
    private Gravity: number = 200;

    /** 加速度 */
    public accel: number = 100;


    public move(dt: number) {

        let l = $Input.GetKey(KeyCode.LeftArrow);
        let r = $Input.GetKey(KeyCode.RightArrow);

        // let axis = l ? -1 : (r ? 1 : 0);// 键盘朝向
        let axis = 0;
        axis += (l ? -1 : 0);
        axis += (r ? 1 : 0);

        if (axis != 0) {
            this.face = axis
            this.faceVec += axis * this.rub;

            if (this.faceVec > 1) this.faceVec = 1;
            if (this.faceVec < -1) this.faceVec = -1;
        } else {
            let val = (Math.abs(this.faceVec) - this.rub);
            val = Math.max(0, val);
            this.faceVec = axis * val;
        }


        // 左右移动加速





        // 重力
        let selfBound = this.GetSelfBound();
        selfBound.y -= 1;
        let qtA = QuadTreeManage.Inst().Retrieve("", selfBound);
        for (let i = 0; i < qtA.length; i++) {
            if (AABBCollision.HitboxToHitbox(qtA[i], selfBound)) {

            }
        }





    }



    private AnimUpdateMap: { [name: string]: Function }

    private dddt = 0;


    update(dt) {

        return;

        this.move(dt);




        this.AnimUpdateMap[this.anim_S.name]();

    }


}
