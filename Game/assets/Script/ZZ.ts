// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PlayerBases from "./Base/PlayerBase";
import { $input } from "./KU/Input";
import { KeyCode } from "./KeyCode";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ZZ extends PlayerBases {





    onLoad() {
        super.onLoad();
        this.anim_S = this.anim.play("zz_stand");






    }


    private AnimUpdateMap;


    start() {
        this.AnimUpdateMap = {};

        let K_stand = () => {
            // if ($Input.GetKeyDoubleClick(KeyCode.LeftArrow) || $Input.GetKeyDoubleClick(KeyCode.RightArrow)) {
            //     this.node.scaleX = this.face;
            //     this.anim_S = this.anim.play("K_runing");
            // }
            let lr = $input.GetKey(KeyCode.LeftArrow) || $input.GetKey(KeyCode.RightArrow);
            if (lr && $input.GetKeyDownToLong(KeyCode.SPACE)) {
                this.node.scaleX = this.face;
                this.anim_S = this.anim.play("zz_run");
            }
            else {
                this.node.scaleX = this.face;
                this.anim_S = this.anim.play("zz_run");
            }
        }
        this.AnimUpdateMap["zz_stand"] = K_stand.bind(this);


        let K_walk = () => {
            let lr = $input.GetKey(KeyCode.LeftArrow) || $input.GetKey(KeyCode.RightArrow);
            if (this.faceVec == 0) {
                this.anim_S = this.anim.play("K_stand");
            } else if (lr && $input.GetKeyDownToLong(KeyCode.SPACE)) {
                this.node.scaleX = this.face;
                this.anim_S = this.anim.play("K_runing");
            }
            // if ($Input.GetKeyDoubleClick(KeyCode.LeftArrow) || $Input.GetKeyDoubleClick(KeyCode.LeftArrow)) {
            //     this.node.scaleX = this.face;
            //     this.anim_S = this.anim.play("K_runing");
            // }
        }
        this.AnimUpdateMap["zz_walk"] = K_walk.bind(this);


        let K_runing = () => {
            if (this.faceVec == 0) {
                this.anim_S = this.anim.play("zz_stand");
            } else if (!$input.GetKeyDownToLong(KeyCode.SPACE)) {
                this.anim_S = this.anim.play("zz_walk");
            }
        }
        this.AnimUpdateMap["zz_runing"] = K_runing.bind(this);


        let K_run_end = () => {
            if (this.anim_S.time == this.anim_S.duration) {
                this.anim_S = this.anim.play("zz_stand");
            }
        }
        this.AnimUpdateMap["zz_run_end"] = K_run_end.bind(this);

    }




    /** 横向最大移动速度 */
    private speed_X_Max: number = 250;


    /** 摩擦力 */
    private friction: number = this.speed_X_Max / 0.1;
    /** 加速度 */
    private acce: number = this.speed_X_Max / 0.1;
    /** 重力 */
    private gravity: number = 180;





    private move(dt: number) {

        let l = $input.GetKey(KeyCode.LeftArrow);
        let r = $input.GetKey(KeyCode.RightArrow);

        // let axis = l ? -1 : (r ? 1 : 0);// 键盘朝向
        let axis = 0;
        axis += (l ? -1 : 0);
        axis += (r ? 1 : 0);

        if (axis != 0)
            this.face = axis;

        this.speed_X += (axis * this.acce * dt);

        if (axis == 0) {
            let s1 = Math.abs(this.speed_X) - (this.friction * dt);
            let s2 = Math.max(s1, 0);
            this.speed_X = s2 * this.face;
        }

        this.speed_X = this.face * Math.min(this.speed_X_Max, Math.abs(this.speed_X))



        this.node.x += this.speed_X * dt;
    }



    update(dt) {

        this.move(dt);



        this.AnimUpdateMap[this.anim_S.name]();


    }



}
