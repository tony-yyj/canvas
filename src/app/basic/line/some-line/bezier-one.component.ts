import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import BezierLine from "../../../util/bezier-line";
import Point from "../../../util/point";
import {LineObjInterface} from "../../../interfaces/line.interface";

@Component({
    selector: 'app-line-bezier-one',
    template: `
        <canvas #canvas width="800" height="500">
            not support!
        </canvas>
    `
})

export class BezierOneComponent implements OnInit, AfterViewInit {

    @ViewChild('canvas') canvasDom: ElementRef;

    @Input() lineConfig;

    times: number = 0;

    // 线的原始对象数组
    sourceLine: {
        start: Point,
        end: Point,
        speed?: number,
    }[] = [
        {
            start: new Point(100, 50),
            end: new Point(500, 300),
        },
        {
            start: new Point(200, 300),
            end: new Point(500, 300),
        },
        {
            start: new Point(300, 220),
            end: new Point(400, 100),
        },
        {
            start: new Point(200, 400),
            end: new Point(400, 100),
        },
    ];

    context: CanvasRenderingContext2D;

    lineArr: LineObjInterface[] = [];


    // 控制方向
    director: boolean = true;
    // 数组最大长度
    MAX_LEN: number = 100;
    // 速度
    SPEED: number = 1;

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        this.context = this.canvasDom.nativeElement.getContext('2d');
        this.init();
        this.render();
    }

    init() {
        // 多条线段
        this.sourceLine.forEach(item => {
            const line = new BezierLine(item.start, item.end);
            const pointArr: Point[] = [];
            for (let i = 0; i < 1; i +=  1 / this.MAX_LEN) {
                const point = line.calculateBezierPointForQuadratic(i);
                pointArr.push(point);
            }
            this.lineArr.push({
                line,
                pointArr,
            });
        });
    }

    drawBg() {
        // 填充背景
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, this.canvasDom.nativeElement.width, this.canvasDom.nativeElement.height);

        // 画出开始点和结束点
        this.lineArr.forEach((item) => {
            [item.line.start, item.line.end].forEach((point: Point) => {
                this.drawCycle(point, 6, 'red');
                this.drawLine(item.line);
            })
        });
    }

    draw() {
        // 在页面上展示的是5百个点
        this.lineArr.forEach(item => {
            if (this.director) {
                for (let i = 0; i < this.times; i ++) {
                    this.drawCycle(item.pointArr[i], 1.5, 'white');
                }
            } else {
                for (let i = this.times; i < this.MAX_LEN; i ++) {
                    this.drawCycle(item.pointArr[i], 1.5, 'white');
                }
            }

        });
        if (Math.floor(this.times) >= this.MAX_LEN) {
            this.times = 0;
            this.director = !this.director;
        }
        this.times = this.times + this.SPEED > this.MAX_LEN ? this.MAX_LEN : this.times + this.SPEED;

    }

    drawLine(line: BezierLine) {
        this.context.beginPath();
        this.context.moveTo(line.start.x, line.start.y);
        this.context.quadraticCurveTo(line.middle.x, line.middle.y, line.end.x, line.end.y);
        this.context.lineWidth = this.lineConfig.lineWidth;
        this.context.strokeStyle = this.lineConfig.strokeStyle;
        this.context.stroke();
        this.context.closePath();
    }

    drawCycle(point: Point, radius: number = 2, color: string = 'red') {
        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.arc(point.x, point.y, radius, 0, 2 * Math.PI);
        this.context.fill();
        this.context.closePath();
    }

    private render() {
        this.context.clearRect(0, 0, this.canvasDom.nativeElement.width, this.canvasDom.nativeElement.height);
        this.drawBg();
        this.draw();
        window.requestAnimationFrame(this.render.bind(this));
    }

}
