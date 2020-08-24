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
import FrameInfo from "./FrameInfo";
import { QuadTreeManage } from "./KU/QuadTreeManage";
import { AABBCollision } from "./KU/AABBCollision";
import { $GameTime } from "./KU/GameTime";
import PlayerInfoData from "./PlayerInfoData";

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

/** Trigeer 基类 */
export default class AnimTrigger_Base {
    public constructor(isNOT = true) {
        this.IsNOT = isNOT;
    }

    /** 结果取反用的 */
    private IsNOT: boolean = true;
    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.nothing;
    public getType(): AnimTrigeerEnum { return this._type }

    public IsTrigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {
        return this.IsNOT == this.Trigger(info, frameInfo);
    }

    protected Trigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {
        return true
    }

    public toDesc() { }
}

export class AnimTrigger_KeyCode_State {
    public code: KeyCode = KeyCode.None;
    public stateList: KeyState[] = [KeyState.firstDown, KeyState.down, KeyState.holdDown];
}

/** 有按键输入 */
export class AnimTrigger_KeyCode extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.keyCode;

    /** 输入缓存时间 */
    public delay: number = 0
    /** 按键列表 */
    public keyCodeList: AnimTrigger_KeyCode_State[] = [];

    public toDesc() {
        let str = "按键事件: ";
        for (let i = 0; i < this.keyCodeList.length; i++) {
            str += this.keyCodeList[i].code + " ,";
        }
        console.log(str);
    }

    protected Trigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {
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



/** 帧范围 */
export class AnimTrigger_FrameRange extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.frameRange;

    /** 起始帧 */
    public startFrame: number = 0;
    /** 结束帧 */
    public endFrame: number = 0;

    public toDesc() {
        let str = "帧范围事件，起始帧：" + this.startFrame + "  终止指针：" + this.endFrame;
        console.log(str);
    }

    protected Trigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {
        let anim_s = info.anim.getAnimationState(info.anim.currentClip.name);

        let time = 1 / anim_s.clip.sample;

        let startTime = time * this.startFrame;
        let endTime = time * this.endFrame;

        if (anim_s.time < startTime && anim_s.time + time > startTime) {
            return true;
        }
        if (anim_s.time < startTime || anim_s.time > endTime) {
            return false;
        }
        return true;
    }
}


/** 有方向输入 - H */
export class AnimTrigger_Input_H extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.direction;

    protected Trigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {

        if (info.playerInpout.X != 0) {
            return true;
        }
        return false;
    }
}


/** 有速度 - H */
export class AnimTrigger_Speed_H extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.direction;

    protected Trigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {

        if (info.speed.speed_X == 0) {
            return false;
        }
        return true;
    }
}


export class AnimTrigger_Collision extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.direction;

    public vec: cc.Vec2 = new cc.Vec2(0, 0);

    protected Trigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {

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


/** 在地面 / 取反 - 浮空*/
export class AnimTrigger_OnGround extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.direction;

    protected Trigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {
        if (info.collision_Botton)
            return true
        return false
    }
}

/** 浮空 */
export class AnimTrigger_Levitate extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.direction;

    protected Trigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {
        if (info.collision_Botton)
            return false
        return true
    }
}