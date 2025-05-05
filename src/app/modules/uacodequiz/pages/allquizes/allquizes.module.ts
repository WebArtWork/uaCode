import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { AllquizesComponent } from './allquizes.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: AllquizesComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [AllquizesComponent],
	providers: []
})
export class AllquizesModule {}
