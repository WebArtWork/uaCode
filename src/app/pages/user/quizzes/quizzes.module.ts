import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { QuizzesComponent } from './quizzes.component';

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
