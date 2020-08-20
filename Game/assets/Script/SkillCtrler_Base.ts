// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SkillCtrlCfg_Base from "./SkillCtrl_Base";


export default class SkillCtrler_Base {

    public cfg: SkillCtrlCfg_Base;

    public ctrler() {
        if (this.cfg.IsTrigger()) {
            this.event();
        }
    }
    protected event() { }

}


export class SkillCtrler_SwitchSkill extends SkillCtrler_Base {

    public nextSkillName: string
    public anim: cc.Animation;

    public sss = true

    protected event() {
        if (this.sss) {
            this.anim.play(this.nextSkillName);
            this.sss = false
        }
    }

}