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


        let as: cc.AnimationState = this.anim.getAnimationState("zz_stand");


    }


    private AnimUpdateMap: { [name: string]: Function };


    start() {
        let self = this;
        this.AnimUpdateMap = {};

        let zz_stand = () => {

            let l = $input.GetKeyState(KeyCode.LeftArrow) > 0;
            let r = $input.GetKeyState(KeyCode.RightArrow) > 0;

            let axis = 0;
            axis += (l ? -1 : 0);
            axis += (r ? 1 : 0);

            let j = $input.GetKeyState(KeyCode.X) > 0;

            if (axis != 0) {
                self.anim_S = self.anim.play("zz_run");
            } else {
                if (j) {
                    self.anim_S = self.anim.play("zz_qlz_1");
                }
            }

        }
        zz_stand.bind(self);
        self.AnimUpdateMap["zz_stand"] = zz_stand;


        let zz_run = (dt) => {

            let l = $input.GetKeyState(KeyCode.LeftArrow) > 0;
            let r = $input.GetKeyState(KeyCode.RightArrow) > 0;

            let axis = 0;
            axis += (l ? -1 : 0);
            axis += (r ? 1 : 0);

            if (axis == 0 && self.speed_X == 0) {
                self.anim_S = self.anim.play("zz_stand");
            }

            let j = $input.GetKeyState(KeyCode.X) > 0;
            if (j) {
                self.speed_X == 0
                self.anim_S = self.anim.play("zz_attack");
            }

            self.move(dt);
        }
        zz_run.bind(self);
        self.AnimUpdateMap["zz_run"] = zz_run;

        let zz_attack = () => {
            if (self.anim_S.time >= self.anim_S.duration) {

                let l = $input.GetKeyState(KeyCode.LeftArrow) > 0;
                let r = $input.GetKeyState(KeyCode.RightArrow) > 0;

                let axis = 0;
                axis += (l ? -1 : 0);
                axis += (r ? 1 : 0);

                if (axis != 0) {
                    self.node.x += axis * 45;
                    self.anim_S = self.anim.play("zz_run");
                } else {
                    self.node.x += self.face * 45;
                    self.anim_S = self.anim.play("zz_stand");
                }
            }
        }
        zz_attack.bind(self);
        self.AnimUpdateMap["zz_attack"] = zz_attack;





        let zz_qlz_1 = () => {
            let tick = 1 / self.anim_S.clip.sample;
            if (self.anim_S.time >= self.anim_S.duration) {
                self.anim_S = self.anim.play("zz_stand");
            }
            else if (self.anim_S.time > tick * 4) {
                if ($input.GetKeyState(KeyCode.X)) {
                    self.anim_S = self.anim.play("zz_qlz_2");
                }
            }
        }
        zz_qlz_1.bind(self);
        self.AnimUpdateMap["zz_qlz_1"] = zz_qlz_1;

        let zz_qlz_2 = () => {
            let tick = 1 / self.anim_S.clip.sample;
            if (self.anim_S.time >= self.anim_S.duration) {
                self.anim_S = self.anim.play("zz_stand");
            } else if (self.anim_S.time > tick * 4) {
                if ($input.GetKeyState(KeyCode.X)) {
                    self.anim_S = self.anim.play("zz_qlz_3");
                }
            }
        }
        zz_qlz_2.bind(self);
        self.AnimUpdateMap["zz_qlz_2"] = zz_qlz_2;

        let zz_qlz_3 = () => {
            let tick = 1 / self.anim_S.clip.sample;
            if (self.anim_S.time >= self.anim_S.duration) {
                self.anim_S = self.anim.play("zz_stand");
            } else if (self.anim_S.time > tick * 7) {
                if ($input.GetKeyState(KeyCode.X)) {
                    self.anim_S = self.anim.play("zz_qlz_4");
                }
            }
        }
        zz_qlz_3.bind(self);
        self.AnimUpdateMap["zz_qlz_3"] = zz_qlz_3;

        let zz_qlz_4 = () => {

            if (self.anim_S.time >= self.anim_S.duration) {
                self.anim_S = self.anim.play("zz_stand");
            }
        }
        zz_qlz_4.bind(self);
        self.AnimUpdateMap["zz_qlz_4"] = zz_qlz_4;
    }




    /** 横向最大移动速度 */
    private speed_X_Max: number = 300;


    /** 摩擦力 */
    private friction: number = this.speed_X_Max / 0.05;
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

        if (axis != 0) {
            this.face = axis;
            this.node.scaleX = 2 * axis;
        }

        this.speed_X += (axis * this.acce * dt);

        if (axis == 0) {
            let s1 = Math.abs(this.speed_X) - (this.friction * dt);
            let s2 = Math.max(s1, 0);
            this.speed_X = s2 * this.face;
        }

        if (Math.abs(this.speed_X) > this.speed_X_Max) {
            this.speed_X = this.Sign(this.speed_X) * this.speed_X_Max;
        }



        this.node.x += this.speed_X * dt;
    }



    update(dt) {
        // return
        // if ($input.GetKeyState(KeyCode.J) == KeyState.up)
        // this.move(dt);



        this.AnimUpdateMap[this.anim_S.name](dt);


    }



}
