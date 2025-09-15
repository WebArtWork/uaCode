import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { CalendarModule } from 'src/app/core/modules/calendar/calendar.module';
import { CollapseModule } from 'src/app/core/modules/collapse/collapse.module';
import { FileModule } from 'src/app/core/modules/file/file.module';
import { FormModule } from 'src/app/core/modules/form/form.module';
import { ComponentsComponent } from './components.component';

const routes: Routes = [
	{
		path: '',
		component: ComponentsComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CoreModule,
		FileModule,
		CollapseModule,
		CalendarModule,
		FormModule
	],
	declarations: [ComponentsComponent],
	providers: []
})
export class ComponentsModule {}
