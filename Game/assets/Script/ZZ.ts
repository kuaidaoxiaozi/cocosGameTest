// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PlayerBases from "./Base/PlayerBase";
import { $input, KeyState } from "./KU/Input";
import { KeyCode } from "./KeyCode";
import SkillCtrler_Base, { SkillCtrler_DownJump, SkillCtrler_SwitchSkill, SkillCtrler_SwitchDirection, SkillCtrler_Move_X, SkillCtrler_AttackMove, SkillCtrler_Move_Y, SkillCtrler_Jump, SkillCtrler_Move_Down } from "./SkillCtrler_Base";
import SkillCtrlCfg_Base from "./SkillCtrl_Base";
import AnimTrigger_Base, { AnimTriggerEnum, AnimTrigger_KeyCode, AnimTrigger_FrameRange, AnimTrigger_Input_H, AnimTrigger_KeyCode_State, AnimTrigger_Speed_H, AnimTrigger_Speed_V, AnimTrigger_Collision, AnimTrigger_OnGround, AnimTrigger_OrBox, AnimTrigger_Entity } from "./AnimTrigger_Base";
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





        this.add_dic("zz_stand");
        this.add_disssc("zz_stand", "zz_run")
        let s: AnimTrigger_KeyCode_State = new AnimTrigger_KeyCode_State();
        s.code = PlayerKeyCode.Attack;
        s.stateList = [KeyState.firstDown];
        this.addWTJQH(s, "zz_stand", "zz_qlz_1");
        this.add_AnimTrigger_levitate("zz_stand", "zz_jump");


        this.addDownJump("zz_stand");
        let sj: AnimTrigger_KeyCode_State = new AnimTrigger_KeyCode_State();
        sj.code = PlayerKeyCode.Jump;
        sj.stateList = [KeyState.firstDown];
        this.add_jump("zz_stand", "zz_jump", sj, 0.15);


        this.add_onG("zz_jump", "zz_jump_ground");
        this.add_onGxx("zz_jump");
        this.add_down_1("zz_down_1");
        this.add_down_2("zz_down_2");
        this.add_down_3("zz_down_3");

        let a = {
            type: AnimTriggerEnum.OnGround,
            _is: true,
        }
        let k = {
            type: AnimTriggerEnum.KeyCode,
            _is: true,
            csArr: [{ name: "delay", val: 0.2 }, { name: "keyCodeList", val: [{ code: PlayerKeyCode.Jump, stateList: [KeyState.firstDown] }] }]
        }

        let a1 = {
            type: AnimTriggerEnum.OnGround,
            _is: true,
        }
        let k1 = {
            type: AnimTriggerEnum.KeyCode,
            _is: true,
            csArr: [{ name: "delay", val: 0.2 }, {
                name: "keyCodeList", val:
                    [{ code: PlayerKeyCode.Jump, stateList: [KeyState.firstDown] }, { code: PlayerKeyCode.Down, stateList: [KeyState.firstDown, KeyState.down, KeyState.holdDown] }]
            }]
        }

        let e1 = {
            type: AnimTriggerEnum.Entity,
            _is: false,
        }

        let sc1 = new SkillCtrler_DownJump()
        this.add("zz_jump_ground", [[a1], [k1], [e1]], sc1)

        let sc = new SkillCtrler_Jump()
        sc.nextSkillName = "zz_jump"
        this.add("zz_jump_ground", [[a], [k]], sc)

        this.add_jumpToStand("zz_jump_ground", "zz_stand", 2, 4);

        this.add_dxwec("zz_run", "zz_stand")
        this.add_move("zz_run");
        this.add_run_Jump("zz_run", "zz_jump");







        let s1: AnimTrigger_KeyCode_State = new AnimTrigger_KeyCode_State();
        s1.code = PlayerKeyCode.Attack;
        s1.stateList = [KeyState.firstDown];
        this.addYTJQH(9, 14, "zz_qlz_1", "zz_qlz_2", s1, 0.2);
        this.addYTJQH(14, 16, "zz_qlz_1", "zz_stand");
        this.add_attackMove("zz_qlz_1");


        this.AddAttackDown("zz_qlz_1");
        this.AddAttackDown("zz_qlz_2");
        this.AddAttackDown("zz_qlz_3");
        this.AddAttackDown("zz_qlz_4");



        let s2: AnimTrigger_KeyCode_State = new AnimTrigger_KeyCode_State();
        s2.code = PlayerKeyCode.Attack;
        s2.stateList = [KeyState.firstDown];
        this.addYTJQH(4, 10, "zz_qlz_2", "zz_qlz_3", s2, 0.1);
        this.addYTJQH(10, 12, "zz_qlz_2", "zz_stand");
        this.add_attackMove("zz_qlz_2");


        let s3: AnimTrigger_KeyCode_State = new AnimTrigger_KeyCode_State();
        s3.code = PlayerKeyCode.Attack;
        s3.stateList = [KeyState.firstDown];
        this.addYTJQH(7, 13, "zz_qlz_3", "zz_qlz_4", s3, 0.2);
        this.addYTJQH(13, 15, "zz_qlz_3", "zz_stand");
        this.add_attackMove("zz_qlz_3");


        this.addYTJQH(11, 13, "zz_qlz_4", "zz_stand");
        this.add_attackMove("zz_qlz_4");







    }


    public addDownJump(name: string) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let keyCode = new AnimTrigger_KeyCode_State();
        keyCode.code = PlayerKeyCode.Down;
        keyCode.stateList = [KeyState.firstDown, KeyState.down, KeyState.holdDown]

        let keyCode1 = new AnimTrigger_KeyCode_State();
        keyCode1.code = PlayerKeyCode.Jump;
        keyCode1.stateList = [KeyState.firstDown]


        let ats: AnimTrigger_KeyCode = new AnimTrigger_KeyCode();
        ats.keyCodeList.push(keyCode);
        ats.keyCodeList.push(keyCode1);

        let xxx: AnimTrigger_Entity = new AnimTrigger_Entity(false);



        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();
        sccb.TriggerList.push(ats);
        sccb.TriggerList.push(xxx);



        let scss: SkillCtrler_DownJump = new SkillCtrler_DownJump();
        scss.cfg = sccb;

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;

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


    public AddAttackDown(name: string) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atfr: AnimTrigger_OnGround = new AnimTrigger_OnGround(false);

        sccb.TriggerList.push(atfr);

        let scss: SkillCtrler_SwitchSkill = new SkillCtrler_SwitchSkill();
        scss.cfg = sccb;
        scss.nextSkillName = "zz_jump"

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








        let ats_: AnimTrigger_KeyCode = new AnimTrigger_KeyCode();
        let keyCode_ = new AnimTrigger_KeyCode_State();
        keyCode_.code = PlayerKeyCode.Attack;
        keyCode_.stateList = [KeyState.firstDown];
        ats_.keyCodeList.push(keyCode_);
        ats_.delay = 0.2;

        let sccb_: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();
        sccb_.TriggerList.push(ats_);

        let scss_: SkillCtrler_SwitchSkill = new SkillCtrler_SwitchSkill();
        scss_.cfg = sccb_;
        scss_.nextSkillName = "zz_qlz_1";



        let ats_1: AnimTrigger_OnGround = new AnimTrigger_OnGround(false);

        let sccb_1: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();
        sccb_1.TriggerList.push(ats_1);

        let scss_1: SkillCtrler_SwitchSkill = new SkillCtrler_SwitchSkill();
        scss_1.cfg = sccb_1;
        scss_1.nextSkillName = "zz_jump";




        si.CtrlerList.push(scss);
        si.CtrlerList.push(scss_);
        si.CtrlerList.push(scss_1);

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

    public add_run_Jump(name: string, nextName: string) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atfr1: AnimTrigger_KeyCode = new AnimTrigger_KeyCode();
        let key = new AnimTrigger_KeyCode_State();
        key.code = PlayerKeyCode.Jump;
        key.stateList = [KeyState.firstDown];
        atfr1.keyCodeList.push(key);
        atfr1.delay = 0.2;

        sccb.TriggerList.push(atfr1);

        let scss: SkillCtrler_Jump = new SkillCtrler_Jump();
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

        let b: AnimTrigger_OnGround = new AnimTrigger_OnGround();

        let atfr1: AnimTrigger_KeyCode = new AnimTrigger_KeyCode(false);
        let key: AnimTrigger_KeyCode_State = new AnimTrigger_KeyCode_State();
        key.code = PlayerKeyCode.Down;
        key.stateList = [KeyState.firstDown, KeyState.down, KeyState.holdDown]
        atfr1.keyCodeList.push(key);
        atfr1.delay = delay;

        sccb.TriggerList.push(atfr);
        sccb.TriggerList.push(atfr1);
        sccb.TriggerList.push(b);


        let scss: SkillCtrler_Jump = new SkillCtrler_Jump();
        scss.cfg = sccb;
        scss.nextSkillName = nextName;

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;
    }


    public add_jumpToStand(name: string, nextName: string, startFR: number, endFR: number) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

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

    public add_onG(name: string, nextName: string) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atfr: AnimTrigger_OnGround = new AnimTrigger_OnGround();
        let atfr1: AnimTrigger_Speed_V = new AnimTrigger_Speed_V(false);
        let atfr2: AnimTrigger_KeyCode = new AnimTrigger_KeyCode(false);
        let key = new AnimTrigger_KeyCode_State();
        key.code = PlayerKeyCode.Jump;
        key.stateList = [KeyState.firstDown];
        atfr2.delay = 0.05;
        atfr2.keyCodeList.push(key);


        sccb.TriggerList.push(atfr);
        sccb.TriggerList.push(atfr1);
        sccb.TriggerList.push(atfr2);

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







        let sccb_: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atob_: AnimTrigger_OrBox = new AnimTrigger_OrBox();
        let atfr_: AnimTrigger_Speed_H = new AnimTrigger_Speed_H();
        let atfr1_: AnimTrigger_Input_H = new AnimTrigger_Input_H();
        atob_.TriggerList.push(atfr_)
        atob_.TriggerList.push(atfr1_)
        let atfr_1: AnimTrigger_OnGround = new AnimTrigger_OnGround(false);


        sccb_.TriggerList.push(atob_);
        sccb_.TriggerList.push(atfr_1);

        let scss_: SkillCtrler_Move_X = new SkillCtrler_Move_X();
        scss_.cfg = sccb_;





        let sccb0: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atfr0: AnimTrigger_KeyCode = new AnimTrigger_KeyCode();
        let key0 = new AnimTrigger_KeyCode_State();
        key0.code = PlayerKeyCode.Attack;
        key0.stateList = [KeyState.firstDown];

        atfr0.keyCodeList.push(key0);
        atfr0.delay = 0.2;

        let atfr_0: AnimTrigger_OnGround = new AnimTrigger_OnGround(false);


        sccb0.TriggerList.push(atfr0);
        sccb0.TriggerList.push(atfr_0);


        let scss0: SkillCtrler_SwitchSkill = new SkillCtrler_SwitchSkill();
        scss0.cfg = sccb0;
        scss0.nextSkillName = "zz_down_1";











        let keyCode7 = new AnimTrigger_KeyCode_State();
        keyCode7.code = PlayerKeyCode.Down;
        keyCode7.stateList = [KeyState.firstDown, KeyState.down, KeyState.holdDown]

        let keyCode17 = new AnimTrigger_KeyCode_State();
        keyCode17.code = PlayerKeyCode.Jump;
        keyCode17.stateList = [KeyState.firstDown]


        let ats7: AnimTrigger_KeyCode = new AnimTrigger_KeyCode();
        ats7.keyCodeList.push(keyCode7);
        ats7.keyCodeList.push(keyCode17);
        ats7.delay = 0.15;

        let xxx7: AnimTrigger_Entity = new AnimTrigger_Entity(false);

        let OnGround: AnimTrigger_OnGround = new AnimTrigger_OnGround();

        let sccb7: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();
        sccb7.TriggerList.push(ats7);
        sccb7.TriggerList.push(xxx7);
        sccb7.TriggerList.push(OnGround);



        let scss7: SkillCtrler_DownJump = new SkillCtrler_DownJump();
        scss7.cfg = sccb7;







        let sccb0_: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atfr0_: AnimTrigger_KeyCode = new AnimTrigger_KeyCode();
        let key0_ = new AnimTrigger_KeyCode_State();
        key0_.code = PlayerKeyCode.Jump;
        key0_.stateList = [KeyState.firstDown];

        atfr0_.keyCodeList.push(key0_);
        atfr0_.delay = 0.15;


        let atfr0_1: AnimTrigger_KeyCode = new AnimTrigger_KeyCode(false);
        let key0_1 = new AnimTrigger_KeyCode_State();
        key0_1.code = PlayerKeyCode.Down;
        key0_1.stateList = [KeyState.firstDown, KeyState.down, KeyState.holdDown];

        atfr0_1.keyCodeList.push(key0_1);
        atfr0_1.delay = 0.15;


        let atfr_0_: AnimTrigger_OnGround = new AnimTrigger_OnGround();


        sccb0_.TriggerList.push(atfr0_1);
        sccb0_.TriggerList.push(atfr0_);
        sccb0_.TriggerList.push(atfr_0_);


        let scss0_: SkillCtrler_Jump = new SkillCtrler_Jump();
        scss0_.cfg = sccb0_;
        scss0_.nextSkillName = "zz_jump";



        si.CtrlerList.push(scss0);
        si.CtrlerList.push(scss);
        si.CtrlerList.push(scss_);
        // si.CtrlerList.push(scss7);
        si.CtrlerList.push(scss0_);

        this.SkillInfoList[name] = si;
    }


    public add_down_1(name: string) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atob: AnimTrigger_FrameRange = new AnimTrigger_FrameRange();
        atob.startFrame = 3;
        atob.endFrame = 5;
        sccb.TriggerList.push(atob);

        let scss: SkillCtrler_SwitchSkill = new SkillCtrler_SwitchSkill();
        scss.cfg = sccb;
        scss.nextSkillName = "zz_down_2";

        si.CtrlerList.push(scss);

        this.SkillInfoList[name] = si;
    }
    public add_down_2(name: string) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atob: AnimTrigger_OnGround = new AnimTrigger_OnGround();
        sccb.TriggerList.push(atob);

        let scss: SkillCtrler_SwitchSkill = new SkillCtrler_SwitchSkill();
        scss.cfg = sccb;
        scss.nextSkillName = "zz_down_3";




        let sccb1: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atob1: AnimTrigger_OnGround = new AnimTrigger_OnGround(false);
        sccb1.TriggerList.push(atob1);

        let scss1: SkillCtrler_Move_Down = new SkillCtrler_Move_Down();
        scss1.cfg = sccb1;
        scss1.speed = -1500;


        si.CtrlerList.push(scss);
        si.CtrlerList.push(scss1);



        this.SkillInfoList[name] = si;
    }

    public add_down_3(name: string) {
        let si = this.SkillInfoList[name];
        if (!si) {
            si = new SkillInfo_Base();
        }

        let sccb: SkillCtrlCfg_Base = new SkillCtrlCfg_Base();

        let atob: AnimTrigger_FrameRange = new AnimTrigger_FrameRange();
        atob.startFrame = 9;
        atob.endFrame = 11;
        sccb.TriggerList.push(atob);

        let scss: SkillCtrler_SwitchSkill = new SkillCtrler_SwitchSkill();
        scss.cfg = sccb;
        scss.nextSkillName = "zz_stand";

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
                        trigger = new AnimTrigger_Base(it._is);
                        break
                    case AnimTriggerEnum.KeyCode:
                        trigger = new AnimTrigger_KeyCode(it._is);
                        break
                    case AnimTriggerEnum.FrameRange:
                        trigger = new AnimTrigger_FrameRange(it._is);
                        break
                    case AnimTriggerEnum.Input_H:
                        trigger = new AnimTrigger_Input_H(it._is);
                        break
                    case AnimTriggerEnum.Speed_H:
                        trigger = new AnimTrigger_Speed_H(it._is);
                        break
                    case AnimTriggerEnum.Speed_V:
                        trigger = new AnimTrigger_Speed_V(it._is);
                        break
                    case AnimTriggerEnum.Collision:
                        trigger = new AnimTrigger_Collision(it._is);
                        break
                    case AnimTriggerEnum.OnGround:
                        trigger = new AnimTrigger_OnGround(it._is);
                        break
                    case AnimTriggerEnum.Entity:
                        trigger = new AnimTrigger_Entity(it._is);
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
