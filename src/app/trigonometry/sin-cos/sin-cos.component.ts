import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Point from "./point";

@Component({
    selector: 'app-sin-cos',
    templateUrl: './sin-cos.component.html',
    styleUrls: ['./sin-cos.component.less']
})
export class SinCosComponent implements OnInit, AfterViewInit {

    @ViewChild('canvasSin') canvasSinDom: ElementRef;

    context: CanvasRenderingContext2D;

    bgColor: string = '#000';

    // 坐标轴的配置
    axisConfig = {
        origin: new Point(20, 0),
        xLen: 400,
        yLen: 250,
        // 箭头的角度
        arrowAngle: 30,
        // 箭头的长度
        arrowLen: 10,
        // 坐标轴颜色
        color: '#fff',
        // 辅助线颜色
        auxColor: 'yellow',
        // 坐标轴线宽
        width: 2,
    };
    // 圆的配置
    cycleConfig = {
        // 半径
        radius: 90,
        // 辅助线：十字
        auxColor: 'orange',
        // 圆的颜色
        color: '#FF7256',
    };
    // 角度
    angle: number = 0;
    // 速度
    speed: number = 0;

    sinLineArr: Point[] = [];


    constructor() {
    }

    ngOnInit() {
        this.context = this.canvasSinDom.nativeElement.getContext('2d');
    }

    ngAfterViewInit(): void {
        this.axisConfig.origin = new Point(240, this.canvasSinDom.nativeElement.height / 2);
        this.drawAxis(this.context, this.canvasSinDom.nativeElement);
        this.drawAux(this.context, this.canvasSinDom.nativeElement);
        this.render();
    }

    private render() {
        this.drawSin(this.context);
        window.requestAnimationFrame(this.render.bind(this));
    }



    private drawSin(context: CanvasRenderingContext2D) {
        this.drawAxis(this.context, this.canvasSinDom.nativeElement);
        this.drawAux(this.context, this.canvasSinDom.nativeElement);
        this.drawCycle(this.context, this.canvasSinDom.nativeElement);
        const radians = this.angle * Math.PI / 180;
        const x = this.axisConfig.origin.x  + this.angle;
        const y = this.axisConfig.origin.y - Math.sin(radians) * this.cycleConfig.radius;
        if (this.angle < 360) {
            this.sinLineArr.push(new Point(x, y));
            this.angle += 1;
        } else {
            if (this.sinLineArr.length) {
                this.sinLineArr.shift();
            } else {
                this.angle = 0;
            }
        }
        for (let i = 0; i < this.sinLineArr.length; i ++) {
            // 画出sin曲线轨迹
            context.beginPath();
            context.arc(this.sinLineArr[i].x, this.sinLineArr[i].y, 1, 0, 2 * Math.PI);
            context.fill();
            context.closePath();
        }
    }

    /**
     * 画出直角坐标系
     * @param context
     * @param canvas
     */
    private drawAxis(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        // 填充背景
        context.fillStyle = this.bgColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
        // 画出x轴和y轴
        context.beginPath();
        const xStart = new Point(this.axisConfig.origin.x, this.axisConfig.origin.y);
        const xEnd = new Point(xStart.x + this.axisConfig.xLen, xStart.y);
        const yStart = new Point(this.axisConfig.origin.x, this.axisConfig.origin.y - Math.floor(this.axisConfig.yLen / 2));
        const yEnd = new Point(this.axisConfig.origin.x, this.axisConfig.origin.y + Math.floor(this.axisConfig.yLen / 2));
        context.lineWidth = this.axisConfig.width;
        context.strokeStyle = this.axisConfig.color;
        context.moveTo(xStart.x, xStart.y);
        context.lineTo(xEnd.x, xEnd.y);
        context.moveTo(yStart.x, yStart.y);
        context.lineTo(yEnd.x, yEnd.y);
        context.stroke();
        context.closePath();
        // x轴和y轴的尖角
        // 将角度换算成弧度
        const radians = this.axisConfig.arrowAngle * Math.PI / 180;
        // 知道一个直角边和角度，来求另一个直角边的长度
        const deltaLen = this.axisConfig.arrowLen * Math.atan(radians);
        context.beginPath();
        context.fillStyle = this.axisConfig.color;
        context.lineWidth = this.axisConfig.width;
        context.moveTo(xEnd.x - this.axisConfig.arrowLen, xEnd.y - deltaLen);
        context.lineTo(xEnd.x, xEnd.y);
        context.lineTo(xEnd.x - this.axisConfig.arrowLen, xEnd.y + deltaLen);
        // y轴尖角
        context.moveTo(yStart.x - deltaLen, yStart.y + this.axisConfig.arrowLen);
        context.lineTo(yStart.x, yStart.y);
        context.lineTo(yStart.x + deltaLen, yStart.y + this.axisConfig.arrowLen);
        context.stroke();
        context.closePath();
    }

    /**
     * 画出辅助线
     * @param context
     * @param canvas
     */
    private drawAux(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        const dashArr = [90, 180, 270, 360];
        dashArr.forEach(item => {
            // 绘制刻度
            context.font = '16px serif';
            context.fillStyle = this.axisConfig.color;
            const text = item + '°';
            const metrics = context.measureText(text);
            context.fillText(text, this.axisConfig.origin.x + item - (metrics.width / 2), this.axisConfig.origin.y + 20);
            // 画出虚线，虚线的粒度控制为5
            const step = 5;
            const times = Math.floor(this.axisConfig.yLen / step);
            context.strokeStyle = this.axisConfig.auxColor;
            context.lineWidth = this.axisConfig.width;
            for (let i = 0; i <= times; i += 2) {
                context.moveTo(this.axisConfig.origin.x + item, this.axisConfig.origin.y - (this.axisConfig.yLen / 2) + (i - 1) * 5);
                context.lineTo(this.axisConfig.origin.x + item, this.axisConfig.origin.y - (this.axisConfig.yLen / 2) + i * 5);
            }

            context.stroke();
            context.closePath();
        })
    }

    private drawCycle(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        // 画出辅助线
        context.beginPath();
        context.strokeStyle = this.cycleConfig.auxColor;
        context.moveTo(this.axisConfig.origin.x - (this.cycleConfig.radius * 2), this.axisConfig.origin.y);
        context.lineTo(this.axisConfig.origin.x, this.axisConfig.origin.y);
        context.moveTo(this.axisConfig.origin.x - this.cycleConfig.radius, this.axisConfig.origin.y - this.cycleConfig.radius);
        context.lineTo(this.axisConfig.origin.x - this.cycleConfig.radius, this.axisConfig.origin.y + this.cycleConfig.radius);
        context.stroke();
        context.closePath();

        // 画圆
        context.beginPath();
        context.strokeStyle = this.cycleConfig.color;
        context.arc(this.axisConfig.origin.x - this.cycleConfig.radius, this.axisConfig.origin.y, this.cycleConfig.radius, 0, 2*Math.PI)
        context.stroke();
        context.closePath();
    }
}
