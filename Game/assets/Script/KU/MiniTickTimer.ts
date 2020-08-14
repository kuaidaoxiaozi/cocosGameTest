// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


export default class MiniTickTimer {
    constructor(time: number) {
        this._time = this._time_n = time;
    }


    public _time: number = 0;
    public _time_n: number = 0;


    public IsStop: boolean = true


    public CallBack: Function = null;




    public Update(dt: number) {
        if (this._time_n > 0) {
            this._time_n -= dt;
            if (this._time_n <= 0) {
                this
                if (this.CallBack != null) {
                    this.CallBack();
                    this._time_n = 0
                }
            }
        }
    }



}
