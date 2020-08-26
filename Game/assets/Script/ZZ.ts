// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PlayerBases from "./Base/PlayerBase";
import { $input, KeyState } from "./KU/Input";
import { KeyCode } from "./KeyCode";
import SkillCtrler_Base, { SkillCtrler_SwitchSkill, SkillCtrler_SwitchDirection, SkillCtrler_Move_X, SkillCtrler_AttackMove, SkillCtrler_Move_Y, SkillCtrler_Jump } from "./SkillCtrler_Base";
import SkillCtrlCfg_Base from "./SkillCtrl_Base";
import AnimTrigger_Base, { AnimTriggerEnum, AnimTrigger_KeyCode, AnimTrigger_FrameRange, AnimTrigger_Input_H, AnimTrigger_KeyCode_State, AnimTrigger_Speed_H, AnimTrigger_Speed_V, AnimTrigger_Collision, AnimTrigger_OnGround, AnimTrigger_OrBox } from "./AnimTrigger_Base";
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
        this.playerInfoData.anim = this.anim;
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





        // this.add_dic("zz_stand");
        // this.add_disssc("zz_stand", "zz_run")
        // let s: AnimTrigger_KeyCode_State = new AnimTrigger_KeyCode_State();
        // s.code = PlayerKeyCode.Attack;
        // s.stateList = [KeyState.firstDown];
        // this.addWTJQH(s, "zz_stand", "zz_qlz_1");
        // this.add_AnimTrigger_levitate("zz_stand", "zz_jump");


        // let sj: AnimTrigger_KeyCode_State = new AnimTrigger_KeyCode_State();
        // sj.code = PlayerKeyCode.Jump;
        // sj.stateList = [KeyState.firstDown];
        // this.add_jump("zz_stand", "zz_jump", sj, 0.15);


        // this.add_onG("zz_jump", "zz_jump_ground");
        // this.add_onGxx("zz_jump");



        // let a = {
        //     type: AnimTriggerEnum.OnGround,
        //     _is: true,
        // }
        // let k = {
        //     type: AnimTriggerEnum.KeyCode,
        //     _is: true,
        //     csArr: [{ name: "delay", val: 0.2 }, { name: "keyCodeList", val: [{ code: PlayerKeyCode.Jump, stateList: [KeyState.firstDown] }] }]
        // }
        // let f = {
        //     type: AnimTriggerEnum.FrameRange,
        //     _is: true,
        //     csArr: [{ name: "startFrame", val: 1 }, { name: "endFrame", val: 4 }]
        // }

        // let sc = new SkillCtrler_Jump()
        // sc.nextSkillName = "zz_jump"
        // this.add("zz_jump_ground", [[a], [k], [f]], sc)



        // this.add_dxwec("zz_run", "zz_stand")
        // this.add_move("zz_run");
        // this.add_AnimTrigger_levitate("zz_run", "zz_jump");


        // let s1: AnimTrigger_KeyCode_State = new AnimTrigger_KeyCode_State();
        // s1.code = PlayerKeyCode.Attack;
        // s1.stateList = [KeyState.firstDown];
        // this.addYTJQH(9, 12, "zz_qlz_1", "zz_qlz_2", s1, 0.2);
        // this.addYTJQH(12, 14, "zz_qlz_1", "zz_stand");
        // this.add_attackMove("zz_qlz_1");


        // let s2: AnimTrigger_KeyCode_State = new AnimTrigger_KeyCode_State();
        // s2.code = PlayerKeyCode.Attack;
        // s2.stateList = [KeyState.firstDown];
        // this.addYTJQH(4, 8, "zz_qlz_2", "zz_qlz_3", s2, 0.2);
        // this.addYTJQH(8, 10, "zz_qlz_2", "zz_stand");
        // this.add_attackMove("zz_qlz_2");


        // let s3: AnimTrigger_KeyCode_State = new AnimTrigger_KeyCode_State();
        // s3.code = PlayerKeyCode.Attack;
        // s3.stateList = [KeyState.firstDown];
        // this.addYTJQH(7, 11, "zz_qlz_3", "zz_qlz_4", s3, 0.2);
        // this.addYTJQH(11, 13, "zz_qlz_3", "zz_stand");
        // this.add_attackMove("zz_qlz_3");


        // this.addYTJQH(11, 13, "zz_qlz_4", "zz_stand");
        // this.add_attackMove("zz_qlz_4");







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

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;
    }

    public add_move(name: string) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atob: AnimTrigger_OrBox = new AnimTrigger_OrBox();
        let atfr: AnimTrigger_Speed_H = new AnimTrigger_Speed_H();
        let atfr1: AnimTrigger_Input_H = new AnimTrigger_Input_H();
        atob.TriggerList.push(atfr)
        atob.TriggerList.push(atfr1)


        sccb.TriggerList.push(atob);

        let scss: SkillCtrler_Move_X = new SkillCtrler_Move_X();
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

        let atfr: AnimTrigger_Speed_H = new AnimTrigger_Speed_H(false);
        let atfr1: AnimTrigger_Input_H = new AnimTrigger_Input_H(false);

        sccb.TriggerList.push(atfr);
        sccb.TriggerList.push(atfr1);

        let scss: SkillCtrler_SwitchSkill = new SkillCtrler_SwitchSkill();
        scss.cfg = sccb;
        scss.nextSkillName = nextName;

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;
    }


    public add_AnimTrigger_levitate(name: string, nextName: string) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atfr: AnimTrigger_OnGround = new AnimTrigger_OnGround(false);
        sccb.TriggerList.push(atfr);

        let scss: SkillCtrler_SwitchSkill = new SkillCtrler_SwitchSkill();
        scss.cfg = sccb;
        scss.nextSkillName = nextName;

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;
    }

    public add_jump(name: string, nextName: string, keyCodeStateLsit: AnimTrigger_KeyCode_State, delay: number = 0) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atfr: AnimTrigger_KeyCode = new AnimTrigger_KeyCode();
        atfr.keyCodeList.push(keyCodeStateLsit);
        atfr.delay = delay;

        sccb.TriggerList.push(atfr);


        let scss: SkillCtrler_Jump = new SkillCtrler_Jump();
        scss.cfg = sccb;
        scss.nextSkillName = nextName;

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
        let atfr1: AnimTrigger_Speed_V = new AnimTrigger_Speed_V(false);

        sccb.TriggerList.push(atfr);
        sccb.TriggerList.push(atfr1);

        let scss: SkillCtrler_SwitchSkill = new SkillCtrler_SwitchSkill();
        scss.cfg = sccb;
        scss.nextSkillName = nextName;

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;
    }

    public add_onGxx(name: string) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atob: AnimTrigger_OrBox = new AnimTrigger_OrBox();
        let atfr: AnimTrigger_OnGround = new AnimTrigger_OnGround(false);
        let atfr1: AnimTrigger_Speed_V = new AnimTrigger_Speed_V();
        atob.TriggerList.push(atfr)
        atob.TriggerList.push(atfr1)

        sccb.TriggerList.push(atob);

        let scss: SkillCtrler_Move_Y = new SkillCtrler_Move_Y();
        scss.cfg = sccb;

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;
    }



    public SkillInfoList: { [name: string]: SkillInfo_Base } = {}
    public SkillChanageList: { [name: string]: SkillInfo_Base } = {}
    public ActorBeh: ActorBehavior[] = [];




    /** 截取最大速度，X Y 轴单独截取，并不是按向量方式整体截取 */
    public Maxspeed() {
        if (Math.abs(this.playerInfoData.Speed_Y) > this.playerInfoData.Speed_Y_Max)
            this.playerInfoData.Speed_Y = this.Sign(this.playerInfoData.Speed_Y) * this.playerInfoData.Speed_Y_Max;
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



    /**
     * [[{ type: "type", _is: true, cs: [{ name: "string", val: "string" }] }, { type: "type", _is: true }],,]
     */
    private add(name: string, tjArr: any[][], sc: SkillCtrler_Base) {

        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        // let atob: AnimTrigger_OrBox = new AnimTrigger_OrBox();
        // let atfr: AnimTrigger_OnGround = new AnimTrigger_OnGround(false);
        // let atfr1: AnimTrigger_Speed_V = new AnimTrigger_Speed_V();

        [[{ type: "type", _is: true, cs: [{ name: "string", val: "string" }] }, { type: "type", _is: true }], [{ type: "type", _is: true }], , , ,]

        // Base,
        // /** 有按键输入 / 无按键输入 */
        // KeyCode,
        // /** 帧范围 / 帧范围取反 */
        // FrameRange,
        // /** 有方向输入 - H / 无方向输入 - H */
        // Input_H,
        // /** 有速度 - H / 无速度 - H */
        // Speed_H,
        // /** 有速度 - V / 无速度 - V */
        // Speed_V,
        // /** 有碰撞 / 无碰撞 */
        // Collision,
        // /** 在地面 / 浮空*/
        // OnGround,

        for (let i = 0; i < tjArr.length; i++) {
            let tj = tjArr[i];
            let atob: AnimTrigger_OrBox = new AnimTrigger_OrBox();
            for (let j = 0; j < tj.length; j++) {
                let it = tj[j] as { type: AnimTriggerEnum, _is: boolean, csArr: [{ name, val }] };
                let trigger: AnimTrigger_Base;
                switch (it.type) {
                    case AnimTriggerEnum.Base:
                        trigger = new AnimTrigger_Base();
                        break
                    case AnimTriggerEnum.KeyCode:
                        trigger = new AnimTrigger_KeyCode();
                        break
                    case AnimTriggerEnum.FrameRange:
                        trigger = new AnimTrigger_FrameRange();
                        break
                    case AnimTriggerEnum.Input_H:
                        trigger = new AnimTrigger_Input_H();
                        break
                    case AnimTriggerEnum.Speed_H:
                        trigger = new AnimTrigger_Speed_H();
                        break
                    case AnimTriggerEnum.Speed_V:
                        trigger = new AnimTrigger_Speed_V();
                        break
                    case AnimTriggerEnum.Collision:
                        trigger = new AnimTrigger_Collision();
                        break
                    case AnimTriggerEnum.OnGround:
                        trigger = new AnimTrigger_OnGround();
                        break
                }

                if (it.csArr) {
                    for (let i = 0; i < it.csArr.length; i++) {
                        let cs = it.csArr[i] as { name, val };
                        trigger[cs.name] = cs.val;
                    }
                }

                atob.TriggerList.push(trigger);
            }

            sccb.TriggerList.push(atob);
        }


        sc.cfg = sccb;

        si.CtrlerList.push(sc);

        this.SkillInfoList[name] = si;

    }


}
