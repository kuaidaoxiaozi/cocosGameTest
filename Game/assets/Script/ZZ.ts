// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PlayerBases from "./Base/PlayerBase";
import { $input, KeyState } from "./KU/Input";
import { KeyCode } from "./KeyCode";
import SkillCtrler_Base, { SkillCtrler_SwitchSkill, SkillCtrler_SwitchDirection, SkillCtrler_Move, SkillCtrler_AttackMove, SkillCtrler_Descend } from "./SkillCtrler_Base";
import SkillCtrlCfg_Base from "./SkillCtrl_Base";
import AnimTrigger_Base, { AnimTrigger_KeyCode, AnimTrigger_FrameRange, AnimTrigger_Input_H, AnimTrigger_KeyCode_State, AnimTrigger_Speed_H, AnimTrigger_Collision, AnimTrigger_OnGround, AnimTrigger_Levitate } from "./AnimTrigger_Base";
import PlayerKeyCode from "./PlayerKeyCode";
import SkillInfo_Base from "./SkillInfo_Base";
import FrameInfo from "./FrameInfo";
import { $GameTime } from "./KU/GameTime";
import ActorBehavior from "./ActorBehavior/ActorBehavior";
import InputBehavior from "./ActorBehavior/InputBehavior";
import CollisionBehavior from "./ActorBehavior/CollisionBehavior";
import PlayerInfoData from "./PlayerInfoData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ZZ extends PlayerBases {


    public playerInfoData: PlayerInfoData;

    public frameInfo: FrameInfo;


    onLoad() {
        super.onLoad();

        this.playerInfoData = new PlayerInfoData();
        this.playerInfoData.node = this.node;
        this.playerInfoData.playerCollision = this;
        this.frameInfo = this.anim.node.getComponent(FrameInfo);

        this.anim.name = "zz"
        this.anim_S = this.anim.play("zz_stand");

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


        let zz_qlz_12: cc.AnimationState = self.anim.getAnimationState("zz_qlz_1");



        // let ats0: AnimTrigger_KeyCode = new AnimTrigger_KeyCode();
        // ats0.keyCodeList.push(PlayerKeyCode.Attack);

        // let sccb0: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();
        // sccb0.TriggerList.push(ats0);

        // let scss0: SkillCtrler_SwitchSkill = new SkillCtrler_SwitchSkill();
        // scss0.cfg = sccb0;
        // scss0.nextSkillName = "zz_qlz_1";
        // scss0.anim = self.anim;

        // this.ssss["zz_stand"] = scss0;





        // Behavior 事件

        let ibh = new InputBehavior();
        ibh.pi = this.playerInfoData;
        this.ActorBeh.push(ibh)

        let cbh = new CollisionBehavior();
        cbh.playerInfo = this.playerInfoData;
        this.ActorBeh.push(cbh)





        this.add_dic("zz_stand");
        this.add_disssc("zz_stand", "zz_run")
        let s: AnimTrigger_KeyCode_State = new AnimTrigger_KeyCode_State();
        s.code = PlayerKeyCode.Attack;
        s.stateList = [KeyState.firstDown];
        this.addWTJQH(s, "zz_stand", "zz_qlz_1");
        this.add_AnimTrigger_levitate("zz_stand", "zz_jump");


        this.add_onG("zz_jump", "zz_stand");
        this.add_onGxx("zz_jump");



        this.add_dxwec("zz_run", "zz_stand")
        this.add_move("zz_run");
        this.add_AnimTrigger_levitate("zz_run", "zz_jump");

        let s1: AnimTrigger_KeyCode_State = new AnimTrigger_KeyCode_State();
        s1.code = PlayerKeyCode.Attack;
        s1.stateList = [KeyState.firstDown];
        this.addYTJQH(9, 12, "zz_qlz_1", "zz_qlz_2", s1, 0.2);
        this.addYTJQH(12, 14, "zz_qlz_1", "zz_stand");
        this.add_attackMove("zz_qlz_1");


        let s2: AnimTrigger_KeyCode_State = new AnimTrigger_KeyCode_State();
        s2.code = PlayerKeyCode.Attack;
        s2.stateList = [KeyState.firstDown];
        this.addYTJQH(4, 8, "zz_qlz_2", "zz_qlz_3", s2, 0.2);
        this.addYTJQH(8, 10, "zz_qlz_2", "zz_stand");
        this.add_attackMove("zz_qlz_2");


        let s3: AnimTrigger_KeyCode_State = new AnimTrigger_KeyCode_State();
        s3.code = PlayerKeyCode.Attack;
        s3.stateList = [KeyState.firstDown];
        this.addYTJQH(7, 11, "zz_qlz_3", "zz_qlz_4", s3, 0.2);
        this.addYTJQH(11, 13, "zz_qlz_3", "zz_stand");
        this.add_attackMove("zz_qlz_3");


        this.addYTJQH(11, 13, "zz_qlz_4", "zz_stand");
        this.add_attackMove("zz_qlz_4");

    }





    public addWTJQH(keyCode: AnimTrigger_KeyCode_State, name: string, nextName: string) {

        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let ats: AnimTrigger_KeyCode = new AnimTrigger_KeyCode();
        ats.keyCodeList.push(keyCode);

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();
        sccb.TriggerList.push(ats);

        let scss: SkillCtrler_SwitchSkill = new SkillCtrler_SwitchSkill();
        scss.cfg = sccb;
        scss.nextSkillName = nextName;
        scss.anim = this.anim;

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;
    }




    public add_attackMove(name: string) {

        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atfr: AnimTrigger_Base = new AnimTrigger_Base();

        sccb.TriggerList.push(atfr);

        let scss: SkillCtrler_AttackMove = new SkillCtrler_AttackMove();
        scss.cfg = sccb;

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;
    }


    public addYTJQH(startFR: number, endFR: number, name: string, nextName: string, keyCodeStateLsit: AnimTrigger_KeyCode_State = null, delay: number = 0) {

        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        if (keyCodeStateLsit != null) {
            let ats: AnimTrigger_KeyCode = new AnimTrigger_KeyCode();
            ats.keyCodeList.push(keyCodeStateLsit);
            ats.delay = delay;
            sccb.TriggerList.push(ats);
        }

        let atfr: AnimTrigger_FrameRange = new AnimTrigger_FrameRange();
        atfr.startFrame = startFR
        atfr.endFrame = endFR

        sccb.TriggerList.push(atfr);

        let scss: SkillCtrler_SwitchSkill = new SkillCtrler_SwitchSkill();
        scss.cfg = sccb;
        scss.nextSkillName = nextName;
        scss.anim = this.anim;

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;
    }



    public add_dic(name: string) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atfr: AnimTrigger_Base = new AnimTrigger_Base();

        sccb.TriggerList.push(atfr);

        let scss: SkillCtrler_SwitchDirection = new SkillCtrler_SwitchDirection();
        scss.cfg = sccb;
        scss.scale = 1;

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;
    }

    public add_disssc(name: string, nextName: string) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atfr: AnimTrigger_Input_H = new AnimTrigger_Input_H();

        sccb.TriggerList.push(atfr);

        let scss: SkillCtrler_SwitchSkill = new SkillCtrler_SwitchSkill();
        scss.cfg = sccb;
        scss.nextSkillName = nextName;
        scss.anim = this.anim;

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;
    }

    public add_move(name: string) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atfr: AnimTrigger_Speed_H = new AnimTrigger_Speed_H();

        sccb.TriggerList.push(atfr);

        let scss: SkillCtrler_Move = new SkillCtrler_Move();
        scss.cfg = sccb;

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;
    }


    public add_dxwec(name: string, nextName: string) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atfr: AnimTrigger_Speed_H = new AnimTrigger_Speed_H();
        let atfr1: AnimTrigger_Input_H = new AnimTrigger_Input_H();

        sccb.TriggerList.push(atfr);
        sccb.TriggerList.push(atfr1);

        let scss: SkillCtrler_SwitchSkill = new SkillCtrler_SwitchSkill();
        scss.cfg = sccb;
        scss.nextSkillName = nextName;
        scss.anim = this.anim;

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;
    }


    public add_AnimTrigger_levitate(name: string, nextName: string) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atfr: AnimTrigger_Levitate = new AnimTrigger_Levitate();
        sccb.TriggerList.push(atfr);

        let scss: SkillCtrler_SwitchSkill = new SkillCtrler_SwitchSkill();
        scss.cfg = sccb;
        scss.nextSkillName = nextName;
        scss.anim = this.anim;

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;
    }

    public add_onG(name: string, nextName: string) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atfr: AnimTrigger_OnGround = new AnimTrigger_OnGround();
        sccb.TriggerList.push(atfr);

        let scss: SkillCtrler_SwitchSkill = new SkillCtrler_SwitchSkill();
        scss.cfg = sccb;
        scss.nextSkillName = nextName;
        scss.anim = this.anim;

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;
    }

    public add_onGxx(name: string) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atfr: AnimTrigger_Levitate = new AnimTrigger_Levitate();
        sccb.TriggerList.push(atfr);

        let scss: SkillCtrler_Descend = new SkillCtrler_Descend();
        scss.cfg = sccb;

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;
    }



    public SkillInfoList: { [name: string]: SkillInfo_Base } = {}
    public ActorBeh: ActorBehavior[] = [];




    /** 截取最大速度，X Y 轴单独截取，并不是按向量方式整体截取 */
    public Maxspeed() {
        if (Math.abs(this.playerInfoData.speed.speed_Y) > this.playerInfoData.speed.speed_Y_Max)
            this.playerInfoData.speed.speed_Y = this.Sign(this.playerInfoData.speed.speed_Y) * this.playerInfoData.speed.speed_Y_Max;
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



        // this.AnimUpdateMap[this.anim_S.name](dt);


        // this.zl();

        for (let i = 0; i < this.ActorBeh.length; i++) {
            this.ActorBeh[i].update();
        }

        let cc = this.SkillInfoList[this.anim.currentClip.name];
        if (cc)
            cc.execute(this.playerInfoData, this.frameInfo);


    }



}
