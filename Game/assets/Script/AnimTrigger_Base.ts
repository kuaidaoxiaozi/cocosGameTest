// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { $input, KeyState } from "./KU/Input";
import PlayerInputBuffer from "./PlayerInputBuffer";
import { KeyCode } from "./KeyCode";
import PlayerKeyCode from "./PlayerKeyCode";
import { PlayerInfoData, playerInput } from "./SkillInfo_Base";
import FrameInfo from "./FrameInfo";
import { QuadTreeManage } from "./KU/QuadTreeManage";
import { AABBCollision } from "./KU/AABBCollision";
import { $GameTime } from "./KU/GameTime";

export enum AnimTrigeerEnum {
    /** 无判定 */
    nothing,
    /** 输入指令 */
    keyCode,
    /** 帧范围 */
    frameRange,
    /** 方向输入 */
    direction,


    /** 碰撞 */



}

export default class AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.nothing;
    public getType(): AnimTrigeerEnum { return this._type }

    public IsTrigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {
        return true
    }

    public toDesc() { }
}

export class AnimTrigger_KeyCode_State {
    public code: KeyCode = KeyCode.None;
    public stateList: KeyState[] = [KeyState.firstDown, KeyState.down, KeyState.holdDown];
}

export class AnimTrigger_KeyCode extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.keyCode;

    public delay: number = 0

    public keyCodeList: AnimTrigger_KeyCode_State[] = [];

    public toDesc() {
        let str = "按键事件: ";
        for (let i = 0; i < this.keyCodeList.length; i++) {
            str += this.keyCodeList[i].code + " ,";
        }
        console.log(str);
    }

    public IsTrigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {
        for (let i = 0; i < this.keyCodeList.length; i++) {

            let nowInputState = $input.GetKeyState(this.keyCodeList[i].code);
            let isInput = this.keyCodeList[i].stateList.indexOf(nowInputState) >= 0;

            let order = PlayerInputBuffer.Inst().Get_Order_Buffer(this.keyCodeList[i].code, this.delay)

            if (isInput == false && order == false) {
                // let inp = $input.GetKeyState(this.keyCodeList[i]);
                // if ($input.GetKeyState(this.keyCodeList[i]) <= 0) {
                return false
            }

        }
        return true;
    }
}






export class AnimTrigger_FrameRange extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.frameRange;

    public startFrame: number = 0;
    public endFrame: number = 0;

    public anim_s: cc.AnimationState;

    public toDesc() {
        let str = "帧范围事件，起始帧：" + this.startFrame + "  终止指针：" + this.endFrame;
        console.log(str);
    }

    public IsTrigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {
        let time = 1 / this.anim_s.clip.sample;

        let startTime = time * this.startFrame;
        let endTime = time * this.endFrame;

        if (this.anim_s.time < startTime && this.anim_s.time + time > startTime) {
            return true;
        }
        if (this.anim_s.time < startTime || this.anim_s.time > endTime) {
            return false;
        }
        return true;
    }
}

export class AnimTrigger_Direction extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.direction;

    public toDesc() {
        let l = $input.GetKey(PlayerKeyCode.Left);
        let r = $input.GetKey(PlayerKeyCode.Right);

        let axis = 0;
        axis += (l ? -1 : 0);
        axis += (r ? 1 : 0);
        let str = "方向指令：" + axis;
        console.log(str);
    }

    public IsTrigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {

        let l = $input.GetKey(PlayerKeyCode.Left);
        let r = $input.GetKey(PlayerKeyCode.Right);

        let axis = 0;
        axis += (l ? -1 : 0);
        axis += (r ? 1 : 0);

        if (axis != 0) {
            return true;
        }
        return false;

    }
}

export class AnimTrigger_HasSpeed extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.direction;

    public toDesc() {
        let l = $input.GetKey(PlayerKeyCode.Left);
        let r = $input.GetKey(PlayerKeyCode.Right);

        let axis = 0;
        axis += (l ? -1 : 0);
        axis += (r ? 1 : 0);
        let str = "方向指令：" + axis;
        console.log(str);
    }

    public IsTrigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {

        let l = $input.GetKey(PlayerKeyCode.Left);
        let r = $input.GetKey(PlayerKeyCode.Right);

        let axis = 0;
        axis += (l ? -1 : 0);
        axis += (r ? 1 : 0);

        if (info.speed_X == 0 && axis == 0) {
            return false;
        }
        return true;

    }
}


export class AnimTrigger_SpeedToZore extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.direction;

    public toDesc() {
        let l = $input.GetKey(PlayerKeyCode.Left);
        let r = $input.GetKey(PlayerKeyCode.Right);

        let axis = 0;
        axis += (l ? -1 : 0);
        axis += (r ? 1 : 0);
        let str = "方向指令：" + axis;
        console.log(str);
    }

    public IsTrigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {

        let l = $input.GetKey(PlayerKeyCode.Left);
        let r = $input.GetKey(PlayerKeyCode.Right);

        let axis = 0;
        axis += (l ? -1 : 0);
        axis += (r ? 1 : 0);

        if (info.speed_X == 0 && axis == 0) {
            return true;
        }
        return false;

    }
}



export class AnimTrigger_NoneDirection extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.direction;

    public toDesc() {
        let l = $input.GetKey(PlayerKeyCode.Left);
        let r = $input.GetKey(PlayerKeyCode.Right);

        let axis = 0;
        axis += (l ? -1 : 0);
        axis += (r ? 1 : 0);
        let str = "方向指令：" + axis;
        console.log(str);
    }

    public IsTrigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {

        let l = $input.GetKey(PlayerKeyCode.Left);
        let r = $input.GetKey(PlayerKeyCode.Right);

        let axis = 0;
        axis += (l ? -1 : 0);
        axis += (r ? 1 : 0);

        if (axis == 0) {
            return true;
        }
        return false;

    }
}


export class AnimTrigger_Collision extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.direction;

    public vec: cc.Vec2 = new cc.Vec2(0, 0);

    public toDesc() {

    }

    public IsTrigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {

        let pcbb = info.playerCollision.GetCollBoxBound();

        let xxx = Math.ceil(Math.abs(this.vec.x) / pcbb.width);
        let yyy = Math.ceil(Math.abs(this.vec.y) / pcbb.height);

        let spn = xxx > yyy ? xxx : yyy;

        let spx = this.vec.x / spn;
        let spy = this.vec.y / spn;


        while (spn > 0) {
            pcbb.x += spx;
            pcbb.y += spy;
            let qt = QuadTreeManage.Inst().Retrieve("", pcbb);
            for (let q of qt) {
                if (AABBCollision.HitboxToHitbox(q, pcbb))
                    return true
            }
            spn--;
        }

        return false;
    }
}



/** 在地面 */
export class AnimTrigger_OnGround extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.direction;


    public toDesc() {

    }

    public IsTrigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {
        if (info.collision_Botton)
            return true
        return false
    }
}

/** 浮空 */
export class AnimTrigger_Levitate extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.direction;

    public toDesc() {

    }

    public IsTrigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {
        if (info.collision_Botton)
            return false
        return true
    }
}