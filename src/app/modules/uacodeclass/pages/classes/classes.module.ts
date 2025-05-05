import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { ClassesComponent } from './classes.component';
import { Routes, RouterModule } from '@angular/router';

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
