import { QuadTree, Bound } from "./QuadTree";


export default class QuadTreeManage {
    private constructor() {
        this._quadTreeMap = {};
    }
    private _quadTreeMap: { [tag: string]: QuadTree };

    private static _inst: QuadTreeManage;
    public static Inst() {
        if (!this._inst) this._inst = new QuadTreeManage();
        return this._inst;
    }

    public AddTag(tag: string, bound: Bound) {
        if (!this._quadTreeMap[tag])
            this._quadTreeMap[tag] = new QuadTree(bound)
        else
            console.error("已存在的 Tag ：" + tag);

    }

    public AddQuadTree(tag: string, bound: Bound) {
        this._quadTreeMap[tag].insert(bound);
    }

    public Retrieve(tag: string, bound: Bound): Bound[] {
        return this._quadTreeMap[tag].retrieve(bound);
    }

    public Retrieves(tags: string[], bound: Bound) {
        let arr = [];
        for (let i = 0; i < tags.length; i++) {
            arr.concat(this._quadTreeMap[tags[i]].retrieve(bound));
        }
        return arr;
    }



}