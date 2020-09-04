import { $input } from "./KU/Input";
import { QuadTree, Bound } from "./KU/QuadTree";
import QuadTreeManage from "./KU/QuadTreeManage";
import { $GameTime } from "./KU/GameTime";
import PlayerInputBuffer from "./PlayerInputBuffer";
import Tile from "./Tile";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property
    text: string = 'hello';

    @property(Tile)
    tile0: Tile = null
    @property(Tile)
    tile1: Tile = null
    @property(Tile)
    tile2: Tile = null
    @property(Tile)
    tile3: Tile = null


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
        b.x = -2000
        b.y = -2000
        b.width = 5000;
        b.height = 5000;

        QuadTreeManage.Inst().AddTag("", b);

        for (let i = 0; i < 4; i++) {
            let tile = this["tile" + i] as Tile;
            let t: Bound = tile.GetBound();
            QuadTreeManage.Inst().AddQuadTree("", t);
        }

    }



    update(dt) {
        $input.Update();
        $GameTime.Update(dt);
        PlayerInputBuffer.Inst().update();

    }


    lateUpdate() {

    }

}
