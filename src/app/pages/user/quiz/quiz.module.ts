import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { QuizComponent } from './quiz.component';

const routes: Routes = [
	{
		path: ':_id',
		component: QuizComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [QuizComponent]
})
export class QuizModule {}
