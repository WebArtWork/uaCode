import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { QuizComponent } from './quiz.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: QuizComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [QuizComponent]
})
export class QuizModule {}
