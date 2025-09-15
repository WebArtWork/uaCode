import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CollapseComponent } from './collapse.component';

@NgModule({
	imports: [CommonModule],
	declarations: [CollapseComponent],
	providers: [],
	exports: [CollapseComponent]
})
export class CollapseModule {}
