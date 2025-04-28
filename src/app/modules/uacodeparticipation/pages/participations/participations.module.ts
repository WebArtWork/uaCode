import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { ParticipationsComponent } from './participations.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: ParticipationsComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [ParticipationsComponent],
	providers: []
})
export class ParticipationsModule {}
