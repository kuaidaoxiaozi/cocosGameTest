// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AnimTrigger_Base from "./AnimTrigger_Base";
import FrameInfo from "./FrameInfo";
import PlayerInfoData from "./PlayerInfoData";

/** 技能事件的触发器CFG */
export default class SkillCtrlCfg_Base {

    constructor() {
        this.TriggerList = [];
    }

    /** 触发器数组 */
    public TriggerList: AnimTrigger_Base[];

    /** 添加一个触发器 */
    public AddTrigger(tri: AnimTrigger_Base) {
        this.TriggerList.push(tri);
    }

    public IsTrigger(info: PlayerInfoData, frameInfo: FrameInfo) {

        for (let t of this.TriggerList) {
            if (t.IsTrigger(info, frameInfo) == false) {
                return false
            }
        }
        return true
    }

}




