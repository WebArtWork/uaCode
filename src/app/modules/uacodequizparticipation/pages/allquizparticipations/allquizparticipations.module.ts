import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { AllquizparticipationsComponent } from './allquizparticipations.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: AllquizparticipationsComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [AllquizparticipationsComponent],
	providers: []
})
export class AllquizparticipationsModule {}
