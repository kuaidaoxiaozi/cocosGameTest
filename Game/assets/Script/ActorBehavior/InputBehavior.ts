// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ActorBehavior from "./ActorBehavior";
import { $input } from "../KU/Input";
import PlayerKeyCode from "../PlayerKeyCode";
import I_PlayerInput from "../Interface/I_PlayerInput";

/** 检测方向指令输入 */
export default class InputBehavior extends ActorBehavior {

    public pi: I_PlayerInput;

    private sss() {
        if (this.pi) {

            let l = $input.GetKeyState(PlayerKeyCode.Left) > 0;
            let r = $input.GetKeyState(PlayerKeyCode.Right) > 0;

            let input: number = 0;
            input += (l ? -1 : 0);
            input += (r ? 1 : 0);

            this.pi.Input_X = input;
        }
    }

    public update() {
        this.sss();
    }

}
