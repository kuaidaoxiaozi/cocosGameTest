// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


export default class ActorBehavior {
    public update() {

    }
    /** 标记 大于0 => 1，等于0 => 0，小于0 => -1 */
    public Sign(n: number): number {
        return (n > 0 ? 1 : (n < 0 ? -1 : 0))
    }

}
