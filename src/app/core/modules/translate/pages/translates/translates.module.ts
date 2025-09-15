import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'src/app/core/modules/button/button.module';
import { SelectModule } from 'src/app/core/modules/select/select.module';
import { TableModule } from 'src/app/core/modules/table/table.module';
import { WacomModule } from 'wacom';
import { TranslateModule } from '../../translate.module';
import { TranslatesComponent } from './translates.component';

const routes: Routes = [
	{
		path: '',
		component: TranslatesComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		TranslateModule,
		CommonModule,
		ButtonModule,
		FormsModule,
		TableModule,
		WacomModule,
		SelectModule
	],
	declarations: [TranslatesComponent],
	providers: []
})
export class TranslatesModule {}
