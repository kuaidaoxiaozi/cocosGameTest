// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Bound } from "../KU/QuadTree";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EntityBase extends cc.Component {

    onLoad() { }

    start() { }

    // update (dt) {}


    protected GetSelfBound() {
        let b = new Bound();
        let wp = this.GetSelfWorldPos();
        b.x = wp.x;
        b.y = wp.y
        b.width = this.node.width;
        b.height = this.node.height;
        return b
    }

    protected GetBound(node: cc.Node): Bound {
        let b = new Bound();
        let wp = this.GetWorldPos(node);
        b.x = wp.x;
        b.y = wp.y
        b.width = node.width;
        b.height = node.height;
        return b;
    }

    /** 获取当前节点的世界坐标 */
    protected GetSelfWorldPos(): cc.Vec2 {
        return this.node.convertToWorldSpaceAR(new cc.Vec2(0, 0));
    }

    /** 获取当前节点的世界坐标 */
    protected GetWorldPos(node: cc.Node): cc.Vec2 {
        return node.convertToWorldSpaceAR(new cc.Vec2(0, 0));
    }
}
