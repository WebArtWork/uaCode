import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { TournamentsComponent } from './tournaments.component';

const routes: Routes = [
	{
		path: '',
		component: TournamentsComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [TournamentsComponent]
})
export class TournamentsModule {}
