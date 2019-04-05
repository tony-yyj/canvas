import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

enum RoleEnum {
    ONE, // 一起开始一起结束
    TWO,
}

@Component({
    selector: 'app-line',
    templateUrl: './line.component.html',
    styleUrls: ['./line.component.less']
})
export class LineComponent implements OnInit {

    role: number = RoleEnum.ONE;

    RoleEnum = RoleEnum;
    lineConfig = {
        lineWidth: 1,
        strokeStyle: 'rgba(255,206,41,.5)',
    };

    constructor() {
    }

    ngOnInit() {
    }
}
