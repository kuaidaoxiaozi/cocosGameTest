// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AnimTrigger_Base from "./AnimTrigger_Base";

export default class SkillCtrlCfg_Base {
    public TriggerList: AnimTrigger_Base[] = [];

    public IsTrigger() {

        for (let t of this.TriggerList) {
            if (t.IsTrigger() == false) {
                return false
            }
        }
        return true
    }

}




