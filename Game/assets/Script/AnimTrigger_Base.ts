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
import QuadTreeManage from "./KU/QuadTreeManage";
import AABBCollision from "./KU/AABBCollision";
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

export enum AnimTriggerEnum {
    /** Trigeer 基类 */
    Base,
    /** 有按键输入 / 无按键输入 */
    KeyCode,
    /** 帧范围 / 帧范围取反 */
    FrameRange,
    /** 有方向输入 - H / 无方向输入 - H */
    Input_H,
    /** 有速度 - H / 无速度 - H */
    Speed_H,
    /** 有速度 - V / 无速度 - V */
    Speed_V,
    /** 有碰撞 / 无碰撞 */
    Collision,
    /** 在地面 / 浮空*/
    OnGround,

    Entity,
}


/** Trigeer 基类 - 默认返回 true*/
export default class AnimTrigger_Base {
    /**
     * @param isNOT 是否取反
     */
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

/** Trigeer 或门Bos，用来并联多个条件 */
export class AnimTrigger_OrBox extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.nothing;

    public TriggerList: AnimTrigger_Base[] = [];

    protected Trigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {

        for (let t of this.TriggerList) {
            if (t.IsTrigger(info, frameInfo)) {
                return true
            }
        }

        return false
    }

    public toDesc() { }
}

export class AnimTrigger_KeyCode_State {
    public code: KeyCode;
    public stateList: KeyState[];
    constructor(code: KeyCode = KeyCode.None, stateList: KeyState[] = []) {//[KeyState.firstDown, KeyState.down, KeyState.holdDown]
        this.code = code;
        this.stateList = stateList;
    }
}

/** 有按键输入 / 无按键输入 */
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
        for (let i = 0; i < this.keyCodeList.length; i++)
            PlayerInputBuffer.Inst().Clear_Order_Buffer(this.keyCodeList[i].code, $GameTime.time);

        return true;
    }
}



/** 帧范围 / 帧范围取反 */
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

        // if (anim_s.time < startTime && anim_s.time + time > startTime) {
        //     return true;
        // }
        if (anim_s.time < startTime || anim_s.time > endTime) {
            return false;
        }
        return true;
    }
}


/** 有方向输入 - H / 无方向输入 - H */
export class AnimTrigger_Input_H extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.direction;

    protected Trigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {

        if (info.Input_X != 0) {
            return true;
        }
        return false;
    }
}


/** 有速度 - H / 无速度 - H */
export class AnimTrigger_Speed_H extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.direction;

    protected Trigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {

        if (info.Speed_X == 0) {
            return false;
        }
        return true;
    }
}

/** 有速度 - V / 无速度 - V */
export class AnimTrigger_Speed_V extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.direction;

    protected Trigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {

        if (info.Speed_Y == 0) {
            return false;
        }
        return true;
    }
}


/** 有碰撞 / 无碰撞 */
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


/** 在地面 / 浮空*/
export class AnimTrigger_OnGround extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.direction;

    protected Trigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {
        if (info.collision_Botton)
            return true
        return false
    }
}

/** 有实体，无法下跳 / 无实体，能下跳  --  有 Bug*/
export class AnimTrigger_Entity extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.direction;

    protected Trigger(info: PlayerInfoData, frameInfo: FrameInfo): boolean {

        if (info.collision_Botton) {
            let bound = info.playerCollision.GetCollBoxBound();
            let b = bound.copy();
            let b1 = bound.copy();
            b.y -= 1;
            let qt = QuadTreeManage.Inst().Retrieve("", b);

            for (let q of qt) {

                let h = AABBCollision.HitboxToHitbox(b, q)
                let h1 = AABBCollision.HitboxToHitbox(b1, q)
                if ((h == true && h1 == false) && q.climb == false) {
                    return true;
                }
            }
        }
        return false
    }
}
