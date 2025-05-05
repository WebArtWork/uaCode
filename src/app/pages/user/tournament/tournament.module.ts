import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { TournamentComponent } from './tournament.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: 'private/:_id',
		component: TournamentComponent
	},
	{
		path: 'public/:_method',
		component: TournamentComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [TournamentComponent]
})
export class TournamentModule {}
