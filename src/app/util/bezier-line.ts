import Point from "./point";

export default class BezierLine {
    
    middle: Point;
    
    start: Point;
    end: Point;
    
    constructor(start: Point, end: Point) {
        this.start = start;
        this.end = end;
        this.getMiddlePoint();
    }

    /**
     * 获得平方贝塞尔曲线的控制点
     */
    private getMiddlePoint() {
        // 平方贝塞尔曲线的点
        this.middle = new Point(
            (this.start.x + this.end.x) / 2 - (this.start.y - this.end.y) * 0.4,
            (this.start.y + this.end.y) / 2 - (this.end.x - this.start.x) * 0.4,
        );
    }

    /**
     * B(t) = (1 - t)^2 * P0 + 2t * (1 - t) * P1 + t^2 * P2, t ∈ [0,1]
     * @param t  曲线长度比例
     */
    public calculateBezierPointForQuadratic(t): Point {
        const temp = 1 - t;
        return new Point(
            temp * temp * this.start.x + 2 * t * temp * this.middle.x + t * t * this.end.x,
            temp * temp * this.start.y + 2 * t * temp * this.middle.y + t * t * this.end.y
            );
    }
}
