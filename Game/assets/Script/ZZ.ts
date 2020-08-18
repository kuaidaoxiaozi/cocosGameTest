// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PlayerBases from "./Base/PlayerBase";
import { $input } from "./KU/Input";
import { KeyCode } from "./KeyCode";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ZZ extends PlayerBases {

    onLoad() {
        super.onLoad();

        this.anim_S = this.anim.play("K_stand");
    }

    start() {

    }



    

    private move() {

        let l = $input.GetKey(KeyCode.LeftArrow);
        let r = $input.GetKey(KeyCode.RightArrow);

        // let axis = l ? -1 : (r ? 1 : 0);// 键盘朝向
        let axis = 0;
        axis += (l ? -1 : 0);
        axis += (r ? 1 : 0);

        if (axis != 0)
            this.face = axis;





    }



    update(dt) {

    }



}
