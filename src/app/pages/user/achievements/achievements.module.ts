import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { AchievementsComponent } from './achievements.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: AchievementsComponent
	},
	{
		path: 'class/:method',
		component: AchievementsComponent
	},
	{
		path: 'public/:method',
		component: AchievementsComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [AchievementsComponent]
})
export class AchievementsModule {}
