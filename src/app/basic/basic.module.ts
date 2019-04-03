import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LineComponent} from './line/line.component';
import {RouterModule, Routes} from "@angular/router";

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
    declarations: [LineComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(router),
    ]
})
export class BasicModule {
}
