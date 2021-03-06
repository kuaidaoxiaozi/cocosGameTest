
/**
 * quadtree-js
 * @version 1.2.2
 * @license MIT
 * @author Timo Hausmann
 */

/* https://github.com/timohausmann/quadtree-js.git v1.2.2 */

/*
Copyright © 2012-2020 Timo Hausmann
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/** 把大佬的东西改成Ts，添加注释，用于学习 */

/**
 * 四叉树碰撞，原点在左上角
 */
export class QuadTree {
    /** 最大可容纳对象数 */
    private max_objects: number;
    /** 最大深度 */
    private max_levels: number;
    /** 当前节点深度 */
    private level: number;
    /** 当前区域的信息 */
    private bounds: Bound;
    /** 当前区域存放的对象 */
    private objects: Bound[];
    /** 当前区域的子节点 */
    private nodes: QuadTree[];


    public constructor(bounds: Bound, max_objects: number = 10, max_levels: number = 4, level: number = 0) {

        this.max_objects = max_objects;
        this.max_levels = max_levels;

        this.level = level;
        this.bounds = bounds;

        this.objects = [];
        this.nodes = [];
    }


    /**
     * Split the node into 4 subnodes
     * 将节点分割为4个子节点
     */
    private split() {
        let nextLevel = this.level + 1
        let subWidth = this.bounds.width / 2
        let subHeight = this.bounds.height / 2
        let _x = this.bounds.x
        let _y = this.bounds.y;


        //top right node
        let ne = new Bound;
        ne.x = _x + subWidth
        ne.y = _y + subHeight
        ne.width = subWidth
        ne.height = subHeight
        this.nodes[QuadtreeDir.NE] = new QuadTree(ne, this.max_objects, this.max_levels, nextLevel);
        // this.nodes[QuadtreeDir.NE] = new QuadTree({
        //     x: _x + subWidth,
        //     y: _y + subHeight,
        //     width: subWidth,
        //     height: subHeight
        // }, this.max_objects, this.max_levels, nextLevel);


        //top left node
        let nw = new Bound;
        nw.x = _x
        nw.y = _y + subHeight
        nw.width = subWidth
        nw.height = subHeight
        this.nodes[QuadtreeDir.NW] = new QuadTree(nw, this.max_objects, this.max_levels, nextLevel);
        // this.nodes[QuadtreeDir.NW] = new QuadTree({
        //     x: _x,
        //     y: _y + subHeight,
        //     width: subWidth,
        //     height: subHeight
        // }, this.max_objects, this.max_levels, nextLevel);


        //bottom left node
        let sw = new Bound;
        sw.x = _x
        sw.y = _y
        sw.width = subWidth
        sw.height = subHeight
        this.nodes[QuadtreeDir.SW] = new QuadTree(sw, this.max_objects, this.max_levels, nextLevel);
        // this.nodes[QuadtreeDir.SW] = new QuadTree({
        //     x: _x,
        //     y: _y,
        //     width: subWidth,
        //     height: subHeight
        // }, this.max_objects, this.max_levels, nextLevel);


        //bottom right node
        let se = new Bound;
        se.x = _x + subWidth
        se.y = _y
        se.width = subWidth
        se.height = subHeight
        this.nodes[QuadtreeDir.SE] = new QuadTree(se, this.max_objects, this.max_levels, nextLevel);
        // this.nodes[QuadtreeDir.SE] = new QuadTree({
        //     x: _x + subWidth,
        //     y: _y,
        //     width: subWidth,
        //     height: subHeight
        // }, this.max_objects, this.max_levels, nextLevel);
    };


