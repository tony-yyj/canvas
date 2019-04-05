import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import Point from "../../../util/point";
import {LineObjInterface} from "../../../interfaces/line.interface";
import BezierLine from "../../../util/bezier-line";

@Component({
    selector: 'app-line-bezier-two',
    template: `
        <canvas #canvas width="800" height="500">
            not support!
        </canvas>
    `
})

export class BezierTwoComponent implements OnInit, AfterViewInit {

    @ViewChild('canvas') canvasDom: ElementRef;

    @Input() lineConfig;

    currentLine: LineObjInterface;

    // 帧率跳动
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
            speed: 2,
        },
        {
            start: new Point(200, 300),
            end: new Point(500, 300),
            speed: 3,
        },
        {
            start: new Point(300, 220),
            end: new Point(400, 100),
            speed: 0.5,
        },
        {
            start: new Point(200, 400),
            end: new Point(400, 100),
        },
    ];

    // 数组最大长度
    MAX_LEN: number = 100;
    // 速度
    SPEED: number = 1; // 默认速度，如果线没有设定速度，默认以这个速度

    context: CanvasRenderingContext2D;

    lineArr: LineObjInterface[] = [];

    // 线的索引发生器
    generIndex;

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        this.context = this.canvasDom.nativeElement.getContext('2d');
        this.init();
        this.drawBg();
        this.draw();
        this.render();
    }

    draw() {
        // 类似于接棒赛，一条线走完后传递给另一条线（速度可以是小数）
        this.currentLine.cursor+= this.currentLine.speed;
        const cursor = Math.floor(this.currentLine.cursor);
        if (cursor < this.MAX_LEN) {
            // 小于一倍长度，正常走
            for (let i = 0; i < cursor; i ++) {
                this.drawCycle(this.currentLine.pointArr[i], 1.5, 'white');
            }
        } else if (cursor >= this.MAX_LEN && cursor < this.MAX_LEN * 2) {
            // 大于一倍长度且小于二倍长度，收尾
            for (let i = cursor - this.MAX_LEN; i < this.MAX_LEN; i ++) {
                this.drawCycle(this.currentLine.pointArr[i], 1.5, 'white');
            }
        } else  if (cursor >=  this.MAX_LEN * 2) {
            // 大于等于2倍长度，说明走完了，换下一个
            this.currentLine.cursor = 0;
            const index = this.generIndex.next().value;
            this.currentLine = this.lineArr[index];
        }
    }

     * getLineIndex() {
        const length = this.lineArr.length;
        let i = 0;
        while(true) {
            yield i % length;
            i ++;
        }
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
                speed: item.speed ? item.speed : this.SPEED,
                cursor: 0,
            });
        });
        this.generIndex = this.getLineIndex();
        this.currentLine = this.lineArr[this.generIndex.next().value];
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
