// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SkillCtrlCfg_Base from "./SkillCtrl_Base";
import { $input } from "./KU/Input";
import PlayerKeyCode from "./PlayerKeyCode";
import { PlayerInfoData } from "./SkillInfo_Base";
import { $GameTime } from "./KU/GameTime";
import FrameInfo from "./FrameInfo";

export default class SkillCtrler_Base {

    public cfg: SkillCtrlCfg_Base;

    public ctrler(info: PlayerInfoData, frameInfo: FrameInfo) {
        if (this.cfg.IsTrigger(info, frameInfo)) {
            this.event(info, frameInfo);
        }
    }
    protected event(info: PlayerInfoData, frameInfo: FrameInfo) { }

    /** 标记 大于0 => 1，等于0 => 0，小于0 => -1 */
    public Sign(n: number): number {
        return (n > 0 ? 1 : (n < 0 ? -1 : 0))
    }

}


export class SkillCtrler_SwitchSkill extends SkillCtrler_Base {

    public nextSkillName: string
    public anim: cc.Animation;

    protected event(info: PlayerInfoData, frameInfo: FrameInfo) {
        this.anim.play(this.nextSkillName);
    }

}

export class SkillCtrler_AttackMove extends SkillCtrler_Base {

    protected event(info: PlayerInfoData, frameInfo: FrameInfo) {
        let dis = frameInfo.moveDis * $GameTime.deltaTime;

        info.node.x += info.face * dis;
    }
}


export class SkillCtrler_SwitchDirection extends SkillCtrler_Base {

    public scale = 1;

    protected event(info: PlayerInfoData, frameInfo: FrameInfo) {

        let l = $input.GetKey(PlayerKeyCode.Left);
        let r = $input.GetKey(PlayerKeyCode.Right);

        let axis = 0;
        axis += (l ? -1 : 0);
        axis += (r ? 1 : 0);

        if (axis != 0) {
            info.face = axis;
            info.node.scaleX = axis * this.scale;
        }
    }
}

export class SkillCtrler_Move extends SkillCtrler_Base {

    protected event(info: PlayerInfoData, frameInfo: FrameInfo) {
        this.move(info, frameInfo);
    }

    private move(info: PlayerInfoData, frameInfo: FrameInfo) {

        let dt = $GameTime.deltaTime;

        // let axis = info.face;

        let l = $input.GetKey(PlayerKeyCode.Left);
        let r = $input.GetKey(PlayerKeyCode.Right);

        let axis = 0;
        axis += (l ? -1 : 0);
        axis += (r ? 1 : 0);

        info.speed_X += (axis * info.acce * dt);


        if (axis == 0) {
            let s1 = Math.abs(info.speed_X) - (info.friction * dt);
            let s2 = Math.max(s1, 0);
            info.speed_X = s2 * info.face;
        }


        if (info.speed_X != 0) {
            info.face = this.Sign(info.speed_X);
            info.node.scaleX = this.Sign(info.speed_X) * Math.abs(info.node.scaleX);
        }

        if (Math.abs(info.speed_X) > info.speed_X_Max) {
            info.speed_X = this.Sign(info.speed_X) * info.speed_X_Max;
        }

        info.node.x += info.speed_X * dt;
    }

}

/** 下落 */
export class SkillCtrler_Descend extends SkillCtrler_Base {

    protected event(info: PlayerInfoData, frameInfo: FrameInfo) {

        info.speed_Y += info.gravity * $GameTime.deltaTime;
        if (Math.abs(info.speed_Y) > info.speed_Y_Max) {
            info.speed_Y = this.Sign(info.speed_Y) * info.speed_Y_Max;
        }

        info.node.y += info.speed_Y * $GameTime.deltaTime;
    }

}
