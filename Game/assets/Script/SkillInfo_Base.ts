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

    public CtrlerList: SkillCtrler_Base[] = []


    public execute(info: PlayerInfoData, frameInfo: FrameInfo) {
        for (let c of this.CtrlerList) {
            c.ctrler(info, frameInfo);
        }
    }


}
