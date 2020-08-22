// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SkillCtrler_Base from "./SkillCtrler_Base";
import FrameInfo from "./FrameInfo";
import { Bound } from "./KU/QuadTree";
import PlayerBases from "./Base/PlayerBase";


export class PlayerInfoData {

    /** 物体所在 Node */
    public node: cc.Node;

    /** 朝向 */
    public face = 1;

    /** X 轴速度 */
    public speed_X = 0;
    /** Y 轴速度 */
    public speed_Y = 0;

    /** 横向最大移动速度 */
    public speed_X_Max: number = 300;
    /** 纵向最大移动速度 */
    public speed_Y_Max: number = 300;

    /** 摩擦力 */
    public friction: number = this.speed_X_Max / 0.05;
    /** 加速度 */
    public acce: number = this.speed_X_Max / 0.05;
    /** 重力 */
    public gravity: number = -180;

    /** 玩家基类 */
    public player: PlayerBases;

}


export default class SkillInfo_Base {

    public CtrlerList: SkillCtrler_Base[] = []


    public execute(info: PlayerInfoData, frameInfo: FrameInfo) {
        for (let c of this.CtrlerList) {
            c.ctrler(info, frameInfo);
        }
    }


}
