import { AnimTrigger_KeyCode_State } from "../AnimTrigger_Base";
import { KeyCode } from "../KeyCode";
import { $GameTime } from "./GameTime";

export default class Input {

    private inputList: number[];
    private inputList_Last: number[];

    private keyDownTimeMap_last: number[];
    private keyDownTimeMap_now: number[];

    private keyState: KeyState[];

    public constructor() {

        this.inputList = []
        this.inputList_Last = [];

        this.keyState = new Array<number>(256).fill(0);

        this.keyDownTimeMap_now = new Array<number>(256).fill(0);
        this.keyDownTimeMap_last = new Array<number>(256).fill(-256);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }


    public Update() {

        this.inputList_Last.length = 0;

        for (let key of this.inputList) {
            this.inputList_Last.push(key);
        }




        for (let i = 0; i < this.KeyDownEventList.length; i++) {
            this.KeyDownEventList[i]();
        }
        this.KeyDownEventList.length = 0;

        for (let i = 0; i < this.KeyFirstDownEventList.length; i++) {
            this.KeyFirstDownEventList[i]();
        }
        this.KeyFirstDownEventList.length = 0;

        for (let i = 0; i < this.KeyUpEventList.length; i++) {
            this.KeyUpEventList[i]();
        }
        this.KeyUpEventList.length = 0;

        for (let i = 0; i < this.KeyDownList.length; i++) {
            if (($GameTime.time - this.keyDownTimeMap_now[this.KeyDownList[i]]) > 0.35) {
                this.keyState[this.KeyDownList[i]] = KeyState.holdDown;
            }
        }

    }

    public KeyFirstDownEventList: Function[] = [];
    public KeyUpEventList: Function[] = [];

    public KeyDownEventList: Function[] = [];

    public KeyDownList: KeyCode[] = [];

    /**
     * 检测是否只按下了这些按键
     * @param keyCodes 
     * @returns 
     */
    public IsOnlyDownTheseKeyCode(keyCodes: AnimTrigger_KeyCode_State[]): boolean {
        if (keyCodes.length != this.KeyDownList.length) {
            return false
        } else {
            // for (let i = 0; i < this.KeyDownList.length; i++) {
            //     if (keyCodes.indexOf(this.KeyDownList[i]) < 0) {
            //         return false;
            //     }
            // }
            for (let i = 0; i < keyCodes.length; i++) {
                if (this.KeyDownList.indexOf(keyCodes[i].code) < 0) { // 是否存在按键
                    return false;
                }
                if (keyCodes[i].stateList.indexOf(this.keyState[keyCodes[i].code]) < 0) {  // 按键状态是否匹配
                    return false;
                }
            }
            return true;
        }
    }







    onKeyDown(event: cc.Event.EventKeyboard) {
        let self = this;
        let code = event.keyCode;

        let fun = () => {
            if (self.inputList.indexOf(code) < 0) {
                self.inputList.push(code)

                let last = self.keyDownTimeMap_now[code];
                self.keyDownTimeMap_last[code] = last;
                self.keyDownTimeMap_now[code] = $GameTime.time;

                if (self.keyState[code] == KeyState.up) {
                    self.keyState[code] = KeyState.firstDown;

                    let sss = () => {
                        self.keyState[code] = KeyState.down;
                    }
                    sss.bind(self);
                    self.KeyDownEventList.push(sss);
                } else if (this.keyState[code] == KeyState.down) {
                    this.keyState[code] = KeyState.holdDown;
                }

                self.KeyDownList.push(code);
            }
        }
        fun.bind(self)
        self.KeyFirstDownEventList.push(fun);
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        let self = this;
        let code = event.keyCode;

        let fun = () => {
            while (true) {
                let index = self.inputList.indexOf(code);
                if (index >= 0)
                    self.inputList.splice(index, 1);
                else
                    break;
            }
            self.keyState[code] = KeyState.up;
            self.KeyDownList.splice(self.KeyDownList.indexOf(code), 1);
        }
        fun.bind(self)
        self.KeyUpEventList.push(fun);
    }


    public GetKeyState(keyCode: KeyCode): KeyState {
        return this.keyState[keyCode];
    }


    private doubleClickTime = 0.19;
    /** 双击 */
    public GetKeyDoubleClick(code: KeyCode) {
        let now = $GameTime.time;
        let last = this.keyDownTimeMap_last[code];
        if (now - last <= this.doubleClickTime)
            return true;
        return false;
    }


    public GetKey(code: KeyCode): boolean {
        let index = this.inputList.indexOf(code)
        return index >= 0;
    }

    public GetKeyDown(code: KeyCode): boolean {
        let index = this.inputList.indexOf(code)
        let index_l = this.inputList_Last.indexOf(code)
        return index >= 0 && index_l < 0;
    }

    public GetKeyDownToLong(code: KeyCode): boolean {
        let index = this.inputList.indexOf(code)
        let index_l = this.inputList_Last.indexOf(code)
        return index >= 0 && index_l >= 0;
    }

    public GetKeyUp(code: KeyCode): boolean {
        let index = this.inputList.indexOf(code)
        let index_l = this.inputList_Last.indexOf(code)
        return index < 0 && index_l >= 0;
    }


}

export enum KeyState {
    up = 0,
    firstDown = 1,
    down = 2,
    holdDown = 3,
}


export var $input: Input = new Input();
