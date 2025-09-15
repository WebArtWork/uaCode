import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { TournamentComponent } from './tournament.component';

const routes: Routes = [
	{
		path: 'class/:_method',
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
