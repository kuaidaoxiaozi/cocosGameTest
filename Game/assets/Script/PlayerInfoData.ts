// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import I_CollisionMethod from "./Interface/I_CollisionMethod";
import I_PlayerInput from "./Interface/I_PlayerInput";
import I_Speed from "./Interface/I_Speed";


export default class PlayerInfoData {
    public constructor() {
        this.playerInpout.X = 0
        this.playerInpout.Y = 0
    }


    /** 物体所在 Node */
    public node: cc.Node;

    /** 动画播放器 */
    public anim: cc.Animation;

    /** 朝向 */
    public face: number = 1;


    /** 方向输入 */
    public playerInpout: I_PlayerInput;


    /** 速度相关 */
    public speed: I_Speed;



    /** 摩擦力 */
    public friction: number = this.speed.speed_X_Max / 0.05;
    /** 加速度 */
    public acce: number = this.speed.speed_X_Max / 0.05;
    /** 重力 */
    public gravity: number = -180;

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

