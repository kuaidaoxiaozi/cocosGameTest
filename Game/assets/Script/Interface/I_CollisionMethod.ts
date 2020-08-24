// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Bound } from "../KU/QuadTree";


export default interface I_CollisionMethod {

    GetCollBoxBound(): Bound

    IsCollideToMove(x: number, y: number): boolean

    GetAttackBoxBound(): Bound


}
