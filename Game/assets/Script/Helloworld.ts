import { $input } from "./KU/Input";
import { QuadTree, Bound } from "./KU/QuadTree";
import { QuadTreeManage } from "./KU/QuadTreeManage";
import { $GameTime } from "./KU/GameTime";
import PlayerInputBuffer from "./PlayerInputBuffer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property
    text: string = 'hello';

    @property(cc.Node)
    tile: cc.Node = null;


    start() {

        this.creatMetope();

    }

    private creatMetope() {

        let self = this;

        // cc.resources.load("T", cc.SpriteFrame, (err, ass: cc.SpriteFrame) => {
        //     let go = new cc.Node("Sprite");
        //     let t = go.addComponent(cc.Sprite);
        //     t.spriteFrame = ass;
        //     self.node.addChild(t.node);
        //     // t.node.x = self.node.width / 2;
        //     // t.node.y = self.node.height / 2;
        // });


        let b: Bound = new Bound;
        b.x = 0
        b.y = 0
        b.width = this.node.width;
        b.height = this.node.height;
        let qt: QuadTree = new QuadTree(b);

        QuadTreeManage.Inst().AddTag("", b);

        let t: Bound = new Bound();
        let tp = this.tile.convertToWorldSpaceAR(new cc.Vec2(0, 0));
        t.x = tp.x;
        t.y = tp.y;
        t.width = this.tile.width;
        t.height = this.tile.height;

        QuadTreeManage.Inst().AddQuadTree("", t);




    }



    update(dt) {
        $input.Update();
        $GameTime.Update(dt);
        PlayerInputBuffer.Inst().update();

    }


    lateUpdate() {

    }

}