    /**
     * Determine which node the object belongs to
     * 确定对象属于哪个节点
     * @param pRect     bounds of the area to be checked, with x, y, width, height 
     *                  要检查的区域的边界，x, y，宽度，高度
     * @return Array    an array of indexes of the intersecting subnodes  
     *                  (0-3 = top-right, top-left, bottom-left, bottom-right / ne, nw, sw, se)
     *                  相交子节点的索引数组
     *                  (0-3 =右上，左上，左下，右下 / 东北，西北，西南，东南)
     * 
     */
    private getIndex(pRect: Bound): number[] {

        let indexes: number[] = []
        let horizontalMidpoint = this.bounds.x + (this.bounds.width / 2)
        let verticalMidpoint = this.bounds.y + (this.bounds.height / 2)

        let startIsNorth = pRect.y > verticalMidpoint
        let startIsWest = pRect.x < horizontalMidpoint
        let endIsEast = pRect.x + pRect.width > horizontalMidpoint
        let endIsSouth = pRect.y + pRect.height < verticalMidpoint

        //top-right quad
        if (startIsNorth && endIsEast) {
            indexes.push(QuadtreeDir.NE);
        }

        //top-left quad
        if (startIsWest && startIsNorth) {
            indexes.push(QuadtreeDir.NW);
        }

        //bottom-left quad
        if (startIsWest && endIsSouth) {
            indexes.push(QuadtreeDir.SW);
        }

        //bottom-right quad
        if (endIsEast && endIsSouth) {
            indexes.push(QuadtreeDir.SE);
        }

        return indexes;
    }


    /**
     * Insert the object into the node. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding subnodes.
     * 将对象插入节点。
     * 如果节点超出容量，它将分割所有对象并将其添加到相应的子节点。
     * @param pRect bounds of the object to be added { x, y, width, height }
     */
    public insert(pRect: Bound) {

        let i = 0,
            indexes: number[];

        //if we have subnodes, call insert on matching subnodes
        if (this.nodes.length) {
            indexes = this.getIndex(pRect);

            for (i = 0; i < indexes.length; i++) {
                this.nodes[indexes[i]].insert(pRect);
            }
            return;
        }

        //otherwise, store object here
        this.objects.push(pRect);

        //max_objects reached
        if (this.objects.length > this.max_objects && this.level < this.max_levels) {

            //split if we don't already have subnodes
            if (!this.nodes.length) {
                this.split();
            }

            //add all objects to their corresponding subnode
            for (i = 0; i < this.objects.length; i++) {
                indexes = this.getIndex(this.objects[i]);
                for (let k = 0; k < indexes.length; k++) {
                    this.nodes[indexes[k]].insert(this.objects[i]);
                }
            }

            //clean up this node
            this.objects = [];
        }
    }


    /**
     * Return all objects that could collide with the given object
     * 返回所有可能与给定对象发生冲突的对象
     * @param Object pRect      bounds of the object to be checked { x, y, width, height }
     *                          要检查的对象的边界{x, y，宽度，高度}
     * @Return Array            array with all detected objects
     *                          包含所有检测到的对象的数组
     */
    public retrieve(pRect: Bound): Bound[] {

        let indexes = this.getIndex(pRect),
            returnObjects = this.objects;

        //if we have subnodes, retrieve their objects
        if (this.nodes.length) {
            for (let i = 0; i < indexes.length; i++) {
                returnObjects = returnObjects.concat(this.nodes[indexes[i]].retrieve(pRect));
            }
        }

        //remove duplicates
        returnObjects = returnObjects.filter(function (item: any, index: number) {
            return returnObjects.indexOf(item) >= index;
        });

        return returnObjects;
    }


    /**
     * Clear the quadtree
     * 清空四叉树
     */
    public clear() {

        this.objects = [];

        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes.length) {
                this.nodes[i].clear();
            }
        }

        this.nodes = [];
    }
}


export enum QuadtreeDir {
    /** top-right 右上 */
    NE,
    /** top-left 左上 */
    NW,
    /** bottom-left 左下 */
    SW,
    /** bottom-right 右下 */
    SE
}

export class Bound {
    public x: number = 0;
    public y: number = 0;
    public width: number = 0;
    public height: number = 0;
    /** 是否能攀爬 */
    public climb: boolean = false;

    public copy(): Bound {
        let b = new Bound;
        b.x = this.x
        b.y = this.y
        b.width = this.width
        b.height = this.height
        b.climb = this.climb
        return b;
    }
}
