/**
 * 动画状态
 */
export default class AnimState {

    public constructor(anim_s: cc.AnimationState) {
        this.Anim_S = anim_s;
    }

    private Anim_S: cc.AnimationState;
    private EventList;


    public play() {

    }






    public update() {

        for (let e of this.EventList) {
            if (e.isTrigger()) {
                e.Event();
            }
        }

    }

}
