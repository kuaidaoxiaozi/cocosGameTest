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
import I_CollisionMethod from "./Interface/I_CollisionMethod";


export interface playerInput {
    /** X 轴按键方向 */
    input_X: number;
    /** Y 轴按键方向 */
    input_Y: number;
}



export class PlayerInfoData implements playerInput {

    /** 物体所在 Node */
    public node: cc.Node;

    /** 朝向 */
    public face = 1;

    /** X 轴速度 */
    public speed_X = 0;
    /** Y 轴速度 */
    public speed_Y = 0;


    /** X 轴按键方向 */
    public input_X: number = 0;
    /** Y 轴按键方向 */
    public input_Y: number = 0;


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


    public collision_Left: boolean = false
    public collision_Right: boolean = false
    public collision_Top: boolean = false
    public collision_Botton: boolean = false

    /** 玩家碰撞方法 */
    public playerCollision: I_CollisionMethod;

}


export default class SkillInfo_Base {

    public CtrlerList: SkillCtrler_Base[] = []


    public execute(info: PlayerInfoData, frameInfo: FrameInfo) {
        for (let c of this.CtrlerList) {
            c.ctrler(info, frameInfo);
        }
    }


}
