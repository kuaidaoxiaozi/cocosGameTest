// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import I_CollisionMethod from "./Interface/I_CollisionMethod";
import I_PlayerInput from "./Interface/I_PlayerInput";
import I_Speed from "./Interface/I_Speed";


export default class PlayerInfoData implements I_PlayerInput, I_Speed {

    /** 物体所在 Node */
    public node: cc.Node;

    /** 动画播放器 */
    public anim: cc.Animation;

    /** 朝向 */
    public face: number = 1;


    /** X 轴按键方向 */
    public Input_X: number = 0
    /** Y 轴按键方向 */
    public Input_Y: number = 0



    /** X 轴速度 */
    public Speed_X: number = 0
    /** Y 轴速度 */
    public Speed_Y: number = 0

    /** 横向最大移动速度 */
    public Speed_X_Max: number = 300
    /** 纵向最大移动速度 */
    public Speed_Y_Max: number = 600

    public Speed_Jump: number = 800;


    /** 亚像素 - X */
    public MovementRemainder_X: number = 0;
    /** 亚像素 - Y */
    public MovementRemainder_Y: number = 0;



    /** 摩擦力 */
    public friction: number = this.Speed_X_Max / 0.05;
    /** 加速度 */
    public acce: number = this.Speed_X_Max / 0.05;
    /** 重力 */
    public gravity: number = -1800;

    /** 碰撞信息 — L */
    public collision_Left: boolean = false
    /** 碰撞信息 — R */
    public collision_Right: boolean = false
    /** 碰撞信息 — T */
    public collision_Top: boolean = false
    /** 碰撞信息 — B */
    public collision_Botton: boolean = false


    /** 玩家碰撞方法 */
    public playerCollision: I_CollisionMethod;

}

