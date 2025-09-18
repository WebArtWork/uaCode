import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { MentorComponent } from './mentor.component';

const routes: Routes = [
	{
		path: '',
		component: MentorComponent
	}
];

@NgModule({
	declarations: [MentorComponent],
	imports: [RouterModule.forChild(routes), CoreModule]
})
export class MentorModule {}
