import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { QuizzesComponent } from './quizzes.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: QuizzesComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [QuizzesComponent]
})
export class QuizzesModule {}
