import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LineComponent} from './line/line.component';
import {RouterModule, Routes} from "@angular/router";
import {BezierOneComponent,} from "./line/some-line/bezier-one.component";
import {FormsModule} from "@angular/forms";

const router: Routes = [
    {
        path: '',
        redirectTo: 'line',
        pathMatch: 'full',
    },
    {
        path: 'line',
        component: LineComponent,
    },
];

@NgModule({
    declarations: [
        LineComponent,
        BezierOneComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(router),
        FormsModule,
    ]
})
export class BasicModule {
}
