// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { $input } from "./KU/Input";
import PlayerInputBuffer from "./PlayerInputBuffer";
import { KeyCode } from "./KeyCode";

export enum AnimTrigeerEnum {
    /** 输入指令 */
    keyCode,
    /** 帧范围 */
    frameRange,
    /** 帧范围，带输入容差 */
    frameRange_Buffer
}

export default class AnimTrigger_Base {

    protected _type: AnimTrigeerEnum;
    public getType(): AnimTrigeerEnum { return this._type }

    public IsTrigger(): boolean {
        return false
    }

    public toDesc() { }
}


export class AnimTrigger_KeyCode extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.keyCode;

    public keyCodeList: KeyCode[] = [];

    public toDesc() {
        let str = "按键事件: ";
        for (let i = 0; i < this.keyCodeList.length; i++) {
            str += this.keyCodeList[i] + " ,";
        }
        console.log(str);
    }

    public IsTrigger(): boolean {
        for (let i = 0; i < this.keyCodeList.length; i++) {

            if ($input.GetKeyState(this.keyCodeList[i]) <= 0 && PlayerInputBuffer.Inst().Get_Order_Buffer(this.keyCodeList[i]) == false) {
                return false
            }

        }
        return true;
    }
}

export class AnimTrigger_FrameRange extends AnimTrigger_Base {

    protected _type: AnimTrigeerEnum = AnimTrigeerEnum.frameRange;

    private startFrame: number = 0;
    private endFrame: number = 0;

    private anim_s: cc.AnimationState;

    public toDesc() {
        let str = "帧范围事件，起始帧：" + this.startFrame + "  终止指针：" + this.endFrame;
        console.log(str);
    }

    public IsTrigger(): boolean {
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

