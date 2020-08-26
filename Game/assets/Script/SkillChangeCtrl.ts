// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AnimTrigger_Base from "./AnimTrigger_Base";
import FrameInfo from "./FrameInfo";
import PlayerInfoData from "./PlayerInfoData";


/** 技能切换 */
export default class SkillChangeCtrl {
    /** 下一个技能 */
    public nextName: string;

    public TriggerList: AnimTrigger_Base[] = [];

    public IsTrigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {

        for (let i = 0; i < this.TriggerList.length; i++) {
            if (this.TriggerList[i].IsTrigger(info, frameInfo) == false) {
                return false;
            }
        }
        return true
    }

}
