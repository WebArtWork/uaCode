import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'src/app/core/modules/button/button.module';
import { CardModule } from 'src/app/core/modules/card/card.module';
import { InputModule } from 'src/app/core/modules/input/input.module';
import { WacomModule } from 'wacom';
import { FormcomponentsModule } from './formcomponents/formcomponents.module';
import { IconsModule } from './icons/icons.module';
import { FormModule } from './modules/form/form.module';
import { SelectModule } from './modules/select/select.module';
import { TableModule } from './modules/table/table.module';
import { TranslateModule } from './modules/translate/translate.module';
/* imports */
import { ClassComponent } from './components/class/class.component';
import { ThemeComponent } from './components/theme/theme.component';

const components: Type<any>[] = [
	/* components */
	ThemeComponent,
	ClassComponent
];

const selectors: Type<any>[] = [
	/* selectors */
];

const pipes: Type<any>[] = [
	/* pipes */
];

@NgModule({
	declarations: components.concat(selectors).concat(pipes),
	exports: [
		TranslateModule,
		SelectModule,
		CommonModule,
		FormsModule,
		WacomModule,
		ButtonModule,
		InputModule,
		CardModule,
		FormModule,
		TableModule,
		IconsModule
	]
		.concat(components)
		.concat(selectors)
		.concat(pipes),
	imports: [
		FormcomponentsModule,
		SelectModule,
		CommonModule,
		FormsModule,
		WacomModule
	]
})
export class CoreModule {}
