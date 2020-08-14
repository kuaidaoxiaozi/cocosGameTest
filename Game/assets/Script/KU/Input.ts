import { KeyCode } from "../KeyCode";
import { $GameTime } from "./GameTime";

export default class Input {

    private inputList: number[];
    private inputList_Last: number[];

    private keyDownTimeMap_last: number[];
    private keyDownTimeMap_now: number[];

    public constructor() {

        this.inputList = []
        this.inputList_Last = [];

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

        for (let i = 0; i < this.KeyUpEventList.length; i++) {
            this.KeyUpEventList[i]();
        }
        this.KeyUpEventList.length = 0;

    }

    public KeyDownEventList: Function[] = [];
    public KeyUpEventList: Function[] = [];


    onKeyDown(event: cc.Event.EventKeyboard) {
        let self = this;
        let code = event.keyCode;

        function fun() {
            if (self.inputList.indexOf(code) < 0) {
                self.inputList.push(code)

                let last = self.keyDownTimeMap_now[code];
                self.keyDownTimeMap_last[code] = last;
                self.keyDownTimeMap_now[code] = $GameTime.time;
            }
        }
        fun.bind(self)
        self.KeyDownEventList.push(fun);
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        let self = this;
        let code = event.keyCode;

        function fun() {
            while (true) {
                let index = self.inputList.indexOf(code);
                if (index >= 0)
                    self.inputList.splice(index, 1);
                else
                    break;
            }
        }
        fun.bind(self)
        self.KeyUpEventList.push(fun);
    }

    private doubleClickTime = 0.19;
    public GetKeyDoubleClick(code: KeyCode) {
        let now =$GameTime.time;
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

export var $input: Input = new Input();
