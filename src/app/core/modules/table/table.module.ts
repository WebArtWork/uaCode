import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WacomModule } from 'wacom';
import { ButtonModule } from '../button/button.module';
import { FormModule } from '../form/form.module';
import { InputModule } from '../input/input.module';
import { TranslateModule } from '../translate/translate.module';
import { PerPagePipe } from './per-page.pipe';
import { TableComponent } from './table.component';
import {
	ActionsDirective,
	CellDirective,
	CustomEditDirective,
	SortDirective
} from './table.directive';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		WacomModule,
		FormModule,
		ButtonModule,
		RouterModule,
		InputModule,
		TranslateModule
	],
	declarations: [
		TableComponent,
		CellDirective,
		SortDirective,
		ActionsDirective,
		CustomEditDirective,
		PerPagePipe
	],
	providers: [],
	exports: [
		TableComponent,
		CellDirective,
		SortDirective,
		ActionsDirective,
		CustomEditDirective
	]
})
export class TableModule {}
