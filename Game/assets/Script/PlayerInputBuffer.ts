// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { $input, KeyState } from "./KU/Input";
import { $GameTime } from "./KU/GameTime";
import PlayerKeyCode from "./PlayerKeyCode";


export default class PlayerInputBuffer {

    private input_H: number = 0;
    private input_H_Time: number = 0;

    private input_V: number = 0;
    private input_V_Time: number = 0;

    private order: number = 0;
    private order_Time: number = 0;

    private constructor() { }

    private static _inst: PlayerInputBuffer = null;

    public static Inst() {
        if (this._inst == null) {
            this._inst = new PlayerInputBuffer();
        }
        return this._inst;
    }

    public update() {
        let l = $input.GetKeyState(PlayerKeyCode.Left) > 0;
        let r = $input.GetKeyState(PlayerKeyCode.Right) > 0;

        let axis = 0;
        axis += (l ? -1 : 0);
        axis += (r ? 1 : 0);

        if (l == r) {
            this.input_H = this.input_V = this.input_H_Time = this.input_V_Time = 0;
        } else {
            if (l) {
                this.input_H = PlayerKeyCode.Left;
            } else if (r) {
                this.input_H = PlayerKeyCode.Right;
            }
            this.input_H_Time = $GameTime.time;
        }

        let a = ($input.GetKeyState(PlayerKeyCode.Attack) == KeyState.firstDown);
        if (a) {
            this.order = PlayerKeyCode.Attack
            this.order_Time = $GameTime.time;
        }
        a = ($input.GetKeyState(PlayerKeyCode.Jump) == KeyState.firstDown);
        if (a) {
            this.order = PlayerKeyCode.Jump
            this.order_Time = $GameTime.time;
        }
    }


    public Get_Order_Buffer(code: number, val: number = 0.1): boolean {
        if (this.order == code && ($GameTime.time - val) < this.order_Time) {
            return true
        }
        return false
    }


}

