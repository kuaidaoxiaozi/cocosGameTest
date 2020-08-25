// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { KeyCode } from "./KeyCode";

export default class PlayerKeyCode {

    
    public static Left: KeyCode = KeyCode.LeftArrow;
    public static Right: KeyCode = KeyCode.RightArrow;

    public static Attack: KeyCode = KeyCode.X;
    public static Jump: KeyCode = KeyCode.C;


}
