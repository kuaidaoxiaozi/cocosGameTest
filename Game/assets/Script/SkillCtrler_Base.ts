// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SkillCtrlCfg_Base from "./SkillCtrl_Base";
import { $input } from "./KU/Input";
import PlayerKeyCode from "./PlayerKeyCode";
import { $GameTime } from "./KU/GameTime";
import FrameInfo from "./FrameInfo";
import PlayerInfoData from "./PlayerInfoData";
import QuadTreeManage from "./KU/QuadTreeManage";
import AABBCollision from "./KU/AABBCollision";
import AnimTrigger_Base from "./AnimTrigger_Base";


/** 技能事件的基类 */
export default class SkillCtrler_Base {

    public cfg: SkillCtrlCfg_Base;

    constructor() {
        this.cfg = new SkillCtrlCfg_Base();
    }

    /** 添加一个触发器 */
    public AddTrigger(tri: AnimTrigger_Base) {
        this.cfg.AddTrigger(tri);
    }

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

/** 切换动画 */
export class SkillCtrler_SwitchSkill extends SkillCtrler_Base {

    /**
     * 
     * @param nextSkillName 切换的动画名字
     */
    constructor(nextSkillName: string = "") {
        super();
        this.nextSkillName = nextSkillName;
    }

    public nextSkillName: string

    protected event(info: PlayerInfoData, frameInfo: FrameInfo) {
        info.anim.play(this.nextSkillName);
    }

}

export class SkillCtrler_AttackMove extends SkillCtrler_Base {
    constructor() {
        super();
    }
    protected event(info: PlayerInfoData, frameInfo: FrameInfo) {
        let dic = info.face * frameInfo.moveDis * $GameTime.deltaTime;

        info.MovementRemainder_X = dic % 1;

        let moveBy = dic > 0 ? Math.floor(dic) : Math.ceil(dic); // 像素取整
        let step = this.Sign(moveBy);// 朝向

        while (moveBy != 0) {
            let b = info.playerCollision.GetCollBoxBound();
            b.x += step;
            let qt = QuadTreeManage.Inst().Retrieve("", b);
            for (let q of qt) {
                if (AABBCollision.HitboxToHitbox(q, b) && q.climb == false) {
                    info.Speed_X = 0;
                    return;
                }
            }
            info.node.x += step;
            moveBy -= step;
        }

        // info.node.x += info.face * dis;
    }
}


export class SkillCtrler_SwitchDirection extends SkillCtrler_Base {
    constructor() {
        super();
    }

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

export class SkillCtrler_Move_X extends SkillCtrler_Base {
    constructor() {
        super();
    }

    protected event(info: PlayerInfoData, frameInfo: FrameInfo) {
        this.move(info, frameInfo);
    }

    private move(info: PlayerInfoData, frameInfo: FrameInfo) {

        let dt = $GameTime.deltaTime;

        let axis = info.Input_X;

        info.Speed_X += (axis * info.acce * dt);


        if (axis == 0) {
            let s1 = Math.abs(info.Speed_X) - (info.friction * dt);
            let s2 = Math.max(s1, 0);
            info.Speed_X = s2 * info.face;
        }


        if (info.Speed_X != 0) {
            info.face = this.Sign(info.Speed_X);
            info.node.scaleX = this.Sign(info.Speed_X) * Math.abs(info.node.scaleX);
        }

        if (Math.abs(info.Speed_X) > info.Speed_X_Max) {
            info.Speed_X = this.Sign(info.Speed_X) * info.Speed_X_Max;
        }

        let dic = info.Speed_X * $GameTime.deltaTime + info.MovementRemainder_X;
        info.MovementRemainder_X = dic % 1;

        let moveBy = dic > 0 ? Math.floor(dic) : Math.ceil(dic); // 像素取整
        let step = this.Sign(moveBy);// 朝向

        while (moveBy != 0) {
            let b = info.playerCollision.GetCollBoxBound();
            b.x += step;
            let qt = QuadTreeManage.Inst().Retrieve("", b);
            for (let q of qt) {
                if (AABBCollision.HitboxToHitbox(q, b) && q.climb == false) {
                    info.Speed_X = 0;
                    return;
                }
            }
            info.node.x += step;
            moveBy -= step;
        }

        // info.node.x += info.Speed_X * dt;
    }

}

/** 下落 */
export class SkillCtrler_Move_Y extends SkillCtrler_Base {
    constructor() {
        super();
    }

