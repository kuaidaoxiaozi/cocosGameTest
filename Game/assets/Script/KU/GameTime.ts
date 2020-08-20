// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


export default class GameTime {
    private _time: number = 0;
    private _deltaTime: number = 0;
    public get time() {
        return this._time;
    }
    public get deltaTime() {
        return this._deltaTime;
    }
    public Update(dt: number) {
        this._time += dt
        this._deltaTime = dt;
    }

}


export var $GameTime: GameTime = new GameTime(); 