import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Point from "../../util/point";
import BezierLine from "../../util/bezier-line";

@Component({
    selector: 'app-line',
    templateUrl: './line.component.html',
    styleUrls: ['./line.component.less']
})
export class LineComponent implements OnInit, AfterViewInit {

    @ViewChild('canvas') canvasDom: ElementRef;

    times: number = 0;

    context: CanvasRenderingContext2D;

    lineWidth = 1;
    strokeStyle = 'rgba(255,206,41,.5)';

    lineArr: {
        line: BezierLine, // 存储贝塞尔曲线对象
        pointArr: Point[], // 贝塞尔曲线上的点
    }[] = [];

    // 控制方向
    director: boolean = true;
    // 数组最大长度
    MAX_LEN: number = 1000;
    // 速度
    SPEED: number = 5;

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.context = this.canvasDom.nativeElement.getContext('2d');
        this.init();
        this.render();
    }

    private render() {
        this.drawBg();
        this.draw();
        window.requestAnimationFrame(this.render.bind(this));
    }

    init() {
        // 多条线段
        [
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
                start: new Point(200, 500),
                end: new Point(400, 100),
            },
        ].forEach(item => {
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
        if (Math.floor(this.times) >= 1000) {
            this.times = 0;
            this.director = !this.director;
        }
        this.times = this.times + this.SPEED > this.MAX_LEN ? this.MAX_LEN : this.times + this.SPEED;

    }

    drawLine(line: BezierLine) {
        this.context.beginPath();
        this.context.moveTo(line.start.x, line.start.y);
        this.context.quadraticCurveTo(line.middle.x, line.middle.y, line.end.x, line.end.y);
        this.context.strokeStyle = this.strokeStyle;
        this.context.lineWidth = this.lineWidth;
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


}
