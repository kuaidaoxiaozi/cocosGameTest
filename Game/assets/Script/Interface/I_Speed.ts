// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


export default interface I_Speed {
    /** X 轴速度 */
    speed_X: number
    /** Y 轴速度 */
    speed_Y: number

    /** 横向最大移动速度 */
    speed_X_Max: number
    /** 纵向最大移动速度 */
    speed_Y_Max: number
}