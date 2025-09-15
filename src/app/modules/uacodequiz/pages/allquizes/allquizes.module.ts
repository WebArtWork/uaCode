import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { AllquizesComponent } from './allquizes.component';

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
