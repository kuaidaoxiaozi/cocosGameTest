import { Bound } from "./QuadTree";

export class AABBCollision {

	public static HitboxToHitbox(a: Bound, b: Bound): boolean {
		return (a.x + a.width > b.x && a.y + a.height > b.y && a.x < b.x + b.width && a.y < b.y + b.height);
	}


}