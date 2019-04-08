import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeroComponent} from './hero/hero.component';
import {RouterModule, Routes} from "@angular/router";

const router: Routes = [
    {
        path: 'hero',
        component: HeroComponent,
    },
    {
        path: '',
        redirectTo: 'hero',
        pathMatch: 'full',
    }
];

@NgModule({
    declarations: [HeroComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(router),
    ]
})
export class CssModule {
}
