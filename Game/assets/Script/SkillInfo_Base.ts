// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SkillCtrler_Base from "./SkillCtrler_Base";
import FrameInfo from "./FrameInfo";
import PlayerInfoData from "./PlayerInfoData";



export default class SkillInfo_Base {

    constructor(name: string) {
        this.CtrlerList = [];
        this.name = name;
    }

    public name = "";

    /** 一个技能会有多个技能事件 */
    public CtrlerList: SkillCtrler_Base[];

    /** 添加一个可执行的技能事件 */
    public AddCtrler(ctr: SkillCtrler_Base) {
        this.CtrlerList.push(ctr);
    }

    /** 逐个执行技能事件 */
    public execute(info: PlayerInfoData, frameInfo: FrameInfo) {
        for (let c of this.CtrlerList) {
            if (info.anim.currentClip.name != this.name && this.name != "") {
                break;
            }
            c.ctrler(info, frameInfo);
        }
    }


}
