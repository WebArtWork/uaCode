import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { ClassesComponent } from './classes.component';

const routes: Routes = [
	{
		path: '',
		component: ClassesComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [ClassesComponent],
	providers: []
})
export class ClassesModule {}