    protected event(info: PlayerInfoData, frameInfo: FrameInfo) {

        info.Speed_Y += info.gravity * $GameTime.deltaTime;
        if (Math.abs(info.Speed_Y) > info.Speed_Y_Max) {
            info.Speed_Y = this.Sign(info.Speed_Y) * info.Speed_Y_Max;
        }


        let dic = info.Speed_Y * $GameTime.deltaTime + info.MovementRemainder_Y;
        info.MovementRemainder_Y = dic % 1;

        let moveBy = dic > 0 ? Math.floor(dic) : Math.ceil(dic); // 像素取整
        let step = this.Sign(moveBy);// 朝向

        while (moveBy != 0) {
            let b = info.playerCollision.GetCollBoxBound();
            b.y += step;
            let qt = QuadTreeManage.Inst().Retrieve("", b);
            for (let q of qt) {
                if (AABBCollision.HitboxToHitbox(q, b)) {
                    if (q.climb == false) {
                        if (info.Speed_Y > 1)
                            info.Speed_Y = 1
                        else
                            info.Speed_Y = 0;
                        return;
                    } else {
                        if ((b.y - step) == (q.y + q.height) && step < 0) {
                            if (info.Speed_Y > 1)
                                info.Speed_Y = 1
                            else
                                info.Speed_Y = 0;
                            return;
                        }
                    }
                }
            }
            info.node.y += step;
            moveBy -= step;
        }


        // info.node.y += info.Speed_Y * $GameTime.deltaTime;
    }

}


/** 下落 */
export class SkillCtrler_Move_Down extends SkillCtrler_Base {
    constructor() {
        super();
    }

    public speed: number = 0;

    protected event(info: PlayerInfoData, frameInfo: FrameInfo) {

        info.Speed_Y += info.gravity * $GameTime.deltaTime;
        if (Math.abs(info.Speed_Y) > info.Speed_Y_Max) {
            info.Speed_Y = this.Sign(info.Speed_Y) * info.Speed_Y_Max;
        }


        let dic = this.speed * $GameTime.deltaTime + info.MovementRemainder_X;
        info.MovementRemainder_X = dic % 1;

        let moveBy = dic > 0 ? Math.floor(dic) : Math.ceil(dic); // 像素取整
        let step = this.Sign(moveBy);// 朝向

        while (moveBy != 0) {
            let b = info.playerCollision.GetCollBoxBound();
            b.y += step;
            let qt = QuadTreeManage.Inst().Retrieve("", b);
            for (let q of qt) {
                if (AABBCollision.HitboxToHitbox(q, b)) {
                    if (q.climb == false) {
                        if (info.Speed_Y > 1)
                            info.Speed_Y = 1
                        else
                            info.Speed_Y = 0;
                        return;
                    } else {
                        if ((b.y - step) == (q.y + q.height) && step < 0) {
                            if (info.Speed_Y > 1)
                                info.Speed_Y = 1
                            else
                                info.Speed_Y = 0;
                            return;
                        }
                    }
                }
            }
            info.node.y += step;
            moveBy -= step;
        }


        // info.node.y += info.Speed_Y * $GameTime.deltaTime;
    }

}




/** 跳 */
export class SkillCtrler_Jump extends SkillCtrler_Base {
    constructor() {
        super();
    }

    public nextSkillName: string;

    protected event(info: PlayerInfoData, frameInfo: FrameInfo) {

        info.anim.play(this.nextSkillName);
        info.Speed_Y = info.Speed_Jump;

    }

}

/** 下跳 */
export class SkillCtrler_DownJump extends SkillCtrler_Base {
    constructor() {
        super();
    }


    protected event(info: PlayerInfoData, frameInfo: FrameInfo) {
        info.node.y -= 2;
        info.collision_Botton = false;
    }

}